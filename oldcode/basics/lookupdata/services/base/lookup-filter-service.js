/**
 * @description: lookup filter service is used to manage filters for specific lookup instance,
 * then lookup directive can get specific filter according to filter key transfer from lookup options.
 */


(function (angular) {

	'use strict';

	var moduleName = 'basics.lookupdata';

	angular.module(moduleName).factory('basicsLookupdataLookupFilterService', ['BasicsLookupdataLookupDictionary',
		function (BasicsLookupdataLookupDictionary) {
			var filterCache = new BasicsLookupdataLookupDictionary(true);
			var service = {
				getFilterByKey: getFilterByKey,
				registerFilter: registerFilter,
				unregisterFilter: unregisterFilter,
				hasFilter: hasFilter,
				clear: clear
			};

			return service;

			/**
			 * @description: get filter by key.
			 * @arguments:
			 *  key: a unique string.
			 */
			function getFilterByKey(key) {
				return key ? filterCache.get(key) : null;
			}

			/**
			 * @description: register a filter by key name in service.
			 * @arguments:
			 *  key: a unique string.
			 *  filter: an object has property 'fn' to get filter function, such as { fn: null }
			 */
			function registerFilter(filters) {
				var fn = function (filter) {
					if (angular.isObject(filter)) {
						const isSuccess = filterCache.add(filter.key, filter);
						// if (!isSuccess) { // rei@3.6.22 suppress this message
						// 	console.log('registerFilter() the filter key named "' + filter.key + '" already registered in service!');
						// }
					}
				};

				if (angular.isArray(filters)) {
					filters.forEach(fn);
				}
				else if (angular.isObject(filters)) {
					fn(filters);
				}

				return service;
			}

			/**
			 * @description: unregister a filter by key name in service.
			 * @arguments:
			 *  key: a unique string.
			 *  filter: an object has property 'fn' to get filter function, such as { fn: null }
			 */
			function unregisterFilter(filters) {
				var fn = function (filter) {
					if (angular.isObject(filter)) {
						var isSuccess = filterCache.remove(filter.key);
						if (!isSuccess) {
							console.log('unregisterFilter() cannot find filter named "' + filter.key + '"!');
						}
					}
				};

				if (angular.isArray(filters)) {
					filters.forEach(fn);
				}
				else if (angular.isObject(filters)) {
					fn(filters);
				}

				return service;
			}

			/**
			 * @description: judge whether has a filter for current key.
			 * @arguments:
			 *  key: a unique string.
			 */
			function hasFilter(key) {
				return filterCache.has(key);
			}

			/**
			 * @description: clear filters in service.
			 */
			function clear() {
				filterCache.clear();
				return service;
			}

		}
	]);

})(angular);