# wxapp















#改时区
先进入统领文件wxapp，打开settings.py找到TIME_ZONE把UTC改成Asia/Shanghai,再次访问网页显示的就是中国的时区了
#数据库配置
在wxapp目录下的settings.py文件中，找到INSTALLED_APPS，在里面添加game目录下apps.py文件的GameConfig函数，‘game.apps.GameConfig'
#静态路径配置,一般存开发者文件
在wxapp目录下的settings.py中，开头先import os，然后在最后一行找到，STATIC_URL字段，再添加一行代码，STATIC_ROOT = os.path.join(BASE_DIR,'static')
#MEDIA配置，一般村存用户文件
在STATIC_URL的下面添加一行代码，MEDIA_ROOT = os.path.join(BASE_DIR,'media')
