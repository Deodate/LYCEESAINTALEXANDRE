from flask import Flask, request, jsonify
from sentence_transformers import SentenceTransformer, util
import numpy as np
# import PyPDF2 # Keep this import if you plan to read from PDF later

app = Flask(__name__)

# Load a pre-trained sentence transformer model
# 'all-MiniLM-L6-v2' is a good balance of speed and performance
model = SentenceTransformer('all-MiniLM-L6-v2')

# --- Knowledge Base (Simulated from your Q&A source) ---
# In a real application, this would be loaded from a database, file, or parsed from your PDF
knowledge_base = [
    {"question": "What are the admission requirements?", "answer": "Admission requirements include completed application form, transcripts, recommendation letters, and standardized test scores."},
    {"question": "When is the application deadline?", "answer": "The application deadline for the next academic year is usually in March. Please check the official website for the exact date."},
    {"question": "What programs do you offer?", "answer": "We offer a variety of programs in Science, Arts, and Commerce streams. Visit our website for details on each program."},
    {"question": "How can I contact the school?", "answer": "You can contact us via email at info@lycee.edu or call us at +25 123 456 789."},
    {"question": "Where is the school located?", "answer": "The school is located at [School Address]. You can find directions on our contact page."}
]

# Create embeddings for the questions in the knowledge base
kb_questions = [item["question"] for item in knowledge_base]
kb_question_embeddings = model.encode(kb_questions, convert_to_tensor=True)

# --- Chat Endpoint ---
@app.route('/chat', methods=['POST'])
def chat():
    user_message = request.json.get('message')
    if not user_message:
        return jsonify({'error': 'No message provided'}), 400

    # Convert the user message to an embedding
    user_message_embedding = model.encode(user_message, convert_to_tensor=True)

    # Compute cosine-similarity between the user message and all kb questions
    cosine_scores = util.cos_sim(user_message_embedding, kb_question_embeddings)[0]

    # Find the best match
    best_match_index = np.argmax(cosine_scores.cpu()).item()
    best_score = cosine_scores[best_match_index].item()

    # Define a similarity threshold (you might need to adjust this)
    similarity_threshold = 0.6

    if best_score >= similarity_threshold:
        # If a good match is found, return the corresponding answer
        response = knowledge_base[best_match_index]["answer"]
    else:
        # If no good match is found, return a fallback message
        response = "I'm sorry, I don't have information on that topic. Can you please rephrase your question?"

    return jsonify({'response': response})

# --- Main Execution ---
if __name__ == '__main__':
    # Consider using a production-ready WSGI server like Gunicorn in production
    # When deploying, set debug=False
    app.run(debug=True, port=5000) 