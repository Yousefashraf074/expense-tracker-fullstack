from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from .models import Expense
from .serializers import ExpenseSerializer


@api_view(['GET', 'POST'])
def expense_list_create(request):
    # GET: list expenses (optional filter by category)
    if request.method == 'GET':
        category = request.query_params.get('category')

        expenses = Expense.objects.all().order_by('-created_at')
        if category and category.strip():
            expenses = expenses.filter(category__iexact=category.strip())

        serializer = ExpenseSerializer(expenses, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    # POST: create expense
    if request.method == 'POST':
        serializer = ExpenseSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE'])
def expense_delete(request, id):
    try:
        expense = Expense.objects.get(id=id)
    except Expense.DoesNotExist:
        return Response({"detail": "Expense not found"}, status=status.HTTP_404_NOT_FOUND)

    expense.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)
