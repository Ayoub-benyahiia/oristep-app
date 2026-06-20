# Oristep - Premium Origami Lab 🦢

Oristep is a premium, mobile-first MVP application designed to help users learn the art of origami. It features an immersive folding experience, progress tracking, local achievements, paper stash management, and a highly polished UI.

## 🎨 Design Philosophy ("Professional Polish")
The application implements a "Professional Polish" design theme:
- **Typography:** `Playfair Display` for elegant serif headings and `Inter` for clean, readable sans-serif UI elements.
- **Colors:** A paper-inspired palette with soft whites (`#FFFFFF`), off-white backgrounds (`#F9F7F4`), subtle creases (`#EBE6DE`), and deep ink text (`#2D2D2D`).
- **Styling:** Gentle shadows, heavily rounded cards (`rounded-[2rem]`), minimalist borders, and glass-morphism effects.

## ✨ Key Features
- **Daily Fold Recommendations**: A deterministic logic recommends a single pattern every day.
- **Home:** Dashboard showing the current active pattern and featured origami projects.
- **Browse:** Search and filter through available patterns by categories (Animals, Objects, Modular, etc.).
- **Pattern Detail:** View estimated time, difficulty, and total steps before starting.
- **Fold Mode:** The core experience. An immersive, distraction-free view guiding the user step-by-step with progress tracking.
- **Projects & Achievements:** Easy access to currently "In Progress" folds, saved "Favorites", and gamified folding milestones (badges, streak tracking).
- **Settings & Paper Stash:** Track the origami paper you own including sizes, colors, and types, and manage app preferences. 

## 🛠️ Tech Stack
- React 19 + TypeScript
- Vite
- Tailwind CSS
- React Router v6.28 with v7 future flags
- `motion` (Framer Motion)
- `lucide-react`
- Supabase for published origami pattern content
- Context API & `localStorage` for user progress and preferences

## 📂 Architecture & State Management
- `Supabase`: Published pattern content and folding steps are fetched read-only by the mobile app.
- `Context API & localStorage`: User state like favorites, progress, completed projects, achievements, streaks, onboarding preferences, settings, and paper stash are managed via React Context and stored locally using `localStorage`.

## 🔒 Privacy & Local Storage
Oristep loads published origami pattern content from Supabase. Mobile users do not need an account. Progress, favorites, completed projects, paper stash, achievements, streaks, onboarding preferences, and settings stay on the device using `localStorage` and are not synced to Supabase by the mobile app.

The app does not include ads, analytics, payments, or mobile account login, and does not sell personal data. Android Internet permission is used to fetch published origami content from Supabase. Local app data can be cleared from the Settings view without affecting unrelated data.

## 📱 Android Readiness
This application is designed specifically with mobile-first constraints using a `max-w-md` viewport lock, ensuring it acts as an elegant native-like experience before conversion.

## 🚀 Local Development
Start the development server:
```bash
npm run dev
```

Build for production:
```bash
npm run build
npm run preview
```

## Android / Google Play readiness

The Android wrapper is managed with Capacitor.

- Capacitor app id: `com.oristep.app`
- App name: `Oristep`
- Web output copied to Android: `dist`
- Android version name: `1.0.0`
- Android version code: `1`
- Current generated Android SDK settings: min SDK 24, target SDK 36
- Google Play upload artifact: signed Android App Bundle (`.aab`)

Useful commands:
```bash
npm install
npm run build
npx cap sync android
npx cap open android
```

Debug build:
```bash
cd android
./gradlew assembleDebug
```

Release bundle:
```bash
cd android
./gradlew bundleRelease
```

Expected release bundle path:
```text
android/app/build/outputs/bundle/release/app-release.aab
```

Before Play Console upload, complete the remaining release tasks:
- Generate and securely store a Play upload keystore.
- Sign the release AAB with the upload key.
- Host a public privacy policy URL.
- Complete Play Console Data safety, content rating, target audience, ads, and app access declarations.
- Prepare store listing copy, 512x512 icon, 1024x500 feature graphic, and phone screenshots.
- Run internal or closed testing before production release.
