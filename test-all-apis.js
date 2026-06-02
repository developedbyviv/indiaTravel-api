const http = require('http');

const API_URL = 'http://localhost:5000/api';

async function fetchJSON(url, options = {}) {
  try {
    const response = await fetch(url, options);
    const data = await response.json();
    return { status: response.status, data };
  } catch (error) {
    return { error: error.message };
  }
}

async function testAll() {
  console.log("=== API Test Results ===\n");

  // 1. GET /api/tours
  let res = await fetchJSON(`${API_URL}/tours`);
  console.log("1. GET /api/tours");
  console.log(`Status: ${res.status}`);
  if (res.data && res.data.data && res.data.data.length > 0) {
    console.log(`Result: Success (${res.data.data.length} tours found)`);
  } else {
    console.log("Result: Failed/Empty");
    console.log("Response:", JSON.stringify(res.data));
  }
  console.log("------------------------");

  // 2. GET /api/tours?category=handpicked
  res = await fetchJSON(`${API_URL}/tours?category=handpicked`);
  console.log("2. GET /api/tours?category=handpicked");
  console.log(`Status: ${res.status}`);
  if (res.data && res.data.data && res.data.data.length > 0) {
    console.log(`Result: Success (${res.data.data.length} handpicked tours found)`);
  } else {
    console.log("Result: Failed/Empty");
  }
  console.log("------------------------");

  let tourId = null;
  if (res.data && res.data.data && res.data.data.length > 0) tourId = res.data.data[0]._id;

  // 3. GET /api/tours/:id
  if (tourId) {
    res = await fetchJSON(`${API_URL}/tours/${tourId}`);
    console.log(`3. GET /api/tours/${tourId}`);
    console.log(`Status: ${res.status}`);
    if (res.data && res.data.data && res.data.data.title) {
        console.log(`Result: Success (Found: ${res.data.data.title})`);
    } else {
        console.log("Result: Failed");
    }
    console.log("------------------------");
  } else {
    console.log("3. GET /api/tours/:id -> Skipped (No tour ID)");
    console.log("------------------------");
  }

  // 4. GET /api/blogs
  res = await fetchJSON(`${API_URL}/blogs`);
  console.log("4. GET /api/blogs");
  console.log(`Status: ${res.status}`);
  if (res.data && res.data.data && res.data.data.length > 0) {
    console.log(`Result: Success (${res.data.data.length} blogs found)`);
  } else {
    console.log("Result: Failed/Empty");
  }
  console.log("------------------------");

  let slug = null;
  if (res.data && res.data.data && res.data.data.length > 0) slug = res.data.data[0].slug;

  // 5. GET /api/blogs/:slug
  if (slug) {
    res = await fetchJSON(`${API_URL}/blogs/${slug}`);
    console.log(`5. GET /api/blogs/${slug}`);
    console.log(`Status: ${res.status}`);
    if (res.data && res.data.data && res.data.data.title) {
        console.log(`Result: Success (Found: ${res.data.data.title})`);
    } else {
        console.log("Result: Failed");
    }
    console.log("------------------------");
  } else {
    console.log("5. GET /api/blogs/:slug -> Skipped (No blog slug)");
    console.log("------------------------");
  }

  // 6. POST /api/enquiries
  const enquiryPayload = {
    tourId: tourId || "1", // Pass string tourId
    selections: {
      transport: "SUV",
      dining: "veg",
      hotelCategory: "premium",
      additionalPlaces: ["Hawa mahal"]
    },
    traveller: {
      fullName: "Test User",
      email: "test@example.com",
      phone: "1234567890",
      startDate: "12 - Dec - 2026"
    }
  };
  res = await fetchJSON(`${API_URL}/enquiries`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(enquiryPayload)
  });
  console.log("6. POST /api/enquiries");
  console.log(`Status: ${res.status}`);
  if (res.status === 201) {
    console.log(`Result: Success (Enquiry created with ID: ${res.data.data._id})`);
  } else {
    console.log(`Result: Failed -> ${JSON.stringify(res.data)}`);
  }
  console.log("------------------------");
}

testAll();
