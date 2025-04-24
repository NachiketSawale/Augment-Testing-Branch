(function() {
	'use strict';
	let moduleName = 'estimate.main';
	angular.module(moduleName).factory('estimateMainPriceAdjustmentTotalDataService', ['_', '$injector', '$http', 'platformDataServiceFactory', 'estimateMainPriceAdjustmentDataService', 'estimateMainPriceAdjustmentMapService', 'estimateMainPriceAdjustmentTotalReadonlyProcessService','estimateMainPriceAdjustmentTotalImageProcess', 'boqMainCommonService',
		function (_, $injector, $http, platformDataServiceFactory, estimateMainPriceAdjustmentDataService, estimateMainPriceAdjustmentMapService, estimateMainPriceAdjustmentTotalReadonlyProcessService,estimateMainPriceAdjustmentTotalImageProcess, boqMainCommonService) {
			let service = {};

			let boqServiceOption = {
				hierarchicalLeafItem: {
					module: moduleName,
					serviceName: 'estimateMainPriceAdjustmentTotalDataService',
					httpRead: {
						useLocalResource: true,
						resourceFunction: loadData,
						resourceFunctionParameters: []
					},
					presenter: {
						list: {
							incorporateDataRead: function (returnValue, data) {
								return data.handleReadSucceeded(returnValue, data);
							}
						}
					},
					entityRole: {
						node: {
							parentService: estimateMainPriceAdjustmentDataService,
							itemName: 'EstimatePriceAdjustmentTotal',
							moduleName: 'estimate.main'
						}
					},
					dataProcessor: [estimateMainPriceAdjustmentTotalReadonlyProcessService,estimateMainPriceAdjustmentTotalImageProcess]
				}
			};

			let adjustmentTotalEntity = null;

			let serviceContainer = platformDataServiceFactory.createNewComplete(boqServiceOption);

			service = serviceContainer.service;

			function loadData() {
				let list = [];
				let selected = estimateMainPriceAdjustmentDataService.getSelected();
				if (selected) {
					let vRoot = estimateMainPriceAdjustmentDataService.getRootItem();
					let readOnlyURBFileds = estimateMainPriceAdjustmentDataService.getReadOnlyURBFiledName(selected);
					adjustmentTotalEntity = estimateMainPriceAdjustmentMapService.CreateAdjustmentTotalEntity(selected, vRoot, readOnlyURBFileds);
					list = adjustmentTotalEntity.getGridData();
				}
				return list;
			}

			service.getAdjustmentTotalEntity = function () {
				return adjustmentTotalEntity;
			};

			service.isPosition = function () {
				return adjustmentTotalEntity && adjustmentTotalEntity.entity ? boqMainCommonService.isItem(adjustmentTotalEntity.entity) : false;
			};

			service.IsAssignedLineItem = function() {
				return adjustmentTotalEntity && adjustmentTotalEntity.entity ? adjustmentTotalEntity.entity.IsAssignedLineItem : false;
			};

			service.isReadOnlyAdjustment = function () {
				return !(service.isPosition() && service.IsAssignedLineItem());
			};

			service.getAdjustmentReadOnlyURB = function() {
				return adjustmentTotalEntity && adjustmentTotalEntity.entity ? estimateMainPriceAdjustmentDataService.getReadOnlyURBFiledName(adjustmentTotalEntity.entity) : null;
			};

			service.hasUpdatePermission = function hasUpdatePermission() {
				return estimateMainPriceAdjustmentDataService.hasUpdatePermission();
			};

			service.hasReadOnlyAdjustment = function() {
				return estimateMainPriceAdjustmentDataService.hasReadOnlyItem(adjustmentTotalEntity.entity) || service.isReadOnlyAdjustment();
			};

			service.hasSpecialReadOnlyAdjustment = function() {
				return estimateMainPriceAdjustmentDataService.hasSpecialReadOnly(adjustmentTotalEntity.entity);
			};

			service.canEditWqTenderPrice = function() {
				if (adjustmentTotalEntity && adjustmentTotalEntity.entity && (!estimateMainPriceAdjustmentDataService.hasReadOnly() || boqMainCommonService.isDivisionOrRoot(adjustmentTotalEntity.entity))) {
					return true;
				}
				return false;
			};

			service.doPrepareUpdateCall = function doPrepareUpdateCall(dataToUpdate) {
				if (Object.hasOwnProperty.call(dataToUpdate, 'EstimatePriceAdjustmentTotalToSave')) {
					if (dataToUpdate.EstimatePriceAdjustmentToSave && dataToUpdate.EstimatePriceAdjustmentToSave.length > 0) {
						let entity = _.find(dataToUpdate.EstimatePriceAdjustmentToSave, {Id: adjustmentTotalEntity.Id});
						if (entity) {
							_.extend(entity, adjustmentTotalEntity.entity);
						} else {
							dataToUpdate.EstimatePriceAdjustmentToSave.push(adjustmentTotalEntity.entity);
						}
					} else {
						dataToUpdate.EstimatePriceAdjustmentToSave = [adjustmentTotalEntity.entity];
					}
					delete dataToUpdate.EstimatePriceAdjustmentTotalToSave;
				}
			};

			return service;
		}]);
})();
