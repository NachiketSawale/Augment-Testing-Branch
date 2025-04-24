/**
 * Created by wui on 12/2/2017.
 */

(function (angular) {
	'use strict';

	var moduleName = 'basics.lookupdata';

	/**
	 * @ngdoc service
	 * @name boqLineTypeLookupDataService
	 * @function
	 *
	 * @description
	 * boqLineTypeLookupDataService is the data service for boq line type look ups
	 */
	angular.module(moduleName).factory('boqProjectLookupDataService', ['platformLookupDataServiceFactory','basicsLookupdataConfigGenerator',

		function (platformLookupDataServiceFactory, basicsLookupdataConfigGenerator) {

			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('boqProjectLookupDataService', {
				valMember: 'Id',
				dispMember: 'BoqRootItem.Reference',
				columns: [
					{
						id: 'Reference',
						field: 'BoqRootItem.Reference',
						name: 'Reference',
						formatter: 'description',
						name$tr$: 'boq.main.Reference'
					},
					{
						id: 'Outline Specification',
						field: 'BoqRootItem.BriefInfo.Translated',
						name: 'BriefInfo',
						formatter: 'description',
						name$tr$: 'boq.main.Brief'
					}
				],
				uuid: '74d914fc1da64fa197e69622275be76d'
			});

			var boqLineTypeLookupDataServiceConfig = {
				httpRead: { route: globals.webApiBaseUrl + 'boq/project/', endPointRead: 'list'},
				filterParam: 'projectId',
				dataProcessor: [{
					processItem: function (item) {
						item.Id = item.BoqHeader.Id;
					}
				}]
			};

			return platformLookupDataServiceFactory.createInstance(boqLineTypeLookupDataServiceConfig).service;
		}]);
})(angular);