const errors = require('feathers-errors');

// eslint-disable-next-line no-unused-vars
module.exports = function (options = [ ]) {
  return async context => {
    const sequelize = context.app.get('sequelizeClient');
    const { models } = sequelize;
    
    const raw = false;

    context.params.sequelize = context.params.sequelize || {};

    const include = loopIncludes(options, models);

    Object.assign(context.params.sequelize, { include, raw });

    return context;
  };
};

function loopIncludes(modelsArr, models) {
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

    return {
      ...obj,
      model: models[obj.model]
    }
  });

  return include;
}