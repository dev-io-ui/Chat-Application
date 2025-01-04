const messageTextArea = document.getElementById("messageTextArea");
const messageSendBtn = document.getElementById("messageSendBtn");
const chatBoxBody = document.getElementById("chatBoxBody");
const uiGroup = document.getElementById("groups");
const groupNameHeading = document.getElementById("groupNameHeading");

let messageInterval;
let lastMessageId = 0;

// Function to activate a group
async function activeGroup(e) {
  chatBoxBody.innerHTML = ""; // Clear previous messages to prevent duplicates
  const groupItem = e.target.closest("li");

  if (!groupItem) {
    console.error("Clicked element is not inside a group item ('li').");
    return; // Exit the function if it's not inside an 'li'
  }

  const groupName = groupItem.querySelector("span").textContent;

  if (!groupName) {
    console.error("Group name not found inside the 'span'.");
    return; // Exit if there's no group name
  }

  localStorage.setItem("groupName", groupName);

  // Set the group name heading
  groupNameHeading.innerHTML = groupName;

  // Retrieve last message ID from localStorage or 0 if not available
  lastMessageId = JSON.parse(localStorage.getItem(`lastMessageId-${groupName}`)) || 0;

  // Fetch and append both localStorage and backend messages
  getMessages(groupName);

  // Clear previous interval and start a new one to fetch messages
  if (messageInterval) {
    clearInterval(messageInterval);
  }

  messageInterval = setInterval(() => {
    getMessages(groupName); // Re-fetch messages every 5 seconds
  }, 5000);
}

// Function to send a message
async function messageSend() {
  try {
    
    if (chatBoxBody.querySelector(".groupMembersDiv")) {
      const members = chatBoxBody.querySelectorAll(".groupMembersDiv");
      members.forEach((member) => {
        member.remove();
      });
    }

    const message = messageTextArea.value;
    const token = localStorage.getItem("token");
    const groupName = localStorage.getItem("groupName");

    if (!groupName || groupName === "") {
      return alert("Select a group to send the message");
    }

    // Send the message to the backend
    const res = await axios.post(
      `http://localhost:3000/chat/sendMessage`,
      {
        message: message,
        groupName: groupName,
      },
      { headers: { Authorization: token } }
    );

    // Decode token to get user details
    const decodedToken = decodeToken(token);
    const userId = decodedToken.userId;
    const name = decodedToken.name || "You"; // Replace with a default if `name` is not present

    // Construct the new message object
    const newMessage = {
      id: res.data.id, // Assuming your backend returns the new message ID
      message: message,
      name: name,
      userId: userId,
    };

    // Update localStorage for this group (ensure only 10 messages are stored)
    let groupMessages = JSON.parse(localStorage.getItem(`messages-${groupName}`)) || [];
    groupMessages.push(newMessage); // Add the new message

    // Limit to 10 messages in localStorage
    if (groupMessages.length > 10) {
      groupMessages.shift(); // Remove the oldest message from localStorage
    }

    localStorage.setItem(`messages-${groupName}`, JSON.stringify(groupMessages)); // Save to localStorage

    // Clear the input field
    messageTextArea.value = "";
  } catch (error) {
    console.error("Error sending message:", error);
  }
}

// Decode JWT token to extract user details
function decodeToken(token) {
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );
  return JSON.parse(jsonPayload);
}

// Function to get messages from the backend and merge with localStorage
async function getMessages(groupName) {
  try {
    const token = localStorage.getItem("token");

    if (!groupName || groupName === "") {
      return alert("Select a group to get messages");
    }

    // Retrieve messages from localStorage
    let groupMessages = JSON.parse(localStorage.getItem(`messages-${groupName}`)) || [];
    chatBoxBody.innerHTML = ""; // Clear previous messages to prevent duplicates

    // Show the localStorage messages first
    groupMessages.forEach((message) => {
      appendMessageToChatBox(message);
    });

    // Now make the request to the backend to fetch newer messages
    const res = await axios.get(
      `http://localhost:3000/chat/getMessages?param=${lastMessageId}&groupName=${groupName}`,
      { headers: { Authorization: token } }
    );

    const messages = res.data.messages;

    if (messages.length > 0) {
      const decodedToken = decodeToken(token);
      const userId = decodedToken.userId;

      // Only append new backend messages to the chat box
      messages.forEach((message) => {
        appendMessageToChatBox(message);
      });

      // Update localStorage with merged messages, limited to 10 messages
      groupMessages.push(...messages); // Append new messages to the existing ones

      // Limit messages to 10 in localStorage
      if (groupMessages.length > 10) {
        groupMessages.splice(0, groupMessages.length - 10); // Keep only the latest 10 messages
      }

      localStorage.setItem(`messages-${groupName}`, JSON.stringify(groupMessages));

      // Update lastMessageId
      lastMessageId = Math.max(lastMessageId, ...messages.map((msg) => msg.id));
    }
  } catch (error) {
    console.error(error);
  }
}

// Function to append messages to the chat box
function appendMessageToChatBox(message) {
  const div = document.createElement("div");
  chatBoxBody.appendChild(div);
  const messageSendby = document.createElement("span");
  messageSendby.classList.add(
    "d-flex",
    message.userId === localStorage.getItem("userId") ? "justify-content-end" : "justify-content-start",
    "px-3",
    "mb-1",
    "text-uppercase",
    "small",
    "text-white"
  );
  messageSendby.appendChild(document.createTextNode(message.userId === localStorage.getItem("userId") ? "You" : message.name));
  div.appendChild(messageSendby);
  const messageBox = document.createElement("div");
  const messageText = document.createElement("div");
  messageBox.classList.add(
    "d-flex",
    message.userId === localStorage.getItem("userId") ? "justify-content-end" : "justify-content-start",
    "mb-4"
  );
  messageText.classList.add(
    message.userId === localStorage.getItem("userId") ? "msg_cotainer_send" : "msg_cotainer"
  );
  messageText.appendChild(document.createTextNode(message.message));
  messageBox.appendChild(messageText);
  div.appendChild(messageBox);
}

// Function to load messages from localStorage when the page loads
document.addEventListener("DOMContentLoaded", () => {
  const groupName = localStorage.getItem("groupName");
  if (groupName) {
    activeGroup({ target: { closest: () => document.querySelector(`li[data-group='${groupName}']`) } });
  }
});

messageSendBtn.addEventListener("click", messageSend);
uiGroup.addEventListener("click", activeGroup);




// const messageTextArea = document.getElementById("messageTextArea");
// const messageSendBtn = document.getElementById("messageSendBtn");
// const chatBoxBody = document.getElementById("chatBoxBody");
// const uiGroup = document.getElementById("groups");
// const groupNameHeading = document.getElementById("groupNameHeading");

// let messageInterval;
// let lastMessageId = 0;

// // Function to activate a group
// async function activeGroup(e) {
//   chatBoxBody.innerHTML = ""; // Clear previous messages
//   localStorage.setItem("chats", JSON.stringify([])); // Reset chat in localStorage
//   groupNameHeading.innerHTML = ""; // Reset group name heading
  
//   const activeLi = document.getElementsByClassName("active");
//   if (activeLi.length !== 0) {
//     activeLi[0].removeAttribute("class", "active");
//   }

//   let li = e.target;
//   while (li.tagName !== "LI") {
//     li = li.parentElement;
//   }
//   li.setAttribute("class", "active");

//   const groupName = li.querySelector("span").textContent;
//   localStorage.setItem("groupName", groupName);

//   const span = document.createElement("span");
//   span.appendChild(document.createTextNode(groupName));
//   groupNameHeading.appendChild(span);

//   // Clear previous interval and start a new one to fetch messages
//   if (messageInterval) {
//     clearInterval(messageInterval);
//   }
//   messageInterval = setInterval(() => {
//     getMessages();
//   }, 1000);
// }

// // Function to send a message
// async function messageSend() {
//   try {
//     const message = messageTextArea.value;
//     const token = localStorage.getItem("token");
//     const groupName = localStorage.getItem("groupName");

//     if (!groupName || groupName === "") {
//       return alert("Select a group to send the message");
//     }

//     // Send the message to the backend
//     const res = await axios.post(
//       `http://localhost:3000/chat/sendMessage`,
//       {
//         message: message,
//         groupName: groupName,
//       },
//       { headers: { Authorization: token } }
//     );

//     // Decode token to get user details
//     const decodedToken = decodeToken(token);
//     const userId = decodedToken.userId;
//     const name = decodedToken.name || "You"; // Replace with a default if `name` is not present

//     // Construct the new message object
//     const newMessage = {
//       id: res.data.id, // Assuming your backend returns the new message ID
//       message: message,
//       name: name,
//       userId: userId,
//     };

//     // Update localStorage (ensure only 10 messages are stored)
//     let chats = JSON.parse(localStorage.getItem("chats")) || [];
//     chats.push(newMessage); // Add the new message

//     // Limit to 10 messages, removing the oldest if needed
//     if (chats.length > 10) {
//       chats.shift(); // Remove the oldest message
//     }

//     localStorage.setItem("chats", JSON.stringify(chats)); // Save to localStorage

//     // Clear the input field
//     messageTextArea.value = "";
//     console.log("New message saved to localStorage:", newMessage);
//   } catch (error) {
//     console.error("Error sending message:", error);
//   }
// }

// // Decode JWT token to extract user details
// function decodeToken(token) {
//   const base64Url = token.split(".")[1];
//   const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
//   const jsonPayload = decodeURIComponent(
//     atob(base64)
//       .split("")
//       .map(function (c) {
//         return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
//       })
//       .join("")
//   );
//   return JSON.parse(jsonPayload);
// };

// // Function to get messages from the backend
// async function getMessages() {
//   try {
//     const groupName = localStorage.getItem("groupName");
//     const token = localStorage.getItem("token");

//     if (!groupName || groupName === "") {
//       return alert("Select a group to get messages");
//     }

//     const res = await axios.get(
//       `http://localhost:3000/chat/getMessages?param=${lastMessageId}&groupName=${groupName}`,
//       { headers: { Authorization: token } }
//     );

//     const messages = res.data.messages;

//     if (messages.length > 0) {
//       const decodedToken = decodeToken(token);
//       const userId = decodedToken.userId;

//       messages.forEach((message) => {
//         // Append only new messages
//         lastMessageId = Math.max(lastMessageId, message.id);
//         appendMessageToChatBox(message, userId);
//       });

//       // Update local storage
//       const chats = JSON.parse(localStorage.getItem("chats")) || [];
//       chats.push(...messages);

//       // Limit to 10 messages, removing the oldest if needed
//       if (chats.length > 10) {
//         chats.splice(0, chats.length - 10); // Keep only the latest 10 messages
//       }

//       localStorage.setItem("chats", JSON.stringify(chats));
//     }
//   } catch (error) {
//     console.error(error);
//   }
// }

// // Function to append messages to the chat box
// function appendMessageToChatBox(message, userId) {
//   const div = document.createElement("div");
//   chatBoxBody.appendChild(div);
//   const messageSendby = document.createElement("span");
//   messageSendby.classList.add(
//     "d-flex",
//     message.userId === userId ? "justify-content-end" : "justify-content-start",
//     "px-3",
//     "mb-1",
//     "text-uppercase",
//     "small",
//     "text-white"
//   );
//   messageSendby.appendChild(
//     document.createTextNode(message.userId === userId ? "You" : message.name)
//   );
//   div.appendChild(messageSendby);
//   const messageBox = document.createElement("div");
//   const messageText = document.createElement("div");
//   messageBox.classList.add(
//     "d-flex",
//     message.userId === userId ? "justify-content-end" : "justify-content-start",
//     "mb-4"
//   );
//   messageText.classList.add(
//     message.userId === userId ? "msg_cotainer_send" : "msg_cotainer"
//   );
//   messageText.appendChild(document.createTextNode(message.message));
//   messageBox.appendChild(messageText);
//   div.appendChild(messageBox);
// }

// // Function to load messages from localStorage
// async function getMessagesFromLocalStorage() {
//   const messages = JSON.parse(localStorage.getItem("chats"));
//   const token = localStorage.getItem("token");
//   const decodedToken = decodeToken(token);
//   const userId = decodedToken.userId;
//   chatBoxBody.innerHTML = "";

//   if (messages) {
//     messages.forEach((message) => {
//       appendMessageToChatBox(message, userId);
//     });
//   }
// }

// messageSendBtn.addEventListener("click", messageSend);
// document.addEventListener("DOMContentLoaded", getMessages); // Fetch messages on page load

// uiGroup.addEventListener("click", activeGroup);

// document.addEventListener("DOMContentLoaded", () => {
//   if (!localStorage.getItem("groupName")) {
//     localStorage.setItem("groupName", "");
//   }
//   if (!localStorage.getItem("chats")) {
//     localStorage.setItem("chats", JSON.stringify([]));
//   }
// });
