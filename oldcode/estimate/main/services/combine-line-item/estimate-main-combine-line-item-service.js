/**
 * Created by salopek on 09.28.2018.
 */

/* global globals, Platform, _ */

(function () {
	'use strict';
	let moduleName = 'estimate.main';
	let estimateMainModule = angular.module(moduleName);
	/**
	 * @ngdoc service
	 * @name estimateMainCombineLineItemService
	 * @function
	 *
	 * @description
	 * estimateMainCombineLineItemService is the data service for all estimate combine line item related functionality.
	 */
	/* jshint -W003 */
	/* jshint -W072 */ // many parameters because of dependency injection
	/* jshint -W071 */
	angular.module(moduleName).factory('estimateMainCombineLineItemService', [
		'$translate', '$http', '$q',
		'$injector', 'platformGridAPI', 'mainViewService',
		'platformObjectHelper', 'PlatformMessenger', 'platformDataServiceFactory',
		'estimateMainCreationService', 'estimateMainCommonService', 'estimateMainLookupService',
		'estimateMainCombineLineItemProcessor', 'estimateMainPrjMaterialLookupService', 'cloudDesktopInfoService',
		'estimateMainSelectEstimateHeaderDialog', 'estimateMainRuleUpdateService', 'estimateParamUpdateService',
		'estimateParameterFormatterService', 'estimateRuleFormatterService', 'estimateMainExchangeRateService',
		'basicsLookupdataLookupFilterService', 'estimateMainFilterService', 'platformModalService',
		'projectMainPinnableEntityService', 'estimateMainPinnableEntityService', 'platformPermissionService',
		'permissions', 'estimateMainCostCodeChartDataService', 'estimateMainJobCostcodesLookupService',
		'estimateProjectRateBookConfigDataService', 'platformContextService',
		'estimateMainService', 'cloudDesktopPinningContextService',
		function ($translate, $http, $q,
			$injector, platformGridAPI, mainViewService,
			platformObjectHelper, PlatformMessenger, platformDataServiceFactory,
			estimateMainCreationService, estimateMainCommonService, estimateMainLookupService,
			estimateMainCombineLineItemProcessor, estimateMainPrjMaterialLookupService, cloudDesktopInfoService,
			estimateMainSelectEstimateHeaderDialog, estimateMainRuleUpdateService, estimateParamUpdateService,
			estimateParameterFormatterService, estimateRuleFormatterService, estimateMainExchangeRateService,
			basicsLookupdataLookupFilterService, estimateMainFilterService, platformModalService,
			projectMainPinnableEntityService, estimateMainPinnableEntityService, platformPermissionService,
			permissions, estimateMainCostCodeChartDataService, estimateMainJobCostcodesLookupService,
			estimateProjectRateBookConfigDataService, platformContextService,
			estimateMainService, cloudDesktopPinningContextService) {

			let selectedEstHeaderFk = null,
				selectedEstHeaderColumnConfigFk = null,
				selectedEstHeaderColumnConfigTypeFk = null,
				isColumnConfig = null,

				selectedEstHeaderItem = null,
				selectedEstProject = null,
				selectedProjectInfo = null,
				selectedLineItem = {},
				isLoadByNavigation = false,
				selectedConstructionSystemInstance = null,
				ruleParamSaveToLevel = '',
				detailsParamAlwaysSave = '',
				characteristicColumn = '',
				isEstimate = false,
				isHeaderStatusReadOnly = false,
				isReadOnlyService = false,
				estiamteReadData = null;

			let gridId = null;

			let sidebarInquiryOptions = {
				active: true,
				moduleName: moduleName,
				getSelectedItemsFn: getSelectedItems,
				getResultsSetFn: getResultsSet
			};

			let availableGridColumns = [];
			let columnsRemoved = [];

			let filterView = {
				currentViewType: 0,
				currentViewColumns: [],
				currentCustomView: null
			};

			// The instance of the main service - to be filled with functionality below
			let estimateMainServiceOptions = {
				flatNodeItem: {
					module: estimateMainModule,
					serviceName: 'estimateMainCombineLineItemService',
					entityNameTranslationID: 'estimate.main.lineItemContainer',
					httpCreate: {route: globals.webApiBaseUrl + 'estimate/main/lineitem/'},
					httpUpdate: {
						route: globals.webApiBaseUrl + 'estimate/main/lineitem/',
						endUpdate: 'updateCombinedLineItems'
					},
					httpDelete: {route: globals.webApiBaseUrl + 'estimate/main/lineitem/', endDelete: 'delete'},
					httpRead: {
						useLocalResource: true,
						resourceFunction: resourceReadFunction,
						extendSearchFilter: extendSearchFilter,
						initReadData: function initReadData(readData) {
							return tempReplacementData(readData);// TODO:Daniel this is just temporary until rewrite!
						},
						route: globals.webApiBaseUrl + 'estimate/main/lineitem/', endRead: 'listcombined_new',
						usePostForRead: true
					},
					entityRole: {
						node: {
							codeField: 'Code',
							descField: 'Description',
							parentService: estimateMainService,
							itemName: 'CombinedLineItems',
							moduleName: 'Estimate Main',
							handleUpdateDone: function (updateData, response, data) {
								sortCodeInfoToSave = [];
								estimateMainPrjMaterialLookupService.clear();
								estimateMainRuleUpdateService.clear();
								estimateParamUpdateService.clear();

								if (response.EstLineItems && response.EstLineItems.length > 0) {
									let currentLineItem = response.EstLineItems[0];
									service.onSortCodeReset.fire(response.SortCodeInfoToSave);

									if (selectedProjectInfo) {
										currentLineItem.ProjectId = selectedProjectInfo.ProjectId;
										currentLineItem.ProjectName = selectedProjectInfo.ProjectName;
										currentLineItem.ProjectNo = selectedProjectInfo.ProjectNo;
										if (selectedEstHeaderItem) {
											currentLineItem.EstimationCode = selectedEstHeaderItem.Code;
											currentLineItem.EstimationDescription = selectedEstHeaderItem.DescriptionInfo;
										}
									}

									// the code will Generate by RubricCategory Number Generation Setting, set the code as readonly
									_.forEach(response.EstLineItems, function (item) {
										$injector.get('platformRuntimeDataService').readonly(item, [{
											field: 'Code',
											readonly: false
										}]);
									});

								}

								estimateParameterFormatterService.handleUpdateDone(response);
								estimateRuleFormatterService.handleUpdateDone(response);
								$injector.get('estimateMainLineItemSelStatementListService').handleUpdateDone(response);

								let estimateMainResourceService = $injector.get('estimateMainResourceService');
								if (response.EstResourceToDelete && response.EstResourceToDelete.length > 0) {
									estimateMainResourceService.deleteResources(response.EstResourceToDelete);
								}
								if (response.EstResourceToSave && response.EstResourceToSave.length > 0) {
									estimateMainResourceService.handleUpdateDone(response.EstResourceToSave);
								}

								if (response.EstRuleExecutionResults && response.EstRuleExecutionResults.length > 0) {
									let estimateMainOutputDataService = $injector.get('estimateMainOutputDataService');
									estimateMainOutputDataService.setDataList(response.EstRuleExecutionResults);
									estimateMainOutputDataService.estMainRuleOutputResultChanged.fire();
								}

								service.setDynamicQuantityColumns(response.EstLineItems);
								data.handleOnUpdateSucceeded(updateData, response, data, true);

								if (response.IsQNARuleExecuteSuccess) {
									estimateMainResourceService.updateList(response.EstResourcesAfterQNARuleExecuted, false);
								}

								// clear updateData
								let modTrackServ = $injector.get('platformDataServiceModificationTrackingExtension');
								modTrackServ.clearModificationsInRoot(service);

								service.onUpdated.fire();
								estimateMainCommonService.setPrjCostCodes(service.getSelectedProjectId());

								if (response.EstLineItemToDelete && response.EstLineItemToDelete.length) {
									service.load();
								}

								if (response.ParamsNotDeleted && response.ParamsNotDeleted.length) {
									let params = response.ParamsNotDeleted.map(function (e) {
										if (e) {
											return e;
										}
									}).join(',');
									platformModalService.showMsgBox(params + ' ' + $translate.instant('estimate.main.infoParamDelete'), 'cloud.common.informationDialogHeader', 'ico-info');
								}

								let mainLineItemServ = $injector.get('estimateMainService');
								service.load();
								mainLineItemServ.load();
							},
							handleSelection: function () {
								service.setSelectedLineItem(selectedLineItem);
							},
							mergeAffectedItems: function (affectedItems, data) {
								if (affectedItems && affectedItems.length) {
									angular.forEach(affectedItems, function (item) {
										let index = _.findIndex(data.itemList, {Id: item.Id});
										if (index !== -1) {
											angular.extend(data.itemList[index], item);
										}
									});
									service.gridRefresh();
								}
							}
						}
					},
					entitySelection: {supportsMultiSelection: true},
					presenter: {
						list: {
							isDynamicModified: true,
							isInitialSorted: true,
							sortOptions: {initialSortColumn: {field: 'Code', id: 'code'}, isAsc: true},
							incorporateDataRead: function (readData, data) {
								let result = serviceContainer.data.handleReadSucceeded(readData, data);
								selectEstLineItem(result);
								return result;
							}
						}
					},
					useItemFilter: true,
					dataProcessor: [estimateMainCombineLineItemProcessor],
					sidebarSearch: {
						options: {
							moduleName: moduleName,
							enhancedSearchEnabled: true,
							pattern: '',
							pageSize: 100,
							useCurrentClient: true,
							includeNonActiveItems: false,
							showOptions: true,
							showProjectContext: false,
							pinningOptions: {
								isActive: true,
								showPinningContext: [{token: 'project.main', show: true}, {
									token: 'estimate.main',
									show: true
								}]
								// setContextCallback: setCurrentPinningContext
							},
							withExecutionHints: false
						}
					},
					sidebarInquiry: {
						options: sidebarInquiryOptions
					},
					filterByViewer: true
				}
			};

			let waitForDynamicColumnCalculate = false;
			let dynamicColumnCalculatePromise = null;

			let onLineItemChanged = new PlatformMessenger(); // line item is changed

			let serviceContainer = platformDataServiceFactory.createNewComplete(estimateMainServiceOptions);

			let service = serviceContainer.service;

			service.Rates = null;

			// let data = serviceContainer.data;

			let orginalSetSelected = serviceContainer.service.setSelected;

			// let originalOnDeleteDone = serviceContainer.data.onDeleteDone;

			let estConfigData = [];

			let lookupFilter = [
				{
					key: 'costgroupfk-for-line-item',
					serverSide: true,
					fn: function () {
						let currentItem = service.getSelectedEstHeaderItem();
						return 'LineItemContextFk=' + (currentItem ? currentItem.MdcLineItemContextFk : '-1');
					}
				},
				{
					key: 'projectfk',
					serverSide: true,
					fn: function () {
						let id = service.getSelectedProjectId();
						return 'ProjectFk=' + (id);
					}
				},
				{
					key: 'est-controlling-unit-filter',
					serverSide: true,
					serverKey: 'basics.masterdata.controllingunit.filterkey',
					fn: function () {
						return {
							ProjectFk: service.getSelectedProjectId()
						};
					}
				},
				{
					key: 'est-prj-controlling-unit-filter',
					serverSide: true,
					serverKey: 'controlling.structure.prjcontrollingunit.filterkey',
					fn: function () {
						return 'ProjectFk=' + service.getSelectedProjectId();
					}
				},
				{
					key: 'est-model-object-filter',
					serverSide: false,
					fn: function (item) {
						return item.MdlModelFk || item.ModelFk;
					}
				}
			];

			let sortCodeInfoToSave = [];

			// make the rule controller
			let oldClear = service.clear;

			let boqFilterOffEvent = new Platform.Messenger();
			let wicBoqFilterOffEvent = new Platform.Messenger();

			let lastFilter = null;

			let lineItemsPromise;

			/* Data */
			angular.extend(serviceContainer.data, {
				clearContent: clearContent,
				// onDeleteDone: onDeleteDone,
				/* provideUpdateData: provideUpdateData, */
				setGridIdForRest: setGridIdForRest,
				setScope: setScope
			});

			/* Service */
			angular.extend(serviceContainer.service, {
				/* Events */
				onUpdated: new Platform.Messenger(),
				// onContextUpdated: new Platform.Messenger(),
				onClearItems: new Platform.Messenger(),
				onRefreshLookup: new Platform.Messenger(),
				onEstHeaderChanged: new Platform.Messenger(),
				/* onUpdateProjectData: new Platform.Messenger(), */
				onProjectChanged: new Platform.Messenger(),
				onSortCodeReset: new Platform.Messenger(),
				onRequestLineItemsListed: new Platform.Messenger(),
				onQuantityChanged: new Platform.Messenger(),
				onBoqItesmUpdated: new Platform.Messenger(),
				onEstHeaderSet: new PlatformMessenger(),

				setEstDefaultSettings: setEstDefaultSettings,

				setWaitForDynamicColumnCalculate: setWaitForDynamicColumnCalculate,
				setDynamicColumnCalculatePromise: setDynamicColumnCalculatePromise,
				setSelected: setSelected,

				// canCreate: canCreate,
				registerLineItemValueUpdate: registerLineItemValueUpdate,
				unregisterLineItemValueUpdate: unregisterLineItemValueUpdate,
				fireLineItemValueUpdate: fireLineItemValueUpdate,

				getLgmJobId: getLgmJobId,
				/* getUpdateData: getUpdateData, */
				getContainerData: getContainerData,
				handleOnCalculationUpdate: handleOnCalculationUpdate,

				deleteItem: deleteItem,
				getSelectedProjectId: getSelectedProjectId,
				setSelectedProjectId: setSelectedProjectId,
				setList: setList,
				getListOfLineItemsWhichTransferDataToActivity: getListOfLineItemsWhichTransferDataToActivity,
				getListOfLineItemsWhichTransferDataNotToActivity: getListOfLineItemsWhichTransferDataNotToActivity,

				getNumberOfLineItems: getNumberOfLineItems,
				activeLoadByNavigation: activeLoadByNavigation,
				updateList: updateList,
				addList: addList,
				fireListLoaded: fireListLoaded,
				setSelectedLineItem: setSelectedLineItem,
				setSelectedPrjEstHeader: setSelectedPrjEstHeader,
				getSelectedEstHeaderItem: getSelectedEstHeaderItem,
				getSelectedEstHeaderId: getSelectedEstHeaderId,
				setSelectedEstHeaderId: setSelectedEstHeaderId,
				getSelectedEstHeaderColumnConfigFk: getSelectedEstHeaderColumnConfigFk,
				setSelectedEstHeaderColumnConfigFk: setSelectedEstHeaderColumnConfigFk,
				getSelectedEstHeaderColumnConfigTypeFk: getSelectedEstHeaderColumnConfigTypeFk,
				getSelectedEstHeaderIsColumnConfig: getSelectedEstHeaderIsColumnConfig,
				getSelectedProjectInfo: getSelectedProjectInfo,
				setSelectedProjectInfo: setSelectedProjectInfo,
				/* setContext: setContext, */
				updateModuleHeaderInfo: updateModuleHeaderInfo,
				setEstimateHeader: setEstimateHeader,

				navigateTo: navigateTo,
				/* navigateToLineItem: navigateToLineItem,
				navigateToLineItemFromScheduling: navigateToLineItemFromScheduling, */

				setSidebarNFavInfo: setSidebarNFavInfo,

				updateCalculation: updateCalculation,
				setReminder: setReminder,
				getParamSaveReminder: getParamSaveReminder,

				setEstConfigData: setEstConfigData,
				clearEstConfigData: clearEstConfigData,
				registerLookupFilter: registerLookupFilter,
				unregisterLookupFilter: unregisterLookupFilter,

				deepCopy: deepCopy,
				addSortCodeChangeInfo: addSortCodeChangeInfo,
				setDetailsParamReminder: setDetailsParamReminder,
				getDetailsParamReminder: getDetailsParamReminder,
				getGridId: getGridId,
				setCharacteristicColumn: setCharacteristicColumn,
				getCharacteristicColumn: getCharacteristicColumn,
				setDynamicQuantityColumns: setDynamicQuantityColumns,
				setDynamicColumnsLayoutToGrid: setDynamicColumnsLayoutToGrid,

				setMdcCostCodeLookupLoaded: setMdcCostCodeLookupLoaded,
				isMdcCostCodeLookupLoaded: isMdcCostCodeLookupLoaded,
				isDynamicColumnActive: isDynamicColumnActive,

				setDynamicColumns: setDynamicColumns,
				getIsEstimate: getIsEstimate,
				setIsEstimate: setIsEstimate,
				clear: clear,
				loadItem: loadItem,
				clearLookupCache: clearLookupCache,
				registerBoqFilterOffEvent: registerBoqFilterOffEvent,
				unregisterBoqFilterOffEvent: unregisterBoqFilterOffEvent,
				registerwicBoqFilterOffEvent: registerwicBoqFilterOffEvent,
				unregisterwicBoqFilterOffEvent: unregisterwicBoqFilterOffEvent,

				extendSearchFilterAssign: extendSearchFilterAssign,

				getLastFilter: getLastFilter,
				getHeaderStatus: getHeaderStatus,
				getInquiryOptions: getInquiryOptions,
				isReadonly: isReadonly,
				assignQtyRelationOfLeadingStructures: assignQtyRelationOfLeadingStructures,
				assignDefaultLeadingStructures: assignDefaultLeadingStructures,
				isAssignAssemblyInProcess: false,
				getAssemblyLookupSelectedItems: getAssemblyLookupSelectedItems,
				AssignAssemblyToLineItem: AssignAssemblyToLineItem,
				setLineItemCurrencies: setLineItemCurrencies,

				setEstiamteReadData: setEstiamteReadData,
				getEstiamteReadData: getEstiamteReadData,
				setGridIdForRest: setGridIdForRest,
				setScope: setScope,
				setLineItemCurrenciesCreation: setLineItemCurrenciesCreation,
				calculateCurrencies: calculateCurrencies,

				setListView: setListView,
				setAvailableGridColumns: setAvailableGridColumns
			});

			service.registerListLoadStarted(estimateMainCommonService.resetTotal);
			service.onEstHeaderChanged.register($injector.get('estimateMainFilterService').removeAllFilters);
			service.onProjectChanged.register($injector.get('estimateMainLookupStateService').clearData);

			service.callRefresh = service.refresh || serviceContainer.data.onRefreshRequested;

			return service;

			/** Data Functions **/
			function clearContent() {
			}

			/** Service Functions **/

			function setEstDefaultSettings(readData) {
				let estHeaderId = -1;

				// 1. It is called from estimate refresh button or side bar favorites estimate selection
				if (readData) {
					// eslint-disable-next-line no-prototype-builtins
					if (readData.hasOwnProperty('furtherFilters')) {
						let estHeaderFilter = _.find(readData.furtherFilters, {Token: 'EST_HEADER'});
						estHeaderId = estHeaderFilter ? estHeaderFilter.Value : -1;
					}
				}

				if (estHeaderId < 0) {
					// 2. This is called from estimate page initialization and refresh triggered
					let cloudDesktopPinningContextService = $injector.get('cloudDesktopPinningContextService');
					let estHeaderContext = _.find(cloudDesktopPinningContextService.getContext(), {token: moduleName});
					estHeaderId = estHeaderContext ? estHeaderContext.id : -1;
				}

				if (estHeaderId < 0) { // multiple headers
					setTimeout(function () {
						platformPermissionService.restrict('b46b9e121808466da59c0b2959f09960', false);
					}, 0);
					return $q.when();
				}

				let promiseSetDefault = function promiseSetDefault(estHeaderId) {
					let defer = $q.defer();
					$http.get(globals.webApiBaseUrl + 'estimate/project/getestimatebyid?estHeaderFk=' + estHeaderId).then(function (response) {
						let estDefaultSettings = response.data;

						// 1.
						// service.setSidebarNFavInfo(readData);
						// Permission
						let isHeaderStatusReadOnly = estDefaultSettings.IsHeaderStatusReadOnly;
						let permissionFlag = isHeaderStatusReadOnly ? permissions.read : false;
						isReadOnlyService = !!isHeaderStatusReadOnly;
						setTimeout(function () {
							platformPermissionService.restrict('b46b9e121808466da59c0b2959f09960', permissionFlag);
						}, 0);

						toggleSideBarWizard(isReadOnlyService);

						defer.resolve(true);
					});
					return defer.promise;
				};

				// When navigating to another estimate from sidebar favorites, we need to re-set estimate default settings,
				return promiseSetDefault(estHeaderId);
			}

			function toggleSideBarWizard(isDisable) {
				let sideBarService = $injector.get('cloudDesktopSidebarService');
				let sideBarId, sideBarItem;
				if (sideBarService.getSidebarIds() && sideBarService.getSidebarIds().newWizards) {
					sideBarId = sideBarService.getSidebarIds().newWizards;
					sideBarItem = _.find(sideBarService.commandBarDeclaration.items, {id: '#' + sideBarId});
					if (sideBarItem) {
						sideBarItem.hideItem = isDisable;
						sideBarItem.isDisabled = function () {
							return isDisable;
						};
						if (!isDisable && sideBarService.scope && !sideBarService.scope.pinned) {
							sideBarItem.fnWrapper(sideBarId);
						}
					}
				}
			}

			function setWaitForDynamicColumnCalculate(value) {
				waitForDynamicColumnCalculate = value;
			}

			function setDynamicColumnCalculatePromise(value) {
				dynamicColumnCalculatePromise = value;
			}

			function setSelected(item, entities) {
				if (waitForDynamicColumnCalculate && dynamicColumnCalculatePromise && platformObjectHelper.isPromise(dynamicColumnCalculatePromise)) {
					waitForDynamicColumnCalculate = false;
					dynamicColumnCalculatePromise.then(function () {
						dynamicColumnCalculatePromise = null;
						return orginalSetSelected(item, entities);
					});
				} else {
					return orginalSetSelected(item, entities);
				}
			}

			function registerLineItemValueUpdate(func) {
				onLineItemChanged.register(func);
			}

			function unregisterLineItemValueUpdate(func) {
				onLineItemChanged.unregister(func);
			}

			function fireLineItemValueUpdate(col, item) {
				onLineItemChanged.fire(col, item);
			}

			function getLgmJobId(resource) {
				if (!resource) {
					return null;
				}

				if (resource.LgmJobFk) {
					return resource.LgmJobFk;
				}

				let resources = $injector.get('estimateMainResourceService').getList();

				let parentIds = [];

				function getParent(item) {
					return _.find(resources, {
						Id: item.EstResourceFk,
						EstLineItemFk: item.EstLineItemFk,
						EstHeaderFk: item.EstHeaderFk
					});
				}

				let parent = getParent(resource);
				while (parent !== null) {
					if (parentIds.indexOf(parent.Id) !== -1) {
						return null;
					} else {
						parentIds.push(parent.Id);
					}
					if (parent.LgmJobFk) {
						return parent.LgmJobFk;
					}

					parent = getParent(parent);
				}
				let lineItems = service.getList();
				let item = _.find(lineItems, {Id: resource.EstLineItemFk, EstHeaderFk: resource.EstHeaderFk});
				if (item && item.LgmJobFk) {
					return item.LgmJobFk;
				} else {
					let headerItem = service.getSelectedEstHeaderItem();
					return headerItem && headerItem.Id === resource.EstHeaderFk ? headerItem.LgmJobFk : null;
				}
			}

			function getContainerData() {
				return serviceContainer.data;
			}

			function handleOnCalculationUpdate(calcData) {
				serviceContainer.data.handleOnUpdateSucceeded(calcData, calcData, serviceContainer.data, true);
			}

			function deleteItem(entity) {
				serviceContainer.data.deleteItem(entity, serviceContainer.data).then(function () {
					service.onUpdated.fire();
				});
			}

			function getSelectedProjectId() {
				return selectedEstProject ? selectedEstProject.PrjProjectFk : null;
			}

			function setSelectedProjectId(value) {
				if (!selectedEstProject) {
					selectedEstProject = value;
				}
			}

			function setList(data) {
				serviceContainer.data.itemList = data;
			}

			function getListOfLineItemsWhichTransferDataToActivity() {
				return _.filter(serviceContainer.data.itemList, function (item) {
					return item.EstQtyRelActFk === 2;
				});
			}

			function getListOfLineItemsWhichTransferDataNotToActivity() {
				return _.filter(serviceContainer.data.itemList, function (item) {
					return item.EstQtyRelActFk !== 2;
				});
			}

			function getNumberOfLineItems() {
				return _.size(serviceContainer.data.itemList);
			}

			function activeLoadByNavigation() {
				isLoadByNavigation = true;
			}

			function updateList(updateData, response) {
				estimateMainRuleUpdateService.clear();
				estimateParamUpdateService.clear();
				estimateParameterFormatterService.handleUpdateDone(response);
				estimateRuleFormatterService.handleUpdateDone(response);
				if (response[serviceContainer.data.itemName]) {
					serviceContainer.data.handleOnUpdateSucceeded(updateData, response, serviceContainer.data, true);
				}
			}

			function addList(data) {
				let list = serviceContainer.data.itemList;
				if (data && data.length) {
					angular.forEach(data, function (d) {
						let item = _.find(list, {Id: d.Id, EstHeaderFk: d.EstHeaderFk});
						if (item) {
							angular.extend(list[list.indexOf(item)], d);
						} else {
							serviceContainer.data.itemList.push(d);
						}
					});
					angular.forEach(list, function (li) {
						estimateMainCombineLineItemProcessor.processItem(li);
					});
				}
			}

			function fireListLoaded() {
				serviceContainer.data.listLoaded.fire();
			}

			function setSelectedLineItem(selectedLineItem) {
				if (selectedLineItem && selectedLineItem.Id) {
					serviceContainer.data.selectionAfterSort.fire(selectedLineItem);
				}
			}

			function setSelectedPrjEstHeader(estimateCompositeItem) {
				if (estimateCompositeItem) {
					selectedEstProject = estimateCompositeItem.PrjEstimate;
					selectedEstHeaderItem = estimateCompositeItem.EstHeader;
					estimateMainLookupService.setSelectedProjectId(selectedEstProject.PrjProjectFk);
					estimateMainJobCostcodesLookupService.setSelectedProjectId(selectedEstProject.PrjProjectFk, selectedEstHeaderItem.LgmJobFk);
					estimateMainPrjMaterialLookupService.setProjectId(selectedEstProject.PrjProjectFk);
					estimateRuleFormatterService.setSelectedProject(selectedEstProject.PrjProjectFk);

					if (selectedEstHeaderItem) {
						if (selectedEstHeaderFk !== selectedEstHeaderItem.Id) {
							// when header changed
							$injector.get('estimateResourcesSummaryService').clear();
						}
						selectedEstHeaderFk = selectedEstHeaderItem.Id;
						selectedEstHeaderColumnConfigFk = selectedEstHeaderItem.EstConfigFk;
						selectedEstHeaderColumnConfigTypeFk = selectedEstHeaderItem.EstConfigtypeFk;
						isColumnConfig = selectedEstHeaderItem.IsColumnConfig;
						estimateParameterFormatterService.setSelectedEstHeaderNProject(selectedEstHeaderItem.Id, selectedEstProject.PrjProjectFk);
						estimateRuleFormatterService.setSelectedEstHeaderNProject(selectedEstHeaderItem.Id, selectedEstProject.PrjProjectFk);

					}
				} else {
					selectedEstProject = selectedEstHeaderItem = selectedEstHeaderFk = null;
					selectedEstHeaderColumnConfigFk = selectedEstHeaderColumnConfigTypeFk = null;
				}
				// enable / disable add button in line item container
				service.onEstHeaderSet.fire();
			}

			function getSelectedEstHeaderItem() {
				return selectedEstHeaderItem;
			}

			function getSelectedEstHeaderId() {
				return (selectedEstHeaderFk !== null) ? selectedEstHeaderFk : -1;
			}

			function setSelectedEstHeaderId(headerfk) {
				selectedEstHeaderFk = headerfk;
			}

			function getSelectedEstHeaderColumnConfigFk() {
				return selectedEstHeaderColumnConfigFk;
			}

			function setSelectedEstHeaderColumnConfigFk(columnConfigFk) {
				selectedEstHeaderColumnConfigFk = columnConfigFk;
			}

			function getSelectedEstHeaderColumnConfigTypeFk() {
				return selectedEstHeaderColumnConfigTypeFk;
			}

			function getSelectedEstHeaderIsColumnConfig() {
				return isColumnConfig;
			}

			function getSelectedProjectInfo() {
				return selectedProjectInfo;
			}

			function setSelectedProjectInfo(projectEntity) {
				selectedProjectInfo = {
					ProjectNo: projectEntity.ProjectNo,
					ProjectName: projectEntity.ProjectName,
					ProjectId: projectEntity.Id,
					ProjectCurrency: projectEntity.CurrencyFk,
					PrjCalendarId: projectEntity.CalendarFk
				};
			}

			function updateModuleHeaderInfo(lineItem) {
				let entityText = '';
				if (selectedProjectInfo) {
					entityText = selectedProjectInfo.ProjectNo + ' - ' + selectedProjectInfo.ProjectName;
					entityText += selectedEstHeaderItem ? ' / ' + selectedEstHeaderItem.Code + ' - ' + selectedEstHeaderItem.DescriptionInfo.Translated : '';
					entityText += !_.isEmpty(lineItem) ? ' / ' + lineItem.Code : '';
				}
				cloudDesktopInfoService.updateModuleInfo('cloud.desktop.moduleDisplayNameEstimate', entityText);
			}

			function setEstimateHeader(item) {
				isLoadByNavigation = true;

				let estHeader = _.get(item, 'EstHeader');

				if (service.getSelectedEstHeaderId() !== _.get(estHeader, 'Id')) {
					service.onEstHeaderChanged.fire();
				}
				service.onProjectChanged.fire();
			}

			function navigateTo(item, triggerField) {
				if (triggerField === 'cosMainInstance.Id') {
					selectedConstructionSystemInstance = item.cosInstance;
				} else {
					selectedConstructionSystemInstance = null;
				}

				boqFilterOffEvent.fire();
				estimateMainCostCodeChartDataService.load();
			}

			function selectEstLineItem(list) {
				// todo, selectedLineItem maybe object{}, and its Id is undefined,,sai
				if (selectedLineItem) {
					let item = _.find(list, {Id: selectedLineItem.Id});
					service.setSelected(item);
					selectedLineItem = {};
				}
			}

			// set Sidebar search and favourites Information
			function setSidebarNFavInfo(info) {
				let prjEstComposites = info.prjEstComposites;

				if (prjEstComposites && prjEstComposites.length) {
					// / TODO: extension for displayMember: currently no support for "displayMember: 'EstimateHeader.DescriptionInfo.Translated'"
					// / as soon as support is available, remove this code
					_.each(prjEstComposites, function (item) {
						item.displayMember = _.get(item, 'EstHeader.DescriptionInfo.Translated', '');
					});
				}
			}

			// detail formula calculation of line item and resources @server
			function updateCalculation() {
				service.update();
			}

			// reminder always save parameters to
			function setReminder(selected) {
				ruleParamSaveToLevel = selected;
			}

			// reminder always save parameters to
			function getParamSaveReminder() {
				return ruleParamSaveToLevel;
			}

			// setEstConfigData for structure assignment on line item create
			function setEstConfigData(data) {
				estConfigData = [];
				if (data && data.EstStructureDetails && data.EstStructureDetails.length) {
					estConfigData = _.sortBy(data.EstStructureDetails, 'Sorting');
				}
			}

			function clearEstConfigData() {
				estConfigData = [];
			}

			function registerLookupFilter() {
				basicsLookupdataLookupFilterService.registerFilter(lookupFilter);
			}

			function unregisterLookupFilter() {
				basicsLookupdataLookupFilterService.unregisterFilter(lookupFilter);
			}

			/**
			 * this function will be called from Sidebar Inquiry container when user presses the "AddSelectedItems" Button
			 * returns: array {itemInfo}  {iteminfo} { id: int(unique identifier), name: string, description: string}
			 */
			function getSelectedItems() {
				let resultSet = service.getSelectedEntities();
				return createInquiryResultSet(_.isArray(resultSet) ? resultSet : [resultSet]);
			}

			/**
			 * this function will be called from Sidebar Inquiry container when user presses the "AddAllItems" Button
			 * returns: array {itemInfo}  {iteminfo} { id: int(unique identifier), name: string, description: string}
			 */
			function getResultsSet() {
				let resultSet = service.getList();
				return createInquiryResultSet(_.isArray(resultSet) ? resultSet : [resultSet]);
			}

			/**
			 * This function creates a Inquiry Resultset from input resultset (busniness partner specific)
			 *
			 * {InquiryItem} containing:
			 *     {  id:   {integer} unique id of type integer
			 *        name: {string}  name of item, will be displayed in inquiry sidebar as name
			 *        description: {string}  description  of item, will be displayed in inquiry sidebar as description
			 *     });
			 *
			 * @param resultSet
			 * @returns {Array} see above
			 */
			function createInquiryResultSet(resultSet) {
				let resultArr = [];
				_.forEach(resultSet, function (item) {
					if (item && item.Id) { // check for valid object
						resultArr.push({
							id: item.Id,
							name: item.Code,
							description: item.DescriptionInfo && item.DescriptionInfo.Description ? item.DescriptionInfo.Description : '',
							estHeaderId: item.EstHeaderFk
						});
					}
				});

				return resultArr;
			}

			// create deep copy as base or reference line item
			function deepCopy(copyAsRef) {
				let showDialog = function showDialog() {
					let modalOptions = {
						headerTextKey: 'estimate.main.infoDeepCopyLineItemHeader',
						bodyTextKey: 'estimate.main.infoDeepCopyLineItemBody',
						iconClass: 'ico-info'
					};
					platformModalService.showDialog(modalOptions);
				};
				if (!service.getIfSelectedIdElse(null)) {
					showDialog();
				} else {
					let containerData = serviceContainer.data;
					let modTrackServ = $injector.get('platformDataServiceModificationTrackingExtension');
					let updateData = modTrackServ.getModifications(service);
					updateData.CopyAsRef = copyAsRef;
					updateData.CopiedLineItems = service.getSelectedEntities();
					updateData.MainItemName = service.getItemName();
					updateData.EstHeaderId = service.getSelectedEstHeaderId();
					updateData.ProjectId = service.getSelectedProjectId();
					let copyPromise = $http.post(globals.webApiBaseUrl + 'estimate/main/lineitem/deepcopy', updateData);
					return copyPromise.then(function (response) {
						copyPromise = null;
						let result = response.data;
						result[updateData.MainItemName] = result && result[updateData.MainItemName] && result[updateData.MainItemName].length ? result[updateData.MainItemName] : [];
						service.addList(result.CopiedLineItems);
						containerData.onUpdateSucceeded(result, containerData, updateData);
						// clear updateData
						modTrackServ.clearModificationsInRoot(service);
						updateData = {};
						service.fireListLoaded();
					});
				}
			}

			// add sortcode into ToSave array for update data
			function addSortCodeChangeInfo(scField, item) {
				let field = scField.slice(0, -2),
					value = item[scField],
					scItem = _.find(sortCodeInfoToSave, {Field: field}),
					isExist = _.isNumber(value);
				if (scItem) {
					scItem.Code = value;
					scItem.IsExist = isExist;
				} else {
					sortCodeInfoToSave.push({Field: field, Code: value, IsExist: isExist});
				}
			}

			// reminder always save parameters to
			function setDetailsParamReminder(selectedLevel) {
				detailsParamAlwaysSave = selectedLevel;
			}

			// reminder always save details formula parameters to selected level
			function getDetailsParamReminder() {
				return detailsParamAlwaysSave;
			}

			function getGridId(itemId) {
				gridId = itemId;
			}

			function setCharacteristicColumn(colName) {
				characteristicColumn = colName;
			}

			function getCharacteristicColumn() {
				return characteristicColumn;
			}

			function setDynamicQuantityColumns(lineItems) {
				if (lineItems && lineItems.length) {
					$injector.get('estimateMainDynamicQuantityColumnService').setDynamicQuantityColumns(lineItems);
				}
			}

			function setDynamicColumnsLayout(readData) {
				let dynamicColService = $injector.get('estimateMainDynamicColumnService');
				let estimateMainConfigDetailService = $injector.get('estimateMainConfigDetailService');

				let dynColumns = readData.dynamicColumns;

				// Estimate line items characteristics
				let estLineItemCharacteristics = dynColumns.Characteristics || [];

				// Estimate configuration - dynamic columns information
				let colConfigLookupData = dynColumns.DynamicColumns;
				// Estimate configuration - column configuration details (which will be added to Line Items)
				let estLineItemConfigDetails = dynColumns.ColumnConfigDetails || [];

				// Dynamic columns information to generate dynamic column in Line Items grid
				estimateMainConfigDetailService.setInfo({
					DynamicColumns: colConfigLookupData,
					Main: estLineItemConfigDetails
				});

				// Get characteristics line items columns
				let estLineItemCharacteristicsColumns = [];
				if (_.size(estLineItemCharacteristics) > 0) {
					estLineItemCharacteristicsColumns = estimateMainCommonService.getCharactCols(estLineItemCharacteristics);
				}

				// Get estimate column config columns
				let estLineItemConfigDetailsColumns = _.values(dynamicColService.generateDynamicColumns(estLineItemConfigDetails));
				serviceContainer.data.dynamicColumns = estLineItemConfigDetailsColumns.concat(estLineItemCharacteristicsColumns);

				// Gather all the columns
				let allColumns = dynamicColService.getStaticColumns().concat(serviceContainer.data.dynamicColumns);

				// Set to Line Items grid layout
				service.setDynamicColumnsLayoutToGrid(allColumns);
			}

			function setDynamicColumnsLayoutToGrid(columns) {
				let lineItemGridId = 'b46b9e121808466da59c0b2959f09960';
				let grid = platformGridAPI.grids.element('id', lineItemGridId);
				if (grid && grid.instance) {
					platformGridAPI.columns.configuration(lineItemGridId, columns);
				}
			}

			function isMdcCostCodeLookupLoaded() {
				return serviceContainer.data.isMdcCostCodeLookupLoaded === true;
			}

			function setMdcCostCodeLookupLoaded(value) {
				serviceContainer.data.isMdcCostCodeLookupLoaded = value;
			}

			function isDynamicColumnActive() {
				return serviceContainer.data.isDynamicColumnActive === true;
			}

			function setDynamicColumns(cols) {
				let dynamicColumns = [];
				if (_.size(cols) > 0) {
					dynamicColumns = _.filter(serviceContainer.data.dynamicColumns, function (col) {
						return !(col.id.indexOf('ConfDetail') > -1 || col.id.indexOf('charactercolumn_') > -1 || col.id.indexOf('NotAssignedCostTotal') > -1);
					});
					serviceContainer.data.dynamicColumns = dynamicColumns.concat(cols);
				}
			}

			function getIsEstimate() {
				return isEstimate;
			}

			function setIsEstimate(value) {
				isEstimate = value;
			}

			function clear() {
				oldClear();
				let estimateRuleComboService = $injector.get('estimateRuleComboService');
				if (estimateRuleComboService) {
					estimateRuleComboService.clear();
				}
			}

			function loadItem(id) {
				return service.getItemById(id);
			}

			function setGridIdForRest(gridId) {
				service.gridIdForReset = gridId;
			}

			function setScope(scope) {
				service.parentScope = scope;
			}

			function setLineItemCurrencies(readData) {
				let dtos = readData.dtos ? readData.dtos : [];

				let basMultiCurrCommService = $injector.get('basicsMultiCurrencyCommonService');

				if (dtos.length > 0) {
					angular.forEach(dtos, function (lineitem) {

						basMultiCurrCommService.setCurrencies(lineitem);

					});

					readData.dtos = dtos;
				}
			}

			function setLineItemCurrenciesCreation(item) {

				let basMultiCurrCommService = $injector.get('basicsMultiCurrencyCommonService');

				basMultiCurrCommService.setCurrencies(item);
			}

			function calculateCurrencies(item) {

				let basMultiCurrCommService = $injector.get('basicsMultiCurrencyCommonService');

				basMultiCurrCommService.calculateMultiCurrencies(item);
			}

			/**
			 * @ngdoc function
			 * @name clearCache
			 * @function
			 * @methodOf estimateMainService
			 * @description this will be called when change the estimate or one estimate destroy
			 */
			function clearLookupCache() {
				$injector.get('estimateMainActivityLookupService').clear();
				$injector.get('estimateMainBoqLookupService').clear();
				$injector.get('estimateMainLocationLookupService').clear();
				$injector.get('estimateMainPrjChangeStatusLookupService').clear();
				$injector.get('estimateMainPrcPackageStatusLookupService').clear();
				estimateMainLookupService.clearCache();
				estimateMainJobCostcodesLookupService.clearCache();
				for (let i = 1; i <= 10; i++) {
					let sortCodeService = $injector.get('estimateMainSortCodesLookupDataService').getService(i);
					sortCodeService.clear();
				}
			}

			function registerBoqFilterOffEvent(callBackFn) {
				boqFilterOffEvent.register(callBackFn);
			}

			function unregisterBoqFilterOffEvent(callBackFn) {
				boqFilterOffEvent.unregister(callBackFn);
			}

			function registerwicBoqFilterOffEvent(callBackFn) {
				wicBoqFilterOffEvent.register(callBackFn);
			}

			function unregisterwicBoqFilterOffEvent(callBackFn) {
				wicBoqFilterOffEvent.unregister(callBackFn);
			}

			function getLastFilter() {
				return lastFilter;
			}

			function getHeaderStatus() {
				return isHeaderStatusReadOnly;
			}

			function getInquiryOptions() {
				return sidebarInquiryOptions;
			}

			function isReadonly() {
				return isReadOnlyService;
			}

			function assignQtyRelationOfLeadingStructures(entityToAssign) {
				entityToAssign = entityToAssign || {};
				let availableStructures = estimateMainCreationService.getCreationProcessors();
				entityToAssign.validStructure = false;

				function takeOverStruct(structFk, qtyRelFk) {
					entityToAssign.QtyTakeOverStructFk = structFk;
					entityToAssign.validStructure = true;
					entityToAssign.QtyRelFk = qtyRelFk;
				}

				angular.forEach(estConfigData, function (d) {
					if (!d) {
						return;
					}
					// consider the directional relation type
					if (!entityToAssign.validStructure && (d.EstQuantityRelFk === 1 || d.EstQuantityRelFk === 4 || d.EstQuantityRelFk === 6 || d.EstQuantityRelFk === 7)) {
						switch (d.EstStructureFk) {
							case 1:// boq
								if (_.has(availableStructures, 'estimateMainBoqListController')) {
									takeOverStruct(d.EstStructureFk, d.EstQuantityRelFk);
								}
								break;
							case 2:// schedule activity
								if (_.has(availableStructures, 'estimateMainActivityListController')) {
									takeOverStruct(d.EstStructureFk, d.EstQuantityRelFk);
								}
								break;
							case 3:// location
								if (_.has(availableStructures, 'estimateMainLocationListController')) {
									takeOverStruct(d.EstStructureFk, d.EstQuantityRelFk);
								}
								break;
							case 4:// CTU
								if (_.has(availableStructures, 'estimateMainControllingListController')) {
									takeOverStruct(d.EstStructureFk, d.EstQuantityRelFk);
								}
								break;
							case 5:// Procurement-Structure
								if (_.has(availableStructures, 'estimateMainProcurementStructureService')) {
									takeOverStruct(d.EstStructureFk, d.EstQuantityRelFk);
								}
								break;
							case 6:// Enterprise Cost Group 1
								if (_.has(availableStructures, 'estimateMainLicCostgroup1ListController')) {
									takeOverStruct(d.EstStructureFk, d.EstQuantityRelFk);
								}
								break;
							case 7:// Enterprise Cost Group 2
								if (_.has(availableStructures, 'estimateMainLicCostgroup2ListController')) {
									takeOverStruct(d.EstStructureFk, d.EstQuantityRelFk);
								}
								break;
							case 8:// Enterprise Cost Group 3
								if (_.has(availableStructures, 'estimateMainLicCostgroup3ListController')) {
									takeOverStruct(d.EstStructureFk, d.EstQuantityRelFk);
								}
								break;
							case 9:// Enterprise Cost Group 4
								if (_.has(availableStructures, 'estimateMainLicCostgroup4ListController')) {
									takeOverStruct(d.EstStructureFk, d.EstQuantityRelFk);
								}
								break;
							case 10:// Enterprise Cost Group 5
								if (_.has(availableStructures, 'estimateMainLicCostgroup5ListController')) {
									takeOverStruct(d.EstStructureFk, d.EstQuantityRelFk);
								}
								break;
							case 11:// Project Cost Group 1
								if (_.has(availableStructures, 'estimateMainPrjCostgroup1ListController')) {
									takeOverStruct(d.EstStructureFk, d.EstQuantityRelFk);
								}
								break;
							case 12:// Project Cost Group 2
								if (_.has(availableStructures, 'estimateMainPrjCostgroup2ListController')) {
									takeOverStruct(d.EstStructureFk, d.EstQuantityRelFk);
								}
								break;
							case 13:// Project Cost Group 3
								if (_.has(availableStructures, 'estimateMainPrjCostgroup3ListController')) {
									takeOverStruct(d.EstStructureFk, d.EstQuantityRelFk);
								}
								break;
							case 14:// Project Cost Group 4
								if (_.has(availableStructures, 'estimateMainPrjCostgroup4ListController')) {
									takeOverStruct(d.EstStructureFk, d.EstQuantityRelFk);
								}
								break;
							case 15:// Project Cost Group 5
								if (_.has(availableStructures, 'estimateMainPrjCostgroup5ListController')) {
									takeOverStruct(d.EstStructureFk, d.EstQuantityRelFk);
								}
								break;
							case 16:// Assembly-Structure
								if (_.has(availableStructures, 'estimateMainAssemblyCategoryTreeController')) {
									takeOverStruct(d.EstStructureFk, d.EstQuantityRelFk);
								}
								break;
						}
					}
				});

				if (!entityToAssign.validStructure || typeof (entityToAssign.Quantity) === 'undefined') {
					entityToAssign.Quantity = 1;
					entityToAssign.validStructure = true;
				}
			}

			function assignDefaultLeadingStructures(entityToAssign) {
				entityToAssign = entityToAssign || {};

				let availableStructures = estimateMainCreationService.getCreationProcessors();

				function assignStructure(structure) {
					let hasStr = _.has(availableStructures, structure);
					if (hasStr) {
						let lStructureFn = availableStructures[structure];
						if (lStructureFn) {
							lStructureFn(entityToAssign);
						}
					}
				}

				// boq
				assignStructure('estimateMainBoqListController');

				// schedule activity
				assignStructure('estimateMainActivityListController');

				// location
				assignStructure('estimateMainLocationListController');

				// CTU
				assignStructure('estimateMainControllingListController');

				// Procurement-Structure
				assignStructure('estimateMainProcurementStructureService');

				// Enterprise Cost Group 1
				assignStructure('estimateMainLicCostgroup1ListController');

				// Enterprise Cost Group 2
				assignStructure('estimateMainLicCostgroup2ListController');

				// Enterprise Cost Group 3
				assignStructure('estimateMainLicCostgroup3ListController');

				// Enterprise Cost Group 4
				assignStructure('estimateMainLicCostgroup4ListController');

				// Enterprise Cost Group 5
				assignStructure('estimateMainLicCostgroup5ListController');

				// Project Cost Group 1
				assignStructure('estimateMainPrjCostgroup1ListController');

				// Project Cost Group 2
				assignStructure('estimateMainPrjCostgroup2ListController');

				// Project Cost Group 3
				assignStructure('estimateMainPrjCostgroup3ListController');

				// Project Cost Group 4
				assignStructure('estimateMainPrjCostgroup4ListController');

				// Project Cost Group 5
				assignStructure('estimateMainPrjCostgroup5ListController');

				// Assembly-Structure
				assignStructure('estimateMainAssemblyCategoryTreeController');

			}

			function getAssemblyLookupSelectedItems(entity, assemblySelectedItems, isResolvedFromValidation) {
				if (!service.isAssignAssemblyInProcess) {
					service.isAssignAssemblyInProcess = true;

					if (!_.isEmpty(assemblySelectedItems) && _.size(assemblySelectedItems) >= 1) {
						let assemblyIds = _.map(assemblySelectedItems, 'Id');
						let currentSelectedLineItems = service.getSelectedEntities();

						let postData = {
							LineItemCreationData: {
								SelectedItems: currentSelectedLineItems,
								ProjectId: service.getSelectedProjectId(),
								EstHeaderFk: service.getSelectedEstHeaderId()
							},
							AssemblyIds: assemblyIds,
							DragDropAssemlySourceType: $injector.get('estimateMainDragDropAssemblyTypeConstant').AssemblyLookUp
						};

						if (!isResolvedFromValidation) {
							angular.extend(postData.LineItemCreationData, _.first(currentSelectedLineItems));
						}

						lineItemsPromise = service.AssignAssemblyToLineItem(postData, currentSelectedLineItems, isResolvedFromValidation);


					}
				}
				return lineItemsPromise.then(function (data) {
					let lineitem = _.filter(data, {'Id': entity.Id});
					return (lineitem && lineitem.length > 0);
				});
			}

			function AssignAssemblyToLineItem(postData, currentSelectedLineItems, isResolvedFromValidation) {

				return $http.post(globals.webApiBaseUrl + 'estimate/main/lineitem/resolveassembliestolineitem', postData).then(function (response) {
					let platformDataServiceDataProcessorExtension = $injector.get('platformDataServiceDataProcessorExtension');
					let platformGridAPI = $injector.get('platformGridAPI');
					let resourcesTreeFromMultiAssembly = response.data.LineItemsTotal || [];

					let data = serviceContainer.data;
					let gridId = 'b46b9e121808466da59c0b2959f09960';
					let currentSelectedLineItem = null; // It is used at the end to highlight line item

					currentSelectedLineItems = currentSelectedLineItems || [];

					if (resourcesTreeFromMultiAssembly.length > 0) {
						let processList = function processList(items, level, callBack) {
							_.forEach(items, function (item) {
								if (level === 0) {
									item.nodeInfo = {collapsed: false, level: level};
								}

								item.RuleAssignment = [];
								item.Rule = [];

								if (callBack) {
									callBack(item);
								}
							});
						};

						processList(resourcesTreeFromMultiAssembly, 0, function (item) {
							platformDataServiceDataProcessorExtension.doProcessItem(item, data);

							currentSelectedLineItem = _.find(currentSelectedLineItems, {'Id': item.Id});
							if (currentSelectedLineItem) {

								item.ProjectName = currentSelectedLineItem.ProjectName;
								item.ProjectNo = currentSelectedLineItem.ProjectNo;
								item.EstimationCode = currentSelectedLineItem.EstimationCode;
								item.EstimationDescription = currentSelectedLineItem.EstimationDescription;

								angular.extend(currentSelectedLineItem, item);
							} else {
								// add item to save
								data.itemList.push(item);
								data.addEntityToCache(item, data);
								data.markItemAsModified(item, data);
							}
						});

						let estLineItems2EstRules = response.data.EstLineItems2EstRules || [];

						let estLineItemsParams = response.data.EstLineItemsParams || [];

						let estPrjRules = response.data.EstPrjRules || [];

						estimateRuleFormatterService.setEstLineItems2EstRules('EstLineItems2EstRules', estLineItems2EstRules);

						estimateRuleFormatterService.setEstPrjRules(estPrjRules);

						estimateParameterFormatterService.setEstLineItemsParam('EstLineItemsParam', estLineItemsParams);

						if (response.data.copyBoqItem) {
							let output = [];
							$injector.get('cloudCommonGridService').flatten([response.data.copyBoqItem], output, 'BoQItems');
							_.forEach(output, function (boqitem) {
								boqitem.BoqItems = boqitem.BoQItems;
							});
							$injector.get('estimateMainBoqLookupService').addLookupData(output);
						}

						let estimateMainResourceService = $injector.get('estimateMainResourceService');
						// Clear estimate resource modifications
						estimateMainResourceService.clearModifications();

						if (isResolvedFromValidation) { // BulkEditor
							// Add logic after resolved from validation
							estimateMainResourceService.load();
						} else {
							// Refresh the line item grid and load resources
							serviceContainer.data.listLoaded.fire();

							// Highlight is gone but
							// serviceContainer.Data.selectedItem is kept, so we just highlight it instead of deselect and select  service.deselect({}).then(function(){ service.select(resource); })
							if (currentSelectedLineItem) {
								let gridLineItem = platformGridAPI.grids.element('id', gridId);
								if (gridLineItem && gridLineItem.instance) {
									let rows = gridLineItem.dataView.mapIdsToRows([currentSelectedLineItem.Id]);
									gridLineItem.instance.setSelectedRows(rows);
								}
							}
						}

						let estimateMainLineItem2MdlObjectService = $injector.get('estimateMainLineItem2MdlObjectService');
						estimateMainLineItem2MdlObjectService.gridRefresh();
					}
					service.isAssignAssemblyInProcess = false;

					if (response.data.lineItemsNoNeedToUpdate && response.data.lineItemsNoNeedToUpdate.length > 0) {
						if (!isResolvedFromValidation) {
							let platformModalService = $injector.get('platformModalService');
							let modalOptions = {
								headerTextKey: 'estimate.main.assignAssembly.reportTitle',
								templateUrl: globals.appBaseUrl + 'estimate.main/templates/assign-assembly/line-item-assign-assembly-result-report.html',
								iconClass: 'ico-info',
								dataItems: response.data
							};
							platformModalService.showDialog(modalOptions);
						}
					}

					return response.data.lineItemsUpdated;

				}, function (err) {
					service.isAssignAssemblyInProcess = false;
					// eslint-disable-next-line no-console
					console.error(err);
					return [];
				});
			}

			function setEstiamteReadData(readData) {
				estiamteReadData = readData;
			}

			function getEstiamteReadData() {
				return estiamteReadData;
			}

			/** Private Functions **/
			function resourceReadFunction(data, readData, onReadSucceeded) {
				let httpReadLineItemPromise = $http({
					url: estimateMainServiceOptions.flatNodeItem.httpRead.route + estimateMainServiceOptions.flatNodeItem.httpRead.endRead,
					method: estimateMainServiceOptions.flatNodeItem.httpRead.usePostForRead ? 'POST' : 'GET',
					data: readData
				});
				let promises = [];
				// 1. Set estimate default settings
				promises.push(setEstDefaultSettings(readData));
				// 2. Retrieve estimate line items
				promises.push(httpReadLineItemPromise);

				return $q.all(promises).then(function () {
					let responseEstHeaderData = promises[0].$$state.value.data;
					let responseLineItemData = promises[1].$$state.value.data;

					handleBeforeEstHeaderResponse(responseEstHeaderData);
					handleBeforeLineItemResponse(responseLineItemData);

					onReadSucceeded(responseLineItemData, data);
				});
			}

			function handleBeforeEstHeaderResponse() {
				// Add logic here
			}

			function handleBeforeLineItemResponse(data) {
				// Add logic here
				// eslint-disable-next-line no-prototype-builtins
				if (data.hasOwnProperty('IsDynamicColumnActive') && data.IsDynamicColumnActive === true) {
					setDynamicColumnsLayout(data);
				}

			}

			function extendSearchFilter(filterRequest) {
				filterRequest.filter = 'BasUomFk,UserDefined1';
				filterRequest.furtherFilters = [{
					Token: 'FILTER_BY_VIEW:' + filterView.currentViewType,
					Value: filterView.currentCustomView
				}];
				let estHeaderFk = parseInt(estimateMainService.getSelectedEstHeaderId());
				if (estHeaderFk !== -1) {
					filterRequest.furtherFilters.push({Token: 'EST_HEADER', Value: estHeaderFk});
				} else {
					filterRequest.furtherFilters = [{
						Token: 'FILTER_BY_VIEW:' + filterView.currentViewType,
						Value: filterView.currentCustomView
					}];

				}
				if (isLoadByNavigation) {
					filterRequest.furtherFilters.push({Token: 'EST_HEADER', Value: selectedEstHeaderFk});
					if (selectedConstructionSystemInstance) {
						filterRequest.furtherFilters.push({
							Token: 'COS_INSTANCE',
							Value: selectedConstructionSystemInstance.Id
						});
						filterRequest.furtherFilters.push({
							Token: 'COS_INS_HEADER',
							Value: selectedConstructionSystemInstance.InstanceHeaderFk
						});
					}

					isLoadByNavigation = false;
				}

				filterRequest.orderBy = [{Field: 'Code'}];
				extendSearchFilterAssign(filterRequest);
				estimateMainFilterService.setFilterRequest(filterRequest);
			}

			function extendSearchFilterAssign(filterRequest) {
				// init furtherFilters - add filter IDs from filter structures
				let filterType = estimateMainFilterService.getFilterFunctionType();

				// first remove all existing leading structure filters
				filterRequest.furtherFilters = _.filter(filterRequest.furtherFilters, function (i) {
					return i.Token.indexOf('FILTER_BY_STRUCTURE') < 0;
				});

				let leadingStructuresFilters = _.filter(_.map(estimateMainFilterService.getAllFilterIds(), function (v, k) {
					if (_.size(v) === 0) {
						return undefined;
					}
					// type 0 - assigned;
					// -> no change needed

					// type 1 - assigned and not assigned
					if (filterType === 1) {
						v.push('null');
					}
					// type 2 - not assigned
					else if (filterType === 2) {
						v = ['null'];
					}
					let value = v.join(',');
					return {Token: 'FILTER_BY_STRUCTURE:' + k, Value: value};
				}), angular.isDefined);

				filterRequest.furtherFilters = filterRequest.furtherFilters ? _.concat(filterRequest.furtherFilters, leadingStructuresFilters) : leadingStructuresFilters;
				lastFilter = filterRequest;
			}

			function setListView(_filterView, customView) {
				filterView.currentViewType = _filterView;
				if (customView !== null) {
					filterView.currentCustomView = customView.ViewConfig.columns.combineColumns.map(function (col) {
						return col.field;
					}).join(',');
				}
				setFilteredGridColumns();
			}

			function setAvailableGridColumns(cols) {
				availableGridColumns = cols;
			}

			function setFilteredGridColumns() {
				let grid = platformGridAPI.grids.element('id', gridId);

				switch (filterView.currentViewType) {
					case 0:
						// Standard View
						if (grid && grid.instance) {

							angular.forEach(columnsRemoved, function (col) {
								grid.columns.current.push(col);
							});

							platformGridAPI.columns.configuration(gridId, grid.columns.current);
							platformGridAPI.grids.resize(gridId);
						}

						break;
					case 1:
						// Item, Unit Cost View
						columnsRemoved = {};

						if (grid && grid.instance) {
							let itemUnitCostFieldsToRemove = ['PsdActivityFk', 'BoqItemFk', 'LgmJobFk', 'BasUomTargetFk', 'WicBoqItemFk',
								'MdcAssetMasterFk', 'MdcControllingUnitFk', 'MdcWorkCategoryFk',
								'PrcStructureFk',
								'LicCostGroup1Fk', 'LicCostGroup2Fk', 'LicCostGroup3Fk', 'LicCostGroup4Fk', 'LicCostGroup5Fk',
								'PrjChangeFk', 'PrjCostGroup1Fk', 'PrjCostGroup2Fk', 'PrjCostGroup3Fk', 'PrjCostGroup4Fk', 'PrjCostGroup5Fk', 'PrjLocationFk',
								'SortCode01Fk', 'SortCode02Fk', 'SortCode03Fk', 'SortCode04Fk', 'SortCode05Fk', 'SortCode06Fk', 'SortCode07Fk', 'SortCode08Fk', 'SortCode09Fk', 'SortCode10Fk',
								'SortDesc01Fk', 'SortDesc02Fk', 'SortDesc03Fk', 'SortDesc04Fk', 'SortDesc05Fk', 'SortDesc06Fk', 'SortDesc07Fk', 'SortDesc08Fk', 'SortDesc09Fk', 'SortDesc10Fk',
								'UserDefined1', 'UserDefined2', 'UserDefined3', 'UserDefined4', 'UserDefined5'];
							columnsRemoved = _.filter(grid.columns.current, function (col) {
								if (_.includes(itemUnitCostFieldsToRemove, col.field)) {
									return true;
								}
							});

							let columns = _.filter(grid.columns.current, function (col) {
								if (!_.includes(itemUnitCostFieldsToRemove, col.field)) {
									return true;
								}
							});


							platformGridAPI.columns.configuration(gridId, columns);
							platformGridAPI.grids.resize(gridId);
						}

						break;
					case 2:
						// Custom View
						platformGridAPI.columns.configuration(gridId, availableGridColumns);
						platformGridAPI.grids.resize(gridId);
						break;
					default:
						// Show All Available Columns
						platformGridAPI.columns.configuration(gridId, availableGridColumns);
						platformGridAPI.grids.resize(gridId);
				}
			}

			function tempReplacementData(readData) {
				let project = cloudDesktopPinningContextService.getPinningItem('project.main');
				let estHeader = cloudDesktopPinningContextService.getPinningItem('estimate.main');

				readData.ExecutionHints = false;
				readData.IncludeNonActiveItems = false;
				readData.PageNumber = 0;
				readData.PageSize = 100;
				readData.Pattern = null;
				readData.PinningContext = [project, estHeader];
				readData.ProjectContextId = project ? project.id : null;
				readData.UseCurrentClient = false;
				readData.filter = '';
				readData.furtherFilters = [];
				readData.orderBy = [{'Field': 'Code'}];
				extendSearchFilter(readData);
			}
		}]);
})();
