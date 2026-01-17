# UI Component Library

A comprehensive, fully-typed UI component library for SEOStudio built with React 19, TypeScript, and Framer Motion.

## 📦 Components

### Core Components
- **Reveal** - Animated reveal container with fade-in effects
- **Card** - Container with optional hover effects
- **Badge** - Labels and tags with variant styles
- **Button** - Interactive buttons with multiple variants and sizes
- **Tabs** - Tab navigation component

### Form Components
- **Input** - Text input with label and error support
- **Textarea** - Multi-line text input
- **Select** - Dropdown selection
- **Switch** - Toggle switch
- **Checkbox** - Checkbox with indeterminate state
- **Radio** - Radio button

### Feedback Components
- **Progress** - Progress bar with variants
- **Spinner** - Loading spinner
- **Skeleton** - Loading placeholder
- **Modal** - Dialog overlay
- **Tooltip** - Hover tooltips
- **Divider** - Content separator

### System Components
- **CustomCursor** - Interactive custom cursor
- **InteractiveBackground** - Animated mesh background
- **SystemLoader** - Full-screen loader
- **ToolShell** - Page layout for tools

## 🎨 Design Tokens

Centralized design system values are available in `tokens.ts`:

```typescript
import { colors, spacing, borderRadius, shadows, typography } from '@/components/ui/tokens';

// Use in your components
const myStyle = {
  color: colors.accent,
  padding: spacing.lg,
  borderRadius: borderRadius.md,
};
```

### Available Tokens
- `colors` - Color palette
- `spacing` - Spacing scale
- `borderRadius` - Border radius values
- `shadows` - Shadow styles
- `typography` - Font families, sizes, and weights
- `transitions` - Animation timings
- `zIndex` - Z-index layers
- `breakpoints` - Responsive breakpoints

## 🚀 Usage Examples

### Basic Components

```tsx
import { Card, Badge, Button } from '@/components/ui';

function MyComponent() {
  return (
    <Card hover>
      <div className="flex items-center justify-between">
        <h3>Title</h3>
        <Badge variant="success">Active</Badge>
      </div>
      <Button variant="primary" size="lg">
        Click Me
      </Button>
    </Card>
  );
}
```

### Form Components

```tsx
import { Input, Textarea, Select, Switch } from '@/components/ui';

function MyForm() {
  const [enabled, setEnabled] = useState(false);

  return (
    <form>
      <Input 
        label="Email" 
        type="email"
        placeholder="Enter email"
        error="Invalid email"
      />
      <Textarea 
        label="Message"
        placeholder="Your message"
      />
      <Select 
        label="Category"
        options={[
          { value: 'seo', label: 'SEO Tools' },
          { value: 'text', label: 'Text Tools' },
        ]}
      />
      <Switch 
        checked={enabled}
        onChange={setEnabled}
        label="Enable notifications"
      />
    </form>
  );
}
```

### Modal & Tooltips

```tsx
import { Modal, Tooltip, Button } from '@/components/ui';

function MyComponent() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Tooltip content="Click to open settings">
        <Button onClick={() => setIsOpen(true)}>
          Settings
        </Button>
      </Tooltip>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Settings"
        size="md"
      >
        <p>Modal content here</p>
      </Modal>
    </>
  );
}
```

### Progress & Loading States

```tsx
import { Progress, Spinner, Skeleton } from '@/components/ui';

function LoadingExample() {
  return (
    <div>
      <Progress value={75} variant="success" showLabel />
      <Spinner size="lg" variant="accent" />
      <Skeleton variant="rectangular" height={200} />
    </div>
  );
}
```

## 📝 TypeScript Support

All components are fully typed with TypeScript. Import types from the library:

```typescript
import type { ButtonProps, ModalProps, BadgeVariant } from '@/components/ui';
```

## 🎯 Component Showcase

See `ComponentShowcase.tsx` for a complete demonstration of all components.

## 🎨 Theming

Components use CSS variables defined in `globals.css`. Toggle between light and dark themes using the `data-theme` attribute:

```typescript
document.documentElement.setAttribute('data-theme', 'dark');
```

### CSS Variables
- `--bg-primary`, `--bg-secondary`, `--bg-tertiary` - Background colors
- `--fg-primary`, `--fg-secondary`, `--fg-tertiary` - Foreground colors
- `--accent`, `--accent-light`, `--accent-muted` - Accent colors
- `--border-subtle`, `--border-strong` - Border colors
- `--radius-sm`, `--radius-md`, `--radius-lg`, `--radius-xl` - Border radius

## 📦 Bundle Structure

```
src/components/ui/
├── Core.tsx           # Core components (Card, Button, Input, etc.)
├── Modal.tsx          # Modal dialog
├── Tooltip.tsx        # Tooltip component
├── Switch.tsx         # Toggle switch
├── Checkbox.tsx       # Checkbox
├── Radio.tsx          # Radio button
├── Progress.tsx       # Progress bar
├── Spinner.tsx        # Loading spinner
├── Skeleton.tsx       # Loading placeholder
├── Divider.tsx        # Content divider
├── CustomCursor.tsx   # Custom cursor
├── InteractiveBackground.tsx  # Animated background
├── SystemLoader.tsx   # System loader
├── types.ts           # TypeScript definitions
├── tokens.ts          # Design tokens
├── index.ts           # Main export file
├── ComponentShowcase.tsx  # Demo page
└── README.md          # This file
```

## 🔧 Customization

All components accept `className` and `style` props for custom styling:

```tsx
<Button 
  className="my-custom-class"
  style={{ marginTop: '1rem' }}
>
  Custom Button
</Button>
```

## ♿ Accessibility

Components follow WCAG accessibility guidelines:
- Proper ARIA labels
- Keyboard navigation support
- Focus management
- Screen reader support

## 📄 License

Part of the SEOStudio project.