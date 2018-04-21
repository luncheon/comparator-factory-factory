"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var defaultCollator = new Intl.Collator();
function comparing() {
    var comparators = createComparators(arguments);
    switch (comparators.length) {
        case 0: return createComparator();
        case 1: return comparators[0];
        case 2: return function (a, b) { return comparators[0](a, b) || comparators[1](a, b); };
        case 3: return function (a, b) { return comparators[0](a, b) || comparators[1](a, b) || comparators[2](a, b); };
        default: return function (a, b) {
            var result = 0;
            for (var i = 0; result === 0 && i < comparators.length; ++i) {
                result = comparators[i](a, b);
            }
            return result;
        };
    }
}
exports.default = comparing;
function createComparators(orders) {
    var comparators = [];
    var order;
    for (var i = 0; i < orders.length; ++i) {
        order = orders[i];
        if (typeof order === 'object') {
            for (var _i = 0, _a = Array.isArray(order.key) ? order.key : [order.key]; _i < _a.length; _i++) {
                var key = _a[_i];
                comparators.push(createComparator(key, order.desc, order.nulls, order.locales, order.collator));
            }
        }
        else {
            comparators.push(createComparator(order));
        }
    }
    return comparators;
}
function createComparator(key, desc, nulls, locales, collatorOptions) {
    var collator = locales || collatorOptions ? new Intl.Collator(locales, collatorOptions) : defaultCollator;
    var keySelector = createKeySelector(key);
    var direction = desc ? -1 : 1;
    var nullsResult = nulls === 'first' ? -1 : nulls === 'last' ? 1 : direction * (nulls === 'max' ? 1 : -1);
    return function (a, b) {
        var A = keySelector(a);
        var B = keySelector(b);
        return (A === B ? 0 :
            A === undefined ? nullsResult :
                B === undefined ? -nullsResult :
                    A === null ? nullsResult :
                        B === null ? -nullsResult :
                            direction * (typeof A === 'string' && typeof B === 'string' ? collator.compare(A, B) : (A < B ? -1 : 1)));
    };
}
function createKeySelector(key) {
    return (key === undefined ? identity :
        typeof key === 'function' ? key :
            typeof key === 'number' ? function (element) { return element[key]; } :
                createPropertyGetter(String(key)));
}
function createPropertyGetter(path) {
    var paths = [];
    {
        var lastIndex = -1;
        for (var index = path.indexOf('.'); index !== -1; index = path.indexOf('.', index + 1)) {
            if (path[index - 1] !== '\\') {
                paths.push(path.slice(lastIndex + 1, index));
                lastIndex = index;
            }
        }
        paths.push(path.slice(lastIndex + 1));
    }
    switch (paths.length) {
        case 0:
            return identity;
        case 1: {
            var path_1 = paths[0];
            return function (element) { return element[path_1]; };
        }
        default:
            return function (element) {
                for (var _i = 0, paths_1 = paths; _i < paths_1.length; _i++) {
                    var path_2 = paths_1[_i];
                    if (element === undefined || element === null) {
                        return;
                    }
                    element = element[path_2];
                }
                return element;
            };
    }
}
function identity(x) {
    return x;
}
