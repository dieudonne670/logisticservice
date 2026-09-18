import time
import requests
import math

# --- CONFIG ---
API_BASE = "http://127.0.0.1:8000"
USERNAME = "coolkid"
PASSWORD = "dieudonne670"     # <-- change this
SHIPMENT_ID = 4                # <-- change this to your shipment's ID

# Route: Los Angeles → Las Vegas (approx straight line)
START = (34.0522, -118.2437)
END   = (36.1699, -115.1398)
STEPS = 60                     # how many points to post
INTERVAL = 3                   # seconds between points


def login():
    r = requests.post(f"{API_BASE}/api/token/", json={
        "username": USERNAME, "password": PASSWORD
    })
    r.raise_for_status()
    return r.json()["access"]


def post_location(token, lat, lng):
    r = requests.post(
        f"{API_BASE}/api/locations/",
        headers={"Authorization": f"Bearer {token}"},
        json={"shipment_id": SHIPMENT_ID, "latitude": lat, "longitude": lng},
    )
    if r.status_code != 201:
        print(f"  ! Failed: {r.status_code} {r.text}")
        return False
    return True


def main():
    print("Logging in...")
    token = login()
    print(f"Simulating shipment {SHIPMENT_ID} from {START} to {END}")
    print(f"{STEPS} points, {INTERVAL}s apart (~{STEPS * INTERVAL}s total)")

    for i in range(STEPS + 1):
        t = i / STEPS
        lat = START[0] + (END[0] - START[0]) * t
        lng = START[1] + (END[1] - START[1]) * t

        # Add a small wiggle so it looks like a real route, not a perfect line
        lat += 0.02 * math.sin(t * math.pi * 6)
        lng += 0.02 * math.cos(t * math.pi * 6)

        print(f"  [{i+1}/{STEPS+1}] {lat:.4f}, {lng:.4f}")
        post_location(token, lat, lng)
        if i < STEPS:
            time.sleep(INTERVAL)

    print("Done.")


if __name__ == "__main__":
    main()