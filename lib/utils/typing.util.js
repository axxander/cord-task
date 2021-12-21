/**
 * 
 * @param {object} object object to check if empty
 * @returns {boolean} whether given object contains zero keys
 */
export const isEmpty = (object) => {
    return Object.keys(object).length === 0;
}

/**
 * 
 * @param {string} type string containing type, e.g. 'integer'
 * @param {any} value variable to assess type of
 * @returns 
 */
const validatePrimitive = (type, value) => {
    if (type === 'string') {
        return typeof value === 'string'
    } else if (type === 'integer') {
        return Number.isInteger(parseInt(value, 10))
    } else {
        return false
    }
};

/**
 * 
 * @param {string[]} props properties we want to check exist on an object
 * @param {object} value the object we want to check the properties of
 * @returns {boolean} properties contained within object
 */
export const hasProps = (props, value) => {
    for (const prop of props) {
        if (!value.hasOwnProperty(prop)) {
            return false;
        }
    }
    return true;
};

/**
 * 
 * @param {object} schemaProps object schema, e.g. OpenAPI schema
 * @param {object} value object we want to validate whether it has extraneous props
 * @returns {boolean} true if props exist in value don't exist in schemaProps
 */
export const hasExtraneousProps = (schemaProps, value) => {
    for (const prop of Object.keys(value)) {
        if (!schemaProps.includes(prop)) {
            return true;
        }
    }
    return false;
}

/**
 * 
 * @param {object} schema body schema
 * @param {object} value request body
 * @returns {boolean} request body adheres to schema
 */
export const validateBody = (schema, body) => {
    // base-case: primitive type
    const propType = schema.type;
    if (propType !== 'object') {
        return validatePrimitive(propType, body)
    }

    // Check required fields are present
    const required = schema.required ? schema.required : []
    if (!hasProps(required, body)) {
        return false;
    }

    // Check no extraneous properties
    const properties = schema.properties ? Object.keys(schema.properties) : []
    if (hasExtraneousProps(properties, body)) {
        return false;
    }

    // Validate nested schema
    return properties.reduce((acc, prop) => {
        return acc && validateBody(schema.properties[prop], body[prop])
    }, true)
};

/**
 * 
 * @param {object} schema schema for query parameter 
 * @param {string} value request query parameter
 * @returns 
 */
export const validateQuery = (schema, value) => {
    const type = schema.type
    if (type !== 'array') {
        return validatePrimitive(type, value)
    }

    if (!Array.isArray(value)) {
        return false
    }

    return value.reduce((acc, v) => {
        return acc && validateQuery(schema.items, v)
    }, true)
}
