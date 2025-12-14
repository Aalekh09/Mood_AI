# 🧠 Mood AI - AI-Powered Mental Wellness Companion

Mood AI

A comprehensive full-stack web application that provides AI-powered emotional support and mental wellness guidance using OpenAI's GPT model.

## 🌟 Features

- 🤖 **Real-time AI Chat** - Empathetic, context-aware responses powered by OpenAI GPT-3.5
- 📊 **Sentiment Analysis** - Automatic mood detection (Positive/Negative/Neutral)
- 📈 **Mood Tracking** - Personal dashboard with analytics and visualizations
- 🎵 **Smart Recommendations** - Song suggestions, breathing exercises, coping strategies
- 🔒 **Secure Authentication** - JWT-based auth with BCrypt password encryption
- 👻 **Anonymous Mode** - Chat without creating an account
- 👑 **Admin Panel** - User management and system analytics
- 📱 **Responsive Design** - Works seamlessly on all devices
  
## 📸 Screenshots

### Landing Page
<img width="1919" height="1079" alt="image" src="https://github.com/user-attachments/assets/87195841-e2bd-4eb5-9225-1d9f936afaa4" />


### Chat Interface
<img width="1919" height="1079" alt="image" src="https://github.com/user-attachments/assets/0f3d6574-c8df-49c7-ab98-53f927614a6e" />

### Dashboard
<img width="1919" height="1079" alt="image" src="https://github.com/user-attachments/assets/73e4ec42-0c4f-4e6e-b4c6-8f4a68d8ab6f" />


## 🛠️ Tech Stack

### Backend
- **Framework:** Java Spring Boot 3.x
- **Security:** Spring Security 6 + JWT
- **Database:** MySQL with JPA/Hibernate
- **AI Integration:** OpenAI API (GPT-3.5-turbo)
- **Build Tool:** Maven

### Frontend
- **Library:** React 18
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **Routing:** React Router v6
- **HTTP Client:** Axios
- **State Management:** Context API

## 📋 Prerequisites

- Java 17+
- Node.js 18+
- MySQL 8+
- Maven 3.8+
- OpenAI API Key

## 🚀 Installation & Setup

### Backend Setup

1. Clone the repository
```bash
git clone https://github.com/AalekhKumar/mood-ai.git
cd mood-ai/backend/demo
```

2. Configure application.properties
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/mood_ai
spring.datasource.username=root
spring.datasource.password=your_password

jwt.secret=your-secret-key-min-256-bits
openai.api.key=your-openai-api-key
```

3. Create database
```sql
CREATE DATABASE mood_ai;
```

4. Run the application
```bash
mvn spring-boot:run
```

Backend will start on: `http://localhost:8080`

### Frontend Setup

1. Navigate to frontend directory
```bash
cd frontend
```

2. Install dependencies
```bash
npm install
```

3. Start development server
```bash
npm run dev
```

Frontend will start on: `http://localhost:5173`

## 📚 API Documentation

### Authentication Endpoints

#### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "fullName": "John Doe"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

### Chat Endpoints

#### Send Message
```http
POST /api/chat/send
Authorization: Bearer {token}
Content-Type: application/json

{
  "message": "I'm feeling anxious today"
}
```

#### Get Chat History
```http
GET /api/chat/history
Authorization: Bearer {token}
```

### Admin Endpoints

#### Get All Users
```http
GET /api/admin/users
Authorization: Bearer {admin-token}
```

#### Get Analytics
```http
GET /api/admin/analytics
Authorization: Bearer {admin-token}
```

## 🎯 Key Features Explained

### 1. AI-Powered Responses
The application uses OpenAI's GPT-3.5-turbo model to generate empathetic, context-aware responses. The AI is specifically prompted to act as a mental wellness companion.

### 2. Sentiment Analysis
Each user message is analyzed for sentiment using keyword detection and intensity scoring. The system identifies:
- Positive emotions (happy, excited, grateful)
- Negative emotions (sad, anxious, stressed)
- Neutral states

### 3. Mood-Based Recommendations
Based on detected sentiment, the AI provides:
- **Positive mood:** Celebration, energy-maintaining activities
- **Negative mood:** Coping strategies, calming techniques, breathing exercises
- **Neutral mood:** Exploratory questions, balanced activities

### 4. Conversation Context
The system maintains conversation history to provide contextually relevant responses, making interactions feel more natural and personalized.

## 🔐 Security Features

- **Password Encryption:** BCrypt with salt
- **JWT Authentication:** Stateless token-based auth
- **Role-Based Access:** USER and ADMIN roles
- **CORS Protection:** Configured for frontend origin
- **SQL Injection Prevention:** JPA/Hibernate parameterized queries

## 📊 Database Schema

### Users Table
```sql
CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    role ENUM('USER', 'ADMIN'),
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

### Chats Table
```sql
CREATE TABLE chats (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT,
    message TEXT NOT NULL,
    response TEXT NOT NULL,
    sentiment VARCHAR(50),
    mood_score DECIMAL(3,2),
    is_anonymous BOOLEAN,
    created_at TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

## 🚦 Testing

### Backend Tests
```bash
cd backend/demo
mvn test
```

### Frontend Tests
```bash
cd frontend
npm test
```

## 📈 Future Enhancements

- [ ] Mobile app (React Native)
- [ ] Voice input/output
- [ ] Push notifications
- [ ] Multilingual support
- [ ] Advanced analytics with ML
- [ ] Integration with wearable devices
- [ ] Group therapy sessions
- [ ] Professional therapist matching

## 👨‍💻 Author

**Aalekh Kumar**
- GitHub: [@Aalekh09](https://github.com/Aalekh09)
- LinkedIn: [Aalekh Kumar](https://www.linkedin.com/in/aalekh09/)
- Email: aalekh09kumar@gmail.com

**Education:** B.Tech CSE, Manav Rachna University (2026)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- OpenAI for providing the GPT API
- Spring Boot community for excellent documentation
- React and Vite teams for amazing tools
- Tailwind CSS for the utility-first approach

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## ⭐ Show your support

Give a ⭐️ if this project helped you!

---

Made with ❤️ by Aalekh Kumar
