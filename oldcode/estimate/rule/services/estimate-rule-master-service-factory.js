/**
 * Created by joshi on 26.11.2015.
 */
(function (angular) {

	/* global globals, _ */
	'use strict';

	let moduleName = 'estimate.rule';

	let estimateRuleModule = angular.module(moduleName);
	/**
	 * @ngdoc service
	 * @name estimateRuleService
	 * @function
	 * @description
	 * estimateRuleService is the data service for project estimate rule item related functionality.
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	/* jshint -W003 */
	angular.module(moduleName).factory('estimateRuleMasterServiceFactory', [
		'$injector', '$http', 'platformGridAPI','platformModalService', 'PlatformMessenger', 'platformDataServiceFactory', 'platformRuntimeDataService', 'estimateRuleMainValidationProcessService','cloudCommonGridService',
		function ($injector, $http, platformGridAPI,platformModalService, PlatformMessenger, platformDataServiceFactory, platformRuntimeDataService, estimateRuleMainValidationProcessService, cloudCommonGridService) {

			let factoryService = {};
			factoryService.createNewMasterRuleService = function(option) {
				let gridId = null;
				let estimateRuleServiceOption = {
					hierarchicalRootItem: {
						module: estimateRuleModule,
						serviceName: 'estimateRuleService',
						httpCRUD: {
							route: globals.webApiBaseUrl + 'estimate/rule/estimaterule/',
							usePostForRead: true
						},
						httpRead: {
							route: globals.webApiBaseUrl + 'estimate/rule/estimaterule/',
							endRead: 'tree',
							usePostForRead: true
							// initReadData: function(){}
						},
						entityRole: {
							root: {
								addToLastObject: true,
								lastObjectModuleName: 'estimate.rule',
								codeField: 'Code',
								descField: 'DescriptionInfo.Translated',
								itemName: 'EstimateRule',
								moduleName: 'cloud.desktop.moduleDisplayNameRuleDefinitionMaster',
								handleUpdateDone: function (updateData, response) {
									if (response && response.EstRuleParamToSave && response.EstRuleParamToSave.length) {
										// after modify parameter value of the parameter ,need update the cache about the paramter value
										let ruleParamToSave = response.EstRuleParamToSave[0];
										if (ruleParamToSave && ruleParamToSave.EstRuleParamValueToSave && ruleParamToSave.EstRuleParamValueToSave.length > 0) {
											$injector.get('basicsLookupdataLookupDescriptorService').updateData('RuleParameterValueLookup', ruleParamToSave.EstRuleParamValueToSave);
											// to set the parameter code as readonly
											_.each(ruleParamToSave.EstRuleParamValueToSave, function (item) {
												platformRuntimeDataService.readonly(item, [{field: 'ParameterCode', readonly: true}]);
											});
										}
									}
								}
							}
						},
						entitySelection: {},
						presenter: {
							tree: {
								parentProp: 'EstRuleFk',
								childProp: 'EstRules',
								childSort: true,
								isDynamicModified: true,
								isInitialSorted: true,
								sortOptions: {initialSortColumn: {field: 'Code', id: 'code'}, isAsc: true},
								incorporateDataRead: function incorporateDataRead(readData, data) {
									$injector.get('estimateRuleValidationService').setMaxCodeLength(readData.codeMaxLenght);
									if (serForEstimate) {
										let res = {};
										res.EstRulesEntities = [];
										cloudCommonGridService.flatten(readData.EstimateRuleList, res.EstRulesEntities, 'EstRules');
										readData.EstimateRuleList = $injector.get('estimateRuleCommonService').generateRuleCompositeList(res, 'isForEstimate');

										let list = [];
										cloudCommonGridService.flatten(readData.EstimateRuleList, list, 'CustomEstRules');
										_.forEach(list, function (item) {
											item.EstRuleFk = item.CustomEstRuleFk;
											item.EstRules = item.CustomEstRules;
										});

										readData.EstimateRuleList = _.filter(list, function (item) {
											return !item.EstRuleFk && item.IsForEstimate;
										});
									}
									let result = {
										FilterResult: readData.FilterResult,
										dtos: readData.EstimateRuleList
									};
									return $injector.get('estimateRuleSequenceLookupService').getListAsync().then(function () {
										return serviceContainer.data.handleReadSucceeded(result, data);
									}
									);
									// return serviceContainer.data.handleReadSucceeded(result, data);
								}
							}
						},
						translation: {
							uid: 'estimateRuleService',
							title: 'estimate.rule.rulMasterTitle',
							columns: [{
								header: 'cloud.common.entityDescription',
								field: 'DescriptionInfo',
								maxLength : 255
							}],
							dtoScheme: {
								typeName: 'EstRuleDto',
								moduleSubModule:moduleName
							}
						},
						sidebarSearch: {
							options: {
								moduleName: moduleName,
								enhancedSearchEnabled: true,
								pattern: '',
								pageSize: 100,
								useCurrentClient: null,
								includeNonActiveItems: false,
								showOptions: true,
								showProjectContext: false,
								withExecutionHints: false
							}
						}
					}
				};

				if (option && option.isAssemblyRule){
					estimateRuleServiceOption.hierarchicalRootItem.entityRole.root = {
						addToLastObject: true,
						lastObjectModuleName: 'estimate.main',
						itemName: 'EstimateRule',
						moduleName: 'cloud.desktop.moduleDisplayNameRuleDefinitionMaster'
					};

					estimateRuleServiceOption.hierarchicalRootItem.translation = {};
				}

				let serviceContainer = platformDataServiceFactory.createNewComplete(estimateRuleServiceOption);
				let service = serviceContainer.service;
				let data = serviceContainer.data;

				if (option && option.isAssemblyRule) {
					data.showHeaderAfterSelectionChanged = null;
				}

				data.newEntityValidator = estimateRuleMainValidationProcessService;

				data.extendSearchFilter = function extendSearchFilter(filterRequest) {
					filterRequest.UseCurrentClient = true;
				};

				service.getContainerData = function getContainerData() {
					return serviceContainer.data;
				};

				serviceContainer.service.createDeepCopy = function createDeepCopy() {
					let selectedItems = service.getSelectedItems();
					$http.post(globals.webApiBaseUrl + 'estimate/rule/estimaterule/deepcopy', selectedItems).then(function (response) {
						let copies = response.data;
						angular.forEach(copies, function (copy) {
							let estRule = copy.EstimateRule;
							let creationData = {parent: null};
							if (estRule.EstRuleFk) {
								creationData.parent = data.getItemById(estRule.EstRuleFk, data);
							}

							data.onCreateSucceeded(estRule, data, creationData);
						});
					},
					function (/* error */) {
					});
				};

				service.getSelectedItems = function getSelectedItems() {
					let grid = platformGridAPI.grids.element('id', gridId).instance,
						rows = grid.getSelectedRows();

					return rows.map(function (row) {
						return grid.getDataItem(row);
					});
				};

				service.getGridId = function getGridId(itemId) {
					gridId = itemId;
				};

				let originalDeleteEntities = data.deleteItem;
				data.deleteItem = deleteEntity;

				function deleteEntity(entities, data) {
					if (entities) {
						let postData = {
							Id: entities.Id,
							MdcLineItemContextFk: entities.MdcLineItemContextFk
						};
						let responseData = [];
						return $http.post(globals.webApiBaseUrl + 'estimate/rule/estimaterule/getRelateEstRule', postData).then(function (response) {
							responseData = response.data;

							if (angular.isArray(responseData) && responseData.length > 0) {
								let modalOptions = {
									headerTextKey: 'cloud.common.errorMessage',
									bodyTextKey: 'estimate.rule.dialog.allEstRulesAssignedMessage',
									iconClass: 'ico-error',
									height: '185px',
									width: '700px'
								};
								return platformModalService.showDialog(modalOptions);
							} else {
								let message = 'estimate.rule.dialog.deleteAllSelectedRulesMessage';
								return platformModalService.showYesNoDialog(message, 'estimate.rule.dialog.confirmRuleDelete', 'no');

							}
						}).then(function (result) {
							if (result.yes) {
								originalDeleteEntities(entities, data);
							}
						});
					}
				}

				// handler
				service.setInitReadData = function (pattern) {
					estimateRuleServiceOption.hierarchicalRootItem.httpRead.initReadData = function (readData) {
						if (pattern) {
							readData.Pattern = pattern;
						}
					};
				};

				service.removeInitReadData = function () {
					estimateRuleServiceOption.hierarchicalRootItem.httpRead.initReadData = {};
				};

				let serForEstimate = false;

				service.setIsForEstimate = function (forEstimate) {
					let original = serForEstimate;
					serForEstimate = forEstimate;
					if (original !== forEstimate) {
						service.load();
					}
				};

				// fix the defect 73679
				// comment from Frank,
				// if Update takes a long time, it would be possible to
				// 1.Start update via changing main entity (may be done using one of the navigation buttons in tool bar)
				// 2.Repeat update by pressing the ‘save’ button.
				// In this case a handling just taking into account the save button is not sufficient. It must be part of the data service itself,
				// that while there is an outstanding update, no other update can be triggered.
				// Handling the issue inside the data service would solve issue  which individual implementations.

				// there are two functions to do data update, service.update and service.updateOnSelectionChanging, but the two use the data.doUpdate to save, so use it
				// solution A, using delay and throttle
				// (I found throttle better than debounce. When user edited selected item and change select quickly, the debounce seems not good )

				// serviceContainer.service.update = _.throttle(serviceContainer.service.update, 50);

				service.onMultipleSelectionChanged = new PlatformMessenger();
				serviceContainer.data.rulesOnCheckedUpdatePromise = null;
				service.isRuleOnCheckedUpdateInProcess = false;
				service.bulkUpdateOnRuleChecked = function bulkUpdateOnRuleChecked(entity, field, value, isFromBulkEditor) {
					if (service.isRuleOnCheckedUpdateInProcess) {
						return serviceContainer.data.rulesOnCheckedUpdatePromise;
					} else {
						service.isRuleOnCheckedUpdateInProcess = true;

						// Lock container while it calculating
						service.onMultipleSelectionChanged.fire(true);

						// Update fields and then send to server
						let currentSelectedRuleItems = service.getSelectedEntities();

						let postData = {
							EstRulesEntities: currentSelectedRuleItems
						};

						serviceContainer.data.rulesOnCheckedUpdatePromise = updateCheckedForEsttimateAndBoq(postData, isFromBulkEditor);
						return serviceContainer.data.rulesOnCheckedUpdatePromise;
					}
				};

				function updateCheckedForEsttimateAndBoq(postData) {
					return $http.post(globals.webApiBaseUrl + 'estimate/rule/estimaterule/updateCheckboxChanges', postData).then(function (response) {

						let temsResolved = response.data.EstRulesEntities || [];
						let allRulesItems = service.getList();
						// let currentSelectedLineItem = service.getSelected();
						// let currentSelectedLineItems = angular.copy(service.getSelectedEntities());

						let processList = function processList(items, callBack) {
							_.forEach(items, function (item) {
								if (callBack) {
									callBack(item);
								}
							});
						};

						processList(temsResolved, function (item) {
							// platformDataServiceDataProcessorExtension.doProcessItem(item, data);

							let itemToUpdate = _.find(allRulesItems, {'Id': item.Id});
							if (itemToUpdate) {
								// itemToUpdate.IsForEstimate = item.IsForEstimate;
								// itemToUpdate.IsForBoq = item.IsForEstimate;
								// angular.extend(itemToUpdate, item);

								itemToUpdate.Version = item.Version;

								// $injector.get('estimateMainLineItemDetailService').valueChangeCallBack(itemToUpdate, field, value);
							}
						});

						// Refresh the line item grid and load resources
						// serviceContainer.data.listLoaded.fire();
						// service.gridRefresh();

						// A: workaround to avoid save - Start
						let markItemAsModifiedBase = service.markItemAsModified;
						service.markItemAsModified = function () {
						};

						setTimeout(function () {

							// Unlock container when update is done
							service.onMultipleSelectionChanged.fire(false);

							// B: workaround to avoid save - End
							// set the markItemAsModified function back
							service.markItemAsModified = markItemAsModifiedBase;

						}, 0);

						// Highlight is gone but
						// serviceContainer.Data.selectedItem is kept, so we just highlight it instead of deselect and select  service.deselect({}).then(function(){ service.select(resource); })

						// //Unlock container when calculation is done
						// service.onMultipleSelectionChanged.fire(false);

						service.isRuleOnCheckedUpdateInProcess = false;
					}, function (err) {
						service.isRuleOnCheckedUpdateInProcess = false;
						// eslint-disable-next-line no-console
						console.error(err);
						return [];
					});
				}

				return service;
			};

			return factoryService;

		}]);
})(angular);
