/**
 * Created by waz on 8/23/2017.
 */
(function (angular) {
	'use strict';

	var moduleName = 'transportplanning.requisition';
	var module = angular.module(moduleName);
	module.factory('transportplanningRequisitionBundleDataService', TransportplanningRequisitionBundleDataService);

	TransportplanningRequisitionBundleDataService.$inject = [
		'basicsCommonBaseDataServiceReferenceActionExtension',
		'transportplanningRequisitionMainService',
		'transportplanningBundleReferenceDataServiceBuilder',
		'transportplanningBundleGoodsSynchronizeFactory',
		'ppsVirtualDataServiceFactory'];
	function TransportplanningRequisitionBundleDataService(referenceActionExtension, parentService, ServiceBuilder,
														   bundleGoodsSynchronizeFactory, virtualDataServiceFactory) {

		var mainOptionsType = 'flatNodeItem';
		var serviceInfo = {
			module: module,
			serviceName: 'transportplanningRequisitionBundleDataService'
		};
		var validationService = 'transportplanningRequisitionBundleValidationService';
		var httpResource = {
			endRead: 'listForRequisition'
		};
		var entityRole = {
			node: {
				itemName: 'Bundle',
				parentService: parentService,
				parentFilter: 'requisitionId',
				assign: {
					key: 'TrsRequisitionFk',
					sourceService: 'transportplanningRequisitionUnassignedBundleDataService'
				}
			}
		};
		var actions = {
			createReference: true,
			deleteReference: true,
			referenceForeignKeyProperty: 'TrsRequisitionFk',
			referenceSourceDataService: 'transportplanningRequisitionUnassignedBundleDataService'
		};

		var builder = new ServiceBuilder(mainOptionsType);
		var serviceContainer = builder
			.setServiceInfo(serviceInfo)
			.setValidationService(validationService)
			.setHttpResource(httpResource)
			.setEntityRole(entityRole)
			.setActions(actions)
			.build();

		var service = serviceContainer.service;
		service.registerReferenceCreated(function (e, items) {
			referenceActionExtension.recordAssignedItems('transportplanningBundleToRequisition', items);

			//synchronize with trsGood
			var bundleGoodSynchronizeService = bundleGoodsSynchronizeFactory.getService(moduleName);
			bundleGoodSynchronizeService.synAddedBundle(items);
		});
		service.registerReferenceDeleted(function (e, items) {
			referenceActionExtension.removeAssignedItemsRecord('transportplanningBundleToRequisition', _.map(items, 'Id'));

			//synchronize with trsGood
			var bundleGoodSynchronizeService = bundleGoodsSynchronizeFactory.getService(moduleName);
			bundleGoodSynchronizeService.synDeletedBundle(items);
		});

		// HACK: for handling specified case about creating trsReq by unassign-bundles, we have to override method `onReadSucceeded` for handling readData with storage of assignBundles (HP-ALM #116319)
		var baseOnReadSucceeded = serviceContainer.data.onReadSucceeded;
		serviceContainer.data.onReadSucceeded = function (readData, data) {
			var assignedRecords = referenceActionExtension.getAssignedItemsRecord('transportplanningBundleToRequisition');
			if(assignedRecords && assignedRecords.length >0){
				_.each(assignedRecords, function (bundle) {
					if(!_.find(readData.Main,{Id: bundle.Id})){
						var tmpBundle = _.clone(bundle);
						readData.Main.push(tmpBundle);
					}
				});
			}

			baseOnReadSucceeded(readData, data);
		};

		let virtualDateshiftService = virtualDataServiceFactory.getVirtualDataService(moduleName);
		service.changeTrsRequisitionAssignment = function changeTrsRequisitionAssignment(bundles, add = true) {
			let subEvent = serviceContainer.service.parentService().getSelected();
			//validation
			if (_.isNil(virtualDateshiftService) || _.isNil(subEvent)) {
				return;
			}
			//dateshiftAssignment
			let superEvents = _.filter(
				_.map(bundles, (b) => {
				return {
					PpsEventFk: b.TrsReq_EventFk,
					DateshiftMode: b.TrsReq_DateshiftMode
				};
			}), (supEv) => {
				return !_.isNil(supEv.PpsEventFk) && !_.isNil(supEv.DateshiftMode);
			});
			_.forEach(superEvents, (superEvent) => {
				if (add === true) {
					virtualDateshiftService.changeSpecialzedEvents([subEvent], null, superEvent);
				} else if (add === false) {
					virtualDateshiftService.changeSpecialzedEvents([subEvent], superEvent, null);
				}
			});
		};


		return service;
	}
})(angular);
