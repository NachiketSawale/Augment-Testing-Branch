/**
 * Created by balkanci on 06.11.2014.
 */
(function (angular) {
	/* global globals */
	'use strict';

	/**
	 * @ngdoc service
	 * @name basicsLookupDataService
	 * @function
	 *
	 * @description
	 * basicsLookupDataService is the data service for getting the lookupdataTables
	 */
	angular.module('basics.lookupdata').factory('basicsLookupdataSimpleLookupService', ['$http', '$q', '_','$injector',
		'basicsLookupSimpleDataProcessor', 'BasicsLookupdataLookupDictionary',

		function ($http, $q, _, $injector,simpleProcessor, LookupDictionary) {
			var dataCache = new LookupDictionary(true);
			var promiseCache = new LookupDictionary(true);

			return {
				getData: getListSync,
				getList: getList,
				getDefault: getDefault,
				getListSync: getListSync,
				getItemById: getItemById,
				getItemByIdSync: getItemByIdSync,
				refreshCachedData: refreshCachedData,
				resolveStringValueCallback: resolveStringValueCallback
			};

			function refreshCachedData(lookupOptions) {
				if (dataCache.remove(lookupOptions.lookupModuleQualifier)) {
					// getList will go to the server because the cache for that Qualifier has been cleared
					return getList(lookupOptions);
				}
				return $q.when(false);
			}

			function getItemById(value, lookupOptions) {
				if (value === undefined && value === null) {
					return;
				}
				var defer = $q.defer();
				getList(lookupOptions).then(function (data) {
					var item = _.find(data, function (item) {
						return item[lookupOptions.valueMember] === value;
					});
					defer.resolve(item);
					defer = null;
				});

				return defer.promise;
			}

			function getItemByIdSync(value, lookupOptions) {
				if (value === undefined && value === null) {
					return;
				}
				var simpleData = getListSync(lookupOptions);
				if (simpleData && simpleData.length) {
					var lookupItem = _.find(simpleData, function (item) {
						return item[lookupOptions.valueMember] === value;
					});
					return lookupItem;
				}

			}

			// get the list without promise. Used for search, sorting and grouping
			function getListSync(lookupOptions) {
				var list = dataCache.get(lookupOptions.lookupModuleQualifier) || [];
				if (list.length === 0) {
					// trigger async loading when there is no cached data
					getList(lookupOptions);
				}
				return list;
			}

			function getList(lookupOptions) {

				var defer;

				var options = {
					lookupModuleQualifier: lookupOptions.lookupModuleQualifier,
					displayProperty: lookupOptions.displayMember,
					valueProperty: lookupOptions.valueMember,
					CustomIntegerProperty: lookupOptions.filter && lookupOptions.filter.customIntegerProperty ? lookupOptions.filter.customIntegerProperty : null,
					CustomIntegerProperty1: lookupOptions.filter && lookupOptions.filter.customIntegerProperty1 ? lookupOptions.filter.customIntegerProperty1 : null,
					CustomBoolProperty: lookupOptions.filter && lookupOptions.filter.customBoolProperty ? lookupOptions.filter.customBoolProperty : null,
					CustomBoolProperty1: lookupOptions.filter && lookupOptions.filter.customBoolProperty1 ? lookupOptions.filter.customBoolProperty1 : null,
					isColorBackGround:lookupOptions.isColorBackGround,
					serverName:lookupOptions.serverName
				};

				var list = dataCache.get(options.lookupModuleQualifier);
				// when there is no cached data, go to the server
				if (_.isEmpty(list)) {
					// check for existing promise for that lookupType
					var promise = promiseCache.get(options.lookupModuleQualifier);
					if (!promise) {
						// create a new one and add it to the cache
						defer = $q.defer();
						promiseCache.add(options.lookupModuleQualifier, defer);
					} else {
						// use the existing promise from cache
						defer = promise;
					}

					// first time for that lookupType get the Data from Server and cache it after, this case should
					if (!promise) {
						$http.post(globals.webApiBaseUrl + 'basics/lookupData/getData', options).then(function (response) {
							var processedResponseData = simpleProcessor.getProcessor()(response.data.items, lookupOptions);
							defer.resolve(processedResponseData);
							// add to cache
							dataCache.add(lookupOptions.lookupModuleQualifier, processedResponseData);
							// remove the promise
							promiseCache.remove(lookupOptions.lookupModuleQualifier);
							// reset the promise
							defer = null;
						},
						// error handling
						function (error) {
							console.log('fail to load data for lookup type: ' + options.lookupModuleQualifier);
							defer.reject(error);
							defer = null;
							promiseCache.remove(lookupOptions.lookupModuleQualifier);
						});
					}

				} else {
					// resolve with cachedData
					defer = $q.defer();
					defer.resolve(list);
				}
				return defer.promise;
			}

			function getDefault(lookupOptions) {
				var defer = $q.defer();

				getList(lookupOptions).then(function (data) {
					var defaultItem = _.find(data, function (item) {
						return item.isDefault === true;
					});
					defer.resolve(defaultItem);
					defer = null;

				});
				return defer.promise;
			}

			function resolveStringValueCallback(formatterOptions) {
				const self = this;
				const displayMember = formatterOptions.displayMember;

				return function (value, options) {
					return self.getList(formatterOptions).then(items => {
						const lowercaseValue = value.toLowerCase();
						const item = _.find(items, (item) => {
							const displayText = _.get(item, displayMember);
							return displayText === value || displayText.toLowerCase() === lowercaseValue;
						});

						if (item) {
							return {
								apply: true,
								valid: true,
								value: item.Id
							};
						}

						return {
							apply: true,
							valid: false,
							value: value,
							error: 'not found!'
						};
					});
				};
			}

		}]);
})(angular);

