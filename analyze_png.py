
import base64
import sys

# The base64 string from the user's debug file
b64_data = "iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAYAAAByDd+UAAAA70lEQVR4AeyUMQqFMBBEM18rCw9m5S28g/ZeQa8hXkwLOyH/K2RQ/hpMCGIRMDjsZuaxW+SjlNJPng344z33RWDwXb97pfM8K631fnxHt05YVdUebiB5nvty6BOBBtD3PS+GEiIwVLiUIwKHYeBdAAqAquuatXEcqV2FCCzLcocAYF7XddRFUVC7ChEohUzTxHKSJNSu4jbQNfjqfgRebca7/r6VLsvC5+04lnmNzP/Ys+nThMZ8/GdZZvM79whM09TZ7GMgcF1X0d80DV8dAJdaNAtFArce8B/Ytu3WCnZOwGCplqAItCzHr/X4Sr8AAAD///L4/RcAAAAGSURBVAMAl3VtHXeaYfsAAAAASUVORK5CYII="

# Decode to bytes
try:
    img_data = base64.b64decode(b64_data)
    print(f"Decoded {len(img_data)} bytes")
    
    # Check PNG signature
    if img_data[:8] != b'\x89PNG\r\n\x1a\n':
        print("Not a valid PNG header")
        sys.exit(1)
        
    # We can't easily parse chunks without PIL/struct, but we can look for non-zero bytes if it was uncompressed?
    # PNG is compressed (IDAT). 
    # But wait, if I can just install PIL? "pip install Pillow". Unlikely I can install packages.
    # I'll rely on the standard library 'zlib' to decompress IDAT chunks.
    
    import zlib
    import struct
    
    offset = 8
    width = 0
    height = 0
    
    while offset < len(img_data):
        length = struct.unpack('>I', img_data[offset:offset+4])[0]
        chunk_type = img_data[offset+4:offset+8].decode('ascii')
        chunk_data = img_data[offset+8:offset+8+length]
        
        if chunk_type == 'IHDR':
            width, height, bit_depth, color_type, _, _, _ = struct.unpack('>IIBBBBB', chunk_data)
            print(f"IHDR: {width}x{height}, depth={bit_depth}, color_type={color_type}")
            # Color types: 0=gray, 2=RGB, 3=PLTE, 4=Gray+Alpha, 6=RGBA
            
        if chunk_type == 'IDAT':
            try:
                # This might be just one chunk of many, but usually small PNGs have one IDAT
                decompressed = zlib.decompress(chunk_data)
                print(f"Decompressed IDAT length: {len(decompressed)}")
                # Scan through bytes to see if there's any variation
                # For 28x28 RGBA (color_type 6), we expect 28 * (1 + 28*4) bytes?
                # Scanlines have filter byte.
                
                # Just print some statistics
                non_zeros = sum(1 for b in decompressed if b > 0)
                print(f"Non-zero bytes in decompressed data: {non_zeros} / {len(decompressed)}")
                
                # Check for white pixels (255, 255, 255, 255) vs black (0, 0, 0, 255)
                # If everything is mostly 0, it's black.
                
            except Exception as e:
                print(f"Error decompressing IDAT: {e}")
                
        offset += 12 + length
        
except Exception as e:
    print(f"Error: {e}")

