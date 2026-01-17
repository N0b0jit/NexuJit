'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';

// Loading Component
const ToolLoader = () => (
    <div className="flex flex-col items-center justify-center py-32 space-y-8">
        <div className="relative">
            <div className="w-16 h-16 border-4 border-slate-100 rounded-full animate-pulse" />
            <div className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-t-accent rounded-full animate-spin" />
        </div>
        <div className="text-center space-y-2">
            <p className="text-fg-primary font-bold text-lg tracking-tight">Loading Intelligence...</p>
            <p className="text-fg-tertiary text-sm font-medium">Preparing your professional toolkit</p>
        </div>
    </div>
);

// Helper for dynamic imports
const dynamicTool = (componentName: string) => dynamic(() => import(`@/components/tools/${componentName}`), {
    loading: () => <ToolLoader />,
    ssr: false
});

const SerpSimulator = dynamicTool('SerpSimulator');
const WebmasterElite = dynamicTool('WebmasterElite');
const DevEliteTools = dynamicTool('DevEliteTools');
const DesignNeuralTools = dynamicTool('DesignNeuralTools');
const ImageProTools = dynamicTool('ImageProTools');
const AdvancedAudioTools = dynamicTool('AdvancedAudioTools');
const ViralFunTools = dynamicTool('ViralFunTools');
const AcademicScienceTools = dynamicTool('AcademicScienceTools');
const NeuralMultiShare = dynamicTool('NeuralMultiShare');
const ScienceLab = dynamicTool('ScienceLab');
const BionicReading = dynamicTool('BionicReading');
const TextToAscii = dynamicTool('TextToAscii');
const WhitespaceRemover = dynamicTool('WhitespaceRemover');
const TextToHandwriting = dynamicTool('TextToHandwriting');
const UrlEncoder = dynamicTool('UrlEncoder');
const UrlDecoder = dynamicTool('UrlDecoder');
const GoogleFontPairing = dynamicTool('GoogleFontPairing');
const ColorContrastChecker = dynamicTool('ColorContrastChecker');

const toolComponents: { [key: string]: any } = {
    'word-counter': dynamicTool('WordCounter'),
    'youtube-tag-extractor': dynamicTool('YoutubeTagExtractor'),
    'case-converter': dynamicTool('CaseConverter'),
    'article-rewriter': dynamicTool('ArticleRewriter'),
    'json-formatter': dynamicTool('JsonFormatter'),
    'length-converter': (props: any) => {
        const Comp = dynamicTool('UnitConverter');
        return <Comp {...props} type="length" />;
    },
    'currency-converter': dynamicTool('CurrencyConverter'),
    'weight-converter': (props: any) => {
        const Comp = dynamicTool('UnitConverter');
        return <Comp {...props} type="weight" />;
    },
    'temperature-converter': (props: any) => {
        const Comp = dynamicTool('UnitConverter');
        return <Comp {...props} type="temperature" />;
    },
    'area-converter': (props: any) => {
        const Comp = dynamicTool('UnitConverter');
        return <Comp {...props} type="area" />;
    },
    'digital-converter': (props: any) => {
        const Comp = dynamicTool('UnitConverter');
        return <Comp {...props} type="digital" />;
    },
    'speed-converter': (props: any) => {
        const Comp = dynamicTool('UnitConverter');
        return <Comp {...props} type="speed" />;
    },
    'volume-converter': (props: any) => {
        const Comp = dynamicTool('UnitConverter');
        return <Comp {...props} type="volume" />;
    },
    'time-converter': (props: any) => {
        const Comp = dynamicTool('UnitConverter');
        return <Comp {...props} type="time" />;
    },
    'pressure-converter': (props: any) => {
        const Comp = dynamicTool('UnitConverter');
        return <Comp {...props} type="pressure" />;
    },
    'energy-converter': (props: any) => {
        const Comp = dynamicTool('UnitConverter');
        return <Comp {...props} type="energy" />;
    },
    'power-converter': (props: any) => {
        const Comp = dynamicTool('UnitConverter');
        return <Comp {...props} type="power" />;
    },
    'force-converter': (props: any) => {
        const Comp = dynamicTool('UnitConverter');
        return <Comp {...props} type="force" />;
    },
    'ai-content-writer': dynamicTool('AiContentWriter'),
    'ai-meta-optimizer': dynamicTool('AiMetaOptimizer'),
    'ai-keyword-suggester': dynamicTool('AiKeywordSuggester'),
    'ai-prompt-enhancer': dynamicTool('AiPromptEnhancer'),
    'sitemap-generator': dynamicTool('SitemapGenerator'),
    'robots-txt-builder': dynamicTool('RobotsTxtBuilder'),
    'password-strength': dynamicTool('PasswordStrength'),
    'readability-score': dynamicTool('ReadabilityScore'),
    'what-is-my-ip': dynamicTool('MyIpTool'),
    'color-palette-generator': dynamicTool('ColorGenerator'),
    'logic-circuit-simulator': (props: any) => <AcademicScienceTools {...props} defaultTab="logic" />,
    'webgpu-deep-scan': (props: any) => <AcademicScienceTools {...props} defaultTab="webgpu" />,
    'science-lab': (props: any) => <ScienceLab {...props} defaultTab="apod" />,
    'universal-multi-share': NeuralMultiShare,
    'recon-command-center': dynamicTool('ReconPro'),
    'google-dork-generator': dynamicTool('GoogleDorks'),

    'twitter-card-generator': dynamicTool('TwitterCardGenerator'),
    'duplicate-line-remover': dynamicTool('DuplicateLineRemover'),
    'youtube-thumbnail-downloader': dynamicTool('YoutubeThumbnailDownloader'),
    'qr-code-generator': dynamicTool('QrCodeGenerator'),
    'utm-builder': dynamicTool('UtmBuilder'),
    'password-generator': dynamicTool('PasswordGenerator'),
    'adsense-calculator': dynamicTool('AdsenseCalculator'),
    'paypal-fee-calculator': dynamicTool('PaypalFeeCalculator'),
    'html-minifier': dynamicTool('HtmlMinifier'),
    'css-minifier': dynamicTool('CssMinifier'),
    'text-repeater': dynamicTool('TextRepeater'),
    'number-to-word': dynamicTool('NumberToWord'),
    'youtube-money-calculator': dynamicTool('YoutubeMoneyCalculator'),
    'youtube-tag-generator': dynamicTool('YoutubeTagGenerator'),
    'text-to-binary': dynamicTool('TextToBinary'),
    'binary-to-text': dynamicTool('BinaryToText'),
    'md5-generator': dynamicTool('Md5Generator'),
    'lorem-ipsum-generator': dynamicTool('LoremIpsumGenerator'),
    'text-to-slug': dynamicTool('TextToSlug'),
    'base64-encode': dynamicTool('Base64Encoder'),
    'base64-decode': dynamicTool('Base64Decoder'),
    'text-to-hex': dynamicTool('TextToHex'),
    'hex-to-text': dynamicTool('HexToText'),
    'keyword-density-checker': dynamicTool('KeywordDensityChecker'),
    'comma-separator': dynamicTool('CommaSeparator'),
    'decimal-to-binary': dynamicTool('DecimalToBinary'),
    'cpm-calculator': dynamicTool('CpmCalculator'),
    'text-to-hashtags': dynamicTool('TextToHashtags'),
    'youtube-title-extractor': dynamicTool('YoutubeTitleExtractor'),
    'youtube-description-extractor': dynamicTool('YoutubeDescriptionExtractor'),
    'youtube-embed-code-generator': dynamicTool('YoutubeEmbedCodeGenerator'),
    'meta-tag-generator': dynamicTool('MetaTagGenerator'),
    'youtube-hashtag-extractor': dynamicTool('YoutubeHashtagExtractor'),
    'youtube-hashtag-generator': dynamicTool('YoutubeHashtagGenerator'),
    'user-agent': dynamicTool('UserAgentFinder'),
    'color-converter': dynamicTool('ColorConverter'),
    'credit-card-generator': dynamicTool('CreditCardGenerator'),
    'youtube-title-generator': dynamicTool('YoutubeTitleGenerator'),
    'youtube-title-length-checker': dynamicTool('YoutubeTitleLengthChecker'),
    'youtube-description-generator': dynamicTool('YoutubeDescriptionGenerator'),
    'youtube-channel-id': dynamicTool('YoutubeChannelId'),
    'youtube-video-statistics': dynamicTool('YoutubeVideoStatistics'),
    'youtube-channel-statistics': dynamicTool('YoutubeChannelStatistics'),
    'youtube-region-restriction': dynamicTool('YoutubeRegionRestriction'),
    'youtube-logo-downloader': dynamicTool('YoutubeChannelLogoDownloader'),
    'youtube-comment-picker': dynamicTool('YoutubeCommentPicker'),
    'privacy-policy-generator': dynamicTool('PrivacyPolicyGenerator'),
    'terms-generator': dynamicTool('TermsGenerator'),
    'http-status-code': dynamicTool('HttpStatusCode'),
    'internet-speed-test': dynamicTool('InternetSpeedTest'),
    'server-status-checker': dynamicTool('ServerStatusChecker'),
    'page-size-checker': dynamicTool('PageSizeChecker'),
    'redirect-checker': dynamicTool('UrlRedirectChecker'),
    'json-viewer': dynamicTool('JsonViewer'),
    'json-to-xml': dynamicTool('JsonToXml'),
    'csv-to-json': dynamicTool('CsvToJson'),
    'xml-to-json': dynamicTool('XmlToJson'),
    'javascript-minifier': dynamicTool('JavascriptMinifier'),
    'country-explorer': dynamicTool('CountryExplorer'),
    'recipe-finder': dynamicTool('RecipeFinder'),
    'image-resizer': dynamicTool('ImageResizer'),
    'image-converter': dynamicTool('ImageConverter'),
    'image-to-base64': dynamicTool('ImageToBase64'),
    'stopwatch': dynamicTool('Stopwatch'),
    'date-calculator': dynamicTool('DateCalculator'),
    'morse-code-converter': dynamicTool('MorseConverter'),
    'svg-blob-generator': dynamicTool('SvgBlobGenerator'),
    'svg-pattern-generator': dynamicTool('SvgPatternGenerator'),
    'glassmorphism-generator': dynamicTool('GlassmorphismGenerator'),
    'css-loader-generator': dynamicTool('CssLoaderGenerator'),
    'css-box-shadow-generator': dynamicTool('CssBoxShadowGenerator'),
    'css-clip-path-generator': dynamicTool('CssClipPathGenerator'),
    'css-gradient-generator': dynamicTool('CssGradientGenerator'),
    'css-triangle-generator': dynamicTool('CssTriangleGenerator'),
    'css-border-radius-generator': dynamicTool('CssBorderRadiusGenerator'),
    'css-switch-generator': dynamicTool('CssSwitchGenerator'),
    'favicon-generator': dynamicTool('FaviconGenerator'),
    'htaccess-generator': dynamicTool('HtaccessGenerator'),
    'social-post-preview': dynamicTool('SocialMediaPreviewer'),
    'schema-generator': dynamicTool('SchemaGenerator'),
    'invoice-generator': dynamicTool('InvoiceGenerator'),
    'roi-calculator': dynamicTool('ROICalculator'),
    'profit-margin-calculator': dynamicTool('ProfitMarginCalculator'),
    'freelance-rate-calculator': dynamicTool('FreelanceRateCalculator'),
    'base64-to-image': dynamicTool('Base64ToImage'),
    'google-cache-checker': dynamicTool('GoogleCacheChecker'),
    'google-index-checker': dynamicTool('GoogleIndexChecker'),
    'flip-rotate-image': dynamicTool('FlipRotateImage'),
    'og-generator': dynamicTool('OpenGraphGenerator'),
    'ico-to-png': dynamicTool('IcoToPng'),
    'meta-tag-analyzer': dynamicTool('MetaTagAnalyzer'),
    'percentage-calculator': dynamicTool('PercentageCalculator'),
    'uuid-generator': dynamicTool('UuidGenerator'),
    'youtube-ctr-simulator': dynamicTool('YouTubeCtrSimulator'),
    'seo-checklist-generator': dynamicTool('SeoChecklistGenerator'),
    'click-curve-simulator': dynamicTool('ClickCurveSimulator'),
    'decision-matrix': dynamicTool('DecisionMatrix'),
    'focus-session-tracker': dynamicTool('FocusSessionTracker'),
    'text-redaction-tool': dynamicTool('TextRedactionTool'),
    'image-safe-area-checker': dynamicTool('ImageSafeAreaChecker'),
    'youtube-views-ratio': dynamicTool('YoutubeViewsRatio'),
    'image-cropper': dynamicTool('ImageResizer'),
    'image-filters': dynamicTool('ImageFilters'),
    'image-average-color-finder': dynamicTool('ImageAverageColor'),
    'image-color-extractor': dynamicTool('ImageColorExtractor'),
    'photo-censor': dynamicTool('PhotoCensor'),
    'svg-to-png': dynamicTool('SvgToPng'),
    'image-caption-generator': dynamicTool('ImageCaptionGenerator'),
    'scanned-pdf-converter': dynamicTool('ScannedPdfConverter'),
    'discount-calculator': dynamicTool('DiscountCalculator'),
    'age-calculator': dynamicTool('AgeCalculator'),
    'gst-calculator': dynamicTool('GstCalculator'),
    'qr-code-decoder': dynamicTool('QrCodeDecoder'),
    'image-to-pdf': dynamicTool('ImageToPdf'),
    'pdf-merger': dynamicTool('PdfMerger'),
    'pdf-protector': dynamicTool('PdfProtector'),
    'pdf-rotator': dynamicTool('PdfRotator'),
    'pdf-page-numbers': dynamicTool('PdfPageNumbers'),
    'pdf-to-image': dynamicTool('PdfToImage'),
    'pdf-to-office': dynamicTool('PdfToOffice'),
    'office-to-pdf': dynamicTool('OfficeToPdf'),
    'pdf-compressor': dynamicTool('PdfCompressor'),
    'image-color-picker': dynamicTool('ImageColorPicker'),
    'social-media-downloader': dynamicTool('SocialMediaDownloader'),
    'audio-converter': dynamicTool('AudioConverter'),
    'video-converter': dynamicTool('VideoConverter'),
    'document-converter': dynamicTool('DocumentConverter'),
    'archive-extractor': dynamicTool('ArchiveExtractor'),
    'screen-recorder': dynamicTool('ScreenRecorder'),
    'text-to-speech': dynamicTool('TextToSpeech'),
    'voice-recorder': dynamicTool('VoiceRecorder'),
    'nobojiclizer': dynamicTool('Nobojiclizer'),
    'nutrition-calculator': dynamicTool('NutritionCalculator'),
    'bmi-calculator': dynamicTool('BmiCalculator'),
    'tdee-calculator': dynamicTool('TdeeCalculator'),
    'calorie-burn-calculator': dynamicTool('CalorieBurnCalculator'),
    'water-intake-calculator': dynamicTool('WaterIntakeCalculator'),
    'life-expectancy-calculator': dynamicTool('LifeExpectancyCalculator'),
    'trim-video': (props: any) => {
        const Comp = dynamicTool('VideoToolkit');
        return <Comp {...props} mode="trim" />;
    },
    'merge-videos': (props: any) => {
        const Comp = dynamicTool('VideoToolkit');
        return <Comp {...props} mode="merge" />;
    },
    'video-editor': (props: any) => {
        const Comp = dynamicTool('VideoToolkit');
        return <Comp {...props} mode="trim" />;
    },
    'crop-video': (props: any) => {
        const Comp = dynamicTool('VideoToolkit');
        return <Comp {...props} mode="trim" />;
    },
    'rotate-video': (props: any) => {
        const Comp = dynamicTool('VideoToolkit');
        return <Comp {...props} mode="trim" />;
    },
    'flip-video': (props: any) => {
        const Comp = dynamicTool('VideoToolkit');
        return <Comp {...props} mode="trim" />;
    },
    'resize-video': (props: any) => {
        const Comp = dynamicTool('VideoToolkit');
        return <Comp {...props} mode="trim" />;
    },
    'loop-video': (props: any) => {
        const Comp = dynamicTool('VideoToolkit');
        return <Comp {...props} mode="trim" />;
    },
    'video-volume': (props: any) => {
        const Comp = dynamicTool('VideoToolkit');
        return <Comp {...props} mode="trim" />;
    },
    'video-speed': (props: any) => {
        const Comp = dynamicTool('VideoToolkit');
        return <Comp {...props} mode="trim" />;
    },
    'stabilize-video': (props: any) => {
        const Comp = dynamicTool('VideoToolkit');
        return <Comp {...props} mode="trim" />;
    },
    'add-audio-to-video': (props: any) => {
        const Comp = dynamicTool('VideoToolkit');
        return <Comp {...props} mode="trim" />;
    },
    'add-image-to-video': (props: any) => {
        const Comp = dynamicTool('VideoToolkit');
        return <Comp {...props} mode="trim" />;
    },
    'add-text-to-video': (props: any) => {
        const Comp = dynamicTool('VideoToolkit');
        return <Comp {...props} mode="trim" />;
    },
    'remove-logo': (props: any) => {
        const Comp = dynamicTool('VideoToolkit');
        return <Comp {...props} mode="trim" />;
    },
    'video-recorder': dynamicTool('VideoToolkit'),
    'trim-audio': dynamicTool('AudioConverter'),
    'change-audio-volume': dynamicTool('AudioConverter'),
    'change-audio-speed': dynamicTool('AudioConverter'),
    'change-audio-pitch': dynamicTool('AudioConverter'),
    'audio-equalizer': dynamicTool('AudioConverter'),
    'reverse-audio': dynamicTool('AudioConverter'),
    'audio-joiner': dynamicTool('AudioConverter'),
    'archive-converter': dynamicTool('UniversalConverter'),
    'ebook-converter': dynamicTool('UniversalConverter'),
    'font-converter': dynamicTool('UniversalConverter'),
    'recipe-scaler': dynamicTool('RecipeScaler'),
    'system-diagnostics': dynamicTool('SystemDiagnostics'),
    'css-unit-converter': dynamicTool('CssUnitConverter'),
    'decision-randomizer': dynamicTool('DecisionRandomizer'),
    'finance-toolkit': dynamicTool('FinanceToolkit'),
    'gradient-explorer': dynamicTool('GradientExplorer'),
    'shadow-visualizer': dynamicTool('ShadowVisualizer'),
    'matrix-calculator': dynamicTool('MatrixCalculator'),
    'equation-solver': dynamicTool('EquationSolver'),
    'pattern-generator': dynamicTool('PatternGenerator'),
    'color-blindness-simulator': dynamicTool('ColorBlindnessSimulator'),
    'random-joke-generator': (props: any) => {
        const Comp = dynamicTool('EntertainmentHub');
        return <Comp {...props} defaultTab="jokes" />;
    },
    'random-quote-generator': (props: any) => {
        const Comp = dynamicTool('EntertainmentHub');
        return <Comp {...props} defaultTab="quotes" />;
    },
    'random-fact-generator': (props: any) => {
        const Comp = dynamicTool('EntertainmentHub');
        return <Comp {...props} defaultTab="facts" />;
    },
    'number-facts': (props: any) => {
        const Comp = dynamicTool('EntertainmentHub');
        return <Comp {...props} defaultTab="numbers" />;
    },
    'dog-cat-image': (props: any) => {
        const Comp = dynamicTool('EntertainmentHub');
        return <Comp {...props} defaultTab="animals" />;
    },
    'random-activity-suggestion': (props: any) => {
        const Comp = dynamicTool('EntertainmentHub');
        return <Comp {...props} defaultTab="activities" />;
    },
    'entertainment-hub': (props: any) => {
        const Comp = dynamicTool('EntertainmentHub');
        return <Comp {...props} defaultTab="jokes" />;
    },
    'astronomy-picture': (props: any) => {
        const Comp = dynamicTool('ScienceLab');
        return <Comp {...props} defaultTab="apod" />;
    },
    'public-holiday-finder': (props: any) => {
        const Comp = dynamicTool('ScienceLab');
        return <Comp {...props} defaultTab="holidays" />;
    },
    'open-trivia-quiz': (props: any) => {
        const Comp = dynamicTool('ScienceLab');
        return <Comp {...props} defaultTab="trivia" />;
    },
    'ip-geolocation': (props: any) => {
        const Comp = dynamicTool('ScienceLab');
        return <Comp {...props} defaultTab="ip" />;
    },
    'iss-tracker': (props: any) => {
        const Comp = dynamicTool('ScienceLab');
        return <Comp {...props} defaultTab="space" />;
    },
    'advanced-system-tools': (props: any) => {
        const Comp = dynamicTool('AdvancedSystemTools');
        return <Comp {...props} defaultTab="webgl" />;
    },
    'webgl-stress-test': (props: any) => {
        const Comp = dynamicTool('AdvancedSystemTools');
        return <Comp {...props} defaultTab="webgl" />;
    },
    'battery-stress-visualizer': (props: any) => {
        const Comp = dynamicTool('AdvancedSystemTools');
        return <Comp {...props} defaultTab="battery" />;
    },
    'offline-storage-tester': (props: any) => {
        const Comp = dynamicTool('AdvancedSystemTools');
        return <Comp {...props} defaultTab="storage" />;
    },
    'peripheral-calibration': (props: any) => {
        const Comp = dynamicTool('AdvancedSystemTools');
        return <Comp {...props} defaultTab="input" />;
    },
    'ip-intelligence': (props: any) => {
        const Comp = dynamicTool('GeographyTools');
        return <Comp {...props} defaultTab="ip-intel" />;
    },
    'emergency-numbers': (props: any) => {
        const Comp = dynamicTool('GeographyTools');
        return <Comp {...props} defaultTab="emergency" />;
    },
    'world-population': (props: any) => {
        const Comp = dynamicTool('GeographyTools');
        return <Comp {...props} defaultTab="population" />;
    },
    'internet-shutdown-monitor': (props: any) => {
        const Comp = dynamicTool('GeographyTools');
        return <Comp {...props} defaultTab="shutdowns" />;
    },
    'sunrise-sunset-times': (props: any) => {
        const Comp = dynamicTool('GeographyTools');
        return <Comp {...props} defaultTab="sun" />;
    },
    'city-facts-explorer': (props: any) => {
        const Comp = dynamicTool('GeographyTools');
        return <Comp {...props} defaultTab="cities" />;
    },
    'wikipedia-explorer': (props: any) => {
        const Comp = dynamicTool('KnowledgeTools');
        return <Comp {...props} defaultTab="wiki" />;
    },
    'today-in-history': (props: any) => {
        const Comp = dynamicTool('KnowledgeTools');
        return <Comp {...props} defaultTab="history" />;
    },
    'quote-context-explainer': (props: any) => {
        const Comp = dynamicTool('KnowledgeTools');
        return <Comp {...props} defaultTab="quotes" />;
    },
    'public-domain-poetry': (props: any) => {
        const Comp = dynamicTool('KnowledgeTools');
        return <Comp {...props} defaultTab="poetry" />;
    },
    'etymology-viewer': (props: any) => {
        const Comp = dynamicTool('KnowledgeTools');
        return <Comp {...props} defaultTab="etymology" />;
    },
    'moon-phase': (props: any) => {
        const Comp = dynamicTool('NatureTools');
        return <Comp {...props} defaultTab="moon" />;
    },
    'meteor-shower-calendar': (props: any) => {
        const Comp = dynamicTool('NatureTools');
        return <Comp {...props} defaultTab="meteor" />;
    },
    'earthquake-live-feed': (props: any) => {
        const Comp = dynamicTool('NatureTools');
        return <Comp {...props} defaultTab="earthquake" />;
    },
    'volcano-activity-tracker': (props: any) => {
        const Comp = dynamicTool('NatureTools');
        return <Comp {...props} defaultTab="volcano" />;
    },
    'daylight-length-calculator': (props: any) => {
        const Comp = dynamicTool('NatureTools');
        return <Comp {...props} defaultTab="daylight" />;
    },
    'http-header-decoder': (props: any) => {
        const Comp = dynamicTool('DevUtils');
        return <Comp {...props} defaultTab="headers" />;
    },
    'mime-type-explorer': (props: any) => {
        const Comp = dynamicTool('DevUtils');
        return <Comp {...props} defaultTab="mime" />;
    },
    'http-status-story': (props: any) => {
        const Comp = dynamicTool('DevUtils');
        return <Comp {...props} defaultTab="status" />;
    },
    'user-agent-breakdown': (props: any) => {
        const Comp = dynamicTool('DevUtils');
        return <Comp {...props} defaultTab="ua" />;
    },
    'dns-resolver-tester': (props: any) => {
        const Comp = dynamicTool('DevUtils');
        return <Comp {...props} defaultTab="dns" />;
    },
    'csv-data-generator': (props: any) => {
        const Comp = dynamicTool('DataTools');
        return <Comp {...props} defaultTab="csv" />;
    },
    'fake-profile-generator': (props: any) => {
        const Comp = dynamicTool('DataTools');
        return <Comp {...props} defaultTab="profile" />;
    },
    'country-comparison': (props: any) => {
        const Comp = dynamicTool('DataTools');
        return <Comp {...props} defaultTab="country" />;
    },
    'language-viewer': (props: any) => {
        const Comp = dynamicTool('DataTools');
        return <Comp {...props} defaultTab="language" />;
    },
    'currency-explorer-data': (props: any) => {
        const Comp = dynamicTool('DataTools');
        return <Comp {...props} defaultTab="currency" />;
    },
    'public-breach-checker': (props: any) => {
        const Comp = dynamicTool('PrivacySecurityTools');
        return <Comp {...props} defaultTab="breach" />;
    },
    'url-safety-hint': (props: any) => {
        const Comp = dynamicTool('PrivacySecurityTools');
        return <Comp {...props} defaultTab="safety" />;
    },
    'email-header-analyzer': (props: any) => {
        const Comp = dynamicTool('PrivacySecurityTools');
        return <Comp {...props} defaultTab="email" />;
    },
    'metadata-education': (props: any) => {
        const Comp = dynamicTool('PrivacySecurityTools');
        return <Comp {...props} defaultTab="metadata" />;
    },
    'tracking-parameter-cleaner': (props: any) => {
        const Comp = dynamicTool('PrivacySecurityTools');
        return <Comp {...props} defaultTab="cleaner" />;
    },
    'personal-system-builder': (props: any) => {
        const Comp = dynamicTool('PersonalSystemBuilder');
        return <Comp {...props} defaultTab="routines" />;
    },
    'tomorrow-setup-tool': (props: any) => {
        const Comp = dynamicTool('PersonalSystemBuilder');
        return <Comp {...props} defaultTab="tomorrow" />;
    },
    // AI Tools
    'ai-content-detector': dynamicTool('AiDetector'),
    'ai-text-humanizer': dynamicTool('AiHumanizer'),

    // Design Neural Tools
    'brand-psychology-auditor': (props: any) => {
        const Comp = dynamicTool('DesignNeuralTools');
        return <Comp {...props} defaultTab="psychology" />;
    },
    'site-palette-counter': (props: any) => {
        const Comp = dynamicTool('DesignNeuralTools');
        return <Comp {...props} defaultTab="palette" />;
    },
    'svg-glow-tracer': (props: any) => {
        const Comp = dynamicTool('DesignNeuralTools');
        return <Comp {...props} defaultTab="glow" />;
    },
    'svg-skeleton-generator': (props: any) => {
        const Comp = dynamicTool('DesignNeuralTools');
        return <Comp {...props} defaultTab="skeleton" />;
    },

    // Advanced Audio Tools
    'audio-spectrogram': (props: any) => {
        const Comp = dynamicTool('AdvancedAudioTools');
        return <Comp {...props} defaultTab="spectrogram" />;
    },
    'audio-beat-studio': (props: any) => {
        const Comp = dynamicTool('AdvancedAudioTools');
        return <Comp {...props} defaultTab="beat" />;
    },

    // Fun & Games
    'ascii-webcam-matrix': (props: any) => {
        const Comp = dynamicTool('ViralFunTools');
        return <Comp {...props} defaultTab="ascii" />;
    },

    // Image Tools
    'browser-lightroom': (props: any) => {
        const Comp = dynamicTool('ImageProTools');
        return <Comp {...props} defaultTab="lightroom" />;
    },
    'image-compressor': dynamicTool('ImageCompressor'),

    // PDF Tools
    'pdf-splitter': dynamicTool('PdfSplitter'),

    // Productivity Tools
    'pomodoro-timer': dynamicTool('PomodoroTimer'),
    'countdown-timer': dynamicTool('CountdownTimer'),

    // Calculator Tools
    'interest-calculator': dynamicTool('InterestCalculator'),
    'loan-calculator': dynamicTool('LoanCalculator'),

    // SEO Tools
    'serp-simulator': SerpSimulator,
    'clutter-heatmap': (props: any) => {
        const Comp = dynamicTool('WebmasterElite');
        return <Comp {...props} defaultTab="heatmap" />;
    },

    // Dev Tools
    'css-audit-cleanup': (props: any) => {
        const Comp = dynamicTool('DevEliteTools');
        return <Comp {...props} defaultTab="audit" />;
    },
    'css-animation-forge': (props: any) => {
        const Comp = dynamicTool('DevEliteTools');
        return <Comp {...props} defaultTab="animation" />;
    },
    'css-grid-template-forge': (props: any) => {
        const Comp = dynamicTool('DevEliteTools');
        return <Comp {...props} defaultTab="grid" />;
    },
    'rotating-border-generator': (props: any) => {
        const Comp = dynamicTool('DevEliteTools');
        return <Comp {...props} defaultTab="border" />;
    },

    // Text Tools (already imported at top)
    'bionic-reading': BionicReading,
    'text-to-ascii': TextToAscii,
    'whitespace-remover': WhitespaceRemover,
    'text-to-handwriting': TextToHandwriting,
    'url-encoder': UrlEncoder,
    'url-decoder': UrlDecoder,
    'google-font-pairing': GoogleFontPairing,
    'color-contrast-checker': ColorContrastChecker
};

export default function ToolRenderer({ slug }: { slug: string }) {
    const SpecificTool = toolComponents[slug] || (() => (
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
            <h3 className="text-xl font-bold text-fg-tertiary uppercase tracking-wider">Module Under Optimization</h3>
            <p className="text-fg-tertiary max-w-sm">This tool is currently being enhanced for the premium experience. Check back shortly.</p>
        </div>
    ));

    return (
        <Suspense fallback={<ToolLoader />}>
            <SpecificTool />
        </Suspense>
    );
}
