// // app.js

// // Simulating a list of users (this should come from a backend in a real app)
// const users = [
//     { id: 1, name: 'User1' },
//     { id: 2, name: 'User2' },
//     { id: 3, name: 'User3' },
// ];

// // Simulate a selected user (in a real app, this would be dynamic)
// let selectedUser = null;

// // Populate user list dynamically
// const userListElement = document.getElementById('userList');
// users.forEach(user => {
//     const userElement = document.createElement('li');
//     userElement.textContent = user.name;
//     userElement.onclick = () => selectUser(user);
//     userListElement.appendChild(userElement);
// });

// // Handle user selection
// function selectUser(user) {
//     selectedUser = user;
//     document.querySelectorAll('#userList li').forEach(li => li.classList.remove('selected'));
//     event.target.classList.add('selected');
//     loadChatHistory(user);
// }

// // Simulate loading chat history for a selected user
// function loadChatHistory(user) {
//     const chatWindow = document.getElementById('chatWindow');
//     chatWindow.innerHTML = `<h4>Chat with ${user.name}</h4>`;
//     // Normally you would fetch previous messages from the backend here.
//     chatWindow.innerHTML += `<p>Loading chat history...</p>`;
// }

// // Sending a message
// const sendMessageButton = document.getElementById('sendMessageButton');
// const messageInput = document.getElementById('messageInput');

// sendMessageButton.onclick = () => {
//     const message = messageInput.value.trim();
//     if (message && selectedUser) {
//         displayMessage(message);
//         messageInput.value = '';
//         // In a real app, you would send the message to the backend and get a response
//     } else {
//         alert("Please select a user and enter a message.");
//     }
// };

// // Display the sent message in the chat window
// function displayMessage(message) {
//     const chatWindow = document.getElementById('chatWindow');
//     const messageElement = document.createElement('div');
//     messageElement.textContent = `You: ${message}`;
//     chatWindow.appendChild(messageElement);
//     chatWindow.scrollTop = chatWindow.scrollHeight; // Scroll to bottom
// }
