/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals, _ */

	'use strict';

	let moduleName = 'estimate.project';

	angular.module(moduleName).factory('estimateProjectEstRuleParameterValueService', ['$http', '$injector', 'platformDataServiceFactory',
		'estimateProjectEstRuleParamService', 'estimateProjectEstimateRulesService', 'basicsLookupdataLookupDescriptorService', 'platformRuntimeDataService',
		'platformDataValidationService', 'platformDataServiceModificationTrackingExtension', 'platformDialogService', '$translate', 'PlatformMessenger',
		'estimatePrjRuleParamValueValidationProcessService', 'estimateRuleParameterConstant',
		function (
			$http, $injector, platformDataServiceFactory, estimateProjectEstRuleParamService, estimateProjectEstimateRulesService, basicsLookupdataLookupDescriptorService,
			platformRuntimeDataService, platformDataValidationService, platformDataServiceModificationTrackingExtension, platformDialogService, $translate,
			PlatformMessenger, estimatePrjRuleParamValueValidationProcessService, estimateRuleParameterConstant) {

			let service = {};
			let isFilterActive = false;

			let projectMainEstRuleParamServiceOption = {
				flatLeafItem: {
					module: moduleName,
					serviceName: 'estimateProjectEstRuleParameterValueService',
					httpCreate: {route: globals.webApiBaseUrl + 'estimate/rule/projectestruleparam/value/', endCreate: 'createitem'},
					httpRead: {
						route: globals.webApiBaseUrl + 'estimate/rule/projectestruleparam/value/',
						endRead: 'listbyprjparam',
						usePostForRead: true,
						initReadData: initReadData
					},
					entityRole: {
						leaf: {
							itemName: 'PrjRuleParamValue',
							parentService: estimateProjectEstRuleParamService,
							doesRequireLoadAlways: true
						}
					},
					actions: {
						delete: true,
						create: 'flat',
						canCreateCallBackFunc: canCreateCallBackFunc
						// canDeleteCallBackFunc: canCreateCallBackFunc

					},
					presenter: {
						list: {
							initCreationData: initCreationData,
							incorporateDataRead: incorporateDataRead,
							handleCreateSucceeded: function (newData) {
								let totalList = service.getList();
								if (totalList.length > 0) {
									newData.Sorting = _.max(_.map(totalList, 'Sorting')) + 1;
								} else {
									newData.Sorting = 1;
								}

								platformRuntimeDataService.readonly(newData, [{
									field: 'ParameterCode',
									readonly: !isFilterActive
								}, {field: 'IsDefault', readonly: isFilterActive}]);
							}
						}
					}
				}
			};

			let serviceContainer = platformDataServiceFactory.createNewComplete(projectMainEstRuleParamServiceOption);
			service = serviceContainer.service;
			serviceContainer.data.usesCache = false;
			service.name = 'prjmain.rule.parametervalue';
			serviceContainer.data.newEntityValidator = estimatePrjRuleParamValueValidationProcessService;

			// if filter by all, do not clear itemlist
			serviceContainer.data.clearContent = function clearListContent() {
				if (!isFilterActive) {
					serviceContainer.data.itemList.length = 0;
					if (serviceContainer.data.listLoaded) {
						serviceContainer.data.listLoaded.fire();
					}
				}
			};

			// if filter by all,  doNotLoadOnSelectionChange
			service.hasToLoadOnFilterActiveChange = function hasToLoadOnFilterActiveChange(isFilterActive) {
				serviceContainer.data.doNotLoadOnSelectionChange = isFilterActive;
			};

			service.handleCellChanged = function handleCellChanged(arg) {

				let ruleParamSelectItem = estimateProjectEstRuleParamService.getSelected();
				let col = arg.grid.getColumns()[arg.cell].field;
				let curItem = arg.item;

				if (col === 'ValueDetail') {
					if (curItem.Id === ruleParamSelectItem.EstRuleParamValueFk) {
						ruleParamSelectItem.ValueDetail = curItem.ValueDetail;
						ruleParamSelectItem.ActualValue = curItem.Value;
						estimateProjectEstRuleParamService.markItemAsModified(ruleParamSelectItem);
						estimateProjectEstRuleParamService.gridRefresh();
					}
				}

				if (col === 'Description') {
					if (curItem.Id === ruleParamSelectItem.EstRuleParamValueFk) {
						estimateProjectEstRuleParamService.gridRefresh();  // Refresh the grid to show the default value change
					}
				}

				if (col === 'Value') {
					if (curItem.Id === ruleParamSelectItem.EstRuleParamValueFk) {
						ruleParamSelectItem.ValueDetail = curItem.Value;
						ruleParamSelectItem.ActualValue = curItem.Value;
						estimateProjectEstRuleParamService.markItemAsModified(ruleParamSelectItem);
						estimateProjectEstRuleParamService.gridRefresh();
					}
				}

				if (col === 'IsDefault') {
					if (curItem.IsDefault) {
						ruleParamSelectItem.ValueDetail = curItem.ValueDetail;
						ruleParamSelectItem.DefaultValue = curItem.Id;
						ruleParamSelectItem.EstRuleParamValueFk = curItem.Id;
						ruleParamSelectItem.ActualValue = curItem.Value;

						if (ruleParamSelectItem.ValueType === estimateRuleParameterConstant.TextFormula) {
							ruleParamSelectItem.ValueText = curItem.DescriptionInfo.Translated;
						} else if (ruleParamSelectItem.ValueType === estimateRuleParameterConstant.Text) {
							ruleParamSelectItem.ValueText = curItem.ValueText;
						} else {
							ruleParamSelectItem.ParameterValue = curItem.Value;
						}

					} else {
						ruleParamSelectItem.ValueDetail = null;
						ruleParamSelectItem.DefaultValue = null;
						ruleParamSelectItem.EstRuleParamValueFk = null;
						ruleParamSelectItem.ActualValue = null;
					}

					estimateProjectEstRuleParamService.markItemAsModified(ruleParamSelectItem);
					estimateProjectEstRuleParamService.gridRefresh();
				}


			};

			/* let isLookup = function () {
				let parentItem = estimateProjectEstRuleParamService.getSelected();
				if (service.isSelection(parentItem)) {
					return parentItem.IsLookup;
				}
				return false;
			}; */

			function canCreateCallBackFunc() {
				let parentItem = estimateProjectEstRuleParamService.getSelected();
				if (service.isSelection(parentItem)) {
					return !(!parentItem.IsLookup && !isFilterActive);
				}
				return false;
			}

			let DeleteEntities = serviceContainer.service.deleteEntities;
			serviceContainer.service.deleteEntities = deleteEntities;

			function deleteEntities(entities, oldRuleParamItem) {

				let parentItem = estimateProjectEstRuleParamService.getSelected();
				let strContent = $translate.instant('estimate.rule.confirmDeleteBodyContent');
				let strTitle = $translate.instant('estimate.rule.confirmDeleteBodyTitle');

				let route = globals.webApiBaseUrl + 'estimate/rule/projectestruleparam/value/DeletePrjRuleParamByParamValueFK';

				$http.post(route, entities).then(function (responeData) {

					if (responeData && responeData.data.isAssgin2Item) {

						// if the parameter value assgined to the line item ,should show a warning :cannot be delete

						if (oldRuleParamItem) {
							parentItem.IsLookup = oldRuleParamItem.IsLookup;
							parentItem.DefaultValue = oldRuleParamItem.DefaultValue;
							parentItem.EstRuleParamValueFk = oldRuleParamItem.EstRuleParamValueFk;
							estimateProjectEstRuleParamService.gridRefresh();

						}
						return platformDialogService.showErrorBox('estimate.rule.dialog.allParamValueAssignedMessage', 'cloud.common.errorMessage');
					} else if (responeData !== undefined && responeData.data.isQuoteByParam) {

						// if the parameter value be quote in paramter but not assign to the lineItem ,before delete the paramter value should be show warning ,else delete direct
						platformDialogService.showYesNoDialog(strContent, strTitle).then(function (response) {
							if (response.yes) {
								parentItem.EstRuleParamValueFk = '';
								parentItem.DefaultValue = '';
								estimateProjectEstRuleParamService.gridRefresh();
								DeleteEntities(entities);
							}
						});
					} else {
						_.forEach(entities, function (item) {
							if (item.Id === parentItem.EstRuleParamValueFk) {
								parentItem.EstRuleParamValueFk = '';
								parentItem.DefaultValue = '';
								parentItem.ValueDetail = '';
							}
						});
						estimateProjectEstRuleParamService.gridRefresh();

						let filterList = _.filter(serviceContainer.data.itemList, function (item){
							return !_.find(entities, {Id: item.Id});
						});

						if(filterList && filterList.length > 0){
							filterList = angular.copy(filterList);
						}

						incorporateDataRead(filterList, serviceContainer.data);
					}

				});
			}

			function initReadData(readData) {
				let ruleItem = estimateProjectEstimateRulesService.getSelected();
				let ruleParameterItem = estimateProjectEstRuleParamService.getSelected();
				if (ruleParameterItem) {
					readData.PrjEstRuleFk = ruleParameterItem.PrjEstRuleFk;
					readData.code = ruleParameterItem.Code;
					readData.isLookup = ruleParameterItem.IsLookup;
					readData.ValueType = ruleParameterItem.ValueType;
				}
				let paroject = $injector.get('projectMainService').getSelected();
				readData.PrjProjectFk = paroject ? paroject.Id : null;
				readData.lineItemContextId = ruleItem ? ruleItem.MdcLineItemContextFk : null;
				readData.isFilter = isFilterActive;
			}

			function initCreationData(creationData) {
				// set rule parameter id
				let selectRuleParameterItem = estimateProjectEstRuleParamService.getSelected();
				if (selectRuleParameterItem) {
					creationData.MainItemId = selectRuleParameterItem.Id;
					creationData.Code = selectRuleParameterItem.Code;
					creationData.ValueType = selectRuleParameterItem.ValueType;
				}

				// set rule id
				let selectRuleItem = estimateProjectEstimateRulesService.getSelected();
				if (selectRuleItem) {
					creationData.parentId = selectRuleItem.Id;
					creationData.PrjProjectFk = selectRuleItem.ProjectFk;
					creationData.MdcLineItemContextFk = selectRuleItem.MdcLineItemContextFk;
				}
			}

			function incorporateDataRead(responseData, data) {

				_.each(responseData, function (entity) {
					platformRuntimeDataService.readonly(entity, [{field: 'IsDefault', readonly: isFilterActive},
						{field: 'ParameterCode', readonly: true}]);
				});
				return data.handleReadSucceeded(responseData, data);
			}

			service.getAllCaheData = function (itemId) {
				if (itemId) {
					return serviceContainer.data.provideCacheFor(itemId, serviceContainer.data);
				} else {
					return serviceContainer.data.cache;
				}
			};

			service.getParameterValues = function getParameterValues(projectFk, code, isLookup, lineItemContextId, ValueType) {
				return $http.get(globals.webApiBaseUrl + 'estimate/rule/projectestruleparam/value/existlist?projectId=' + projectFk + '&code=' + code + '&isLookup=' + isLookup + '&lineItemContextId=' + lineItemContextId + '&valueType=' + ValueType);
			};

			service.getFilterStatus = function getFilterStatus() {
				return isFilterActive;
			};

			service.setFilterStatus = function setFilterStatus(value) {
				isFilterActive = value;
			};

			return service;
		}
	]);

})(angular);

