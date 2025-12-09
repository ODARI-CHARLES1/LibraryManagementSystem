# Performance Testing with k6

This directory contains performance tests for the Library Management System using [k6](https://k6.io/), an open-source load testing tool.

## Available Tests

### 1. User API Performance Test (`k6_user_performance.js`)
Tests the performance of user-related endpoints:
- `GET /api/users` - Get all users
- `POST /api/login` - User login
- `POST /api/users` - Create new user
- `GET /api/users/:id` - Get user by ID

### 2. Books API Performance Test (`k6_books_performance.js`)
Tests the performance of book-related endpoints:
- `GET /api/books` - Get all books
- `GET /api/books/:id` - Get book by ID
- `POST /api/books` - Create new book

## Prerequisites

1. Install k6: https://k6.io/docs/get-started/installation/
2. Ensure your Library Management System is running (`npm start`)
3. The tests assume the API is running on `http://localhost:3000`

## Running the Tests

### Run User API Performance Test
```bash
k6 run __Test__/Performance/k6_user_performance.js
```

### Run Books API Performance Test
```bash
k6 run __Test__/Performance/k6_books_performance.js
```

### Run Both Tests in Parallel
```bash
k6 run __Test__/Performance/k6_user_performance.js & k6 run __Test__/Performance/k6_books_performance.js
```

## Test Configuration

Both tests use a staged load pattern:
1. **Ramp-up phase**: Gradually increase load
2. **Sustained load phase**: Maintain peak load
3. **Ramp-down phase**: Gradually decrease load

### Performance Thresholds
- **Response Time**: 95% of requests should complete in under 500ms (users) or 1000ms (books)
- **Error Rate**: Less than 1% of requests should fail

## Results Interpretation

After running the tests, you'll see detailed metrics including:
- **Request duration**: Average, median, and percentile response times
- **Throughput**: Requests per second
- **Error rates**: Percentage of failed requests
- **Data transferred**: Total data sent/received

Results are also saved to JSON files:
- `k6_user_performance_results.json`
- `k6_books_performance_results.json`

## Customizing Tests

You can modify the test configuration by editing the `options` object in each test file:

```javascript
export const options = {
  stages: [
    { duration: '30s', target: 20 },  // Adjust ramp-up
    { duration: '1m', target: 50 },   // Adjust sustained load
    { duration: '30s', target: 0 },   // Adjust ramp-down
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'],  // Adjust response time thresholds
    http_req_failed: ['rate<0.01'],    // Adjust error rate thresholds
  }
};
```

## Best Practices

1. **Run tests in a staging environment** first before testing production
2. **Monitor your server resources** during load testing
3. **Start with lower load** and gradually increase to find your system's limits
4. **Run multiple iterations** to get consistent results
5. **Compare results** over time to track performance improvements/regressions

## Troubleshooting

- **Connection errors**: Ensure your API server is running and accessible
- **High error rates**: Check if your test data matches expected API formats
- **Slow response times**: May indicate database bottlenecks or server resource constraints