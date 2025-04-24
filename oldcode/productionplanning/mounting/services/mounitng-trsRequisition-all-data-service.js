/**
 * Created by waz on 8/1/2017.
 */
(function (angular) {
	'use strict';
	/**
	 * @ngdoc service
	 * @name productionplanningMountingTrsRequisitionAllDataService
	 * @function
	 *
	 * @description
	 * productionplanningMountingTrsRequisitionAllDataService is the data service for all entities related functionality.
	 */
	var moduleName = 'productionplanning.mounting';
	angular.module(moduleName).factory('productionplanningMountingTrsRequisitionAllDataService', productionplanningMountingTrsRequisitionAllDataService);

	productionplanningMountingTrsRequisitionAllDataService.$inject = [
		'$http',
		'basicsCommonContainerDialogService',
		'basicsLookupdataLookupDescriptorService',
		'transportplanningRequisitionReferenceDataServiceBuilder',
		'platformDataServiceDataProcessorExtension',
		'platformDataServiceSelectionExtension',
		'platformDataServiceActionExtension',
		'$q',
		'basicsLookupdataLookupFilterService',
		'productionplanningMountingContainerInformationService',
		'productionplanningCommonActivityDateshiftService',
		'productionplanningMountingRequisitionDataService',
		'transportplanningRequisitionDataProcessorService'];

	function productionplanningMountingTrsRequisitionAllDataService($http, containerDialogService,
																 basicsLookupdataLookupDescriptorService,
																 DataServiceBuilder,
																 platformDataServiceDataProcessorExtension,
																 platformDataServiceSelectionExtension,
																 platformDataServiceActionExtension,
																 $q,
																 basicsLookupdataLookupFilterService,
																 mountingContainerInformationService,
																                ppsActivityDateshiftService,
																productionplanningMountingRequisitionDataService,
		transportplanningRequisitionDataProcessorService) {
		var defaultTrsReqDateType = 0;
		$http.get(globals.webApiBaseUrl + 'basics/common/systemoption/inittrsreqdatetype').then(function(response){
			defaultTrsReqDateType = response.data;
		});

		var serviceInfo = {
			module: angular.module(moduleName),
			serviceName: 'productionplanningMountingTrsRequisitionAllDataService'
		};
		var httpResource = {
			endRead: 'listForMnt'
		};
		var entityRole = {
			node: {
				itemName: 'TrsRequisition',
				parentService: productionplanningMountingRequisitionDataService,
				parentFilter: 'mntId'
			}
		};

		var actions = {
			create: 'flat',
			delete: true,
			createReference: true,
			deleteReference: true,
			referenceForeignKeyProperty: 'MntActivityFk'
		};

		var builder = new DataServiceBuilder('flatNodeItem');
		var serviceContainer = builder
			.setServiceInfo(serviceInfo)
			.setHttpResource(httpResource)
			.setEntityRole(entityRole)
			.setActions(actions)
			.setDataProcessor(transportplanningRequisitionDataProcessorService.getDataProcessors())
			.build();

		/**
		 * Add filterKey to trsRequisition field**/
		var trsRequisitionList = {};

		serviceContainer.service.getTrsRequisitionList = function () {
			trsRequisitionList = serviceContainer.service.getList();
			return trsRequisitionList;
		};

		var filters = [
			{
				key: 'resource-requisition-trsrequisition-filter',
				fn: function (item) {
					var result = false;
					if (item) {
						_.find(trsRequisitionList, function (requisition) {
							if (item.Id === requisition.Id) {
								result = true;
							}
						});
					}
					return result;
				}
			}];

		serviceContainer.service.registerFilter = function () {
			basicsLookupdataLookupFilterService.registerFilter(filters);
		};

		serviceContainer.service.unregisterFilter = function () {
			basicsLookupdataLookupFilterService.unregisterFilter(filters);
		};

		return serviceContainer.service;
	}
})(angular);
