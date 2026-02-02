# All in 1 AI 

A full-stack AI SaaS platform that provides a comprehensive suite of tools for content creation and image editing. 

##  Features

###  Text & Content Generation (Powered by Gemini API)
* **Intelligent Article & Blog Writing:** Generate high-quality, long-form content tailored to specific topics.
* **Resume Review:** AI-driven analysis and feedback on resumes to improve hiring chances.

###  Image Processing (Powered by Clipdrop & Cloudinary)
* **AI Image Generation:** Create unique images from text prompts.
* **Background Removal:** Instantly remove backgrounds from uploaded images.
* **Object Removal:** Clean up images by removing unwanted objects seamlessly.

###  Platform Features
* **Secure Authentication:** User account management and security handled via **Clerk**.
* **Subscription Management:** Tiered access and payment gating for premium AI tools.
* **Community Hub:** A space for users to share and interact with generated content.
* **History Management:** Relational database storage for user generation history.

---

##  Tech Stack

**Frontend**
* React
* Tailwind CSS

**Backend**
* Node.js
* Express.js

**Database**
* PostgreSQL
* Sequelize ORM

**AI & Services**
* **Google Gemini API:** Text generation.
* **Clipdrop API:** Image manipulation.
* **Cloudinary:** Image storage and optimization.
* **Clerk:** Authentication and User Management.

---

##  Environment Variables

To run this project, you will need to add the environment variables mentioned in .env.example file to your `.env` file:


##  Installation

1.  **Clone the repository**
    ```bash
    git clone [https://github.com/talhayounas/all-in-1-ai.git](https://github.com/talhayounas/all-in-1-ai.git)
    cd all-in-1-ai
    ```

2.  **Setup Backend (Server)**
    Navigate to the server folder, install dependencies, and setup environment variables.
    ```bash
    cd server
    npm install
    # Create a .env file in the /server folder and add your API keys there
    ```

3.  **Setup Frontend (Client)**
    Open a new terminal, navigate to the client folder, and install dependencies.
    ```bash
    cd client
    npm install
    # Create a .env file in the /client folder to connect frontend to backend and also the clerk publishable key
    ```

4.  **Run the Application**
    You will need to run the backend and frontend in separate terminals.

    *Terminal 1 (Server):*
    ```bash
    cd server
    npm start  # or npm run dev
    ```

    *Terminal 2 (Client):*
    ```bash
    cd client
    npm start  # or npm run dev
    ```

---

## 📝 License

This project is licensed under the MIT License.

