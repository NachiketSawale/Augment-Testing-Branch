/**
 * Created by spr on 2017-05-10.
 */

(function (angular) {
	/* global globals, _ */

	'use strict';

	let moduleName = 'estimate.rule';
	angular.module(moduleName).factory('estimateRuleParameterValueService', ['$http', 'platformDataServiceFactory',
		'estimateRuleParameterService', 'estimateRuleService','basicsLookupdataLookupDescriptorService','platformRuntimeDataService','platformDataValidationService',
		'platformDataServiceModificationTrackingExtension','platformModalService','$translate', 'estimateRuleParamValueValidationProcessService',
		function (
			$http, platformDataServiceFactory, estimateRuleParameterService, estimateRuleService,basicsLookupdataLookupDescriptorService,
			platformRuntimeDataService,platformDataValidationService,platformDataServiceModificationTrackingExtension,platformModalService,$translate, estimateRuleParamValueValidationProcessService) {

			let service = {};
			let isFilterActive = false;

			let estimateRuleParameterServiceOption = {
				flatLeafItem: {
					module: moduleName,
					serviceName: 'estimateRuleParameterValueService',
					httpCreate: {route: globals.webApiBaseUrl + 'estimate/rule/parameter/value/', endCreate: 'createitem'},
					httpRead: {
						route: globals.webApiBaseUrl + 'estimate/rule/parameter/value/',
						endRead: 'listbyparam',
						usePostForRead: true,
						initReadData: initReadData
					},
					entityRole: {
						leaf: {
							itemName: 'EstRuleParamValue',
							parentService: estimateRuleParameterService,
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

								platformRuntimeDataService.readonly(newData, [{field: 'ParameterCode', readonly: !isFilterActive}, {field: 'IsDefault', readonly: isFilterActive}]);
							}
						}
					}
				}
			};

			let serviceContainer = platformDataServiceFactory.createNewComplete(estimateRuleParameterServiceOption);
			service = serviceContainer.service;
			serviceContainer.data.usesCache=false;
			service.name = 'estimaterule.parametervalue';
			serviceContainer.data.newEntityValidator = estimateRuleParamValueValidationProcessService;

			// if filter by all, do not clear itemlist
			serviceContainer.data.clearContent = function clearListContent() {
				if(!isFilterActive) {
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

			function canCreateCallBackFunc(){
				let parentItem = estimateRuleParameterService.getSelected();
				if (service.isSelection(parentItem)) {
					return !(!parentItem.IsLookup && !isFilterActive);
				}
				return false;
			}

			let deleteEntitiesOriginal = serviceContainer.service.deleteEntities;
			serviceContainer.service.deleteEntities = deleteEntities;
			function deleteEntities(entities,oldRuleParamItem) {
				let parentItem=estimateRuleParameterService.getSelected();
				let strContent = $translate.instant('estimate.rule.confirmDeleteBodyContent');
				let strTitle = $translate.instant('estimate.rule.confirmDeleteBodyTitle');

				let route=globals.webApiBaseUrl + 'estimate/rule/parameter/value/DeleteRuleParamByParamValueFK';

				$http.post(route,entities).then(function (responeData) {

					if(responeData && (responeData.data.isAssginLineItem || responeData.data.isAssginAssemblyCat)){
						// if the parameter value assgined to the Assembly  ,should show a warning :cannot be delete
						if(oldRuleParamItem){
							parentItem.IsLookup = oldRuleParamItem.IsLookup;
							parentItem.DefaultValue = oldRuleParamItem.DefaultValue;
							parentItem.EstRuleParamValueFk = oldRuleParamItem.EstRuleParamValueFk;
							estimateRuleParameterService.gridRefresh();
						}
						let strContent1 = $translate.instant('estimate.rule.dialog.allEstParamValueAssignedMessage', {
							value0: responeData.data.assemblyCodes,
							value1: responeData.data.assemblyCatCodes
						});
						return platformModalService.showErrorBox(strContent1, 'cloud.common.errorMessage');
					}else if(responeData !== undefined && responeData.data.isQuoteByParam) {

						// if the parameter value be quote in paramter but not assign to the Assembly ,before delete the paramter value should be show warning ,else delete direct
						platformModalService.showYesNoDialog(strContent, strTitle).then(function (response) {
							if (response.yes) {
								parentItem.EstRuleParamValueFk = '';
								parentItem.DefaultValue = '';
								parentItem.ValueDetail='';
								estimateRuleParameterService.gridRefresh();
								deleteEntitiesOriginal(entities);
							}
						});
					}else {
						_.forEach(entities,function(item){
							if(item.Id === parentItem.EstRuleParamValueFk){
								parentItem.EstRuleParamValueFk = '';
								parentItem.DefaultValue = '';
								parentItem.ValueDetail='';
							}
						});
						estimateRuleParameterService.gridRefresh();
						deleteEntitiesOriginal(entities);
					}
					basicsLookupdataLookupDescriptorService.refresh('RuleParameterValueLookup');
					// let ruleParameterValueDataInCache = basicsLookupdataLookupDescriptorService.getData('RuleParameterValueLookup');
				});

			}

			function initReadData(readData) {
				let ruleItem = estimateRuleParameterService.getParentItem();
				let ruleParameterItem = estimateRuleParameterService.getSelected();
				readData.lineItemContextId = ruleItem ? ruleItem.MdcLineItemContextFk : null;
				if(ruleParameterItem) {
					readData.code = ruleParameterItem.Code;
					readData.isLookup = ruleParameterItem.IsLookup;
					readData.ValueType = ruleParameterItem.ValueType;
				}
				readData.isFilter = isFilterActive;
			}

			function initCreationData(creationData){
				// set rule parameter id
				let selectRuleParameterItem = estimateRuleParameterService.getSelected();
				if (selectRuleParameterItem) {
					creationData.MainItemId = selectRuleParameterItem.Id;
					creationData.Code = selectRuleParameterItem.Code;
					creationData.ValueType = selectRuleParameterItem.ValueType;
				}

				// set rule id
				let selectRuleItem = estimateRuleService.getSelected();
				if(selectRuleItem){
					creationData.parentId = selectRuleItem.Id;
					creationData.MdcLineItemContextFk=selectRuleItem.MdcLineItemContextFk;
				}
			}

			function incorporateDataRead(responseData, data){
				_.each(responseData, function(entity){
					platformRuntimeDataService.readonly(entity, [{field: 'IsDefault', readonly: isFilterActive},
						{field: 'ParameterCode', readonly: true}]);
				});

				return data.handleReadSucceeded(responseData, data);
			}

			service.getAllCaheData = function (itemId) {
				if (itemId) {
					return serviceContainer.data.provideCacheFor(itemId, serviceContainer.data);
				}
				else {
					return serviceContainer.data.cache;
				}
			};

			service.getFilterStatus = function getFilterStatus(){
				return isFilterActive;
			};

			service.setFilterStatus = function setFilterStatus(value){
				isFilterActive = value;
			};

			return service;
		}
	]);

})(angular);
