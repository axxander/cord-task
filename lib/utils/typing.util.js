const validatePrimitive = (type, value) => {
    if (type === 'string') {
        return typeof value === 'string' ? true : false;
    } else if (type === 'integer') {
        return Number.isInteger(parseInt(value, 10)) ? true : false;
    }
};

export const validate = (schema, value) => {
    if (!schema.hasOwnProperty('items')) {
        // direct primitive comparison
        return validatePrimitive(schema.type, value);
    }

    // Leaf node analogy
    const valueIsArray = Array.isArray(value);
    if (typeof schema.items !== 'object') {
        // leaf node == array of primitives of same type
        return valueIsArray
            ? value.reduce(
                  (a, v) => a && validatePrimitive(schema.items, v),
                  true
              )
            : false;
    }

    // recursive case: type of elements are not primitive
    return valueIsArray
        ? value.reduce((a, v) => a && validate(schema.items, v), true)
        : false;
};
