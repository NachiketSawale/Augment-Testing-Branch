/**
 * Created by anl on 3/30/2017.
 */
(function (angular) {
	'use strict';
	/* global _ */
	var moduleName = 'productionplanning.common';
	/**
	 * @ngdoc service
	 * @name productionplanningCommonProductProcessor
	 * @function
	 * @requires
	 *
	 * @description
	 * productionplanningCommonProductProcessor is the service to process data in main entity
	 *
	 */
	angular.module(moduleName).factory('productionplanningCommonProductProcessor', ProductionplanningCommonProductProcessor);

	ProductionplanningCommonProductProcessor.$inject = ['platformRuntimeDataService', 'ppsEntityConstant', 'ppsCommonCustomColumnsServiceFactory',
		'ppsCommonTransportInfoHelperService', 'productionplanningCommonProductStatusLookupService', 'modelWdeViewerMarkupService'];

	function ProductionplanningCommonProductProcessor(platformRuntimeDataService, ppsEntityConstant, customColumnsServiceFactory,
		ppsCommonTransportInfoHelperService, productionplanningCommonProductStatusLookupService, modelWdeViewerMarkupService) {
		var service = {};

		service.processItem = function processItem(item, config) {
			service.processItemSvg(item);

			if (config.parentService) {
				if (config.parentService.getServiceName() === 'productionplanningProductionsetMainService') {
					//set row readonly
					_.each(item, function (value, key) {
						service.setColumnReadOnly(item, key, true);
					});
				} else if (config.parentService.getServiceName() === 'transportplanningBundleMainService') {
					var bundleItem = config.parentService.getSelected();
					if (!config.parentService.isBundleModifyable(bundleItem)) {
						_.each(item, function (value, key) {
							service.setColumnReadOnly(item, key, true);
						});
					} else {
						trsReqColumnReadOnly(item);
					}
				}
			} else {
				service.setColumnReadOnly(item, 'IsLive', true);
				service.setColumnReadOnly(item, 'ProductionSetFk', true);
				trsReqColumnReadOnly(item);
			}
			service.setColumnReadOnly(item, 'TrsProductBundleFk', true);

			var customColumnsService = customColumnsServiceFactory.getService('productionplanning.common.product');
			customColumnsService.updateDateTimeFields(item);

			if (_.isArray(item.ReadonlyCustomColumns)) {
				_.each(item.ReadonlyCustomColumns, function (column) {
					service.setColumnReadOnly(item, column, true);
				});
			}

			item.entityType = 'pps_product'; // add a flag to identify

			service.processProdPlaceFk(item);

			service.processReadonlyOfFabricationUnitDateSlotColumnsThatValueIsEmpty(item);

			service.processAnnotationSatus(item);
		};

		service.processReadonlyOfFabricationUnitDateSlotColumnsThatValueIsEmpty = (item) => {
			let customColumnsService = customColumnsServiceFactory.getService('productionplanning.common.product');
			let fabUnitEventTypeDateSlots = customColumnsService.eventTypeSlots.filter(e => e.PpsEntityFk === ppsEntityConstant.PPSProduct && e.PpsEntityRefFk === ppsEntityConstant.FabricationUnit && !e.IsReadOnly);
			for (let slot of fabUnitEventTypeDateSlots) {
				if (_.isNil(item[slot.FieldName])) {
					service.setColumnReadOnly(item, slot.FieldName, true);
				}
			}
		};

		service.processProdPlaceFk = function (item) {
			let isProductionPlaceReadonly = item.IsGettingProdPlaceByNesting || !item.HasProcessConfiguredForProdPlaceAssignment;
			service.setColumnReadOnly(item, 'ProdPlaceFk', isProductionPlaceReadonly);
		};

		service.processItemSvg = function (item) {
			var statusList = productionplanningCommonProductStatusLookupService.getList();
			var status = _.find(statusList, { Id: item.ProductStatusFk });
			if (status && status.BackgroundColor) {
				item.BackgroundColor = status.BackgroundColor;
			}
		};

		service.processReadonlyInPUModule = function (item, data) {
			service.setColumnReadOnly(item, 'ProductionSetFk', true);
			const parentServ = data.getService().parentService();
			if (parentServ && (parentServ.getServiceName() === 'productionplanningItemDataService' || config.parentService.getServiceName() === 'productionplanningItemSubItemDataService')) {
				const selectedPU = parentServ.getSelected();
				const isAlsoLinkedToAStockPuAndCurrentSelectedPuIsStockPu = item.ItemFk !== item.PpsItemStockFk && selectedPU && selectedPU.Id === item.PpsItemStockFk;
				if (isAlsoLinkedToAStockPuAndCurrentSelectedPuIsStockPu) {
					platformRuntimeDataService.readonly(item, true);
				}

				if(selectedPU?.IsForPreliminary === true){
					platformRuntimeDataService.readonly(item, true);
				}
			}
		};

		function trsReqColumnReadOnly(item) {
			if (item.TrsProductBundleFk || ppsCommonTransportInfoHelperService.isTrsRequisitionAccepted(item)) {
				service.setColumnReadOnly(item, 'TrsRequisitionFk', true);
				service.setColumnReadOnly(item, 'TrsRequisitionDate', true);
			} else {
				service.setColumnReadOnly(item, 'TrsRequisitionDate', ppsCommonTransportInfoHelperService.trsReqLinkOthers(item));
			}
		}

		service.setColumnReadOnly = function setColumnReadOnly(item, column, flag) {
			var fields = [
				{ field: column, readonly: flag }
			];
			platformRuntimeDataService.readonly(item, fields);
		};

		service.processAnnotationSatus = function (item){
			if(item.AnnoStatusInfos !== null){
				if(modelWdeViewerMarkupService  && modelWdeViewerMarkupService.currentPreviewDataService && modelWdeViewerMarkupService.currentPreviewDataService.getSelected()){
					var currentDocId = modelWdeViewerMarkupService.currentPreviewDataService.getSelected().FileArchiveDocFk;
					var findCurrentDoc = _.find(item.AnnoStatusInfos, function (info){
						return info.DocId === currentDocId
					});
					if(findCurrentDoc){
						item.LinkProductIcon = item.AnnoStatusInfos.length === 1? 'Linked_Current' : 'Linked_Cross';
					} else {
						item.LinkProductIcon = 'Linked_Other';
					}
				} else {
					item.LinkProductIcon = 'Linked_Cross';
				}
			}
		}

		return service;
	}

})(angular);