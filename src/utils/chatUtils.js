const scrollChatBoxToBottom = () => {
  try {
    const e = document.getElementById('chat-history');
    e.scrollTop = e.scrollHeight + 100;
  } catch (err) {
    console.log(err);
  }
};

export { scrollChatBoxToBottom };
