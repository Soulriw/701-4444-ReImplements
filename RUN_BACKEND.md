# How to Run the Backend

## Prerequisites

Make sure you have the following installed:
- **Java 17** or higher (Java 21 detected ✅)
- **Internet connection** (for Railway MySQL database)

To check if you have Java installed:
```bash
java -version
```

**Note:** You don't need to install Maven manually! The project includes Maven Wrapper (`mvnw.cmd` for Windows or `mvnw` for Linux/Mac) that will automatically download and use Maven for you.

## Running the Backend

### Method 1: Using Maven Wrapper (Recommended - No Maven Installation Needed)

**IMPORTANT:** Make sure you're in the project root directory (`C:\Users\HP User\Desktop\Assignment\Metric\Project`)

Open a terminal and run:

**For Windows PowerShell:**
```powershell
cd "C:\Users\HP User\Desktop\Assignment\Metric\Project"
.\mvnw.cmd spring-boot:run
```

**Alternative (if you're already in the project folder):**
```powershell
.\mvnw.cmd spring-boot:run
```

**For Linux/Mac:**
```bash
./mvnw spring-boot:run
```

The server will start on **http://localhost:3000**

**Note:** The first time you run this, Maven will download all dependencies (this may take a few minutes).

### Method 2: If You Have Maven Installed

Open a terminal in the project root directory and run:
```bash
mvn spring-boot:run
```

The server will start on **http://localhost:3000**

### Method 3: Build and Run JAR

First, build the project:
```bash
.\mvnw.cmd clean install
```

Then run the JAR file:
```bash
java -jar target/quadgrimoire-1.0.0.jar
```

### Method 4: Using IDE (IntelliJ IDEA / Eclipse)

1. Import the project as a Maven project
2. Find `QuadGrimoireApplication.java`
3. Right-click and select "Run"

## Database Configuration

The project is configured to use a **Railway MySQL database**:
- Database is already set up and running
- Connection details are in `application.properties`
- Tables will be auto-validated on startup

## API Endpoints

Your backend API will be available at:
- Base URL: `http://localhost:3000`
- API endpoints: `http://localhost:3000/api/...`

Available endpoints:
- `POST /api/login` - User/Admin login
- `POST /api/register` - User registration
- `GET /api/books` - Get all books
- `GET /api/categories` - Get all categories
- `POST /api/cart` - Add to cart
- `GET /api/history` - Get purchase history
- And more...

## CORS Configuration

The backend is configured to accept requests from:
- `http://localhost:5173` (Vite default)
- `http://localhost:3000`

## Troubleshooting

### Port 3000 already in use
If port 3000 is occupied, change it in `main/resources/application.properties`:
```
server.port=8080
```

### Database connection error
- Check your internet connection
- Verify Railway database is running
- Check credentials in `application.properties`

### Maven build fails
```bash
mvn clean install -DskipTests
```

## Stopping the Server

Press `Ctrl + C` in the terminal where the server is running.

