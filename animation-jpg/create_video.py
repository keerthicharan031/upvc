import cv2
import os
import glob

def create_video():
    image_folder = '.'
    video_name = '../public/animation.mp4'

    images = [img for img in glob.glob("ezgif-frame-*.jpg")]
    images.sort()

    if not images:
        print("No images found.")
        return

    frame = cv2.imread(os.path.join(image_folder, images[0]))
    height, width, layers = frame.shape

    # Use mp4v codec for mp4
    fourcc = cv2.VideoWriter_fourcc(*'mp4v')
    video = cv2.VideoWriter(video_name, fourcc, 10, (width, height))

    for image in images:
        video.write(cv2.imread(os.path.join(image_folder, image)))

    cv2.destroyAllWindows()
    video.release()
    print("Video created successfully at", video_name)

if __name__ == '__main__':
    create_video()
