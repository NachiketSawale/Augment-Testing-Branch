/**
 * Created by sus on 2015/7/21.
 */
(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular */
	var moduleName = 'procurement.pes';
	angular.module(moduleName).factory('procurementPesEnhanceBoqMainService',
		['_', 'platformDataServiceModificationTrackingExtension', 'platformModuleStateService', 'prcCommonBoqMainReadonlyProcessor', 'platformDataServiceDataProcessorExtension',
			function (_, platformDataServiceModificationTrackingExtension, platformModuleStateService, prcCommonBoqMainReadonlyProcessor, platformDataServiceDataProcessorExtension) {

				return function enhanceBoqMainService(parentService, boqMainService, boqMaindata) {

					// Comment BH:
					// In prcBoqMainService we had to do some adjustments to get the structure of the complete entity of the client side in sync with the
					// complete entity on the server side. This is caused by the procurement server side logic not always following the rules of the creation of
					// the complete entity given by the platformDataServiceFactory. Here in Pes the creation rules of the complete entity follow the rules
					// and so we switch back to the standard implementation by overriding the prcBoqMain implementation

					// TODO chi: strange: what's the relationship between pes boq and boq text complement
					boqMainService.assertTypeEntries = function (modStorage) {

						// peters hack
						if (!modStorage.BoqItemToSave) {
							modStorage.BoqItemToSave = [];
						}

						return modStorage;
					};

					boqMainService.assertSelectedEntityEntry = function doAssertSelectedPrcBoqMainEntityEntry(modStorage) {
						// -> back standard implementation
						return platformDataServiceModificationTrackingExtension.assertSelectedNodeEntityEntry(modStorage, boqMainService, boqMaindata);
					};

					boqMainService.addEntityToModified = function doAddPrcBoqMainEntityToModified(elemState, entity, modState) {
						// -> back standard implementation
						platformDataServiceModificationTrackingExtension.addNodeEntityToModified(elemState, entity, boqMaindata, modState);
						prcCommonBoqMainReadonlyProcessor.processItem(entity, boqMainService);
					};

					boqMainService.addEntityToDeleted = function doAddPrcBoqMainEntityToModified(elemState, entity, data, modState) {
						// -> back standard implementation
						platformDataServiceModificationTrackingExtension.addNodeEntityToDeleted(elemState, entity, boqMaindata, modState);
					};

					boqMainService.addEntitiesToDeleted = function doAddPrcBoqMainEntitiesToDeleted(elemState, entities, data, modState) {
						// -> back standard implementation
						platformDataServiceModificationTrackingExtension.addLeafEntitiesToDeleted(elemState, entities, boqMaindata, modState);
					};

					var setSpecificationAsModified = boqMainService.setSpecificationAsModified;
					boqMainService.setSpecificationAsModified = function (specification) {
						var selected = boqMainService.getSelected();
						if (!selected) {
							return;
						}
						setSpecificationAsModified(specification);
						boqMainService.markItemAsModified(boqMainService.getSelected());
					};

					var mergeInUpdateDataBack = boqMainService.mergeInUpdateData;
					boqMainService.mergeInUpdateData = function (updateData) {
						mergeInUpdateDataBack(updateData);
						var serviceData = boqMainService.getServiceContainer().data;
						_.forEach(updateData[boqMaindata.itemName + 'ToSave'], function (boqItem) {
							boqMainService.syncItemsAfterUpdate(boqItem);
							if (boqItem.BoqItem) {
								var oldItem = boqMainService.findItemToMerge(boqItem.BoqItem);
								platformDataServiceDataProcessorExtension.doProcessItem(oldItem, serviceData);
								prcCommonBoqMainReadonlyProcessor.processItem(oldItem, boqMainService);
							}
						});
						boqMainService.gridRefresh();
					};

					boqMaindata.doClearModifications = function doClearModificationsInNode(entity, data) {
						var modState = platformModuleStateService.state(boqMainService.getModule());
						var parentState = platformDataServiceModificationTrackingExtension.tryGetPath(modState.modifications, boqMainService.parentService());

						if (parentState && entity && entity.length > 0 && parentState[data.itemName + 'ToSave']) {
							entity = entity[0];
							if (_.find(parentState[data.itemName + 'ToSave'], {MainItemId: entity.Id})) {
								parentState[data.itemName + 'ToSave'] = _.filter(parentState[data.itemName + 'ToSave'], function (item) {
									return item.MainItemId !== entity.Id;
								});
								modState.modifications.EntitiesCount -= 1;
							}
						}
					};

					boqMainService.registerItemModified(function(e, args) {
						if (args.BoqLineTypeFk === 103) {
							var selected = parentService.getSelected();
							if (selected) {
								selected.BoqRootItem = args;
								parentService.reSetVatFinalpriceFinalgross(selected);
								parentService.gridRefresh();
							}
						}
					});

					// update done
					// parentService.registerItemModified(reLoad);
					parentService.registerSelectionChanged(reLoad);
					// noinspection JSUnusedLocalSymbols
					function reLoad(e, item) {
						const selectedBoq = boqMainService.getSelected();
						if(Object.keys(selectedBoq)>0){
							boqMainService.deselect();
						}
						if(_.isFunction(boqMaindata.doClearModificationsForItemFromCache)){
							boqMaindata.doClearModificationsForItemFromCache(item && item.Id, boqMaindata);
						}
						if (parentService.getSelected()) {
							item = item || parentService.getSelected();
							if (item && (item.BoqHeaderFk || item.BoqHeaderFk === 0)) {
								boqMainService.setFilter('?mainItemId=' + item.BoqHeaderFk);
								item.isPes = true;
								boqMainService.reloadBasedOnNewRoot(item);
								let data =parentService.parentService().getSelected();
								if(data) {
									if(!_.isNil(data.ProjectFk)){
										boqMainService.setSelectedProjectId(data.ProjectFk);
									}
									boqMainService.setCallingContext({PrcPesHeader: data});
									boqMainService.setCurrentExchangeRate(data.ExchangeRate);
								}



							}
						}
					}
				};
			}
		]);

})(angular);