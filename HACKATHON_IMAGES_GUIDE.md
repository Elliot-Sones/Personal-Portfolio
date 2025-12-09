# Hackathon Images Setup Guide

## Implementation Complete! ✅

I've successfully updated your portfolio to include:
- **Small logos** in the top-right corner of each hackathon card
- **Large banner images** on the right side of the card
- **Show only 3 experiences** by default
- **"View All Experiences" button** to expand and see all hackathons

## Next Steps: Add Your Images

You need to add your hackathon images to the `/public` folder. Here's the structure:

### 1. Create Folders

```bash
mkdir -p public/logos
mkdir -p public/hackathons
```

### 2. Add Logo Images (Small - for top-right corner)

Place these square logo images (recommended: 64x64px to 128x128px) in `/public/logos/`:
- `ntangible-logo.png`
- `ai2-logo.png`
- `mues-logo.png`
- `pond-logo.png`

### 3. Add Banner Images (Large - for right side)

Place these banner images (recommended: 800x600px or 16:9 ratio) in `/public/hackathons/`:
- `ntangible-banner.png`
- `ai2-banner.png`
- `mues-banner.png`
- `pond-banner.png`

## Image Specifications

### Logos (Top-right corner)
- **Size**: 64x64px to 128x128px (square)
- **Format**: PNG with transparent background (preferred) or JPG
- **Content**: Company/event logo or icon

### Banners (Right side)
- **Size**: 800x600px or similar (landscape orientation)
- **Format**: PNG or JPG
- **Aspect Ratio**: 4:3 or 16:9 works best
- **Content**: Project screenshot, demo image, or event photo

## Temporary Placeholder

If you don't have images yet, you can use placeholder images temporarily:

```typescript
logo: "/placeholder-logo.png"
image: "/placeholder-banner.png"
```

## Layout Details

### Desktop (Large screens)
- Logo appears in top-left next to the title (64x64px display)
- Banner appears on right side (320x256px display)
- Content on the left side with logo integrated

### Mobile/Tablet
- Logo appears in top-left next to title (64x64px display)
- Banner appears below content (full width, 192px height)

## What Was Changed

1. **Updated hackathons array** with `logo` and `image` fields
2. **Created HackathonList component** with show/hide functionality
3. **Responsive layout** that adapts to mobile and desktop
4. **Hover effects** on the banner images (subtle zoom)
5. **Pixel-art styling** consistent with your portfolio theme

## Test It Out

Run your dev server to see the new layout:
```bash
npm run dev
```

Once you add your images, they'll appear automatically!
