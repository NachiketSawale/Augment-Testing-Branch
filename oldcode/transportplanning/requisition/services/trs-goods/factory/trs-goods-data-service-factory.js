/**
 * Created by anl on 4/29/2020.
 */

// eslint-disable-next-line no-redeclare
/* global angular, _, globals */
// eslint-disable-next-line func-names
(function (angular) {
	'use strict';

	var moduleName = 'transportplanning.requisition';

	angular.module(moduleName).service('transportplanningRequisitionTrsGoodDataServiceFactory', TrsGoodDataServiceFactory);

	TrsGoodDataServiceFactory.$inject = [
		'_',
		'$q',
		'$http',
		'$injector',
		'platformDataServiceFactory', 'basicsCommonMandatoryProcessor',
		'transportplanningRequisitionTrsGoodValidationFactory',
		'transportplanningRequisitionTrsGoodsDataProcessor',
		'basicsCommonBaseDataServiceReferenceActionExtension',
		'basicsLookupdataLookupDescriptorService',
		'trsGoodsTypes',
		'upstreamGoodsTypes',
		'platformRuntimeDataService',
		'transportplanningRequisitionTrsGoodsDocumentService',
		'transportplanningBundleGoodsSynchronizeFactory',
		'platformDataServiceProcessDatesBySchemeExtension',
		'platformModalService',
		'$translate',
		'ppsVirtualDataServiceFactory',
		'$rootScope',
	'platformModuleStateService'];


	function TrsGoodDataServiceFactory(
		_,
		$q,
		$http,
		$injector,
		platformDataServiceFactory, basicsCommonMandatoryProcessor,
		trsGoodValidationFactory,
		trsGoodsDataProcessor,
		referenceActionExtension,
		basicsLookupdataLookupDescriptorService,
		trsGoodsTypes,
		upstreamGoodsTypes,
		platformRuntimeDataService,
		trsGoodsDocumentPreviewService,
		bundleGoodsSynchronizeFactory,
		platformDataServiceProcessDatesBySchemeExtension,
		platformModalService,
		$translate,
		virtualDataServiceFactory,
		$rootScope,
		platformModuleStateService) {

		var serviceCache = {};
		var self = this;

		// get service or create service by data-service name
		this.getService = function getService(options) {
			var dsName = options.parentService.getServiceName() + 'TrsGoodDataService';
			var srv = serviceCache[dsName];
			if (_.isNull(srv) || _.isUndefined(srv)) {
				options.serviceName = dsName;
				srv = self.doCreateDataService(options);
				serviceCache[dsName] = srv;
			}
			return srv;
		};

		this.doCreateDataService = function doCreateDataService(options) {

			var serviceInfo = {
				flatLeafItem: {
					module: angular.module(options.moduleName),
					serviceName: options.serviceName,
					entityNameTranslationID: 'transportplanning.requisition.trsGoods.entity',
					httpCRUD: {
						route: globals.webApiBaseUrl + 'transportplanning/requisition/trsgoods/',
						endRead: 'listForTrsRequisition'
					},
					entityRole: {
						leaf: {
							itemName: 'TrsGoods',
							parentService: options.parentService,
							parentFilter: 'TrsRequisitionId'
						}
					},
					dataProcessor: [trsGoodsDataProcessor,
						platformDataServiceProcessDatesBySchemeExtension.createProcessor({
							typeName: 'TrsGoodsDto',
							moduleSubModule: 'TransportPlanning.Requisition'
						})],
					presenter: {
						list: {
							initCreationData: function (creationData) {
								creationData.PKey1 = options.parentService.getSelected().Id;
							},
							incorporateDataRead: function (readData, data) {
								if (readData && readData.Main) {
									basicsLookupdataLookupDescriptorService.attachData(readData);
									readData = readData.Main;
								}
								return data.handleReadSucceeded(readData, data);
							}
						}
					},
					actions: {
						create: 'flat',
						delete: true,
						canCreateCallBackFunc: function () {
							return !options.parentService.isSelectedItemAccepted();
						},
						canDeleteCallBackFunc: function () {
							return !options.parentService.isSelectedItemAccepted();
						}
					}
				}
			};

			if (options.identification === 'forPPSItem') {
				serviceInfo.flatLeafItem.httpCRUD.endRead = 'listbyitemfk';
				serviceInfo.flatLeafItem.entityRole.leaf.parentFilter = 'ppsItemId';
				serviceInfo.flatLeafItem.actions = {};
			}

			/* jshint -W003 */
			var container = platformDataServiceFactory.createNewComplete(serviceInfo);

			var service = container.service;
			service.additionalUIConfigs = options.additionalUIConfigs;
			container.data.newEntityValidator = basicsCommonMandatoryProcessor.create({
				typeName: 'TrsGoodsDto',
				moduleSubModule: 'TransportPlanning.Requisition',
				validationService: trsGoodValidationFactory.getService(container.service),
				mustValidateFields: ['Good']
			});

			service.getDefaultFilter = function getDefaultFilter(entity) {
				var selected = service.getSelected();
				var sOptions = this;
				var selectedReqEntity = options.parentService.getSelected();
				switch (sOptions.lookupType) {
					case 'CommonProduct':
						entity.ProjectId = selectedReqEntity.ProjectFk;
						entity.JobId = selectedReqEntity.LgmJobFk;
						entity.notAssignedFlags = {
							notAssignedToPkg: true,
							notAssignedToReq: true,
							notShipped: true
						};
						var readOnlyRows = ['ProjectId', 'JobId'];
						angular.forEach(sOptions.detailConfig.rows, function (row) {
							if (_.includes(readOnlyRows, row.model)) {
								row.readonly = entity[row.model];
							}
						});
						// set this for further filters
						selected.TrsReqEntity = selectedReqEntity;
						break;
					case 'TrsBundleLookup':
						entity.projectId = selectedReqEntity.ProjectFk;
						entity.siteId = selectedReqEntity.SiteFk;
						entity.notAssignedFlags = {
							notAssignedToPkg: true,
							notAssignedToReq: true,
							notShipped: true
						};
						entity.EarliestStart = selectedReqEntity.PlannedStart;
						entity.LatestFinish = selectedReqEntity.PlannedFinish;

						entity.jobId = selectedReqEntity.LgmJobFk;
						var readOnlyRows = ['projectId', 'jobId'];
						angular.forEach(sOptions.detailConfig.rows, function (row) {
							if (_.includes(readOnlyRows, row.model)) {
								row.readonly = entity[row.model];
							}
						});
						// set this for further filters
						selected.addMoreFilterFn = function (request) {
							request.EarliestStart = selectedReqEntity.PlannedStart;
							request.LatestFinish = selectedReqEntity.PlannedFinish;
							let ignoredIds = _.map(_.filter(service.getList(), function (item) {
								return !_.isNull(item.Good) & item.TrsGoodsTypeFk === 3;
							}), 'Good');
							if(ignoredIds.length > 0){
								request.FurtherFilters.push({
									Token: 'IgnoredIds',
									Value: ignoredIds.join(',')
								});
							}
						};
						break;
					case 'ResourceMasterResource':
						entity.siteFk = selectedReqEntity.SiteFk;
						break;
				}
			};

			service.onPropertyChanged = function onPropertyChanged(entity, field) {
				switch (field) {
					case 'TrsGoodsTypeFk':
						entity.Good = null;
						entity.UomFk = null;
						entity.Weight = null;
						entity.BasUomWeightFk = null;
						entity.Length = null;
						entity.BasUomLengthFk = null;
						entity.Width = null;
						entity.BasUomWidthFk = null;
						entity.Height = null;
						entity.BasUomHeightFk = null;
						entity.MinProductStatus = null;
						entity.MaxProductStatus = null;
						entity.ProductsDimensionInfo = null;
						entity.ProductsDescription = null;
						entity.BasDangerclassFk = null;
						entity.DangerQuantity = null;
						entity.BasUomDGFk = null;
						var trsGoodsValidationService = trsGoodValidationFactory.getService(container.service);
						var ret = trsGoodsValidationService.validateGood(entity, entity.Good, 'Good');
						platformRuntimeDataService.applyValidationResult(ret, entity, 'Good');
						trsGoodsDataProcessor.processItem(entity);
						break;
					case 'Good':
						var lookupInfo = trsGoodsTypes.lookupInfo[entity.TrsGoodsTypeFk];
						if (lookupInfo) {
							if (entity.selectedGood) {
								entity.UomFk = _.get(entity.selectedGood, lookupInfo.uomFkPropertyName, entity.UomFk);
								entity.Weight = _.get(entity.selectedGood, lookupInfo.weightPropertyName, entity.Weight);
								entity.BasUomWeightFk = _.get(entity.selectedGood, lookupInfo.weightUomPropertyName, entity.BasUomWeightFk);
								entity.Length = _.get(entity.selectedGood, lookupInfo.lengthPropertyName, entity.Length);
								entity.BasUomLengthFk = _.get(entity.selectedGood, lookupInfo.lengthUomPropertyName, entity.BasUomLengthFk);
								entity.Width = _.get(entity.selectedGood, lookupInfo.widthPropertyName, entity.Width);
								entity.BasUomWidthFk = _.get(entity.selectedGood, lookupInfo.widthUomPropertyName, entity.BasUomWidthFk);
								entity.Height = _.get(entity.selectedGood, lookupInfo.heightPropertyName, entity.Height);
								entity.BasUomHeightFk = _.get(entity.selectedGood, lookupInfo.heightUomPropertyName, entity.heightUomPropertyName);
								entity.MinProductStatus = _.get(entity.selectedGood, lookupInfo.minProductStatusPropertyName);
								entity.MaxProductStatus = _.get(entity.selectedGood, lookupInfo.maxProductStatusPropertyName);
								entity.ProductsDescription = _.get(entity.selectedGood, lookupInfo.productsDescriptionPropertyName);
								entity.ProductsDimensionInfo = {
									ProductsMaxLength: _.get(entity.selectedGood, lookupInfo.productsMaxLengthPropertyName),
									ProductsMaxWidth: _.get(entity.selectedGood, lookupInfo.productsMaxWidthPropertyName),
									ProductsAreaSum: _.get(entity.selectedGood, lookupInfo.productsAreaSumPropertyName),
									ProductsHeightSum: _.get(entity.selectedGood, lookupInfo.productsHeightSumPropertyName),
									ProductsWeightSum: _.get(entity.selectedGood, lookupInfo.productsWeightSumPropertyName),
									ProductsActualWeightSum: _.get(entity.selectedGood, lookupInfo.productsActualWeightSumPropertyName)
								};
								entity.PrjStockFk = _.get(entity.selectedGood, lookupInfo.prjStockPropertyName);
								entity.PrjStockLocationFk = _.get(entity.selectedGood, lookupInfo.prjStockLocationPropertyName);
								entity.ProductTemplateCodes = _.get(entity.selectedGood, lookupInfo.productTemplateCodesPropertyName);
								entity.ProductTemplateDescriptions = _.get(entity.selectedGood, lookupInfo.productTemplateDescriptionsPropertyName);
								entity.MinProductionDate = _.get(entity.selectedGood, lookupInfo.minProductionDatePropertyName);
								entity.MaxProductionDate = _.get(entity.selectedGood, lookupInfo.maxProductionDatePropertyName);
								if(entity.TrsGoodsTypeFk === trsGoodsTypes.Plant){
									entity.BasDangerclassFk = _.get(entity.selectedGood, lookupInfo.dangerClassPropertyName);
									entity.DangerQuantity = _.get(entity.selectedGood, lookupInfo.dangerQuantityPropertyName);
									entity.BasUomDGFk = _.get(entity.selectedGood, lookupInfo.dangerUomProperty);
								}
							}
							if (lookupInfo.processFn) {
								lookupInfo.processFn(entity);
							}
						}
						trsGoodsDataProcessor.processItem(entity);
						break;
					case 'TrsPlannedStart':
						// delete the same one
						var belongs = _.filter(service.getList(), function (item) {
							if (item !== entity && item.TrsRequisitionFk === entity.TrsRequisitionFk && !_.get(item.Modification, 'IsCreated')) {
								return true;
							}
						});
						if (belongs.length > 0) {
							var modState = $injector.get('platformModuleStateService').state(service.getModule());
							var userDialog = platformModalService.showYesNoDialog('transportplanning.requisition.trsGoods.dialogBody', 'transportplanning.requisition.trsGoods.dialogTitle');
							modState.validation.asyncCalls.push({myPromise: userDialog});
							userDialog.then(function (result) {
								if (result.yes) {
									var refresh = false;
									_.forEach(belongs, function (item) {
										item.TrsPlannedStart = entity.TrsPlannedStart;
										delete item.Modification;
										refresh = true;
									});
									entity.Modification = {TrsReqDate: entity.TrsPlannedStart};
								} else if (result.no) {
									entity.Modification = {
										TrsReqDate: entity.TrsPlannedStart,
										IsCreated: true
									};
									entity.TrsCode = $translate.instant('cloud.common.isGenerated');
									refresh = true;
								}
								_.remove(modState.validation.asyncCalls, {myPromise: userDialog});
								if (refresh) {
									service.gridRefresh();
								}
							}, function (reject) {
								// no idea how to revert the value
							});
						} else {
							entity.Modification = {TrsReqDate: entity.TrsPlannedStart};
						}
						break;
				}
				service.markItemAsModified(entity);
			};

			var documentService = trsGoodsDocumentPreviewService.getTrsGoodsDocumentDataService(options.parentService);

			service.createPreviewButtons = function createPreviewButtons($scope) {
				return trsGoodsDocumentPreviewService.getPreviewButtons(service, $scope, documentService);
			};

			function setDocuments() {
				documentService.setDocuments(service.getList());
			}

			service.registerListLoaded(setDocuments);

			if (service.registerEntityDeleted) {
				service.registerEntityDeleted(synDeletedGoodWithBundle);
			}

			function synDeletedGoodWithBundle(e, entities) {
				var bundleGoodSynchronizeService = bundleGoodsSynchronizeFactory.getService(options.moduleName);
				bundleGoodSynchronizeService.synDeletedGood(entities);
			}

			if (service.registerEntityDeleted) {
				service.registerEntityDeleted(synDeletedGoodWithToBeAssigned);
			}

			function synDeletedGoodWithToBeAssigned(e, entities) {
				const utilSrv = $injector.get('transportplanningTransportUtilService');
				if (utilSrv.hasShowContainerInFront('transportplanning.requisition.toBeAssigned.list.grid')) {
					$injector.get('transportplanningRequisitionToBeAssignedDataService').getService(false).synDeletedGood(entities);
				}
				if (utilSrv.hasShowContainerInFront('transportplanning.requisition.toBeAssigned.grid')) {
					$injector.get('transportplanningRequisitionToBeAssignedDataService').getService(true).synDeletedGood(entities);
				}
			}


			service.createItems = function (newItems, goodsType, afterFn) {
				if (!_.isEmpty(newItems)) {

					const updateOnSelectionChanging = container.data.updateOnSelectionChanging;
					container.data.updateOnSelectionChanging = null;

					var promises = [];
					for (var i = 0; i < newItems.length; i++) {
						promises.push(service.createItem());
					}
					$q.all(promises).then(function (items) {
						for (var i = 0; i < items.length; i++) {
							items[i].TrsGoodsTypeFk = goodsType;
							items[i].Good = newItems[i].Id;
							items[i].selectedGood = newItems[i];
							service.onPropertyChanged(items[i], 'Good');
							container.data.newEntityValidator.validate(items[i], service);
						}

						// HACK: for handling specified case about creating trsReq by unassign-bundles, here we have to record goods that are created from assignBundles (HP-ALM #116319)
						service.recordGoodsOfAssignedBundles(items);

						// trigger to refresh the assigned bundle/product info
						service.deselect().then(function () {
							service.setSelected(items[items.length - 1]);
						});
						if (afterFn) {
							afterFn(items);
						}
					}).finally(() => {
						container.data.updateOnSelectionChanging = updateOnSelectionChanging;
					});
				}
			};

			service.createItemsFromToBeAssigned = function (itemsFromTobeAssigned, afterFn) {
				const selectedTrsReq = service.parentService().getSelected();
				itemsFromTobeAssigned = _.filter(itemsFromTobeAssigned, (item) => {
					return item.ProjectFk === selectedTrsReq.ProjectFk;
				});

				const returnTobeAssigned = [];
				const modifications = platformModuleStateService.state(service.getModule()).modifications;
				_.forEach(itemsFromTobeAssigned, (itemPossibleBeDeleted) => {
					const deletedGood = _.find(modifications.TrsGoodsToDelete, (good) => {
						return good.CorrespondingTobeAssigned.Id === itemPossibleBeDeleted.Id;
					});
					if(deletedGood && (deletedGood.TrsGoodsTypeFk === trsGoodsTypes.Product || deletedGood.TrsGoodsTypeFk === trsGoodsTypes.Bundle)){
						itemPossibleBeDeleted.TrsRequisitionFk = deletedGood.TrsRequisitionFk;
						//Bundle
						if(deletedGood.CorrespondingTobeAssigned.Children){
							_.forEach(deletedGood.CorrespondingTobeAssigned.Children, (child) => {
								child.TrsRequisitionFk = null;
								if(child.LocationHistories){
									child.CurrentLocationJobFk = _.first(child.LocationHistories).JobFk;
									child.TimeStamp = _.first(child.LocationHistories).TimeStamp;
								}
							});

							deletedGood.CorrespondingTobeAssigned.CurrentLocationJobFk = _.first(deletedGood.CorrespondingTobeAssigned.Children[0].LocationHistories).JobFk;
							deletedGood.CorrespondingTobeAssigned.TimeStamp = _.first(deletedGood.CorrespondingTobeAssigned.Children[0].LocationHistories).TimeStamp;
						}

						//Product
						if(deletedGood.CorrespondingTobeAssigned.LocationHistories){
							deletedGood.CorrespondingTobeAssigned.CurrentLocationJobFk = _.first(deletedGood.CorrespondingTobeAssigned.LocationHistories).JobFk;
							deletedGood.CorrespondingTobeAssigned.TimeStamp = _.first(deletedGood.CorrespondingTobeAssigned.LocationHistories).TimeStamp;
						}

						container.data.itemList.push(deletedGood);
						_.remove(modifications.TrsGoodsToDelete, (good) => {return good.Id === deletedGood.Id;});
						modifications.EntitiesCount -= 1;
						_.remove(itemsFromTobeAssigned, (item) => {return item.Id === itemPossibleBeDeleted.Id;});
						returnTobeAssigned.push(itemPossibleBeDeleted);
					}
				});

				if (returnTobeAssigned.length > 0 && afterFn) {
					afterFn(returnTobeAssigned);
					if(!itemsFromTobeAssigned.length){
						service.gridRefresh();
					}
				}

				const goodsInParent = service.getList();
				const itemsInGoods = _.map(goodsInParent, 'CorrespondingTobeAssigned');
				itemsFromTobeAssigned = _.filter(itemsFromTobeAssigned, (newItem) => {
					if(newItem.UpstreamItemId){
						return !_.some(itemsInGoods, {Id: newItem.Id}) && !_.some(goodsInParent, {PpsUpstreamItemFk: newItem.UpstreamItemId});
					}
					return !_.some(itemsInGoods, {Id: newItem.Id});
				});

				if(_.isEmpty(itemsFromTobeAssigned)){
					return;
				}

				const updateOnSelectionChanging = container.data.updateOnSelectionChanging;
				container.data.updateOnSelectionChanging = null;

				var promises = [];
				for (var i = 0; i < itemsFromTobeAssigned.length; i++) {
					promises.push(service.createItem());
				}
				$rootScope.$emit('before-save-entity-data');
				$q.all(promises).then(function (newItems) {
					for (var i = 0; i < newItems.length; i++) {

						newItems[i].CorrespondingTobeAssigned = itemsFromTobeAssigned[i];

						if(itemsFromTobeAssigned[i].UpstreamItemId){
							newItems[i].TrsGoodsTypeFk = (() => {
								switch (itemsFromTobeAssigned[i].PpsUpstreamGoodsTypeFk) {
									case upstreamGoodsTypes.Material:// Material
										return trsGoodsTypes.Material;
									case upstreamGoodsTypes.Resource:// Res
										return trsGoodsTypes.Resource;
									case upstreamGoodsTypes.Plant:// Plant
										return trsGoodsTypes.Plant;
									case upstreamGoodsTypes.Product:// Product
										return trsGoodsTypes.Product;
								}
							})();
							newItems[i].Good = itemsFromTobeAssigned[i].UpstreamGoods;
							// items[i].selectedGood = newItems[i];
							newItems[i].UomFk = itemsFromTobeAssigned[i].UomFk;
							newItems[i].Quantity = itemsFromTobeAssigned[i].Quantity;
							newItems[i].PpsUpstreamItemFk = itemsFromTobeAssigned[i].RealId;
							newItems[i].selectedGood = itemsFromTobeAssigned[i].UpstreamItem;
						}

						if(itemsFromTobeAssigned[i].ProductId){
							newItems[i].TrsGoodsTypeFk = trsGoodsTypes.Product;
							newItems[i].Good = itemsFromTobeAssigned[i].Product.Id;
							newItems[i].selectedGood = itemsFromTobeAssigned[i].Product;
							newItems[i].PpsProductFk = itemsFromTobeAssigned[i].ProductId
						}

						if(itemsFromTobeAssigned[i].BundleId){
							newItems[i].TrsGoodsTypeFk = trsGoodsTypes.Bundle;
							newItems[i].Good = itemsFromTobeAssigned[i].Bundle.Id;
							newItems[i].selectedGood = itemsFromTobeAssigned[i].Bundle;
							newItems[i].TrsProductBundleFk = itemsFromTobeAssigned[i].BundleId;
						}

						newItems[i].PpsStackListDocument = itemsFromTobeAssigned[i].PpsStackListDocument;
						newItems[i].PpsLayoutDrawingDocument = itemsFromTobeAssigned[i].PpsLayoutDrawingDocument;
						newItems[i].PpsQTODocument = itemsFromTobeAssigned[i].PpsQTODocument;
						newItems[i].PpsPositionPlanDocument = itemsFromTobeAssigned[i].PpsPositionPlanDocument;
						newItems[i].CurrentLocationJobFk = itemsFromTobeAssigned[i].CurrentLocationJobFk;

						service.onPropertyChanged(newItems[i], 'Good');
						container.data.newEntityValidator.validate(newItems[i], service);
					}

					service.recordGoodsOfAssignedBundles(_.filter(newItems, {TrsGoodsTypeFk: 3}));

					if (afterFn) {
						afterFn(itemsFromTobeAssigned, newItems);
					}

					let element = $injector.get('platformGridAPI').grids.element('id', 'df5tg7b1928342c4a65cee89c4869tyg');
					if (element && !_.isNil(element.instance)) {
						element.instance.setSelectedRows([]);
					}
					service.deselect();
					service.gridRefresh();

					$rootScope.$emit('after-save-entity-data');
				}).finally(() => {
					container.data.updateOnSelectionChanging = updateOnSelectionChanging;
				});
			};

			// HACK: for handling specified case about creating trsReq by unassign-bundles, we have to override method `onReadSucceeded` for handling readData with storage of goods (HP-ALM #116319)
			var baseOnReadSucceeded = container.data.onReadSucceeded;
			container.data.onReadSucceeded = function (readData, data) {
				// check if need to do onReadSucceeded
				if(readData.length === 0
					&& data.itemList.length >0
					&& goodsOfAssignedBundlesStorage.length >0)
				{
					var isExistedNotMappingItem = _.some(data.itemList,function (item) {
						return _.isNil(_.find(goodsOfAssignedBundlesStorage,{Id: item.Id}));
					});
					if(!isExistedNotMappingItem){
						return;
					}
				}
				const selectedParent = service.parentService().getSelected();
				if(goodsOfAssignedBundlesStorage && goodsOfAssignedBundlesStorage.length >0){
					_.each(goodsOfAssignedBundlesStorage, function (item) {
						if(!_.find(readData,{Id: item.Id}) && item.TrsRequisitionFk === selectedParent.Id){
							var tmp = _.clone(item);
							readData.push(tmp);
						}
					});
				}

				baseOnReadSucceeded(readData, data);
			};


			service.recordGoodsOfAssignedBundles = function (goodsArray) {
				_.each(goodsArray, function (g) {
					if(!_.find(goodsOfAssignedBundlesStorage, {Id: g.Id})){
						goodsOfAssignedBundlesStorage.push(g);
					}
				});
			};
			service.clearGoodsOfAssignedBundlesRecord = function () {
				goodsOfAssignedBundlesStorage = [];
			};
			var goodsOfAssignedBundlesStorage = [];

			function deleteCorrespondingCache(e, entities) {
				let entityIds = _.map(entities, 'Id');
				_.remove(goodsOfAssignedBundlesStorage, (good) => {
					return _.indexOf(entityIds, good.Id) !== -1;
				});
			}

			if (service.registerEntityDeleted) {
				service.registerEntityDeleted(deleteCorrespondingCache);
			}

			let virtualDateshiftService = virtualDataServiceFactory.getVirtualDataService(moduleName);
			function selectedBundleChanged (entity, newBundle, oldBundle) {
				if (!_.isNil(newBundle)) {
					entity.TrsProductBundleFk = newBundle.Id;
					entity.TrsBundleEventFk = newBundle.TrsReq_EventFk;
					entity.TrsBundleDateshiftMode = newBundle.TrsReq_DateshiftMode;
				}
				let subEvent = service.parentService().getSelected();
				// validation
				if (_.isNil(virtualDateshiftService) || _.isNil(subEvent)) {
					return;
				}
				// dateshiftAssignment
				let removedSuperEvent = !_.isNil(oldBundle) && !_.isNil(oldBundle.TrsReq_EventFk) && !_.isNil(oldBundle.TrsReq_DateshiftMode)? { PpsEventFk: oldBundle.TrsReq_EventFk, DateshiftMode: oldBundle.TrsReq_DateshiftMode } : null;
				let addedSuperEvent = !_.isNil(newBundle) && !_.isNil(newBundle.TrsReq_EventFk) && !_.isNil(newBundle.TrsReq_DateshiftMode)? { PpsEventFk: newBundle.TrsReq_EventFk, DateshiftMode: newBundle.TrsReq_DateshiftMode } : null;
				if ((_.isNil(removedSuperEvent) && _.isNil(addedSuperEvent)) || (!_.isNil(removedSuperEvent) && !_.isNil(addedSuperEvent) && removedSuperEvent.PpsEventFk === addedSuperEvent.PpsEventFk)) {
					return;
				}
				virtualDateshiftService.changeSpecialzedEvents([subEvent], removedSuperEvent, addedSuperEvent);
			}

			function selectedProductChanged(entity, newProduct, oldGood){
				if(!_.isNil(newProduct)){
					entity.EngDrawingFk = newProduct.EngDrawingFk;
					entity.ProductsDescription = newProduct.DescriptionInfo.Translated;

				}
			}

			service.selectedGoodChanged = function selectedGoodChanged(entity, newGood, oldGood) {
				switch(entity.TrsGoodsTypeFk) {
					case trsGoodsTypes.Bundle:
						selectedBundleChanged(entity, newGood, oldGood);
						break;
					case trsGoodsTypes.Product:
						selectedProductChanged(entity, newGood, oldGood);
				}
			};

			service.createFromModelObjects = function createFromModelObjects(modelId2ObjectIdsMap) {
				if (Object.keys(modelId2ObjectIdsMap).length === 0) {
					return;
				}

				const trsReq = service.parentService().getSelected();
				if (!trsReq) {
					return;
				}

				const url = globals.webApiBaseUrl + 'transportplanning/requisition/trsgoods/createFromModelObjects';
				const queryStr = `?requisitionId=${trsReq.Id}`;

				$http.post(url + queryStr, modelId2ObjectIdsMap)
					.then(res => {
						if (res.data) {
							res.data.Goods.forEach(good => {
								container.data.handleOnCreateSucceeded(good, container.data);
							});

							if (res.data.WarningMessage.length > 0) {
								showWarning(res.data.WarningMessage);
							}
						}
					});
			};

			function showWarning(message) {
				const modalOptions = {
					headerTextKey: 'basics.common.alert.warning',
					bodyTextKey: message,
					showOkButton: true,
					iconClass: 'ico-warning'
				};
				platformModalService.showDialog(modalOptions);
			}


			function deleteItems(entities){
				let orgEntities = _.cloneDeep(entities);
				let canDelete = true;
				let goodsNames = [];
				orgEntities.forEach(item => {
					if(service.getServiceName() === 'transportplanningRequisitionMainServiceTrsGoodDataService' && (item.TrsGoodsTypeFk === trsGoodsTypes.Product || item.TrsGoodsTypeFk === trsGoodsTypes.Bundle)){
						canDelete = !service.parentService().isSelectedItemAccepted()
										&& (!!item.PpsUpstreamItemFk || (!_.isNil(item.CorrespondingTobeAssigned) && item.CorrespondingTobeAssigned.CurrentLocationJobFk === service.parentService().getSelected()?.LgmJobFk)|| item.Version === 0);
					}
					if(!canDelete){
						goodsNames.push(item.DisplayTxt);
					}
				});
				// if(goodsNames.length > 0){
				// 	let validGoodNames = goodsNames.filter(name => name !== null && name !== undefined);
				// 		let message;
				// 		if (validGoodNames.length > 1){
				// 			// Multiple items message
				// 			const productList = validGoodNames.join(', ');
				// 			message = $translate.instant('transportplanning.requisition.trsGoods.deleteProductsMsg', { products: productList });;
				// 		}else{
				// 			message = $translate.instant('transportplanning.requisition.trsGoods.deleteProductMsg');
				// 		}

				// 		let userDialog = platformModalService.showYesNoDialog(message, $translate.instant('transportplanning.requisition.trsGoods.delete'));
				// 		userDialog.then(function (result) {
				// 			if (result.yes) {
				// 				container.data.deleteEntities(orgEntities, container.data);
				// 			}
				// 		});
				// }else{
				// 	container.data.deleteEntities(orgEntities, container.data);
				// }
				container.data.deleteEntities(orgEntities, container.data);

			}
			container.service.deleteItem = function deleteItem(entity){
				return deleteItems([entity]);
			};

			container.service.deleteEntities = function deleteEntities(entities){
				return deleteItems(entities);
			};

			return service;
		};


	}
})(angular);
