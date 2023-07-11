# Features:

- register/login/logout
- favorite movies CRUD
- watching movies and tv shows

# Tech Stack

## Back-End:

- TRPC (<a href="https://github.com/jsonnull/electron-trpc">electron-trpc</a>) - for communicating between main and renderer processes
- electron-store - alternative for http cookies in electron
- supabase - postgres database
- upstash - redis database
- zod - validation

## Front-End

- tailwindcss - only way of writing css
- shadcn - tailwind based ui library😍
- react-hook-form with zodResolver - forms
  <br>
  The app is bootstrapped with <a href="https://electron-vite.org/">electron-vite</a>

## Project Setup

### Install

```bash
$ npm install
```

### Development

```bash
$ npm run dev
```

### Build

```bash
# For windows
$ npm run build:win

# For macOS
$ npm run build:mac

# For Linux
$ npm run build:linux
```
