(function (angular) {
	/* global globals */
	'use strict';

	/**
	 * @ngdoc service
	 * @name ppsCostCodesLookupDataService
	 * @function
	 *
	 * @description
	 * ppsCostCodesLookupDataService is the data service for all pps cost codes
	 */
	angular.module('productionplanning.ppscostcodes').factory('ppsCostCodesLookupDataService', ['platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator',

		function (platformLookupDataServiceFactory, basicsLookupdataConfigGenerator) {

			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('ppsCostCodesLookupDataService', {
				valMember: 'Id',
				dispMember: 'MdcCode',
				columns: [
					{
						id: 'MdcCode',
						field: 'MdcCode',
						name: 'Code',
						formatter: 'code',
						name$tr$: 'cloud.common.entityCode'
					},
					{
						id: 'MdcDes',
						field: 'MdcDes',
						name: 'MdcDes',
						formatter: 'description',
						name$tr$: 'cloud.common.entityDescription'
					},
					{
						id: 'UseToCreateComponents',
						field: 'UseToCreateComponents',
						name: 'UseToCreateComponents',
						formatter: 'boolean',
						name$tr$: 'productionplanning.ppscostcodes.useToCreateComponents'

					},
					{
						id: 'UseToUpdatePhaseReq',
						field: 'UseToUpdatePhaseReq',
						name: 'UseToUpdatePhaseReq',
						formatter: 'boolean',
						name$tr$: 'productionplanning.ppscostcodes.useToUpdatePhaseReq'

					},
					{
						id: 'ShowAsSlotOnProduct',
						field: 'ShowAsSlotOnProduct',
						name: 'ShowAsSlotOnProduct',
						formatter: 'boolean',
						name$tr$: 'productionplanning.ppscostcodes.showAsSlotOnProduct'

					}
				],
				uuid: '055daba3a03743f692b0014cfccbf98f'
			});

			let ppsCostCodesLookupDataServiceConfig = {
				httpRead: {
					route: globals.webApiBaseUrl + 'productionplanning/ppscostcodes/',
					endPointRead: 'listppscostcodes'
				},
				dataIsAlreadySorted: true
			};

			let serviceContainer = platformLookupDataServiceFactory.createInstance(ppsCostCodesLookupDataServiceConfig);

			serviceContainer.service.getItemByKey = function getItemByKey(id){
				return serviceContainer.service.getItemById(id,serviceContainer.options);
			};

			return serviceContainer.service;

		}]);
})(angular);
