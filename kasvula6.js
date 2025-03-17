<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Embedded Chatbot</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/geist@1.0.0/dist/fonts/geist-sans/style.css">
    <style>
        .chat-container {
            width: 100%;
            max-width: 600px;
            height: 700px;
            margin: 20px auto;
            background: #ffffff;
            border-radius: 12px;
            box-shadow: 0 8px 32px rgba(133, 79, 255, 0.15);
            border: 1px solid rgba(133, 79, 255, 0.2);
            display: flex;
            flex-direction: column;
            font-family: 'Geist Sans', sans-serif;
        }
        .brand-header {
            padding: 16px;
            display: flex;
            align-items: center;
            gap: 12px;
            border-bottom: 1px solid rgba(133, 79, 255, 0.1);
        }
        .brand-header img {
            width: 32px;
            height: 32px;
        }
        .brand-header span {
            font-size: 18px;
            font-weight: 500;
            color: #333333;
        }
        .chat-messages {
            flex: 1;
            overflow-y: auto;
            padding: 20px;
            display: flex;
            flex-direction: column;
        }
        .chat-message {
            padding: 12px 16px;
            margin: 8px 0;
            border-radius: 12px;
            max-width: 80%;
            font-size: 14px;
        }
        .chat-message.user {
            background: linear-gradient(135deg, #ff4e00 0%, #ff4e00 100%);
            color: white;
            align-self: flex-end;
        }
        .chat-message.bot {
            background: #ffffff;
            border: 1px solid rgba(133, 79, 255, 0.2);
            color: #333333;
            align-self: flex-start;
        }
        .chat-input {
            padding: 16px;
            border-top: 1px solid rgba(133, 79, 255, 0.1);
            display: flex;
            gap: 8px;
        }
        .chat-input textarea {
            flex: 1;
            padding: 12px;
            border: 1px solid rgba(133, 79, 255, 0.2);
            border-radius: 8px;
            resize: none;
            font-size: 14px;
        }
        .chat-input button {
            background: linear-gradient(135deg, #ff4e00 0%, #ff4e00 100%);
            color: white;
            border: none;
            border-radius: 8px;
            padding: 0 20px;
            cursor: pointer;
        }
    </style>
</head>
<body>
    <div class="chat-container">
        <div class="brand-header">
            <img src="YOUR_LOGO_URL" alt="Brand">
            <span>YOUR_BRAND_NAME</span>
        </div>
        <div class="chat-messages" id="chat-messages"></div>
        <div class="chat-input">
            <textarea id="chat-input" placeholder="Type your message here..." rows="1"></textarea>
            <button id="send-button">Send</button>
        </div>
    </div>

    <script>
        const config = {
            webhook: {
                url: 'YOUR_WEBHOOK_URL',
                route: 'YOUR_WEBHOOK_ROUTE'
            }
        };
        let currentSessionId = crypto.randomUUID();

        const messagesContainer = document.getElementById('chat-messages');
        const textarea = document.getElementById('chat-input');
        const sendButton = document.getElementById('send-button');

        async function sendMessage(message) {
            const userMessageDiv = document.createElement('div');
            userMessageDiv.className = 'chat-message user';
            userMessageDiv.textContent = message;
            messagesContainer.appendChild(userMessageDiv);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;

            try {
                const response = await fetch(config.webhook.url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        action: 'sendMessage',
                        sessionId: currentSessionId,
                        route: config.webhook.route,
                        chatInput: message,
                        metadata: { userId: '' }
                    })
                });
                const data = await response.json();
                const botMessageDiv = document.createElement('div');
                botMessageDiv.className = 'chat-message bot';
                botMessageDiv.textContent = Array.isArray(data) ? data[0].output : data.output;
                messagesContainer.appendChild(botMessageDiv);
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
            } catch (error) {
                console.error('Error:', error);
            }
        }

        sendButton.addEventListener('click', () => {
            const message = textarea.value.trim();
            if (message) {
                sendMessage(message);
                textarea.value = '';
            }
        });

        textarea.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                const message = textarea.value.trim();
                if (message) {
                    sendMessage(message);
                    textarea.value = '';
                }
            }
        });
    </script>
</body>
</html>
