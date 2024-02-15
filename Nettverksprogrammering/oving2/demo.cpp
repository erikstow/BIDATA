#include "workers.h"
#include <iostream>
#include <functional>
#include <mutex>

std::mutex cout_mutex;

void sampleTask(int taskID) {
    {
        std::lock_guard<std::mutex> lock(cout_mutex);
        std::cout << "Oppgave " << taskID << " startet på tråd: " << std::this_thread::get_id() << std::endl;
    }
    
    std::this_thread::sleep_for(std::chrono::seconds(1)); // Simulerer arbeid
    
    {
        std::lock_guard<std::mutex> lock(cout_mutex);
        std::cout << "Oppgave " << taskID << " fullført på tråd: " << std::this_thread::get_id() << std::endl;
    }
}

int main() {
    Workers workerPool(4); // Opprett en pool med 4 worker-tråder

    // Legg til oppgaver til worker pool
    for (int i = 0; i < 8; ++i) {
        workerPool.post(std::bind(sampleTask, i + 1)); //  tildele en unik ID til hver oppgave
    }

    // Vent til alle oppgaver er lagt til i køen
    std::this_thread::sleep_for(std::chrono::seconds(1));
    
    workerPool.stop(); // Signaliser til worker pool at den skal stoppe etter at alle oppgaver er utført
    
}
