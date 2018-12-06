const errors = require('feathers-errors');

// eslint-disable-next-line no-unused-vars
module.exports = function (options = [ ]) {
  return async context => {
    const sequelize = context.app.get('sequelizeClient');
    const { models } = sequelize;
    
    const raw = false;

    context.params.sequelize = context.params.sequelize || {};

    const include = loopIncludes(options, models, context);

    Object.assign(context.params.sequelize, { include, raw });

    return context;
  };
};

function loopIncludes(modelsArr, models, context) {
  const include = modelsArr.map(obj => {
    if (typeof obj === 'string') {
      return models[obj];
    }
    if (obj.include) {
      obj.include = loopIncludes(obj.include, models);
    }
    if (!obj.model) {
      throw new errors.BadRequest('Model must be included');
    }
    if (obj.context) {
      obj.context = loopContext(obj.context, context);
    }

    return {
      ...obj,
      model: models[obj.model]
    }
  });

  return include;
}

function loopContext(object, context) {
  for (let key in object) {
    if (key === 'context') {
      loopContext(object[key], context);
    }
    if (object[key].charAt(0) === '$') {
      object[key] = set(object[key].slice(1), context);
    }
  }
}

function set(path, obj) {
  path = path.split('.');
  for (let i = 1; i < path.length - 1; i++) {
    obj = obj[path[i]];
  }
  return obj;
}