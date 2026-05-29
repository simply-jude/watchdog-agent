# County Budget Watchdog
**Track 04: The County Budget Watchdog** // *Built by Vaulted Logic*

### Live Demos
* **Frontend UI:**(https://gdg-nairobi-ai-build.web.app)
* **Backend API:**(https://watchdog-api-1021200580207.europe-west1.run.app)

### The Problem
Citizens lack the technical expertise to parse 400-page county budget PDFs, allowing millions in public funds to be secretly reallocated without accountability. 

### The Architecture
This is a fully autonomous, data-grounded AI agent built to audit municipal finances. 
* **The Brain:** Gemini 1.5 Flash (via `google-genai` SDK) processes the entire 400-page unstructured budget PDF in-memory.
* **The Tools:** A custom Python tool (`check_gazette_amendments`) monitors simulated government gazette notices to cross-reference initial allocations against secret cuts.
* **The Backend:** A containerized FastAPI server deployed on Google Cloud Run.
* **The Frontend:** A data-driven React/Vite user interface deployed on Firebase Hosting.

### How to Run Locally
1. Clone this repository.
2. Navigate to the root and start the Python API:
   `pip install -r requirements.txt`
   `python main.py` (Ensure you have a `.env` with your `GEMINI_API_KEY`)
3. Open a second terminal, navigate to the UI, and start React:
   `cd watchdog-ui`
   `npm install`
   `npm run dev`

### Vaulted Logic Team
* **Jude:** Technical Lead & AI Architecture
