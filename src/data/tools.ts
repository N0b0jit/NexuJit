import {
    Youtube, FileText, Globe, Search, Link as LinkIcon,
    Settings, Image, Calculator, Zap, Binary, Box, Sparkles, ShieldCheck, Map,
    Terminal, Cpu, Palette, Hash, Layout, Maximize, Smartphone, CreditCard, Chrome,
    Layers, RefreshCw, FileJson, FileCode, Type, Ruler, Coins, Video, Music, Briefcase,
    BookOpen, Wifi, Share2, Download, Heart
} from 'lucide-react';

export const categories = [
    {
        id: 'health',
        title: 'Health & Fitness',
        icon: Heart,
        description: 'Tools to track your health, fitness, and biological metrics.',
        tools: [
            { name: 'BMI Calculator', href: '/tools/bmi-calculator', description: 'Calculate Body Mass Index (BMI).' },
            { name: 'Water Intake', href: '/tools/water-intake-calculator', description: 'Daily water intake recommendation.' },
            { name: 'Calorie Burn', href: '/tools/calorie-burn-calculator', description: 'Estimate calories burned during activities.' },
            { name: 'TDEE Calculator', href: '/tools/tdee-calculator', description: 'Total Daily Energy Expenditure.' },
            { name: 'Life Expectancy', href: '/tools/life-expectancy-calculator', description: 'Statistical life expectancy estimator.' }
        ]
    },
    {
        id: 'ai',
        title: 'AI Power Tools',
        icon: Sparkles,
        description: 'Leverage the power of Artificial Intelligence to automate your SEO and content tasks.',
        tools: [
            { name: 'AI Content Writer', href: '/tools/ai-content-writer', description: 'Generate high-quality, SEO-optimized blog posts and articles.' },
            { name: 'AI Meta Tag Optimizer', href: '/tools/ai-meta-optimizer', description: 'Use AI to write high-converting meta titles and descriptions.' },
            { name: 'AI Keyword Suggester', href: '/tools/ai-keyword-suggester', description: 'Find untapped keyword opportunities using AI.' },
            { name: 'AI Prompt Enhancer', href: '/tools/ai-prompt-enhancer', description: 'Optimize your AI prompts for better results and clarity.' },
            { name: 'AI Content Detector', href: '/tools/ai-content-detector', description: 'Detect if text is written by AI or Human.' },
            { name: 'AI Text Humanizer', href: '/tools/ai-text-humanizer', description: 'Rewrite AI text to sound more natural.' },
        ]
    },
    {
        id: 'youtube',
        title: 'YouTube Tools',
        icon: Youtube,
        description: 'Optimize your YouTube channel and videos with our powerful extraction and generator tools.',
        tools: [
            { name: 'YouTube Tag Extractor', href: '/tools/youtube-tag-extractor', description: 'Extract tags from any YouTube video URL.' },
            { name: 'YouTube Tag Generator', href: '/tools/youtube-tag-generator', description: 'Generate SEO friendly tags for your videos.' },
            { name: 'YouTube Hashtag Extractor', href: '/tools/youtube-hashtag-extractor', description: 'Extract hashtags from video descriptions.' },
            { name: 'YouTube Hashtag Generator', href: '/tools/youtube-hashtag-generator', description: 'Generate trending hashtags for your niche.' },
            { name: 'YouTube Title Extractor', href: '/tools/youtube-title-extractor', description: 'Get the exact title of any video.' },
            { name: 'YouTube Title Generator', href: '/tools/youtube-title-generator', description: 'Create catchy, SEO-optimized titles.' },
            { name: 'YouTube Title Length Checker', href: '/tools/youtube-title-length-checker', description: 'Check if your title is the optimal length.' },
            { name: 'YouTube Description Extractor', href: '/tools/youtube-description-extractor', description: 'Extract the full description of a video.' },
            { name: 'YouTube Description Generator', href: '/tools/youtube-description-generator', description: 'Generate professional video descriptions.' },
            { name: 'YouTube Embed Code Generator', href: '/tools/youtube-embed-code-generator', description: 'Easily generate embed codes for your site.' },
            { name: 'YouTube Channel ID', href: '/tools/youtube-channel-id', description: 'Find the unique ID of any YouTube channel.' },
            { name: 'YouTube Video Statistics', href: '/tools/youtube-video-statistics', description: 'Get detailed performance stats for a video.' },
            { name: 'YouTube Channel Statistics', href: '/tools/youtube-channel-statistics', description: 'Analyze channel growth and metrics.' },
            { name: 'YouTube Money Calculator', href: '/tools/youtube-money-calculator', description: 'Estimate potential earnings of a video/channel.' },
            { name: 'YouTube Region Restriction', href: '/tools/youtube-region-restriction', description: 'Check if a video is blocked in certain countries.' },
            { name: 'YouTube Thumbnail Downloader', href: '/tools/youtube-thumbnail-downloader', description: 'Download high-quality video thumbnails.' },
            { name: 'YouTube Channel Logo Downloader', href: '/tools/youtube-logo-downloader', description: 'Download banners and logos from channels.' },
            { name: 'YouTube Comment Picker', href: '/tools/youtube-comment-picker', description: 'Pick a random winner from comments.' },
            { name: 'YouTube Views Ratio', href: '/tools/youtube-views-ratio', description: 'Calculate engagement and view ratios.' }
        ]
    },
    {
        id: 'downloader',
        title: 'Download Tools',
        icon: Download,
        description: 'Download videos, audio, and more from across the web.',
        tools: [
            { name: 'Social Media Downloader', href: '/tools/social-media-downloader', description: 'Download videos from YouTube, TikTok, Instagram, Facebook.' },
            { name: 'YouTube Thumbnail Downloader', href: '/tools/youtube-thumbnail-downloader', description: 'Download high-quality video thumbnails.' },
            { name: 'YouTube Channel Logo', href: '/tools/youtube-logo-downloader', description: 'Download banners and logos from channels.' }
        ]
    },
    {
        id: 'text',
        title: 'Text Analysis Tools',
        icon: FileText,
        description: 'Professional tools for content creators to analyze and manipulate text.',
        tools: [
            { name: 'Article Rewriter', href: '/tools/article-rewriter', description: 'Rewrite your content to make it unique.' },
            { name: 'Word Counter', href: '/tools/word-counter', description: 'Count words, characters, and sentences.' },
            { name: 'Readability Score', href: '/tools/readability-score', description: 'Calculate reading time and text complexity score.' },
            { name: 'Case Converter', href: '/tools/case-converter', description: 'Convert text between different cases (UPPER, lower, etc).' },
            { name: 'Lorem Ipsum Generator', href: '/tools/lorem-ipsum-generator', description: 'Generate placeholder text for designs.' },
            { name: 'Text to Slug Converter', href: '/tools/text-to-slug', description: 'Convert any text into a URL-friendly slug.' },
            { name: 'Comma Separator', href: '/tools/comma-separator', description: 'Convert list to comma-separated text.' },
            { name: 'Keyword Density Checker', href: '/tools/keyword-density-checker', description: 'Check how often keywords appear in your text.' },
            { name: 'Text to Hashtags', href: '/tools/text-to-hashtags', description: 'Convert your text into social media hashtags.' },
            { name: 'Text Repeater', href: '/tools/text-repeater', description: 'Repeat a string multiple times.' },
            { name: 'Number to Word', href: '/tools/number-to-word', description: 'Convert numbers into spelled-out words.' },
            { name: 'Duplicate Line Remover', href: '/tools/duplicate-line-remover', description: 'Remove duplicate lines from text lists.' },
            { name: 'Bionic Reading', href: '/tools/bionic-reading', description: 'Enhance reading speed with bold text.' },
            { name: 'Text to ASCII Art', href: '/tools/text-to-ascii', description: 'Convert text to ASCII art banners.' },
            { name: 'Whitespace Remover', href: '/tools/whitespace-remover', description: 'Trim extra spaces and lines.' },
            { name: 'Whitespace Remover', href: '/tools/whitespace-remover', description: 'Trim extra spaces and lines.' },
            { name: 'Text to Handwriting', href: '/tools/text-to-handwriting', description: 'Simulate handwritten text images.' },
            { name: 'Morse Code', href: '/tools/morse-code-converter', description: 'Convert text to Morse code and back.' }
        ]
    },
    {
        id: 'website',
        title: 'Website Management',
        icon: Map,
        description: 'Technical tools to help you manage and troubleshoot your website.',
        tools: [
            { name: 'Sitemap Generator', href: '/tools/sitemap-generator', description: 'Build a download-ready XML sitemap for your website.' },
            { name: 'Robots.txt Builder', href: '/tools/robots-txt-builder', description: 'Easily create a robots.txt file for search engine crawlers.' },
            { name: 'HTTP Status Code', href: '/tools/http-status-code', description: 'Check the HTTP status of any URL.' },
            { name: 'Server Status Checker', href: '/tools/server-status-checker', description: 'Check if a website is online or offline.' },
            { name: 'Page Size Checker', href: '/tools/page-size-checker', description: 'Find out the total size of a webpage.' },
            { name: 'URL Redirect Checker', href: '/tools/redirect-checker', description: 'Trace the 301/302 redirect path.' },
            { name: 'Privacy Policy Gen', href: '/tools/privacy-policy-generator', description: 'Generate standard legal pages for your site.' },
            { name: 'Terms Generator', href: '/tools/terms-generator', description: 'Create terms and conditions in seconds.' }
        ]
    },
    {
        id: 'seo',
        title: 'SEO Tools',
        icon: Search,
        description: 'Improve your search engine visibility and rankings.',
        tools: [
            { name: 'Meta Tag Generator', href: '/tools/meta-tag-generator', description: 'Generate SEO-friendly meta tags.' },
            { name: 'Meta Tag Analyzer', href: '/tools/meta-tag-analyzer', description: 'Analyze existing meta tags on any page.' },
            { name: 'Google Index Checker', href: '/tools/google-index-checker', description: 'Check if a URL is indexed by Google.' },
            { name: 'Google Cache Checker', href: '/tools/google-cache-checker', description: 'View Google\'s cached version of a page.' },
            { name: 'Open Graph Generator', href: '/tools/og-generator', description: 'Generate social media preview tags.' },
            { name: 'UTM Builder', href: '/tools/utm-builder', description: 'Add tracking parameters to your URLs.' },
            { name: 'Neural SERP Simulator', href: '/tools/serp-simulator', description: 'Live visual preview of your website in Google Search results.' },
            { name: 'Website Clutter Heatmap', href: '/tools/clutter-heatmap', description: 'Identify high cognitive load areas with visual heatmap heuristics.' }
        ]
    },
    {
        id: 'dev',
        title: 'Development Tools',
        icon: Settings,
        description: 'Essential utilities for web developers and programmers.',
        tools: [
            { name: 'JSON Formatter', href: '/tools/json-formatter', description: 'Clean and format messy JSON data.' },
            { name: 'JSON Viewer', href: '/tools/json-viewer', description: 'Inspect and navigate JSON structures easily.' },
            { name: 'JSON to XML', href: '/tools/json-to-xml', description: 'Convert JSON data to XML format.' },
            { name: 'CSV to JSON', href: '/tools/csv-to-json', description: 'Convert CSV data to JSON format.' },
            { name: 'XML to JSON', href: '/tools/xml-to-json', description: 'Convert XML data to JSON format.' },
            { name: 'HTML Minifier', href: '/tools/html-minifier', description: 'Compress HTML by removing whitespace.' },
            { name: 'CSS Minifier', href: '/tools/css-minifier', description: 'Minify CSS files for faster page loads.' },
            { name: 'JS Minifier', href: '/tools/javascript-minifier', description: 'Minify JavaScript code for production.' },
            { name: 'Base64 Encode', href: '/tools/base64-encode', description: 'Encode text or files into Base64 format.' },
            { name: 'Base64 Decode', href: '/tools/base64-decode', description: 'Decode Base64 strings back to original format.' },
            { name: 'MD5 Generator', href: '/tools/md5-generator', description: 'Generate secure MD5 hashes.' },
            { name: 'Password Generator', href: '/tools/password-generator', description: 'Create strong, secure passwords instantly.' },
            { name: 'CSS Audit Cleanup', href: '/tools/css-audit-cleanup', description: 'Neural scan for redundant CSS and legacy hacks.' },
            { name: 'Keyframe Forge', href: '/tools/css-animation-forge', description: 'Visual timeline for complex CSS @keyframes.' },
            { name: 'Grid Template Forge', href: '/tools/css-grid-template-forge', description: 'Interactive drag-and-draw CSS grid regions.' },
            { name: 'Rotating Border', href: '/tools/rotating-border-generator', description: 'Pure CSS high-end animated gradient border shell.' },
            { name: 'URL Encoder', href: '/tools/url-encoder', description: 'Encode text for URLs.' },
            { name: 'URL Decoder', href: '/tools/url-decoder', description: 'Decode URL-encoded strings.' }
        ]
    },
    {
        id: 'unit',
        title: 'Unit Converters',
        icon: Ruler,
        description: 'Quickly convert between different units of measurement.',
        tools: [
            { name: 'Length Converter', href: '/tools/length-converter', description: 'Convert between CM, Meters, Inches, etc.' },
            { name: 'Weight Converter', href: '/tools/weight-converter', description: 'Convert KG, Pounds, Grams, and more.' },
            { name: 'Temperature Converter', href: '/tools/temperature-converter', description: 'Convert Celsius, Fahrenheit, and Kelvin.' },
            { name: 'Area Converter', href: '/tools/area-converter', description: 'Convert Square Meters, Feet, Acres, etc.' },
            { name: 'Digital Converter', href: '/tools/digital-converter', description: 'Convert Bytes, MB, GB, and TB.' },
            { name: 'Speed Converter', href: '/tools/speed-converter', description: 'Convert KM/H, MPH, and Knots.' },
            { name: 'Volume Converter', href: '/tools/volume-converter', description: 'Convert Liters, Gallons, and Milliliters.' },
            { name: 'Time Converter', href: '/tools/time-converter', description: 'Convert Seconds, Minutes, Hours, Days.' },
            { name: 'Pressure Converter', href: '/tools/pressure-converter', description: 'Convert Pascal, Bar, PSI, and more.' },
            { name: 'Energy Converter', href: '/tools/energy-converter', description: 'Convert Joules, Calories, and kWh.' },
            { name: 'Power Converter', href: '/tools/power-converter', description: 'Convert Watts, Horsepower, and BTUs.' },
            { name: 'Force Converter', href: '/tools/force-converter', description: 'Convert Newton, Lbf, and more.' }
        ]
    },
    {
        id: 'security',
        title: 'Security Tools',
        icon: ShieldCheck,
        description: 'Tools to check and improve your digital security.',
        tools: [
            { name: 'Password Strength', href: '/tools/password-strength', description: 'Test how secure your passwords really are.' },
            { name: 'QR Code Generator', href: '/tools/qr-code-generator', description: 'Create custom QR codes for any link.' },
            { name: 'QR Code Decoder', href: '/tools/qr-code-decoder', description: 'Upload and decode any QR code image.' },
            { name: 'My IP Finder', href: '/tools/what-is-my-ip', description: 'Find your public IP address and location.' },
            { name: 'User Agent', href: '/tools/user-agent', description: 'Identify your browser\'s user agent string.' },
            { name: 'Google Dork Generator', href: '/tools/google-dork-generator', description: 'Generate advanced Google search queries for recon.' },
            { name: 'Recon Command Center', href: '/tools/recon-command-center', description: 'Generate bug bounty reconnaissance commands.' }
        ]
    },
    {
        id: 'binary',
        title: 'Binary & Hex Tools',
        icon: Binary,
        description: 'Encode and decode data between different formats.',
        tools: [
            { name: 'Text to Binary', href: '/tools/text-to-binary', description: 'Convert plain text into binary numbers.' },
            { name: 'Binary to Text', href: '/tools/binary-to-text', description: 'Decode binary back into readable text.' },
            { name: 'Text to Hex', href: '/tools/text-to-hex', description: 'Convert text into hexadecimal format.' },
            { name: 'Hex to Text', href: '/tools/hex-to-text', description: 'Decode hexadecimal into plain text.' },
            { name: 'Decimal to Binary', href: '/tools/decimal-to-binary', description: 'Convert decimal numbers into binary.' }
        ]
    },
    {
        id: 'image',
        title: 'Image Editing Tools',
        icon: Box,
        description: 'Manipulate and convert image files directly in your browser.',
        tools: [
            { name: 'Image Resizer', href: '/tools/image-resizer', description: 'Resize images to custom dimensions.' },
            { name: 'Image Converter', href: '/tools/image-converter', description: 'Convert between PNG, JPG, WEBP, and more.' },
            { name: 'Image to Base64', href: '/tools/image-to-base64', description: 'Convert images into Base64 strings.' },
            { name: 'Base64 to Image', href: '/tools/base64-to-image', description: 'Decode Base64 strings back into images.' },
            { name: 'Flip & Rotate', href: '/tools/flip-rotate-image', description: 'Easily flip or rotate your images.' },
            { name: 'Image Cropper', href: '/tools/image-cropper', description: 'Crop images to focusing on specific areas.' },
            { name: 'Image Filters', href: '/tools/image-filters', description: 'Apply filters like Grayscale and Sepia.' },
            { name: 'Average Color', href: '/tools/image-average-color-finder', description: 'Find the dominant color of an image.' },
            { name: 'Color Extractor', href: '/tools/image-color-extractor', description: 'Extract full palette from any image.' },
            { name: 'Photo Censor', href: '/tools/photo-censor', description: 'Blur or pixelate parts of an image.' },
            { name: 'SVG to PNG', href: '/tools/svg-to-png', description: 'Convert vector SVG to raster PNG.' },
            { name: 'Browser Lightroom', href: '/tools/browser-lightroom', description: 'Hardware-accelerated cinematic color grading lab.' },
            { name: 'Image Compressor', href: '/tools/image-compressor', description: 'Compress images to reduce file size.' },
            { name: 'Image Caption Gen', href: '/tools/image-caption-generator', description: 'Generate captions for your images.' },
            { name: 'Safe Area Checker', href: '/tools/image-safe-area-checker', description: 'Check image safe areas for social media.' }
        ]
    },
    {
        id: 'utility',
        title: 'General Utilities',
        icon: FileText,
        description: 'Miscellaneous tools to help with daily tasks.',
        tools: [
            { name: 'Finance Toolkit', href: '/tools/finance-toolkit', description: 'Currency, profit, and loan calculators.' },
            { name: 'Social Post Preview', href: '/tools/social-post-preview', description: 'Preview how your posts look on social media.' },
            { name: 'Invoice Generator', href: '/tools/invoice-generator', description: 'Create professional invoices for clients.' },
            { name: 'Schema Generator', href: '/tools/schema-generator', description: 'Build structured data for search engines.' },
            { name: 'UTM Builder Pro', href: '/tools/utm-builder', description: 'Create trackable marketing URLs easily.' }
        ]
    },
    {
        id: 'converter',
        title: 'Universal Converters',
        icon: Globe,
        description: 'Convert between a vast variety of file formats.',
        tools: [
            { name: 'Audio Converter', href: '/tools/audio-converter', description: 'Convert MP3, WAV, OGG, and more.' },
            { name: 'Video Converter', href: '/tools/video-converter', description: 'Convert MP4, WEBM, AVI, etc.' },
            { name: 'PDF Toolkit', href: '/tools/scanned-pdf-converter', description: 'Merge, split, and compress PDF files.' },
            { name: 'Archive Converter', href: '/tools/archive-converter', description: 'Convert ZIP, RAR, 7Z formats.' },
            { name: 'Ebook Converter', href: '/tools/ebook-converter', description: 'Convert EPUB, MOBI, AZW3, etc.' },
            { name: 'Font Converter', href: '/tools/font-converter', description: 'Convert TTF, OTF, WOFF, etc.' }
        ]
    },
    {
        id: 'multimedia',
        title: 'Media & Production',
        icon: Video,
        description: 'Powerful tools for video and audio processing.',
        tools: [
            { name: 'Video Editor', href: '/tools/video-editor', description: 'Basic video trimming and cropping.' },
            { name: 'Screen Recorder', href: '/tools/screen-recorder', description: 'Record your screen directly from browser.' },
            { name: 'Voice Recorder', href: '/tools/voice-recorder', description: 'Record audio via your microphone.' },
            { name: 'Text to Speech', href: '/tools/text-to-speech', description: 'Convert written text to natural speech.' },
            { name: 'Audio Converter Pro', href: '/tools/audio-converter', description: 'Advanced audio format conversion.' }
        ]
    },
    {
        id: 'calculations',
        title: 'Advanced Calculators',
        icon: Calculator,
        description: 'Perform complex calculations for finance, math, and more.',
        tools: [
            { name: 'ROI Calculator', href: '/tools/roi-calculator', description: 'Calculate return on investment for projects.' },
            { name: 'Profit Margin', href: '/tools/profit-margin-calculator', description: 'Calculate net profit and margin percentages.' },
            { name: 'Freelance Rate', href: '/tools/freelance-rate-calculator', description: 'Estimate what you should charge per hour.' },
            { name: 'Discount Calc', href: '/tools/discount-calculator', description: 'Calculate final prices after discounts.' },
            { name: 'Age Calculator', href: '/tools/age-calculator', description: 'Find exact age in days, months, and years.' },
            { name: 'Interest Calculator', href: '/tools/interest-calculator', description: 'Simple and compound interest calculator.' },
            { name: 'Loan Calculator', href: '/tools/loan-calculator', description: 'Monthly loan repayment estimator.' },
            { name: 'AdSense Calculator', href: '/tools/adsense-calculator', description: 'Estimate potential AdSense earnings.' },
            { name: 'PayPal Fee Calc', href: '/tools/paypal-fee-calculator', description: 'Calculate PayPal transaction fees.' },
            { name: 'CPM Calculator', href: '/tools/cpm-calculator', description: 'Cost Per Mille (thousand impressions) calculator.' },
            { name: 'GST Calculator', href: '/tools/gst-calculator', description: 'Calculate Goods and Services Tax.' },
            { name: 'Percentage Calc', href: '/tools/percentage-calculator', description: 'Various percentage calculations.' },
            { name: 'Equation Solver', href: '/tools/equation-solver', description: 'Solve linear and quadratic equations.' },
            { name: 'Matrix Calculator', href: '/tools/matrix-calculator', description: 'Perform matrix operations.' }
        ]
    },
    {
        id: 'other',
        title: 'Miscellaneous Tools',
        icon: Settings,
        description: "Various useful tools that don't fit other categories.",
        tools: [
            { name: 'Nobojiclizer', href: '/tools/nobojiclizer', description: 'A fun tool to transform your text.' },
            { name: 'Nutrition Calculator', href: '/tools/nutrition-calculator', description: 'Track calories and macros easily.' },
            { name: 'Recipe Finder', href: '/tools/recipe-finder', description: 'Search for recipes by ingredients.' },
            { name: 'Internet Speed Test', href: '/tools/internet-speed-test', description: 'Measure your current download/upload speed.' },
            { name: 'Decision Randomizer', href: '/tools/decision-randomizer', description: 'Let AI help you make quick decisions.' }
        ]
    },
    {
        id: 'design-neural',
        title: 'Design Neural Tools',
        icon: Palette,
        description: 'Advanced design intelligence and vector automation.',
        tools: [
            { name: 'Psychology Auditor', href: '/tools/brand-psychology-auditor', description: 'Audit brand color impact on subconscious.' },
            { name: 'Site Palette Scan', href: '/tools/site-palette-counter', description: 'Deep-scan production CSS for color usage.' },
            { name: 'SVG Neon Tracer', href: '/tools/svg-glow-tracer', description: 'Transform paths into animated glowing pulses.' },
            { name: 'Skeleton Gen', href: '/tools/svg-skeleton-generator', description: 'Auto-generate loading skeletons from SVGs.' },
            { name: 'Google Font Pairing', href: '/tools/google-font-pairing', description: 'Discover perfect Google Font combinations.' },
            { name: 'Color Contrast', href: '/tools/color-contrast-checker', description: 'Check accessibility contrast ratios.' }
        ]
    },
    {
        id: 'audio-advanced',
        title: 'Advanced Audio Tools',
        icon: Music,
        description: 'High-fidelity audio visualization and production.',
        tools: [
            { name: 'Spectrogram', href: '/tools/audio-spectrogram', description: 'Waterfall frequency mapping of audio DNA.' },
            { name: 'Beat Studio', href: '/tools/audio-beat-studio', description: '16-step neural drum machine and sequencer.' }
        ]
    },
    {
        id: 'fun-games',
        title: 'Fun & Games',
        icon: Globe,
        description: 'Interactive social experiments and viral tools.',
        tools: [
            { name: 'ASCII Matrix', href: '/tools/ascii-webcam-matrix', description: 'Live webcam to ANSI character conversion.' },
            { name: 'Entertainment Hub', href: '/tools/entertainment-hub', description: 'Random trivia, facts, and cosmic jokes.' }
        ]
    },
    {
        id: 'science-education',
        title: 'Science & Education',
        icon: Globe,
        description: 'Explore logic, physics, and cosmic datasets.',
        tools: [
            { name: 'Logic Circuit Sim', href: '/tools/logic-circuit-simulator', description: 'Interactive binary gate logic playground.' },
            { name: 'WebGPU Deep-Scan', href: '/tools/webgpu-deep-scan', description: 'Hardware probe for next-gen graphics support.' },
            { name: 'Science Lab', href: '/tools/science-lab', description: 'Real-time astronomy and mission trackers.' }
        ]
    },
    {
        id: 'pro-hardware',
        title: 'Pro Hardware Tools',
        icon: Briefcase,
        description: 'Stress-testing and calibration for professional rigs.',
        tools: [
            { name: 'System Diagnostics', href: '/tools/system-diagnostics', description: 'Full hardware and sensor health report.' },
            { name: 'Advanced Diagnostics', href: '/tools/advanced-system-tools', description: 'Stress-testing for GPU/WebGL and Storage.' }
        ]
    },
    {
        id: 'geography-realworld',
        title: 'Geography & World Info',
        icon: Map,
        description: 'Explore global data, emergency info, and time synchronization.',
        tools: [
            { name: 'IP Intelligence', href: '/tools/ip-intelligence', description: 'Deep scan of IP ASN, ISP, and security status.' },
            { name: 'Emergency Numbers', href: '/tools/emergency-numbers', description: 'Global directory of police, fire, and ambulance.' },
            { name: 'World Population', href: '/tools/world-population', description: 'Real-time global population growth counter.' },
            { name: 'Internet Shutdowns', href: '/tools/internet-shutdown-monitor', description: 'Live monitoring of global connectivity disruptions.' },
            { name: 'Public Holiday Finder', href: '/tools/public-holiday-finder', description: 'Holidays by country with long-weekend highlights.' },
            { name: 'Sunrise & Sunset', href: '/tools/sunrise-sunset-times', description: 'Daily daylight calculator for any location.' },
            { name: 'City Facts Explorer', href: '/tools/city-facts-explorer', description: 'Random interesting facts about world cities.' }
        ]
    },
    {
        id: 'knowledge-learning',
        title: 'Knowledge & Learning',
        icon: BookOpen,
        description: 'Deepen your understanding with encyclopedia and historical data.',
        tools: [
            { name: 'Wikipedia Explorer', href: '/tools/wikipedia-explorer', description: 'Search and summarize complex topics via Wikipedia.' },
            { name: 'Today in History', href: '/tools/today-in-history', description: 'Discover historical events that happened on this day.' },
            { name: 'Quote Context', href: '/tools/quote-context-explainer', description: 'Famous quotes with historical context and meaning.' },
            { name: 'Poem Explorer', href: '/tools/public-domain-poetry', description: 'Browse and read thousands of public domain poems.' },
            { name: 'Etymology Viewer', href: '/tools/etymology-viewer', description: 'Trace the origin and history of any word.' }
        ]
    },
    {
        id: 'nature-space',
        title: 'Nature & Space',
        icon: Globe,
        description: 'Monitor the celestial and terrestrial activity live.',
        tools: [
            { name: 'Moon Phase Tool', href: '/tools/moon-phase', description: 'Current lunar cycle, illumination, and age.' },
            { name: 'Meteor Calendar', href: '/tools/meteor-shower-calendar', description: 'Upcoming major meteor shower peaks.' },
            { name: 'Earthquake Feed', href: '/tools/earthquake-live-feed', description: 'Real-time global seismic activity monitor.' },
            { name: 'Volcano Tracker', href: '/tools/volcano-activity-tracker', description: 'Active alerts from global volcanic systems.' },
            { name: 'Daylight Length', href: '/tools/daylight-length-calculator', description: 'Calculate total daylight hours by coordinates.' }
        ]
    },
    {
        id: 'developer-web',
        title: 'Dev & Web Utilities',
        icon: Terminal,
        description: 'Essential debugging and mapping tools for web professionals.',
        tools: [
            { name: 'HTTP Header Decoder', href: '/tools/http-header-decoder', description: 'Decode and explain raw HTTP response headers.' },
            { name: 'MIME Type Explorer', href: '/tools/mime-type-explorer', description: 'Search extension to MIME mapping registry.' },
            { name: 'Status Code Story', href: '/tools/http-status-story', description: 'Human language explanations for HTTP codes.' },
            { name: 'UA Breakdown', href: '/tools/user-agent-breakdown', description: 'In-depth parsing of browser User Agent strings.' },
            { name: 'DNS Speed Test', href: '/tools/dns-resolver-tester', description: 'Test resolution speed of public DNS providers.' }
        ]
    },
    {
        id: 'data-utilities',
        title: 'Lightweight Data Tools',
        icon: Hash,
        description: 'Generate and manipulate lightweight data formats.',
        tools: [
            { name: 'CSV Data Gen', href: '/tools/csv-data-generator', description: 'Generate random CSV files for testing.' },
            { name: 'Fake Profile Gen', href: '/tools/fake-profile-generator', description: 'Create names, avatars, and locations for mockup.' },
            { name: 'Country Comparison', href: '/tools/country-comparison', description: 'Side-by-side demographic comparison of nations.' },
            { name: 'Language Distribution', href: '/tools/language-viewer', description: 'Analyze where languages are spoken globally.' },
            { name: 'Currency Explorer', href: '/tools/currency-explorer-data', description: 'Full registry of world currency symbols and history.' }
        ]
    },
    {
        id: 'privacy-safety',
        title: 'Privacy & Safety',
        icon: ShieldCheck,
        description: 'Protect your digital footprint and sanitize your data.',
        tools: [
            { name: 'Breach Awareness', href: '/tools/public-breach-checker', description: 'Analyze historical breach risks and prevention.' },
            { name: 'URL Safety Hint', href: '/tools/url-safety-hint', description: 'Heuristic-based phishing and safety detection.' },
            { name: 'Email Header Analyzer', href: '/tools/email-header-analyzer', description: 'Audit SPF, DKIM, and DMARC configurations.' },
            { name: 'Metadata Education', href: '/tools/metadata-education', description: 'Learn what metadata is hidden in your files.' },
            { name: 'Tracking Cleaner', href: '/tools/tracking-parameter-cleaner', description: 'Strip UTM and tracking IDs from shared links.' }
        ]
    },
    {
        id: 'performance-systems',
        title: 'Performance & Systems',
        icon: Layout,
        description: 'Design personal operating systems and peak performance routines.',
        tools: [
            { name: 'Personal System Builder', href: '/tools/personal-system-builder', description: 'Create routines from scratch instead of just habits.' },
            { name: 'Tomorrow Setup Tool', href: '/tools/tomorrow-setup-tool', description: 'Prepare your next day with a time-block template download.' }
        ]
    },
    {
        id: 'network-connectivity',
        title: 'Network & Connectivity',
        icon: Wifi,
        description: 'Elite P2P tools for crossing device boundaries with zero server footprint.',
        tools: [
            { name: 'Universal Multi-Share', href: '/tools/universal-multi-share', description: 'Universal P2P bridge compatible with LocalSend and PairDrop protocols.' }
        ]
    },
    {
        id: 'css-generators',
        title: 'CSS & UI Generators',
        icon: Palette,
        description: 'Generate beautiful CSS code for your web projects.',
        tools: [
            { name: 'Box Shadow Gen', href: '/tools/css-box-shadow-generator', description: 'Create complex CSS box shadows.' },
            { name: 'Border Radius', href: '/tools/css-border-radius-generator', description: 'Generate advanced border-radius shapes.' },
            { name: 'Gradient Gen', href: '/tools/css-gradient-generator', description: 'Create linear and radial CSS gradients.' },
            { name: 'Clip Path Gen', href: '/tools/css-clip-path-generator', description: 'Generate CSS clip-path shapes.' },
            { name: 'Glassmorphism', href: '/tools/glassmorphism-generator', description: 'Generate glass-effect CSS styles.' },
            { name: 'CSS Loader Gen', href: '/tools/css-loader-generator', description: 'Create pure CSS loading spinners.' },
            { name: 'CSS Triangle', href: '/tools/css-triangle-generator', description: 'Generate CSS code for triangles.' },
            { name: 'Triangle Generator', href: '/tools/css-triangle-generator', description: 'Create CSS triangles easily.' },
            { name: 'SVG Blob Gen', href: '/tools/svg-blob-generator', description: 'Generate organic SVG blob shapes.' },
            { name: 'SVG Pattern Gen', href: '/tools/svg-pattern-generator', description: 'Create seamless SVG background patterns.' },
            { name: 'Color Converter', href: '/tools/color-converter', description: 'Convert between Hex, RGB, HSL.' },
            { name: 'Blindness Sim', href: '/tools/color-blindness-simulator', description: 'Simulate color blindness on your designs.' },
            { name: 'Color Picker', href: '/tools/image-color-picker', description: 'Pick colors from images or palette.' }
        ]
    },
    {
        id: 'pdf-tools',
        title: 'PDF Tools',
        icon: FileText,
        description: 'Manage, edit, and convert PDF documents.',
        tools: [
            { name: 'PDF Merger', href: '/tools/pdf-merger', description: 'Combine multiple PDFs into one.' },
            { name: 'PDF Splitter', href: '/tools/pdf-splitter', description: 'Split a PDF into separate files.' },
            { name: 'PDF Compressor', href: '/tools/pdf-compressor', description: 'Reduce the file size of your PDFs.' },
            { name: 'PDF to Image', href: '/tools/pdf-to-image', description: 'Convert PDF pages to JPG/PNG images.' },
            { name: 'Image to PDF', href: '/tools/image-to-pdf', description: 'Convert images to a single PDF file.' },
            { name: 'PDF Rotator', href: '/tools/pdf-rotator', description: 'Rotate PDF pages permanently.' },
            { name: 'PDF Protector', href: '/tools/pdf-protector', description: 'Add password protection to PDFs.' },
            { name: 'Page Numbers', href: '/tools/pdf-page-numbers', description: 'Add page numbers to PDF documents.' },
            { name: 'PDF to Office', href: '/tools/pdf-to-office', description: 'Convert PDF to Word, Excel, PPT.' },
            { name: 'Office to PDF', href: '/tools/office-to-pdf', description: 'Convert Office docs to PDF.' }
        ]
    },
    {
        id: 'productivity',
        title: 'Productivity',
        icon: Zap,
        description: 'Tools to verify and improve your productivity and time management.',
        tools: [
            { name: 'Pomodoro Timer', href: '/tools/pomodoro-timer', description: 'Focus on work with the Pomodoro technique.' },
            { name: 'Stopwatch', href: '/tools/stopwatch', description: 'Online stopwatch with lap tracking.' },
            { name: 'Countdown Timer', href: '/tools/countdown-timer', description: 'Create countdowns for events.' },
            { name: 'Date Calculator', href: '/tools/date-calculator', description: 'Calculate days between dates.' },
            { name: 'Focus Tracker', href: '/tools/focus-session-tracker', description: 'Track your deep work sessions.' },
            { name: 'Decision Matrix', href: '/tools/decision-matrix', description: 'Evaluate options with weighted criteria.' }
        ]
    },
    {
        id: 'extra-tools',
        title: 'Extra Tools',
        icon: Box,
        description: 'Additional helpful utilities.',
        tools: [
            { name: 'Country Explorer', href: '/tools/country-explorer', description: 'Explore detailed country information.' },
            { name: 'UUID Generator', href: '/tools/uuid-generator', description: 'Generate unique UUIDs/GUIDs.' },
            { name: 'Recipe Scaler', href: '/tools/recipe-scaler', description: 'Scale recipe ingredients up or down.' },
            { name: 'Text Redacter', href: '/tools/text-redaction-tool', description: 'Redact sensitive information from text.' },
            { name: 'Twitter Card Gen', href: '/tools/twitter-card-generator', description: 'Generate Twitter Summary cards.' },
            { name: 'YouTube CTR Sim', href: '/tools/youtube-ctr-simulator', description: 'Simulate YouTube Click-Through Rate.' },
            { name: 'SEO Checklist', href: '/tools/seo-checklist-generator', description: 'Generate custom SEO checklists.' }
        ]
    }
];
