<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Chatbot</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/geist@1.0.0/dist/fonts/geist-sans/style.css">
    <style>
        body {
            margin: 0;
            padding: 0;
            height: 100vh;
            font-family: 'Geist Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
            background: var(--chat--color-background, #ffffff);
            color: var(--chat--color-font, #333333);
            overflow: hidden;
        }

        .chat-container {
            display: flex;
            flex-direction: column;
            height: 100%;
            width: 100%;
            background: var(--chat--color-background);
            border-radius: 12px;
            box-shadow: 0 8px 32px rgba(133, 79, 255, 0.15);
            border: 1px solid rgba(133, 79, 255, 0.2);
            overflow: hidden;
        }

        /* Loput tyyleistäsi lähes ennallaan, poistetaan vain kiinteä asemointi ja toggle-painike */
        .brand-header {
            padding: 16px;
            display: flex;
            align-items: center;
            gap: 12px;
            border-bottom: 1px solid rgba(133, 79, 255, 0.1);
            position: relative;
        }

        .close-button {
            position: absolute;
            right: 16px;
            top: 50%;
            transform: translateY(-50%);
            background: none;
            border: none;
            color: var(--chat--color-font);
            cursor: pointer;
            padding: 4px;
            font-size: 20px;
            opacity: 0.6;
        }

        .close-button:hover {
            opacity: 1;
        }

        .brand-header img {
            width: 32px;
            height: 32px;
        }

        .brand-header span {
            font-size: 18px;
            font-weight: 500;
            color: var(--chat--color-font);
        }

        .new-conversation {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            padding: 20px;
            text-align: center;
            width: 100%;
            max-width: 300px;
        }

        .welcome-text {
            font-size: 24px;
            font-weight: 600;
            color: var(--chat--color-font);
            margin-bottom: 24px;
            line-height: 1.3;
        }

        .new-chat-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            width: 100%;
            padding: 16px 24px;
            background: linear-gradient(135deg, var(--chat--color-primary, #ff4e00) 0%, var(--chat--color-secondary, #ff4e00) 100%);
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 16px;
            transition: transform 0.3s;
            font-weight: 500;
            margin-bottom: 12px;
        }

        .new-chat-btn:hover {
            transform: scale(1.02);
        }

        .message-icon {
            width: 20px;
            height: 20px;
        }

        .response-text {
            font-size: 14px;
            color: var(--chat--color-font);
            opacity: 0.7;
            margin: 0;
        }

        .chat-interface {
            display: none;
            flex-direction: column;
            height: 100%;
        }

        .chat-interface.active {
            display: flex;
        }

        .chat-messages {
            flex: 1;
            overflow-y: auto;
            padding: 20px;
            background: var(--chat--color-background);
            display: flex;
            flex-direction: column;
        }

        .chat-message {
            padding: 12px 16px;
            margin: 8px 0;
            border-radius: 12px;
            max-width: 80%;
            word-wrap: break-word;
            font-size: 14px;
            line-height: 1.5;
        }

        .chat-message.user {
            background: linear-gradient(135deg, var(--chat--color-primary, #ff4e00) 0%, var(--chat--color-secondary, #ff4e00) 100%);
            color: white;
            align-self: flex-end;
            box-shadow: 0 4px 12px rgba(133, 79, 255, 0.2);
        }

        .chat-message.bot {
            background: var(--chat--color-background);
            border: 1px solid rgba(133, 79, 255, 0.2);
            color: var(--chat--color-font);
            align-self: flex-start;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        }

        .chat-input {
            padding: 16px;
            background: var(--chat--color-background);
            border-top: 1px solid rgba(133, 79, 255, 0.1);
            display: flex;
            gap: 8px;
        }

        .chat-input textarea {
            flex: 1;
            padding: 12px;
            border: 1px solid rgba(133, 79, 255, 0.2);
            border-radius: 8px;
            background: var(--chat--color-background);
            color: var(--chat--color-font);
            resize: none;
            font-size: 14px;
        }

        .chat-input textarea::placeholder {
            color: var(--chat--color-font);
            opacity: 0.6;
        }

        .chat-input button {
            background: linear-gradient(135deg, var(--chat--color-primary, #ff4e00) 0%, var(--chat--color-secondary, #ff4e00) 100%);
            color: white;
            border: none;
            border-radius: 8px;
            padding: 0 20px;
            cursor: pointer;
            transition: transform 0.2s;
            font-weight: 500;
        }

        .chat-input button:hover {
            transform: scale(1.05);
        }

        .chat-footer {
            padding: 8px;
            text-align: center;
            background: var(--chat--color-background);
            border-top: 1px solid rgba(133, 79, 255, 0.1);
        }

        .chat-footer a {
            color: var(--chat--color-primary, #ff4e00);
            text-decoration: none;
            font-size: 12px;
            opacity: 0.8;
            transition: opacity 0.2s;
        }

        .chat-footer a:hover {
            opacity: 1;
        }
    </style>
</head>
<body>
    <div class="chat-container">
        <div class="brand-header">
            <img src="YOUR_LOGO_URL" alt="YOUR_BRAND_NAME">
            <span>YOUR_BRAND_NAME</span>
            <button class="close-button">×</button>
        </div>
        <div class="new-conversation">
            <h2 class="welcome-text">YOUR_WELCOME_TEXT</h2>
            <button class="new-chat-btn">
                <svg class="message-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.2L4 17.2V4h16v12z"/>
                </svg>
                Send us a message
            </button>
            <p class="response-text">YOUR_RESPONSE_TIME_TEXT</p>
        </div>
        <div class="chat-interface">
            <div class="brand-header">
                <img src="YOUR_LOGO_URL" alt="YOUR_BRAND_NAME">
                <span>YOUR_BRAND_NAME</span>
                <button class="close-button">×</button>
            </div>
            <div class="chat-messages"></div>
            <div class="chat-input">
                <textarea placeholder="Type your message here..." rows="1"></textarea>
                <button type="submit">Send</button>
            </div>
            <div class="chat-footer">
                <a href="YOUR_POWERED_BY_LINK" target="_blank">Powered by YOUR_BRAND</a>
            </div>
        </div>
    </div>

    <script>
        // JavaScript-logiikka ennallaan, mutta ilman toggle-toimintoa
        const config = {
            webhook: {
                url: 'YOUR_WEBHOOK_URL',
                route: 'YOUR_WEBHOOK_ROUTE'
            },
            branding: {
                logo: 'YOUR_LOGO_URL',
                name: 'YOUR_BRAND_NAME',
                welcomeText: 'YOUR_WELCOME_TEXT',
                responseTimeText: 'YOUR_RESPONSE_TIME_TEXT',
                poweredBy: {
                    text: 'Powered by YOUR_BRAND',
                    link: 'YOUR_POWERED_BY_LINK'
                }
            },
            style: {
                primaryColor: '#ff4e00',
                secondaryColor: '#ff4e00',
                backgroundColor: '#ffffff',
                fontColor: '#333333'
            }
        };

        document.documentElement.style.setProperty('--n8n-chat-primary-color', config.style.primaryColor);
        document.documentElement.style.setProperty('--n8n-chat-secondary-color', config.style.secondaryColor);
        document.documentElement.style.setProperty('--n8n-chat-background-color', config.style.backgroundColor);
        document.documentElement.style.setProperty('--n8n-chat-font-color', config.style.fontColor);

        let currentSessionId = '';

        const chatContainer = document.querySelector('.chat-container');
        const newChatBtn = chatContainer.querySelector('.new-chat-btn');
        const chatInterface = chatContainer.querySelector('.chat-interface');
        const messagesContainer = chatContainer.querySelector('.chat-messages');
        const textarea = chatContainer.querySelector('textarea');
        const sendButton = chatContainer.querySelector('button[type="submit"]');

        function generateUUID() {
            return crypto.randomUUID();
        }

        async function startNewConversation() {
            currentSessionId = generateUUID();
            const data = [{
                action: "loadPreviousSession",
                sessionId: currentSessionId,
                route: config.webhook.route,
                metadata: { userId: "" }
            }];

            try {
                const response = await fetch(config.webhook.url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });

                const responseData = await response.json();
                chatContainer.querySelector('.brand-header').style.display = 'none';
                chatContainer.querySelector('.new-conversation').style.display = 'none';
                chatInterface.classList.add('active');

                const botMessageDiv = document.createElement('div');
                botMessageDiv.className = 'chat-message bot';
                botMessageDiv.textContent = Array.isArray(responseData) ? responseData[0].output : responseData.output;
                messagesContainer.appendChild(botMessageDiv);
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
            } catch (error) {
                console.error('Error:', error);
            }
        }

        async function sendMessage(message) {
            const messageData = {
                action: "sendMessage",
                sessionId: currentSessionId,
                route: config.webhook.route,
                chatInput: message,
                metadata: { userId: "" }
            };

            const userMessageDiv = document.createElement('div');
            userMessageDiv.className = 'chat-message user';
            userMessageDiv.textContent = message;
            messagesContainer.appendChild(userMessageDiv);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;

            try {
                const response = await fetch(config.webhook.url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(messageData)
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

        newChatBtn.addEventListener('click', startNewConversation);
        
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

        document.querySelectorAll('.close-button').forEach(button => {
            button.style.display = 'none'; // Poistetaan sulkemispainike iframe-versiosta
        });
    </script>
</body>
</html>
