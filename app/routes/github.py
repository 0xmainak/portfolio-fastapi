import os
import requests
from datetime import datetime, timedelta
from fastapi import APIRouter
from fastapi.responses import JSONResponse

router = APIRouter()

GITHUB_USERNAME = os.getenv("GITHUB_USERNAME")
GITHUB_TOKEN = os.getenv("GITHUB_PERSONAL_ACCESS_TOKEN")

@router.get("/contributions")
def get_contributions():
    # GitHub GraphQL API query for contributions
    query = """
    query($username: String!) {
        user(login: $username) {
            contributionsCollection {
                contributionCalendar {
                    totalContributions
                    weeks {
                        contributionDays {
                            contributionCount
                            date
                        }
                    }
                }
            }
        }
    }
    """
    
    variables = {"username": GITHUB_USERNAME}
    
    headers = {
        "Authorization": f"Bearer {GITHUB_TOKEN}",
        "Content-Type": "application/json"
    }
    
    response = requests.post(
        "https://api.github.com/graphql",
        json={"query": query, "variables": variables},
        headers=headers
    )
    
    if response.status_code != 200:
        return JSONResponse({"error": "Failed to fetch contributions"}, status_code=response.status_code)
    
    data = response.json()
    
    if "errors" in data:
        return JSONResponse({"error": "GraphQL errors", "details": data["errors"]}, status_code=400)
    
    # Extract contribution data
    calendar = data["data"]["user"]["contributionsCollection"]["contributionCalendar"]
    total_contributions = calendar["totalContributions"]
    weeks = calendar["weeks"]
    
    # Process weeks to get last 53 weeks (1 year)
    all_days = []
    for week in weeks:
        for day in week["contributionDays"]:
            all_days.append({
                "date": day["date"],
                "count": day["contributionCount"]
            })
    
    # Get last 365 days
    all_days = all_days[-365:] if len(all_days) > 365 else all_days
    
    return JSONResponse({
        "total_contributions": total_contributions,
        "days": all_days
    })
