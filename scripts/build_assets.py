import os
import math
from PIL import Image, ImageDraw, ImageFont, ImageFilter

OUTPUT_DIR = "public"
IMAGES_DIR = os.path.join(OUTPUT_DIR, "images")
os.makedirs(IMAGES_DIR, exist_ok=True)

print("Starting asset generation for Andrea Labrador...")

# -------------------------------------------------------------
# 1. GENERATE FAVICON SVG
# -------------------------------------------------------------
favicon_svg_content = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#2D4036"/>
      <stop offset="50%" stop-color="#3A5346"/>
      <stop offset="100%" stop-color="#1A2720"/>
    </linearGradient>
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FDF2D6"/>
      <stop offset="25%" stop-color="#E2C582"/>
      <stop offset="60%" stop-color="#BF984A"/>
      <stop offset="100%" stop-color="#EAD198"/>
    </linearGradient>
    <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#0F1813" flood-opacity="0.5"/>
    </filter>
  </defs>

  <!-- Base Squircle -->
  <rect width="512" height="512" rx="128" fill="url(#bgGrad)"/>
  
  <!-- Outer Border -->
  <rect x="18" y="18" width="476" height="476" rx="114" fill="none" stroke="url(#goldGrad)" stroke-width="4" opacity="0.45"/>
  
  <!-- Inner Delicate Concentric Circles -->
  <circle cx="256" cy="256" r="212" fill="none" stroke="url(#goldGrad)" stroke-width="2" opacity="0.6"/>
  <circle cx="256" cy="256" r="202" fill="none" stroke="url(#goldGrad)" stroke-width="1.2" stroke-dasharray="6 8" opacity="0.4"/>

  <!-- Top Star Accent -->
  <path d="M 256 66 L 261 80 L 275 84 L 261 88 L 256 102 L 251 88 L 237 84 L 251 80 Z" fill="url(#goldGrad)"/>

  <!-- Bottom Accent Dots -->
  <circle cx="256" cy="438" r="4.5" fill="url(#goldGrad)"/>
  <circle cx="238" cy="438" r="2.5" fill="url(#goldGrad)" opacity="0.7"/>
  <circle cx="274" cy="438" r="2.5" fill="url(#goldGrad)" opacity="0.7"/>

  <!-- Monogram AL -->
  <g filter="url(#softGlow)">
    <text x="256" y="324" font-family="'Cormorant Garamond', 'Georgia', 'Times New Roman', serif" font-size="216" font-weight="700" letter-spacing="4" fill="url(#goldGrad)" text-anchor="middle">AL</text>
  </g>
  
  <!-- Subtitle NAILS -->
  <text x="256" y="382" font-family="'Plus Jakarta Sans', 'Segoe UI', Arial, sans-serif" font-size="30" font-weight="700" letter-spacing="14" fill="#FDF2D6" text-anchor="middle" opacity="0.92">NAILS</text>
</svg>
"""

svg_path = os.path.join(OUTPUT_DIR, "favicon.svg")
with open(svg_path, "w", encoding="utf-8") as f:
    f.write(favicon_svg_content.strip())
print(f"Generated: {svg_path}")

# -------------------------------------------------------------
# 2. GENERATE PNG & ICO FAVICONS
# -------------------------------------------------------------
size = 512
img_fav = Image.new("RGBA", (size, size), (0, 0, 0, 0))
draw_fav = ImageDraw.Draw(img_fav)

# Background gradient
for y in range(size):
    ratio = y / size
    r = int(45 * (1 - ratio) + 26 * ratio)
    g = int(64 * (1 - ratio) + 39 * ratio)
    b = int(54 * (1 - ratio) + 32 * ratio)
    draw_fav.line([(0, y), (size, y)], fill=(r, g, b, 255))

# Squircle mask
mask = Image.new("L", (size, size), 0)
mask_draw = ImageDraw.Draw(mask)
mask_draw.rounded_rectangle([(0, 0), (size - 1, size - 1)], radius=128, fill=255)
img_fav.putalpha(mask)

draw_fav = ImageDraw.Draw(img_fav)

# Outer and inner gold circles
gold_bright = (245, 226, 175, 230)
gold_accent = (212, 175, 55, 140)

draw_fav.arc([(44, 44), (size - 44, size - 44)], start=0, end=360, fill=gold_bright, width=3)
draw_fav.arc([(56, 56), (size - 56, size - 56)], start=0, end=360, fill=gold_accent, width=1)

# Star at top
draw_fav.polygon([(256, 68), (261, 80), (273, 84), (261, 88), (256, 100), (251, 88), (239, 84), (251, 80)], fill=gold_bright)

# Monogram AL
try:
    font_al = ImageFont.truetype("georgia.ttf", 216)
    font_sub = ImageFont.truetype("segoeui.ttf", 30)
except Exception:
    font_al = ImageFont.load_default()
    font_sub = ImageFont.load_default()

al_text = "AL"
bbox = draw_fav.textbbox((0, 0), al_text, font=font_al)
tw = bbox[2] - bbox[0]
th = bbox[3] - bbox[1]
tx = (size - tw) // 2 - bbox[0]
ty = (size - th) // 2 - bbox[1] - 25

# Shadow
draw_fav.text((tx + 2, ty + 4), al_text, font=font_al, fill=(15, 24, 19, 180))
# Gold text
draw_fav.text((tx, ty), al_text, font=font_al, fill=(247, 237, 206, 255))

# Subtitle NAILS
sub_text = "N A I L S"
sbbox = draw_fav.textbbox((0, 0), sub_text, font=font_sub)
stw = sbbox[2] - sbbox[0]
stx = (size - stw) // 2 - sbbox[0]
draw_fav.text((stx, ty + th + 26), sub_text, font=font_sub, fill=(226, 197, 130, 240))

# Export various sizes
apple_icon = img_fav.resize((180, 180), Image.Resampling.LANCZOS)
apple_icon.save(os.path.join(OUTPUT_DIR, "apple-touch-icon.png"), "PNG")
print("Generated: apple-touch-icon.png (180x180)")

fav_192 = img_fav.resize((192, 192), Image.Resampling.LANCZOS)
fav_192.save(os.path.join(OUTPUT_DIR, "favicon-192x192.png"), "PNG")

fav_48 = img_fav.resize((48, 48), Image.Resampling.LANCZOS)
fav_48.save(os.path.join(OUTPUT_DIR, "favicon-48x48.png"), "PNG")

fav_32 = img_fav.resize((32, 32), Image.Resampling.LANCZOS)
fav_32.save(os.path.join(OUTPUT_DIR, "favicon-32x32.png"), "PNG")

fav_16 = img_fav.resize((16, 16), Image.Resampling.LANCZOS)
fav_16.save(os.path.join(OUTPUT_DIR, "favicon-16x16.png"), "PNG")

# Multi-resolution ICO
img_fav.resize((48, 48), Image.Resampling.LANCZOS).save(
    os.path.join(OUTPUT_DIR, "favicon.ico"),
    format="ICO",
    sizes=[(16, 16), (32, 32), (48, 48)]
)
print("Generated: favicon.ico, favicon-32x32.png, favicon-16x16.png")


# -------------------------------------------------------------
# 3. GENERATE WHATSAPP & SOCIAL OPEN GRAPH SHARE BANNER (1200 x 630)
# Target file size: ~120 - 160 KB (WhatsApp hard ceiling is 300 KB)
# -------------------------------------------------------------
W, H = 1200, 630
og_img = Image.new("RGB", (W, H), (34, 49, 42))
draw_og = ImageDraw.Draw(og_img)

# Luxury background gradient
for y in range(H):
    r_val = y / H
    r = int(38 * (1 - r_val * 0.7) + 20 * (r_val * 0.7))
    g = int(56 * (1 - r_val * 0.7) + 32 * (r_val * 0.7))
    b = int(48 * (1 - r_val * 0.7) + 26 * (r_val * 0.7))
    draw_og.line([(0, y), (W, y)], fill=(r, g, b))

# Decorative frame with gold hairline
gold_hairline = (212, 175, 55, 90)
gold_main = (230, 205, 145)
draw_og.rounded_rectangle([(24, 24), (W - 24, H - 24)], radius=24, outline=(212, 175, 55), width=2)
draw_og.rounded_rectangle([(32, 32), (W - 32, H - 32)], radius=18, outline=(180, 150, 60), width=1)

# Corner accents
def draw_corner(cx, cy, ox, oy):
    draw_og.line([(cx, cy), (cx + ox * 30, cy)], fill=(245, 226, 175), width=3)
    draw_og.line([(cx, cy), (cx, cy + oy * 30)], fill=(245, 226, 175), width=3)

draw_corner(24, 24, 1, 1)
draw_corner(W - 24, 24, -1, 1)
draw_corner(24, H - 24, 1, -1)
draw_corner(W - 24, H - 24, -1, -1)

# -------------------------------------------------------------
# Load Andrea's Portrait for Left Section
# -------------------------------------------------------------
hero_raw_path = os.path.join(IMAGES_DIR, "andrea-labrador-hero.png")
if os.path.exists(hero_raw_path):
    andrea_src = Image.open(hero_raw_path).convert("RGBA")
    
    # Crop to square or circle centered on her face
    # andrea is (761, 1014)
    portrait_size = 460
    # Crop from top: center x, top y
    crop_box = (40, 20, 720, 700) # square crop focused on Andrea
    andrea_cropped = andrea_src.crop(crop_box).resize((portrait_size, portrait_size), Image.Resampling.LANCZOS)
    
    # Circular mask
    p_mask = Image.new("L", (portrait_size, portrait_size), 0)
    p_draw = ImageDraw.Draw(p_mask)
    p_draw.ellipse([(0, 0), (portrait_size - 1, portrait_size - 1)], fill=255)
    
    # Paste Andrea at x=70, y=85
    pos_x, pos_y = 75, 85
    og_img.paste(andrea_cropped, (pos_x, pos_y), p_mask)
    
    # Gold double ring around portrait
    draw_og.ellipse([(pos_x - 6, pos_y - 6), (pos_x + portrait_size + 6, pos_y + portrait_size + 6)], outline=(245, 226, 175), width=4)
    draw_og.ellipse([(pos_x - 14, pos_y - 14), (pos_x + portrait_size + 14, pos_y + portrait_size + 14)], outline=(190, 155, 75), width=2)

    # Floating badge over bottom of portrait
    badge_w, badge_h = 320, 42
    badge_x = pos_x + (portrait_size - badge_w) // 2
    badge_y = pos_y + portrait_size - 36
    draw_og.rounded_rectangle([(badge_x, badge_y), (badge_x + badge_w, badge_y + badge_h)], radius=21, fill=(24, 36, 30), outline=(212, 175, 55), width=2)
    
    try:
        font_badge = ImageFont.truetype("segoeui.ttf", 18)
    except Exception:
        font_badge = ImageFont.load_default()
    
    badge_str = "★ 7+ AÑOS DE EXPERIENCIA"
    bb = draw_og.textbbox((0, 0), badge_str, font=font_badge)
    bbw = bb[2] - bb[0]
    draw_og.text((badge_x + (badge_w - bbw) // 2 - bb[0], badge_y + 10), badge_str, font=font_badge, fill=(245, 226, 175))

# -------------------------------------------------------------
# Right Section: Editorial Branding & Service Highlights
# -------------------------------------------------------------
rx = 575

try:
    font_kicker = ImageFont.truetype("segoeui.ttf", 16)
    font_title = ImageFont.truetype("georgia.ttf", 52)
    font_subtitle = ImageFont.truetype("georgia.ttf", 26)
    font_desc = ImageFont.truetype("segoeui.ttf", 20)
    font_pill = ImageFont.truetype("segoeui.ttf", 15)
    font_btn = ImageFont.truetype("segoeui.ttf", 21)
except Exception:
    font_kicker = ImageFont.load_default()
    font_title = ImageFont.load_default()
    font_subtitle = ImageFont.load_default()
    font_desc = ImageFont.load_default()
    font_pill = ImageFont.load_default()
    font_btn = ImageFont.load_default()

# Kicker
kicker_text = "✦  CATÁLOGO OFICIAL & CITAS PRIVADAS  ✦"
draw_og.text((rx, 78), kicker_text, font=font_kicker, fill=(212, 175, 55))

# Main Title: ANDREA LABRADOR
draw_og.text((rx, 110), "Andrea Labrador", font=font_title, fill=(253, 245, 230))

# Subtitle
draw_og.text((rx, 180), "Manicurista Profesional • Venezuela", font=font_subtitle, fill=(225, 198, 138))

# Divider
draw_og.line([(rx, 225), (rx + 560, 225)], fill=(212, 175, 55), width=1)
draw_og.polygon([(rx + 280, 222), (rx + 284, 225), (rx + 280, 228), (rx + 276, 225)], fill=(245, 226, 175))

# Service highlight tags (3 circular thumbnails with photos)
thumbs = [
    ("base-rubber.png", "Rubber Base", "Nivelación"),
    ("polygel-extensions.png", "Polygel", "Extensiones"),
    ("pedicure-spa.jpg", "Pedicure Spa", "Bienestar")
]

thumb_y = 248
thumb_size = 78
for i, (fn, name, sub) in enumerate(thumbs):
    tx = rx + i * 190
    tpath = os.path.join(IMAGES_DIR, fn)
    if os.path.exists(tpath):
        timg = Image.open(tpath).convert("RGBA").resize((thumb_size, thumb_size), Image.Resampling.LANCZOS)
        tmask = Image.new("L", (thumb_size, thumb_size), 0)
        tdraw = ImageDraw.Draw(tmask)
        tdraw.ellipse([(0, 0), (thumb_size - 1, thumb_size - 1)], fill=255)
        
        og_img.paste(timg, (tx, thumb_y), tmask)
        draw_og.ellipse([(tx - 2, thumb_y - 2), (tx + thumb_size + 2, thumb_y + thumb_size + 2)], outline=(212, 175, 55), width=2)
    
    # Text next to thumbnail
    draw_og.text((tx + thumb_size + 12, thumb_y + 14), name, font=font_desc, fill=(255, 255, 255))
    draw_og.text((tx + thumb_size + 12, thumb_y + 40), sub, font=font_pill, fill=(200, 175, 120))

# Tagline
tagline = "✨ Rubber Base • Polygel • Jelly Tips • Semipermanente • Spa"
draw_og.text((rx, 355), tagline, font=font_desc, fill=(235, 240, 235))

# Bottom WhatsApp CTA Box
cta_w, cta_h = 560, 84
cta_x, cta_y = rx, 410
draw_og.rounded_rectangle([(cta_x, cta_y), (cta_x + cta_w, cta_y + cta_h)], radius=18, fill=(20, 32, 26), outline=(37, 211, 102), width=2)

# WhatsApp Icon Circle
w_icon_size = 46
w_icon_x = cta_x + 20
w_icon_y = cta_y + (cta_h - w_icon_size) // 2
draw_og.ellipse([(w_icon_x, w_icon_y), (w_icon_x + w_icon_size, w_icon_y + w_icon_size)], fill=(37, 211, 102))

# Inner phone / chat shape
draw_og.ellipse([(w_icon_x + 10, w_icon_y + 10), (w_icon_x + w_icon_size - 10, w_icon_y + w_icon_size - 10)], fill=(255, 255, 255))
draw_og.ellipse([(w_icon_x + 14, w_icon_y + 14), (w_icon_x + w_icon_size - 14, w_icon_y + w_icon_size - 14)], fill=(37, 211, 102))

# WhatsApp CTA text
draw_og.text((w_icon_x + w_icon_size + 18, cta_y + 14), "Agenda tu Cita Directa por WhatsApp", font=font_btn, fill=(255, 255, 255))
draw_og.text((w_icon_x + w_icon_size + 18, cta_y + 44), "+58 424-1360937  •  Reserva Confirmada al Instante", font=font_pill, fill=(180, 220, 190))

# Bottom subtle footer note
draw_og.text((rx, 515), "andrea-labrador-nails-app.vercel.app  •  Caracas & Valencia, Venezuela", font=font_pill, fill=(150, 175, 160))

# Save 1200x630 JPEG with optimization
og_landscape_path = os.path.join(IMAGES_DIR, "og-share-andrea-labrador.jpg")
og_img.save(og_landscape_path, "JPEG", quality=85, optimize=True)
size_kb = os.path.getsize(og_landscape_path) / 1024
print(f"Generated: {og_landscape_path} ({size_kb:.1f} KB) - STRICTLY < 300 KB limit for WhatsApp!")

# -------------------------------------------------------------
# 4. GENERATE SQUARE 1:1 WHATSAPP PREVIEW (600 x 600)
# Some WhatsApp/Android clients use a 1:1 ratio thumbnail
# -------------------------------------------------------------
sq_size = 600
sq_img = Image.new("RGB", (sq_size, sq_size), (30, 44, 37))
draw_sq = ImageDraw.Draw(sq_img)

# Gradient
for y in range(sq_size):
    ratio = y / sq_size
    r = int(36 * (1 - ratio * 0.7) + 20 * (ratio * 0.7))
    g = int(54 * (1 - ratio * 0.7) + 30 * (ratio * 0.7))
    b = int(46 * (1 - ratio * 0.7) + 24 * (ratio * 0.7))
    draw_sq.line([(0, y), (sq_size, y)], fill=(r, g, b))

# Dual gold border
draw_sq.rounded_rectangle([(16, 16), (sq_size - 16, sq_size - 16)], radius=28, outline=(212, 175, 55), width=2)
draw_sq.rounded_rectangle([(24, 24), (sq_size - 24, sq_size - 24)], radius=22, outline=(170, 140, 50), width=1)

# Center Andrea's portrait in square
if os.path.exists(hero_raw_path):
    p_sq_size = 280
    crop_box = (60, 20, 700, 660)
    andrea_sq = andrea_src.crop(crop_box).resize((p_sq_size, p_sq_size), Image.Resampling.LANCZOS)
    mask_sq = Image.new("L", (p_sq_size, p_sq_size), 0)
    ImageDraw.Draw(mask_sq).ellipse([(0, 0), (p_sq_size - 1, p_sq_size - 1)], fill=255)
    
    sq_x = (sq_size - p_sq_size) // 2
    sq_y = 65
    sq_img.paste(andrea_sq, (sq_x, sq_y), mask_sq)
    draw_sq.ellipse([(sq_x - 5, sq_y - 5), (sq_x + p_sq_size + 5, sq_y + p_sq_size + 5)], outline=(245, 226, 175), width=3)
    draw_sq.ellipse([(sq_x - 10, sq_y - 10), (sq_x + p_sq_size + 10, sq_y + p_sq_size + 10)], outline=(190, 155, 75), width=1)

# Text below
try:
    font_sq_title = ImageFont.truetype("georgia.ttf", 36)
    font_sq_sub = ImageFont.truetype("segoeui.ttf", 18)
    font_sq_btn = ImageFont.truetype("segoeui.ttf", 16)
except Exception:
    font_sq_title = ImageFont.load_default()
    font_sq_sub = ImageFont.load_default()
    font_sq_btn = ImageFont.load_default()

# Title
sq_name = "Andrea Labrador"
nb = draw_sq.textbbox((0, 0), sq_name, font=font_sq_title)
draw_sq.text(((sq_size - (nb[2] - nb[0])) // 2 - nb[0], 370), sq_name, font=font_sq_title, fill=(253, 245, 230))

# Sub
sq_role = "Manicurista Profesional • Venezuela"
rb = draw_sq.textbbox((0, 0), sq_role, font=font_sq_sub)
draw_sq.text(((sq_size - (rb[2] - rb[0])) // 2 - rb[0], 420), sq_role, font=font_sq_sub, fill=(225, 198, 138))

# Pill
tag_pill = "Catálogo Oficial • Citas por WhatsApp"
tb = draw_sq.textbbox((0, 0), tag_pill, font=font_sq_btn)
pw = tb[2] - tb[0] + 40
px = (sq_size - pw) // 2
draw_sq.rounded_rectangle([(px, 465), (px + pw, 505)], radius=20, fill=(20, 32, 26), outline=(37, 211, 102), width=2)
draw_sq.text((px + 20 - tb[0], 475), tag_pill, font=font_sq_btn, fill=(255, 255, 255))

# WhatsApp number
sq_wa = "+58 424-1360937"
wb = draw_sq.textbbox((0, 0), sq_wa, font=font_sq_sub)
draw_sq.text(((sq_size - (wb[2] - wb[0])) // 2 - wb[0], 525), sq_wa, font=font_sq_sub, fill=(180, 225, 195))

sq_path = os.path.join(IMAGES_DIR, "og-share-square.jpg")
sq_img.save(sq_path, "JPEG", quality=85, optimize=True)
sq_kb = os.path.getsize(sq_path) / 1024
print(f"Generated: {sq_path} ({sq_kb:.1f} KB) - Square WhatsApp preview ready!")

print("All assets generated successfully!")
