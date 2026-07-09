(function() {
    function initWidget() {
        const BACKEND_URL = 'https://sal-ai-bot.onrender.com/chat';
        const TEASER_DELAY = 6000;
        const TEASER_DURATION = 10000;
        
        const styles = `
            .sal-chat-container { position: fixed; bottom: 20px; right: 20px; z-index: 9999; font-family: 'Segoe UI', sans-serif; }
            .sal-chat-btn { width: 60px; height: 60px; border-radius: 50%; background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); color: #fff; border: none; cursor: pointer; box-shadow: 0 0 15px rgba(59, 130, 246, 0.6); display: flex; justify-content: center; align-items: center; font-size: 24px; animation: salPulse 2s infinite; position: relative; transition: transform 0.2s; }
            .sal-chat-btn:hover { transform: scale(1.1); }
            @keyframes salPulse { 0% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7); } 70% { box-shadow: 0 0 0 18px rgba(59, 130, 246, 0); } 100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); } }
            .sal-teaser-bubble { position: absolute; bottom: 85px; right: 10px; background: #1e293b; color: #f8fafc; padding: 12px 16px; border-radius: 20px 20px 4px 20px; font-size: 13px; max-width: 260px; box-shadow: 0 10px 25px rgba(0,0,0,0.5); cursor: pointer; border: 1px solid #334155; animation: fadeInUp 0.3s ease; transition: opacity 0.3s ease; opacity: 0; pointer-events: none; }
            .sal-teaser-bubble.show { opacity: 1; pointer-events: auto; }
            @keyframes fadeInUp { from { transform: translateY(10px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
            .sal-chat-window { display: none; width: 370px; height: 520px; background: #0f172a; border-radius: 16px; box-shadow: 0 10px 30px rgba(0,0,0,0.6); flex-direction: column; overflow: hidden; position: absolute; bottom: 90px; right: 0; border: 1px solid #334155; }
            .sal-chat-window.active { display: flex; }
            .sal-chat-header { background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); padding: 15px 18px; color: #fff; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #334155; }
            .sal-chat-header h3 { margin: 0; font-size: 16px; font-weight: 600; }
            .sal-chat-header p { margin: 2px 0 0 0; font-size: 11px; color: #94a3b8; }
            .sal-close-btn { background: none; border: none; color: #fff; font-size: 22px; cursor: pointer; }
            .sal-chat-messages { flex: 1; padding: 15px; overflow-y: auto; background: #0f172a; }
            .sal-msg { margin-bottom: 10px; max-width: 80%; padding: 10px 14px; border-radius: 12px; font-size: 14px; line-height: 1.4; word-wrap: break-word; animation: fadeInUp 0.25s ease; }
            .sal-msg.bot { background: #1e293b; color: #f8fafc; border-bottom-left-radius: 4px; margin-right: auto; border: 1px solid #334155; }
            .sal-msg.user { background: #3b82f6; color: #fff; border-bottom-right-radius: 4px; margin-left: auto; }
            .sal-quick-replies { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 10px; margin-bottom: 10px; }
            .sal-quick-reply { background: #1e293b; color: #f8fafc; border: 1px solid #334155; padding: 8px 14px; border-radius: 20px; font-size: 13px; cursor: pointer; transition: background 0.2s; }
            .sal-quick-reply:hover { background: #334155; }
            .sal-typing-indicator { display: none; padding: 10px 14px; background: #1e293b; border-radius: 12px; border-bottom-left-radius: 4px; max-width: 60px; margin-bottom: 10px; margin-right: auto; border: 1px solid #334155; animation: fadeInUp 0.2s ease; }
            .sal-typing-indicator span { display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: #94a3b8; margin-right: 4px; animation: typing 1.4s infinite ease-in-out; }
            .sal-typing-indicator span:nth-child(2) { animation-delay: 0.2s; }
            .sal-typing-indicator span:nth-child(3) { animation-delay: 0.4s; }
            @keyframes typing { 0%, 60%, 100% { transform: translateY(0); } 30% { transform: translateY(-8px); } }
            .sal-chat-input { display: flex; padding: 12px; background: #1e293b; border-top: 1px solid #334155; }
            .sal-chat-input input { flex: 1; padding: 10px 14px; border: 1px solid #475569; border-radius: 24px; background: #0f172a; color: #fff; outline: none; font-size: 14px; }
            .sal-chat-input input::placeholder { color: #94a3b8; }
            .sal-chat-input button { background: #3b82f6; color: #fff; border: none; width: 42px; height: 42px; border-radius: 50%; margin-left: 8px; cursor: pointer; font-size: 16px; transition: background 0.2s; }
            .sal-chat-input button:hover { background: #2563eb; }
            .sal-chat-input button:disabled { background: #475569; cursor: not-allowed; }
            @media (max-width: 480px) { .sal-chat-window { width: calc(100vw - 40px); height: 70vh; bottom: 80px; right: 10px; } }
        `;
        
        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
        
        document.body.insertAdjacentHTML('beforeend', `
            <div class="sal-chat-container">
                <div class="sal-teaser-bubble" id="teaserBubble"> <strong>Struggling to get leads?</strong><br>I can show you how our AI automation fills your pipeline in 5 minutes.</div>
                <div class="sal-chat-window" id="chatWindow">
                    <div class="sal-chat-header">
                        <div><h3>SAL Digital AI</h3><p>Strategic Growth Consultant • Online</p></div>
                        <button class="sal-close-btn" onclick="toggleChat()">×</button>
                    </div>
                    <div class="sal-chat-messages" id="chatMessages"></div>
                    <div class="sal-typing-indicator" id="typingIndicator"><span></span><span></span><span></span></div>
                    <div class="sal-chat-input">
                        <input type="text" id="userInput" placeholder="Type your message..." onkeypress="handleEnter(event)">
                        <button id="sendBtn" onclick="sendMessage()">➤</button>
                    </div>
                </div>
                <button class="sal-chat-btn" id="chatFAB" onclick="toggleChat()">💬</button>
            </div>
        `);
        
        let sessionId = localStorage.getItem('sal_session_id');
        if (!sessionId) { sessionId = 'web-' + Math.random().toString(36).substr(2, 9); localStorage.setItem('sal_session_id', sessionId); }
        let quickRepliesShown = false;
        let isWaiting = false;
        
        const chatWindow = document.getElementById('chatWindow');
        const chatMessages = document.getElementById('chatMessages');
        const userInput = document.getElementById('userInput');
        const typingIndicator = document.getElementById('typingIndicator');
        const teaserBubble = document.getElementById('teaserBubble');
        const chatFAB = document.getElementById('chatFAB');
        const sendBtn = document.getElementById('sendBtn');
        
        let teaserTimeout;
        
        function showTeaser() { teaserBubble.classList.add('show'); teaserTimeout = setTimeout(hideTeaser, TEASER_DURATION); }
        function hideTeaser() { teaserBubble.classList.remove('show'); clearTimeout(teaserTimeout); }
        teaserBubble.addEventListener('click', () => { hideTeaser(); toggleChat(true); });
        setTimeout(showTeaser, TEASER_DELAY);
        
        window.toggleChat = function(forceOpen = false) {
            const isActive = chatWindow.classList.contains('active');
            if (forceOpen || !isActive) {
                chatWindow.classList.add('active');
                showInitialGreeting();
                if (!quickRepliesShown) showQuickReplies();
                userInput.focus();
            } else { chatWindow.classList.remove('active'); }
            hideTeaser();
        }
        
        function showQuickReplies() {
            if (quickRepliesShown) return;
            quickRepliesShown = true;
            const replies = [ { text: "🚀 Get more leads", action: "I need more leads and customers" }, { text: "🤖 Automate my admin", action: "I want to automate manual work" }, { text: "🌐 New website", action: "I need a better website that converts" }, { text: "📈 Just exploring", action: "Just exploring services" } ];
            const container = document.createElement('div'); container.className = 'sal-quick-replies'; container.id = 'quickRepliesContainer';
            replies.forEach(r => {
                const btn = document.createElement('button'); btn.className = 'sal-quick-reply'; btn.textContent = r.text;
                btn.addEventListener('click', () => { const qc = document.getElementById('quickRepliesContainer'); if (qc) qc.remove(); sendMessage(r.action); });
                container.appendChild(btn);
            });
            chatMessages.appendChild(container); chatMessages.scrollTop = chatMessages.scrollHeight;
        }
        
        function showTyping() { typingIndicator.style.display = 'block'; chatMessages.scrollTop = chatMessages.scrollHeight; }
        function hideTyping() { typingIndicator.style.display = 'none'; }
        
        window.sendMessage = async function(predefinedText = null) {
            if (isWaiting) return;
            const messageText = predefinedText || userInput.value.trim();
            if (!messageText) return;
            isWaiting = true; sendBtn.disabled = true;
            addMessage('user', messageText);
            if (!predefinedText) userInput.value = '';
            showTyping();
            try {
                const response = await fetch(BACKEND_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message: messageText, session_id: sessionId }) });
                if (!response.ok) throw new Error('Network response was not ok');
                const data = await response.json();
                hideTyping();
                let cleanReply = data.reply.replace(/<tool_call>.*?<\/tool_call>/gs, '').trim();
                addMessage('bot', cleanReply);
            } catch (error) { hideTyping(); addMessage('bot', "Connecting to server..."); console.error('Backend error:', error); } 
            finally { isWaiting = false; sendBtn.disabled = false; userInput.focus(); }
        }
        
        function addMessage(type, text) { const msgDiv = document.createElement('div'); msgDiv.className = `sal-msg ${type}`; msgDiv.textContent = text; chatMessages.appendChild(msgDiv); chatMessages.scrollTop = chatMessages.scrollHeight; }
        window.handleEnter = function(event) { if (event.key === 'Enter') sendMessage(); }
        function showInitialGreeting() { if (chatMessages.querySelector('.sal-msg.bot')) return; addMessage('bot', "Hello! I'm the Strategic Growth Consultant for SAL Digital. Tell me about your business challenge, and I'll help you find the right solution."); }
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initWidget);
    } else {
        initWidget();
    }
})();