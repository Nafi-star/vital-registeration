# Vital API – Step-by-step backend guide

Work through these steps in order. Run each command and add each piece of code yourself so you learn by doing.

---

## Part 1: Database with Prisma and PostgreSQL

### Step 1.1 – Install Prisma

**What you’ll learn:** Prisma is an ORM: it turns your schema into TypeScript types and database tables.

**Do this:**

1. Open a terminal in the `vital-api` folder.
2. Run:

```bash
npm install @prisma/client
npm install -D prisma
```

**Verify:** In `package.json` you should see `@prisma/client` under `dependencies` and `prisma` under `devDependencies`.

---

### Step 1.2 – Create Prisma config and schema

**What you’ll learn:** `prisma/schema.prisma` defines your database provider and models (tables).

**Do this:**

1. Run:

```bash
npx prisma init
```

This creates a `prisma` folder with `schema.prisma`.

2. Open `prisma/schema.prisma`. Set the provider and add a placeholder for the database URL:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

3. Create a `.env` file in the **root of vital-api** (same level as `package.json`):

```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/vital_db"
```

Replace `USER` and `PASSWORD` with your PostgreSQL username and password. If you don’t have PostgreSQL yet, see **Step 1.3** first.

---

### Step 1.3 – Install PostgreSQL (if you don’t have it)

**Options:**

- **Local:** Install [PostgreSQL](https://www.postgresql.org/download/) and create a database, e.g. `createdb vital_db`.
- **Docker:**  
  `docker run --name vital-pg -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=vital_db -p 5432:5432 -d postgres`  
  Then use `DATABASE_URL="postgresql://postgres:postgres@localhost:5432/vital_db"`.
- **Cloud:** Use a free tier (e.g. Neon, Supabase) and put the connection string in `DATABASE_URL`.

---

### Step 1.4 – Add the vital events models to the schema

**What you’ll learn:** Each `model` in Prisma becomes a table. Fields match your frontend types.

**Do this:**

Open `prisma/schema.prisma` and add these models **after** the `datasource db` block:

```prisma
model Birth {
  id                String   @id @default(uuid())
  birth_regno       String   @unique
  child_name        String
  mother_name       String
  father_name       String
  date_of_birth     String
  sex               String
  city              String
  kebele            String
  house_number      String
  nationality       String
  registration_date String
  status            String  @default("Pending")
  created_at        DateTime @default(now())
  updated_at        DateTime @updatedAt
  created_by        String?
}

model Death {
  id                String   @id @default(uuid())
  death_regno       String   @unique
  name              String
  date_of_birth     String
  date_of_death     String
  cause_of_death    String
  sex               String
  city              String
  kebele            String
  house_number      String
  nationality       String
  registration_date String
  birth_regno       String?
  status            String  @default("Pending")
  created_at        DateTime @default(now())
  updated_at        DateTime @updatedAt
  created_by        String?
}

model Marriage {
  id                String   @id @default(uuid())
  marriage_regno    String   @unique
  husband_name      String
  husband_age       Int
  husband_nationality String
  wife_name         String
  wife_age          Int
  wife_nationality  String
  date_of_marriage  String
  city              String
  kebele            String
  house_number      String
  registration_date String
  status            String  @default("Pending")
  created_at        DateTime @default(now())
  updated_at        DateTime @updatedAt
  created_by        String?
}

model Divorce {
  id                String   @id @default(uuid())
  divorce_regno     String   @unique
  husband_name      String
  husband_age       Int
  husband_nationality String
  wife_name         String
  wife_age          Int
  wife_nationality  String
  date_of_divorce   String
  requester         String
  city              String
  kebele            String
  house_number      String
  registration_date String
  status            String  @default("Pending")
  created_at        DateTime @default(now())
  updated_at        DateTime @updatedAt
  created_by        String?
}
```

Save the file.

---

### Step 1.5 – Create the database tables (first migration)

**What you’ll learn:** Migrations apply your schema to the real database.

**Do this:**

```bash
npx prisma migrate dev --name init
```

When prompted, confirm. This creates a migration in `prisma/migrations` and updates the database.

**Verify:** Run `npx prisma studio` and open the app in the browser. You should see tables: Birth, Death, Marriage, Divorce.

---

### Step 1.6 – Generate the Prisma Client

**What you’ll learn:** Prisma Client is the code you use in Nest to read/write the database.

**Do this:**

```bash
npx prisma generate
```

Run this again whenever you change `schema.prisma`. You’ll use the generated client in the next part.

---

## Part 2: Use Prisma inside Nest (PrismaService + PrismaModule)

### Step 2.1 – Create PrismaService

**What you’ll learn:** In Nest, services are injectable. We wrap the Prisma client in a service so every module can use it and the connection is closed on app shutdown.

**Do this:**

1. Create the file `src/prisma/prisma.service.ts`:

```typescript
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
```

2. Create the file `src/prisma/prisma.module.ts`:

```typescript
import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
```

`@Global()` means any module can inject `PrismaService` without importing `PrismaModule` again.

3. In `src/app.module.ts`, add `PrismaModule` to `imports`:

```typescript
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

**Verify:** Run `npm run start:dev`. The app should start without errors.

---

## Part 3: Births module (your first CRUD API)

### Step 3.1 – Create DTOs for births

**What you’ll learn:** DTOs (Data Transfer Objects) define and validate the shape of data coming from the client.

**Do this:**

1. Create the folder `src/births` if it doesn’t exist.
2. Create `src/births/dto/create-birth.dto.ts`:

```typescript
export class CreateBirthDto {
  birth_regno: string;
  child_name: string;
  mother_name: string;
  father_name: string;
  date_of_birth: string;
  sex: 'Male' | 'Female';
  city: string;
  kebele: string;
  house_number: string;
  nationality: string;
  registration_date: string;
  created_by?: string;
}
```

3. Create `src/births/dto/update-birth-status.dto.ts`:

```typescript
export class UpdateBirthStatusDto {
  status: 'Pending' | 'Approved' | 'Rejected';
}
```

---

### Step 3.2 – Create BirthsService

**What you’ll learn:** The service contains business logic and uses Prisma to talk to the database.

**Do this:**

Create `src/births/births.service.ts`:

```typescript
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBirthDto } from './dto/create-birth.dto';
import { UpdateBirthStatusDto } from './dto/update-birth-status.dto';

@Injectable()
export class BirthsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateBirthDto) {
    return this.prisma.birth.create({
      data: {
        ...dto,
        status: 'Pending',
      },
    });
  }

  async findAll(status?: string) {
    return this.prisma.birth.findMany({
      where: status ? { status } : undefined,
      orderBy: { created_at: 'desc' },
    });
  }

  async findOne(id: string) {
    return this.prisma.birth.findUniqueOrThrow({
      where: { id },
    });
  }

  async updateStatus(id: string, dto: UpdateBirthStatusDto) {
    return this.prisma.birth.update({
      where: { id },
      data: { status: dto.status },
    });
  }
}
```

---

### Step 3.3 – Create BirthsController

**What you’ll learn:** Controllers define routes. Each method maps to an HTTP method and path.

**Do this:**

Create `src/births/births.controller.ts`:

```typescript
import { Controller, Get, Post, Patch, Body, Param, Query } from '@nestjs/common';
import { BirthsService } from './births.service';
import { CreateBirthDto } from './dto/create-birth.dto';
import { UpdateBirthStatusDto } from './dto/update-birth-status.dto';

@Controller('births')
export class BirthsController {
  constructor(private readonly birthsService: BirthsService) {}

  @Post()
  create(@Body() dto: CreateBirthDto) {
    return this.birthsService.create(dto);
  }

  @Get()
  findAll(@Query('status') status?: string) {
    return this.birthsService.findAll(status);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.birthsService.findOne(id);
  }

  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body() dto: UpdateBirthStatusDto) {
    return this.birthsService.updateStatus(id, dto);
  }
}
```

---

### Step 3.4 – Register BirthsModule

**Do this:**

1. Create `src/births/births.module.ts`:

```typescript
import { Module } from '@nestjs/common';
import { BirthsController } from './births.controller';
import { BirthsService } from './births.service';

@Module({
  controllers: [BirthsController],
  providers: [BirthsService],
})
export class BirthsModule {}
```

2. In `src/app.module.ts`, add `BirthsModule` to `imports`:

```typescript
import { BirthsModule } from './births/births.module';

@Module({
  imports: [PrismaModule, BirthsModule],
  // ...
})
export class AppModule {}
```

**Verify:**

- Run `npm run start:dev`.
- Open http://localhost:3000/births in the browser (should return `[]`).
- Use Postman or curl to test:
  - `POST http://localhost:3000/births` with JSON body (all fields from `CreateBirthDto`).
  - `GET http://localhost:3000/births`.
  - `GET http://localhost:3000/births?status=Pending`.

---

## Part 4: Repeat for Deaths, Marriages, Divorces

**What you’ll learn:** The same pattern: DTOs → Service → Controller → Module.

**Do this:**

1. For each of **deaths**, **marriages**, **divorces**:
   - Create a folder: `src/deaths`, `src/marriages`, `src/divorces`.
   - Add DTOs that match the Prisma models (create + update-status).
   - Add a service that uses `this.prisma.death` / `this.prisma.marriage` / `this.prisma.divorce`.
   - Add a controller with `@Controller('deaths')` etc. and the same routes: `POST /`, `GET /`, `GET /:id`, `PATCH /:id/status`.
   - Create a module and register it in `AppModule`.

2. Use your frontend `types.ts` (BirthRecord, DeathRecord, etc.) as a reference for field names in the DTOs.

---

## Part 5: CORS and optional validation

### Step 5.1 – Enable CORS for the frontend

**What you’ll learn:** Browsers block requests from one origin (e.g. Vite on port 5173) to another (API on port 3000) unless the API allows it with CORS.

**Do this:**

In `src/main.ts`, enable CORS before `listen`:

```typescript
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://localhost:5173', // or your Vite dev URL
    credentials: true,
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
```

---

### Step 5.2 – (Optional) Add validation with class-validator

**What you’ll learn:** Validating incoming bodies so invalid data is rejected before it hits the database.

**Do this:**

1. Install:

```bash
npm install class-validator class-transformer
```

2. In `src/main.ts`, add a global validation pipe:

```typescript
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.enableCors({ origin: 'http://localhost:5173', credentials: true });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
```

3. In your DTOs, add decorators, e.g. in `create-birth.dto.ts`:

```typescript
import { IsString, IsIn, IsOptional } from 'class-validator';

export class CreateBirthDto {
  @IsString()
  birth_regno: string;
  @IsString()
  child_name: string;
  // ... @IsString() on string fields
  @IsIn(['Male', 'Female'])
  sex: 'Male' | 'Female';
  @IsOptional()
  @IsString()
  created_by?: string;
}
```

---

## Quick reference

| Step | Command / action |
|------|-------------------|
| Prisma migrate | `npx prisma migrate dev --name <name>` |
| Regenerate client | `npx prisma generate` |
| Open DB UI | `npx prisma studio` |
| Run API | `npm run start:dev` |

---

## Next steps after you finish

- In the React app, replace in-memory state with `fetch` or axios calls to `http://localhost:3000/births`, `/deaths`, etc.
- Add error handling (e.g. `NotFoundException` in Nest and handling 4xx/5xx in the frontend).
- Optionally add authentication (e.g. JWT) and set `created_by` from the logged-in user.

If you tell me which step you’re on (e.g. “Step 1.4” or “Part 3”), I can give you the exact code for your project or help debug errors.
