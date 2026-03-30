# 🌦️ Weather API with Redis Caching

A simple and scalable **Weather API** built using **Node.js, Express, Axios, and Redis**.
This API fetches real-time weather data from a 3rd party provider and caches responses to improve performance and reduce external API calls.

---

## 🚀 Features

* 🌍 Fetch real-time weather data from a 3rd party API
* ⚡ Redis caching for faster responses
* ⏳ Automatic cache expiration (TTL)
* 🔐 Environment variables for secure configuration
* 🚫 Rate limiting to prevent abuse
* ❌ Proper error handling for API failures

---

## 🛠️ Tech Stack

* Node.js
* Express.js
* Axios
* Redis
* dotenv
* express-rate-limit

---

## 📦 Installation

### 1. Clone the repository

```bash
git clone https://github.com/your-username/weather-api.git
cd weather-api
```

---

### 2. Install dependencies

```bash
npm install
```

---

### 3. Setup environment variables

Create a `.env` file in the root directory:

```env
PORT=3000
WEATHER_API_KEY=your_api_key_here
REDIS_URL=redis://localhost:6379
```

---

### 4. Start Redis (Docker recommended)

```bash
docker run -d -p 6379:6379 --name redis redis
```

---

### 5. Run the server

```bash
node index.js
```

---

## 📡 API Usage

### 🔹 Get Weather Data

```http
GET /weather?city=Patna
```

### ✅ Example Request

```bash
http://localhost:3000/weather?city=Delhi
```

---

### ✅ Example Response

```json
{
  "success": true,
  "source": "weatherapi + redis",
  "data": {
    "location": {
      "name": "Delhi"
    },
    "current": {
      "temp_c": 30,
      "condition": {
        "text": "Sunny"
      }
    }
  }
}
```

---

## ⚡ Caching Strategy

* The **city name** is used as the Redis key
* Weather data is cached for **1 hour (3600 seconds)**
* Cache automatically expires using Redis TTL (`EX` flag)

---

## 🚫 Rate Limiting

* Limits requests per IP to prevent abuse
* Example:

  * **10 requests per minute per IP**

---

## ❌ Error Handling

The API handles:

* Invalid city names
* 3rd party API failures
* Missing query parameters

### Example Error Response

```json
{
  "success": false,
  "message": "City query parameter is required"
}
```

---

## 🧪 Testing

You can test using:

* Browser
* Postman
* curl

```bash
curl "http://localhost:3000/weather?city=Patna"
```

---

## 📁 Project Structure

```
.
├── index.js
├── db.js
├── package.json
├── .env
└── README.md
```

---


## 👨‍💻 Author

**Ritesh Kumar**

---


## 📜 License

This project is licensed under the MIT License.
