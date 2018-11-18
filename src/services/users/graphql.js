import {oncePerServices, missingService} from '../../common/services/index'

const PREFIX = '';

export default oncePerServices(function (services) {
  
  const graphqlBuilderSchema = require('../../common/graphql/LevelBuilder.schema');
  
  const resolvers = require('./resolvers').default(services);
  
  return async function builder(args) {
    
    graphqlBuilderSchema.build_options(args);
    const { parentLevelBuilder, typeDefs, builderContext } = args;
    
    typeDefs.push(`
      type UsersQueryElement {
        ID: Int,
        Login: String,
        FIO: String,
        Email: String,
        Manager: Boolean,
        Blocked: Boolean,
        Date: String
      },

      type AuthMutationElement {
        Response: String,  
        Error: String
      }
    `);
    
    parentLevelBuilder.addQuery({
      name: 'getAllUsers',
      type: '[UsersQueryElement]',
      args: `
        Managers: Boolean,
        Blockeds: Boolean,
        FioOrLogin: String
      `,
      resolver: resolvers.getAllUsers(builderContext),
    });

    parentLevelBuilder.addMutation({
        name: 'Authenticate',
        type: '[AuthMutationElement]',
        args: `
            Login: String,
            Password: String
        `,
        resolver: resolvers.Authenticate(builderContext),
    })
    
  }
});
