
        let micActive = true;
        let cameraActive = true;
        let currentStream = null;
        let mediaRecorder = null;
        let recordedChunks = [];
        let isRecording = false;
        let recordingTimer = null;
        let recordingStartTime = 0;
        let currentQuestionId = null;
        let questionAudio = null;
        let currentQuestionIndex = -1;
        let audioContext = null;
        let analyser = null;

        const interviewQuestions = [
            {
                id: 'Q001',
                text: 'Tell me about yourself and your background in software development.',
                audioText: 'Tell me about yourself and your background in software development.'
            },
            {
                id: 'Q002', 
                text: 'What programming languages are you most comfortable with and why?',
                audioText: 'What programming languages are you most comfortable with and why?'
            },
            {
                id: 'Q003',
                text: 'Describe a challenging project you worked on and how you overcame the difficulties.',
                audioText: 'Describe a challenging project you worked on and how you overcame the difficulties.'
            },
            {
                id: 'Q004',
                text: 'How do you stay updated with the latest technology trends?',
                audioText: 'How do you stay updated with the latest technology trends?'
            },
            {
                id: 'Q005',
                text: 'What is your approach to debugging and troubleshooting code?',
                audioText: 'What is your approach to debugging and troubleshooting code?'
            }
        ];

        const analytics = {
            trackEvent: (event, data) => {
                console.log(`Event: ${event}`, data);
            }
        };

        window.addEventListener('load', () => {
            initializeCamera();
            setupAudioVisualizer();
            setupKeyboardNavigation();
        });

        window.addEventListener('unload', () => {
            if (currentStream) {
                currentStream.getTracks().forEach(track => track.stop());
            }
            if (recordingTimer) {
                clearInterval(recordingTimer);
            }
            if (audioContext) {
                audioContext.close();
            }
        });

        async function initializeCamera() {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ 
                    video: { width: 640, height: 480 }, 
                    audio: true 
                });
                currentStream = stream;
                updateMainVideo();
                setupAudioVisualizer();
                analytics.trackEvent('camera_initialized', { timestamp: Date.now() });
            } catch (error) {
                console.error('Camera initialization error:', error);
                showToast('Failed to access camera/microphone. Please check permissions.', 'error');
            }
        }

        async function setupAudioVisualizer() {
            try {
                if (!currentStream) return;

                audioContext = new (window.AudioContext || window.webkitAudioContext)();
                analyser = audioContext.createAnalyser();
                const source = audioContext.createMediaStreamSource(currentStream);
                source.connect(analyser);
                analyser.fftSize = 256;

                const bufferLength = analyser.frequencyBinCount;
                const dataArray = new Uint8Array(bufferLength);
                const bars = document.querySelectorAll('.audio-bar');

                function updateVisualizer() {
                    if (!analyser) return;
                    analyser.getByteFrequencyData(dataArray);
                    bars.forEach((bar, index) => {
                        const value = dataArray[index * 4] || 0;
                        bar.style.height = `${Math.min(value / 2, 100)}px`;
                    });
                    requestAnimationFrame(updateVisualizer);
                }

                updateVisualizer();
            } catch (error) {
                console.error('Error setting up audio visualizer:', error);
                showToast('Failed to initialize audio visualizer.', 'error');
            }
        }

        function showToast(message, type = 'info') {
            const toast = document.createElement('div');
            toast.className = `toast ${type}`;
            toast.textContent = message;
            document.body.appendChild(toast);
            setTimeout(() => {
                toast.style.opacity = '0';
                setTimeout(() => toast.remove(), 500);
            }, 3000);
        }

        function getNextQuestion() {
            currentQuestionIndex = Math.floor(Math.random() * interviewQuestions.length);
            const question = interviewQuestions[currentQuestionIndex];
            currentQuestionId = question.id;

            document.getElementById('questionDisplay').innerHTML = question.text;
            document.getElementById('currentQuestionId').textContent = `Question ID: ${question.id}`;
            document.getElementById('playBtn').disabled = false;
            document.getElementById('recordBtn').disabled = false;
            addMessage('INTERVIEWER', question.text);
            analytics.trackEvent('next_question', { questionId: currentQuestionId, timestamp: Date.now() });

            if (currentQuestionIndex >= 0) {
                playQuestion();
            }
        }

        async function playQuestion() {
            if (currentQuestionIndex < 0) return;

            const question = interviewQuestions[currentQuestionIndex];

            if (questionAudio) {
                questionAudio.pause();
                questionAudio = null;
            }

            if ('speechSynthesis' in window) {
                const utterance = new SpeechSynthesisUtterance(question.audioText);
                utterance.rate = 0.9;
                utterance.pitch = 1;
                utterance.volume = 0.8;

                const playBtn = document.getElementById('playBtn');
                playBtn.innerHTML = '⏸️ Playing...';
                playBtn.disabled = true;

                utterance.onend = () => {
                    playBtn.innerHTML = '▶️ Play Question';
                    playBtn.disabled = false;
                };

                utterance.onerror = () => {
                    playBtn.innerHTML = '▶️ Play Question';
                    playBtn.disabled = false;
                    showToast('Audio playback failed. Please try again.', 'error');
                };

                speechSynthesis.speak(utterance);
                if (!isRecording) {
                    await startRecording();
                }
            } else {
                showToast('Speech synthesis not supported in this browser.', 'error');
            }
        }

        async function toggleRecording() {
            if (!currentStream) {
                showToast('Please enable camera and microphone first.', 'error');
                return;
            }

            if (!isRecording) {
                await startRecording();
            } else {
                stopRecording();
            }
        }

        async function startRecording() {
            try {
                recordedChunks = [];
                mediaRecorder = new MediaRecorder(currentStream, {
                    mimeType: 'video/webm'
                });

                mediaRecorder.ondataavailable = (event) => {
                    if (event.data.size > 0) {
                        recordedChunks.push(event.data);
                    }
                };

                mediaRecorder.onstop = () => {
                    const blob = new Blob(recordedChunks, { type: 'video/webm' });
                    const url = URL.createObjectURL(blob);
                    addMessage('SYSTEM', `Response recorded for ${currentQuestionId} (${formatTime(Date.now() - recordingStartTime)})`);
                    analytics.trackEvent('stop_recording', { 
                        questionId: currentQuestionId, 
                        duration: Date.now() - recordingStartTime 
                    });

                    const previewDiv = document.createElement('div');
                    previewDiv.className = 'recording-preview';
                    previewDiv.style.cssText = `
                        position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
                        background: #1a1a1a; padding: 20px; border-radius: 12px;
                        border: 1px solid #333; z-index: 1000;
                    `;
                    previewDiv.innerHTML = `
                        <video src="${url}" controls style="max-width: 400px; max-height: 300px;"></video>
                        <div style="margin-top: 10px; display: flex; gap: 10px;">
                            <button class="btn" style="background: var(--primary-color); color: black;" onclick="downloadRecording('${url}', '${currentQuestionId}')" aria-label="Download recording">Download</button>
                            <button class="btn" style="background: #ff4444; color: white;" onclick="this.parentElement.parentElement.remove()" aria-label="Close preview">Close</button>
                        </div>
                    `;
                    document.body.appendChild(previewDiv);
                };

                mediaRecorder.start();
                isRecording = true;
                recordingStartTime = Date.now();

                const recordBtn = document.getElementById('recordBtn');
                recordBtn.innerHTML = '⏹️ Stop Recording';
                recordBtn.classList.add('recording');
                document.getElementById('recordingStatus').querySelector('.status-indicator').innerHTML = '🔴 Recording';
                startRecordingTimer();
                analytics.trackEvent('start_recording', { questionId: currentQuestionId, timestamp: Date.now() });
            } catch (error) {
                console.error('Error starting recording:', error);
                showToast('Failed to start recording. Please check permissions.', 'error');
            }
        }

        function stopRecording() {
            if (mediaRecorder && isRecording) {
                mediaRecorder.stop();
                isRecording = false;

                const recordBtn = document.getElementById('recordBtn');
                recordBtn.innerHTML = '🔴 Start Recording';
                recordBtn.classList.remove('recording');
                document.getElementById('recordingStatus').querySelector('.status-indicator').innerHTML = '⚪ Ready';

                if (recordingTimer) {
                    clearInterval(recordingTimer);
                    recordingTimer = null;
                }
            }
        }

        function startRecordingTimer() {
            recordingTimer = setInterval(() => {
                const elapsed = Date.now() - recordingStartTime;
                document.getElementById('recordingTimer').textContent = formatTime(elapsed);
            }, 1000);
        }

        function formatTime(milliseconds) {
            const seconds = Math.floor(milliseconds / 1000);
            const minutes = Math.floor(seconds / 60);
            const remainingSeconds = seconds % 60;
            return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
        }

        function toggleCamera() {
            const camButton = document.getElementById('camButton');
            cameraActive = !cameraActive;

            if (cameraActive) {
                camButton.classList.add('active');
                camButton.innerHTML = '📹';
                if (!currentStream) {
                    initializeCamera();
                } else {
                    updateMainVideo(true);
                }
            } else {
                camButton.classList.remove('active');
                camButton.innerHTML = '📷';
                updateMainVideo(false);
                if (currentStream) {
                    currentStream.getVideoTracks().forEach(track => track.stop());
                    currentStream = null;
                    if (audioContext) {
                        audioContext.close();
                        audioContext = null;
                        analyser = null;
                    }
                }
            }
        }

        function updateMainVideo(isActive = cameraActive) {
            const videoMain = document.querySelector('.video-main');
            if (isActive && currentStream) {
                videoMain.innerHTML = `
                    <div class="video-label">VIDEO</div>
                    <video style="width: 100%; height: 100%; object-fit: cover;" autoplay muted playsinline id="mainVideo"></video>
                `;
                const mainVideo = document.getElementById('mainVideo');
                mainVideo.srcObject = currentStream;
            } else {
                videoMain.innerHTML = `
                    <div class="video-label">VIDEO</div>
                    <div style="width: 100%; height: 100%; background: linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%); display: flex; align-items: center; justify-content: center; color: #666; font-size: 18px;">
                        📷 Camera Off
                    </div>
                `;
            }
        }

        function toggleMic() {
            const micButton = document.getElementById('micButton');
            micActive = !micActive;

            if (micActive) {
                micButton.classList.add('active');
                micButton.innerHTML = '🎤';
            } else {
                micButton.classList.remove('active');
                micButton.innerHTML = '🔇';
            }

            if (currentStream) {
                currentStream.getAudioTracks().forEach(track => {
                    track.enabled = micActive;
                });
            }
        }

        function applyTheme(color) {
            document.documentElement.style.setProperty('--primary-color', color);
            document.querySelectorAll('.color-option').forEach(opt => {
                opt.classList.remove('active');
                if (opt.style.background === color) {
                    opt.classList.add('active');
                }
            });
            showToast('Theme updated!', 'info');
        }

        function toggleSettings() {
            showToast('Settings panel would open here.', 'info');
        }

        function disconnect() {
            if (confirm('Are you sure you want to disconnect?')) {
                if (currentStream) {
                    currentStream.getTracks().forEach(track => track.stop());
                    currentStream = null;
                }
                if (isRecording) {
                    stopRecording();
                }
                if (audioContext) {
                    audioContext.close();
                    audioContext = null;
                    analyser = null;
                }
                showToast('Disconnected from meeting.', 'info');
                analytics.trackEvent('disconnect', { timestamp: Date.now() });
            }
        }

        function sendMessage() {
            const input = document.querySelector('.chat-input');
            const message = input.value.trim();
            if (!message) return;

            addMessage('USER', message);
            input.value = '';

            const typingDiv = document.createElement('div');
            typingDiv.className = 'typing-indicator';
            typingDiv.textContent = 'Interviewer is typing...';
            document.querySelector('.chat-messages').appendChild(typingDiv);
            document.querySelector('.chat-messages').scrollTop = document.querySelector('.chat-messages').scrollHeight;

            setTimeout(async () => {
                typingDiv.remove();
                const aiResponse = await getAIResponse(message);
                addMessage('INTERVIEWER', aiResponse);
            }, 1500);
        }

        async function getAIResponse(message) {
            const responses = [
                "That's a great point! Can you elaborate further?",
                "Interesting perspective. How would you apply this in a real-world scenario?",
                "Thank you for sharing. Let's explore another aspect of this topic."
            ];
            return responses[Math.floor(Math.random() * responses.length)];
        }

        function addMessage(sender, text) {
            const messagesContainer = document.querySelector('.chat-messages');
            const messageDiv = document.createElement('div');

            if (sender === 'INTERVIEWER') {
                messageDiv.className = 'agent-message';
                messageDiv.innerHTML = `
                    <div class="agent-label">INTERVIEWER</div>
                    <div class="message-text">${text}</div>
                `;
            } else if (sender === 'SYSTEM') {
                messageDiv.className = 'system-message';
                messageDiv.style.cssText = `
                    background: rgba(255, 165, 0, 0.1);
                    border-left: 3px solid #ffa500;
                    padding: 15px;
                    border-radius: 8px;
                    margin-bottom: 15px;
                `;
                messageDiv.innerHTML = `
                    <div style="color: #ffa500; font-size: 12px; font-weight: 600; text-transform: uppercase; margin-bottom: 8px;">SYSTEM</div>
                    <div class="message-text">${text}</div>
                `;
            } else {
                messageDiv.className = 'user-message';
                messageDiv.style.cssText = `
                    background: rgba(0, 136, 255, 0.1);
                    border-left: 3px solid #0088ff;
                    padding: 15px;
                    border-radius: 8px;
                    margin-bottom: 15px;
                `;
                messageDiv.innerHTML = `
                    <div style="color: #0088ff; font-size: 12px; font-weight: 600; text-transform: uppercase; margin-bottom: 8px;">USER</div>
                    <div class="message-text">${text}</div>
                `;
            }

            messagesContainer.appendChild(messageDiv);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
            analytics.trackEvent('message_sent', { sender, text, timestamp: Date.now() });
        }

        function handleChatKeyPress(event) {
            if (event.key === 'Enter') {
                sendMessage();
            }
        }

        function downloadRecording(url, questionId) {
            const a = document.createElement('a');
            a.href = url;
            a.download = `recording_${questionId}.webm`;
            a.click();
            analytics.trackEvent('download_recording', { questionId, timestamp: Date.now() });
        }

        function setupKeyboardNavigation() {
            document.querySelectorAll('.btn, .cam-button, .mic-button').forEach(btn => {
                btn.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        btn.click();
                    }
                });
            });
        }
    