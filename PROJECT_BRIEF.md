# 🚀 Project Brief: NexuJit

## 1. Executive Summary
**NexuJit** (formerly UtilityStudio/SEO Studio) is a comprehensive, all-in-one digital toolbox designed for developers, creators, and everyday users. This project focuses on a premium UI/UX, modern architecture, and the integration of powerful AI capabilities (Google Gemini). It hosts over **100+ client-side and AI-powered tools** ranging from file converters and code minifiers to advanced geography tracking, nature monitoring, and privacy protection.

## 2. Technical Architecture & Stack

### Core Framework
*   **Framework**: [Next.js 16 (App Router)](https://nextjs.org/) - Utilizing the latest React Server Components and server actions.
*   **Language**: **TypeScript** (Strict Mode) - Ensuring type safety and robust code quality.
*   **Runtime**: Node.js environment for server-side operations and API handling.

### Styling & UI/UX
*   **Styling Engine**: **Tailwind CSS v4** - For utility-first, responsive design.
*   **Custom CSS**: `Vanilla CSS` modules and Global CSS for specific complex animations and glassmorphism effects ("Midnight Glass" aesthetic).
*   **Animations**: **Framer Motion** - Used extensively for page transitions, tool interactions, and micro-interactions.
*   **Icons**: `lucide-react` - Consistent, lightweight SVG icons.

### Key Libraries & Dependencies
*   **AI Engine**: `@google/generative-ai` - Powered by Google Gemini 1.5 Flash for text generation, analysis, and optimization.
*   **PDF Processing**: `jspdf`, `pdf-lib`, `html2canvas` - For generating invoices, modifying PDFs, and converting DOM elements to documents.
*   **Media Processing**: `@ffmpeg/ffmpeg` (WASM) - For browser-based video and audio transcoding without server upload constraints.
*   **YouTube Integration**: `youtubei.js`, `ytdl-core` (or equivalents) - For tag extraction, statistics, and metadata retrieval.
*   **Utilities**: `jszip` (archiving), `cheerio` (scraping), `axios` (requests).

## 3. Project Structure
The project follows a scalable, data-driven architecture:

```
e:\web project\seostudio-rebuild\
├── .agent/              # Workflow definitions and AI agent instructions
├── public/              # Static assets
├── src/
│   ├── app/             # Next.js App Router
│   │   ├── tools/       # Dynamic tool routing
│   │   │   └── [slug]/  # Single dynamic page handling ALL tools via mapping
│   │   ├── contact/     # Contact page
│   │   └── page.tsx     # Homepage
│   ├── components/
│   │   ├── common/      # Reusable UI (Header, Footer, Cards)
│   │   └── tools/       # 50+ Individual Tool Components (e.g., UnitConverter.tsx, AiContentWriter.tsx)
│   ├── data/
│   │   └── tools.ts     # Centralized configuration (Navigation, Searching, Tool Metadata)
│   └── lib/             # Utility functions
└── README.md            # Documentation
```

### Key Architectural Decisions
*   **Centralized Tool Registry** (`src/data/tools.ts`): All tools are defined in a single source of truth containing their ID, Name, Description, Category, and URL.
*   **Dynamic Routing Strategy**: A single file `src/app/tools/[slug]/page.tsx` handles the routing for all tools. It imports the specific component based on the URL slug, dramatically reducing boilerplate code for new pages.
*   **Client-Side Priority**: Most non-AI tools (converters, calculators) run entirely in the browser for speed and privacy.

## 4. Features & Tool Categories

### 🤖 AI Power Tools
*   **Content Generation**: Blog Post Writer, Paragraph Rewriter, Text Humanizer.
*   **SEO Optimization**: Meta Tag Optimizer, Keyword Suggester.
*   **Analysis**: AI Content Detector, Prompt Enhancer.

### 🎥 Media & Design
*   **YouTube**: Tag/Hashtag Generator & Extractor, Title Optimizer, Thumbnails/Channel Art Downloader.
*   **Design**: CSS Generators (Glassmorphism, Shadows, Gradients), SVG Blob/Pattern Generators, Color Psychology.
*   **Media**: Video Converters, Social Media Downloaders.

### 💻 Developer & Webmaster
*   **Code**: Minifiers (HTML/CSS/JS), Formatters (JSON/XML), UUID Generator.
*   **Generators**: Robots.txt, Sitemap, Favicon (Multi-size), .htaccess, Meta Tags.
*   **Diagnostics**: Internet Speed Test, Browser Sandbox, System Diagnostics.

### 🛠️ Utilities & Converters
*   **Unit Converter**: Comprehensive converter for Length, Weight, Digital, Temperature, Speed, Volume, Time, Pressure, Energy, Power, Force.
*   **PDF Arsenal**: Merge, Split, Compress, Protect, Unlock, Convert to/from Image/Office.
*   **Math/Business**: Invoice Generator, Percentage Calculator, GST/VAT Calculator, Loan Calculator, AdSense Calculator.
*   **Health**: BMI, TDEE, Water Intake, Life Expectancy.
*   **Lifestyle**: Country Explorer (Data visualization), Recipe Finder, Nutrition Calculator.

## 5. Design Philosophy
*   **Premium Aesthetic**: Dark mode by default (or rich gradients), utilizing "glassmorphism" (frosted glass transparency), neon accents, and subtle background glows.
*   **Interactivity**: Hover effects, smooth transitions on entry, and immediate feedback for user actions.
*   **Responsive**: Fully mobile-optimized layout for all tools.

## 6. Development Workflow
*   **Adding a Tool**:
    1.  Create the Component in `src/components/tools/`.
    2.  Add metadata entry to `src/data/tools.ts`.
    3.  Map the slug to the component in `src/components/ToolClientWrapper.tsx`.
*   **No-API-First**: Priority is given to tools that can run offline/client-side.
*   **AI Integration**: Uses a flexible key management system (Environmental variable or User-provided key).

## 7. Current Status
*   **Completed**: Core architecture, majority of converters, text tools, and advanced AI integration.
*   **Recent Updates**: 
    *   **Universal Utility Expansion**: Added 40+ new tools across Health, Graphics, PDF, and Math.
    *   **Platform Rebranding**: Refocused Project as **NexuJit**.
    *   **Advanced Tracking**: Integrated live feeds for ISS, Earthquakes, and Population.
*   **Production Ready**: The system is fully operational and ready for deployment.
