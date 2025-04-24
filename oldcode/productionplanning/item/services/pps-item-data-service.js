/**
 * Created by anl on 5/3/2017.
 */

(function (angular) {
	'use strict';
	/*global globals, _*/
	/**
	 * @ngdoc service
	 * @name ppsItemDataService
	 * @function
	 *
	 * @description
	 * ppsItemDataService is the data service for all Item related functionality.
	 */
	var moduleName = 'productionplanning.item';
	var itemModule = angular.module(moduleName);

	itemModule.factory('productionplanningItemDataService', PPSItemDataService);

	PPSItemDataService.$inject = ['platformDataServiceFactory', 'basicsLookupdataLookupDescriptorService',
		'ServiceDataProcessArraysExtension', 'productionplanningItemProcessor', 'productionplanningItemBatchProcessor', 'basicsCommonMandatoryProcessor', '$injector',
		'$translate', '$q', 'basicsLookupdataConfigGenerator', '$http', '$log', 'platformTranslateService', 'PlatformMessenger', 'platformGenericStructureService',
		'platformModalFormConfigService', 'cloudDesktopPinningContextService', 'cloudDesktopInfoService',
		'productionplanningItemStatusLookupService', 'basicsTreeDragDropService', 'cloudDesktopSidebarService', 'ppsCommonCustomColumnsServiceFactory',
		'platformDataValidationService', 'platformModuleStateService', 'transportplanningTransportUtilService',
		'platformModalService', 'productionplanningCommonStructureFilterService', 'basicsLookupdataLookupFilterService', 'platformGridAPI',
		'platformDataServiceDataProcessorExtension', 'ppsCommonDataServiceItemFilterTreeExtension',
		'platformDataServiceModificationTrackingExtension', 'productionplanningCommonEventMainServiceFactory', 'ppsCommonDataServiceSideloadExtension',
		'platformRuntimeDataService', 'moment', 'cloudCommonGridService', 'ppsVirtualDateshiftDataServiceFactory', 'platformDataServiceSelectionExtension',
		'ppsCommonDataserviceWorkflowCallbackExtension', 'productionplanningItemDataServiceUpdateDoneExtension', 'productionplanningItemPreselectionExtension', 'productionplanningItemUpdateModuleHeaderInfoExtension',
		'basicsCommonCharacteristicService',
		'productionplanningCommonLocationInfoService', '_', 'ppsEntityConstant'];

	function PPSItemDataService(
		platformDataServiceFactory, basicsLookupdataLookupDescriptorService, ServiceDataProcessArraysExtension,
		productionplanningItemProcessor, productionplanningItemBatchProcessor, basicsCommonMandatoryProcessor, $injector, $translate, $q,
		basicsLookupdataConfigGenerator, $http, $log, platformTranslateService, PlatformMessenger, platformGenericStructureService,
		platformModalFormConfigService, cloudDesktopPinningContextService, cloudDesktopInfoService,
		statusService, basicsTreeDragDropService, cloudDesktopSidebarService, customColumnsServiceFactory,
		platformDataValidationService, platformModuleStateService, transportplanningTransportUtilService,
		platformModalService, ppsCommonStructureFilterService, basicsLookupdataLookupFilterService, platformGridAPI,
		platformDataServiceDataProcessorExtension, ppsCommonDataServiceItemFilterTreeExtension,
		platformDataServiceModificationTrackingExtension, eventMainServiceFactory, ppsCommonDataServiceSideloadExtension,
		platformRuntimeDataService, moment, cloudCommonGridService, ppsVirtualDateshiftDataServiceFactory, platformDataServiceSelectionExtension,
		workflowCallbackExtension, dataServiceUpdateDoneExtension, preselectionExtension, updateModuleHeaderInfoExtension,
		basicsCommonCharacteristicService,
		locationInfoService, _, ppsEntityConstant) {

		var currentProjectId;
		var currentHeaderId;
		var currentPpsItemFK;
		var FromProject = false;
		var FromPPSItem = false;
		var isCreatingChild = false;

		var selectedProject = {};
		var selectedHeader = {};
		var currentProjectEntity = {};
		var currentHeaderEntity = {};
		var service = {};

		var changedEvents = [];
		var enhancedFilterDef = null;
		var cacheRouteIds = {};

		const ppsItemCharacteristicSection = 43;
		const ppsItemCharacteristic2Section = 69;
		const prodDescCharacteristicSection = 61;
		const prodDescCharacteristic2Section = 62;
		let characteristicColumn = '';

		let FirstLoad = false;
		var serviceOption = {
			hierarchicalRootItem: {
				module: itemModule,
				serviceName: 'productionplanningItemDataService',
				entityNameTranslationID: 'productionplanning.item.entityItem',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'productionplanning/item/',
					endRead: 'customfiltered',
					endDelete: 'multidelete',
					endCreate: 'createitem',
					usePostForRead: true,
					extendSearchFilter: function extendSearchFilter(filterRequest) {
						if (FromProject) {
							filterRequest.ProjectContextId = currentProjectId;
							filterRequest.furtherFilters = [{
								Token: 'productionplanning.item',
								Value: currentHeaderId
							}];
						} else if (FromPPSItem) {
							filterRequest.furtherFilters = [{
								Token: 'productionplanning.itemId',
								Value: currentPpsItemFK
							}];
							//these will be reset after the first load!
							filterRequest.UseCurrentClient = false;
							filterRequest.PinningContext = null;
							filterRequest.ProjectContextId = null;
							filterRequest.IncludeNonActiveItems = true;
						}
						if (serviceContainer.data.sidebarSearch) {
							if (filterRequest.PKeys && filterRequest.PKeys.length === 1 && filterRequest.furtherFilters) {
								var furtherfilter = _.find(filterRequest.furtherFilters, {Token: 'productionplanning.item'});
								if (furtherfilter && furtherfilter.Value === filterRequest.PKeys[0].Id) {
									filterRequest.PKeys = null;
								}
							}
						}
						setModuleContext();
						ppsCommonStructureFilterService.extendSearchFilterAssign('productionplanningItemDataService', filterRequest);
						ppsCommonStructureFilterService.setFilterRequest('productionplanningItemDataService', filterRequest);
						service.setEnhancedFilterDef(filterRequest);
					}
				},
				dataProcessor: [new ServiceDataProcessArraysExtension(['ChildItems']), productionplanningItemProcessor],
				presenter: {
					tree: {
						parentProp: 'PPSItemFk', childProp: 'ChildItems',
						incorporateDataRead: function (readData, data) {
							basicsLookupdataLookupDescriptorService.attachData(readData.Lookups);
							basicsLookupdataLookupDescriptorService.updateData('MaterialGroupParents', [{
								Id: 1,
								Data: readData.MaterialGroupParents
							}]);
							basicsLookupdataLookupDescriptorService.updateData('TaskToItems', [{
								Id: 1,
								Data: readData.TaskToItems
							}]);
							locationInfoService.loadData();
							_.forEach(readData.dtos, function (dto) {
								service.setDefaultDrawingFromParent(dto);
							});

							FirstLoad = true;
							serviceContainer.data.lastSelection = {};

							var result = {
								FilterResult: readData.FilterResult,
								dtos: readData.dtos || []
							};
							const dataRead = data.handleReadSucceeded(result, data);

							productionplanningItemBatchProcessor.processItems(readData.dtos);
							appendProdDescCharacteristicCols();
							appendPpsItemCharacteristicCols();
							service.showListByFilter();

							service.onContextUpdated.fire();
							return dataRead;
						},
						initCreationData: function initCreationData(creationData) {
							var relatedItem = null;
							if (!_.isNil(creationData.parent)) {
								relatedItem = creationData.parent;
							}

							creationData.Id = relatedItem ? relatedItem.PPSHeaderFk : currentHeaderId;
							creationData.PKey1 = relatedItem ? relatedItem.Id : undefined;
						},
						handleCreateSucceeded: function (item) {
							var context = cloudDesktopPinningContextService.getContext();
							if (context !== undefined && context !== null) {
								for (var i = 0; i < context.length; i++) {
									if (context[i].token === 'project.main') {
										item.ProjectFk = context[i].id;
									}
								}
							}
							// create lastObject and display in history
							if (serviceContainer.data.rootOptions && serviceContainer.data.rootOptions.addToLastObject === true) {
								serviceContainer.data.createLastObjects(item);
							}

							let subItemService = $injector.get('productionplanningItemSubItemDataService');
							subItemService.setList([]);

							return item;
						}
					}
				},
				entityRole: {
					root: {
						itemName: 'PPSItem',
						moduleName: 'cloud.desktop.moduleDisplayNamePPSItem',
						descField: 'DescriptionInfo.Translated',
						useIdentification: true,
						addToLastObject: true,
						lastObjectModuleName: moduleName
					}
				},
				translation: {
					uid: 'productionplanningItemMainService',
					title: 'productionplanning.item.entityItem',
					columns: [{header: 'cloud.common.entityDescription', field: 'DescriptionInfo'}],
					dtoScheme: {
						typeName: 'PPSItemDto',
						moduleSubModule: 'ProductionPlanning.Item'
					},
				},
				entitySelection: {supportsMultiSelection: true},
				sidebarWatchList: {active: true},
				sidebarSearch: {
					options: {
						moduleName: moduleName,
						//enhancedSearchEnabled: true,
						pattern: '',
						pageSize: 100,
						useCurrentClient: false,
						includeNonActiveItems: false,
						showOptions: true,
						showProjectContext: false,
						withExecutionHints: false,
						pinningOptions: {
							isActive: true,
							showPinningContext: [
								{token: 'project.main', show: true},
								{token: 'productionplanning.item', show: true}
							],
							setContextCallback: setCurrentPinningContext
						},
						enhancedSearchEnabled: true,
						enhancedSearchVersion: '2.0',
						includeDateSearch: true
					}
				},
				actions: {
					create: 'hierarchical',
					canCreateChildCallBackFunc: canCreateChildCallBackFunc,
					delete: {},
					canDeleteCallBackFunc: canDeleteCallBackFunc
				},
				useItemFilter: true
			}
		};

		/* jshint -W003 */
		var serviceContainer = platformDataServiceFactory.createNewComplete(serviceOption);
		serviceContainer.data.endCreate = serviceOption.hierarchicalRootItem.httpCRUD.endCreate;
		service = serviceContainer.service;

		workflowCallbackExtension.addWorkflowCallbackExtension(serviceContainer);
		//register to virtual dateshift service
		// todo: rename to prouctionplanning.item 19.03.2021
		ppsVirtualDateshiftDataServiceFactory.createNewVirtualDateshiftDataService('productionplanning.common', service);

		dataServiceUpdateDoneExtension.addMethods(serviceContainer.data, service);

		function canCreateChildCallBackFunc() {
			return !!service.getSelected();
		}

		function canDeleteCallBackFunc(selectedItem) {
			if (selectedItem.Version <= 0) {
				return true;
			}

			var itemStatusList = statusService.getItemList();
			var status = _.find(itemStatusList, {Id: selectedItem.PPSItemStatusFk});
			return status && status.IsDeletable;
		}

		function setPinningContext(projectId, ppsHeader, dataService) {
			var projectPromise = $q.when(true);
			var pinningContext = [];
			if (angular.isNumber(projectId)) {
				projectPromise = cloudDesktopPinningContextService.getProjectContextItem(projectId).then(function (pinningItem) {
					pinningContext.push(pinningItem);
				});
				setCurrentProject(projectId);
			}

			if (angular.isNumber(_.get(ppsHeader, 'Id'))) {
				pinningContext.push(
					new cloudDesktopPinningContextService.PinningItem('productionplanning.item', ppsHeader.Id,
						cloudDesktopPinningContextService.concate2StringsWithDelimiter(ppsHeader.Code, ppsHeader.DescriptionInfo.Translated, ' - '))
				);
				setCurrentHeader(ppsHeader.Id);
			}
			return $q.all([projectPromise]).then(
				function () {
					if (pinningContext.length > 0) {
						cloudDesktopPinningContextService.setContext(pinningContext, dataService);
						setModuleContext();
					}
				});
		}

		function setModuleContext() {
			clearLocalContext();
			var context = $injector.get('cloudDesktopPinningContextService').getContext();
			if (context !== undefined && context !== null) {
				for (var i = 0; i < context.length; i++) {
					if (context[i].token === 'project.main') {
						currentProjectId = context[i].id;
					}
					if (context[i].token === 'productionplanning.item') {
						currentHeaderId = context[i].id;
					}
				}
			}
		}

		function clearLocalContext() {
			currentHeaderId = null;
			currentProjectId = null;
			currentPpsItemFK = null;
			currentProjectEntity = {};
			currentHeaderEntity = {};
			selectedProject = {};
			selectedHeader = {};
			FromProject = false;
			FromPPSItem = false;
		}

		function setCurrentPinningContext(dataService) {
			var item = dataService.getSelected();
			if (item) {
				$q.when(basicsLookupdataLookupDescriptorService.getLookupItem('PpsHeader', item.PPSHeaderFk)).then(function (header) {
					setPinningContext(header.PrjProjectFk, header, dataService);
				});
			}
		}

		function setCurrentProject(projectId) {
			if (angular.isDefined(projectId)) {
				$http.get(globals.webApiBaseUrl + 'project/main/byid?id=' + projectId).then(function (response) {
					var project = response.data;
					currentProjectEntity = {ProjectNo: project.ProjectNo, ProjectName: project.ProjectName};
					selectedProject = {
						ProjectNo: project.ProjectNo,
						ProjectName: project.ProjectName,
						ProjectId: project.Id
					};
				});
			}
		}

		function setCurrentHeader(headerId) {
			if (angular.isDefined(headerId)) {
				$http.get(globals.webApiBaseUrl + 'productionplanning/header/getheaderbyid?Id=' + headerId).then(function (response) {
					var header = response.data;
					currentHeaderEntity = {
						Code: header.Code,
						DescriptionInfo: header.DescriptionInfo,
						ProjectId: header.PrjProjectFk
					};
					selectedHeader = {
						Code: header.Code,
						DescriptionInfo: header.DescriptionInfo
					};
				});
			}
		}

		function getProjectDocumentDataService() {
			var documentConfig = $injector.get('documentsProjectDocumentModuleContext').getConfig();
			return $injector.get('documentsProjectDocumentDataService').getService(documentConfig);
		}

		service.onContextUpdated = new PlatformMessenger();

		//add a material change event for re-assign container to reload
		service.onItemMaterialChanged = new PlatformMessenger();

		service.registerOnItemMaterialChanged = function (fn) {
			service.onItemMaterialChanged.register(fn);
		};

		service.unregisterOnItemMaterialChanged = function (fn) {
			service.onItemMaterialChanged.unregister(fn);
		};

		serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create({
			typeName: 'PPSItemDto',
			moduleSubModule: 'ProductionPlanning.Item',
			validationService: 'productionplanningItemValidationService',
			mustValidateFields: ['Code', 'ClerkTecFk', 'SiteFk', 'MaterialGroupFk', 'ResTypeFk', 'UomFk', 'LgmJobFk']
		});

		// make sure async things are done before update
		serviceContainer.data.waitForOutstandingDataTransfer = function () {

			var defer = $q.defer();
			var need2Wait = false;

			serviceContainer.data.productionEventsToSave = undefined; // clean up old data

			// check if need to update production event quantity
			var prePromises = [];
			//save project-document before saving other
			prePromises.push(getProjectDocumentDataService().update());
			var hasEventService = eventMainServiceFactory.hasService('productionplanning.common.item.event');
			if (hasEventService) {
				var eventService = eventMainServiceFactory.getService('', 'productionplanning.common.item.event');
				if (eventService && eventService.updateProdEventQuantityPromise) {
					prePromises.push(eventService.updateProdEventQuantityPromise);
				}
			}

			let bundleDataService = $injector.get('productionplanningItemBundleDataService');
			if (bundleDataService && bundleDataService.moveToRootPromise) {
				prePromises.push(bundleDataService.moveToRootPromise);
			}

			$q.all(prePromises).then(function () {
				var updateData = platformDataServiceModificationTrackingExtension.getModifications(service);
				if (!angular.isDefined(updateData.EventToSave)) { // if exist EventToSave, production event quantity must already synchronized when load events
					var caches = $injector.get('ppsDataCache').itemModule.itemProductsTotalArea;
					if (caches.length > 0) {

						need2Wait = true; // means has async call

						var promises = [];
						promises.push($http.get(globals.webApiBaseUrl + 'productionplanning/configuration/eventtype/getall')); // load all event types
						caches.forEach(function (cache) {
							promises.push(loadItemEvents(cache.itemId));
						});
						$q.all(promises).then(function (responses) {
							var eventTypes = responses[0].data;
							var productionEventsToSave = [];
							for (var i = 0; i < caches.length; i++) {
								var pdEvent = findProductionEvent(responses[i + 1], eventTypes);
								if (pdEvent) {
									pdEvent.Quantity = caches[i].productsTotalArea;
									productionEventsToSave.push({
										MainItemId: caches[i].itemId,
										Event: pdEvent
									});
								}
							}

							if (productionEventsToSave.length > 0) {
								serviceContainer.data.productionEventsToSave = productionEventsToSave;
							}

							defer.resolve();
						});
					}
				}

				if (!need2Wait) {
					defer.resolve();
				}
			}).finally(function () {
				$injector.get('ppsDataCache').itemModule.clearCache();
			});

			return defer.promise;
		};

		function loadItemEvents(itemId) {
			return $http.get(globals.webApiBaseUrl + 'productionplanning/common/event/listForDateshift?foreignKey=ItemFk&mainItemId=' + itemId).then(function (response) {
				return response.data.Main;
			});
		}

		function findProductionEvent(events, eventTypes) {
			var productionEvent = null;

			// find production event
			if (events) {
				for (var i = 0; i < events.length; i++) {
					var evenType = _.find(eventTypes, {Id: events[i].EventTypeFk});
					if (evenType.PpsEntityFk === 15) { // PPS Production Set
						productionEvent = events[i];
						break;
					}
				}
			}

			return productionEvent;
		}

		service.deleteCompleteItem = function deleteCompleteItem(item) {
			var entity = {
				Id: serviceContainer.service.hasSelection() ? serviceContainer.service.getSelected().Id : null
			};
			$injector.get('productionplanningItemItemLookupDataService').resetCache({lookupType: 'PPSItem'});

			var modalDeleteCompleteItemConfig = {
				title: $translate.instant('productionplanning.item.deleteItemTitle'),
				//resizeable: true,
				dataItem: entity,
				formConfiguration: {
					fid: 'productionplanning.item.deleteItemTitle',
					version: '0.2.4',
					showGrouping: false,
					groups: [
						{
							gid: 'baseGroup',
							attributes: ['id']
						}
					],
					rows: [
						basicsLookupdataConfigGenerator.provideDataServiceLookupConfigForForm({
								dataServiceName: 'productionplanningItemItemLookupDataService',
								filter: function () {
									return item.PPSHeaderFk;
								}
							},
							{
								gid: 'baseGroup',
								rid: 'Id',
								label$tr$: 'productionplanning.item.entityItem',
								model: 'Id',
								sortOrder: 1
							}
						)
					]
				},
				handleOK: function handleOK() {//result not used
					var platformModalService = $injector.get('platformModalService');
					var platformWizardService = $injector.get('platformSidebarWizardCommonTasksService');
					if (entity.Id) {
						var item = _.find(serviceContainer.data.itemList, {Id: entity.Id});
						if (item === null || angular.isUndefined(item)) {
							platformModalService.showErrorBox('productionplanning.item.alreadyDelete', 'productionplanning.item.deleteModelTitle');
						} else {
							platformModalService.showYesNoDialog('productionplanning.item.deleteQuestion', 'productionplanning.item.deleteModelTitle', 'no')
								.then(function (result) {
									if (result.yes) {
										$http.post(globals.webApiBaseUrl + 'productionplanning/item/deletecompleteitem/', {mainItemId: entity.Id}
										).then(
											function (success) {
												$log.log(success);
												// success#
												platformWizardService.showSuccessfullyDoneMessage();
												serviceContainer.data.itemList = _.filter(serviceContainer.data.itemList, function (item) {
													return item.Id !== entity.Id;
												});
												serviceContainer.data.listLoaded.fire();
											},
											function (failure) {
												$log.log(failure);
												platformModalService.showErrorBox('productionplanning.item.deleteFailed', 'productionplanning.item.deleteModelTitle');
											}
										);
									}
								});
						}
					}
				},
				dialogOptions: {
					disableOkButton: function disableOkButton() {
						return entity.Id === null;
					},
					disableCancelButton: function disableCancelButton() {
						return false;
					}
				}
			};

			platformTranslateService.translateFormConfig(modalDeleteCompleteItemConfig.formConfiguration);
			platformModalFormConfigService.showDialog(modalDeleteCompleteItemConfig);
		};

		service.ensureInitContext = function () {
			setModuleContext();
		};

		service.setPinningContext = function (prjId, header, dataService) {
			return setPinningContext(prjId, header, dataService);
		};

		/** Set Module Header Info*/
		service.setShowHeaderAfterSelectionChanged(updateModuleHeaderInfoExtension.updateModuleHeaderInfo);

		//overwrite getTree function to overrule issue of filterTree function
		ppsCommonDataServiceItemFilterTreeExtension.overwriteTreeFunction(serviceContainer);

		//sideload region:
		function processSideload(response, visibility, sideloadData) {
			var items = [];
			serviceContainer.data.flatten(response.dtos, items, serviceContainer.data.treePresOpt.childProp);
			var currentItems = service.getUnfilteredList();
			//set children if new children
			_.forEach(currentItems, function (currentItem) {
				var newItem = _.find(items, {Id: currentItem.Id});
				if (newItem && newItem.ChildItems) {
					if (!currentItem.ChildItems) {
						currentItem.ChildItems = newItem.ChildItems;
					} else {
						//concat list but filter duplicates
						var currentChildItemsIdList = _.map(currentItem.ChildItems, 'Id');
						var filteredItems = _.filter(newItem.ChildItems, function (childItem) {
							return !_.includes(currentChildItemsIdList, childItem.Id);
						});
						currentItem.ChildItems = currentItem.ChildItems.concat(filteredItems);
					}
				}
			});

			basicsLookupdataLookupDescriptorService.attachData(response.Lookups);
			locationInfoService.loadData();
			//get registered sideload containers
			var containerList = _.get(sideloadData.sideloadContainers, visibility);
			_.forEach(containerList, service.showListByFilter);
			productionplanningItemBatchProcessor.processItems(items);
			service.initLocationPath();
			return items;
		}

		ppsCommonDataServiceSideloadExtension.addSideloadFunctionality(serviceContainer, processSideload);

		//end sideload region

		service.getSelectedProjectId = function () {
			var selectedItem = service.getSelected();
			return selectedItem !== null && selectedItem.ProjectFk > 0 ? service.getSelected().ProjectFk : -1;
		};

		service.getProjectIdForBulkEditor = () => {
			let projectId = -1;

			if (service.getSelectedEntities().length > 0) {
				projectId = service.getSelectedProjectId();
				let isSameProjectFk = service.getSelectedEntities().every((entity) => {
					return entity.ProjectFk === projectId;
				});

				if (!isSameProjectFk) {
					projectId = -1;
				}
			}

			return projectId;
		};

		service.onContextUpdated.register(updateModuleHeaderInfoExtension.updateModuleHeaderInfo);

		service.getHeaderID = function () {
			return currentHeaderId;

		};

		service.getProjectID = function () {
			var prjId = service.getSelected() !== null ? service.getSelected().ProjectFk : -1;
			if (prjId === -1) {
				//get project id from pinned context
				var context = $injector.get('cloudDesktopPinningContextService').getContext();
				if (context !== undefined && context !== null) {
					for (var i = 0; i < context.length; i++) {
						if (context[i].token === 'project.main') {
							prjId = context[i].id;
							break;
						}
					}
				}
			}

			return prjId;
		};

		/**
		 * Example Implementation of a navigator for special purpose
		 */
		service.selectItemByID = function selectItemByID(eventItemFk, callback) {
			var item = service.getItemById(eventItemFk);
			if (!item) {
				service.load().then(function () {
					filterOptions['3598514b62bc409ab6d05626f7ce304b'] = false;
					service.showListByFilter();
					item = service.getItemById(eventItemFk);
					service.setSelected(item);
					if (callback !== null && typeof callback === 'function') {
						callback();
					}
				});
			} else {
				service.setSelected(item);
				if (callback !== null && typeof callback === 'function') {
					callback();
				}
			}
		};

		service.setFilter = function (id) {
			currentPpsItemFK = id;
			FromPPSItem = angular.isDefined(id);
		};

		service.loadItemsByNavi = function loadItemsByNavi(object, triggerField, dataService) {
			/** Navigate from project->header */
			if (triggerField === 'Code') {
				var header = object;
				setDefaultForNavi(header);
				setPinningContext(header.PrjProjectFk, header, dataService).then(function () {
					service.load();
				});
			}
			else if(triggerField === 'Ids'){
				const ids = object.Ids.split(',').map(e => parseInt(e));
				cloudDesktopSidebarService.filterSearchFromPKeys(ids);
			}
			/** Navigate from headerfk */
			else if (triggerField === 'HeaderFk' || triggerField === 'PpsHeaderFk') {
				$http.get(globals.webApiBaseUrl + 'productionplanning/header/getheaderbyid?Id=' + object[triggerField]).then(function (response) {
					var header = response.data;
					setDefaultForNavi(header);
					setPinningContext(header.PrjProjectFk, header, dataService).then(function () {
						service.load();
					});
				});
			} else if (triggerField === 'EngDrawingFk') {
				cloudDesktopSidebarService.filterSearchFromPKeys(null, [{
					Token: 'productionplanning.drawingFk',
					Value: object[triggerField]
				}]);
			}
		};

		service.navigateByJob = function (jobFk) {
			cloudDesktopSidebarService.filterSearchFromPKeys(null, [{
				Token: 'productionplanning.jobfk',
				Value: jobFk
			}]);
		};

		var originalRSE = service.refreshSelectedEntities;
		service.refreshSelectedEntities = function () {
			if (transportplanningTransportUtilService.hasShowContainerInFront('productionplanning.item.reassigned.product.list')){
				let service = $injector.get('productionplanningItemReassignedProductDataService');
				service.flagToConditionIfRefresh = true;
				service.load();
				service.flagToConditionIfRefresh = false;
			}
			if (transportplanningTransportUtilService.hasShowContainerInFront('productionplanning.item.product.lookup.list')){
				let service = $injector.get('productionplanningItemProductLookupDataService').clearGridByUnSavedProducts();
			}
			let selectEntities = service.getSelectedEntities();
			let hasChildPU = selectEntities.some(e => !_.isNil(e.PPSItemFk));
			if (hasChildPU) { // fix issue that cannot refresh node/leaf PU on the UI when refresh selected entities #DEV-3301
				return service.reloadItems(selectEntities);
			} else {
				return originalRSE();
			}
		};

		function resetDefaultDrawingFromParent(parent) {
			if (parent.HasChildren === false || parent.ChildItems === null) {
				return;
			}
			for (var i = 0; i < parent.ChildItems.length; i++) {
				var child = parent.ChildItems[i];
				var hasEngDD = child.ReadonlyCustomColumns.indexOf('EngDrawingDefFk');

				if (hasEngDD >= 0) {
					child.EngDrawingDefFk = parent.EngDrawingDefFk;
					child.EngDrawingStatusFk = parent.EngDrawingStatusFk;
					child.DrawingStatusBackgroundColor = parent.DrawingStatusBackgroundColor;
					if (parent.EngDrawingDefFk === null) {
						child.ReadonlyCustomColumns.remove(hasEngDD);
						platformRuntimeDataService.readonly(child, [{field: 'EngDrawingDefFk', readonly: false}]);
					}
					resetDefaultDrawingFromParent(child);
				} else if (child.EngDrawingDefFk === null && parent.EngDrawingDefFk !== null) {
					child.EngDrawingDefFk = parent.EngDrawingDefFk;
					child.EngDrawingStatusFk = parent.EngDrawingStatusFk;
					child.DrawingStatusBackgroundColor = parent.DrawingStatusBackgroundColor;
					child.ReadonlyCustomColumns.push('EngDrawingDefFk');
					platformRuntimeDataService.readonly(child, [{field: 'EngDrawingDefFk', readonly: true}]);
					resetDefaultDrawingFromParent(child);
				}
			}
		}

		function retriveDrawingFk(item) {
			if (!_.isNil(item) && !_.isNil(item.PPSItemFk)) {
				var parent = basicsLookupdataLookupDescriptorService.getLookupItem('', item.PPSItemFk);
				if (parent !== null && parent.EngDrawingDefFk !== null) {
					return parent.EngDrawingDefFk;
				} else {
					return retriveDrawingFk(parent);
				}
			}
			return null;
		}

		function updateSameTaskItems(drawingId) {
			var selectedItem = service.getSelected();
			if(selectedItem.EngTaskId){
				var TaskToItems = basicsLookupdataLookupDescriptorService.getData('TaskToItems');
				var TaskToItemsDic = TaskToItems[1].Data;
				var itemIds = TaskToItemsDic[selectedItem.EngTaskId];
				if (itemIds.length > 1) {
					var itemList = service.getList();
					_.forEach(itemIds, function (itemId) {
						if (itemId !== selectedItem.Id) {
							var item = _.find(itemList, {Id: itemId});
							item.EngDrawingDefFk = drawingId;
						}
					});
					service.gridRefresh();
				}
			}
		}

		service.onValueChanged = function (item, col) {
			switch (col) {
				case 'Quantity':
					$http.get(globals.webApiBaseUrl + 'productionplanning/item/hasChildren?ItemId=' + item.Id).then(function (response) {
						if (!response.data) {
							showEventQuantityDialog(item);
						}
					});
					break;
				case 'EngDrawingDefFk':
					if (item.EngDrawingDefFk === null) {
						item.EngDrawingDefFk = retriveDrawingFk(item);
						if (item.EngDrawingDefFk !== null) {
							item.ReadonlyCustomColumns.push('EngDrawingDefFk');
							platformRuntimeDataService.readonly(item, [{field: 'EngDrawingDefFk', readonly: true}]);
						}
					}
					updateSameTaskItems(item.EngDrawingDefFk);
					resetDefaultDrawingFromParent(item);
					break;
				case 'PrjLocationFk':
					var locationCodeService = $injector.get('productionplanningCommonLocationInfoService');
					var location = basicsLookupdataLookupDescriptorService.getLookupItem('LocationInfo', item.PrjLocationFk);

					if (!location && item.PrjLocationFk !== null) {
						locationCodeService.handleNewLocation(item, service);
					}
					break;
				case 'MdcMaterialFk':
				case 'MaterialGroupFk':
					service.onItemMaterialChanged.fire(null, item);
					break;
				case 'ProductDescriptionFk':
					var selected = service.getSelected();
					if (selected.ProductDescriptionFk === null) {
						var characteristicProps = Object.keys(selected).filter(prop => prop.startsWith('charactercolumn'));
						characteristicProps.forEach(prop => selected[prop] = null);
					}
					appendProdDescCharacteristicCols();
					service.gridRefresh();
					break;
				case 'SiteFk':
					service.siteChanged = true;
			}
		};

		service.siteChanged = false;

		service.setQuantityChangedEvents = function (events) {
			changedEvents = events;
			service.update();
		};

		/* jshint -W098 */
		service.doPrepareUpdateCall = function (updateData, modifiedData) {
			updateData.ProjectDocument = null;//add this properties to avoid save the project-document
			if (!angular.isDefined(updateData.EventToSave) && changedEvents.length > 0) {
				updateData.EventToSave = [];
				_.forEach(changedEvents, function (changedEvent) {
					updateData.EventToSave.push({
						MainItemId: changedEvent.Id,
						Event: changedEvent
					});
					updateData.EntitiesCount++;
				});
			}
			changedEvents = [];

			// append production events
			if (serviceContainer.data.productionEventsToSave && serviceContainer.data.productionEventsToSave.length > 0) {
				if (!angular.isDefined(updateData.EventToSave)) {
					updateData.EventToSave = [];
				}
				serviceContainer.data.productionEventsToSave.forEach(function (pdEvent) {
					var eventToSave = _.find(updateData.EventToSave, {MainItemId: pdEvent.MainItemId});
					if (eventToSave) {
						event.Event.Quantity = pdEvent.Quantity;
					} else {
						updateData.EventToSave.push(pdEvent);
					}
				});
			}

			if (angular.isDefined(updateData.DailyProductionToSave)) {
				_.forEach(updateData.DailyProductionToSave, function (assignment) {
					if (typeof (assignment.PlannedStart) === 'string') {
						assignment.PlannedStart = moment.utc(assignment.PlannedStart).format('DD/MM/YYYY');
					}
				});
			}

			if (service.subItemDescriptionCodeChanged && updateData.PPSItem && angular.isDefined(updateData.SubItemToSave)) {
				updateData.PPSItem[0].ProductDescriptionCode = updateData.SubItemToSave[0].SubItem.ProductDescriptionCode;
			}

			// process JobBundleToSave and JobBundleToDelete (DEV-39402)
			if (updateData?.JobBundleToSave?.length > 0) {
				updateData.JobEngStackToSave = [];
				_.forEach(updateData.JobBundleToSave, function (bundleCompleteDto) {
					bundleCompleteDto.Bundle = bundleCompleteDto.JobBundle;
					// process stack
					if(bundleCompleteDto.Bundle?.Version === 0 && bundleCompleteDto.Bundle.Stack){
						processStack(bundleCompleteDto.Bundle);
						updateData.JobEngStackToSave.push(bundleCompleteDto.Bundle.Stack);
					}
				});
			}
			if (updateData?.JobBundleToDelete?.length > 0) {
				_.forEach(updateData.JobBundleToDelete, function (bundleDto) {
					// just for avoiding possible validation issue on saving JobBundleToDelete
					bundleDto.RoutesInfo = null;
					bundleDto.ProductCollectionInfo = null;
					if (isLoadingDeviceEmpty(bundleDto.LoadingDevice)) {
						bundleDto.LoadingDevice = null;
					}
				});
			}
		};

		function processStack(bundle) {
			bundle.Stack.Code = bundle.Code;
			bundle.Stack.DescriptionInfo = bundle.DescriptionInfo;
			bundle.Stack.Length = bundle.Length ?? 0;
			bundle.Stack.UomLengthFk = bundle.BasUomLengthFk ?? 0;
			bundle.Stack.Width = bundle.Width ?? 0;
			bundle.Stack.UomWidthFk = bundle.BasUomWidthFk ?? 0;
			bundle.Stack.Height = bundle.Height ?? 0;
			bundle.Stack.UomHeightFk = bundle.BasUomHeightFk ?? 0;
			bundle.Stack.Weight = bundle.Weight ?? 0;
			bundle.Stack.UomWeightFk = bundle.BasUomWeightFk ?? 0;
		}

		function isLoadingDeviceEmpty(loadingDevice) {
			return _.isNil(loadingDevice) || (!loadingDevice?.Description &&
				_.isNil(loadingDevice?.Quantity) &&
				_.isNil(loadingDevice?.RequestedFrom) &&
				_.isNil(loadingDevice?.RequestedTo) &&
				_.isNil(loadingDevice?.UomFk) &&
				_.isNil(loadingDevice?.TypeFk) &&
				_.isNil(loadingDevice?.ResourceFk) &&
				_.isNil(loadingDevice?.JobFk));
		}

		function showEventQuantityDialog(item) {
			$http.get(globals.webApiBaseUrl + 'productionplanning/common/event/listForCommon?foreignKey=ItemFk&mainItemId=' + item.Id)
				.then(function (response) {
					if (response.data.Main.length > 0) {
						var events = _.filter(response.data.Main, function (event) {
							return event.ItemFk === item.Id;
						});
						var modalCreateConfig = {
							width: '940px',
							resizeable: true,
							templateUrl: globals.appBaseUrl + 'productionplanning.item/templates/pps-item-event-quantity-dialog.html',
							controller: 'productionplanningItemEventQuantityDialogController',
							resolve: {
								'$options': function () {
									return {
										events: events,
										selectedItem: item,
										itemService: service
									};
								}
							}
						};
						platformModalService.showDialog(modalCreateConfig);
					}
				});
		}

		function setDefaultForNavi(header) {
			currentHeaderId = header.Id;
			currentHeaderEntity = header;
			currentProjectId = header.PrjProjectFk;
			FromProject = true;
		}

		function OnPinningContextChanged() {
			setModuleContext();
		}

		cloudDesktopPinningContextService.onSetPinningContext.register(OnPinningContextChanged);
		cloudDesktopPinningContextService.onClearPinningContext.register(OnPinningContextChanged);

		basicsTreeDragDropService.update(serviceContainer, function (source, target) {
			return source && target && source.PPSHeaderFk === target.PPSHeaderFk;
		});

		service.createUpstreamItem = function (upstreamItem, ppsItem) {
			return service.createItem({
				isSimpleModel: true,
				isCreatingChild: true,
				title: 'productionplanning.item.upstreamItem.createUpstreamItemTitle',
				itemInitializer: function (newPpsItem) {
					var promises = [];
					if (upstreamItem.PpsEventReqforFk) {
						promises.push($http.post(globals.webApiBaseUrl + 'productionplanning/common/event/list', {Id: upstreamItem.PpsEventReqforFk}));
					} else if (upstreamItem.PpsItemFk) {
						promises.push($http.get(globals.webApiBaseUrl + 'productionplanning/item/getEvent?type=15&itemId=' + upstreamItem.PpsItemFk));
					} else {
						promises.push($q.when(true));
					}
					if (ppsItem) {
						newPpsItem.LgmJobFk = ppsItem.LgmJobFk;
						newPpsItem.PPSHeaderFk = ppsItem.PPSHeaderFk;
					} else if (upstreamItem.PpsItemFk) {
						promises.push($http.post(globals.webApiBaseUrl + 'productionplanning/item/list', {Id: upstreamItem.PpsItemFk}));
					} else {
						promises.push($q.when(true));
					}
					newPpsItem.Quantity = upstreamItem.Quantity;
					if (upstreamItem.PpsUpstreamGoodsTypeFk === 1 && upstreamItem.UpstreamGoods) {
						newPpsItem.MdcMaterialFk = upstreamItem.UpstreamGoods;
						var mat = basicsLookupdataLookupDescriptorService.getLookupItem('MaterialCommodity', upstreamItem.UpstreamGoods);
						newPpsItem.MaterialGroupFk = mat.MdcMaterialGroupFk;
					}

					return $q.all(promises).then(function (responses) {
						if (responses[0] && responses[0].data) {
							var entity = responses[0].data;
							if (_.isArray(entity)) {
								entity = entity[0];
							}
							if (entity && entity.PlannedStart) {
								newPpsItem.eventsEndDate = moment.utc(entity.PlannedStart);
							}
						}
						if (responses[1] && responses[1].data && responses[1].data.length > 0) {
							newPpsItem.LgmJobFk = responses[1].data[0].LgmJobFk;
							newPpsItem.PPSHeaderFk = responses[1].data[0].PPSHeaderFk;
						}
						newPpsItem.OriginEndDate = newPpsItem.eventsEndDate;
						newPpsItem.UpstreamItem = true;
						return newPpsItem;
					});
				}
			});
		};

		service.createItem = function (options) {
			options = options || {};
			var creationData = !options.isCreatingChild && !isCreatingChild ? serviceContainer.data.doPrepareCreate(serviceContainer.data) :
				serviceContainer.data.doPrepareCreateChild(serviceContainer.data);
			creationData.PKey3 = -1; // means create without ID generation

			// ensure create as root
			delete creationData.parent;
			delete creationData.parentId;
			delete creationData.PKey1;
			delete creationData.Id;

			// preset pps_header ID
			creationData.Id = getPpsHeaderId();

			var config = {
				width: '400px',
				height: '550px',
				resizeable: true,
				templateUrl: globals.appBaseUrl + 'productionplanning.common/templates/form-template-without-controller.html',
				controller: 'ppsItemCreationDialogController',
				resolve: {
					params: function () {
						return {
							serviceContainer: serviceContainer,
							creationData: creationData,
							isCreatingChild: isCreatingChild,
							isSimpleModel: options.isSimpleModel,
							title: options.title,
							itemInitializer: options.itemInitializer
						};
					}
				}
			};
			return platformModalService.showDialog(config);
		};

		function getPpsHeaderId(){
			let headerId = undefined;

			// get from pinned context as higher priority
			let context = cloudDesktopPinningContextService.getContext();
			if(!_.isNil(context)){
				let pinItem = _.find(context, {token: 'productionplanning.item'});
				if(pinItem){
					headerId = pinItem.id;
				}
			}

			// get from selected item
			if(_.isNil(headerId)){
				let selectedItem = service.getSelected();
				if(selectedItem){
					headerId = selectedItem.PPSHeaderFk;
				}
			}

			return headerId;
		}

		delete service.createChildItem; // inorder to hide tool-bar button 'New Subrecord'

		// service.createChildItem = function () {
		// 	isCreatingChild = true;
		// 	service.createItem();
		// 	isCreatingChild = false;
		// };

		service.updateSimple = function (item) {
			var updateData = {
				EntitiesCount: 1,
				MainItemId: item.Id,
				PPSItem: [item]
			};
			return serviceContainer.data.doCallHTTPUpdate(updateData, serviceContainer.data);
		};

		service.createSucceededwithWizard = function createSucceededwithWizard(newItem, createData) {
			serviceContainer.data.onCreateSucceeded(newItem, serviceContainer.data, createData);
		};

		// hackcode: Here "override" method doReadData() for setting furtherFilters parameter (by zwz 2019/07/10)
		var basReadData = serviceContainer.data.doReadData;
		serviceContainer.data.doReadData = function doReadData(data) {
			if (furtherFilters === null || furtherFilters.length === 0) {
				return basReadData(data);
			}

			data.listLoadStarted.fire();

			if (_.isFunction(serviceContainer.service.disableFilteringByModelObjects)) {
				serviceContainer.service.disableFilteringByModelObjects();
			}

			var mayRequireModelObjectFilter = (function checkModelObjectFilterRequired() {
				if (!serviceContainer.data.enhanceFilterByModelObjectSelection) {
					return false;
				}
				if (!serviceContainer.data.filterByViewerManager || !serviceContainer.data.filterByViewerManager.isActive()) {
					return false;
				}
				return true;
			})();

			if (data.usesCache && data.currentParentItem && data.currentParentItem.Id && !mayRequireModelObjectFilter) {
				var cache = data.provideCacheFor(data.currentParentItem.Id, data);

				if (cache) {
					data.onReadSucceeded(cache.loadedItems, data);

					return $q.when(cache.loadedItems);
				}
			}

			var readData = {};
			readData.filter = '';

			if (data.initReadData) {
				data.initReadData(readData, data);

				if (data.enhanceReadDataByModelObjectSelection) {
					if (data.usePostForRead) {
						data.enhanceReadDataByModelObjectSelection(readData, data);
					} else {
						data.enhanceFilterByModelObjectSelection(readData, data);
					}
				}
			} else if (data.filter) {
				readData.filter = '?' + data.filter;

				if (data.enhanceFilterByModelObjectSelection) {
					data.enhanceFilterByModelObjectSelection(readData, data);
				}
			} else if (data.sidebarSearch) {

				if (cloudDesktopSidebarService.checkStartupFilter()) {
					return null;
				}
				var options = serviceOption.hierarchicalRootItem;
				var params = _.cloneDeep(cloudDesktopSidebarService.filterRequest.getFilterRequestParamsOrDefault(data.searchFilter));
				if (options.entityRole && options.entityRole.root) {
					if (options.entityRole.root.useIdentification) {
						_.forEach(params.PinningContext, function (pItem) {
							var pId = pItem.id;
							if (_.isNumber(pId)) {
								pItem.id = {Id: pId};
							}
						});
						if (params.PKeys && params.PKeys.length > 0) {
							var tmp = [];
							_.forEach(params.PKeys, function (pItem) {
								if (_.isNumber(pItem)) {
									tmp.push({Id: pItem});
								}
							});
							params.PKeys = tmp;
						}
					} else {
						_.forEach(params.PinningContext, function (pItem) {
							var pId = pItem.id;
							if (!_.isNumber(pId) && _.isObject(pId)) {
								pItem.id = pId.Id;
							}
						});
						if (params.ProjectContextId && !_.isNumber(params.ProjectContextId) && _.isObject(params.ProjectContextId)) {
							params.ProjectContextId = params.ProjectContextId.Id;
						}
					}
				}
				angular.extend(readData, params);

				// TODO: remove initReadData above, if no usages in modules anymore
				// used for smooth migration to replace initReadData option
				// problem: at the moment if initReadData is used filter/sidebarSearch are ignored!
				if (_.isFunction(data.extendSearchFilter)) {
					data.extendSearchFilter(readData, data);
				}

				if (data.isRoot && platformGenericStructureService.isFilterEnabled()) {
					var groupingFilter = platformGenericStructureService.getGroupingFilterRequest();

					if (groupingFilter) {
						readData.groupingFilter = groupingFilter;
						readData.furtherFilters = service.getLastFilter().furtherFilters;// set furtherFilters for grouping filter (by zwz 2019/07/10)
					}
				}
			}

			return serviceContainer.data.doCallHTTPRead(readData, data, data.onReadSucceeded);
		};

		var furtherFilters = [];
		service.setFurtherFilters = function (filters) {
			furtherFilters = filters;
		};
		service.getLastFilter = function () {
			return {furtherFilters: furtherFilters};
		};
		// remark: Here we implement method getLastFilter() for privding furtherFilters when invoking function executeRequest() in platformGenericStructureService

		service.getFilterRequest = function () {
			return _.cloneDeep(cloudDesktopSidebarService.filterRequest.getFilterRequestParamsOrDefault(serviceContainer.data.searchFilter));
		};

		function isValid(result) {
			return result === true || (!!result && result.valid === true);
		}

		function validateField(item, prop, validationService) {
			var tempProp = prop.replace(/\./g, '$');
			var syncProp = 'validate' + tempProp;
			var asyncProp = 'asyncValidate' + tempProp;
			var res = true;

			if (validationService[syncProp]) {
				res = validationService[syncProp].call(service, item, item[prop], prop, true);
				serviceContainer.data.newEntityValidator.showUIErrorHint(res, item, prop);
			}

			if (isValid(res) && validationService[asyncProp]) {
				validationService[asyncProp].call(service, item, item[prop], prop, true).then(function (result) {
					serviceContainer.data.newEntityValidator.showUIErrorHint(result, item, prop);
				});
			}
		}

		service.registerFieldChangeHandler = function (validationService) {
			return function handleFieldChange(entity, field) {
				switch (field) {
					case 'PPSHeaderFk':
						if (entity.Code) {
							validateField(entity, 'Code', validationService);
						}
						break;
				}
			};
		};

		var filters = [
			{
				key: 'pps-item-factory-sitefk-filter',
				serverSide: true,
				fn: function (entity) {
					return {
						IsFactory: true,
						MaterialGroupFk: entity.MaterialGroupFk,
						MdcMaterialFk: entity.MdcMaterialFk
					};
				}
			},
			{
				key: 'pps-material-group-filter',
				fn: function (entity) {
					return _.find(flattenMdcGroup, {Id: entity.Id});
				}
			}
		];

		service.registerFilter = function registerFilter() {
			basicsLookupdataLookupFilterService.registerFilter(filters);
		};

		service.unregisterFilter = function unregisterFilter() {
			basicsLookupdataLookupFilterService.unregisterFilter(filters);
		};

		let byJobContainers = [];

		service.registerByJobContainer = (gridId) => {
			if (!byJobContainers.includes(gridId)) {
				byJobContainers.push(gridId);
			}
		};

		let isByJobContainerId = (gridId) => {
			return byJobContainers.includes(gridId);
		};

		let filterOptions = {};

		service.setInitialFilterOption = function(gridId) {
			if (_.isNil(filterOptions[gridId])) {
				filterOptions[gridId] = true;
			}
			// If the filter option of grid existed, do nothing.
		};

		let getFilterOptionState = function(gridId) {
			return filterOptions[gridId];
		};
		service.getFilterOptionState = getFilterOptionState;

		service.toggleFilterOptionStatus = function(gridId) {
			if (gridId in filterOptions) {
				filterOptions[gridId] = !filterOptions[gridId];
			}
		};

		service.showListByFilter = function (listGridId) {
			listGridId = listGridId || '3598514b62bc409ab6d05626f7ce304b'; // default list container
			var grid = platformGridAPI.grids.element('id', listGridId);

			if (_.isNil(grid) || _.isNil(grid.dataView)) {
				return;
			}

			if (isByJobContainerId(grid.id)) {
				// if grid is a list by job container, filter by JobFilter too. #127691
				const sameAsSelectedJob = jobFk => service.getLastSideloadSelection() ? jobFk === service.getLastSideloadSelection().LgmJobFk : service.getSelected();
				applyFilter(listGridId, (item) => {
					return isHierarchyLevelMatch(item) && item.JobFilter === true && sameAsSelectedJob(item.LgmJobFk);
				});
			} else {
				applyFilter(listGridId);
			}

			var row = service.getSelected() ? grid.dataView.getRowById(service.getSelected().Id) : -1;
			if(row !== -1  && !_.isNil(row)){
				var rows = grid.dataView.getRows();
				if(row < rows.length){
					var newSel = rows[row];
					if(newSel !== service.getSelected()){
						platformDataServiceSelectionExtension.doSelect(newSel, serviceContainer.data);
					}
				}
				else{
					var curRow = (service.getSelected().Id === rows[rows.length-1].Id && rows.length > 2)? rows.length-2 : rows.length-1;
					platformDataServiceSelectionExtension.doSelect(rows[curRow], serviceContainer.data);
				}
			}
		};

		service.updateHaveApplyFilterContainers = () => {
			Object.keys(filterOptions).forEach((gridId) => {
				service.showListByFilter(gridId);
			});
		};

		service.updateChildItemContainer = (listGridId) => {
			//let listGridId ='4ddf9e9220f44a22b29c97ecd41c7ab2';
			let grid = platformGridAPI.grids.element('id', listGridId);

			if (_.isNil(grid) || _.isNil(grid.dataView)) {
				return;
			}

			let selectedRoot = service.getSelected();
			let row = selectedRoot? grid.dataView.getRowById(selectedRoot.Id) : -1;

			if((row === 0 && FirstLoad) || (row !== -1  && !angular.isDefined(row))) {
				if (selectedRoot !== null) {
					platformGridAPI.filters.extendFilterFunction(listGridId, (item) => {
						return item.PPSItemFk === selectedRoot.Id;
					});
				} else {
					platformGridAPI.filters.extendFilterFunction(listGridId, (item) => {
						return false;
					});
				}
				FirstLoad = false;
				//grid.instance.setSelectedRows([]);
			}
			else if (row !== -1){
				if(!selectedRoot.IsLeaf) { //Node item has children
					platformGridAPI.filters.extendFilterFunction(listGridId, (item) => {
						return item.PPSItemFk === selectedRoot.Id;// && ((service.onlyShowLeaf[listGridId] && item.IsLeaf) || !service.onlyShowLeaf[listGridId] || item.IsLeaf);
					});
				}
				//grid.instance.setSelectedRows([]);
			}
		};

		let applyFilter = function(gridId, customApplyFilterFn, customUnapplyFilterFn) {
			if (getFilterOptionState(gridId) === true) {
				if (customApplyFilterFn) {
					platformGridAPI.filters.extendFilterFunction(gridId, customApplyFilterFn);
				} else {
					platformGridAPI.filters.extendFilterFunction(gridId, (item) => {
						return isHierarchyLevelMatch(item);
					});
				}
			} else {
				if (customUnapplyFilterFn) {
					platformGridAPI.filters.extendFilterFunction(gridId, customUnapplyFilterFn);
				} else {
					platformGridAPI.filters.extendFilterFunction(gridId, () => true);
				}
			}
		};

		let isHierarchyLevelMatch = (item) => {
			// HierarchyFilter options: 0: show if leaf, not 0: show if root
			// Always show PUs that have not parent and child.
			return (item.IsLeaf && item.PPSItemFk === null) || // PUs have not parent and child
				(item.HierarchyFilter === 0 && item.IsLeaf) || // child PUs have option show if leaf
				(item.HierarchyFilter !== 0 && !item.IsLeaf && item.PPSItemFk === null); // root PUs have option show if root
		};

		 service.setDefaultDrawingFromParent = function (parent) {
			if (parent.HasChildren === false || parent.ChildItems === null) {
				return;
			}
			for (var i = 0; i < parent.ChildItems.length; i++) {
				var child = parent.ChildItems[i];
				if ((child.EngDrawingDefFk === null || child.EngDrawingDefFk === undefined) && parent.EngDrawingDefFk > 0) {
					child.EngDrawingDefFk = parent.EngDrawingDefFk;
					child.EngDrawingStatusFk = parent.EngDrawingStatusFk;
					child.DrawingStatusBackgroundColor = parent.DrawingStatusBackgroundColor;
					if(_.isNil(child.ReadonlyCustomColumns)){
						child.ReadonlyCustomColumns = [];
					}
					child.ReadonlyCustomColumns.push('EngDrawingDefFk');
				}
				service.setDefaultDrawingFromParent(child);
			}
		};

		service.setEnhancedFilterDef = function (request) {
			enhancedFilterDef = angular.isDefined(request.EnhancedFilterDef) ? request.EnhancedFilterDef : null;
		};
		service.getEnhancedFilterDef = function (request) {
			return enhancedFilterDef;
		};

		service.registerRefreshRequested(function () {
			$injector.get('ppsDataCache').itemModule.clearCache();
		});

		service.initLocationPath = () => {
			setTimeout(()=> {
				handleLocationInfo(true);
			}, 200);
		};

		function handleLocationInfo(init){
			let flatGrid = platformGridAPI.grids.element('id', '3598514b62bc409ab6d05626f7ce304b');
			if (flatGrid) {
				handleGridLocationInfo(flatGrid, init);
			}
			let treeGrid = platformGridAPI.grids.element('id', '5907fffe0f9b44588254c79a70ba3af1');
			if (treeGrid) {
				handleGridLocationInfo(treeGrid, init);
			}
			let treeJobGrid = platformGridAPI.grids.element('id', '475a5d3fec674e2dbe4675e0f935c20e');
			if (treeJobGrid) {
				handleGridLocationInfo(treeJobGrid, init);
			}
			let listJobGrid = platformGridAPI.grids.element('id', '0df56a341a8e48808dd929dc8c2ed88f');
			if (listJobGrid) {
				handleGridLocationInfo(listJobGrid, init);
			}
			service.gridRefresh();
		}

		function handleGridLocationInfo(grid, init){
			let locationColumn = grid.columns.visible.find(column => column.id === 'branchpath' && column.field === 'PrjLocationFk');
			if(locationColumn){
				locationColumn.formatterOptions.items = locationInfoService.getList();
				if(init){
					platformGridAPI.columns.configuration(grid.id, grid.columns);
				}
			}
		}

		service.resetLocationInfoItems = () => {
			handleLocationInfo(false);
		};

		service.fireSelectionChanged = function fireSelectionChanged(entity) {
			serviceContainer.data.selectionChanged.fire(null, entity);
		};

		var flattenMdcGroup = [];
		service.initMdcGroupTree = (function initMdcGroupTree() {
			flattenMdcGroup = basicsLookupdataLookupDescriptorService.getData('flattenMdcGroup');
			if (!angular.isDefined(flattenMdcGroup)) {
				$http.get(globals.webApiBaseUrl + 'basics/materialcatalog/group/pps/grouptree').then(function (response) {
					flattenMdcGroup = [];
					flattenMdcGroup = cloudCommonGridService.flatten(response.data, flattenMdcGroup, 'ChildItems');
					basicsLookupdataLookupDescriptorService.updateData('flattenMdcGroup', response.data);
				});
			}
		})();

		service.getContainerData = () => serviceContainer.data;

		service.reloadSelectedItem = function reloadSelectedItem(returnValues) {
			if (returnValues.length <= 0) {
				return;
			}
			const selectedItems = returnValues.map(i => i.entity);
			return service.reloadItems(selectedItems);
		};

		service.reloadItems = (selectedItems) => {
			let oldItems = [];
			oldItems = cloudCommonGridService.flatten(selectedItems, oldItems, 'ChildItems');
			const selectedItemsIds = oldItems.map(i => i.Id);
			const pkeys = (Array.isArray(selectedItemsIds) && selectedItemsIds.length > 0)
				? selectedItemsIds.map(item => ({Id: item}))
				: [];
			let request = {
				PKeys: pkeys
			};
			return $http.post(globals.webApiBaseUrl + 'productionplanning/item/customfiltered', request).then(function (response) {
				if (response.data) {
					let customColumnsService = customColumnsServiceFactory.getService(moduleName);
					let flatItems = [];
					_.forEach(response.data.dtos, function (dto){
						service.setDefaultDrawingFromParent(dto);
					});
					flatItems = cloudCommonGridService.flatten(response.data.dtos, flatItems, 'ChildItems');
					let subItemService = $injector.get('productionplanningItemSubItemDataService');
					const simpleProcessors = _.filter(service.getDataProcessor(), function (proc) {
						return _.isFunction(proc.processItem) && proc.processItem.length === 1;
					});
					_.forEach(simpleProcessors, function (processor) {
						_.forEach(flatItems, processor.processItem);
					});
					_.forEach(selectedItemsIds, function (id) {
						var oldItem = service.getItemById(id);
						let oldItemInSub = subItemService.getItemById(id);
						var newItem = _.find(flatItems, {Id: id});
						angular.extend(oldItem, newItem);
						if (oldItemInSub) {
							angular.extend(oldItemInSub, newItem);
						}
						customColumnsService.updateDateTimeFields(oldItem);
					});
					service.gridRefresh();
					subItemService.containerRefresh();
					const excludedSerices = $injector.get('productionplanningItemUtilService').getExcludedChildServicesForRefreshing();
					service.getChildServices().filter(childService => !_.some(excludedSerices, (excludedSerice) => childService === excludedSerice)).forEach(childService => childService.load());
				}
			});
		};

		service.getServiceContainer = function () {
			return serviceContainer;
		};

		preselectionExtension.modifyMethodsForPreselection(serviceContainer.data, service);

		// For dateshift validation of dynamic slot date field, here we need to initialize ppsItemEvent dataService in advanced.
		// In initialization of ppsItemEvent dataService, a relative configuration will be registered to virtualDateshift service.(by zwz on 2021/11/18 for fixing issue of HP-ALM #125321)
		eventMainServiceFactory.getService('ItemFk','productionplanning.common.item.event',service);

		// initial characteristic data service
		const basicsCharacteristicDataServiceFactory = $injector.get('basicsCharacteristicDataServiceFactory');
		basicsCharacteristicDataServiceFactory.getService(service, ppsItemCharacteristicSection);
		basicsCharacteristicDataServiceFactory.getService(service, ppsItemCharacteristic2Section);
		basicsCharacteristicDataServiceFactory.getService(service, prodDescCharacteristicSection, 'ProductDescriptionFk');
		basicsCharacteristicDataServiceFactory.getService(service, prodDescCharacteristic2Section, 'ProductDescriptionFk');

		service.setCharacteristicColumn = function setCharacteristicColumn(colName) {
			characteristicColumn = colName;
		};
		service.getCharacteristicColumn = function getCharacteristicColumn() {
			return characteristicColumn;
		};

		// Comment below line If default characteristic need to be created with new pps item. -maj
		basicsCommonCharacteristicService.unregisterCreateAll(service, ppsItemCharacteristicSection, ppsItemCharacteristic2Section);
		basicsCommonCharacteristicService.unregisterCreateAll(service, prodDescCharacteristicSection, prodDescCharacteristic2Section);

		service.isCharacteristicCellReadonly = function(item, field) {
			return item[field] === null;
		};

		function appendProdDescCharacteristicCols() {
			const itemsList = service.getUnfilteredList(); // get flat list
			appendCharacteristicColsOfContainer(itemsList, prodDescCharacteristic2Section, '3598514b62bc409ab6d05626f7ce304b'); // list
			appendCharacteristicColsOfContainer(itemsList, prodDescCharacteristic2Section, '0df56a341a8e48808dd929dc8c2ed88f'); // list by job
			appendCharacteristicColsOfContainer(itemsList, prodDescCharacteristic2Section, '5907fffe0f9b44588254c79a70ba3af1'); // tree
			appendCharacteristicColsOfContainer(itemsList, prodDescCharacteristic2Section, '475a5d3fec674e2dbe4675e0f935c20e'); // tree by job
			appendCharacteristicColsOfContainer(itemsList, prodDescCharacteristic2Section, '4ddf9e9220f44a22b29c97ecd41c7ab2'); // child list
		}

		function appendPpsItemCharacteristicCols() {
			const items = service.getUnfilteredList(); // get flat list
			appendCharacteristicColsOfContainer(items, ppsItemCharacteristic2Section, '3598514b62bc409ab6d05626f7ce304b'); // list
			appendCharacteristicColsOfContainer(items, ppsItemCharacteristic2Section, '0df56a341a8e48808dd929dc8c2ed88f'); // list by job
			appendCharacteristicColsOfContainer(items, ppsItemCharacteristic2Section, '5907fffe0f9b44588254c79a70ba3af1'); // tree
			appendCharacteristicColsOfContainer(items, ppsItemCharacteristic2Section, '475a5d3fec674e2dbe4675e0f935c20e'); // tree by job
			appendCharacteristicColsOfContainer(items, ppsItemCharacteristic2Section, '4ddf9e9220f44a22b29c97ecd41c7ab2'); // child list
		}

		function appendCharacteristicColsOfContainer(items, section, gridId, isAfterCreated) {
			const containerInfoService = $injector.get('productionplanningItemContainerInformationService');
			const characterColumnService =  $injector.get('basicsCharacteristicColumnServiceFactory')
				.getService(service, section, gridId, containerInfoService);

			if (isAfterCreated) {
				characterColumnService.appendDefaultCharacteristicCols(items);
			} else {
				characterColumnService.appendCharacteristicCols(items);
			}
		}

		serviceContainer.data.materialFkChanged = new PlatformMessenger();
		service.registerMaterialFkChanged = function registerMaterialFkChanged(callBackFn) {
			serviceContainer.data.materialFkChanged.register(callBackFn);
		};
		service.fireMaterialFkChanged = function fireMaterialFkChanged(entity) {
			serviceContainer.data.materialFkChanged.fire(entity);
		};

		serviceContainer.service.getLastSelection = () =>{
			return serviceContainer.data.lastSelection;
		};
		serviceContainer.service.setLastSelection = (item) =>{
			serviceContainer.data.lastSelection = item;
		};

		service.appendItems = (subItems) =>{
			let rootItem = _.find(serviceContainer.data.itemList, (item)=>{
				return item.Id === subItems[0].PPSItemFk;
			});
			serviceContainer.data.itemList = serviceContainer.data.itemList.concat(subItems);
			// if(rootItem) {
			// 	rootItem.ChildItems = rootItem.ChildItems === null ? subItems : rootItem.ChildItems.concat(subItems);
			// 	rootItem.HasChildren = true;
			// 	if (angular.isDefined(rootItem.nodeInfo)) {
			// 		rootItem.nodeInfo.children = true;
			// 		rootItem.nodeInfo.collapsed = false;
			// 		rootItem.nodeInfo.lastElement = false;
			// 	}
			// }
			// serviceContainer.data.listLoaded.fire();
		};

		service.clearModifications = function() {
			return serviceContainer.data.doClearModifications();
		};

		service.loadSubItemsForRefresh = false;
		service.loadSubItems = (parentItem) => {
			let subItemService = $injector.get('productionplanningItemSubItemDataService');
			if (subItemService !== null) {
				subItemService.setParentItemFilter(parentItem);
				var subItemSelected = subItemService.getSelected();
				if(!subItemSelected || subItemSelected.PPSItemFk !== parentItem.Id) {
					let utilSrv = $injector.get('transportplanningTransportUtilService');
					if (utilSrv.hasShowContainerInFront('productionplanning.item.listSubItem')) {
						subItemService.loadSubItems(parentItem);
					}
				}
				subItemService.resetLockIcon(false);
			}
		};
		service.fireListLoaded = function fireListLoaded() {
			serviceContainer.data.listLoaded.fire();
		};

		service.setPPSDocConfig = function setPPSDocConfig(containerId, parentSrvName, selectedItem){
			var dataFactory = $injector.get('ppsCommonDocumentCombineDataServiceFactory');
			if(dataFactory){
				dataFactory.setConfig(containerId, parentSrvName, selectedItem);
			}
		};

		service.refreshSubContainersAfterRecalculate = function refreshSubContainersAfterRecalculate(){
			const utilSrv = $injector.get('transportplanningTransportUtilService');
			const characteristicDataGroupServiceFactory = $injector.get('basicsCharacteristicDataGroupServiceFactory');
			const characteristicColumnServiceFactory = $injector.get('basicsCharacteristicDataServiceFactory');
			const selected = service.getSelected();
			const contextId = selected.ProductDescriptionFk || -1;

			if (utilSrv.hasShowContainer('productionplanning.item.producttemplate.characteristic')) {
				characteristicDataGroupServiceFactory.getService(61, service).loadData(contextId, '');
				characteristicColumnServiceFactory.getService(service, 61).load();
			}
			if (utilSrv.hasShowContainer('productionplanning.item.producttemplate.characteristic2')) {
				characteristicDataGroupServiceFactory.getService(62, service).loadData(contextId, '');
				characteristicColumnServiceFactory.getService(service, 62).load();
			}
			if (utilSrv.hasShowContainer('productionplanning.item.productDesc.detail')) {
				var productDescService = $injector.get('productionplanningItemProductTemplateService');
				productDescService.load();
			}
		};

		/**
		 * @ngdoc function
		 * @name mergeWithCopySplitItems
		 * @function
		 * @methodOf PPSItemDataService
		 * @description merge new items after copy or split a pps item
		 * @param {Array} itemsToAdd
		 * @param {Object} selectedItem item being copy or split
		 * @param {Boolean} afterSplit
		 * @returns void
		 */
		service.mergeWithCopySplitItems = function(itemsToAdd, selectedItem, afterSplit) {
			if (_.isNil(itemsToAdd) || _.isNil(selectedItem)) {
				return;
			}

			const data = serviceContainer.data;
			const newItems = data.asFlatList(itemsToAdd);

			platformDataServiceDataProcessorExtension.doProcessData(newItems, data);

			if (afterSplit) {
				const oldItem = service.getItemById(selectedItem.Id);
				const newItem = newItems.filter(i => i.Id === oldItem.Id)[0];
				Object.assign(oldItem, newItem);
				newItem.ChildItems.forEach(item => {
					const oldItem = _.find(data.itemList, {Id: item.Id});
					if (oldItem) {
						// replace the old item
						const index = data.itemList.indexOf(oldItem);
						data.itemList.splice(index, 1, item);
					} else {
						data.itemList.push(item);
					}
				});
			} else if (selectedItem.PPSItemFk !== null) { // copy a child item
				const parentItem = service.getItemById(selectedItem.PPSItemFk);
				parentItem.ChildItems.push(...newItems);
				data.itemList.push(...newItems);
			} else { // copy a root item
				newItems.forEach(item => {
					data.itemTree.push(item);
					data.itemList.push(item);
					data.entityCreated.fire(null, item);
				});
			}

			newItems.forEach(item => {
				item._visibility = ['standard', 'byJob', 'treeByJob'];
				item.RootFk = selectedItem.RootFk || selectedItem.Id;
				service.syncDynamicColumns(item.Id);
			});

			service.fireListLoaded();
			service.gridRefresh();
			service.setSelected(newItems[0]);
		};

		service.subItemDescriptionCodeChanged = false;
		service.setSubItemDescriptionCodeChanged = (flag) =>{
			service.subItemDescriptionCodeChanged = flag;
		};

		service.synClerk4PUsWithSameEngineerEvent = (entity, value, field) =>{
			if(entity.EventTypeEntities.length === 0  || entity.EventEntities.length === 0){
				return;
			}
			let engType = _.find(entity.EventTypeEntities, function (type){
				return type.PpsEntityFk === ppsEntityConstant.EngineeringTask;
			});
			if(_.isNil(engType)){
				return;
			}
			let engineerEvent = _.find(entity.EventEntities, function (event){
				return event.EventTypeFk === engType.Id;
			});

			if(engineerEvent){
				$http.get(globals.webApiBaseUrl + 'productionplanning/common/item2event/listbyevent?eventId='+ engineerEvent.Id).then(function (response) {
					let itemFks = _.map(response.data, 'ItemFk');
					let itemList = service.getUnfilteredList();
					let subPUService = $injector.get('productionplanningItemSubItemDataService');
					let subPUList = subPUService.getUnfilteredList();
					setNewSlot(itemFks, itemList);
					setNewSlot(itemFks,subPUList);
					service.gridRefresh();
					subPUService.gridRefresh();
					function setNewSlot(itemFks, items){
						if(itemFks.length < 1 || items.length < 1){
							return;
						}
						_.forEach(itemFks, function (itemFk) {
							let matchItem = _.find(items, function (item) {
								return item.Id === itemFk;
							});
							if(matchItem){
								matchItem[field] = value;
							}
						});
						service.clerkChanged = true;
					}
				});
			}
		};

		function containsParentSharedEvents(ppsItem){
			if(_.isNil(ppsItem) || ppsItem.PPSItemFk === null || ppsItem.EventEntities.length === 0){
				return false;
			}

			return _.some(ppsItem.EventEntities, function (event) {
				return event.ItemFk !== ppsItem.Id;
			});
		}

		service.setPrjLocation = function (ppsItem, prjLocation){
            if(containsParentSharedEvents(ppsItem)){
				let eventMainServiceFactory = $injector.get('productionplanningCommonEventMainServiceFactory');
				let eventService = eventMainServiceFactory.getService('ItemFk','productionplanning.common.item.event',service);
				if(eventService) {
					var selectedPrjLocationId = prjLocation ? prjLocation.Id : null;
					// change sequence events' PrjLocation of PU
					var argsPass = {
						foreignKey: 'ItemFk',
						foreignValue: ppsItem.Id,
						prjLocationId: selectedPrjLocationId
					};
					eventService.onPrjLocationChanged.fire(argsPass);

					// change parent PU's PrjLocation and sequence events' PrjLocation of it if PU's PrjLocation is null
					var parentItem = service.getItemById(ppsItem.PPSItemFk);
					while (parentItem) {
						if(parentItem.PrjLocationFk === null){
							parentItem.PrjLocationFk = selectedPrjLocationId;
							var argsOfParentItem = {
								foreignKey: 'ItemFk',
								foreignValue: parentItem.Id,
								prjLocationId: parentItem.PrjLocationFk
							};
							eventService.onPrjLocationChanged.fire(argsOfParentItem);
							var copiedParentItem = _.clone(parentItem);
							copiedParentItem.ChildItems = []; // for do update with child item in the meantime
							service.markItemAsModified(copiedParentItem);
						}
						parentItem = service.getItemById(parentItem.PPSItemFk);
					}
				}
			} else {
				const clipBoardService = $injector.get('productionplanningItemClipBoardService');
				clipBoardService.setPrjLocation(ppsItem, prjLocation);
			}
		};

		//status change
		service.getToHandleEntities = () => {
			let subItemService = $injector.get('productionplanningItemSubItemDataService');
			if(subItemService) {
				return subItemService.IsContainerLocked() ? subItemService.getSelectedEntities() : service.getSelectedEntities();
			}
			return service.getSelectedEntities();
		};

		return service;
	}
})(angular);
