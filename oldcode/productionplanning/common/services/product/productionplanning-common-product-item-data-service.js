(function (angular) {
	'use strict';
	/* global globals */
	/**
	 * @ngdoc service
	 * @name productionplanningCommonProductItemDataService
	 * @function
	 *
	 * @description
	 * productionplanningCommonProductItemDataService is the data service for all entities related functionality.
	 */
	const moduleName = 'productionplanning.common';
	const masterModule = angular.module(moduleName);

	masterModule.factory('productionplanningCommonProductItemDataService', ProductionplanningCommonProductItemDataService);

	ProductionplanningCommonProductItemDataService.$inject = ['_','$q', '$injector', '$http', 'productionplanningCommonProductDataServiceFactory',
		'productionplanningItemDataService', 'basicsCommonMandatoryProcessor', 'productionplanningCommonProductValidationFactory',
		'productionplanningCommonEventMainServiceFactory', 'platformDataServiceDataProcessorExtension', 'platformDataServiceSelectionExtension',
		'platformModuleStateService', 'basicsLookupdataLookupDescriptorService', 'platformGridAPI', 'basicsCommonCharacteristicService','basicsCommonCreateDialogConfigService',
		'platformModalService', '$translate','productionplanningCommonProductProcessor', 'platformRuntimeDataService', 'modelViewerModelIdSetService',
		'modelViewerModelSelectionService',
		'modelViewerCompositeModelObjectSelectionService',
		'productionplanningCommonStatusLookupService'];

	function ProductionplanningCommonProductItemDataService(_,$q, $injector, $http, productionplanningCommonProductDataServiceFactory,
		itemDataService, basicsCommonMandatoryProcessor, validationServiceFactory,
		eventMainServiceFactory, platformDataServiceDataProcessorExtension, platformDataServiceSelectionExtension,
		platformModuleStateService, basicsLookupdataLookupDescriptorService, platformGridAPI, basicsCommonCharacteristicService, basicsCommonCreateDialogConfigService,
		platformModalService, $translate, productionplanningCommonProductProcessor, platformRuntimeDataService, modelViewerModelIdSetService,
		modelViewerModelSelectionService,
		modelViewerCompositeModelObjectSelectionService,
		statusService) {

		const gridContainerGuid = '92e45c26b45f4637980c0ba38bf8cd31';
		const characteristic1SectionId = 63;
		const characteristic2SectionId = 64;
		let characteristicColumn = '';
		let enableManualCreateProdOKButton = true;
		let pinForMarkupStateChanged = new Platform.Messenger();
		let annotationStatusChanged = new Platform.Messenger();
		let installSequenceChanged = new Platform.Messenger();

		const serviceOption = {
			flatNodeItem: {
				serviceName: 'productionplanningCommonProductItemDataService',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'productionplanning/common/product/',
					endCreate: 'createmanually',
					endRead: 'customListForItem',
					initReadData: function initReadData(readData) {
						readData.filter = '?itemFk=' + _.get(itemDataService.getSelected(), 'Id') + '&moveToRoot=true';
					}
				},
				entityRole: {
					node: {
						itemName: 'Product',
						parentService: itemDataService,
						parentFilter: 'itemFk'
					}
				},
				entitySelection: {supportsMultiSelection: true},
				dataProcessor: [{processItem: productionplanningCommonProductProcessor.processItemSvg},
					{processItem: productionplanningCommonProductProcessor.processProdPlaceFk},
					{processItem: productionplanningCommonProductProcessor.processReadonlyOfFabricationUnitDateSlotColumnsThatValueIsEmpty},
					{processItem: productionplanningCommonProductProcessor.processReadonlyInPUModule},
					{processItem: productionplanningCommonProductProcessor.processAnnotationSatus}],
				presenter: {
					list: {
						incorporateDataRead: function (readData, data) {
							let result = {
								FilterResult: readData.FilterResult,
								dtos: readData.Main || []
							};
							basicsLookupdataLookupDescriptorService.attachData(readData);
							serviceContainer.service.processTransportInfo(result.dtos);
							let dataRead = serviceContainer.data.handleReadSucceeded(result, data);

							// handle charactistic
							let exist = platformGridAPI.grids.exist(gridContainerGuid);
							if (exist) {
								let containerInfoService = $injector.get('productionplanningProductContainerInformationService');
								let characterColumnService = $injector.get('basicsCharacteristicColumnServiceFactory')
									.getService(serviceContainer.service, characteristic2SectionId, gridContainerGuid,containerInfoService);
								characterColumnService.appendCharacteristicCols(result.dtos);
							}

							if (hasShownPDFViewer()) {
								const annoExtension = $injector.get('ppsCommonDocumentAnnotationExtension');
								annoExtension.prepareProductInfos();
							}

							return dataRead;
						},
					}
				},
				actions: {
					delete: {},
					canDeleteCallBackFunc: (product) => {
						if(!_.isNil(product.PpsItemStockFk) && product.PpsItemStockFk !== product.ItemFk){
							return false;
						}

						if(itemDataService.getSelected()?.IsForPreliminary === true){
							return false;
						}

						if(product.ProductStatusFk){
							return statusService.allowProductToBeDeleted(serviceContainer.data.selectedEntities);
						}

						// other condition...
						return false;
					},
					create: {}
				}
			},
			isNotRoot: true,
			eventModule: 'productionplanning.common.item.product.event'
		};

		/* jshint -W003 */
		const serviceContainer = productionplanningCommonProductDataServiceFactory.createService(serviceOption);

		serviceContainer.data.newEntityValidator = validationServiceFactory.getNewEntityValidator(serviceContainer.service);

		serviceContainer.service.appendItems = function (products) {
			if (_.isArray(products)) {
				_.each(products, function (product) {
					if (!_.some(serviceContainer.data.itemList, {Id: product.Id})) {
						platformDataServiceDataProcessorExtension.doProcessItem(product, serviceContainer.data);
						serviceContainer.data.itemList.push(product);
					}
				});
			}
		};

		serviceContainer.service.removeItems = function (products) {
			if (_.isArray(products)) {
				_.each(products, function (product) {
					_.remove(serviceContainer.data.itemList, {Id: product.Id});
				});
			}
		};

		serviceContainer.service.createManually = function (responses) {
			const childSiteFks = responses[0].data;
			const isProcessConfigured = responses[1].data === true;
			const prodPlaceList = responses[2];

			const creationOptionName = isProcessConfigured ? 'ppsCommonProductManuallyCreateOption' : 'ppsCommonProductManuallyCreateOption2';
			const createOptions = $injector.get(creationOptionName);
			const domains = createOptions.uiStandardService.getDtoScheme();
			_.each(createOptions.fields, function (field) {
				if (Object.prototype.hasOwnProperty.call(domains,field)) {
					createOptions.attributes[field] = domains[field];
				}
			});

			createOptions.attributes.EndDate.mandatory = true;

			const availableProdPlaces = prodPlaceList.filter(i => childSiteFks.includes(i.BasSiteFk));
			createOptions.attributes.ProdPlaceFk.mandatory = isProcessConfigured && availableProdPlaces.length > 0;
			createOptions.attributes.ProdPlaceFk.errorParam = $translate.instant('productionplanning.product.productionPlace.productionPlace');

			createOptions.creationData.subPuSiteChildrenIds = childSiteFks;
			return basicsCommonCreateDialogConfigService.showDialog(createOptions).then(function (result) {
				if (result.ok) {
					result.data = $injector.get(creationOptionName).updateData;
					return result.data;
				}
			});
		};

		serviceContainer.service.isOkDisable = function (isOkDisable){
			return enableManualCreateProdOKButton === false;
		};

		serviceContainer.service.createItemSimple = function (creationOptions, customCreationData, onCreateSucceeded){
			const data = serviceContainer.data;
			const creationData = _.merge(data.doPrepareCreate(data, creationOptions), customCreationData);
			let prodSetEvent = getProductionSetEvent();
			if(prodSetEvent) {
				creationData.EndDate = prodSetEvent.PlannedStart;
			}

			return data.doCallHTTPCreate(creationData, data, onCreateSucceeded);
		};

		let refreshFieldAssignedQtyOfSelectedPUOfPUContainer = () => {
			itemDataService.reloadItems(itemDataService.getSelectedEntities());
		};

		serviceContainer.service.updateManually = function (updateData) {
			return $http.post(globals.webApiBaseUrl + 'productionplanning/common/product/updatemanually', updateData).then(function (result) {
				if(result.data){
					serviceContainer.service.load();
					refreshFieldAssignedQtyOfSelectedPUOfPUContainer();
				}
				return result.data;
			});
		};

		serviceContainer.service.onValueChanged = function (item, col) {
			switch (col) {
				case 'Area':
					var totalArea = _.sumBy(serviceContainer.data.itemList, function (item) {
						return item.Area ? item.Area : 0;
					});
					updateProductionQuantity(totalArea);
					break;
				case 'InstallSequence':
					item.UpdateInstallSequence = true;
			}
		};

		serviceContainer.service.updateProductionQuantity = updateProductionQuantity;

		function updateProductionQuantity(prodTotalArea) {
			const saveToCache = function (prodTotalArea) {
				const selectedItem = itemDataService.getSelected();
				if (selectedItem) {
					const caches = $injector.get('ppsDataCache').itemModule.itemProductsTotalArea;
					const cache = _.find(caches, {itemId: selectedItem.Id});
					if (cache) {
						cache.productsTotalArea = prodTotalArea;
					} else {
						caches.push({itemId: selectedItem.Id, productsTotalArea: prodTotalArea});
					}
				}
			};

			if (!prodTotalArea) {
				prodTotalArea = _.sumBy(serviceContainer.data.itemList, function (item) {
					return item.Area ? item.Area : 0;
				});
			}

			const hasEventService = eventMainServiceFactory.hasService('productionplanning.common.item.event');
			if (!hasEventService) {
				saveToCache(prodTotalArea); // store quantity as temp data, and using it when events loaded
			} else {
				const eventService = eventMainServiceFactory.getService('', 'productionplanning.common.item.event');
				const needLoad = eventService.serviceNeedsLoad();
				if (needLoad) {
					saveToCache(prodTotalArea); // store quantity as temp data, and using it when events loaded
				} else {
					eventService.updateProductionEventQuantity(prodTotalArea); // sync immediatelly
				}
			}
		}

		serviceContainer.service.canMoveToRoot = function () {
			if (_.isNil(itemDataService.getSelected())) {
				return false;
			}
			// check if has selected products
			const selectedEntities = serviceContainer.service.getSelectedEntities();
			if(_.isNil(selectedEntities) || selectedEntities.length <= 0){
				return false;
			}
			return  selectedEntities.every(function (prod) {
				return !!prod.CanAssign;
			});
		};

		serviceContainer.service.moveToRoot = function () {
			if (!serviceContainer.service.canMoveToRoot()) {
				return;
			}

			const ppsItem = itemDataService.getSelected();

			const selectedProducts = serviceContainer.service.getSelectedEntities();
			_.each(selectedProducts, function (selectedProduct) {
				const tmpProduct = _.find(serviceContainer.data.itemList, {Id: selectedProduct.Id});
				if (!_.isNil(tmpProduct) && selectedProduct.Version < tmpProduct.Version) {
					selectedProduct = tmpProduct; // fix issue of HP-ALM #115428
				}
			});

			$http.get(globals.webApiBaseUrl + 'productionplanning/item/getRootItem?itemId=' + ppsItem.PPSItemFk).then(function (response) {
				const target = response.data;
				const products = selectedProducts;
				const productToSave = [];
				_.each(products, function (product) {
					product.ProductionSetFk = target.ProductionSetId;
					product.ItemFk = target.Id;
					productToSave.push({
						Product: product
					});
				});
				const modState = platformModuleStateService.state(itemDataService.getModule());
				if (_.isArray(modState.modifications.ProductToSave)) {
					_.remove(modState.modifications.ProductToSave, function (e) {
						return _.some(productToSave, function (prod) {
							return prod.Product.Id === e.Product.Id;
						});
					});
					modState.modifications.ProductToSave = modState.modifications.ProductToSave.concat(productToSave);
				} else {
					modState.modifications.ProductToSave = productToSave;
				}

				// updateDynamicFieldsExtension.updateProductionsetQties(ppsItemDataService, target, reassignedFilter.PPSItemId, modState.modifications.ProductToSave);

				itemDataService.markItemAsModified(target);

				const selectedEntities = serviceContainer.service.getSelectedEntities();
				const ids = _.map(selectedEntities, 'Id');

				const selectedIndex = _.indexOf(serviceContainer.data.itemList, selectedEntities[0]);

				const itemList = _.filter(serviceContainer.data.itemList, function (item) {
					return !_.includes(ids, item.Id);
				});
				serviceContainer.data.itemList = itemList;

				const productIds = [];
				_.each(products, function (product) {
					productIds.push(product.Id);
				});
				// $injector.get('productionplanningItemReassignedProductDataService').addItems(target.Id, productIds);
				$injector.get('productionplanningItemReassignedProductDataService').addItems(target.Id, products, ppsItem);

				// refresh selection status at last
				serviceContainer.data.listLoaded.fire();
				platformDataServiceSelectionExtension.doSelectCloseTo(selectedIndex, serviceContainer.data);
				serviceContainer.service.gridRefresh();
			});
		};

		serviceContainer.service.setCharacteristicColumn = function setCharacteristicColumn(colName) {
			characteristicColumn = colName;
		};
		serviceContainer.service.getCharacteristicColumn = function getCharacteristicColumn() {
			return characteristicColumn;
		};

		const basicsCharacteristicDataServiceFactory = $injector.get('basicsCharacteristicDataServiceFactory');
		basicsCharacteristicDataServiceFactory.getService(serviceContainer.service, characteristic1SectionId);
		basicsCharacteristicDataServiceFactory.getService(serviceContainer.service, characteristic2SectionId);

		serviceContainer.service.createMultipleProducts = (PpsItem, responses) =>{
			let modalOptions =
				{
					iconClass: 'ico-info',
					width: '500px',
					resizeable: true,
					templateUrl: globals.appBaseUrl + 'transportplanning.transport/templates/transportplanning-transport-copy-route-dialog.html',
					controller: 'productionplanningCommonCreateMultipleProductController',
					resolve: {
						params: () => {
							let prodSetEvent = getProductionSetEvent();
							return {
								PpsItem: PpsItem,
								productService: serviceContainer.service,
								subPuSiteChildrenIds: responses[0].data,
								isProcessConfigured: responses[1].data === true,
								endDate: _.isNil(prodSetEvent) ? null : prodSetEvent.PlannedStart // like simple product creation, use PlannedStart of prodSetEvent as default value
							};
						}
					}
				};
			platformModalService.showDialog(modalOptions);
		};

		serviceContainer.service.createSingleOrMultipleProducts = (selectedPpsItem, responses, isMultiple = false) => {
			if (isMultiple) {
				serviceContainer.service.createMultipleProducts(selectedPpsItem, responses);
			} else {
				serviceContainer.service.createManually(responses);
			}
		};

		function getProductionSetEvent() {
			// get planned start and end of production-set event
			let eventService = eventMainServiceFactory.getService('', 'productionplanning.common.item.event');
			let eTypeLookupCache = basicsLookupdataLookupDescriptorService.getData('EventType'.toLowerCase()); // event will always load by selected pu
			return _.find(eventService.getList(), (eve)=>{
				return eTypeLookupCache[eve.EventTypeFk].PpsEntityFk === 15; // PPS Production Set
			});
		}

		function isAfterDateIfEngTaskEventShared(date) {
			let selectedPU = serviceContainer.service.parentService().getSelected();
			let eventService = eventMainServiceFactory.getService('', 'productionplanning.common.item.event');
			let eTypeLookupCache = basicsLookupdataLookupDescriptorService.getData('EventType'.toLowerCase()); // event will always load by selected pu
			let engTaskEvent = _.find(eventService.getList(), (eve)=>{
				return eTypeLookupCache[eve.EventTypeFk].PpsEntityFk === 5; // Engineering Task
			});

			let shareEngTaskEvent = engTaskEvent && engTaskEvent.ItemFk !== selectedPU.Id;
			return !shareEngTaskEvent || date >= engTaskEvent.PlannedFinish;
		}

		serviceContainer.service.serialProduction = (selectedSubPU) => {
			let prodSetEvent = getProductionSetEvent();
			if(!prodSetEvent) {
				const modalOptions = {
					headerText: $translate.instant('productionplanning.common.serialProduction.serialProduction'),
					bodyText: $translate.instant('productionplanning.common.serialProduction.errors.noProductionSetEvent'),
					iconClass: 'ico-error'
				};
				platformModalService.showDialog(modalOptions);
				return;
			}

			let config = {
				width: '400px',
				height: '520px',
				resizeable: true,
				templateUrl: globals.appBaseUrl + 'productionplanning.common/templates/pps-common-serial-production-template.html',
				controller: 'ppsCommonSerialProductionController',
				resolve: {
					params: () => {
						return {
							subPU: selectedSubPU,
							prodSetEvent: prodSetEvent
						};
					}
				}
			};
			return platformModalService.showDialog(config).then(result => {
				if (result === true) {
					refreshFieldAssignedQtyOfSelectedPUOfPUContainer();
				}
			});
		};

		serviceContainer.service.getProductionSetEventOfPU = getProductionSetEvent; // add this method for EndDate validation of ppsCommonProductManuallyValidationForCreateService
		serviceContainer.service.isAfterDateIfEngTaskEventShared = isAfterDateIfEngTaskEventShared; // add this method for EndDate validation of ppsCommonProductManuallyValidationForCreateService

		const service = serviceContainer.service;

		service.reloadSelectedItems = (returnValues) => {
			const selectedIds = returnValues.map(e => e.entity.Id);
			const pkeys = returnValues.map(e => {
				return {Id: e.entity.Id};
			});
			const request = {
				PKeys: pkeys
			};
			$http.post(globals.webApiBaseUrl + 'productionplanning/common/product/customfiltered', request).then(function (response) {
				if (response.data) {
					let dtoList = response.data.Main;
					let selectedItems = serviceContainer.data.itemList.filter(item => selectedIds.includes(item.Id));
					selectedItems.forEach(oldItem =>{
						let newItem = _.find(dtoList, {Id: oldItem.Id});
						angular.extend(oldItem, newItem);
					});

					platformDataServiceDataProcessorExtension.doProcessData(selectedItems, serviceContainer.data);
					service.gridRefresh();
				}
			});

		};

		service.takeFromStock = (item) => {
			$injector.get('ppsCommonStockProductDataService').showTakeFromStockDialog();
		};

		service.validationDatashift = (entity, endDate, bFirst) => {
			if(_.isNil(endDate)){
				return;
			}
			enableManualCreateProdOKButton = false;
			const ppsItem = itemDataService.getSelected();
			let prodTemplateId = ppsItem.ProductDescriptionFk;

			$http.get(globals.webApiBaseUrl + 'productionplanning/common/product/listForDescription?descriptionFk=' + prodTemplateId).then(response => {
				let calendarId = getProductionSetEvent()? getProductionSetEvent().CalCalendarFk : -1;
				let weekDays = {
					workOnMonday: true,
					workOnTuesday: true,
					workOnWednesday: true,
					workOnThursday: true,
					workOnFriday: true,
					workOnSaturday: false,
					workOnSunday: false,
				};
				let dataItem = {
					SubPlanningUnitFk: ppsItem.Id,
					PlannedQuantity: ppsItem.Quantity,
					OpenQuantity: ppsItem.Quantity - response.data.Main.length,
					QuantityToProduce: 1,
					QuantityPerDay: 1,
					StartDate: endDate,
					EndDate: endDate,
					EmptyWeekday: true,
					weekDays: weekDays,
					calendarId: calendarId
				};
				$http.post(globals.webApiBaseUrl + 'productionplanning/common/product/serialproductiondates', dataItem).then(function (response) {
					const prodDate = response.data[0];
					let isSame = dataItem.EndDate.isSame(moment.utc(prodDate), 'day');
					if(isSame === false){
						endDate = moment.utc(prodDate);
						let result = $injector.get('ppsCommonProductManuallyValidationForCreateService').validateEndDate(entity, endDate, 'EndDate', true);
						entity.EndDate = endDate;
						platformRuntimeDataService.applyValidationResult(result, entity, 'EndDate');
						if(bFirst === false){
							const modalOptions = {
								headerTextKey: $translate.instant('productionplanning.common.manualProduction.warnings.noteOfChangeEndDateTitle'),
								bodyText: $translate.instant('productionplanning.common.manualProduction.warnings.noteOfChangeEndDate').replace('{0}',moment(dataItem.EndDate).format('YYYY-MM-DD')).replace('{1}',prodDate.slice(0, prodDate.indexOf('T'))),
								iconClass: 'ico-info'
							};
							platformModalService.showDialog(modalOptions).then(function (res){
								enableManualCreateProdOKButton = true;
							});
						} else {
							enableManualCreateProdOKButton = true;
						}
					} else {
						enableManualCreateProdOKButton = true;
					}
				});
			});
		};

		service.handleSelectionChanged = () => {
			if(service.handleProductChanged === false){
				return;
			}
			let products = service.getSelectedEntities();
			if(!_.isNil(products) && products.length > 0){
				if(hasShownPDFViewer()){
					let annoExtension = $injector.get('ppsCommonDocumentAnnotationExtension');
					if( annoExtension && annoExtension.handleProductChanged){
						annoExtension.handleProductChanged(_.map(products, 'Id'));
					}
				}

				if(hasShownInFront('productionplanning.item.model.viewer.hoops')){
					let objSelectionService = $injector.get('modelViewerCompositeModelObjectSelectionService');
					if(objSelectionService){

							let data = {ppsProductIds: _.map(products, 'Id')};
							$http.post(globals.webApiBaseUrl + 'productionplanning/common/model/objectids', data).then(function (result){
								if(result.data.length > 0){
									var hitObjectIds = modelViewerModelIdSetService.createFromCompressedStringWithArrays(result.data).useSubModelIds();
									service.handleProductChanged = false;
									objSelectionService.integrateSelection(hitObjectIds);
									service.handleProductChanged = true;
								} else {
									objSelectionService.integrateSelection();
								}
							});
					}
				}
			}
		};

		service.pinForMarkups = (bPin) => {
			service.isPinForMarkups = bPin;
			let annoExtension = $injector.get('ppsCommonDocumentAnnotationExtension');
			if(annoExtension && annoExtension.pinForMarkups){
				annoExtension.pinForMarkups(bPin);
			}
		};

		service.createLinkageToModel = () => {
			let modelId = modelViewerModelSelectionService.getSelectedModelId();
			let objectIds = modelViewerCompositeModelObjectSelectionService.getSelectedObjectIds();
			let totalObjectIds = [];
			_.forEach(objectIds, function (subModel){
				totalObjectIds = totalObjectIds.concat(subModel);
			});
			if(modelViewerCompositeModelObjectSelectionService.getSelectedObjectIdCount() === 1) {
				let request = {
					ModelId: modelId,
					ModelObjectIds: totalObjectIds
				};
				$http.post(globals.webApiBaseUrl + 'productionplanning/item/productmodel/createlinkage', request).then(function (response) {
					service.IsCleanModel = false;
					service.load();
				});
			}
		};

		service.IsCleanModel = false;
		service.disableCreateLinkageBtn = () =>{
			return modelViewerCompositeModelObjectSelectionService.getSelectedObjectIdCount() !== 1 || !service.IsCleanModel;
		};

		service.registerPinForMarkupStateChanged = function (callbackFn){
			pinForMarkupStateChanged.register(callbackFn);
		};

		service.unregisterPinForMarkupStateChanged = function (callbackFn){
			pinForMarkupStateChanged.unregister(callbackFn);
		};

		service.firePinForMarkupStateChanged = function (state){
			pinForMarkupStateChanged.fire(state);
		};

		service.registerAnnotationStatusChanged = function (callbackFn){
			annotationStatusChanged.register(callbackFn);
		};

		service.unregisterAnnotationStatusChanged = function (callbackFn){
			annotationStatusChanged.unregister(callbackFn);
		};

		service.fireAnnotationStatusChanged = function (pinProductIds){
			annotationStatusChanged.fire(pinProductIds);
		};

		service.registerInstallSequenceChanged = function (callbackFn){
			installSequenceChanged.register(callbackFn);
		};

		service.unregisterInstallSequenceChanged = function (callbackFn){
			installSequenceChanged.unregister(callbackFn);
		};

		service.fireInstallSequenceChanged = function (updateStacks){
			installSequenceChanged.fire(updateStacks);
		};

		service.refreshAnnoStatus = function (linkIds, arrowIds, tickIds, annoId, currentDoc){
			let products = service.getList();
			if(products.length < 1){
				return;
			}
			_.forEach(linkIds, function (linkId){
				var linkProduct = _.find(products, {Id: linkId});
				if(linkProduct.AnnoStatusInfos === null){
					linkProduct.AnnoStatusInfos = [{DocId: currentDoc.FileArchiveDocFk, DocFileName: currentDoc.OriginFileName, AnnotationIds: [annoId]}];
					linkProduct.LinkProductIcon = "Linked_Current";
				} else {
					let currectAnnoStatusInfo = _.find(linkProduct.AnnoStatusInfos, {DocId: currentDoc.FileArchiveDocFk});
					if(currectAnnoStatusInfo){
						let annoIds = currectAnnoStatusInfo.AnnotationIds;
						annoIds.push(annoId);
						currectAnnoStatusInfo.AnnotationIds = annoIds;
					} else{
						linkProduct.AnnoStatusInfos.push({DocId: currentDoc.FileArchiveDocFk, DocFileName: currentDoc.OriginFileName, AnnotationIds: [annoId]});
					}
					linkProduct.LinkProductIcon = linkProduct.AnnoStatusInfos.length === 1? "Linked_Current" : "Linked_Cross";
				}
			});
			_.forEach(arrowIds, function (arrowId){
				var arrowProduct = _.find(products, {Id: arrowId});
				arrowProduct.LinkProductIcon = "Arrow";
			} );
			_.forEach(tickIds, function (tickId){
				var tickProduct = _.find(products, {Id: tickId});
				tickProduct.LinkProductIcon = "Tick";
			});
			service.gridRefresh();
		};

		service.refreshAllAnnoStatus = function (currentDocId){
			let products = service.getList();
			if(products.length < 1 || currentDocId < 1){
				return;
			}
			_.forEach(products, function (product){
				if(product.AnnoStatusInfos !== null){
					var findCurrentDoc = _.find(product.AnnoStatusInfos, function (info){
						return info.DocId === currentDocId
					});
					if(findCurrentDoc){
						product.LinkProductIcon = product.AnnoStatusInfos.length === 1? 'Linked_Current' : 'Linked_Cross';
					} else {
						product.LinkProductIcon = 'Linked_Other';
					}
				}
			});
			service.gridRefresh();
		};

		function hasShownPDFViewer() {
			return hasShownInFront('model.wdeviewer.ige');
		}

		function hasShownInFront(containerId) {
			if (!containerId) {
				return false;
			}
			const util = $injector.get('transportplanningTransportUtilService');
			return util.hasShowContainerInFront(containerId);
		}

		return serviceContainer.service;
	}
})(angular);

