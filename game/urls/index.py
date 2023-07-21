from django.urls import path,include
from game.views.index import index
urlpatterns = [
        path("",index,name="index"),
        path("menu/",include("game.urls.menu.index")),
        path("background/",include("game.urls.background.index")),
        path("settings/",include("game.urls.settings.index")),
 ]

