import http from 'k6/http';
import { check, sleep } from 'k6';
import { Trend, Rate, Counter } from 'k6/metrics';

const responseTimeTrend = new Trend('user_api_response_time', true);
const successRate = new Rate('user_api_success_rate');
const errorRate = new Rate('user_api_error_rate');
const requestCounter = new Counter('user_api_requests');

export const options = {
  stages: [
    { duration: '30s', target: 20 },  
    { duration: '1m', target: 50 },   
    { duration: '30s', target: 100 }, 
    { duration: '1m', target: 100 }, 
    { duration: '30s', target: 0 },   
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'],  
    http_req_failed: ['rate<0.01'],  
  },
  ext: {
    loadimpact: {
      projectID: 1,
      name: 'Library Management System - User API Performance Test'
    }
  }
};

const BASE_URL = 'http://localhost:3000/api';

const testUsers = [
  { email: 'user1@example.com', password: 'password123' },
  { email: 'user2@example.com', password: 'password123' },
  { email: 'user3@example.com', password: 'password123' }
];

function getRandomUser() {
  return testUsers[Math.floor(Math.random() * testUsers.length)];
}

function generateRandomUser() {
  const randomId = Math.floor(Math.random() * 10000);
  return {
    username: `testuser${randomId}`,
    email: `testuser${randomId}@example.com`,
    password: 'testpassword123',
    role: 'Member'
  };
}

export default function () {
  const endpoint = Math.random();

  if (endpoint < 0.4) {
    testGetUsers();
  } else if (endpoint < 0.7) {
    testUserLogin();
  } else if (endpoint < 0.9) {
    testCreateUser();
  } else {
    testGetUserById();
  }

  sleep(Math.random() * 2 + 1);
}

function testGetUsers() {
  const url = `${BASE_URL}/users`;

  const startTime = new Date().getTime();
  const response = http.get(url);
  const endTime = new Date().getTime();
  responseTimeTrend.add(endTime - startTime);
  requestCounter.add(1);

  const success = check(response, {
    'GET /users status is 200': (r) => r.status === 200,
    'GET /users has success true': (r) => r.json().success === true,
    'GET /users has data array': (r) => Array.isArray(r.json().data),
  });

  successRate.add(success);
  errorRate.add(!success);

  if (!success) {
    console.log(`GET /users failed: ${response.status} - ${response.body}`);
  }
}

function testUserLogin() {
  const user = getRandomUser();
  const url = `${BASE_URL}/login`;

  const payload = JSON.stringify({
    email: user.email,
    password: user.password
  });

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
    'POST /login status is 201': (r) => r.status === 201,
    'POST /login has success true': (r) => r.json().success === true,
    'POST /login has token': (r) => r.json().data && r.json().data.token,
  });

  successRate.add(success);
  errorRate.add(!success);

  if (!success) {
    console.log(`POST /login failed: ${response.status} - ${response.body}`);
  }
}

function testCreateUser() {
  const newUser = generateRandomUser();
  const url = `${BASE_URL}/users`;

  const payload = JSON.stringify(newUser);

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
    'POST /users status is 201': (r) => r.status === 201,
    'POST /users has success true': (r) => r.json().success === true,
    'POST /users has user data': (r) => r.json().registered && r.json().registered.user_id,
  });

  successRate.add(success);
  errorRate.add(!success);

  if (!success) {
    console.log(`POST /users failed: ${response.status} - ${response.body}`);
  }
}

function testGetUserById() {
  const userId = Math.floor(Math.random() * 100) + 1;
  const url = `${BASE_URL}/users/${userId}`;

  const startTime = new Date().getTime();
  const response = http.get(url);
  const endTime = new Date().getTime();

  responseTimeTrend.add(endTime - startTime);
  requestCounter.add(1);

  const success = check(response, {
    'GET /users/:id status is 200 or 404': (r) => r.status === 200 || r.status === 404,
    'GET /users/:id has success boolean': (r) => typeof r.json().success === 'boolean',
  });

  successRate.add(success);
  errorRate.add(!success);

  if (!success && response.status !== 404) {
    console.log(`GET /users/${userId} failed: ${response.status} - ${response.body}`);
  }
}

export function handleSummary(data) {
  return {
    'stdout': JSON.stringify(data, null, 2),
    '__Test__/Performance/k6_user_performance_results.json': JSON.stringify(data, null, 2),
  };
}