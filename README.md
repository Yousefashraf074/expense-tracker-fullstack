# Expense Tracker Full-Stack Project

A full-stack **Expense Tracker** system built with **Django REST API** for the backend and **JavaScript** for the frontend. This project allows users to record, track, and categorize their expenses, providing insights on spending habits.

---

## Project Features

- Add, delete, and categorize expenses
- View a list of expenses
- Filter expenses by category
- Asynchronous frontend-backend communication using `fetch`
- REST API implemented with Django
- Export expenses as JSON or CSV (bonus feature)

---

## Technologies Used

**Backend**  
- Python 3.10+  
- Django 6.0  
- Django REST Framework  
- SQLite (development database)  

**Frontend**  
- HTML  
- CSS  
- JavaScript (Vanilla JS, DOM manipulation, fetch API)  

---

## Project Structure

webfinal/
│
├── backend/ # Django backend
│ ├── expense_api/ # Django project
│ │ ├── settings.py
│ │ ├── urls.py
│ │ └── wsgi.py
│ ├── expenses/ # Django app
│ │ ├── models.py
│ │ ├── serializers.py
│ │ ├── urls.py
│ │ └── views.py
│ └── manage.py
│
├── frontend/ # Frontend files
│ ├── index.html
│ ├── style.css
│ └── app.js
│
├── venv/ # Python virtual environment
└── .gitignore


---
| Method | Endpoint              | Description                   |
| ------ | --------------------- | ----------------------------- |
| GET    | /api/expenses/        | Get all expenses              |
| POST   | /api/expenses/        | Add a new expense             |
| DELETE | /api/expenses/<id>/   | Delete an expense by ID       |
| GET    | /api/expenses/export/ | Export expenses (JSON or CSV) |

Group Members

-Yousef Ashraf
-Amir Mohamed 

Video Demo

[Link to demo video](Expense Tracker - Google Chrome 2025-12-24 00-47-44.mp4)

License

This project is licensed under the MIT License

This version is fully **ready to paste** into your GitHub repository as `README.md`.  

If you want, I can also **add some GitHub badges** for Python, Django, and license to make it look more professional. Do you want me to do that?
