/**
 * Created by leo on 26.10.2017.
 */
(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name logisticProjectByLgmContextLookupDataService
	 * @function
	 *
	 * @description
	 * logisticProjectByLgmContextLookupDataService is the data service for project look ups regarding same logistic context
	 */
	angular.module('logistic.job').factory('logisticProjectByLgmContextLookupDataService', ['platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator', '$q',

		function (platformLookupDataServiceFactory, basicsLookupdataConfigGenerator, $q) {

			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('projectLookupDataService', {
				valMember: 'Id',
				dispMember: 'ProjectNo',
				columns: [
					{
						id: 'ProjectNo',
						field: 'ProjectNo',
						name: 'Project No',
						formatter: 'code',
						name$tr$: 'cloud.common.entityNumber'
					},
					{
						id: 'ProjectName',
						field: 'ProjectName',
						name: 'Project name',
						formatter: 'description',
						name$tr$: 'cloud.common.entityName'
					}
				],
				uuid: '407973176dd24d32bd68290db91fee3e'
			});

			var projectLookupDataServiceConfig = {
				httpRead: { route: globals.webApiBaseUrl + 'project/main/', endPointRead: 'listbylogisticcontext' },
				navigator: { moduleName: 'project.main', registerService:'projectMainService' }
			};

			var container = platformLookupDataServiceFactory.createInstance(projectLookupDataServiceConfig);
			
			container.service.getSearchList = function getSearchList(searchString, value, scope, searchSettings){
				var deferred = $q.defer();
				var options = scope.settings.dataView.dataContext.options;
				container.service.getList(options).then(function(data){
					var list = _.filter(data, function (item) {
						var result = false;
						if(!_.isEmpty(item.SearchPattern) && item.SearchPattern.toLowerCase().search(searchSettings.searchString.toLowerCase()) > -1){
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
