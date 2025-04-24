/**
 * Created by leo on 01.09.2016.
 */
(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name modelEstLineItemLookupDataService
	 * @function
	 *
	 * @description
	 * modelEstLineItemLookupDataService is the data service for activity look ups
	 */
	angular.module('basics.lookupdata').factory('modelEstLineItemLookupDataService', ['platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator', '$q',

		function (platformLookupDataServiceFactory, basicsLookupdataConfigGenerator, $q) {

			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('modelEstLineItemLookupDataService', {
				valMember: 'Id',
				dispMember: 'Code',
				columns: [
					{
						id: 'Code',
						field: 'Code',
						name: 'Code',
						formatter: 'code',
						width: 100,
						name$tr$: 'cloud.common.entityCode'
					},
					{
						id: 'Description',
						field: 'DescriptionInfo.Translated',
						name: 'Description',
						formatter: 'translation',
						width: 150,
						name$tr$: 'cloud.common.entityDescription'
					}
				],
				uuid: '04d494902bb3400fa2adb1b840da59b8'
			});

			var modelEstLineItemLookupDataServiceConfig = {
				httpRead: { route: globals.webApiBaseUrl + 'estimate/main/lineitem/', endPointRead: 'list' },
				filterParam: 'estHeaderId',
				prepareFilter: function prepareFilter(filter) {
					var readData = {estHeaderFk: -1};
					readData.estHeaderFk = filter;
					return readData;
				},
				dataProcessor: [{processItem: function(item){
					if (item.IsTemp) {
						item.icon = 21;
					} else {
						item.icon = 2;
					}

				}}]
			};

			var container = platformLookupDataServiceFactory.createInstance(modelEstLineItemLookupDataServiceConfig);
			container.service.getItemByKey = function (value, options) {
				return container.service.getItemById(value, options);
			};
			container.service.getSearchList = function (searchString, value, scope, searchSettings) {
				var deferred = $q.defer();
				var options = scope.settings.dataView.dataContext.options;
				container.service.getList(options).then(function(data){
					var list = _.filter(data, function (item) {
						var result = false;
						angular.forEach(searchSettings.searchFields, function(field){
							var parts = field.split('.');
							if(parts.length > 1){
								if(!_.isEmpty(item[parts[0]][parts[1]]) && item[parts[0]][parts[1]].search(searchSettings.searchString) > -1){
									result = true;
									return;
								}
							} else if(!_.isEmpty(item[field]) && _.isString(item[field]) && item[field].search(searchSettings.searchString) > -1){
								result = true;
								return;
							}
						});
						return result;
					});
					deferred.resolve(list);
				});
				return deferred.promise;
			};
			return container.service;
		}]);
})(angular);