from django.shortcuts import render
from django.http import HttpResponse

def main(request):
    return HttpResponse('<h2>hello</h2>')
