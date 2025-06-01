from PIL import Image, ImageDraw

def create_flower_icon():
    # Create a 16x16 transparent image
    img = Image.new('RGBA', (16, 16), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Flower colors
    petal_color = (255, 182, 193)  # Light pink
    center_color = (255, 215, 0)   # Golden yellow
    
    # Draw petals
    petals = [
        (8, 4), # Top
        (12, 8), # Right
        (8, 12), # Bottom
        (4, 8), # Left
        (10, 6), # Top right
        (10, 10), # Bottom right
        (6, 10), # Bottom left
        (6, 6)  # Top left
    ]
    
    for x, y in petals:
        draw.ellipse([(x-2, y-2), (x+2, y+2)], fill=petal_color)
    
    # Draw center
    draw.ellipse([(7, 7), (9, 9)], fill=center_color)
    
    # Scale up the image to 32x32 with nearest neighbor scaling for sharp pixels
    img_scaled = img.resize((32, 32), Image.NEAREST)
    img_scaled.save('images/flower_icon.png')

if __name__ == '__main__':
    create_flower_icon() 