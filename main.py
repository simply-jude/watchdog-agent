import os
import time
import traceback
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from google import genai
from google.genai import types

# Load your secure .env file
load_dotenv()

app = FastAPI()

# Allow your React frontend to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize client using the environment variable
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

# Upload the document once when the server starts
print("Booting Watchdog API...")
print("Uploading budget document to Gemini...")
budget_file = client.files.upload(file='county_budget.pdf')
time.sleep(5) 
print("File uploaded successfully!")

def check_gazette_amendments(ward_name: str) -> str:
    """Checks recent gazette notices for any hidden budget reallocations or cuts."""
    notices = {
        "kileleshwa": "Notice 442: 20M KES reallocated from road repair to administrative allowances.",
        "kawangware": "No recent amendments found."
    }
    return notices.get(ward_name.lower(), "No recent amendments found.")

class QueryRequest(BaseModel):
    question: str

@app.post("/audit")
def audit_budget(request: QueryRequest):
    try:
        response = client.models.generate_content(
            model='gemini-flash-latest',
            contents=[budget_file, request.question],
            config=types.GenerateContentConfig(
                tools=[check_gazette_amendments],
                system_instruction=(
                    "You are a strict county budget watchdog. "
                    "Use the provided budget PDF to find the original budget allocation for the requested ward. "
                    "Then, use the check_gazette_amendments tool to see if the budget was secretly changed. "
                    "Output a plain-language summary of your findings for the citizens. "
                    "Use Markdown formatting."
                ),
                temperature=0.1,
            )
        )
        return {"audit_result": response.text}
        
    except Exception as e:
        error_trace = traceback.format_exc()
        print(error_trace) 
        return {"ERROR_MESSAGE": str(e)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8080)