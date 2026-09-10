"""Encode the supplied poster with a subtle looping product light sweep."""
import math
import sys
from pathlib import Path

from PIL import Image, ImageChops, ImageDraw, ImageFilter

source = Image.open(sys.argv[1]).convert("RGB")
output = Path(__file__).resolve().parents[1] / "src" / "photo"
source.thumbnail((640, 1140), Image.Resampling.LANCZOS)
source.save(output / "hero-adult-care.jpg", quality=88, optimize=True)
width, height = source.size
palette = source.quantize(colors=128)
frames = []
for index in range(32):
    phase = index / 32
    mask = Image.new("L", source.size)
    draw = ImageDraw.Draw(mask)
    center = int((-0.4 + 1.8 * phase) * width)
    strength = int(24 * math.sin(math.pi * phase) ** 2)
    draw.polygon([(center - 65, int(height * .46)),
                  (center + 65, int(height * .46)),
                  (center + 210, int(height * .91)),
                  (center + 80, int(height * .91))], fill=strength)
    mask = mask.filter(ImageFilter.GaussianBlur(28))
    frame = Image.composite(Image.new("RGB", source.size, "white"), source, mask)
    frames.append(frame.quantize(palette=palette, dither=Image.Dither.NONE))
target = output / "hero-adult-care.gif"
frames[0].save(target, save_all=True, append_images=frames[1:], duration=125,
               loop=0, optimize=True, disposal=1)
with Image.open(target) as result:
    assert result.n_frames > 1
    assert result.info["loop"] == 0
    result.seek(0)
    first = result.convert("RGB")
    result.seek(result.n_frames // 2)
    assert ImageChops.difference(first, result.convert("RGB")).getbbox()
    print(f"{target}: {result.size}, {result.n_frames} frames, {target.stat().st_size:,} bytes")
