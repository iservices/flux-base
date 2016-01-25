
/**
 * Helper functions for doing reflection.
 */
class Reflect {

  /**
   * Check to see if the current code is running a browser versus running on a server.
   * @returns {Boolean} true if the current code is running in a browser, false otherwise.
   */
  static isBrowserContext() {
    return (typeof window !== 'undefined' && window);
  }

  /**
   * Check to see if the given value is a function.
   * @param {Any} value The value to check.
   * @returns {Boolean} true is returned if the value is a function, false if it is not.
   */
  static isFunction(value) {
    return (typeof value === 'function');
  }

  /**
   * Get the parameter names for the given function.
   * @param {Function} func The function to get parameter names from.
   * @returns {Array} An array of parameter names for the given function.
   */
  static getParameterNames(func) {
    if (!Reflect.isFunction(func)) {
      return [];
    }

    let result = func.toString()
                     .match(/\(.*?\)/)[0]
                     .replace(/[()]/gi, '')
                     .replace(/\s/gi, '')
                     .split(',');
    if (result.length === 1 && result[0] === '') {
      result = [];
    }

    return result;
  }

  /**
   * Get all of the property names starting on the startPrototype and working up to the endPrototype.
   * @param {Prototype} startPrototype The prototype to start collecting property names from.
   * @param {Prototype} [endPrototype] A prototype that startPrototype inherits from either directly or indirectly.
   *                                   If not set then only the property names on the startPrototype will be returned.
   * @returns {Array} The property names defined on the prototypes.
   */
  static getPropertyNames(startPrototype, endPrototype) {
    if (!endPrototype || (startPrototype && startPrototype === endPrototype)) {
      return Object.getOwnPropertyNames(startPrototype);
    }

    let ptype = startPrototype;
    let isEnd = false;
    const result = [];

    while (ptype && !isEnd) {
      isEnd = (ptype === endPrototype);
      Array.prototype.push.apply(result, Object.getOwnPropertyNames(ptype));
      ptype = Object.getPrototypeOf(ptype);
    }

    return result;
  }

  /**
   * Get all of the funcitons from the startPrototype up with the given name.
   * @param {String|String[]} functionNames - The name or names of the functions to get.
   * @param {Prototype} startPrototype - The prototype to start the lookup at.
   * @param {Prototype} endPrototype - The prototype to stop the lookup on.
   * @returns {Array} An array of the functions found.
   */
  static getFunctionChain(functionNames, startPrototype, endPrototype) {
    const names = Array.isArray(functionNames) ? functionNames : [functionNames];
    let ptype = startPrototype;
    let isEnd = false;
    const result = [];

    while (ptype && !isEnd) {
      isEnd = (ptype === endPrototype);
      const item = {};
      let atLeastOneItem = false;
      for (let index = 0; index < names.length; index++) {
        if (ptype.hasOwnProperty(names[index])) {
          item[names[index]] = ptype[names[index]];
          atLeastOneItem = true;
        }
      }
      if (atLeastOneItem) {
        result.push(item);
      }
      ptype = Object.getPrototypeOf(ptype);
    }

    return result;
  }
}

export default Reflect;
