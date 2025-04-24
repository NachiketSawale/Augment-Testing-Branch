/**
 * Created by Mohit on 20.06.2023.
 */
(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name schedulingLookupActivity2ModelobjectDataService
	 * @function
	 *
	 */
	angular.module('basics.lookupdata').factory('schedulingLookupActivity2ModelobjectDataService',  ['platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator','schedulingMainService',

		function (platformLookupDataServiceFactory, basicsLookupdataConfigGenerator,schedulingMainService) {

			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('schedulingLookupActivity2ModelobjectDataService', {
				valMember: 'Id',
				dispMember: 'Id',
				columns: [
					{
						id: 'Id',
						field: 'Id',
						name: 'Id',
						formatter: 'Id',
						name$tr$: 'cloud.common.entityCode'
					},
					{
						id: 'DescriptionInfo.Description',
						field: 'DescriptionInfo.Description',
						name: 'DescriptionInfo.Description',
						formatter: 'description',
						name$tr$: 'cloud.common.entityDescription'
					}
				],
				uuid: 'bezkddae9d814189815420abba2f0a9a'
			});
			//let readData = schedulingMainService.getSelected().Id;
			let schedulingLookupActivity2MdlObjectDataServiceConfig = {
				httpRead: {route:  globals.webApiBaseUrl + 'scheduling/main/ojectmodelsimulation/' ,endPointRead: 'list'},
				// filterParam: readData,
				filterParam: 'mainItemId',
				prepareFilter: function prepareFilter(Id) {
					if (Id === null || Id === undefined)
					{
						Id = 0;
					}
					return '?mainItemId=' + Id;
				}
			};

			let serviceContainer = platformLookupDataServiceFactory.createInstance(schedulingLookupActivity2MdlObjectDataServiceConfig);
			serviceContainer.service.getItemByKey = function getItemByKey(id){
				return serviceContainer.service.getItemById(id,serviceContainer.options);
			};

			return serviceContainer.service;

	}]);
})(angular);
