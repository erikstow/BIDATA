const net = require('net');
const crypto = require('crypto');

const httpServer = net.createServer((connection) => {
  connection.on('data', () => {
    let content = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>WebSocket Test</title>
</head>
<body>
  WebSocket test page
  <input id="messageInput" type="text" placeholder="Write message"/>
  <button onclick="sendMessage()">Send</button>
  <div id="messages"></div>
  <script>
    let ws = new WebSocket('ws://localhost:3001');
    ws.onmessage = event => {
      const messages = document.getElementById('messages');
      const message = document.createElement('p');
      message.textContent = 'Message from server: ' + event.data;
      messages.appendChild(message);
    };
    ws.onopen = () => console.log('Connected to the WebSocket server');

    function sendMessage() {
      const input = document.getElementById('messageInput');
      ws.send(input.value);
      input.value = ''; // Clear input field
    }
  </script>
</body>
</html>
`;
    connection.write('HTTP/1.1 200 OK\r\nContent-Length: ' + content.length + '\r\n\r\n' + content);
  });
});

httpServer.listen(3000, () => {
  console.log('HTTP server listening on port 3000');
});

const clients = new Set(); // Holder styr på tilkoblede klienter

const wsServer = net.createServer((socket) => {
  console.log('Client connected');
  clients.add(socket);

  socket.on('data', (data) => {
    if (data.toString().includes('Upgrade: websocket')) {
      // Håndterer WebSocket-handshake
      const key = data.toString().match(/Sec-WebSocket-Key: (\S+)/)[1];
      const acceptKey = generateAcceptKey(key);

      const responseHeaders = [
        'HTTP/1.1 101 Switching Protocols',
        'Upgrade: websocket',
        'Connection: Upgrade',
        `Sec-WebSocket-Accept: ${acceptKey}`,
      ];

      socket.write(responseHeaders.join('\r\n') + '\r\n\r\n');
    } else {
      // parser for WebSocket-rammer og sender meldinger til alle tilkoblede klienter
      const message = parseWebSocketFrame(data);
      broadcastMessage(message, socket);
    }
  });

  socket.on('end', () => {
    console.log('Client disconnected');
    clients.delete(socket);
  });
});

wsServer.on('error', (error) => {
  console.error('Error: ', error);
});

wsServer.listen(3001, () => {
  console.log('WebSocket server listening on port 3001');
});

function generateAcceptKey(key) {
  return crypto.createHash('sha1')
               .update(key + '258EAFA5-E914-47DA-95CA-C5AB0DC85B11', 'binary')
               .digest('base64');
}

function parseWebSocketFrame(data) {
  let offset = 2; // Start etter finne og opkode
  const isMasked = data[1] & 0x80;
  let payloadLength = data[1] & 0x7F;

  if (payloadLength === 126) {
    offset += 2; // Ekstra bytes for 16-bit lengde
  } else if (payloadLength === 127) {
    offset += 8; // Ekstra bytes for 64-bit lengde
  }

  let maskingKey;
  if (isMasked) {
    maskingKey = data.slice(offset, offset + 4);
    offset += 4; // Flytt til data delen
  }

  const payloadData = data.slice(offset, offset + payloadLength);

  if (isMasked) {
    for (let i = 0; i < payloadData.length; i++) {
      payloadData[i] ^= maskingKey[i % 4];
    }
  }

  console.log(`Message received: ${payloadData.toString()}`);
  return payloadData.toString();
}


function broadcastMessage(message, senderSocket) {
  clients.forEach(client => {
    if (client !== senderSocket) {
      console.log(`Broadcasting message: ${message}`);
      client.write(constructWebSocketFrame(message));
    }
  });
}

function constructWebSocketFrame(message) {
  // Enkel konstruksjon av en tekstframe
  const frame = Buffer.alloc(2 + message.length);
  frame[0] = 0x81; // FIN bit
  frame[1] = message.length; // meldingen <  126 byte
  frame.write(message, 2);
  return frame;
}
