import http from 'k6/http';
import { check, sleep } from 'k6';
import { Trend, Rate, Counter } from 'k6/metrics';

const responseTimeTrend = new Trend('books_api_response_time', true);
const successRate = new Rate('books_api_success_rate');
const errorRate = new Rate('books_api_error_rate');
const requestCounter = new Counter('books_api_requests');

export const options = {
  stages: [
    { duration: '30s', target: 10 },  
    { duration: '1m', target: 30 }, 
    { duration: '30s', target: 50 },  
    { duration: '1m', target: 50 }, 
    { duration: '30s', target: 0 },   
  ],
  thresholds: {
    http_req_duration: ['p(95)<1000'], 
    http_req_failed: ['rate<0.01'],   
  },
  ext: {
    loadimpact: {
      projectID: 1,
      name: 'Library Management System - Books API Performance Test'
    }
  }
};

const BASE_URL = 'http://localhost:3000/api/books';

const testBooks = [
  { title: 'Book 1', author: 'Author 1', category_id: 1 },
  { title: 'Book 2', author: 'Author 2', category_id: 2 },
  { title: 'Book 3', author: 'Author 3', category_id: 1 }
];

function getRandomBook() {
  return testBooks[Math.floor(Math.random() * testBooks.length)];
}

function generateRandomBook() {
  const categories = [1, 2, 3, 4, 5];
  const randomId = Math.floor(Math.random() * 1000);
  return {
    title: `Test Book ${randomId}`,
    author: `Author ${Math.floor(randomId / 10)}`,
    category_id: categories[Math.floor(Math.random() * categories.length)],
    publication_year: 2000 + Math.floor(Math.random() * 20),
    stock_quantity: Math.floor(Math.random() * 50) + 1
  };
}

export default function () {
  const endpoint = Math.random();

  if (endpoint < 0.5) {
    testGetBooks();
  } else if (endpoint < 0.8) {
    testGetBookById();
  } else {
    testCreateBook();
  }

  sleep(Math.random() * 3 + 1);
}

function testGetBooks() {
  const url = `${BASE_URL}`;

  const startTime = new Date().getTime();
  const response = http.get(url);
  const endTime = new Date().getTime();

  responseTimeTrend.add(endTime - startTime);
  requestCounter.add(1);

  const success = check(response, {
    'GET /books status is 200': (r) => r.status === 200,
    'GET /books has success true': (r) => r.json().success === true,
    'GET /books has data array': (r) => Array.isArray(r.json().data),
  });

  successRate.add(success);
  errorRate.add(!success);

  if (!success) {
    console.log(`GET /books failed: ${response.status} - ${response.body}`);
  }
}

function testGetBookById() {
  const bookId = Math.floor(Math.random() * 100) + 1;
  const url = `${BASE_URL}/${bookId}`;

  const startTime = new Date().getTime();
  const response = http.get(url);
  const endTime = new Date().getTime();

  responseTimeTrend.add(endTime - startTime);
  requestCounter.add(1);

  const success = check(response, {
    'GET /books/:id status is 200 or 404': (r) => r.status === 200 || r.status === 404,
    'GET /books/:id has success boolean': (r) => typeof r.json().success === 'boolean',
  });

  successRate.add(success);
  errorRate.add(!success);

  if (!success && response.status !== 404) {
    console.log(`GET /books/${bookId} failed: ${response.status} - ${response.body}`);
  }
}

function testCreateBook() {
  const newBook = generateRandomBook();
  const url = `${BASE_URL}`;

  const payload = JSON.stringify(newBook);

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const startTime = new Date().getTime();
  const response = http.post(url, payload, params);
  const endTime = new Date().getTime();

  responseTimeTrend.add(endTime - startTime);
  requestCounter.add(1);

  const success = check(response, {
    'POST /books status is 201': (r) => r.status === 201,
    'POST /books has success true': (r) => r.json().success === true,
    'POST /books has book data': (r) => r.json().data && r.json().data.book_id,
  });

  successRate.add(success);
  errorRate.add(!success);

  if (!success) {
    console.log(`POST /books failed: ${response.status} - ${response.body}`);
  }
}

export function handleSummary(data) {
  return {
    'stdout': JSON.stringify(data, null, 2),
    '__Test__/Performance/k6_books_performance_results.json': JSON.stringify(data, null, 2),
  };
}