(function (angular) {
	'use strict';

	var moduleName = 'basics.lookupdata';

	/*jshint -W072*/ // this function has too many parameters.
	angular.module(moduleName).factory('basicsLookupdataLookupDescriptorService', [
		'_', '$q',
		'$http',
		'$injector',
		'basicsLookupdataLookupDataService',
		'BasicsLookupdataLookupDictionary',
		function (_, $q,
			$http,
			$injector,
			basicsLookupdataLookupDataService,
			BasicsLookupdataLookupDictionary) {
			var dataCache = new BasicsLookupdataLookupDictionary(true);
			var promiseCache = new BasicsLookupdataLookupDictionary(true);

			return {
				loadData: loadData,
				loadItemByKey: loadItemByKey,
				getData: getData,
				addData: addData,
				removeData: removeData,
				refresh: refresh,
				updateData: updateData,
				attachData: attachData,
				clear: clear,
				initData: initData,
				hasLookupItem: hasLookupItem,
				getLookupItem: getLookupItem,
				provideLookupData: provideLookupData,
				getItemByKey: getItemByKey,
				getItemByIdSync: getItemByIdSync
			};

			/**
			 * @description load description data.
			 */
			function loadData(lookupTypes) {
				var promises = null;

				if (!lookupTypes) {
					return;
				}

				if (angular.isArray(lookupTypes)) {
					promises = [];
					lookupTypes.forEach(function (lookupType) {
						var promise = promiseCache.get(lookupType);

						if (!promise) {
							promise = basicsLookupdataLookupDataService.getList(lookupType);
							promiseCache.add(lookupType, promise);

							promise.then(function (data) {
								updateData(lookupType, data);
							}, function () {
								promiseCache.remove(lookupType);
							});
						}

						promises.push(promise);
					});
				}
				else {
					promises = basicsLookupdataLookupDataService.getList(lookupTypes);
					promises.then(function (data) {
						updateData(lookupTypes, data);
					});
				}

				return promises;
			}

			/**
			 * @description load data item by id.
			 */
			function loadItemByKey(scopeOrString, value) {
				var lookupType, key, options;

				if (_.isObject(scopeOrString)) {
					// get scope properties
					lookupType = scopeOrString.options.lookupType;
					key = scopeOrString.ngModel;
					options = scopeOrString.options;
				}else if(_.isString(scopeOrString))
				{
					lookupType = scopeOrString;
					key = value;
				}

				var resultDefer = $q.defer();
				var targetData = dataCache.get(lookupType);
				var targetItem = targetData ? targetData[key] : null;
				var itemResult = null;
				var successCallback = function (data) {
					if (data) {
						updateData(lookupType, [data]);
					}
					resultDefer.resolve(data);
				};

				if (targetItem) {
					resultDefer.resolve(targetItem);
				}
				else {
					itemResult = basicsLookupdataLookupDataService.getItemByKey(lookupType, key, options, scopeOrString);
					if (itemResult && angular.isFunction(itemResult.then)) { // return a promise
						itemResult.then(successCallback);
					} else { // return corresponding data
						successCallback(itemResult);
					}
				}

				return resultDefer.promise;
			}

			/**
			 * @description get description data.
			 */
			function getData(lookupType) {
				return dataCache.get(lookupType);
			}

			/**
			 * refresh cache data.
			 * @param lookupType
			 * @param items
			 */
			function refresh(lookupType, items) {
				if (!lookupType || !items || !items.length || !dataCache.has(lookupType)) {
					return;
				}

				var data = dataCache.get(lookupType),
					temp = items.filter(function (item) {
						return !!data[item.Id];
					});

				// todo-wui: comment this for performance issue, really need?
				// remove old data(which has been remove from items) from dataCache.
				// for(var i in data){
				// var bDataInItems = items.some(function (item) {
				//  return item.Id === data[i].Id;
				// });
				//
				// if(bDataInItems){
				//  delete data[i];
				// }
				// }

				updateData(lookupType, temp);
			}

			/**
			 * @description update description data, override.
			 */
			function updateData(lookupType, items) {
				if (!lookupType || !items || !items.length) {
					return;
				}

				if (!dataCache.has(lookupType)) {
					dataCache.add(lookupType, {});
				}

				var targetData = dataCache.get(lookupType),
					action = function (item) {
						if (item) {
							targetData[item.Id] = item;
						}
					};
				items.forEach(action);
			}

			/**
			 * @description add description data, not override.
			 */
			function addData(lookupType, items) {
				if (!lookupType || !items || !items.length) {
					return;
				}

				if (!dataCache.has(lookupType)) {
					dataCache.add(lookupType, {});
				}

				var targetData = dataCache.get(lookupType),
					action = function (item) {
						if (item && !targetData[item.Id]) {
							targetData[item.Id] = item;
						}
					};
				items.forEach(action);
			}

			// remove cache data by lookup type
			function removeData(lookupType) {
				dataCache.remove(lookupType);
			}

			/**
			 * @description store lookup data to cache.
			 */
			function attachData(data) {
				var propName = '';
				var lookupType = '';

				if (!angular.isObject(data)) {
					return;
				}

				for (var prop in data) {
					if (data.hasOwnProperty(prop)) {
						propName = prop.toLowerCase();
						if (propName !== 'main') {
							lookupType = propName;
							updateData(lookupType, data[prop]);
						}
					}
				}
			}

			/**
			 * @description clear data cache.
			 */
			function clear() {
				promiseCache.clear();
				dataCache.clear();
			}

			/**
			 * @description init lookup description data
			 */
			function initData(lookupArray) {
				var promises = [];
				lookupArray.forEach(function (lookup) {
					var defer = $q.defer();
					$http.get(lookup.url)
						 .then(function success (response) {
						       updateData(lookup.id, response.data);
							   defer.resolve();
						 })
						 .catch (function error(response) {
						       defer.reject(response);
						});
					promises.push(defer.promise);
				});
				return $q.all(promises);
			}

			/**
			 * @description has corresponding lookup item in the cache.
			 * @param lookupType
			 * @param id
			 * @returns {boolean}
			 */
			function hasLookupItem(lookupType, id) {
				var lookupData = dataCache.get(lookupType);

				if (angular.isObject(id)) {
					return lookupData && _.find(lookupData, id);
				}

				return lookupData && lookupData[id];
			}

			/**
			 * @description get lookup item from cache.
			 * @param lookupType
			 * @param id
			 * @returns {*}
			 */
			function getLookupItem(lookupType, id) {
				var lookupData = dataCache.get(lookupType);

				if (angular.isObject(id)) {
					return (lookupData && !_.isNil(id)) ? _.find(lookupData, id) : null;
				}

				return (lookupData && !_.isNil(id)) ? lookupData[id] : null;
			}

			/**
			 * @description provide lookup data of foreign key property in the entity.
			 * @param entity
			 * @param option
			 * @returns {{dataReady: boolean, dataPromise: null}}
			 */
			function provideLookupData(entity, option) { /* jshint -W074 */ // cyclomatic complexity is too high.
				var lookup = [];
				var promises = [];
				var result = {
					dataReady: true, // all necessary lookup data is ready
					dataPromise: null // a promise to all necessary lookup data
				};

				if (!entity) {
					return result;
				}

				for (var prop in entity) {
					if (entity.hasOwnProperty(prop) && entity[prop]) {
						var lookupType = '', collectProp = false;

						if (/Fk$/.test(prop)) { // foreign key property.
							collectProp = true;
							// take string from property name except 'Fk' as lookup type name by default,
							// if it is not the right lookup type name, please use convert to return right name.
							lookupType = prop.substring(0, prop.length - 2);
						}
						else if (angular.isObject(entity[prop])) { // object property.
							collectProp = true;
						}

						if (collectProp) {
							if (option && option.collect) {
								var res = option.collect(prop, lookup);
								if (!res) {
									lookupType = null;
								}
								else if (angular.isString(res)) {
									lookupType = res;
								}
							}

							if (lookupType) {
								lookup.push({
									lookupType: lookupType,
									idValue: entity[prop]
								});
							}
						}
					}
				}

				if (lookup.length > 0) {
					lookup.forEach(function (item) {
						if (!hasLookupItem(item.lookupType, item.idValue)) {
							promises.push(loadItemByKey(item.lookupType, item.idValue));
						}
					});
				}

				if (promises.length > 0) {
					var deferred = $q.defer();

					result.dataReady = false;
					result.dataPromise = deferred.promise;
					$q.all(promises).finally(function () {
						deferred.resolve();
					});
				}

				return result;
			}

			/**
			 * @description get lookup item from server side.
			 */
			function getItemByKey(type, value, options, scope) {
				return basicsLookupdataLookupDataService.getItemByKey(type, value, options, scope);
			}

			/**
			 * @description get lookup item from client cache.
			 */
			function getItemByIdSync(value, options) {
				return getLookupItem(options.lookupType, value);
			}
		}
	]);

})(angular);