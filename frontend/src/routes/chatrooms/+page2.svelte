<!-- ChatMessage.svelte -->
<script>
  export let message;
</script>

<div class="chat-message">
  <span>{message.author}: </span>
  <span>{message.text}</span>
</div>

<!-- Chat.svelte -->
<script>
  import ChatMessage from './ChatMessage.svelte';

  let chatHistory = [];
  let filteredChatHistory = [];

  function filterChat(input) {
    const filteredMessages = chatHistory.filter(message => {
      // Customize your filter logic here based on the input
      // For example, you could filter messages containing the input string
      return message.text.includes(input);
    });

    filteredChatHistory = filteredMessages;
  }

  function sendMessage(message) {
    // Add logic to send the message to the server or other clients
    chatHistory = [...chatHistory, { author: 'You', text: message }];
    filterChat(''); // Clear the filter after sending a message
  }
</script>

<style>
  /* Add your CSS styles here */
</style>

<div>
  <!-- Input field to enter the filter string -->
  <input
    type="text"
    placeholder="Filter messages..."
    on:input={(e) => filterChat(e.target.value)}
  />

  <!-- Display the filtered chat messages -->
  <div>
    {#each filteredChatHistory as message (message.id)}
      <ChatMessage message={message} />
    {/each}
  </div>

  <!-- Input field to send new messages -->
  <input
    type="text"
    placeholder="Type your message..."
    on:keydown={(e) => {
      if (e.key === 'Enter') {
        sendMessage(e.target.value);
        e.target.value = '';
      }
    }}
  />
</div>

<!-- App.svelte -->
<script>
  import Chat from './Chat.svelte';

  // Sample chat history
  let chatHistory = [
    // Add more messages here
  ];
</script>

<main>
  <h1>Direct Messaging Chat</h1>
  
  <!-- Render the Chat component and pass the chat history -->
  <Chat chatHistory={chatHistory} />
</main>

<style>
  /* Add your CSS styles here */
</style>