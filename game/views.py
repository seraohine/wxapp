from django.http import HttpResponse

def index(http):
    return HttpResponse("Hello!")

