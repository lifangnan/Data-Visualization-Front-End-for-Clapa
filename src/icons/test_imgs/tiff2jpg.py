# 批量tiff转jpg
# 代码中路径更改为自己图像存放路径即可
from PIL import Image
import os
 
imagesDirectory = './src/icons/test_imgs'  # tiff图片所在文件夹路径
distDirectory = "./src/icons/test_jpgs"# 要存放jpg格式的文件夹路径

for imageName in os.listdir(imagesDirectory):
    imagePath = os.path.join(imagesDirectory, imageName)
    # print(imageName[-4:], imageName[-4:] == ".jpg")
    # if(imageName[-4:] == ".jpg"):
    #     os.remove(imagePath)
    image = Image.open(imagePath)# 打开tiff图像
    distImagePath = os.path.join(distDirectory, imageName[:-4]+'jpg')# 更改图像后缀为.jpg，并保证与原图像同名
    print(imagePath)
    image.save(distImagePath)# 保存jpg图像


for imageName in os.listdir(distDirectory):
    # path = "require('@/icons/test_jpgs/" + imageName + "'),"
    path = "'"+imageName + "',"
    print(path)