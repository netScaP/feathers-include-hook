## feathers-include-hook

Hooks for include before
```
context => {
  const sequelize = context.app.get('sequelizeClient');
  const { myModel, anotherModel, singleModel } = sequelize.models;
  
  const raw = false;

  context.params.sequelize = {
    include: [
      {
        model: myModel,
        as: 'MyModels',
        where: {
          smth: 'likeSmth'
        },
        include: [anotherModel]
      },
      singleModel
    ]
  }
  return context;
}
```

And now:

First of all install the package
```
npm i --save feathers-include-hook
```

And then
```
const include = require('feathers-include-hook');

module.exports = {
  before: {
    find: [
      include([
        {
          model: 'myModel',
          as: 'MyModels',
          where: {
            smth: 'likeSmth'
          },
          include: [
            {
              model: 'anotherModel'
            }
          ]
        },
        'signleModel'
      ])
    ]
  }
};
```

You can use just a string instead of imported model