import asyncio
import websockets

async def test():
    uri = "ws://127.0.0.1:8000/ws/tracking/1/"
    async with websockets.connect(uri) as ws:
        print("Connected. Waiting for messages...")
        async for message in ws:
            print("RECEIVED:", message)

asyncio.run(test())