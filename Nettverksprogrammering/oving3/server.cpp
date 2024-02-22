#include <iostream>
#include <sys/socket.h>
#include <netinet/in.h>
#include <unistd.h>
#include <thread>
#include <cstring>
#include <sstream>
#include "../oving2/workers.h"

void handleClient(int clientSocket) {
    while (true) {
        char buffer[1024] = {0};  // Initialize buffer to zero

        // Read the operation and numbers from the client
        ssize_t bytes_read = read(clientSocket, buffer, sizeof(buffer) - 1);
        if (bytes_read <= 0) {
            std::cerr << "Feil ved lesing fra klient eller forbindelsen er lukket\n";
            break;  // Avslutt løkken hvis det er en feil eller forbindelsen er lukket
        }

        std::string input(buffer);
        if (input == "avslutt") {
            std::cout << "Avslutter forbindelsen med klienten på forespørsel.\n";
            break;  // Avslutt løkken hvis klienten sender "avslutt"
        }

        std::istringstream iss(input);
        int num1, num2, result = 0;
        char operation;
        iss >> num1 >> operation >> num2;

        // Perform the calculation
        switch (operation) {
            case '+': result = num1 + num2; break;
            case '-': result = num1 - num2; break;
            case '*': result = num1 * num2; break;
            case '/':
                if (num2 == 0) {
                    std::string errorMsg = "Feil: Kan ikke dele med null\n";
                    send(clientSocket, errorMsg.c_str(), errorMsg.size() + 1, 0);
                    continue;  // Fortsett å lytte etter nye forespørsler
                } else {
                    result = num1 / num2;
                }
                break;
            default:
                std::string errorMsg = "Ugyldig operasjon\n";
                send(clientSocket, errorMsg.c_str(), errorMsg.size() + 1, 0);
                continue;  // Fortsett å lytte etter nye forespørsler
        }

        // Send the result back to the client
        std::string resultMsg = "Resultat: " + std::to_string(result) + "\n";
        send(clientSocket, resultMsg.c_str(), resultMsg.size() + 1, 0);
    }

    // Close the connection after the loop ends
    close(clientSocket);
}

int main() {
    int serverSocket = socket(AF_INET, SOCK_STREAM, 0);
    struct sockaddr_in serverAddr;

    serverAddr.sin_family = AF_INET;
    serverAddr.sin_port = htons(12345);
    serverAddr.sin_addr.s_addr = INADDR_ANY;

    bind(serverSocket, (struct sockaddr *)&serverAddr, sizeof(serverAddr));
    listen(serverSocket, 5);

    // Anta at Workers-klassen er definert i "workers.h"
    Workers workers(4); // Opprett en trådpool med 4 tråder

    std::cout << "Serveren kjører og venter på forbindelser...\n";

    while (true) {
        int clientSocket = accept(serverSocket, NULL, NULL);
        if (clientSocket < 0) {
            std::cerr << "Feil ved aksept av klient\n";
            continue;
        }

        workers.post([clientSocket] {
            handleClient(clientSocket);
        });
    }

    // Trådpoolen vil automatisk rydde opp tråder i sin destruktor
    return 0;
}