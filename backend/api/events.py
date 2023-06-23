import asyncio







class Event:
    def __init__(self):
        self.queues = []

    async def pub(self, msg):
        for queue in self.queues:
            await queue.put(msg)

    async def sub(self):
        """Get ID from here"""
        self.queues.append(asyncio.Queue())
        return len(self.queues) - 1
    
    async def get(self, id):
        return await self.queues[id].get()

    def unsub(self, id):
        self.queues.pop(id)    



class Events():
    def __init__(self):
        self.events = {}

    def add_event(self, code):
        self.events[code] = Event()
    
    async def send_msg(self, code, msg):
        await self.events[code].pub(msg)

    def get_event(self, code):
        if not self.does_exist(code):
            self.add_event(code)
        return self.events[code]

    def del_event(self, code):
        del self.events[code]

    def does_exist(self, code):
        return code in self.events

events = Events()