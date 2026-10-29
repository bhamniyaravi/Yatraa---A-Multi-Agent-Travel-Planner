# ✈️ Yatraa — Multi-Agent AI Travel Planner

> **Plan smarter. Travel better.**  
> An AI-powered multi-agent travel planner built with **LangGraph, FastAPI, Groq, PostgreSQL, Tavily, and Docker**.

Yatraa is an AI travel planning system that takes a natural-language travel request and automatically researches flights, finds hotel information, creates a day-by-day itinerary, and generates a practical final travel plan.

---

## 🚀 Features

- ✈️ **Flight Search** — Fetch flight information based on the user's travel request.
- 🏨 **Hotel Research** — Search and suggest suitable hotels.
- 🧠 **AI Itinerary Generation** — Generate practical day-by-day travel plans.
- 💰 **Budget-Aware Planning** — Consider the user's specified budget and travel requirements.
- 🤖 **Multi-Agent Architecture** — Separate agents handle flights, hotels, itinerary generation, and final response generation.
- 🔄 **Conversation Memory** — LangGraph PostgreSQL checkpointing maintains conversation threads.
- 🌐 **FastAPI Backend** — REST API for the travel planner.
- 🎨 **Modern Web Interface** — Responsive HTML, CSS, and JavaScript frontend.
- 📄 **PDF Export** — Download generated travel plans as PDF.
- 📋 **Copy Plan** — Easily copy the generated travel plan.
- 🐳 **Docker Support** — Ready for containerized deployment.
- ☁️ **Render PostgreSQL** — Supports cloud PostgreSQL for persistent LangGraph memory.

---

## 🏗️ Architecture

```text
                    ┌─────────────────────┐
                    │     User Request    │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │    FastAPI Server   │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │   LangGraph Flow   │
                    └──────────┬──────────┘
                               │
              ┌────────────────┼────────────────┐
              │                │                │
              ▼                ▼                ▼
       ┌─────────────┐  ┌─────────────┐  ┌──────────────┐
       │ Flight Agent│  │ Hotel Agent │  │   Itinerary  │
       │             │  │             │  │    Agent     │
       └──────┬──────┘  └──────┬──────┘  └──────┬───────┘
              │                │                │
              └────────────────┼────────────────┘
                               ▼
                    ┌─────────────────────┐
                    │    Final AI Agent   │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │   Travel Plan UI    │
                    └─────────────────────┘

                         PostgreSQL
                       LangGraph Memory
```

---

## 🧩 Agent Workflow

Yatraa follows a sequential multi-agent workflow:

### 1. Flight Agent

Receives the user's travel request and searches for relevant flight information using the flight search tool.

### 2. Hotel Agent

Uses Tavily to research hotel options and accommodation information related to the destination.

### 3. Itinerary Agent

The Groq-powered LLM combines the user's requirements, flight information, and hotel information to create a practical itinerary.

### 4. Final Response Agent

The final agent combines all gathered information and produces a structured response containing:

- Trip Summary
- Flight Information
- Hotel Suggestions
- Day-by-Day Itinerary
- Estimated Budget
- Final Recommendations

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| Python | Core programming language |
| FastAPI | Backend API |
| LangGraph | Multi-agent workflow |
| LangChain | LLM integration |
| Groq | AI/LLM inference |
| PostgreSQL | Persistent checkpoint memory |
| Psycopg | PostgreSQL connection |
| Tavily | Web research |
| Aviation/Flight API | Flight information |
| HTML | Frontend structure |
| CSS | Frontend styling |
| JavaScript | Frontend interaction |
| Jinja2 | HTML templating |
| Docker | Containerization |
| Render | Deployment |

---

## 📁 Project Structure

```text
Yatraa---A-Multi-Agent-Travel-Planner/
│
├── static/
│   ├── script.js
│   └── style.css
│
├── template/
│   └── index.html
│
├── tools/
│   ├── __init__.py
│   ├── flight_tool.py
│   └── tavily_tool.py
│
├── app.py
├── backend.py
├── test.py
├── requirements.txt
├── Dockerfile
├── .dockerignore
├── .gitignore
├── .env
└── README.md
```

---

## ⚙️ How It Works

A user can enter a request such as:

```text
Plan a 7-day Japan trip from Delhi under ₹1,50,000
including flights, hotels and sightseeing.
```

Yatraa processes the request through the LangGraph workflow:

```text
User Query
    ↓
Flight Search
    ↓
Hotel Research
    ↓
AI Itinerary
    ↓
Final AI Response
    ↓
Travel Plan
```

The generated result is then displayed in the web interface.

---

## 🔑 Environment Variables

Create a `.env` file locally:

```env
GROQ_API_KEY=your_groq_api_key

TAVILY_API_KEY=your_tavily_api_key

DATABASE_URL=your_postgresql_database_url
```

If your flight tool requires an additional API key, add it according to the configuration in:

```text
tools/flight_tool.py
```

### ⚠️ Security

Never commit `.env` to GitHub.

Make sure your `.gitignore` contains:

```gitignore
.env
__pycache__/
*.pyc
.venv/
venv/
```

---

## 🐍 Local Setup

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/Yatraa---A-Multi-Agent-Travel-Planner.git
cd Yatraa---A-Multi-Agent-Travel-Planner
```

### 2. Create a virtual environment

```bash
python -m venv travel
```

Activate it on Windows:

```bash
travel\Scripts\activate
```

Or using Conda:

```bash
conda create -n travel python=3.11
conda activate travel
```

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

### 4. Configure environment variables

Create `.env` and add your API keys and PostgreSQL connection string.

### 5. Run the application

```bash
python app.py
```

The server will start at:

```text
http://127.0.0.1:8000
```

Open the URL in your browser.

---

## 🗄️ PostgreSQL & LangGraph Memory

Yatraa uses PostgreSQL with `PostgresSaver` for LangGraph checkpointing.

The application creates the required checkpoint tables using:

```python
checkpointer = PostgresSaver(_conn)
checkpointer.setup()
```

A unique `thread_id` is used for each conversation:

```text
user_<unique-id>
```

This allows the application to maintain separate conversation threads.

---

## 🔌 API

### `GET /`

Returns the Yatraa frontend.

### `POST /api/travel`

Generates a travel plan.

#### Request

```json
{
  "message": "Plan a 7 day Japan trip from Delhi under ₹150000",
  "thread_id": null
}
```

#### Response

```json
{
  "success": true,
  "thread_id": "user_xxxxxxxxx",
  "answer": "Your complete travel plan...",
  "flight_results": "...",
  "hotel_results": "...",
  "itinerary": "...",
  "llm_calls": 3
}
```

### `GET /health`

Health-check endpoint:

```text
http://127.0.0.1:8000/health
```

Response:

```json
{
  "status": "ok",
  "message": "AI Travel Planner API is running"
}
```

---

## 🎨 Frontend

The frontend is built using:

```text
HTML
CSS
JavaScript
```

The interface provides:

- Travel query input
- Quick travel prompts
- Loading state
- AI-generated travel plan
- Markdown rendering
- Copy button
- PDF download
- Responsive design

Static files are served through FastAPI:

```python
app.mount(
    "/static",
    StaticFiles(directory=str(BASE_DIR / "static")),
    name="static"
)
```

The HTML template is loaded from:

```text
template/index.html
```

---

## 🐳 Docker

Yatraa includes Docker support using Python 3.11.

### Dockerfile

```dockerfile
FROM python:3.11-slim

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

RUN apt-get update && apt-get install -y \
    build-essential \
    git \
    curl \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .

RUN pip install --no-cache-dir --upgrade pip
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Build

```bash
docker build -t yatraa .
```

### Run

```bash
docker run -p 8000:8000 --env-file .env yatraa
```

Then open:

```text
http://localhost:8000
```

---

## ☁️ Deployment

Yatraa can be deployed using Docker on platforms such as Render.

For deployment, configure the required environment variables in the hosting platform:

```text
GROQ_API_KEY
TAVILY_API_KEY
DATABASE_URL
```

The application listens on:

```text
0.0.0.0:8000
```

which allows it to receive external traffic inside a container.

---

## 💡 Example Queries

```text
Plan a 7-day Japan trip from Delhi under ₹1.5 lakh.
```

```text
Plan a 5-day Dubai trip including flights, hotels and sightseeing.
```

```text
Plan a budget-friendly Thailand trip for 7 days.
```

```text
Find flight options from Delhi to Melbourne.
```

```text
Plan a complete Europe trip with hotels, flights and a day-by-day itinerary.
```

---

## 🔮 Future Improvements

- 🗺️ Interactive maps and route planning
- 💳 Real-time flight and hotel pricing
- 🏨 Direct hotel booking integration
- ✈️ Flight booking integration
- 🌦️ Weather-aware itinerary planning
- 📍 Destination-based recommendations
- 💰 Advanced budget optimization
- 🧳 Personalized travel preferences
- 🤖 Parallel agent execution
- 🔐 User authentication
- 📊 Trip history dashboard
- 📱 Progressive Web App / mobile version

---

## 📌 Project Goal

Yatraa aims to demonstrate how **agentic AI and multi-agent workflows** can be used to automate complex travel planning tasks.

Instead of manually searching different websites for flights, hotels, destinations, and itineraries, users can provide one natural-language request and let the AI system coordinate the planning process.

---

## 👨‍💻 Developer

**Ravi Bhamniya**

B.Tech — Artificial Intelligence & Data Science

Interested in:

- Artificial Intelligence
- Data Science
- Generative AI
- Agentic AI
- Machine Learning
- Backend Development

---

## ⭐ Support

If you find **Yatraa** useful, consider giving the repository a ⭐ on GitHub.

---

### Built with ❤️ using Python, LangGraph and AI

