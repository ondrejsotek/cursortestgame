from PIL import Image, ImageDraw

def create_house():
    img = Image.new('RGBA', (64, 64), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Main house structure (warm cream color)
    draw.rectangle([(16, 24), (48, 56)], fill=(245, 240, 230))
    
    # Tudor-style details (soft brown)
    draw.line([(16, 35), (48, 35)], fill=(139, 115, 95), width=2)
    draw.line([(24, 24), (24, 56)], fill=(139, 115, 95), width=2)
    draw.line([(40, 24), (40, 56)], fill=(139, 115, 95), width=2)
    
    # Warm brown roof
    draw.polygon([(12, 24), (32, 8), (52, 24)], fill=(170, 140, 115))
    # Roof shading
    draw.polygon([(12, 24), (32, 12), (52, 24)], fill=(150, 120, 95))
    
    # Windows (warm glow)
    for x in [22, 38]:
        # Window frame
        draw.rectangle([(x, 28), (x+6, 34)], fill=(139, 115, 95))
        # Glass
        draw.rectangle([(x+1, 29), (x+5, 33)], fill=(255, 250, 220))
    
    # Door with arch
    draw.rectangle([(30, 42), (34, 56)], fill=(139, 115, 95))
    draw.ellipse([(29, 40), (35, 46)], fill=(139, 115, 95))
    
    # Flower boxes under windows
    for x in [21, 37]:
        draw.rectangle([(x, 35), (x+8, 37)], fill=(139, 115, 95))
        # Flowers
        colors = [(255, 200, 200), (255, 255, 200), (255, 220, 255)]
        for fx in range(x+1, x+8, 2):
            draw.point((fx, 34), fill=colors[(fx + x) % 3])
            draw.point((fx+1, 34), fill=colors[(fx + x + 1) % 3])
    
    return img

def create_farm():
    img = Image.new('RGBA', (64, 64), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Main barn structure (warm red)
    draw.rectangle([(16, 24), (48, 56)], fill=(180, 130, 120))
    
    # Wood texture (subtle)
    for y in range(28, 56, 4):
        draw.line([(16, y), (48, y)], fill=(160, 110, 100), width=1)
    
    # Roof (warm brown)
    draw.polygon([(12, 24), (32, 8), (52, 24)], fill=(170, 140, 115))
    draw.polygon([(12, 24), (32, 12), (52, 24)], fill=(150, 120, 95))
    
    # Large barn doors
    draw.rectangle([(26, 38), (38, 56)], fill=(139, 115, 95))
    # Door details
    for y in range(40, 56, 3):
        draw.line([(26, y), (38, y)], fill=(120, 100, 80))
    
    # Windows
    for x in [20, 42]:
        draw.rectangle([(x, 30), (x+4, 36)], fill=(139, 115, 95))
        draw.rectangle([(x+1, 31), (x+3, 35)], fill=(255, 250, 220))
    
    # Hay bales
    for x in [10, 50]:
        draw.rectangle([(x, 48), (x+8, 56)], fill=(230, 210, 160))
        draw.line([(x, 51), (x+8, 51)], fill=(210, 190, 140))
    
    return img

def create_mine():
    img = Image.new('RGBA', (64, 64), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Mountain base (soft gray)
    draw.polygon([(8, 56), (32, 16), (56, 56)], fill=(160, 155, 150))
    
    # Rock texture (subtle)
    for y in range(20, 56, 6):
        for x in range(12, 52, 6):
            if x + y < 90:  # Only within mountain shape
                draw.rectangle([(x, y), (x+4, y+4)], fill=(150, 145, 140))
    
    # Mine entrance
    draw.rectangle([(24, 36), (40, 56)], fill=(90, 85, 80))
    draw.ellipse([(24, 32), (40, 40)], fill=(90, 85, 80))
    
    # Wooden support frame
    draw.rectangle([(22, 34), (26, 56)], fill=(139, 115, 95))
    draw.rectangle([(38, 34), (42, 56)], fill=(139, 115, 95))
    draw.rectangle([(22, 34), (42, 38)], fill=(150, 125, 105))
    
    # Lantern
    draw.rectangle([(30, 42), (34, 46)], fill=(255, 240, 150))
    draw.line([(32, 40), (32, 42)], fill=(139, 115, 95))
    
    return img

def create_factory():
    img = Image.new('RGBA', (64, 64), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Main building (soft stone)
    draw.rectangle([(16, 24), (48, 56)], fill=(220, 215, 210))
    
    # Stone texture (subtle)
    for y in range(28, 56, 6):
        for x in range(18, 46, 6):
            draw.rectangle([(x, y), (x+4, y+4)], fill=(210, 205, 200))
    
    # Roof
    draw.polygon([(12, 24), (32, 12), (52, 24)], fill=(150, 120, 95))
    
    # Chimneys
    for x in [20, 30, 40]:
        draw.rectangle([(x, 8), (x+4, 24)], fill=(180, 175, 170))
        # Smoke (semi-transparent)
        for y in [4, 6]:
            draw.ellipse([(x-1, y), (x+5, y+4)], fill=(255, 255, 255, 100))
    
    # Windows
    for x in [22, 36]:
        draw.rectangle([(x, 32), (x+6, 40)], fill=(255, 250, 220))
        draw.line([(x, 36), (x+6, 36)], fill=(139, 115, 95))
        draw.line([(x+3, 32), (x+3, 40)], fill=(139, 115, 95))
    
    return img

def create_bank():
    img = Image.new('RGBA', (64, 64), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Main building (elegant cream)
    draw.rectangle([(12, 24), (52, 56)], fill=(240, 235, 230))
    
    # Stone texture (very subtle)
    for y in range(28, 56, 6):
        for x in range(14, 50, 6):
            draw.rectangle([(x, y), (x+4, y+4)], fill=(230, 225, 220))
    
    # Grand roof
    draw.polygon([(8, 24), (32, 8), (56, 24)], fill=(170, 140, 115))
    draw.polygon([(8, 24), (32, 12), (56, 24)], fill=(150, 120, 95))
    
    # Columns
    for x in [16, 48]:
        draw.rectangle([(x, 24), (x+4, 56)], fill=(230, 225, 220))
        # Column details
        for y in range(28, 56, 4):
            draw.line([(x, y), (x+4, y)], fill=(220, 215, 210))
    
    # Grand entrance
    draw.rectangle([(28, 36), (36, 56)], fill=(139, 115, 95))
    draw.ellipse([(28, 32), (36, 40)], fill=(139, 115, 95))
    
    # Steps
    for y in range(52, 57, 2):
        draw.rectangle([(26, y), (38, y+1)], fill=(220, 215, 210))
    
    return img

def save_images():
    buildings = {
        'house': create_house(),
        'farm': create_farm(),
        'mine': create_mine(),
        'factory': create_factory(),
        'bank': create_bank()
    }
    
    for name, img in buildings.items():
        img.save(f'images/{name}.png')

if __name__ == '__main__':
    save_images() 