#include <iostream>
#include <sys/socket.h>
#include <netinet/in.h>
#include <arpa/inet.h>
#include <unistd.h>
#include <cstring>
#include <regex>

int main() {
    std::regex validFormat("^\\d+[-+*/]\\d+$");

    int clientSocket = socket(AF_INET, SOCK_STREAM, 0);
    if (clientSocket < 0) {
        std::cerr << "Kunne ikke opprette socket\n";
        return -1;
    }

    struct sockaddr_in serverAddr;
    memset(&serverAddr, 0, sizeof(serverAddr));
    serverAddr.sin_family = AF_INET;
    serverAddr.sin_port = htons(12345);
    serverAddr.sin_addr.s_addr = inet_addr("127.0.0.1");

    if (connect(clientSocket, (struct sockaddr *)&serverAddr, sizeof(serverAddr)) < 0) {
        std::cerr << "Kunne ikke koble til serveren\n";
        close(clientSocket);
        return -1;
    }

    std::string input;
    char buffer[1024] = {0};

    while (true) {
        std::cout << "Skriv inn regnestykket (format: num1+num2 eller num1-num2) eller 'avslutt' for å avslutte: ";
        std::getline(std::cin, input);

        if (input == "avslutt") {
        send(clientSocket, input.c_str(), input.size() + 1, 0); // Informer serveren om avslutning
        break;
        }


        if (!std::regex_match(input, validFormat)) {
            std::cout << "Ugyldig format. Prøv igjen.\n";
            continue;
        }

        send(clientSocket, input.c_str(), input.size() + 1, 0);
        memset(buffer, 0, sizeof(buffer));
        ssize_t bytesRead = read(clientSocket, buffer, sizeof(buffer) - 1);
        if (bytesRead > 0) {
            std::cout << "Fra server: " << buffer << std::endl;
        } else if (bytesRead == 0) {
            std::cout << "Serveren har lukket forbindelsen." << std::endl;
            break;
        } else {
            std::cerr << "Feil ved mottak av data." << std::endl;
            break;
        }
    }

    close(clientSocket);
    return 0;
}
