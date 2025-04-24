/**
 * Created by Rajshekhar on 17.10.2024.
 */
(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name modelFilterTreeLookupDataService
	 * @function
	 *
	 * @description
	 * modelFilterTreeLookupDataService is the data service for activity look ups
	 */
	angular.module('basics.lookupdata').factory('modelFilterTreeLookupDataService', ['platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator',

		function (platformLookupDataServiceFactory, basicsLookupdataConfigGenerator) {


			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('modelFilterTreeLookupDataService', {
				valMember: 'Id',
				dispMember: 'DescriptionInfo.Translated',
				columns: [
					//{
					//	id: 'Code',
					//	field: 'Code',
					//	name: 'Code',
					//	formatter: 'code',
					//	width: 100,
					//	name$tr$: 'cloud.common.entityCode'
					//},
					{
						id: 'Description',
						field: 'DescriptionInfo',
						name: 'Description',
						formatter: 'translation',
						width: 150,
						name$tr$: 'cloud.common.entityDescription'
					}
				],
				uuid: 'e5801f5433724277babcc584015775a1'
			});

			var modelProjectModelLookupDataServiceConfig = {
				httpRead: { route: globals.webApiBaseUrl + 'model/administration/treetemplate/', endPointRead: 'list' },
				filterParam: 'mainItemId',
				//prepareFilter: function prepareFilter(Id) {
				//	if (Id === null || Id === undefined) {
				//		Id = 1;
				//	}
				//	return '?mainItemId=' + Id + '&includeComposite=true';
				//}
			};

			return platformLookupDataServiceFactory.createInstance(modelProjectModelLookupDataServiceConfig).service;
		}]);
})(angular);
