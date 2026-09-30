# RapL Learning Dashboard — Technical Submission & Case Study

Welcome to the **RapL Learning Dashboard** submission! This repository contains a production-ready **Angular application** built for managing and tracking micro-learning courses, along with comprehensive solutions to the **Debugging Challenge** and **WordPress Challenge**.

---
##lIVE DEMO
https://learning-dashboard-snowy.vercel.app/

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js**: v18.x or higher (Tested on Node v24.x)
- **npm**: v9.x or higher

### Installation & Local Setup

1. **Clone / Open Project**:
   ```bash
   cd c:/Users/USER/Desktop/RAPL
   ```

2. **Install Dependencies**:
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Run Development Server**:
   ```bash
   npm start
   # or
   npx ng serve
   ```
   Open your browser and navigate to `http://localhost:4200/`.

4. **Build Production Bundle**:
   ```bash
   npm run build
   ```
   The compiled production output will be generated in `dist/rapl-dashboard/`.

---

## 1. 🏗️ Approach & Architecture

The application was designed to demonstrate **clean component hierarchy**, **modern state management**, **reactive form validation**, and **fluid UX design**.

### Architecture Highlights:
- **Angular 21 Standalone Components**: Modern component architecture without verbose `NgModule` boilerplate. Each component (`DashboardStats`, `CourseList`, `CourseDetail`, `AddCourseModal`) imports only what it consumes.
- **Reactive State via Angular Signals**: Leveraging Angular `signal`, `computed`, and `asReadonly()` for fine-grained reactivity. When a course status changes or a new course is added, computed metrics (`stats`) automatically trigger zero-overhead DOM updates.
- **Local Storage Synchronization**: Course state changes and user-added courses automatically sync to `localStorage`. The application stays consistent even across page refreshes. A **"Reset Demo Data"** option is provided in the header to easily restore initial seed data.
- **Responsive & Accessible Design System**: Built with modern CSS CSS custom properties, CSS Grid, Flexbox, micro-animations, glassmorphic accents, and distinct status color badges (Emerald for Completed, Amber for In Progress, Slate for Pending).

---

## 2. 📂 Project Structure

```
rapl-dashboard/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── add-course-modal/
│   │   │   │   └── add-course-modal.ts    # Reactive form modal for adding courses with validation
│   │   │   ├── course-detail/
│   │   │   │   └── course-detail.ts       # Course details drawer/modal with dynamic Start/Continue buttons
│   │   │   ├── course-list/
│   │   │   │   └── course-list.ts         # Searchable, filterable, and sortable course grid
│   │   │   └── dashboard-stats/
│   │   │       └── dashboard-stats.ts     # Metric cards showing Total, Completed, In Progress, Pending
│   │   ├── models/
│   │   │   └── course.model.ts            # TypeScript models & interfaces (Course, CourseStatus, Stats)
│   │   ├── services/
│   │   │   └── course.service.ts          # Central data service using Signals & LocalStorage persistence
│   │   ├── app.ts                         # Root application component
│   │   ├── app.html                       # Top-level view template & toast notification overlay
│   │   └── app.css                        # Main page layout styles
│   ├── styles.css                         # Global CSS tokens, typography & CSS variables
│   ├── main.ts                            # Application bootstrapper
│   └── index.html                         # Document root with Google Fonts (Plus Jakarta Sans)
├── angular.json                           # Angular CLI configuration
├── tsconfig.json                          # TypeScript strict type configuration
└── README.md                              # Project documentation & challenge responses
```

---

## 3. 🎯 Key Technical Decisions

1. **Angular Signals over Complex Redux/NgRx**:
   For a micro-dashboard, Signals offer predictable synchronous reactive state with zero template boilerplate or third-party overhead.
2. **Reactive Forms (`ReactiveFormsModule`)**:
   Used in `AddCourseModalComponent` to provide instantaneous inline validation feedback (name min length 3, description min length 10, duration required, lesson count > 0).
3. **Dynamic Button State in Course Details**:
   The action button intelligently morphs depending on the course status:
   - `Not Started` ➔ **"Start Course"** (changes status to *In Progress* & sets progress to 25%)
   - `In Progress` ➔ **"Continue Course"** (progresses course to *Completed* & sets progress to 100%)
   - `Completed` ➔ **"Review Completed Course"**
4. **Interactive Metric Cards**:
   Clicking any stat card on the dashboard (e.g. "Courses in Progress") automatically sets the course list status filter, providing intuitive visual drill-down.

---

## 4. 🔮 Future Enhancements (With More Time)

- **Backend REST / GraphQL Integration**: Replace `localStorage` sync with a real backend service using Angular `HttpClient` and RxJS `Observable` streams.
- **Interactive Lesson Viewer & Quiz Engine**: Allow users to click through individual lessons and complete micro-assessment quizzes (matching RapL's core platform vision).
- **Comprehensive Unit & E2E Testing**: Add unit test suites using Jasmine/Karma or Vitest for `CourseService` signal state mutations and component templates.
- **Dark Mode Support**: Add a theme switcher using CSS variable toggles.

---

## 5. 🔍 Debugging Challenge Response

### **Scenario**: User reports: *"I clicked the Start Course button, but nothing happened."*

As a Web Developer at RapL, here is the systematic step-by-step diagnostic workflow I would follow to investigate and resolve this issue:

### Step 1: Gather Information from the User
I would start by asking the user clarifying questions to isolate the scope:
1. **Device & Environment**: What browser (Chrome, Safari, Firefox) and device (Desktop, iOS, Android) were you using?
2. **User Context & Permissions**: Were you logged in? What role/tenant was your account assigned to?
3. **Visual Cues**: Did the button change color, show a loading spinner, or did the page freeze/throw an alert?
4. **Specific Course**: Did this happen on one specific course or across all courses?

### Step 2: Browser Developer Tools Checks
I would reproduce or simulate the action with Chrome DevTools open (`F12`):

1. **Check the Console Tab**:
   - Look for unhandled JavaScript exceptions (e.g., `TypeError: Cannot read properties of undefined`, `NullPointerException`).
   - Check if an unhandled promise rejection occurred during state dispatch.
   - Check if Angular zone/signal change detection crashed due to a template binding error.

2. **Inspect the Event Listener (Elements Tab)**:
   - Inspect the **"Start Course"** `<button>` element.
   - Verify if the `(click)` binding is correctly attached to the DOM element or if CSS (`pointer-events: none`, transparent overlay element, or `disabled` attribute) is blocking user click events.

3. **Check the Network Tab**:
   - Filter by `XHR/Fetch` requests when clicking the button.
   - **Scenario A (Request not sent)**: If no HTTP call appears, the click event handler did not trigger or failed client-side validation.
   - **Scenario B (HTTP Error 4xx / 5xx)**: If a request was sent, check the HTTP status code and API payload response:
     - `401 Unauthorized` / `403 Forbidden`: Expired JWT token or missing course access permissions.
     - `422 Unprocessable Entity`: Bad request payload (e.g. missing `userId` or `courseId`).
     - `500 Internal Server Error`: Backend error (check server logs/Sentry).
   - **Scenario C (CORS failure / Network timeout)**: Check if preflight OPTIONS failed or API server was unreachable.

### Step 3: Local Reproduction & Codebase Tracing
1. Open the project locally in the developer environment.
2. Set a breakpoint in the TypeScript click handler (`onStartCourse(courseId)`).
3. Step through execution:
   - Check if the course object/ID is passed correctly.
   - Verify if the state service / API call is triggered.
   - Verify if state updates trigger Angular change detection.

### Step 4: Resolution & Prevention
Once the root cause is identified (e.g., missing API error handler or CORS issue):
- Fix the bug and add defensive error handling + user notification (toast error).
- Write an automated unit/E2E test to prevent regressions.

---

## 6. 🌐 WordPress Challenge Response

### **Scenario**: Marketing team request: *"Add a new page explaining RapL Genie to getrapl.com. The page should look good on desktop and mobile, contain text, images, and a CTA button."*

Here is my structured approach for building and deploying this page in WordPress cleanly without affecting existing production workflows:

### 1. Page Creation & Layout Setup
- **Block Editor (Gutenberg) / Elementor**:
  Create a new page titled **"RapL Genie — AI-Powered Personal Learning Assistant"** using the WordPress Block Editor (Gutenberg) or existing site builder (e.g., Elementor / Beaver Builder) to maintain brand consistency with `getrapl.com`.
- **URL Permalink**: Set clean SEO permalink (`getrapl.com/rapl-genie`).
- **Page Template**: Select the standard header/footer layout template (`Default Template` or `Landing Page Container`).

### 2. Page Structure & Component Design
- **Hero Section**:
  - Catchy Headline: *"Meet RapL Genie — Your AI Learning Companion"*
  - Subtitle explaining AI micro-learning benefits.
  - High-visibility Call-To-Action (CTA) button: **"Request a Demo"** / **"Try RapL Genie"** linking to the demo request form.
- **Feature Breakdown Section**:
  - 2-column or 3-column feature grid with modern icons highlighting key capabilities (Personalized Nudges, Automated Quiz Generation, Skill Analytics).
- **Visual Media & Screenshots**:
  - High-resolution product mockups showing RapL Genie in action on mobile and web UI.
- **Social Proof / Testimonials**:
  - Quote card from enterprise client or ROI stats.
- **Final CTA Banner**:
  - Bottom sticky/full-width banner reinforcing the CTA button.

### 3. Responsive Design & Media Optimization
- **CSS Breakpoints**: Use CSS Flexbox/Grid responsive blocks (or elementor breakpoint controls) to stack multi-column content on mobile viewports (<768px).
- **Image Optimization**:
  - Export graphics as optimized **WebP** / compressed **SVG** files.
  - Use responsive `srcset` attributes so mobile devices load smaller, faster image variants.
  - Set `loading="lazy"` on below-the-fold images to optimize Core Web Vitals (LCP & CLS).

### 4. Protecting Existing Pages & Site Integrity
- **Child Theme & Scoped CSS**:
  Apply custom styling via page-level CSS or scoped classes (`.rapl-genie-page`) to avoid global CSS namespace collisions on existing pages.
- **Staging Environment**:
  Build and preview the page on a staging environment (`staging.getrapl.com`) before touching production.
- **No Core/Global Overrides**: Avoid modifying `functions.php` directly without version-controlled child themes or custom plugins.

### 5. Testing & Quality Assurance Before Publishing
- **Cross-Browser & Device Testing**: Test on Chrome, Safari (iOS), Firefox, and Android mobile browsers.
- **CTA Link & Conversion Tracking**: Verify the CTA button correctly triggers form submissions and tracks Google Analytics / Meta Pixel conversion events.
- **SEO & Meta Tags**: Add Yoast SEO / RankMath metadata (meta title, meta description, Open Graph social preview images).
- **Performance Audit**: Run Google Lighthouse to ensure performance score > 90.

Once approved by the marketing team, publish the page live on `getrapl.com`.

---

## 📄 License & Attribution

Designed and developed for the **RapL Web Developer Evaluation**.
Built with Angular & TypeScript.
