
import random
import zlib
import struct
import base64

def create_random_png():
    width = 28
    height = 28
    
    # Header
    png_sig = b'\x89PNG\r\n\x1a\n'
    
    # IHDR
    # Width, Height, BitDepth(8), ColorType(2=Truecolor), Comp(0), Filter(0), Interlace(0)
    ihdr_data = struct.pack('>IIBBBBB', width, height, 8, 2, 0, 0, 0)
    ihdr_crc = zlib.crc32(b'IHDR' + ihdr_data)
    ihdr_chunk = struct.pack('>I', len(ihdr_data)) + b'IHDR' + ihdr_data + struct.pack('>I', ihdr_crc)
    
    # IDAT
    # Random RGB data (no alpha)
    # Scanlines: 1 filter byte + 28*3 bytes
    raw_data = bytearray()
    for y in range(height):
        raw_data.append(0) # Filter type 0 (None)
        for x in range(width):
            raw_data.append(random.randint(0, 255)) # R
            raw_data.append(random.randint(0, 255)) # G
            raw_data.append(random.randint(0, 255)) # B
            
    compressed = zlib.compress(raw_data)
    idat_crc = zlib.crc32(b'IDAT' + compressed)
    idat_chunk = struct.pack('>I', len(compressed)) + b'IDAT' + compressed + struct.pack('>I', idat_crc)
    
    # IEND
    iend_crc = zlib.crc32(b'IEND')
    iend_chunk = struct.pack('>I', 0) + b'IEND' + struct.pack('>I', iend_crc)
    
    return png_sig + ihdr_chunk + idat_chunk + iend_chunk

png_data = create_random_png()
b64_str = base64.b64encode(png_data).decode('ascii')
print(f"data:image/png;base64,{b64_str}")
