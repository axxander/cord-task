import { readFileSync } from 'fs';
import { resolve } from 'path';

import bodyParser from 'body-parser';

import { validateQuery, validateBody, isEmpty } from '../utils/typing.util';
import { BadRequestError } from '../errors';

// Assume schema is valid, i.e. no errors thrown
const rules = JSON.parse(readFileSync(resolve(__dirname, './rules.json')));

export default function (app) {
  app.set('port', process.env.PORT || 3000);
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
}

/**
 * TBD: middleware that checks the request body and querystring against the
 * existing json configuration in order to ensure that:
 * all required parameters are present
 * all parameters are of the correct type
 * non-existing parameters are blocked
 *
 * @throws throw a 400 code error with a relevant error message
 *
 * @param {object} req request object generated by express
 * @param {object} res response object generated by express
 * @param {function} next middleware function
 */
export const checkAgainstRules = (req, res, next) => {
  const requestMethod = req.method.toLowerCase();
  const requestPath = req.baseUrl.concat(req.path);
  const path = rules.paths[requestPath];

  // Path and method within rules
  if (path && path[requestMethod]) {
    const requestBody = req.body || {};
    const requestQuery = req.query || {};

    // Get all rules for given path and method
    const validParamsRules = path[requestMethod].parameters || [];

    // Get only query parameter rules
    const validQueryParamsRules = validParamsRules.reduce((acc, p) => (p.in === 'query' ? acc.concat(p) : acc), []);
    const validQueryParamsNames = validQueryParamsRules.map((p) => p.name);

    // Validate query parameters
    /* eslint-disable-next-line */
    for (const [param, value] of Object.entries(requestQuery)) {
      // Check param is not extraneous
      if (!validQueryParamsNames.includes(param)) {
        return next(new BadRequestError(`\`${param}\` is not a valid query parameter`));
      }

      // Validate non-extraneous param
      const schema = validQueryParamsRules.find((p) => p.name === param);
      if (!validateQuery(schema, value)) {
        return next(new BadRequestError(`query parameter \`${param}\` has an invalid type`));
      }
    }

    // Get only body rules: assume single rule for route/method
    const bodySchemaExists = validParamsRules.find((p) => p.in === 'body');
    const bodySchema = bodySchemaExists ? bodySchemaExists.schema : {};

    // No rules for request body if schema is empty
    if (isEmpty(bodySchema)) {
      return isEmpty(requestBody)
        ? next()
        : next(new BadRequestError('no request body permitted'));
    }

    // Validate request body
    if (!validateBody(bodySchema, requestBody)) {
      return next(new BadRequestError('request body is invalid'));
    }
  }

  // default for all other path/method combinations
  return next();
};
