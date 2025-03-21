<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Wrapped Chatbot</title>
    <style>
        body {
            margin: 20px;
            font-family: Arial, sans-serif;
        }
        #chatbot-wrapper {
            width: 100%;
            max-width: 600px;
            height: 700px;
            margin: 0 auto;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 8px 32px rgba(133, 79, 255, 0.15);
            display: flex;
            flex-direction: column;
        }
    </style>
</head>
<body>
    <h1>Welcome to My Page</h1>
    <p>Chat with us below:</p>
    <div id="chatbot-wrapper"></div>

    <!-- Konfiguraatio -->
    <script>
        window.ChatWidgetConfig = {
            webhook: {
                url: 'YOUR_WEBHOOK_URL', // Korvaa toimivalla URL:lla
                route: 'YOUR_WEBHOOK_ROUTE' // Korvaa oikealla reitillä
            },
            branding: {
                logo: 'https://via.placeholder.com/32', // Testilogo
                name: 'Test Brand',
                welcomeText: 'Type anything',
                responseTimeText: 'We reply soon',
                poweredBy: {
                    text: 'Powered by Kasvula AI',
                    link: 'https://kasvu.la/'
                }
            },
            style: {
                primaryColor: '#ff4e00',
                secondaryColor: '#ff4e00',
                backgroundColor: '#ffffff',
                fontColor: '#333333'
            }
        };
    </script>

    <!-- Chatbot-skripti -->
    <script>
        (function() {
            // Create and inject styles
            const styles = `
                .n8n-chat-widget {
                    --chat--color-primary: var(--n8n-chat-primary-color, #ff4e00);
                    --chat--color-secondary: var(--n8n-chat-secondary-color, #ff4e00);
                    --chat--color-background: var(--n8n-chat-background-color, #ffffff);
                    --chat--color-font: var(--n8n-chat-font-color, #333333);
                    font-family: 'Geist Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
                    height: 100%;
                }

                .n8n-chat-widget .chat-container {
                    width: 100%;
                    height: 100%;
                    background: var(--chat--color-background);
                    border-radius: 12px;
                    overflow: hidden;
                    font-family: inherit;
                    display: flex;
                    flex-direction: column;
                }

                .n8n-chat-widget .brand-header {
                    padding: 16px;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    border-bottom: 1px solid rgba(133, 79, 255, 0.1);
                    position: relative;
                }

                .n8n-chat-widget .close-button {
                    position: absolute;
                    right: 16px;
                    top: 50%;
                    transform: translateY(-50%);
                    background: none;
                    border: none;
                    color: var(--chat--color-font);
                    cursor: pointer;
                    padding: 4px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: color 0.2s;
                    font-size: 20px;
                    opacity: 0.6;
                }

                .n8n-chat-widget .close-button:hover {
                    opacity: 1;
                }

                .n8n-chat-widget .brand-header img {
                    width: 32px;
                    height: 32px;
                }

                .n8n-chat-widget .brand-header span {
                    font-size: 18px;
                    font-weight: 500;
                    color: var(--chat--color-font);
                }

                .n8n-chat-widget .new-conversation {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    padding: 20px;
                    text-align: center;
                    width: 100%;
                    max-width: 300px;
                }

                .n8n-chat-widget .welcome-text {
                    font-size: 24px;
                    font-weight: 600;
                    color: var(--chat--color-font);
                    margin-bottom: 24px;
                    line-height: 1.3;
                }

                .n8n-chat-widget .new-chat-btn {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    width: 100%;
                    padding: 16px 24px;
                    background: linear-gradient(135deg, var(--chat--color-primary) 0%, var(--chat--color-secondary) 100%);
                    color: white;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    font-size: 16px;
                    transition: transform 0.3s;
                    font-weight: 500;
                    font-family: inherit;
                    margin-bottom: 12px;
                }

                .n8n-chat-widget .new-chat-btn:hover {
                    transform: scale(1.02);
                }

                .n8n-chat-widget .message-icon {
                    width: 20px;
                    height: 20px;
                }

                .n8n-chat-widget .response-text {
                    font-size: 14px;
                    color: var(--chat--color-font);
                    opacity: 0.7;
                    margin: 0;
                }

                .n8n-chat-widget .chat-interface {
                    display: none;
                    flex-direction: column;
                    height: 100%;
                }

                .n8n-chat-widget .chat-interface.active {
                    display: flex;
                }

                .n8n-chat-widget .chat-messages {
                    flex: 1;
                    overflow-y: auto;
                    padding: 20px;
                    background: var(--chat--color-background);
                    display: flex;
                    flex-direction: column;
                }

                .n8n-chat-widget .chat-message {
                    padding: 12px 16px;
                    margin: 8px 0;
                    border-radius: 12px;
                    max-width: 80%;
                    word-wrap: break-word;
                    font-size: 14px;
                    line-height: 1.5;
                }

                .n8n-chat-widget .chat-message.user {
                    background: linear-gradient(135deg, #a6a7ae 0%, #a6a7ae 100%);
                    color: white;
                    align-self: flex-end;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
                    border: none;
                }

                .n8n-chat-widget .chat-message.bot {
                    background: var(--chat--color-background);
                    border: 1px solid #a6a7ae;
                    color: var(--chat--color-font);
                    align-self: flex-start;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
                }

                .n8n-chat-widget .chat-input {
                    padding: 16px;
                    background: var(--chat--color-background);
                    border-top: 1px solid #a6a7ae;
                    display: flex;
                    gap: 8px;
                }

                .n8n-chat-widget .chat-input textarea {
                    flex: 1;
                    padding: 12px;
                    border: 1px solid #a6a7ae;
                    border-radius: 8px;
                    background: var(--chat--color-background);
                    color: var(--chat--color-font);
                    resize: none;
                    font-family: inherit;
                    font-size: 14px;
                }

                .n8n-chat-widget .chat-input textarea::placeholder {
                    color: var(--chat--color-font);
                    opacity: 0.6;
                }

                .n8n-chat-widget .chat-input button {
                    background: linear-gradient(135deg, var(--chat--color-primary) 0%, var(--chat--color-secondary) 100%);
                    color: white;
                    border: none;
                    border-radius: 8px;
                    padding: 0 20px;
                    cursor: pointer;
                    transition: transform 0.2s;
                    font-family: inherit;
                    font-weight: 500;
                }

                .n8n-chat-widget .chat-input button:hover {
                    transform: scale(1.05);
                }

                .n8n-chat-widget .chat-footer {
                    padding: 8px;
                    text-align: center;
                    background: var(--chat--color-background);
                    border-top: 1px solid #a6a7ae;
                }

                .n8n-chat-widget .chat-footer a {
                    color: var(--chat--color-primary);
                    text-decoration: none;
                    font-size: 12px;
                    opacity: 0.8;
                    transition: opacity 0.2s;
                    font-family: inherit;
                }

                .n8n-chat-widget .chat-footer a:hover {
                    opacity: 1;
                }
            `;

            // Load Geist font
            const fontLink = document.createElement('link');
            fontLink.rel = 'stylesheet';
            fontLink.href = 'https://cdn.jsdelivr.net/npm/geist@1.0.0/dist/fonts/geist-sans/style.css';
            document.head.appendChild(fontLink);

            // Inject styles
            const styleSheet = document.createElement('style');
            styleSheet.textContent = styles;
            document.head.appendChild(styleSheet);

            // Default configuration
            const defaultConfig = {
                webhook: {
                    url: '',
                    route: ''
                },
                branding: {
                    logo: '',
                    name: '',
                    welcomeText: 'Type anything',
                    responseTimeText: '',
                    poweredBy: {
                        text: 'Powered by Kasvula AI',
                        link: 'https://kasvu.la/'
                    }
                },
                style: {
                    primaryColor: '',
                    secondaryColor: '',
                    position: 'right',
                    backgroundColor: '#ffffff',
                    fontColor: '#333333'
                }
            };

            // Merge user config with defaults
            const config = window.ChatWidgetConfig ? 
                {
                    webhook: { ...defaultConfig.webhook, ...window.ChatWidgetConfig.webhook },
                    branding: { ...defaultConfig.branding, ...window.ChatWidgetConfig.branding },
                    style: { ...defaultConfig.style, ...window.ChatWidgetConfig.style }
                } : defaultConfig;

            // Prevent multiple initializations
            if (window.N8NChatWidgetInitialized) return;
            window.N8NChatWidgetInitialized = true;

            let currentSessionId = '';

            // Create widget container
            const widgetContainer = document.createElement('div');
            widgetContainer.className = 'n8n-chat-widget';
            
            // Set CSS variables for colors
            widgetContainer.style.setProperty('--n8n-chat-primary-color', config.style.primaryColor);
            widgetContainer.style.setProperty('--n8n-chat-secondary-color', config.style.secondaryColor);
            widgetContainer.style.setProperty('--n8n-chat-background-color', config.style.backgroundColor);
            widgetContainer.style.setProperty('--n8n-chat-font-color', config.style.fontColor);

            const chatContainer = document.createElement('div');
            chatContainer.className = 'chat-container';
            
            const newConversationHTML = `
                <div class="brand-header">
                    <img src="${config.branding.logo}" alt="${config.branding.name}">
                    <span>${config.branding.name}</span>
                    <button class="close-button">×</button>
                </div>
                <div class="new-conversation">
                    <h2 class="welcome-text">${config.branding.welcomeText}</h2>
                    <button class="new-chat-btn">
                        <svg class="message-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                            <path fill="currentColor" d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.2L4 17.2V4h16v12z"/>
                        </svg>
                        Send us a message
                    </button>
                    <p class="response-text">${config.branding.responseTimeText}</p>
                </div>
            `;

            const chatInterfaceHTML = `
                <div class="chat-interface">
                    <div class="brand-header">
                        <img src="${config.branding.logo}" alt="${config.branding.name}">
                        <span>${config.branding.name}</span>
                        <button class="close-button">×</button>
                    </div>
                    <div class="chat-messages"></div>
                    <div class="chat-input">
                        <textarea placeholder="Type your message here..." rows="1"></textarea>
                        <button type="submit">Send</button>
                    </div>
                    <div class="chat-footer">
                        <a href="${config.branding.poweredBy.link}" target="_blank">${config.branding.poweredBy.text}</a>
                    </div>
                </div>
            `;
            
            chatContainer.innerHTML = newConversationHTML + chatInterfaceHTML;
            widgetContainer.appendChild(chatContainer);

            // Wrap: Liitetään #chatbot-wrapper-elementtiin
            const wrapper = document.getElementById('chatbot-wrapper');
            if (wrapper) {
                wrapper.appendChild(widgetContainer);
            } else {
                console.error('Wrapper element #chatbot-wrapper not found. Appending to body.');
                document.body.appendChild(widgetContainer);
            }

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
                    metadata: {
                        userId: ""
                    }
                }];

                try {
                    const response = await fetch(config.webhook.url, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(data)
                    });

                    const responseData = await response.json();
                    chatContainer.querySelector('.brand-header').style.display = 'none';
                    chatContainer.querySelector('.new-conversation').style.display = 'none';
                    chatInterface.classList.add('active');

                    const botMessageDiv = document.createElement('div');
                    botMessageDiv.className = 'chat-message bot';
                    botMessageDiv.textContent = Array.isArray(responseData) ? responseData[0].output : responseData.output || 'Hello from bot!';
                    messagesContainer.appendChild(botMessageDiv);
                    messagesContainer.scrollTop = messagesContainer.scrollHeight;
                } catch (error) {
                    console.error('Error in startNewConversation:', error);
                    const botMessageDiv = document.createElement('div');
                    botMessageDiv.className = 'chat-message bot';
                    botMessageDiv.textContent = 'Error connecting to server.';
                    messagesContainer.appendChild(botMessageDiv);
                }
            }

            async function sendMessage(message) {
                const messageData = {
                    action: "sendMessage",
                    sessionId: currentSessionId,
                    route: config.webhook.route,
                    chatInput: message,
                    metadata: {
                        userId: ""
                    }
                };

                const userMessageDiv = document.createElement('div');
                userMessageDiv.className = 'chat-message user';
                userMessageDiv.textContent = message;
                messagesContainer.appendChild(userMessageDiv);
                messagesContainer.scrollTop = messagesContainer.scrollHeight;

                try {
                    const response = await fetch(config.webhook.url, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(messageData)
                    });
                    
                    const data = await response.json();
                    
                    const botMessageDiv = document.createElement('div');
                    botMessageDiv.className = 'chat-message bot';
                    botMessageDiv.textContent = Array.isArray(data) ? data[0].output : data.output || 'Bot response';
                    messagesContainer.appendChild(botMessageDiv);
                    messagesContainer.scrollTop = messagesContainer.scrollHeight;
                } catch (error) {
                    console.error('Error in sendMessage:', error);
                    const botMessageDiv = document.createElement('div');
                    botMessageDiv.className = 'chat-message bot';
                    botMessageDiv.textContent = 'Error sending message.';
                    messagesContainer.appendChild(botMessageDiv);
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

            // Piilotetaan close-button, koska ei tarvita upotetussa versiossa
            const closeButtons = chatContainer.querySelectorAll('.close-button');
            closeButtons.forEach(button => {
                button.style.display = 'none';
            });
        })();
    </script>
</body>
</html>
