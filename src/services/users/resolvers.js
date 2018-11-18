import moment from 'moment';
import crypto from 'crypto';
import {oncePerServices, missingService} from '../../common/services/index';


function apolloToRelayResolverAdapter(oldResolver) {
  return function (obj, args, context) {
    return oldResolver(args, context.request);
  }
}

export default oncePerServices(function (services) {
    
    const {
        postgres = missingService('postgres')
    } = services;
  
  function getAllUsers(builderContext) {

    return async function(obj, args, req) {
        // Массив с ответом. В него и будем пушить пользователей
        const response = [];
        // Создаем множество чтобы избавиться от дубликатов пользователей
        const allUsers = new Set();
        const { Managers, Blockeds, FioOrLogin } = args;

        let query = 'SELECT * FROM users';        
        
        if(Managers) {
            let users = await postgres.exec({ statement: query + ' WHERE manager = $1', params: [Managers] });
            users.rows.forEach(user => {
                allUsers.add(user)
            })
        }

        if(Blockeds) {
            let users = await postgres.exec({ statement: query + ' WHERE blocked = $1', params: [Blockeds] });
            users.rows.forEach(user => {
                allUsers.add(user)
            })
        }

        if(FioOrLogin) {
            let users = await postgres.exec({ statement: query + ' WHERE name = $1 OR login = $1', params: [FioOrLogin] });
            users.rows.forEach(user => {
                allUsers.add(user)
            })
        }

        if(!Managers && !Blockeds && !FioOrLogin) {
            let users = await postgres.exec({ statement: query, params: [] });
            users.rows.forEach(user => {
                allUsers.add(user)
            })
        }

        const usersList = Array.from(allUsers);

        usersList.forEach(user => {
            const userData = {
                ID: user.user_id,
                Login: user.login,
                FIO: user.name,
                Email: user.email,
                Manager: user.manager ? true : false, // У некоторых пользователей это значение === null
                Blocked: user.blocked ? true : false, // У некоторых пользователей это значение === null
                Date: user.data && Object.keys(user.data).length ?
                    new Date(user.data.birthday).toDateString().toString()
                        : '—' // Если ничего нет в бд - возвращаем прочерк
            }

            response.push(userData);
        });

      return response;
    }
  }

  function Authenticate(builderContext) {

    return async function(obj, args, req) {
        const { Login, Password } = args;

        if(!Login || !Password) {
            return [{
                Response: 'ERROR',
                Error: 'Не введен логин или пароль'
            }];
        }

        const pwdHash = await crypto.createHash('md5').update(Password).digest('hex');

        const user = await postgres.exec({ statement: 'SELECT user_id FROM users WHERE login = $1 AND password_hash = $2', params: [Login, pwdHash] });

        if(!user.rows[0]) {
            return [{
                Response: 'ERROR',
                Error: 'Не верный логин или пароль'
            }];
        }

        return [{
            Response: 'Authentication successs'
        }];

    }
  }

  return {
    getAllUsers,
    Authenticate
  }
});
