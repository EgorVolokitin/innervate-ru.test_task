# Тестовое задание #
Проект представляет из себя небольшой кусок серверной части, взятый из реальной системы.
Задачи, которые необходимо сделать для успешной реализации тестового задания:
1) Добавить обработчик graphql запроса (query) для получения списка пользователей из локальной базы данных. Информация, которая должна получаться по каждому пользователю:
- Идентификатор пользователя в системе;
- Логин;
- ФИО;
- Email;
- Признак "Менеджер";
- Признак "Заблокирован";
- Дата рождения.
2) Расширить обработчик, добавив в него возможность фильтрации следующим образом:
- Получить всех менеджеров системы;
- Получить заблокированных пользователей;
- Поиск пользователя по подстроке ФИО и логина.
Параметры для фильтрации должны передаваться в качестве переменных запроса.
3) Добавить обработчик graphql мутации (mutation) для авторизации пользователей - на вход мутация должна получать логин и пароль пользователя, в качестве результата - возвращать признак успешной авторизации или ошибку

## Используемые технологии и ссылки для помощи
Запуск серверной части происходит с помощью команды
```sh
$ npm run server
```
Перед запуском необходимо установить [git-сабмодули](https://git-scm.com/docs/git-submodule), используемые на данном проекте, а также внешние пакеты и зависимости с помощью npm.

Для работы с [GraphQL](https://github.com/facebook/graphql/blob/master/README.md) и PostgreSQL используется библиотека https://github.com/innervate-ru/common.
Пример реализации обработчика graphql запроса доступен в сервисе test.
Проверить его работоспособность можно с помощью GraphiQL интерфейса, который будет доступен по адресу  http://localhost:3000/graphql/v2 после запуска проекта.

Код запроса, который можно использовать для получения данных от тестового сервиса:
```
query A {
  test {
    testQuery {
      str
      int
      obj {
        a
        b
      }
    }
  }
}
```

Используемая СУБД - [PostgreSQL](https://postgrespro.ru/docs/postgresql/9.6/) (для запуска локального сервера на windows можно использовать https://postgrespro.ru/windows).
Параметры подключения к PostgreSQL расположены в [конфигурационном файле](https://github.com/shestpa/test_task/blob/master/config/default.json).
Пользователи, данные которых необходимо получить в рамках решения тестовых задач, хранятся в таблице users, дамп базы данных находится в директории [/db/](https://github.com/shestpa/test_task/tree/master/db) проекта.
Примеры пар "логин - пароль" для пользователей в базе данных:
- admin : 12345
- manager : 54321
- user : qverty
- user_2 : qwerty2
