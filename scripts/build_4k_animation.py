import os
import glob
import shutil
import subprocess
from PIL import Image

def build_video():
    src_dir = os.path.abspath('animation-jpg')
    frames = sorted(glob.glob(os.path.join(src_dir, 'ezgif-frame-*.jpg')))
    
    if not frames:
        print(f"No frames found in {src_dir}")
        return

    total_frames = len(frames)
    print(f"Processing {total_frames} frames from {src_dir}...")

    # Output directories
    public_frames_dir = os.path.abspath('public/frames')
    nextjs_frames_dir = os.path.abspath('outlook-nextjs/public/frames')
    
    os.makedirs(public_frames_dir, exist_ok=True)
    os.makedirs(nextjs_frames_dir, exist_ok=True)

    # 1. High Quality 4K Upscale (3840x2160) & Frame Sync
    print("Upscaling frames to 4K UHD (3840x2160) with Lanczos filtering & syncing public/frames...")
    for idx, frame_path in enumerate(frames, start=1):
        num_str = f"{idx:03d}"
        target_filename = f"ezgif-frame-{num_str}.jpg"
        
        # Load and upscale image
        with Image.open(frame_path) as img:
            # Upscale to 4K (3840x2160) maintaining smooth quality
            img_4k = img.resize((3840, 2160), Image.Resampling.LANCZOS)
            
            # Save 4K frame back to animation-jpg
            img_4k.save(frame_path, quality=95, optimize=True)
            
            # Copy frame to public/frames and outlook-nextjs/public/frames
            out1 = os.path.join(public_frames_dir, target_filename)
            out2 = os.path.join(nextjs_frames_dir, target_filename)
            img_4k.save(out1, quality=95, optimize=True)
            img_4k.save(out2, quality=95, optimize=True)
            
            # Save hero-poster.jpg if frame 1
            if idx == 1:
                img_4k.save(os.path.abspath('public/hero-poster.jpg'), quality=95)
                img_4k.save(os.path.abspath('outlook-nextjs/public/hero-poster.jpg'), quality=95)
                img_4k.save(os.path.abspath('outlook-nextjs/public/hero-bg.jpg'), quality=95)
                img_4k.save(os.path.abspath('outlook-nextjs/public/hero-bg-pristine.jpg'), quality=95)

    print(f"Successfully processed {total_frames} 4K frames!")

    # 2. Render 4K High FPS Videos using FFmpeg
    try:
        import imageio_ffmpeg
        ffmpeg_exe = imageio_ffmpeg.get_ffmpeg_exe()
        print(f"Using FFmpeg binary at: {ffmpeg_exe}")
    except Exception as e:
        print(f"Could not load imageio_ffmpeg: {e}")
        ffmpeg_exe = "ffmpeg"

    input_pattern = os.path.join(src_dir, 'ezgif-frame-%03d.jpg')

    # Output video targets
    output_mp4 = os.path.abspath('animation-4k-60fps.mp4')
    output_mp4_public = os.path.abspath('public/animation-4k-60fps.mp4')
    output_mp4_nextjs = os.path.abspath('outlook-nextjs/public/animation-4k-60fps.mp4')
    
    output_webm = os.path.abspath('animation-4k-60fps.webm')
    output_webm_nextjs = os.path.abspath('outlook-nextjs/public/animation-4k-60fps.webm')

    # 60 FPS 4K H.264 MP4 rendering command
    # Uses minterpolate filter or smooth framerate interpolation to achieve 60fps high smoothness
    cmd_mp4 = [
        ffmpeg_exe,
        '-y',
        '-framerate', '30',
        '-i', input_pattern,
        '-vf', 'minterpolate=fps=60:mi_mode=mci:mc_mode=aobmc:me_mode=bidir:vsbmc=1,scale=3840:2160',
        '-c:v', 'libx264',
        '-crf', '17',
        '-preset', 'slow',
        '-pix_fmt', 'yuv420p',
        output_mp4
    ]

    print("Rendering 4K 60FPS Ultra-Smooth MP4 Video...")
    res = subprocess.run(cmd_mp4, capture_output=True, text=True)
    if res.returncode != 0:
        print("Minterpolate failed, falling back to standard 60FPS interpolation...")
        cmd_mp4_fallback = [
            ffmpeg_exe,
            '-y',
            '-framerate', '30',
            '-i', input_pattern,
            '-vf', 'fps=60,scale=3840:2160',
            '-c:v', 'libx264',
            '-crf', '17',
            '-preset', 'slow',
            '-pix_fmt', 'yuv420p',
            output_mp4
        ]
        res_fb = subprocess.run(cmd_mp4_fallback, capture_output=True, text=True)
        if res_fb.returncode != 0:
            print("FFmpeg MP4 Error:", res_fb.stderr)
        else:
            print("Fallback MP4 render successful!")
    else:
        print("High FPS 4K MP4 render successful!")

    # Copy MP4 to public folders
    if os.path.exists(output_mp4):
        shutil.copyfile(output_mp4, output_mp4_public)
        shutil.copyfile(output_mp4, output_mp4_nextjs)
        print(f"Copied {output_mp4} to public folders.")

    # Render 60 FPS 4K WebM Video
    cmd_webm = [
        ffmpeg_exe,
        '-y',
        '-framerate', '30',
        '-i', input_pattern,
        '-vf', 'fps=60,scale=3840:2160',
        '-c:v', 'libvp9',
        '-crf', '24',
        '-b:v', '0',
        '-pix_fmt', 'yuv420p',
        output_webm
    ]
    print("Rendering 4K 60FPS WebM Video...")
    res_webm = subprocess.run(cmd_webm, capture_output=True, text=True)
    if res_webm.returncode == 0:
        if os.path.exists(output_webm):
            shutil.copyfile(output_webm, output_webm_nextjs)
            print(f"Copied {output_webm} to public folder.")

if __name__ == '__main__':
    build_video()
