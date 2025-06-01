from PIL import Image, ImageDraw

def create_background():
    # Create a larger image for the background (256x160 for 16:10 ratio)
    img = Image.new('RGBA', (256, 160), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Sky gradient (Ghibli-style soft sunset)
    for y in range(80):
        # Create a gradient from warm peach to soft blue
        if y < 35:
            r = int(255 - (y * 1.5))
            g = int(200 - (y * 1.2))
            b = int(170 + (y * 1.5))
        else:
            r = int(200 - (y * 1.2))
            g = int(160 - (y * 0.8))
            b = int(220 + (y * 0.5))
        draw.line([(0, y), (255, y)], fill=(r, g, b))

    # Rolling hills (Ghibli-style layered)
    # Back hills
    for i, x in enumerate(range(-50, 300, 100)):
        y_offset = i * 5
        draw.polygon([(x, 60+y_offset), (x+120, 50+y_offset), (x+200, 65+y_offset), 
                     (x+250, 55+y_offset), (x+250, 90), (x, 90)], 
                    fill=(130-i*10, 158-i*10, 98-i*10))

    # Ground base (medieval meadow)
    draw.rectangle([(0, 80), (256, 160)], fill=(144, 169, 85))
    
    # Stone path
    path_color = (180, 175, 170)
    path_dark = (160, 155, 150)
    for y in range(90, 160, 8):
        offset = (y % 16) * 2
        for x in range(-20+offset, 276, 16):
            draw.rectangle([(x, y), (x+12, y+6)], fill=path_color)
            draw.line([(x, y), (x+12, y)], fill=path_dark)
    
    # Medieval gardens and fields
    for x in range(0, 256, 32):
        for y in range(90, 160, 16):
            if (x + y) % 32 == 0:
                # Herb garden
                draw.rectangle([(x, y), (x+30, y+14)], fill=(130, 150, 80))
                # Herb details
                for hx in range(x+2, x+29, 4):
                    for hy in range(y+2, y+12, 4):
                        draw.line([(hx, hy), (hx, hy+2)], fill=(100, 130, 60))
                        draw.point((hx, hy+3), fill=(180, 200, 100))
            else:
                # Flower garden
                draw.rectangle([(x, y), (x+30, y+14)], fill=(156, 182, 91))
                # Ghibli-style flowers
                colors = [(255, 200, 200), (255, 240, 200), (200, 220, 255), (255, 255, 220)]
                for fx in range(x+4, x+28, 6):
                    for fy in range(y+3, y+12, 6):
                        # Flower base
                        draw.point((fx, fy), fill=colors[(fx + fy) % len(colors)])
                        # Petals
                        draw.point((fx-1, fy), fill=colors[(fx + fy) % len(colors)])
                        draw.point((fx+1, fy), fill=colors[(fx + fy) % len(colors)])
                        draw.point((fx, fy-1), fill=colors[(fx + fy) % len(colors)])
                        draw.point((fx, fy+1), fill=colors[(fx + fy) % len(colors)])

    # Trees (Ghibli-style)
    for x in range(20, 236, 60):
        # Tree trunk
        draw.rectangle([(x+8, 65), (x+12, 85)], fill=(101, 67, 33))
        # Tree foliage - multiple layers for depth
        colors = [(80, 120, 50), (90, 130, 60), (100, 140, 70), (110, 150, 80)]
        for i, color in enumerate(colors):
            offset = i * 2
            draw.ellipse([(x-5+offset, 55+offset), (x+25-offset, 75+offset)], fill=color)

    # Clouds (Ghibli-style soft clouds)
    clouds = [(30, 15), (100, 25), (180, 20), (220, 30)]
    for x, y in clouds:
        cloud_color = (255, 255, 255, 180)
        draw.ellipse([(x, y), (x+40, y+15)], fill=cloud_color)
        draw.ellipse([(x+15, y-5), (x+45, y+10)], fill=cloud_color)
        draw.ellipse([(x+30, y), (x+60, y+15)], fill=cloud_color)

    # Birds
    birds = [(45, 25), (160, 35), (200, 40)]
    for x, y in birds:
        draw.line([(x, y), (x+3, y-2)], fill=(80, 80, 80))
        draw.line([(x+3, y-2), (x+6, y)], fill=(80, 80, 80))

    return img

def save_background():
    img = create_background()
    # Scale up the image to 1024x640 with nearest neighbor scaling for sharp pixels
    img_scaled = img.resize((1024, 640), Image.NEAREST)
    img_scaled.save('images/background.png')

if __name__ == '__main__':
    save_background() 