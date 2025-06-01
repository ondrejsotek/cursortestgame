from PIL import Image, ImageDraw

def create_basic_tools():
    img = Image.new('RGBA', (32, 32), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Hammer
    # Handle (warm brown)
    draw.rectangle([(8, 18), (22, 21)], fill=(139, 115, 95))
    # Head (steel gray)
    draw.rectangle([(18, 14), (24, 24)], fill=(160, 160, 170))
    draw.rectangle([(16, 16), (26, 22)], fill=(180, 180, 190))
    
    # Wrench (slightly offset)
    # Handle (steel blue-gray)
    draw.rectangle([(12, 10), (16, 20)], fill=(170, 170, 180))
    # Head
    draw.ellipse([(10, 8), (18, 14)], fill=(160, 160, 170))
    
    return img

def create_advanced_machinery():
    img = Image.new('RGBA', (32, 32), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Main gear (brass color)
    draw.ellipse([(8, 8), (24, 24)], fill=(200, 180, 140))
    draw.ellipse([(11, 11), (21, 21)], fill=(180, 160, 120))
    
    # Gear teeth
    for i in range(8):
        angle = i * 45
        x = 16 + 8 * (angle % 90 == 0)
        y = 16 + 8 * (angle % 90 != 0)
        draw.rectangle([(x-2, y-2), (x+2, y+2)], fill=(200, 180, 140))
    
    # Small gears
    draw.ellipse([(4, 4), (12, 12)], fill=(170, 170, 180))
    draw.ellipse([(20, 20), (28, 28)], fill=(170, 170, 180))
    
    return img

def create_automation():
    img = Image.new('RGBA', (32, 32), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Conveyor belt base
    draw.rectangle([(6, 12), (26, 24)], fill=(80, 80, 90))
    
    # Rollers
    for x in range(8, 24, 4):
        draw.rectangle([(x, 14), (x+2, 22)], fill=(160, 160, 170))
    
    # Items on belt
    draw.rectangle([(10, 8), (14, 12)], fill=(200, 180, 140))  # Box
    draw.ellipse([(18, 8), (22, 12)], fill=(180, 160, 120))   # Gear
    
    # Control panel
    draw.rectangle([(24, 6), (28, 16)], fill=(100, 100, 110))
    draw.point((26, 8), fill=(0, 255, 0))  # Green LED
    draw.point((26, 12), fill=(255, 0, 0))  # Red LED
    
    return img

def create_ai_management():
    img = Image.new('RGBA', (32, 32), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Monitor frame
    draw.rectangle([(8, 6), (24, 20)], fill=(80, 80, 90))
    draw.rectangle([(9, 7), (23, 19)], fill=(100, 200, 255))
    
    # Circuit pattern
    for y in range(9, 18, 3):
        draw.line([(10, y), (22, y)], fill=(200, 255, 255))
        for x in range(10, 22, 4):
            draw.point((x, y), fill=(255, 255, 255))
    
    # Stand
    draw.polygon([(14, 20), (18, 20), (16, 26)], fill=(80, 80, 90))
    draw.rectangle([(12, 26), (20, 28)], fill=(80, 80, 90))
    
    return img

def create_quantum():
    img = Image.new('RGBA', (32, 32), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Quantum core (glowing orb)
    draw.ellipse([(12, 12), (20, 20)], fill=(100, 200, 255))
    draw.ellipse([(13, 13), (19, 19)], fill=(150, 220, 255))
    draw.ellipse([(14, 14), (18, 18)], fill=(200, 240, 255))
    
    # Orbital rings
    for i in range(3):
        angle = i * 60
        draw.arc([(8, 8), (24, 24)], angle, angle + 30, fill=(255, 255, 255))
        draw.arc([(8, 8), (24, 24)], angle + 180, angle + 210, fill=(255, 255, 255))
    
    # Energy particles
    particles = [(10, 16), (22, 16), (16, 10), (16, 22)]
    for x, y in particles:
        draw.point((x, y), fill=(255, 255, 255))
        draw.point((x+1, y), fill=(200, 240, 255))
        draw.point((x-1, y), fill=(200, 240, 255))
    
    return img

def save_shop_icons():
    icons = {
        'basic_tools': create_basic_tools(),
        'advanced_machinery': create_advanced_machinery(),
        'automation': create_automation(),
        'ai_management': create_ai_management(),
        'quantum': create_quantum()
    }
    
    for name, img in icons.items():
        # Scale up the image to 64x64 with nearest neighbor scaling for sharp pixels
        img_scaled = img.resize((64, 64), Image.NEAREST)
        img_scaled.save(f'images/{name}.png')

if __name__ == '__main__':
    save_shop_icons() 