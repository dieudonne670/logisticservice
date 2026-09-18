import asyncio
import json
import websockets
import os

TOKEN = os.environ['TOKEN']
URI = f"ws://127.0.0.1:8000/ws/chat/shipment_1/?token={TOKEN}"

async def test():
    async with websockets.connect(URI) as ws:
        print("Connected to chat")

        # Listen for messages, and send one after connecting
        async def send_once():
            await asyncio.sleep(1)
            await ws.send(json.dumps({"message": "Hello from the test script"}))
            print("Sent: Hello from the test script")

        asyncio.create_task(send_once())

        async for message in ws:
            print("RECEIVED:", message)

asyncio.run(test())