const messageTextArea = document.getElementById("messageTextArea");
const messageSendBtn = document.getElementById("messageSendBtn");
const chatBoxBody = document.getElementById("chatBoxBody");
const uiGroup = document.getElementById("groups");
const groupNameHeading = document.getElementById("groupNameHeading");

async function activeGroup(e) {
  chatBoxBody.innerHTML = "";
  localStorage.setItem("chats", JSON.stringify([]));
  groupNameHeading.innerHTML = "";
  const activeLi = document.getElementsByClassName("active");
  if (activeLi.length != 0) {
    activeLi[0].removeAttribute("class", "active");
  }
  let li = e.target;
  while (li.tagName !== "LI") {
    li = li.parentElement;
  }
  li.setAttribute("class", "active");
  const groupName = li.querySelector("span").textContent;
  localStorage.setItem("groupName", groupName);
  const span = document.createElement("span");
  span.appendChild(document.createTextNode(groupName));
  groupNameHeading.appendChild(span);
  setInterval(() => {
    getMessages();
  }, 5000);
}


// async function messageSend() {
//   try {
//     const message = messageTextArea.value;
//     const token = localStorage.getItem("token");
//     const groupName = localStorage.getItem("groupName");

//     if (!groupName || groupName == "") {
//       return alert("Select group to send the message");
//     }


//     const res = await axios.post(
//       `http://localhost:3000/chat/sendMessage`,
//       {
//         message: message,
//         groupName: groupName
//       },
//       { headers: { Authorization: token } }
//     );
//     const newMessage = {
//       id: res.data.id, // Assuming your backend sends back the created message with an ID
//       message: message,
//       name: req.user.name,
//       userId: req.user.id
//     };
//     let chats = JSON.parse(localStorage.getItem("chats")) || [];
//     chats.push(newMessage); // Add the new message
//     localStorage.setItem("chats", JSON.stringify(chats)); // Save to localStorage
//     messageTextArea.value = "";
//   } catch (error) {
//     console.log("something went wrong");
//   }
// }

async function messageSend() {
  try {
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

    // Update localStorage
    let chats = JSON.parse(localStorage.getItem("chats")) || [];
    chats.push(newMessage); // Add the new message
    localStorage.setItem("chats", JSON.stringify(chats)); // Save to localStorage

    // Clear the input field
    messageTextArea.value = "";
    console.log("New message saved to localStorage:", newMessage);
  } catch (error) {
    console.error("Error sending message:", error);
  }
}


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
};

async function getMessages() {
  try {
    const groupName = localStorage.getItem("groupName");
    const token = localStorage.getItem("token");
    let param = 0; // Default to 0 if no previous messages

    const localStorageChats = JSON.parse(localStorage.getItem("chats"));
    if (localStorageChats && localStorageChats.length !== 0) {
      const lastMessage = localStorageChats[localStorageChats.length - 1];
      param = lastMessage.id; // Set param to the ID of the last message
    }

    if (!groupName || groupName === "") {
      return alert("Select a group to get messages");
    }

    const res = await axios.get(
      `http://localhost:3000/chat/getMessages?param=${param}&groupName=${groupName}`,
      { headers: { Authorization: token } }
    );

    const decodedToken = decodeToken(token);
    const userId = decodedToken.userId;

    chatBoxBody.innerHTML = "";

    const chats = JSON.parse(localStorage.getItem("chats")) || [];
    res.data.messages.forEach((message) => {
      chats.push(message); // Add new messages to local storage chats
    });
    localStorage.setItem("chats", JSON.stringify(chats));

    res.data.messages.forEach((message) => {
      if (message.userId === userId) {
        const div = document.createElement("div");
        chatBoxBody.appendChild(div);
        const messageSendby = document.createElement("span");
        messageSendby.classList.add(
          "d-flex",
          "justify-content-end",
          "px-3",
          "mb-1",
          "text-uppercase",
          "small",
          "text-white"
        );
        messageSendby.appendChild(document.createTextNode("You"));
        div.appendChild(messageSendby);
        const messageBox = document.createElement("div");
        const messageText = document.createElement("div");
        messageBox.classList.add("d-flex", "justify-content-end", "mb-4");
        messageText.classList.add("msg_cotainer_send");
        messageText.appendChild(document.createTextNode(message.message));
        messageBox.appendChild(messageText);
        div.appendChild(messageBox);
      } else {
        const div = document.createElement("div");
        chatBoxBody.appendChild(div);
        const messageSendby = document.createElement("span");
        messageSendby.classList.add(
          "d-flex",
          "justify-content-start",
          "px-3",
          "mb-1",
          "text-uppercase",
          "small",
          "text-white"
        );
        messageSendby.appendChild(document.createTextNode(message.name));
        div.appendChild(messageSendby);
        const messageBox = document.createElement("div");
        const messageText = document.createElement("div");
        messageBox.classList.add("d-flex", "justify-content-start", "mb-4");
        messageText.classList.add("msg_cotainer");
        messageText.appendChild(document.createTextNode(message.message));
        messageBox.appendChild(messageText);
        div.appendChild(messageBox);
      }
    });
  } catch (error) {
    console.log(error);
  }
}


// async function getMessages() {
//   try {

//     const groupName = localStorage.getItem("groupName");
//     const token = localStorage.getItem("token");
//     let param;
//     const localStorageChats = JSON.parse(localStorage.getItem("chats"));
//     console.log("LocalStorage Chats:", localStorageChats);

//     if (!groupName || groupName == "") {
//       return alert("Select group to get the message");
//     }
//     console.log(localStorageChats);

//     if (localStorageChats && localStorageChats.length !== 0) {
//       let array = JSON.parse(localStorage.getItem("chats"));
//       let length = JSON.parse(localStorage.getItem("chats")).length;
//       param = array[length - 1].id;
//     }


//     const res = await axios.get(
//       `http://localhost:3000/chat/getMessages?param=${param}&groupName=${groupName}`,
//       { headers: { Authorization: token } }
//     );


//     const decodedToken = decodeToken(token);
//     console.log(decodeToken);
//     const userId = decodedToken.userId;
//     chatBoxBody.innerHTML = "";
//     console.log(res.data.messages);

//     const chats = JSON.parse(localStorage.getItem("chats"));
//     if (!chats) {
//       localStorage.setItem("chats", JSON.stringify(res.data.messages));
//     } else {
//       res.data.messages.forEach((message) => {
//         chats.push(message);
//       });
//       localStorage.setItem("chats", JSON.stringify(chats));
//     }


//     res.data.messages.forEach((message) => {
//       if (message.userId == userId) {
//         const div = document.createElement("div");
//         chatBoxBody.appendChild(div);
//         const messageSendby = document.createElement("span");
//         messageSendby.classList.add(
//           "d-flex",
//           "justify-content-end",
//           "px-3",
//           "mb-1",
//           "text-uppercase",
//           "small",
//           "text-white"
//         );
//         messageSendby.appendChild(document.createTextNode("You"));
//         div.appendChild(messageSendby);
//         const messageBox = document.createElement("div");
//         const messageText = document.createElement("div");
//         messageBox.classList.add("d-flex", "justify-content-end", "mb-4");
//         messageText.classList.add("msg_cotainer_send");
//         messageText.appendChild(document.createTextNode(message.message));
//         messageBox.appendChild(messageText);
//         div.appendChild(messageBox);
//       } else {
//         const div = document.createElement("div");
//         chatBoxBody.appendChild(div);
//         const messageSendby = document.createElement("span");
//         messageSendby.classList.add(
//           "d-flex",
//           "justify-content-start",
//           "px-3",
//           "mb-1",
//           "text-uppercase",
//           "small",
//           "text-white"
//         );
//         messageSendby.appendChild(document.createTextNode(message.name));
//         div.appendChild(messageSendby);
//         const messageBox = document.createElement("div");
//         const messageText = document.createElement("div");
//         messageBox.classList.add("d-flex", "justify-content-start", "mb-4");
//         messageText.classList.add("msg_cotainer");
//         messageText.appendChild(document.createTextNode(message.message));
//         messageBox.appendChild(messageText);
//         div.appendChild(messageBox);
//       }
//     });
//   } catch (error) {
//     console.log(error);
//   }
// };

// setInterval(() => {
//   getMessages();
// }, 5000);

async function getMessagesFromLocalStorage() {
  const messages = JSON.parse(localStorage.getItem("chats"));
  const token = localStorage.getItem("token");
  const decodedToken = decodeToken(token);
  const userId = decodedToken.userId;
  chatBoxBody.innerHTML = "";

  if (messages) {
    messages.forEach((message) => {
      if (message.userId == userId) {
        const div = document.createElement("div");
        chatBoxBody.appendChild(div);
        const messageSendby = document.createElement("span");
        messageSendby.classList.add(
          "d-flex",
          "justify-content-end",
          "px-3",
          "mb-1",
          "text-uppercase",
          "small",
          "text-white"
        );
        messageSendby.appendChild(document.createTextNode("You"));
        div.appendChild(messageSendby);
        const messageBox = document.createElement("div");
        const messageText = document.createElement("div");
        messageBox.classList.add("d-flex", "justify-content-end", "mb-4");
        messageText.classList.add("msg_cotainer_send");
        messageText.appendChild(document.createTextNode(message.message));
        messageBox.appendChild(messageText);
        div.appendChild(messageBox);
      } else {
        const div = document.createElement("div");
        chatBoxBody.appendChild(div);
        const messageSendby = document.createElement("span");
        messageSendby.classList.add(
          "d-flex",
          "justify-content-start",
          "px-3",
          "mb-1",
          "text-uppercase",
          "small",
          "text-white"
        );
        messageSendby.appendChild(document.createTextNode(message.name));
        div.appendChild(messageSendby);
        const messageBox = document.createElement("div");
        const messageText = document.createElement("div");
        messageBox.classList.add("d-flex", "justify-content-start", "mb-4");
        messageText.classList.add("msg_cotainer");
        messageText.appendChild(document.createTextNode(message.message));
        messageBox.appendChild(messageText);
        div.appendChild(messageBox);
      }
    });
  }
}

messageSendBtn.addEventListener("click", messageSend);
document.addEventListener("DOMContentLoaded", getMessages);
// document.addEventListener("DOMContentLoaded", getMessagesFromLocalStorage);

uiGroup.addEventListener("click", activeGroup);

document.addEventListener("DOMContentLoaded", () => {
  if (!localStorage.getItem("groupName")) {
    localStorage.setItem("groupName", "");
  }
  if (!localStorage.getItem("chats")) {
    localStorage.setItem("chats", JSON.stringify([]));
  }
});
