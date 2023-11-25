from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_admin import Admin
from flask_admin.contrib.sqla import ModelView
from models import db, Order, OrderItem  # Импортируем модели

app = Flask(__name__)
CORS(app)  # Разрешаем CORS для всех маршрутов

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///test.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)

# Миграции базы данных можно добавить здесь, если это необходимо

# Админ-панель
admin = Admin(app, name='Административная панель', template_mode='bootstrap3')
admin.add_view(ModelView(Order, db.session))
admin.add_view(ModelView(OrderItem, db.session))  # Добавляем представление для OrderItem

@app.route('/', methods=['GET', 'POST'])
def hello():
    if request.method == 'POST':
        data = request.json  # Получаем данные POST-запроса в формате JSON
        print(data)  # Выводим данные в терминал (можно удалить после отладки)

        # Пример создания заказа и элемента заказа в базе данных
        order = Order(status='Received')
        db.session.add(order)
        
        for item_data in data.get('items', []):
            item = OrderItem(name=item_data.get('name'), quantity=item_data.get('quantity'), order=order)
            db.session.add(item)

        db.session.commit()

        return jsonify({'message': 'Заказ успешно получен!'}), 200  # Отвечаем на запрос
    else:
        return 'Hello, World!'

if __name__ == '__main__':
    app.run(debug=True)