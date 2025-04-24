/**
 * Created by leo on 15.03.2018.
 */
(function (angular) {
	/* global globals */
	'use strict';

	/**
	 * @ngdoc service
	 * @name logisticDispatchingHeaderLookupDataService
	 * @function
	 *
	 * @description
	 * logisticDispatchingHeaderLookupDataService is the data service
	 */
	angular.module('logistic.dispatching').factory('logisticDispatchingHeaderLookupDataService', ['_', 'platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator', '$q',

		function (_, platformLookupDataServiceFactory, basicsLookupdataConfigGenerator, $q) {

			var lookupDataServiceConfig = {
				httpRead: { route: globals.webApiBaseUrl + 'logistic/dispatching/header/', endPointRead: 'searchlist' }
			};

			var container = platformLookupDataServiceFactory.createInstance(lookupDataServiceConfig);
			
			container.service.getSearchList = function getSearchList(searchString, value, scope, searchSettings){
				var deferred = $q.defer();
				var options = scope.settings.dataView.dataContext.options;
				container.service.getList(options).then(function(data){
					var list = _.filter(data, function (item) {
						var result = false;
						if(!_.isEmpty(item.Code) && item.Code.toLowerCase().search(searchSettings.searchString.toLowerCase()) > -1){
							result = true;
						}
						if(!_.isEmpty(item.Description) && item.Description.toLowerCase().search(searchSettings.searchString.toLowerCase()) > -1){
							result = true;
						}
						return result;
					});
					deferred.resolve(list);
				});
				return deferred.promise;
			};

			container.service.getItemByKey = function getItemByKey(value, lookupOptions, scope) {
				return container.service.getItemById(value, lookupOptions, scope);
			};

			return container.service;
		}]);
})(angular);
