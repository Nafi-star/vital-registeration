# Learn NestJS Backend – Step-by-Step Guide

This guide teaches you how to build the backend for the Vital Events Registration app using **NestJS**. Do each step yourself so you learn by doing.

---

## Part 1: Prepare Your Environment

### Step 1.1 – Check Node and npm

Open **PowerShell** or **Command Prompt** and run:

```bash
node -v
npm -v
```

- You should see version numbers (e.g. `v20.x.x` and `10.x.x`).
- **Why:** NestJS runs on Node.js; npm installs packages.

---

### Step 1.2 – Create the Backend Folder

You will keep the **frontend** and **backend** in separate folders.

1. Open **File Explorer** and go to: `C:\Users\hp\Documents`
2. You should see your frontend folder: `vital-registration`
3. **Create a new folder** in the same place:
   - Right-click → **New** → **Folder**
   - Name it: `vital-api`
4. So you have:
   - `Documents\vital-registration`  → frontend (React)
   - `Documents\vital-api`           → backend (NestJS)

**Why separate folders?**  
Frontend and backend are two different apps. They will run on different ports (e.g. frontend 5173, backend 3000) and talk to each other via HTTP.

---

### Step 1.3 – Install NestJS CLI

The Nest CLI creates projects and generates modules, controllers, and services for you.

In the terminal, run (one time, globally):

```bash
npm install -g @nestjs/cli
```

Then check it:

```bash
nest --version
```

You should see something like `10.x.x`.  
**What it is:** A command-line tool to create and manage NestJS projects.

---

## Part 2: Create Your First NestJS Project

### Step 2.1 – Create the Project Inside `vital-api`

1. In the terminal, go to your **Documents** folder:

   ```bash
   cd C:\Users\hp\Documents
   ```

2. Create a new NestJS app **inside** the folder you created:

   ```bash
   cd vital-api
   nest new . --package-manager npm --skip-git
   ```

   - **`.`** = use the current folder (`vital-api`)
   - **`--package-manager npm`** = use npm (you can use `yarn` if you prefer)
   - **`--skip-git`** = don’t init a git repo (you can add it later)

3. Wait for npm to install. When it finishes, your `vital-api` folder will be full of NestJS files.

**What just happened?**  
The CLI created a full NestJS app: entry point, root module, a sample controller and service, and config files.

---

### Step 2.2 – See the Project Structure

In File Explorer or in your editor, open the `vital-api` folder. You should see something like:

```
vital-api/
├── node_modules/     ← installed packages (don’t edit)
├── src/              ← your code lives here
│   ├── main.ts       ← app starts here
│   ├── app.module.ts ← root module
│   ├── app.controller.ts
│   └── app.service.ts
├── package.json      ← scripts and dependencies
├── tsconfig.json      ← TypeScript config
└── nest-cli.json     ← Nest CLI config
```

**Short explanation:**

- **`main.ts`** – Starts the app, listens on a port (e.g. 3000).
- **`app.module.ts`** – Root **module**; it imports other modules and ties the app together.
- **`app.controller.ts`** – **Controller**: defines routes (e.g. `GET /`).
- **`app.service.ts`** – **Service**: holds business logic; controllers call services.

---

### Step 2.3 – Run the Backend

In the terminal, make sure you’re inside `vital-api`, then run:

```bash
npm run start:dev
```

- **`start:dev`** = run in development mode with auto-restart on file changes.

Open a browser and go to: **http://localhost:3000**

You should see: **Hello World!**

**What happened?**  
Nest started an HTTP server. The default route `GET /` is handled by `AppController`, which uses `AppService` to return “Hello World!”.

---

### Step 2.4 – Understand the Request Flow (Important)

When you open http://localhost:3000:

1. Browser sends: **GET /** to the server.
2. **Router** (Nest) matches the path to a controller method.
3. **AppController** has a method for `GET /` that returns `this.appService.getHello()`.
4. **AppService.getHello()** returns `"Hello World!"`.
5. Nest sends that string back to the browser.

So: **Route → Controller → Service → Response.**

You will repeat this pattern for Birth, Death, Marriage, Divorce: each will have its own **module**, **controller**, and **service**.

---

## Part 3: Main NestJS Ideas (Before Going Deeper)

### Module

- A **module** groups related parts of the app (controllers, services).
- Example: `BirthsModule` will contain everything for birth records.
- **`app.module.ts`** is the root: it imports `BirthsModule`, `DeathsModule`, etc.

### Controller

- **Controllers** define **routes** and HTTP methods (GET, POST, PATCH, DELETE).
- They don’t do business logic; they call **services** and return the result.

### Service

- **Services** hold the **business logic** and talk to the **database**.
- Controllers are thin; services do the real work.

### DTO (Data Transfer Object)

- A **DTO** is a class that describes the **shape of data** (e.g. request body for creating a birth record).
- We use them for validation (e.g. “child_name is required”) and for clear types.

---

## Part 4: Next Steps (After You Finish Part 1–3)

Once you are comfortable with:

- Creating the folder and the Nest project
- Running `npm run start:dev` and seeing “Hello World!”
- The idea of Module → Controller → Service

we will:

1. **Add a database** (PostgreSQL + Prisma) and define tables that match your frontend (birth, death, marriage, divorce).
2. **Create the `births` module** (controller + service + DTOs) and implement:
   - `POST /births` – create a birth record
   - `GET /births` – list birth records (with optional filters)
   - `GET /births/:id` – get one record
   - `PATCH /births/:id` – e.g. update status
3. **Repeat the same pattern** for deaths, marriages, divorces.
4. **Connect your React frontend** to this API (e.g. the birth form sends data to `POST http://localhost:3000/births`).

---

## Quick Reference – Commands You’ll Use

| What you want to do     | Command |
|--------------------------|--------|
| Go to backend folder    | `cd C:\Users\hp\Documents\vital-api` |
| Install dependencies     | `npm install` |
| Run backend (dev)       | `npm run start:dev` |
| Run backend (prod)      | `npm run start` |
| Build for production    | `npm run build` |

---

## If Something Goes Wrong

- **“nest: command not found”**  
  Run again: `npm install -g @nestjs/cli`, then close and reopen the terminal.

- **“Cannot find module”**  
  Make sure you’re in the `vital-api` folder and run `npm install`.

- **Port 3000 already in use**  
  Either stop the other app using 3000, or change the port in `src/main.ts` (e.g. `await app.listen(3001)`).

---

When you have done **Part 1 and Part 2** (folder created, project created, “Hello World!” in the browser), tell me and we’ll go to **Part 4** together: adding the database and the first real module (births).
