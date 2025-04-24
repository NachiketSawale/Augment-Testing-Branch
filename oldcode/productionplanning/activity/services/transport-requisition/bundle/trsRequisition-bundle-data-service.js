/**
 * Created by anl on 2/6/2018.
 */

(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.activity';
	var module = angular.module(moduleName);
	module.factory('productionplanningActivityTrsRequisitionBundleDataService', ProductionplanningMountingTrsRequisitionBundleDataService);

	ProductionplanningMountingTrsRequisitionBundleDataService.$inject = [
		'transportplanningBundleReferenceDataServiceBuilder',
		'productionplanningActivityTrsRequisitionDataService',
		'productionplanningActivityActivityDataService',
		'productionplanningCommonDocumentDataServiceFactory',
		'productionplanningActivityTrsRequisitionBundleDataServiceSyncManager',
		'transportplanningBundleGoodsSynchronizeFactory'];
	function ProductionplanningMountingTrsRequisitionBundleDataService(ServiceBulider,
	                                                                   parentService,
	                                                                   rootDataService,
	                                                                   documentServiceFactory,
	                                                                   DataServiceSyncManager,
																	   bundleGoodsSynchronizeFactory) {
		var serviceContainer;
		var serviceInfo = {
			module: module,
			serviceName: 'productionplanningActivityTrsRequisitionBundleDataService'
		};
		var validationService = '';
		var httpResource = {
			endRead: 'listForRequisition'
		};
		var entityRole = {
			node: {
				itemName: 'Bundle',
				parentService: parentService,
				parentFilter: 'requisitionId'
			}
		};
		var actions = {
			createReference: true,
			deleteReference: true,
			referenceForeignKeyProperty: 'TrsRequisitionFk',
			referenceSourceDataService: 'productionplanningActivityUnassignedBundleDataService'
		};

		var builder = new ServiceBulider('flatNodeItem');
		serviceContainer = builder
			.setServiceInfo(serviceInfo)
			.setValidationService(validationService)
			.setHttpResource(httpResource)
			.setEntityRole(entityRole)
			.setActions(actions)
			.build();

		var service = serviceContainer.service;

		var documentService = documentServiceFactory.getService({
			containerId: 'productionplanning.activity.document.activity2',
			foreignKey: 'ActivityItemsDocument',
			parentService: rootDataService,
			isReadonly: true
		});
		var syncManager = new DataServiceSyncManager(service,documentService);
		syncManager.syncBundleAndItemDocuments(service, documentService);

		serviceContainer.service.registerReferenceDeleted(function (e, items) {
			//synchronize with trsGood
			var bundleGoodSynchronizeService = bundleGoodsSynchronizeFactory.getService(moduleName);
			bundleGoodSynchronizeService.synDeletedBundle(items);
		});

		serviceContainer.service.registerReferenceCreated(function (e, items) {
			//synchronize with trsGood
			var bundleGoodSynchronizeService = bundleGoodsSynchronizeFactory.getService(moduleName);
			bundleGoodSynchronizeService.synAddedBundle(items);
		});

		return service;
	}
})(angular);