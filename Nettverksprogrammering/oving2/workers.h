// workers.h
#ifndef WORKERS_H
#define WORKERS_H

#include <thread>
#include <vector>
#include <functional>
#include <queue>
#include <mutex>
#include <condition_variable>

class Workers {

// workers.h (Inside the Workers class definition)
private:
    std::vector<std::thread> threads;
    std::queue<std::function<void()>> tasks;
    std::mutex queue_mutex;
    std::condition_variable condition;
    bool should_stop;


public:
    // Constructor
    Workers(int num_threads);

    // Destructor
    ~Workers();

    // Method to submit a task to the workers
    void post(const std::function<void()>& task);

    // Method to stop the workers
    void stop();

    // Your other public member methods here
};

#endif // WORKERS_H
