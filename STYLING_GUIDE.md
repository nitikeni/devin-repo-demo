# Survey Webapp - Styling Guide

## Overview

This document provides a comprehensive guide to the CSS styling system used in the Survey Webapp. The styling is designed to be modern, responsive, and user-friendly.

## Color Palette

### Primary Colors
```css
--primary-color: #667eea;      /* Purple - Main brand color */
--primary-dark: #5568d3;       /* Darker purple - Hover states */
--secondary-color: #48bb78;    /* Green - Success/Submit actions */
--secondary-dark: #38a169;     /* Darker green - Hover states */
```

### Status Colors
```css
--danger-color: #f56565;       /* Red - Errors and delete actions */
--warning-color: #ed8936;      /* Orange - Warnings */
--info-color: #4299e1;         /* Blue - Information */
```

### Neutral Colors
```css
--light-gray: #f7fafc;         /* Very light gray - Backgrounds */
--medium-gray: #e2e8f0;        /* Medium gray - Borders */
--dark-gray: #2d3748;          /* Dark gray - Text */
--border-color: #cbd5e0;       /* Border color */
--text-color: #2d3748;         /* Primary text */
--text-light: #718096;         /* Secondary text */
```

### Background Colors
```css
--success-bg: #c6f6d5;         /* Light green - Success backgrounds */
--error-bg: #fed7d7;           /* Light red - Error backgrounds */
```

## Typography

### Font Stack
```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 
             'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 
             'Helvetica Neue', sans-serif;
```

### Font Sizes
- **Header H1**: 2.5em (40px)
- **Header H2**: 1.8em (28.8px)
- **Question Label**: 1.05em (16.8px)
- **Body Text**: 1em (16px)
- **Small Text**: 0.9em (14.4px)
- **Extra Small**: 0.85em (13.6px)

### Font Weights
- **Regular**: 400
- **Medium**: 500
- **Semi-bold**: 600
- **Bold**: 700

## Spacing System

### Padding
- **Small**: 8px
- **Medium**: 12px
- **Large**: 20px
- **Extra Large**: 30px
- **Header**: 50px

### Margins
- **Small**: 10px
- **Medium**: 12px
- **Large**: 20px
- **Extra Large**: 25px
- **Sections**: 30px

## Shadow System

```css
--shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.1);
--shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
--shadow-lg: 0 10px 25px rgba(0, 0, 0, 0.15);
```

## Component Styling

### Header
- **Background**: Linear gradient (purple to violet)
- **Padding**: 50px 30px
- **Text Color**: White
- **Animation**: Animated background pattern
- **Responsive**: Reduces to 30px padding on tablets, 20px on mobile

### Form Elements

#### Input Fields
- **Padding**: 12px 14px
- **Border**: 2px solid #cbd5e0
- **Border Radius**: 6px
- **Focus State**: Blue border with shadow
- **Error State**: Red border with light red background

#### Textarea
- **Min Height**: 120px
- **Resize**: Vertical only
- **Same styling as inputs**

#### Radio & Checkbox
- **Size**: 18px
- **Accent Color**: Primary purple
- **Margin**: 12px from label
- **Cursor**: Pointer

### Buttons

#### Button Variants

**Primary Button**
- **Background**: #667eea
- **Hover**: #5568d3 with shadow
- **Color**: White

**Success Button**
- **Background**: #48bb78
- **Hover**: #38a169 with shadow
- **Color**: White

**Secondary Button**
- **Background**: #e2e8f0
- **Hover**: #cbd5e0
- **Color**: #2d3748

**Danger Button**
- **Background**: #f56565
- **Hover**: #e53e3e with shadow
- **Color**: White

#### Button States
- **Default**: Normal appearance
- **Hover**: Elevated with shadow, slight color change
- **Active**: Pressed appearance
- **Disabled**: 60% opacity, no cursor
- **Focus**: Outline for keyboard navigation

### Form Groups
- **Background**: #f7fafc
- **Padding**: 20px
- **Border Radius**: 8px
- **Border Left**: 4px solid primary color
- **Hover**: Slight elevation and translation

### Results Cards
- **Background**: Gradient (primary to primary-dark)
- **Color**: White
- **Padding**: 20px
- **Border Radius**: 8px
- **Text Alignment**: Center
- **Value Font Size**: 2.5em

### Response Items
- **Background**: #f7fafc
- **Padding**: 20px
- **Border Radius**: 8px
- **Border Left**: 4px solid primary
- **Hover**: Shadow and slight translation

## Animations

### Fade In
```css
@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
Duration: 0.4s
```

### Slide Up
```css
@keyframes slideUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
Duration: 0.5s
```

### Move Background
```css
@keyframes moveBackground {
    0% { transform: translate(0, 0); }
    100% { transform: translate(50px, 50px); }
}
Duration: 20s (infinite)
```

### Spin
```css
@keyframes spin {
    to { transform: rotate(360deg); }
}
Duration: 0.8s (infinite)
```

## Transitions

```css
--transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
```

Applied to:
- Form inputs on focus
- Buttons on hover
- Form groups on hover
- Response items on hover
- All interactive elements

## Responsive Breakpoints

### Desktop (1200px+)
- Full layout
- Maximum width: 900px container
- Multi-column grids
- Full-size buttons

### Tablet (768px - 1199px)
- Adjusted spacing
- Reduced font sizes
- Single column for some elements
- Touch-optimized buttons

### Mobile (480px - 767px)
- Single column layout
- Reduced padding (15px-20px)
- Full-width buttons
- Smaller font sizes
- Touch-friendly sizes (44px minimum)

### Small Mobile (< 480px)
- Minimal layout
- Reduced padding (10px-15px)
- Extra small font sizes
- Compact spacing

## Accessibility Features

### Color Contrast
- Text on background: 4.5:1 ratio (WCAG AA)
- Large text: 3:1 ratio (WCAG AA)

### Focus States
- All interactive elements have visible focus states
- Focus outline or border highlight
- Keyboard navigation support

### Semantic HTML
- Proper heading hierarchy
- Form labels associated with inputs
- Semantic button elements
- Proper list structures

### Error Messages
- Visual indicators (color + icon)
- Text descriptions
- Associated with form fields

## CSS Classes Reference

### Layout
- `.container` - Main wrapper
- `.view` - View container (survey/results)
- `.view.active` - Active view

### Forms
- `.form-section` - Form container
- `.question-group` - Individual question
- `.question-group.error` - Error state
- `.question-label` - Question label
- `.required` - Required indicator
- `.form-input` - Text input
- `.form-textarea` - Textarea
- `.form-select` - Select dropdown
- `.options-group` - Radio/checkbox group
- `.option-item` - Individual option

### Buttons
- `.btn` - Base button
- `.btn-primary` - Primary action
- `.btn-success` - Success action
- `.btn-secondary` - Secondary action
- `.btn-danger` - Danger action
- `.btn-small` - Small button
- `.button-group` - Button container

### Messages
- `.error-message` - Error text
- `.success-message` - Success alert
- `.alert` - Alert container
- `.alert-info` - Info alert
- `.alert-warning` - Warning alert
- `.alert-error` - Error alert
- `.alert-success` - Success alert

### Results
- `.results-container` - Results wrapper
- `.results-summary` - Summary cards
- `.summary-card` - Individual card
- `.response-item` - Response display
- `.response-meta` - Response metadata

### Progress
- `.progress-container` - Progress wrapper
- `.progress-bar` - Progress bar
- `.progress-fill` - Progress fill
- `.progress-text` - Progress text

### Utilities
- `.text-center` - Center text
- `.text-right` - Right align text
- `.mt-10`, `.mt-20` - Top margin
- `.mb-10`, `.mb-20` - Bottom margin
- `.hidden` - Hide element
- `.visible` - Show element
- `.loading` - Loading state
- `.spinner` - Loading spinner

## Customization

### Changing Colors
Modify CSS variables at the top of `styles.css`:
```css
:root {
    --primary-color: #your-color;
    --secondary-color: #your-color;
    /* ... */
}
```

### Changing Fonts
Modify the font-family in the body selector:
```css
body {
    font-family: 'Your Font', sans-serif;
}
```

### Adjusting Spacing
Modify padding/margin values in component selectors.

### Changing Animations
Modify animation durations and keyframes.

## Browser Support

✓ Chrome 90+
✓ Firefox 88+
✓ Safari 14+
✓ Edge 90+
✓ Mobile browsers (iOS Safari 14+, Chrome Mobile)

## Performance Tips

1. **CSS Variables**: Easy to maintain and update
2. **Minimal Specificity**: Easier to override when needed
3. **Efficient Selectors**: Fast CSS parsing
4. **Hardware Acceleration**: Transforms and opacity for animations
5. **No Unnecessary Repaints**: Optimized hover states

## Testing Checklist

- [ ] Test on desktop browsers
- [ ] Test on tablet devices
- [ ] Test on mobile devices
- [ ] Test keyboard navigation
- [ ] Test form validation feedback
- [ ] Test button hover states
- [ ] Test animations
- [ ] Test responsive breakpoints
- [ ] Test print styles
- [ ] Test accessibility with screen reader

---

**Last Updated**: 2024
**Version**: 1.0
