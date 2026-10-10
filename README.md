# Calmora — Wellness Companion Demo

**Tagline:** Understand your feelings. Find your balance.

Calmora is a responsive, multi-view frontend portfolio project built with HTML5, CSS3, vanilla JavaScript (ES6+), Bootstrap 5, and Bootstrap Icons. It is a static website; it does not connect to an AI model, account service, medical service, or notification provider.

## Run locally

1. Extract the `calmora.zip` file.
2. Open the `calmora` folder in Visual Studio Code or another editor.
3. Start a simple local server. In VS Code, you can use the free Live Server extension, then open `index.html` with Live Server. Alternatively, with Python installed, run `python -m http.server 8000` from the `calmora` folder and visit `http://localhost:8000`.
4. Internet access is needed for the Bootstrap CDN, Bootstrap Icons, and Google Fonts. The page structure and custom CSS are local.

No npm install, API key, database, or backend is required.

## Included views and interactions

- [x] Premium landing page with responsive navigation and anchored sections
- [x] Demo sign-in and registration forms, validation, password visibility toggle, and Continue with Demo
- [x] Dashboard with mood check-in, weekly mood chart, recent journal preview, and activity suggestions
- [x] Mood tracker with five mood levels, optional notes, history, delete and clear controls
- [x] Journal with create, edit, delete, search, reflection prompt, and character count
- [x] Wellness studio with guided breathing start/pause/resume/reset, grounding checklist, mindful-minute timer, and reflection prompt
- [x] Simulated companion chat with starter prompts, Enter-to-send, clear chat, and supportive predefined responses
- [x] Settings with editable local demo profile, dark/light theme, demo notification preference, JSON export, and clear-data action
- [x] Local storage error handling, safe text rendering for user-generated content, keyboard focus styles, reduced-motion support, and responsive layouts
- [x] Visible privacy and wellness disclaimers

## Privacy and safety notes

- Mood entries, journal entries, profile details, and preferences are saved in this browser's `localStorage`.
- Browser localStorage is **not encrypted**. Do not enter sensitive personal information.
- The demo sign-in form never sends or saves passwords. It is not real authentication.
- The companion uses predefined JavaScript responses. It is not real AI, cannot monitor risk, and cannot contact emergency services.
- Calmora is not a medical service, does not diagnose conditions, and is not a substitute for qualified professional care.
- Use **Settings → Clear all local data** to remove locally stored demo data.

## Suggested manual QA checklist

The project was authored to support the following checks. These are manual test steps, not a claim that automated browser tests have been run.

- [ ] Open the landing page and test navigation links and mobile menu.
- [ ] Use Continue with Demo and verify the dashboard opens.
- [ ] Save a mood entry and verify it appears in Mood Tracker and the weekly view.
- [ ] Create, search, edit, and delete a journal entry.
- [ ] Start, pause, resume, and reset guided breathing.
- [ ] Try grounding, the mindful-minute timer, and a reflection prompt.
- [ ] Send a message in the companion, press Enter to send, and clear the chat.
- [ ] Toggle the theme, refresh, and confirm it persists.
- [ ] Export JSON and inspect the downloaded file.
- [ ] Clear local data and confirm mood/journal/profile/preferences are removed.
- [ ] Check the layout at mobile, tablet, and desktop widths; navigate using the keyboard.

## Free static deployment

You can deploy the folder using GitHub Pages or Netlify's free static hosting tier. Upload the files while preserving the `css/` and `js/` folders. Since this is a static project, no server-side environment variables are needed.

## Structure

```text
calmora/
├── index.html
├── css/
│   └── style.css
├── js/
│   └── app.js
└── README.md
```
