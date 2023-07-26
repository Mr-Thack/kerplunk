from asyncio import Queue





class Event:
    def __init__(self, code: str):
        self.queues = []
        self.alerts = []  # Alert first
        self.code = code

    async def pub(self, msg):
        for queue in self.queues:
            await queue.put(msg)

        # Filter out all null alerts
        self.alerts = [alert for alert in self.alerts if alert != None]                

        for queue in self.alerts:
            await queue.put((self.code, msg))

    async def sub(self, queue = None): 
        """Get ID from here"""
        if queue:
            self.alerts.append(queue)
        else:
            self.queues.append(Queue())
            return len(self.queues) - 1
    
    async def get(self, id):
        return await self.queues[id].get()

    def unsub(self, id):
        # Note that alerts don't need an unsub
        del self.queues[id]
        
        if not len(self.alerts) and not len(self.queues):
            events.del_event(self.code)


class Events():
    def __init__(self):
        self.events = {}

    def add_event(self, code):
        self.events[code] = Event(code)
    
    async def send_msg(self, code, msg):
        await self.events[code].pub(msg)

    def get_event(self, code):
        if not self.does_exist(code):
            self.add_event(code)
        return self.events[code]

    def del_event(self, code):
        if self.does_exist(code):
            del self.events[code]

    def does_exist(self, code):
        return code in self.events

    async def get_notifier(self, codes: [str]):
        # Just do "del handler" to delete the notifier
        handler = Queue()

        for code in codes:
            e = self.get_event(code)
            await e.sub(handler)

        return handler
    
events = Events()