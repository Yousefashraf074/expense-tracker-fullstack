from django.urls import path
from .views import expense_list_create, expense_delete

urlpatterns = [
    path('expenses/', expense_list_create, name='expense_list_create'),
    path('expenses/<int:id>/', expense_delete, name='expense_delete'),
]
