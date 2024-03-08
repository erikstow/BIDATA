const express = require("express");
const bodyParser = require("body-parser");
const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");
const app = express();
const port = 3000;

const frontendPath = path.join(__dirname, "..", "frontend");

app.use(bodyParser.text({ type: "text/plain" }));

app.post("/run", (req, res) => {
  const code = req.body;
  const tmpFileName = path.join(__dirname, "main.cpp");

  fs.writeFileSync(tmpFileName, code);

  const runCommand = `docker run --rm -v ${__dirname}:/usr/src/myapp gcc:latest sh -c "g++ /usr/src/myapp/main.cpp -o /usr/src/myapp/a.out && /usr/src/myapp/a.out"`;

  exec(runCommand, (error, stdout, stderr) => {
    fs.unlinkSync(tmpFileName); 
    if (error) {
      console.error(`exec error: ${error}`);
      return res.status(500).send(stderr);
    }
    res.send(stdout);
  });
});

app.use(express.static(frontendPath));

app.get("*", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

app.listen(port, () =>
  console.log(`Server kjører på http://localhost:${port}`)
);
