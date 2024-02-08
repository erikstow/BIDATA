// workers.cpp
#include "workers.h"



Workers::Workers(int num_threads) : should_stop(false) {
    // Initialize the threads in the thread pool
    for (int i = 0; i < num_threads; ++i) {
        threads.push_back(std::thread([this] {
            // This is the worker function, it will be the body of your thread
            // We will define this later
        }));
    }
}


Workers::~Workers() {
    // Signal all threads to stop
    should_stop = true;
    condition.notify_all(); // This will wake up all threads

    // Join all threads
    for (std::thread &worker : threads) {
        if (worker.joinable()) {
            worker.join();
        }
    }
}


void Workers::post(const std::function<void()>& task) {
    // post method implementation
}

void Workers::stop() {
    // stop method implementation
}

// Any other member methods implementation
