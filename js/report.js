document.addEventListener('DOMContentLoaded', () => {
  const questionsContainer = document.getElementById('questions-container');
  const errorMessage = document.getElementById('error-message');
  const backToAnalysisBtn = document.getElementById('back-to-analysis');

  // ✅ Hardcoded Interview Report Data
  const data = {
    questions: [
      "What are your strengths?",
      "Describe a difficult situation and how you handled it.",
      "Why do you want this job?"
    ],
    answers: [
      "I am highly organized, self-motivated, and quick to learn new skills.",
      "I once had to manage a team project with tight deadlines. I created a clear roadmap and assigned tasks effectively.",
      "Because this company aligns with my values and offers the professional growth I seek."
    ],
    feedback: [
      "Good response with clarity and confidence.",
      "Strong example of leadership and problem-solving.",
      "Relevant motivation; could mention specific company goals."
    ],
    scores: [9, 8, 7]
  };

  if (!data.questions || data.questions.length === 0) {
    errorMessage.textContent = 'No questions available to display.';
    errorMessage.style.display = 'block';
    return;
  }

  questionsContainer.innerHTML = '';

  data.questions.forEach((question, index) => {
    const answer = data.answers[index] || 'No answer provided';
    const feedback = data.feedback[index] || 'No feedback provided';
    const score = data.scores[index] || '0';
    const scoreOutOf100 = parseInt(score) * 10;

    const card = document.createElement('div');
    card.className = 'question-card';
    card.innerHTML = `
      <h4>Question ${index + 1}: ${question}</h4>
      <p><strong>Answer:</strong> ${answer}</p>
      <p><strong>Feedback:</strong> ${feedback}</p>
      <div class="score-highlight">Score: ${scoreOutOf100}/100</div>
    `;
    questionsContainer.appendChild(card);
  });

  // Back to analysis
  backToAnalysisBtn.addEventListener('click', () => {
    window.location.href = 'interview-analysis.html';
  });
});
