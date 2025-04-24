/**
 * Created by zwz on 2021/12/24.
 */

(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.item';
	var angModule = angular.module(moduleName);

	/**
	 * @ngdoc service
	 * @name productionplanningItemDataServiceUpdateDoneExtension
	 * @function
	 * @requires _
	 * @description
	 * productionplanningItemDataServiceUpdateDoneExtension provides functions for refreshing data when updatedone
	 */
	angModule.service('productionplanningItemDataServiceUpdateDoneExtension', Extension);
	Extension.$inject = ['_', '$http', '$injector', '$translate', 'globals', 'ppsUIUtilService', 'ppsCommonHierarchyCollectionUtilService', 'platformDialogService'];

	function Extension(_, $http, $injector, $translate, globals, ppsUIUtilService, hierarchyCollectionUtilService, platformDialogService) {
		this.addMethods = function (data, service) {
			function getProjectDocumentDataService() {
				var documentConfig = $injector.get('documentsProjectDocumentModuleContext').getConfig();
				return $injector.get('documentsProjectDocumentDataService').getService(documentConfig);
			}

			data.rootOptions.handleUpdateDone = function handleUpdateDone(updateData, response, data) {
				// process JobBundleToSave (DEV-39402)
				if (response?.JobBundleToSave?.length > 0) {
					_.forEach(response.JobBundleToSave, function (bundleCompleteDto) {
						bundleCompleteDto.JobBundle = bundleCompleteDto.Bundle;
					});
				}

				// when we "override" method handleUpdateDone(), here we should also call method handleOnUpdateSucceeded() to refresh data in the UI according to response data.
				data.handleOnUpdateSucceeded(updateData, response, data, true);
				data.updateDone.fire(updateData);
				let installSequenceChanged = _.some(updateData.ProductToSave, function (product){
					return _.get(product, 'Product.UpdateInstallSequence') === true;
				});
				const needToRefreshAssignedQtyOfSelectedPU = (Array.isArray(updateData.ProductToSave) && updateData.ProductToSave.length > 0 && !installSequenceChanged)
					|| (Array.isArray(updateData.ProductToDelete) && updateData.ProductToDelete.length > 0);
				if (needToRefreshAssignedQtyOfSelectedPU) {
					service.reloadItems([service.getSelected()]);
				}
				else if ((response && response.PPSItemClerkToDelete && response.PPSItemClerkToDelete.length > 0) ||
					(response && response.PPSItemClerkToSave && response.PPSItemClerkToSave.length > 0)) {
					var bDelete = response.PPSItemClerkToDelete && response.PPSItemClerkToDelete.length > 0 ? true : false;
					service.syncDynamicColumns(response.MainItemId, bDelete);
				} else if (response && (response.PpsUpstreamItemToSave && response.PpsUpstreamItemToSave.length > 0) ||
											(response.PpsUpstreamItemToDelete && response.PpsUpstreamItemToDelete.length > 0)) {
					// Reload upstream state of PU
					let selectedItem = service.getSelected();
					service.setSelected(null);
					service.load().then(() => {
						service.setSelected(selectedItem);
					});
				}  else if (!_.isNil(response.DailyProductionToSave)) {
					var utilSrv = $injector.get('transportplanningTransportUtilService');
					if (utilSrv.hasShowContainer('productionplanning.item.dailyProductionList')) {
						$injector.get('productionplanningItemDailyProductionDataService').load();
					}
				}
				else {
					refreshSubServiceIfNeed();
				}
				if (response.ReloadProjectDocumentContainer) {
					ppsUIUtilService.reloadService(getProjectDocumentDataService(), 'productionplanning.item.project.main.documents.project.document.grid');
				}
				if(response && (response.EventToSave && response.EventToSave.length > 0)){
					// Reload daily productionupdate
					let dailyProductionSrv = $injector.get('productionplanningItemDailyProductionDataService');
					if(dailyProductionSrv !== null) {
						dailyProductionSrv.load();
					}
				}

				if(response && (response.CommonBizPartnerToSave && response.CommonBizPartnerToSave.length > 0)) {
					let factory = $injector.get('ppsCommonBizPartnerContactServiceFactory');
					let service = factory.getService({serviceKey: 'productionplanning.item.bizpartnercontact'});
					service.load();
				}

				if (service.subItemDescriptionCodeChanged && response.ProductTemplateToSave && response.ProductTemplateToSave.length > 0) {
					service.setSubItemDescriptionCodeChanged(false);
				}

				if (service.siteChanged) {
					/*
					let subItemService = $injector.get('productionplanningItemSubItemDataService');
					service.load().then(() => {
						let itemList = service.getList();
						let selectedItem = itemList.find(item => item.Id === response.MainItemId);
						service.refresh().then(()=>{
							service.setSelected(selectedItem);
							subItemService.load();
						});
					});
					*/
					let mappingItems = service.getList().filter(e => updateData.PPSItem.some(d => d.Id === e.Id));
					service.reloadItems(hierarchyCollectionUtilService.flatten(mappingItems, 'ChildItems'));
					service.siteChanged = false;
				}

				if(installSequenceChanged){
					let sequenceData = [];
					_.forEach(updateData.ProductToSave, function (product){
						if(_.get(product, 'Product.UpdateInstallSequence') === true){
							sequenceData.push(product.Product);
						}
					});
					$injector.get('ppsCommonDocumentAnnotationExtension').synInstallSequenceData(sequenceData);
				}

				service.updateHaveApplyFilterContainers();
				refreshProdDescCharacteristicContainer(service, response);
				refreshProductDescriptionLookUp(response);
				$injector.get('productionplanningItemProductLookupDataService').updateDataAfterAssignDone(response);

				service.clerkChanged = false;

				showWarningMsgIfNoStockForUpstreamRequirements(updateData, response);

			};


			function showWarningMsgIfNoStockForUpstreamRequirements(updateData, response) {
				if (!response.PpsUpstreamItemToSave) {
					return;
				}

				let msg = '';

				for (const item of response.PpsUpstreamItemToSave) {
					if (!item.PpsUpstreamItem) {
						continue;
					}

					const message = item.PpsUpstreamItem.StockReservationMessage;
					if (message && message.length > 0) {
						msg += message + '<br>';
					}
				}

				if (msg.length > 0) {
					platformDialogService.showInfoBox(msg);
				}
			}

			function refreshSubServiceIfNeed() {
				var subServiceNames = ['productionplanningItemClerkDataService',
					'productionplanningItemBundleDataService',
					'productionplanningCommonProductItemDataService'
				];
				_.forEach(data.childServices, function (subService) {
					if (subService && _.isFunction(subService.getServiceName)
						&& subServiceNames.some(function (name) {
							return name === subService.getServiceName();
						})) {
						subService.loadSubItemList();
					}
				});
				// for case about reassigning bundle/product to (selected)PU, we need to refresh data of subcontainer bundles/products list container after saving.(by zwz on 2021/07/01 for HPQC #121342)

				service.refreshItemLogs();
			}

			service.refreshItemLogs = function refreshItemLogs() {
				var utilSrv = $injector.get('transportplanningTransportUtilService');
				// refresh log-list
				if (utilSrv.hasShowContainerInFront('productionplanning.item.Log.list')) {
					var logListDataSrv = $injector.get('ppsCommonLogSourceDataServiceFactory').createDataService('productionplanning.item', { dto: 'PpsLogReportVDto' }); // before this moment, data service has created, just get it
					logListDataSrv.load();
				}
				// refresh log-pinboard
				if (utilSrv.hasShowContainerInFront('productionplanning.item.Log.pinboard')) {
					var logPinboardSrv = $injector.get('basicsCommonCommentDataServiceFactory').get('productionplanning.item.manuallog', service.getServiceName());
					logPinboardSrv.load();
				}
			};

			service.syncDynamicColumns = function syncDynamicColumns(ppsItemId, bDelete) {
				const subItemService = $injector.get('productionplanningItemSubItemDataService');
				refreshSubServiceIfNeed();
				var oldItem = _.find(data.itemList, { Id: ppsItemId });
				if (oldItem) {
					var isDelete = bDelete ? true : false;
					$http.get(globals.webApiBaseUrl + 'productionplanning/item/syncppsitem?ppsItemId=' + ppsItemId + '&bDelete=' + isDelete).then(function (response) {
						if (response.data !== null) {
							_.each(response.data, function (newItem) {
								var oldItem = _.find(data.itemList, { 'Id': newItem.Id });
								if (!_.isNil(oldItem)) {
									data.mergeItemAfterSuccessfullUpdate(oldItem, newItem, true, data);
								}
							});

							service.gridRefresh();
							subItemService.gridRefresh();
						}
					});
				}
			};

			function refreshProdDescCharacteristicContainer(service, response) {
				if (!response.PPSItem || response.PPSItem.length <= 0) {
					return;
				}

				const utilSrv = $injector.get('transportplanningTransportUtilService');
				const characteristicDataGroupServiceFactory = $injector.get('basicsCharacteristicDataGroupServiceFactory');
				const characteristicColumnServiceFactory = $injector.get('basicsCharacteristicDataServiceFactory');
				const selected = service.getSelected();
				const contextId = selected.ProductDescriptionFk || -1;

				if (utilSrv.hasShowContainerInFront('productionplanning.item.producttemplate.characteristic')) {
					characteristicDataGroupServiceFactory.getService(61, service).loadData(contextId, '');
					characteristicColumnServiceFactory.getService(service, 61).load();
				}
				if (utilSrv.hasShowContainerInFront('productionplanning.item.producttemplate.characteristic2')) {
					characteristicDataGroupServiceFactory.getService(62, service).loadData(contextId, '');
					characteristicColumnServiceFactory.getService(service, 62).load();
				}
			}

			function refreshProductDescriptionLookUp(response) {
				const lookupDescriptorService = $injector.get('basicsLookupdataLookupDescriptorService');
				const cloudCommonGridService = $injector.get('cloudCommonGridService');
				const subItemService = $injector.get('productionplanningItemSubItemDataService');
				const lookUpType = 'PPSProductDescription';
				const lookUpType2 = 'PPSProductDescriptionTiny';
				const modifiedLookUpItems = [];

				if (response && Array.isArray(response.PPSItem)) {
					const flatItems = cloudCommonGridService.flatten(response.PPSItem, [], 'ChildItems');
					flatItems.forEach(item => {
						modifiedLookUpItems.push(getModifiedLookUpItem(item.ProductDescriptionFk, item.ProductDescriptionCode));
					});
				} else if (response && Array.isArray(response.ProductTemplateToSave)) {
					const template = response.ProductTemplateToSave[0]; // detail only has one record.
					service.getSelected().ProductDescriptionCode = template.Code;
					modifiedLookUpItems.push(getModifiedLookUpItem(template.Id, template.Code));
				}

				if (modifiedLookUpItems.length > 0) {
					lookupDescriptorService.updateData(lookUpType, modifiedLookUpItems);
					service.gridRefresh();
					subItemService.gridRefresh();
				}

				function getModifiedLookUpItem(id, code) {
					const lookupItem2 = lookupDescriptorService.getLookupItem(lookUpType2, id);
					const lookupItem = lookupDescriptorService.getLookupItem(lookUpType, id) || {};
					if (lookupItem2){
						lookupItem2.Code = code;
						lookupDescriptorService.updateData(lookUpType2, lookupItem2);
					}
					if (lookupItem && lookupItem.Code !== code) {
						lookupItem.Code = code;
					}
					return lookupItem;
				}
			}
		};
	}
})(angular);
