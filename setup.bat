@echo off
SETLOCAL ENABLEDELAYEDEXPANSION

echo Creating TeleNanny project structure...

:: Create main project directory if it doesn't exist
if not exist telenanny mkdir telenanny
cd telenanny

:: Frontend setup with Vite
echo Setting up frontend with Vite...
call npm create vite@latest frontend -- --template react
cd frontend
call npm install
echo Frontend setup complete.

:: Go back to main directory
cd ..

:: Backend setup
echo Setting up backend...
mkdir backend
cd backend

:: Initialize backend package.json
echo {> package.json
echo   "name": "telenanny-backend",>> package.json
echo   "version": "1.0.0",>> package.json
echo   "main": "src/server.js",>> package.json
echo   "scripts": {>> package.json
echo     "start": "node src/server.js",>> package.json
echo     "dev": "nodemon src/server.js">> package.json
echo   }>> package.json
echo }>> package.json

:: Install backend dependencies
call npm install express cors dotenv
call npm install nodemon --save-dev

:: Create backend structure
mkdir src
cd src

:: Create server.js
echo const express = require('express');> server.js
echo const cors = require('cors');>> server.js
echo const app = express();>> server.js
echo.>> server.js
echo app.use(cors());>> server.js
echo app.use(express.json());>> server.js
echo.>> server.js
echo // In-memory storage>> server.js
echo let nannies = [];>> server.js
echo.>> server.js
echo // Get all nannies>> server.js
echo app.get('/api/nannies', (req, res) => {>> server.js
echo   res.json(nannies);>> server.js
echo });>> server.js
echo.>> server.js
echo // Add new nanny>> server.js
echo app.post('/api/nannies', (req, res) => {>> server.js
echo   const nanny = { id: Date.now().toString(), ...req.body };>> server.js
echo   nannies.push(nanny);>> server.js
echo   res.status(201).json(nanny);>> server.js
echo });>> server.js
echo.>> server.js
echo // Update nanny>> server.js
echo app.put('/api/nannies/:id', (req, res) => {>> server.js
echo   const { id } = req.params;>> server.js
echo   nannies = nannies.map(nanny =>>> server.js
echo     nanny.id === id ? { ...nanny, ...req.body } : nanny>> server.js
echo   );>> server.js
echo   res.json(nannies.find(nanny => nanny.id === id));>> server.js
echo });>> server.js
echo.>> server.js
echo const PORT = process.env.PORT || 5000;>> server.js
echo app.listen(PORT, () => {>> server.js
echo   console.log(`Server running on port ${PORT}`);>> server.js
echo });>> server.js

:: Go back to main directory
cd ../..

:: Create README
echo # TeleNanny> README.md
echo.>> README.md
echo ## Setup and Running>> README.md
echo.>> README.md
echo 1. Start the backend:>> README.md
echo    ```>> README.md
echo    cd backend>> README.md
echo    npm run dev>> README.md
echo    ```>> README.md
echo.>> README.md
echo 2. Start the frontend:>> README.md
echo    ```>> README.md
echo    cd frontend>> README.md
echo    npm run dev>> README.md
echo    ```>> README.md

:: Create .gitignore
echo node_modules> .gitignore
echo .env>> .gitignore
echo dist>> .gitignore
echo build>> .gitignore
echo .DS_Store>> .gitignore

:: Initialize git repository
git init
git add .
git commit -m "Initial setup"

echo.
echo Setup complete! To start development:
echo 1. cd backend ^& npm run dev
echo 2. Open new terminal
echo 3. cd frontend ^& npm run dev

ENDLOCAL