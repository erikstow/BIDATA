#include <iostream>
#include <sys/socket.h>
#include <netinet/in.h>
#include <unistd.h>
#include <sstream>

int main() {
    // Opprett server socket
    int serverSocket = socket(AF_INET, SOCK_STREAM, 0);
    if (serverSocket == -1) {
        std::cerr << "Kunne ikke opprette socket." << std::endl;
        return -1;
    }

    // Definer serveradresse
    struct sockaddr_in serverAddr;
    serverAddr.sin_family = AF_INET;
    serverAddr.sin_port = htons(8080); // Bruker port 8080
    serverAddr.sin_addr.s_addr = INADDR_ANY;

    // Bind socket til IP-adressen og porten
    if (bind(serverSocket, (struct sockaddr *)&serverAddr, sizeof(serverAddr)) == -1) {
        std::cerr << "Kunne ikke binde til port." << std::endl;
        return -1;
    }

    // Lytt på porten
    if (listen(serverSocket, 10) == -1) {
        std::cerr << "Kunne ikke lytte på port." << std::endl;
        return -1;
    }

    std::cout << "Webserver kjører på http://localhost:8080" << std::endl;

    // Hovedløkke for å akseptere klientforbindelser
    while (true) {
        int clientSocket = accept(serverSocket, nullptr, nullptr);
        if (clientSocket == -1) {
            std::cerr << "Kunne ikke akseptere klientforbindelse." << std::endl;
            continue;
        }

        // Les forespørselen fra klienten
        char buffer[4096];
        ssize_t bytes_read = read(clientSocket, buffer, sizeof(buffer) - 1);
        if (bytes_read <= 0) {
            std::cerr << "Feil ved lesing fra klient." << std::endl;
            close(clientSocket);
            continue;
        }
        buffer[bytes_read] = '\0'; // Null-terminer bufferen

        // Generer og send responsen
        std::ostringstream response;
        response << "HTTP/1.1 200 OK\r\nContent-Type: text/html; charset=utf-8\r\n\r\n";
        response << "<html><body><h1>Hilsen fra min enkle web-tjener</h1>";
        response << "<h2>Header fra klient:</h2><ul>";

        std::istringstream request(buffer);
        std::string header_line;
        while (std::getline(request, header_line) && header_line != "\r") {
            response << "<li>" << header_line << "</li>";
        }
        response << "</ul></body></html>";

        // Send responsen
        std::string response_str = response.str();
        send(clientSocket, response_str.c_str(), response_str.length(), 0);

        // Lukk klientforbindelsen
        close(clientSocket);
    }

    // Lukk server socket
    close(serverSocket);

    return 0;
}
