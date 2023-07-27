import socket
import threading

# Dictionary to store connections and usernames
clients = {}
clients_lock = threading.Lock()

def handle_client(client_socket, username):
    while True:
        try:
            message = client_socket.recv(BUFFER_SIZE).decode('utf-8')
            if message == 'exit':
                break
            
            # Broadcast the message to all connected
            with clients_lock:
                for client in clients:
                    if client != username:
                        client.send(f"{username}: {message}".encode('utf-8'))
        except:
            break

    # When disconnects, remove it from the dictionary
    with clients_lock:
        del clients[username]
        client_socket.close()

def main():
    server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    server_socket.bind((SERVER_HOST, SERVER_PORT))
    server_socket.listen(5)

    print(f"Server listening on {SERVER_HOST}:{SERVER_PORT}")

    while True:
        client_socket, client_address = server_socket.accept()
        username = client_socket.recv(BUFFER_SIZE).decode('utf-8')
        print(f"New connection from {client_address}, username: {username}")

        with clients_lock:
            clients[username] = client_socket

        # Create a thread to handle 
        client_thread = threading.Thread(target=handle_client, args=(client_socket, username))
        client_thread.start()

if __name__ == "__main__":
    main()

class chat_filter:
    def __init__(self):
        self.chat_history = []
        self.filtered_chat_history = []
        self.bad_words = ["shit", "fuck", "ass"] 

    def filter_chat(self, input_text):
        # Replace bad words with asterisks (*) in the input text
        filtered_input = input_text.lower()
        for bad_word in self.bad_words:
            filtered_input = filtered_input.replace(bad_word, '*' * len(bad_word))

        self.filtered_chat_history = [
            message for message in self.chat_history if filtered_input in message.lower()
        ]

# Example usage:
if __name__ == "__main__":
    chat_filter = ChatFilter()

# Get user input for filtering
filter_input = input("Enter the filter string: ")

# Filter the chat history based on the user input
chat_filter.filter_chat(filter_input)

# Display the filtered chat messages
print("Filtered Chat History:")
for message in chat_filter.filtered_chat_history:
    print(msg.text)
