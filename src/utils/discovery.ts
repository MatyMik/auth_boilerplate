import { Application, Router } from 'express';
const listEndpoints = require('express-list-endpoints');

export default (app: Application | Router) => {
  const routes = listEndpoints(app).reduce(
    (routes: any, route: any) => [...routes, ...route.methods.map((method: any) => `${method} ${route.path}`)],
    []
  );

  console.log(routes.join('\n'));
};
