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
      obj.include = loopIncludes(obj.include, models, context);
    }
    if (!obj.model) {
      throw new errors.BadRequest('Model must be included');
    }
    if (typeof obj.model === 'string') {
      obj.model = models[obj.model];
    }
    if (obj.context) {
      obj = Object.assign({}, obj, loopContext(obj.context, context));
      delete obj.context;
    }

    return obj;
  });

  return include;
}

function loopContext(object, context) {
  for (let key in object) {
    if (key === 'context') {
      object = Object.assing({}, object, loopContext(object[key], context));
      delete obj.context;
      continue;
    }
    if (typeof object[key] === 'object') {
      object[key] = loopContext(object[key], context);
      continue;
    }
    if (object[key].charAt(0) === '$') {
      object[key] = getByPath(object[key].slice(1), context);
    }
  }
  return object;
}

function getByPath(path, obj) {
  path = path.split('.');
  for (let i = 0; i < path.length; i++) {
    obj = obj[path[i]];
  }
  return obj;
}