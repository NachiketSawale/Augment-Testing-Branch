/*
 * $Id$
 * Copyright (c) RIB Software GmbH
 */

(function () {
	'use strict';

	/**
	 * @ngdoc service
	 * @name platform:platformDataServiceEntityRoleExtension
	 * @function
	 * @description
	 * platformDataServiceEntityRoleExtension adds method defining the basic data service behaviours
	 */
	angular.module('platform').service('platformDataServiceEntityRoleExtension', PlatformDataServiceEntityRoleExtension);

	PlatformDataServiceEntityRoleExtension.$inject = ['_', '$q', 'platformContextService', 'platformDataServiceDataProcessorExtension',
		'platformDataServiceSelectionExtension', 'cloudDesktopSidebarService', 'platformObjectHelper', 'platformHeaderDataInformationService',
		'platformDataServiceModificationTrackingExtension', 'platformModuleDataExtensionService', 'platformDataServiceValidationErrorHandlerExtension',
		'platformModuleStateService', 'platformDataServiceDataPresentExtension', 'platformDataValidationService', 'platformDataServiceReloadEntitiesExtension',
		'platformSystemOptionService', 'platformRuntimeDataService', '$rootScope', '$injector', 'cloudCommonLastObjectsService'];

	/* jshint -W072 */ // many parameters because of dependency injection
	function PlatformDataServiceEntityRoleExtension(_, $q, platformContextService, platformDataServiceDataProcessorExtension,
		platformDataServiceSelectionExtension, cloudDesktopSidebarService, platformObjectHelper, platformHeaderDataInformationService,
		platformDataServiceModificationTrackingExtension, platformModuleDataExtensionService, platformDataServiceValidationErrorHandlerExtension,
		platformModuleStateService, platformDataServiceDataPresentExtension, platformDataValidationService, platformDataServiceReloadEntitiesExtension,
		platformSystemOptionService, platformRuntimeDataService, $rootScope, $injector, cloudCommonLastObjectsService) {// Last
		/**
		 * @ngdoc function
		 * @name state
		 * @function
		 * @methodOf platform.platformDataServiceEntityRoleExtension
		 * @description adds selection behaviour to data services
		 * @param container {object} contains entire service and its data to be created
		 * @returns state
		 */
		var self = this;

		var modelViewerFilteringSelectionService = null;

		let basicsCommonActiveCollaboratorsService = null;

		this.addEntityRole = function addEntityRole(container, options) {
			if (options.entityRole) {
				if (options.entityRole.root) {
					self.addEntityRoleRoot(container, options, options.presenter.tree);
				} else if (options.entityRole.node) {
					self.addEntityRoleNode(container, options);
				} else if (options.entityRole.leaf) {
					self.addEntityRoleLeaf(container, options);
				} else {
					self.addEntityRoleUnknown(container, options);
				}
			} else {
				self.addEntityRoleUnknown(container, options);
			}
		};

		this.addUpdateBasicFunctions = function (container) {
			container.data.mergeItemAfterSuccessfullUpdate = function mergeItemAfterSuccessfullUpdate(oldItem, newItem, handleItem, data) {
				if (!oldItem || !oldItem.Id) {
					return;
				}

				var treeInfo = {};
				if (data.saveItemChildInfo) {
					data.saveItemChildInfo(oldItem, treeInfo, data);
				}

				if (handleItem) {
					angular.extend(oldItem, newItem);
				}

				if (data.updateTranslationAfterUpdate) {
					data.updateTranslationAfterUpdate(oldItem, data);
				}

				platformDataServiceDataProcessorExtension.doProcessItem(oldItem, data);
				container.data.itemModified.fire(null, oldItem);

				if (treeInfo.hasChildren) {
					data.reestablishItemChildInfo(oldItem, treeInfo, data);
				}
			};
		};

		this.addEntityRoleBasics = function addEntityRoleBasics(container, roleOpt, options) {
			container.data.itemName = roleOpt.itemName;
			container.data.doesRequireLoadAlways = roleOpt.doesRequireLoadAlways || false;

			container.data.addEntityToCache = _.noop;

			container.service.getItemName = function getItemName() {
				return container.data.itemName;
			};

			container.service.saveRecentChangesIfResponsibleServiceChanges = function saveRecentChangesIfResponsibleServiceChanges(newContinerId) {
				if(_.isFunction(container.data.updateOnSelectionChanging) && !data.hasUsingContainer(newContinerId)) {
					container.data.updateOnSelectionChanging(container.data, platformDataServiceSelectionExtension.getSelected(container.data), true);
				}
				else if(container.data.isRoot && _.isFunction(container.service.update) && !data.hasUsingContainer(newContinerId)) {
					container.service.update(true, true);
				}
			};

			if (options.filterByViewer) {
				if (!modelViewerFilteringSelectionService) {
					modelViewerFilteringSelectionService = $injector.get('modelViewerFilteringSelectionService');
				}

				container.data.filterByViewerManager = new modelViewerFilteringSelectionService.FilterByViewerManager(container.service, options.filterByViewer);

				container.service.isFilterByViewerActive = function () {
					return container.data.filterByViewerManager.isActive();
				};
				container.service.setFilterByViewerActive = function (newValue) {
					container.data.filterByViewerManager.setActive(newValue);
				};
				container.service.addFilterByViewerButton = function (buttonInfo) {
					container.data.filterByViewerManager.addButton(buttonInfo);
				};
				container.service.removeFilterByViewerButton = function (buttonInfo) {
					container.data.filterByViewerManager.removeButton(buttonInfo);
				};
			}
		};

		this.addEntityRoleParent = function doAddEntityRoleParent(container) {
			container.data.registerAndCreateEventMessenger('updateDone');// The main entity has been stored with all its dependent data, the dependent data on the client can be refreshed with the server response
			container.data.registerAndCreateEventMessenger('refreshRequested');// User presses refresh button
			container.data.childServices = [];

			container.data.isParentItem = function isParentItemInParent() {
				return true;
			};

			container.data.unloadSubEntities = function unloadSubEntitiesInParent(data) {
				self.unloadSubEntities(data);
			};

			container.service.reduceTreeStructuresInUpdateData = function reduceTreeStructuresInUpdateDataInParent(updateData, data, isTriggeredBySelectionOrContainerChange) {
				var res = container.data.reduceOwnTreeStructuresInUpdateData(updateData, container.data, isTriggeredBySelectionOrContainerChange);

				_.forEach(container.data.childServices, function (childService) {
					childService.reduceTreeStructuresInUpdateData(res, container.data, isTriggeredBySelectionOrContainerChange);
				});
			};

			container.service.getChildServices = function getChildServicesOfParent() {
				return container.data.childServices;
			};

			container.service.registerChildService = function registerChildService(childService) {
				container.data.childServices.push(childService);
			};

			container.service.registerUpdateRequested = function registerUpdateRequested() {
			};

			container.service.unregisterUpdateRequested = function unregisterUpdateRequested() {
			};

			container.service.clearCache = function clearCacheInParent() {
				self.clearEntireCache(container.data);

				self.clearDependentCaches(container.data);
			};

			container.service.unloadSubEntities = function unloadSubEntitiesInParent(keepSelection) {
				self.unloadSubEntities(container.data, keepSelection);

				self.unloadOwnEntities(container.data, keepSelection);
			};

			container.service.setTriggerLoadOnSelectedEntitiesChanged = function setTriggerLoadOnSelectedEntitiesChanged(flag) {
				container.data.triggerLoadOnSelectedEntitiesChanged = flag;
			};
		};

		this.addEntityRoleRootSidebarInfos = function addEntityRoleRootSidebarInfos(container, options) {
			var searchOption = options.sidebarSearch;
			if (searchOption && searchOption.options) {
				container.service.hasSidebar = true;
				container.service.hasSidebarPaging = !!searchOption.options.pageSize;
				container.service.refreshSelectedEntities = function refreshSelectedEntities() {
					var entities = platformDataServiceSelectionExtension.getSelectedEntities(container.data);

					return self.refreshGivenEntities(entities, container.data, options, true);
				};
				container.service.refreshEntities = function refreshEntities(entities, cleanChildren = true) {
					return self.refreshGivenEntities(entities, container.data, options, cleanChildren);
				};
				container.service.refreshEntitiesFromComplete = function refreshEntitiesFromComplete(complete) {
					var entities = _.get(complete, options.entityRole.root.itemName);
					if ((!_.isArray(entities) || entities.length === 0) && complete.MainItemId > 0) {
						entities = [];
						let entity = container.data.getItemById(complete.MainItemId, container.data);
						if (entity) {
							entities.push(entity);
						}
					}
					return self.refreshGivenEntities(entities, container.data, options, true);
				};
				container.data.getEntitiesFromLoadedData = function getEntitiesFromLoadedData(response) {
					if (options.entityRole.root.responseDataEntitiesPropertyName) {
						return _.get(response, options.entityRole.root.responseDataEntitiesPropertyName);
					} else if (_.isArray(response.dtos)) {
						return response.dtos;
					}

					return [];
				};
			} else {
				container.service.hasSidebar = false;
				container.service.hasSidebarPaging = false;
			}
		};

		function needsToReload(container, currentPinningContext, dataservice) {
			for (let i = 0; i < currentPinningContext.length; i++){
				if(currentPinningContext[i].token.startsWith('model.')){
					return false;
				}
			}
			if(dataservice && dataservice.getModule().name === container.data.currentlyOpenedModule)
			{
				return false;
			}
			return true;
		}


		this.addPinningContextBehavior = function addPinningContextBehavior(container, options) {
			if (options.sidebarSearch && options.sidebarSearch.options) {
				const pinningOptions = options.sidebarSearch.options.pinningOptions;
				if(pinningOptions && pinningOptions.isActive) {
					platformSystemOptionService.shallReloadOnPinningChange().then(function(shallReload) {
						container.data.reloadOnPinningContextChange = function reloadOnPinningContextChange(currentPinningContext, dataservice) {
							if(needsToReload(container, currentPinningContext, dataservice)) {
								container.data.doClearModifications(null, container.data);
								container.service.unloadSubEntities(false);
								container.service.clearCache();
								container.data.requiresRefresh = true;
								container.data.lastPinnedContext = currentPinningContext;
							}
						};

						container.service.requiresRefresh = function requiresRefresh() {
							return container.data.requiresRefresh || false;
						};

						container.service.unHookRequiresRefresh = function unHookRequiresRefresh() {
							container.data.requiresRefresh = false;
						};

						let pinningContextService = $injector.get('cloudDesktopPinningContextService');
						pinningContextService.onSetPinningContext.register(container.data.reloadOnPinningContextChange);
					});
				}
			}
		};

		this.addEntityRoleRoot = function doAddEntityRoleRoot(container, options, tree) {
			var opt = options.entityRole.root;
			self.addEntityRoleBasics(container, opt, options);
			self.addUpdateBasicFunctions(container, opt, options);
			self.addEntityRoleParent(container, opt);
			self.addEntityRoleRootSidebarInfos(container, options);
			self.addPinningContextBehavior(container, options);

			container.data.isChildItem = function isParentItemInChild() {
				return false;
			};

			container.data.reduceTreeStructuresInUpdateData = function reduceTreeStructuresInUpdateDataInRoot(updateData, data, isTriggeredBySelectionOrContainerChange) {
				var res = _.cloneDeep(updateData);
				data.reduceOwnTreeStructuresInUpdateData(res, data, isTriggeredBySelectionOrContainerChange);

				_.forEach(data.childServices, function (childService) {
					if (_.isFunction(childService.reduceTreeStructuresInUpdateData)) {
						childService.reduceTreeStructuresInUpdateData(res, data, isTriggeredBySelectionOrContainerChange);
					}
				});

				return res;
			};

			if (_.isFunction(opt.provideIdentificationFn)) {
				container.data.provideEntityIdentification = function provideEntityIdentification(entity) {
					return opt.provideIdentificationFn(entity);
				};
			}
			container.data.isRealRootForOpenedModule = function isRealRootForOpenedModule() {
				var myModule = opt.lastObjectModuleName || opt.rootForModule;
				if (!myModule) {
					return true;
				}

				return myModule === container.data.currentlyOpenedModule;
			};

			container.data.waitForOutstandingDataTransfer = function waitForOutstandingDataTransfer() {
				return $q.when(true);
			};

			platformModuleDataExtensionService.initializeRootUpdateDataExtensionEvent(container.data);

			container.data.currentlyOpenedModule = '';
			container.data.isRoot = true;
			container.service.isRoot = true;

			container.service.setCurrentlyOpenedModule = function setCurrentlyOpenedModule(mod) {
				container.data.currentlyOpenedModule = mod;
			};

			container.service.registerUpdateDataExtensionEvent = function registerUpdateDataExtensionEvent(callBackFn) {
				platformModuleDataExtensionService.registerUpdateDataExtensionEvent(callBackFn, container.data);
			};

			container.service.unregisterUpdateDataExtensionEvent = function unregisterUpdateDataExtensionEvent(callBackFn) {
				platformModuleDataExtensionService.unregisterUpdateDataExtensionEvent(callBackFn, container.data);
			};

			container.data.clearDependentCaches = function clearDependentCaches(data) {
				self.clearDependentCaches(data);
			};
			container.data.onCompanyContextChanged = function onCompanyContextChanged(hint) {
				if (hint === 'companyConfiguration' && container.data.itemList && container.data.itemList.length>0) {
					container.service.update().then(function () {
						self.clearRootData(container.service, container.data, tree);
						self.clearDependentCaches(container.data);
					});
				}
			};

			container.service.clear = function clearRoot() {
				if (container.data.clearTranslationChanges && container.service.hasSelection && container.service.hasSelection()) {
					var selected = platformDataServiceSelectionExtension.getSelected(container.data);
					container.data.clearTranslationChanges(selected, container.data);
				}
				self.clearRootData(container.service, container.data, tree);
			};

			container.service.refresh = function refresh() {
				var sel = platformDataServiceSelectionExtension.getSelected(container.data);
				container.data.doClearModifications(null, container.data);
				container.data.refreshRequested.fire();

				container.service.unloadSubEntities(false);
				container.service.clearCache();
				platformDataServiceSelectionExtension.deselect(container.data);

				// only if is real root!
				if (container.data.isRealRootForOpenedModule()) {
					platformModuleStateService.clearState(container.service);
				}

				return container.data.doReadData(container.data, true).then(function (res) {
					if (sel) {
						var newSel = container.data.getItemById(sel.Id, container.data);
						if (newSel) {
							platformDataServiceSelectionExtension.doSelect(newSel, container.data);
						}
					}

					return res;
				});
			};

			container.service.isModelChanged = function () {
				return platformDataServiceModificationTrackingExtension.hasModifications(container.service);
			};

			if (!container.data.doPrepareDelete) {
				container.data.doPrepareDelete = function () {
				};// Encapsulates differences in flat / hierarchical presentations
			}

			if (!container.data.onDeleteDone) {
				container.data.onDeleteDone = function () {
				};// Encapsulates differences in flat / hierarchical presentations
			}

			container.data.rootOptions = opt;
			if (opt.codeField && opt.descField) {
				container.data.createLastObjects = function createLastObjects(updatedData) {
					var lastObjectList = cloudDesktopSidebarService.createLastObjectList(opt.lastObjectModuleName);

					/*
					 creates one lastObject item, prepares the root item specific summary
					 */
					var summary = platformObjectHelper.getValue(updatedData, opt.codeField);
					var desc = platformObjectHelper.getValue(updatedData, opt.descField);
					if (desc && desc.length > 0) {
						summary += summary ? ',' : '';
						summary += desc;
					}
					summary = summary || '????';
					cloudDesktopSidebarService.addLastObjectToList(lastObjectList, summary, updatedData.Id);

					// now add lastObjects to sidebar lastObject panel and save it to backend
					cloudDesktopSidebarService.addLastObjects(lastObjectList);
				};
			}
			container.service.saveLastObjects = function saveLastObjects(){
				if (opt.addToLastObject) {
					cloudCommonLastObjectsService.saveLastObjects();
				}
			};

			container.data.handleOnUpdateSucceeded = function handleOnUpdateSucceeded(updateData, response, data, handleItem) {
				if (response[opt.itemName]) {
					var responseArray = [];
					if (angular.isArray(response[opt.itemName])) {
						responseArray = response[opt.itemName]; // array item case -> just use the array as it is
					} else if (angular.isObject(response[opt.itemName])) {
						responseArray.push(response[opt.itemName]); // single item case -> for simplicity sake added to an array
					}

					angular.forEach(responseArray, function (item) {
						var oldItem = _.find(data.itemList, {Id: item.Id});

						if (oldItem) {
							data.mergeItemAfterSuccessfullUpdate(oldItem, item, handleItem, data);
							platformDataServiceDataProcessorExtension.doProcessItem(oldItem, data);
						}
					});
				}
			};

			container.data.needsMergeBecauseChildForcesUpdate = function needsMergeBecauseChildForcesUpdate(data) {
				var res = false;
				_.forEach(data.childServices, function (child) {
					if (child.canForceUpdate && child.canForceUpdate()) {
						res = true;
					}
				});
				return res;
			};

			container.data.hasStillSameChildData = function hasStillSameChildData(updateData, data) {
				var stillSame = false;
				if (data.needsMergeBecauseChildForcesUpdate(data)) {
					stillSame = true;
				} else if (!data.selectedItem) {
					stillSame = false;
				} else if (data.selectedItem.Id === updateData.MainItemId) {
					// Save has not been triggered by a selection change so the dependent child data must also be updated
					stillSame = true;
				} else {
					// In case of tree there may be the case, that on parent instance the data of all children is available
					if (data.treePresOpt) {
						var filter = {Id: data.selectedItem[data.treePresOpt.parentProp]};
						var current = _.find(data.itemList, filter);
						while (!stillSame && current && current.Id > 0) {
							if (current.Id === updateData.MainItemId) {
								stillSame = true;
							} else {
								filter.Id = current[data.treePresOpt.parentProp];
								current = _.find(data.itemList, filter);
							}
						}

						if (!stillSame) {
							filter.Id = updateData.MainItemId;
							current = _.find(data.itemList, filter);
							while (!stillSame && current && current.Id > 0) {
								if (current.Id === updateData.MainItemId) {
									stillSame = true;
								} else {
									filter.Id = current[data.treePresOpt.parentProp];
									current = _.find(data.itemList, filter);
								}
							}
						}
					}
				}

				return stillSame;
			};

			/* jshint -W074 */ // For me there is no cyclomatic complexity
			container.data.onUpdateSucceeded = function onUpdateSucceeded(response, data, updateData) {

				// Disable watch on currently selected item to avoid unnecessary add to modified item list by subsequent actions
				if (response) {
					data.disableWatchSelected(data);
				}

				if (opt.handleUpdateDone) {
					opt.handleUpdateDone(updateData, response, data);
				} else {
					data.handleOnUpdateSucceeded(updateData, response, data, true);
				}

				if (data.hasStillSameChildData(updateData, data)) {
					// if the save has not been triggered by a selection change so the dependent child data must also be updated
					platformDataServiceModificationTrackingExtension.mergeInUpdateData(container.service, data, response);
				}

				if (data.callAfterSuccessfulUpdate) {
					data.callAfterSuccessfulUpdate();
				}

				if (opt.addToLastObject) {
					var mainItem = _.find(data.itemList, {Id: updateData.MainItemId});
					if (mainItem) {
						data.createLastObjects(mainItem);
					}
				}

				// handle selection in case of initial sorting
				if (opt.handleSelection) {
					opt.handleSelection();
				}
				// Enable watch on currently selected item to trigger changes done by user
				if (response) {
					data.enableWatchSelected(data.selectedItem, data);
				}
			};

			function updateInternal(data, updateData, container, ignoreNextSelectionChangeForUpdate){
				return data.doCallHTTPUpdate(updateData, data).then(function (response) {
					data.onUpdateSucceeded(response.data, data, updateData);
					platformDataServiceModificationTrackingExtension.makeEntitiesEditableAfterUpdating(response.data, data, container.service);
					$rootScope.$emit('updateDone');

					if (data.itemName) {
						var info = {
							items: _.get(response.data, data.itemName, false),
							containers: data.usingContainer,
							entityName: data.itemName
						};

						if (info.items && (!_.isArray(info.items) || (_.isArray(info.items) && info.items.length))) {
							$rootScope.$emit('dataservice:update-done', info);
						}
					}

					if(response.data.ModificationId){
						platformDataServiceModificationTrackingExtension.removeModificationFromHistory(response.data.ModificationId);
					}

					if(ignoreNextSelectionChangeForUpdate === true) {
						data.ignoreNextSelectionChangeForUpdate = false;// Update is not needed done, next update can be handled
					}

					return response.data;
				}, function (errResponse) {
					platformDataServiceModificationTrackingExtension.makeEntitiesEditableAfterUpdating(updateData, data, container.service);

					if(updateData.ModificationId){
						platformDataServiceModificationTrackingExtension.removeModificationFromHistory(updateData.ModificationId);
					}

					if(ignoreNextSelectionChangeForUpdate === true) {
						data.ignoreNextSelectionChangeForUpdate = false;// Update is not needed done, next update can be handled
					}

					return errResponse;
				});
			}

			container.data.doUpdateConcurrencyData = function doUpdateConcurrencyData(data, updateData) {
				platformDataServiceModificationTrackingExtension.addModificationToHistory(updateData);
				return updateInternal(container.data, updateData, container);
			};

			container.data.doUpdate = function doUpdate(data, isTriggeredBySelectionOrContainerChange, ignoreNextSelectionChangeForUpdate) {
				if(data.ignoreNextSelectionChangeForUpdate) {
					data.ignoreNextSelectionChangeForUpdate = false;

					return $q.when(true);
				}

				if(ignoreNextSelectionChangeForUpdate === true) {
					data.ignoreNextSelectionChangeForUpdate = true;
				}
				
				$rootScope.$emit('updateRequested');

				return $q.all([data.waitForOutstandingDataTransfer(), platformDataServiceValidationErrorHandlerExtension.assertAllValid(container.service, container.data.isRealRootForOpenedModule())])
					.then(function (responses) {
						var response = responses[1];
						if (response === true) {
							var updateData = platformDataServiceModificationTrackingExtension.getModifications(container.service);
							platformDataServiceModificationTrackingExtension.addModificationToHistory(updateData);
							platformDataServiceModificationTrackingExtension.makeEntitiesReadOnlyWhileUpdating(updateData, data, container.service);
							platformDataServiceModificationTrackingExtension.clearTranslationChangesInRoot(updateData, data, container.service);
							platformDataServiceModificationTrackingExtension.clearModificationsInRoot(container.service);
							if (container.service.doPrepareUpdateCall) {
								container.service.doPrepareUpdateCall(updateData);
							}

							if (updateData && updateData.EntitiesCount >= 1) {
								platformModuleDataExtensionService.fireUpdateDataExtensionEvent(updateData, container.data);

								// if(container.data.hasToReduceTreeStructures) {
								if (_.isFunction(container.data.reduceTreeStructuresInUpdateData)) {
									updateData = container.data.reduceTreeStructuresInUpdateData(updateData, container.data, isTriggeredBySelectionOrContainerChange);
								}
								// }

								return updateInternal(data, updateData, container, ignoreNextSelectionChangeForUpdate);
							}

							if(ignoreNextSelectionChangeForUpdate === true) {
								data.ignoreNextSelectionChangeForUpdate = false;// Update is not needed done, next update can be handled
							}

							return response;
						}
						else if(ignoreNextSelectionChangeForUpdate === true) {
							data.ignoreNextSelectionChangeForUpdate = false;// Update is done, next update can be handled
						}

						return response;
					}
				);
			};

			// Implement Delete
			container.data.deleteItem = function deleteRootItem(entity, data) {
				return self.deleteRootEntity(entity, container.service, data);
			};

			container.data.deleteEntities = function deleteEntities(entities, data) {
				return self.deleteRootEntities(entities, container.service, data);
			};

			platformHeaderDataInformationService.initDataService(container, opt);

			basicsCommonActiveCollaboratorsService = basicsCommonActiveCollaboratorsService ? basicsCommonActiveCollaboratorsService : $injector.get('basicsCommonActiveCollaboratorsService');
			basicsCommonActiveCollaboratorsService.initDataService(container, opt);

			container.data.updateOnSelectionChanging = function updateOnSelectionChanging(data, entity, ignoreNextSelectionChangeForUpdate) {
				if (data.doUpdate) {
					return data.doUpdate(data, true, ignoreNextSelectionChangeForUpdate);
				}

				return $q.when(true);
			};

			container.service.update = function (isTriggeredBySelectionOrContainerChange, ignoreNextSelectionChangeForUpdate) {
				var data = container.data;
				isTriggeredBySelectionOrContainerChange = isTriggeredBySelectionOrContainerChange ? true : false;//All old cases are not triggered by selection or container change
				if (data.doUpdate) {
					return data.doUpdate(data, isTriggeredBySelectionOrContainerChange, ignoreNextSelectionChangeForUpdate);
				}

				return $q.when(true);
			};

			container.service.updateAndExecute = function (callWhenDataIsInUpdatedStateFunc) {
				var data = container.data;

				if (data.doUpdate) {
					return data.doUpdate(data).then(
						function () {
							callWhenDataIsInUpdatedStateFunc();
							return true;
						}
					);
				}

				return $q.when(true);
			};

			container.service.updateConcurrencyData = function (updateData) {
				if(container.data.doUpdateConcurrencyData){
					return container.data.doUpdateConcurrencyData(container.data, updateData);
				}
			};

			container.service.parentService = function parentService() {
				return null;
			};

			container.data.startSubEntityLoad = function startSubEntityLoadInRootData(entity, keepSelection) {
				self.startSubEntityLoadInRoot(entity, container.data, keepSelection);
			};

			container.data.startSubEntityLoad = function startSubEntityLoadInRootService(entity, keepSelection) {
				self.startSubEntityLoadInRoot(entity, container.data, keepSelection);
			};

			container.data.doLoadOnSelectedEntitiesChanged = function doLoadOnSelectedEntitiesChangedInRootService(entities, data) {
				if (data.triggerLoadOnSelectedEntitiesChanged) {
					var entity = null;
					if (entities && entities.length > 0) {
						entity = entities[0];
					}

					self.startSubEntityLoadInRoot(entity, data);
				}
			};

			if (options.filterByViewer) {
				container.service.updateByModelObjects = function updateByModelObjects(ignoreSelection) {
					var readData = {};

					var params = cloudDesktopSidebarService.filterRequest.getFilterRequestParamsOrDefault(null);
					angular.extend(readData, params);
					readData.filter = '';
					readData.Pattern = null;

					if (!angular.isArray(readData.furtherFilters)) {
						readData.furtherFilters = [];
					}

					if (_.isFunction(container.data.extendSearchFilter)) {
						container.data.extendSearchFilter(readData, container.data);
					}

					if (!ignoreSelection) {
						var modelViewerCompositeModelObjectSelectionService = $injector.get('modelViewerCompositeModelObjectSelectionService');
						readData.furtherFilters.push({
							Token: 'MDL_OBJECT_SELECTION',
							Value: modelViewerCompositeModelObjectSelectionService.getSelectedObjectIds().useGlobalModelIds().toCompressedString()
						});
					}

					var modelViewerModelSelectionService = $injector.get('modelViewerModelSelectionService');
					readData.furtherFilters.push({
						Token: 'MDL_MODEL',
						Value: modelViewerModelSelectionService.getSelectedModelId()
					});

					container.data.doCallHTTPRead(readData, container.data, container.data.onReadSucceeded);
				};

				container.service.disableFilteringByModelObjects = function disableFilteringByModelObjects() {
					container.data.filterByViewerManager.setActive(false);
				};
			}

			platformContextService.contextChanged.register(container.data.onCompanyContextChanged);

			self.addEntityRoleInfo(container, false, options);
		};

		this.addEntityRoleNode = function (container, options) {
			var opt = options.entityRole.node;
			self.addEntityRoleBasics(container, opt, options);
			self.addEntityRoleChild(container, options);
			self.addEntityRoleParent(container, opt);

			container.data.selections = [];

			container.data.trackSelections = function trackSelections(entity, data) {
				if (!platformDataServiceSelectionExtension.isSelection(entity)) {
					return;
				}

				if (data.selections.length > 0) {
					var item = _.find(data.selections, function (elem) {
						return elem.Id === entity.Id;
					});
					if (!item || !item.Id) {
						data.selections.push(entity);
					}
				} else {
					data.selections.push(entity);
				}
			};

			container.data.deleteFromSelections = function deleteFromSelections(entity, data) {
				data.selection = _.filter(data.selection, function (item) {
					return item.Id !== entity.Id;
				});
			};

			/* jshint -W074 */ // For me there is no cyclomatic complexity
			container.data.addModificationsRecursively = function addModificationsRecursively() {
			};

			container.data.killRunningLoad = function killRunningLoadInParentData() {
				self.killRunningLoadInParent(true, container.data);
			};

			container.service.killRunningLoad = function killRunningLoadInParentService() {
				self.killRunningLoadInParent(true, container.data);
			};

			container.data.startSubEntityLoad = function startSubEntityLoadInNodeData(entity) {
				self.startSubEntityLoadInNode(entity, container.data);
			};

			container.data.doLoadOnSelectedEntitiesChanged = function doLoadOnSelectedEntitiesChangedInNodeService(entities, data) {
				if (data.triggerLoadOnSelectedEntitiesChanged) {
					var entity = null;
					if (entities && entities.length > 0) {
						entity = entities[0];
					}

					self.startSubEntityLoadInNode(entity, data);
				}
			};

			container.data.startSubEntityLoad = function startSubEntityLoadInNodeService(entity) {
				self.startSubEntityLoadInNode(entity, container.data);
			};

			container.service.canForceUpdate = function canForceUpdate() {
				return !!container.data.forceNodeItemCreation;
			};
		};

		this.addEntityRoleLeaf = function addEntityRoleLeaf(container, options) {
			container.service.getChildServices = function getLeafChildServices() {
				return [];
			};

			var opt = options.entityRole.leaf;
			self.addEntityRoleBasics(container, opt, options);
			self.addEntityRoleChild(container, options);

			container.data.killRunningLoad = function killRunningLoadInLeafData() {
				self.killRunningLoadInLeaf(container.data);
			};

			container.service.reduceTreeStructuresInUpdateData = function reduceTreeStructuresInUpdateDataInLeaf(updateData, data, isTriggeredBySelectionOrContainerChange) {
				return container.data.reduceOwnTreeStructuresInUpdateData(updateData, container.data, isTriggeredBySelectionOrContainerChange);
			};

			container.service.killRunningLoad = function killRunningLoadInLeafService() {
				self.killRunningLoadInLeaf(container.data);
			};

			container.service.unloadSubEntities = function unloadSubEntitiesInLeafService(keepSelection) {
				self.unloadOwnEntities(container.data, keepSelection);
			};

			container.service.clearCache = function clearCacheInLeaf() {
				self.clearEntireCache(container.data);
			};
		};

		this.addEntityRoleChild = function (container, options) {
			var opt = options.entityRole.leaf || options.entityRole.node;
			self.addUpdateBasicFunctions(container, opt);
			container.data.parentService = opt.parentService;
			if (opt.parentFilter) {
				container.data.parentFilter = opt.parentFilter;
			}

			container.data.supportUpdateOnSelectionChanging = true;

			container.data.updateOnSelectionChanging = function updateOnSelectionChanging(data, entity, ignoreNextSelectionChangeForUpdate) {
				const rootService = data.rootService();
				if(data.supportUpdateOnSelectionChanging && rootService && _.isFunction(rootService.update)) {
					return rootService.update(true, ignoreNextSelectionChangeForUpdate);
				}

				return $q.when(true);
			};

			container.data.rootService = function getRootService() {
				let parentService = container.data.parentService;

				while(parentService && !parentService.isRoot) {
					parentService = parentService.parentService();
				}

				return parentService;
			}

			if (opt.parentService.isSubItemService()) {
				container.data.cache = {
					// Provides for each selected parent node one object with displayed items, selected items and modified items, all stored in arrays.
				};

				container.data.usesCache = true;

				container.data.doClearModificationsFromCache = function doClearModificationsFromCache(entity, data) {
					if (entity) {
						self.clearEntityDataInCache(entity, data);
					} else {
						self.clearEntireCache(data);
					}
				};

				container.data.addEntityToCache = function addEntityToCache(entity, data) {
					var currentParentItem = angular.isDefined(data.currentParentItem) && (data.currentParentItem !== null) ? data.currentParentItem : container.data.parentService.getSelected();
					var cache = angular.isDefined(currentParentItem) && (currentParentItem !== null) ? data.provideCacheFor(currentParentItem.Id, data) : null;
					if (cache) {
						cache.loadedItems.push(entity);
					}
				};

				container.data.doClearModificationsForItemFromCache = function doClearModificationsForItemFromCache(itemID, data) {
					var cache = data.provideCacheFor(itemID, data);

					if (cache) {
						cache.loadedItems.length = 0;
						cache.selectedItems.length = 0;
						cache.modifiedItems.length = 0;
						cache.deletedItems.length = 0;

						delete data.cache[itemID];
					}
				};

				container.data.getFromCacheIfModified = function getFromCacheIfModified(item, updateData, data) {
					var cache = data.provideCacheFor(updateData.MainItemId, data);
					var found;

					if (cache) {
						found = _.find(cache.modifiedItems, {Id: item.Id});
					}

					return found;
				};

				container.data.addFromCacheAllModifiedItemsTo = function addFromCacheAllModifiedItemsTo(updateData, data) {
					var cache = data.provideCacheFor(updateData.MainItemId, data);
					var needRegisterUpdateDone = false;

					if (cache) {
						if (cache.modifiedItems.length > 0 || cache.deletedItems.length > 0) {
							needRegisterUpdateDone = true;

							if (cache.modifiedItems.length > 0) {
								updateData[data.itemName + 'ToSave'] = [];
								for (var k = 0; k < cache.modifiedItems.length; ++k) {
									var toModify = {};
									angular.extend(toModify, cache.modifiedItems[k]);
									platformDataServiceDataProcessorExtension.revertProcessItem(toModify, data);

									updateData[data.itemName + 'ToSave'].push(toModify);
								}
								updateData.EntitiesCount += cache.modifiedItems.length;
							}

							if (cache.deletedItems.length > 0) {
								updateData[data.itemName + 'ToDelete'] = [];
								for (var n = 0; n < cache.deletedItems.length; ++n) {
									updateData[data.itemName + 'ToDelete'].push(cache.deletedItems[n]);
								}
								updateData.EntitiesCount += cache.deletedItems.length;
							}
						}
					}

					return needRegisterUpdateDone;
				};

				container.data.provideCacheFor = function provideCacheFor(itemID, data) {
					return data.cache[itemID];
				};

				container.data.storeCacheFor = function storeCacheFor(item, data) {
					var itemCache = data.cache[item.Id];

					if (!itemCache) {
						itemCache = {
							loadedItems: [],
							selectedItems: [],
							modifiedItems: [],
							deletedItems: []
						};
					}

					data.cache[item.Id] = itemCache;

					if (data.itemTree) {
						angular.forEach(data.itemTree, function (item) {
							if (!_.find(itemCache.loadedItems, {Id: item.Id})) {
								itemCache.loadedItems.push(item);
							}
						});
					} else {
						angular.forEach(data.itemList, function (item) {
							if (!_.find(itemCache.loadedItems, {Id: item.Id})) {
								itemCache.loadedItems.push(item);
							}
						});
					}

					if (data.selectedItems) {
						angular.forEach(data.selectedItems, function (item) {
							if (!_.find(itemCache.selectedItems, {Id: item.Id})) {
								itemCache.selectedItems.push(item);
							}
						});
						data.selectedItems.length = 0;
					}

					angular.forEach(data.modifiedItems, function (item) {
						if (!_.find(itemCache.modifiedItems, {Id: item.Id})) {
							itemCache.modifiedItems.push(item);
						}
					});
					data.isChanged = false;

					angular.forEach(data.deletedItems, function (item) {
						if (!_.find(itemCache.deletedItems, {Id: item.Id})) {
							itemCache.deletedItems.push(item);
						}
					});
				};

				container.service.mergeUpdatedDataInCache = function mergeUpdatedDataInCache(updateData, data) {
					var cache = data.provideCacheFor(updateData.MainItemId, data);
					var items;

					if (cache) {
						items = cache.loadedItems;
						cache.modifiedItems.length = 0;
						cache.deletedItems.length = 0;
					} else {
						items = data.itemList;
					}

					if (items && items.length) {
						var updates = updateData[data.itemName + 'ToSave'];
						_.forEach(updates, function (updated) {
							var oldItem = _.find(items, {Id: updated.Id});
							if (oldItem) {
								data.mergeItemAfterSuccessfullUpdate(oldItem, updated, true, data);
							}
						});
					}
				};
			}

			container.data.isChildItem = function isParentItemInChild() {
				return true;
			};

			container.data.isParentItem = function isParentItemInChild() {
				return false;
			};

			container.data.onRefreshRequested = function onRefreshRequested() {
				container.data.doClearModifications(null, container.data);

				container.data.loadSubItemList();
			};

			container.data.loadSubItemList = function loadSubItemListFromData() {
				return self.loadSubordinatedEntities(container.data, container.service);
			};

			container.service.loadSubItemList = function loadSubItemListFromService(keepSelection) {
				let data = container.data;

				return self.loadSubordinatedEntities(data, container.service).then(function (res) {
					if (keepSelection && data.__IdSelectedCapture) {
						data.selectedItem = _.find(data.itemList, {Id: data.__IdSelectedCapture});
						data.__IdSelectedCapture = null;
						delete data.__IdSelectedCapture;
						if (data.selectionChanged && data.selectedItem) {
							data.selectionChanged.fire(null, data.selectedItem);
						}

						return self.loadSubEntities(data, keepSelection);
					}

					return res;
				});
			};

			 /*
			 * Handle the case: click the new button to create a new record, then click the new button again,
			 * it will create a second record and simultaneously trigger auto save. It will save the first new record.
			 * However, in some business logic, the container data needs to be reloaded after the save is successful, causing the second new record to disappear.
			 * But, the second new record should be listed in the container.
			 */
			container.service.loadSubItemListIncludeUnSavedEntities = function loadSubItemListIncludeUnSavedEntities () {
				let entities = container.service.getList();
				const newEntities = _.filter(entities, { Version: 0 });
				container.service.loadSubItemList().then(function (results) {
					// Find newEntities whose IDs are not in results which are already saved
					const newEntitiesNotInResults = _.filter(newEntities, function (entity) {
						return !_.some(results, { Id: entity.Id });
					});

					// Add new entities to the list
					newEntitiesNotInResults.forEach(function (newEntity, index) {
						if (index === newEntitiesNotInResults.length - 1) {
							//the last one set as selected
							container.data.handleOnCreateSucceeded(newEntity, container.data);
						} else {
							container.data.handleCreateSucceededWithoutSelect(newEntity, container.data);
						}
					});
				});
			};

			container.data.deleteItem = function deleteChildItem(entity, data) {
				return self.deleteSubEntity(entity, container.service, data);
			};

			container.data.deleteEntities = function deleteChildEntities(entity, data) {
				return self.deleteSubEntities(entity, container.service, data);
			};

			opt.parentService.registerChildService(container.service);

			if (opt.filterParent) {
				container.data.filterParent = opt.filterParent;
			}

			container.service.parentService = function parentService() {
				return opt.parentService;
			};

			if (options.filterByViewer) {
				container.data.enhanceReadDataByModelObjectSelection = function (readData) {
					if (container.data.filterByViewerManager.isActive()) {
						var cfg = container.data.filterByViewerManager.config;
						var modelViewerCompositeModelObjectSelectionService = $injector.get('modelViewerCompositeModelObjectSelectionService');

						if (!cfg.suppressModelId) {
							var modelViewerModelSelectionService = $injector.get('modelViewerModelSelectionService');
							readData[cfg.modelPropName] = modelViewerModelSelectionService.getSelectedModelId();
						}
						readData[cfg.objectPropName] = modelViewerCompositeModelObjectSelectionService.getSelectedObjectIds().useGlobalModelIds().toCompressedString();

						if (_.isObject(cfg.additionalData)) {
							_.assign(readData, cfg.additionalData);
						}
					}
				};

				container.data.enhanceFilterByModelObjectSelection = function (readData) {
					if (container.data.filterByViewerManager.isActive()) {
						if (_.isEmpty(readData.filter)) {
							readData.filter = '?';
						} else {
							if (!readData.filter.endsWith('?') && !readData.filter.endsWith('&')) {
								readData.filter += '&';
							}
						}

						var cfg = container.data.filterByViewerManager.config;
						var modelViewerCompositeModelObjectSelectionService = $injector.get('modelViewerCompositeModelObjectSelectionService');

						var prms = {};

						if (!cfg.suppressModelId) {
							var modelViewerModelSelectionService = $injector.get('modelViewerModelSelectionService');
							prms[cfg.modelParamName] = modelViewerModelSelectionService.getSelectedModelId();
						}
						prms[cfg.objectParamName] = modelViewerCompositeModelObjectSelectionService.getSelectedObjectIds().useGlobalModelIds().toCompressedString();

						if (_.isObject(cfg.additionalData)) {
							_.assign(prms, cfg.additionalData);
						}

						readData.filter += _.map(Object.keys(prms), function (key) {
							return encodeURIComponent(key) + '=' + encodeURIComponent(prms[key]);
						}).join('&');
					}
				};

				container.service.updateByModelObjects = function updateByModelObjects() {
					container.service.load();
				};

				container.service.disableFilteringByModelObjects = function disableFilteringByModelObjects() {
				};
			}

			self.addEntityRoleInfo(container, true, options);
		};

		this.addEntityRoleUnknown = function addEntityRoleUnknown(container, options) {
			container.service.getChildServices = function getUnknownChildServices() {
				return [];
			};
			container.data.addEntityToCache = _.noop;

			self.addEntityRoleInfo(container, false, options);
		};

		this.addEntityRoleInfo = function addEntityRoleInfo(container, value, options) {
			container.service.isSubItemService = function isSubItemService() {
				return value;
			};

			if (value) {
				container.service.getModule = function getModule() {
					return container.service.parentService().getModule();
				};
			} else {
				container.service.getModule = function getModule() {
					return options.module;
				};
			}
		};

		this.deleteRootEntity = function deleteRootEntity(entity, service, data) {
			if (platformRuntimeDataService.isBeingDeleted(entity)) {
				return $q.when(true);
			}
			platformRuntimeDataService.markAsBeingDeleted(entity);

			var deleteParams = {};
			deleteParams.entity = entity;
			deleteParams.index = data.itemList.indexOf(entity);
			deleteParams.service = service;
			platformDataValidationService.removeDeletedEntityFromErrorList(entity, service);
			data.doPrepareDelete(deleteParams, data);

			if (entity.Version === 0) {
				data.onDeleteDone(deleteParams, data, null);

				return $q.when(true);
			} else {
				return data.doCallHTTPDelete(deleteParams, data, data.onDeleteDone);
			}
		};

		this.prepareMultiDelete = function prepareMultiDelete(entities) {
			var toDelete = _.filter(entities, function (entity) {
				return !platformRuntimeDataService.isBeingDeleted(entity);
			});
			if (!toDelete || toDelete.length === 0) {
				return $q.when(true);
			}
			platformRuntimeDataService.markListAsBeingDeleted(toDelete);

			return _.groupBy(entities, function (entity) {
				if (entity.version === 0 || entity.Version === 0) {
					return 'N';
				}

				return 'O';
			});
		};

		this.deleteRootEntities = function deleteRootEntities(entities, service, data) {
			var split = self.prepareMultiDelete(entities);

			var deleteParams = {};
			if (split.N && split.N.length > 0) {
				deleteParams.entities = split.N;
				if (!split.O || split.O.length === 0) {
					deleteParams.index = data.itemList.indexOf(entities[0]);
				}
				deleteParams.service = service;
				platformDataValidationService.removeDeletedEntitiesFromErrorList(split.N, service);
				data.onDeleteDone(deleteParams, data, null);
			}

			if (split.O && split.O.length > 0) {
				deleteParams = {};
				deleteParams.entities = split.O;
				if(data.useIdForIndexIdentification) {
					const entityId = entities[0].Id;
					deleteParams.index = _.findIndex(data.itemList, function(candidate) { return candidate.Id === entityId; });
				} else {
					deleteParams.index = data.itemList.indexOf(entities[0]);
				}
				deleteParams.service = service;
				platformDataValidationService.removeDeletedEntitiesFromErrorList(split.O, service);
				data.doPrepareDelete(deleteParams, data);

				return data.doCallHTTPDelete(deleteParams, data, data.onDeleteDone);
			}
		};

		this.deleteSubEntity = function deleteSubEntity(entity, service, data) {
			if (platformRuntimeDataService.isBeingDeleted(entity)) {
				return $q.when(true);
			}
			return self.deleteSubEntities([entity], service, data);
		};

		this.deleteSubEntities = function deleteSubEntities(entities, service, data) {
			var flattened = data.asFlatList(entities);

			self.prepareMultiDelete(flattened);

			var deleteParams = {};
			deleteParams.entities = flattened;
			deleteParams.service = service;
			data.doPrepareDelete(deleteParams, data);

			platformDataValidationService.removeDeletedEntitiesFromErrorList(flattened, service);// remove error list about validation issue
			if (data.sendOnlyRootEntities) {
				var onlyRoots = platformDataServiceDataPresentExtension.filterListToHighestLevelEntities(entities, data);
				platformDataServiceModificationTrackingExtension.markEntitiesAsDeleted(service, onlyRoots, data);
			} else {
				platformDataServiceModificationTrackingExtension.markEntitiesAsDeleted(service, flattened, data);
			}

			if (data.usesCache && data.currentParentItem && data.currentParentItem.Id) {
				var cache = data.provideCacheFor(data.currentParentItem.Id, data);

				if (cache) {
					cache.loadedItems = _.filter(cache.loadedItems, function (item) {
						return !_.find(flattened, function (entity) {
							return entity.Id === item.Id;
						});
					});
				}
			}
			data.onDeleteDone(deleteParams, data, null);
			return $q.when(true);
		};

		this.clearDependentCaches = function clearDependentCaches(data) {
			_.forEach(data.childServices, function (childService) {
				if (childService.clearCache) {
					childService.clearCache();
				}
			});
		};

		this.clearRootData = function clearRootData(service, data, tree) {
			data.doClearModifications(null, data);
			platformDataServiceSelectionExtension.deselect(data);

			if (data.itemList.length > 0) {
				if (tree) {
					data.itemTree.length = 0;
				}
				data.itemList.length = 0;

				data.listLoaded.fire();
			}
		};

		this.unloadOwnEntities = function unloadOwnEntities(data, keepSelection) {
			if (data.usesCache && data.currentParentItem && data.currentParentItem.Id) {
				data.storeCacheFor(data.currentParentItem, data);
			}

			if (data.clearContent) {
				data.clearContent(data);
			}

			if (!_.isNil(keepSelection) && keepSelection && data.selectedItem) {
				data.__IdSelectedCapture = data.selectedItem.Id;
			}

			if (data.selectedItem && !data.doNotDeselctOnClearContent && data.itemList && data.itemList.length === 0) {
				data.selectedItem = null;
			}

			if (data.currentParentItem) {
				data.currentParentItem = null;
			}
		};

		this.unloadSubEntities = function unloadSubEntities(data, keepSelection) {
			if (!data.doNotLoadOnSelectionChange || data.forceChildServiceUnload) {
				_.forEach(data.childServices, function (childService) {
					if (childService.unloadSubEntities) {
						childService.unloadSubEntities(keepSelection);
					}
				});
			}
		};

		this.clearEntireCache = function clearEntireCache(data) {
			if (data && data.usesCache) {
				for (var prop in data.cache) {
					if (data.cache.hasOwnProperty(prop)) {

						var changes = data.cache[prop];

						changes.loadedItems.length = 0;
						changes.selectedItems.length = 0;
						changes.modifiedItems.length = 0;
						changes.deletedItems.length = 0;

						delete data.cache[prop];
					}
				}

				delete data.cache;
				data.cache = {};
			}
		};

		this.clearEntityDataInCache = function clearEntityDataInCache(entity, data) {
			if (data && data.usesCache) {
				var cache = data.provideCacheFor(data.currentParentItem.Id, data);

				if (cache) {
					cache.loadedItems = _.filter(cache.loadedItems, function (item) {
						return item.Id !== entity.Id;
					});

					cache.selectedItems = _.filter(cache.selectedItems, function (item) {
						return item.Id !== entity.Id;
					});

					cache.modifiedItems = _.filter(cache.modifiedItems, function (item) {
						return item.Id !== entity.Id;
					});
				}
			}
		};

		this.doesServiceRequireLoadOnSelectionChange = function doesServiceRequireLoadOnSelectionChange(data, service) {
			return data.doesRequireLoadAlways || platformDataServiceDataPresentExtension.isServicePresented(data, service);
		};

		this.loadSubordinatedEntities = function loadSubordinatedEntities(data, service) {
			if (data.doNotLoadOnSelectionChange) {
				return $q.when(data.itemList);
			}

			var parentItemId;
			if (data.filterParent) {
				parentItemId = data.filterParent(data);
			} else {
				data.currentParentItem = data.parentService.getSelected();
				if (data.currentParentItem) {
					parentItemId = data.currentParentItem.Id;
				}
				data.selectedItem = null;
			}

			if (data.selectionChanged) {
				data.selectionChanged.fire();// Instance is node -> own children need information
			}

			if (parentItemId === undefined || !self.doesServiceRequireLoadOnSelectionChange(data, service)) {
				if (data.clearContent) {
					data.clearContent(data);
				}
				data.currentParentItem = null;

				return $q.when([]);
			}

			var filter = 'mainItemId=';
			if (data.parentFilter) {
				filter = data.parentFilter + '=';
			}

			data.setFilter(filter + parentItemId);

			return data.doReadData(data);
		};

		this.startSubEntityLoadFromParent = function startSubEntityLoadFromParent(entity, data, keepSelection) {
			self.killRunningLoadInParent(data);

			return self.delayLoadingSubEntities(data, keepSelection);
		};

		this.startSubEntityLoadInRoot = function startSubEntityLoadFromRoot(entity, data, keepSelection) {
			return self.startSubEntityLoadFromParent(entity, data, keepSelection);
		};

		this.startSubEntityLoadInNode = function startSubEntityLoadInNode(entity, data, keepSelection) {
			return self.startSubEntityLoadFromParent(entity, data, keepSelection);
		};

		this.delayLoadingSubEntities = function delayLoadingSubEntities(data, keepSelection) {
			var deferredRelaod = $q.defer();
			data.nextLoadCallDelay = setTimeout(function () {
				data.nextLoadCallDelay = null;
				self.loadSubEntities(data, keepSelection).then(function () {
					if (keepSelection && data.__IdSelectedCapture) {
						data.selectedItem = _.find(data.itemList, {Id: data.__IdSelectedCapture});
						data.__IdSelectedCapture = null;
						delete data.__IdSelectedCapture;
						if (data.selectionChanged && data.selectedItem) {
							data.selectionChanged.fire(null, data.selectedItem);
						}
					}

					deferredRelaod.resolve(data.itemList);
				});
			}, 250);

			return deferredRelaod.promise;
		};

		this.loadSubEntities = function loadSubEntities(data, keepSelection) {
			var promises = [];

			_.forEach(data.childServices, function (subService) {
				promises.push(subService.loadSubItemList(keepSelection));
			});

			return $q.all(promises);
		};

		this.killRunningLoadInParent = function killRunningLoadInParent(data) {
			self.killRunningLoadInLeaf(data);// The promise handling is same as in leave, so we use this part here

			_.forEach(data.childServices, function (subService) {
				subService.killRunningLoad();
			});
		};

		this.killRunningLoadInLeaf = function killRunningLoadInLeaf(data) {
			if (data && data.nextLoadCallDelay) {
				clearTimeout(data.nextLoadCallDelay);
				data.nextLoadCallDelay = null;
			}
		};

		this.refreshGivenEntities = function refreshGivenEntities(entities, data, options, cleanChildren) {
			var sel = platformDataServiceSelectionExtension.getSelected(data);
			data.doClearModifications(null, data);
			platformDataServiceModificationTrackingExtension.clearModificationHistory();
			self.killRunningLoadInParent(true, data);
			if (cleanChildren) {
				if(!_.isNil(sel)) {
					data.__IdSelectedCapture = sel.Id;
				}
				self.unloadSubEntities(data, true);
			}

			return platformDataServiceReloadEntitiesExtension.reloadEntities(entities, data, options).then(function (response) {
				if (cleanChildren && sel) {
					var newSel = data.getItemById(sel.Id, data);
					if (newSel && data.startSubEntityLoad) {
						data.startSubEntityLoad(newSel, true);
					}
				}

				return response;
			});
		};
	}
})();
