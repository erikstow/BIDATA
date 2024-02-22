#include "workers.h"
#include <iostream>
#include <chrono>
#include <functional>

Workers::Workers(int num_threads) : should_stop(false) {
    // Initialize the threads in the thread pool
    for (int i = 0; i < num_threads; ++i) {
        threads.emplace_back([this] {
            while (true) {
                std::function<void()> task;
                {
                    std::unique_lock<std::mutex> lock(queue_mutex);
                    condition.wait(lock, [this] {
                        return should_stop || !tasks.empty();
                    });
                    if (should_stop && tasks.empty()) {
                        return;
                    }
                    task = std::move(tasks.front());
                    tasks.pop();
                }
                task();
            }
        });
    }
}

void Workers::post(const std::function<void()>& task) {
    {
        std::unique_lock<std::mutex> lock(queue_mutex);
        tasks.emplace(task);
    }
    condition.notify_one();
}

void Workers::stop() {
    {
        std::unique_lock<std::mutex> lock(queue_mutex);
        should_stop = true;
    }
    condition.notify_all();
}

Workers::~Workers() {
    stop(); // Stop all finished threads before joining them

    for (std::thread &worker : threads) {
        if (worker.joinable()) {
            worker.join();
        }
    }
}