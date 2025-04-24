/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals, _ */
	'use strict';

	let moduleName = 'estimate.project';

	let estimateRuleModule = angular.module(moduleName);
	/**
	 * @ngdoc service
	 * @name estimateRuleService
	 * @function
	 * @description
	 * estimateRuleService is the data service for estimate rule item related functionality.
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	estimateRuleModule.factory('estimateProjectEstRuleParamService', ['$http', '$q','$injector', 'platformDataServiceFactory',
		'estimateProjectEstimateRulesService','PlatformMessenger','platformModalService','basicsLookupdataLookupDescriptorService','estimateRuleParameterConstant','platformRuntimeDataService','estimateProjectEstimateRuleParameValidationProcessor',
		function ($http, $q,$injector, platformDataServiceFactory, estimateProjectEstimateRulesService,PlatformMessenger,platformModalService,basicsLookupdataLookupDescriptorService,estimateRuleParameterConstant,platformRuntimeDataService,estimateProjectEstimateRuleParameValidationProcessor) {

			let existParamCode;

			let estimateRuleParameterServiceOption = {
				flatNodeItem: {
					module: estimateRuleModule,
					serviceName: 'estimateProjectEstRuleParamService',
					httpCreate: {route: globals.webApiBaseUrl + 'estimate/rule/projectestruleparam/'},
					httpRead: {route: globals.webApiBaseUrl + 'estimate/rule/projectestruleparam/',
						endRead: 'listbyprjrule',
						usePostForRead: true,
						initReadData: function (readData){
							let rules = estimateProjectEstimateRulesService.getList();
							let selectedRule = estimateProjectEstimateRulesService.getSelected();
							let ruleIds = [];
							angular.forEach(rules, function(rule){
								ruleIds.push(rule.Id);
							});

							if(ruleIds && selectedRule){
								readData.ruleId = selectedRule.Id;
								readData.ruleIds = ruleIds;
							}
						}
					},
					setCellFocus:true,
					entityRole: {
						node: {
							itemName: 'PrjEstRuleParam',
							parentService: estimateProjectEstimateRulesService,
							doesRequireLoadAlways: true
						}
					},
					presenter: {
						list: {
							initCreationData: function initCreationData(creationData) {
								let selectedRuleItem = estimateProjectEstimateRulesService.getSelected();
								creationData.PKey1 = selectedRuleItem.Id;
							},
							incorporateDataRead: function (readData, data) {
								readData.Main = _.sortBy(readData.Main,'Sorting');
								let readOnlyField =[];
								angular.forEach(readData.Main, function (item) {
									if (item.ValueType === estimateRuleParameterConstant.Decimal2 || item.ValueType === estimateRuleParameterConstant.Text) {
										if (item.IsLookup) {
											readOnlyField = [{
												field: 'ValueDetail',
												readonly: true
											}];
											platformRuntimeDataService.readonly(item, readOnlyField);
										}
									}else if(item.ValueType === estimateRuleParameterConstant.TextFormula){
										readOnlyField = [
											{field: 'IsLookup', readonly: true},
											{field: 'ValueDetail', readonly: true}];
										platformRuntimeDataService.readonly(item, readOnlyField);
									} else {
										item.DefaultValue = item.DefaultValue === 1;
										readOnlyField = [
											{field: 'IsLookup', readonly: true},
											{field: 'ValueDetail', readonly: true}];
										platformRuntimeDataService.readonly(item, readOnlyField);
									}

									if(item.IsLookup){
										item.DefaultValue = item.EstRuleParamValueFk;
									}
								});
								// basicsLookupdataLookupDescriptorService.updateData('PrjRuleParameterValueLookup',readData);
								basicsLookupdataLookupDescriptorService.attachData(readData);

								let childServices = serviceContainer.service.getChildServices();
								let result = serviceContainer.data.handleReadSucceeded(readData.Main, data);
								if (result && result.length > 0) {
									serviceContainer.service.goToFirst();
								} else {
									if (childServices && childServices.length > 0) {
										let found = _.find(childServices, {name: 'prjmain.rule.parametervalue'});
										if (found) {
											found.loadSubItemList();
										}
									}
								}
								return result;
							},
							handleCreateSucceeded: function (newData) {
								let totalList = serviceContainer.service.getList();
								if (totalList.length > 0) {
									newData.Sorting = _.max(_.map(totalList, 'Sorting')) + 1;
								} else {
									newData.Sorting = 1;
								}
							}
						}
					}
				}
			};

			let serviceContainer = platformDataServiceFactory.createNewComplete(estimateRuleParameterServiceOption);
			let service = serviceContainer.service;
			serviceContainer.data.usesCache = false;


			// let data = serviceContainer.data;
			// this validation has been move to function createItem
			// data.newEntityValidator = estimateProjectEstimateRuleParameValidationProcessor;

			// estimateProjectEstimateRulesService.onUpdateData.register(service.provideUpdateData);

			service.onUpdateData = new PlatformMessenger();

			service.provideUpdateData = function (updateData) {
				service.onUpdateData.fire(updateData);
				return updateData;
			};

			service.refreshOnProjectChange = function () {
				service.setList([]);
			};

			let createItem = service.createItem;
			service.createItem = function(code, fromUserForm){
				// save
				return $injector.get('projectMainService').update().then(function(){
					let entity = createItem();
					if(fromUserForm){
						return entity;
					}

					return entity.then(function (item) {
						return estimateProjectEstimateRuleParameValidationProcessor.validate(item);
					});
				});
			};

			serviceContainer.service.fireListLoaded = function fireListLoaded() {
				serviceContainer.data.listLoaded.fire();
			};

			serviceContainer.service.getParentItem = function getParentItem() {
				return estimateProjectEstimateRulesService.getSelected();
			};

			serviceContainer.service.onIsLookupChangeEvent = new PlatformMessenger();

			// serviceContainer.service.onCodeChangeEvent = new PlatformMessenger();

			serviceContainer.service.fieldChanged = fieldChanged;

			serviceContainer.service.parameterGetValueListComplete = new PlatformMessenger();

			serviceContainer.service.parameterSetValueList = new PlatformMessenger();

			serviceContainer.service.deleteValuesComplete = new PlatformMessenger();


			serviceContainer.service.setReadOnly = function setReadOnly(entity) {
				let readOnlyField = [{field: 'IsLookup', readonly: false}, {field: 'ValueDetail', readonly: false}];
				if (entity.ValueType === estimateRuleParameterConstant.Boolean ||  entity.ValueType === estimateRuleParameterConstant.TextFormula) {
					if (typeof entity.DefaultValue === 'boolean') {
						entity.DefaultValue = entity.DefaultValue ? 1 : 0;
					}
					readOnlyField[0].readonly = true;
					readOnlyField[1].readonly = true;
				}
				platformRuntimeDataService.readonly(entity, readOnlyField);

				serviceContainer.service.fireItemModified(entity);
			};

			serviceContainer.service.SavePrjParameterInfo = function SavePrjParameterInfo () {
				$injector.get('projectMainService').update().then(function(){
				});
			};

			function fieldChanged(field, entity) {
				let readOnlyField =[];
				switch (field) {
					case 'ValueType':
						if (entity.ValueType === estimateRuleParameterConstant.Decimal2 || entity.ValueType === estimateRuleParameterConstant.Text) {
							if (entity.IsLookup) {
								readOnlyField = [{
									field: 'ValueDetail',
									readonly: true
								}];
								platformRuntimeDataService.readonly(entity, readOnlyField);
							}
						}else if(entity.ValueType === estimateRuleParameterConstant.TextFormula){
							readOnlyField = [
								{field: 'IsLookup', readonly: true},
								{field: 'ValueDetail', readonly: true}];
							platformRuntimeDataService.readonly(entity, readOnlyField);
							entity.IsLookup = true;
						}else{
							entity.DefaultValue = 0;
							readOnlyField = [{field: 'IsLookup', readonly: true}, {
								field: 'ValueDetail',
								readonly: true
							}];
							platformRuntimeDataService.readonly(entity, readOnlyField);
						}
						break;
					case 'IsLookup':
						if (!entity.IsLookup) {
							entity.DefaultValue = 0;
							entity.EstRuleParamValueFk = 0;
							readOnlyField = [{
								field: 'ValueDetail',
								readonly: false
							}];
							platformRuntimeDataService.readonly(entity, readOnlyField);
						}else{
							readOnlyField = [{
								field: 'ValueDetail',
								readonly: true
							}];
							platformRuntimeDataService.readonly(entity, readOnlyField);
						}
						break;
					case 'DefaultValue':
						// Change true and false to 1 and 0 for Boolean type
						if (typeof entity.DefaultValue === 'boolean') {
							entity.DefaultValue = entity.DefaultValue ? 1 : 0;
							entity.ValueDetail = '';
						}
						else if (entity.IsLookup && entity.DefaultValue === null){
							entity.EstRuleParamValueFk = null;
						}
						serviceContainer.service.fireItemModified(entity);
						break;
					default:
						break;
				}
			}

			service.fireListLoaded = function fireListLoaded() {
				serviceContainer.data.listLoaded.fire();
			};

			// set the old code before modified in validation
			serviceContainer.service.setExistParamCode = function setExistParamCode(paramCode){
				existParamCode = paramCode;
			};

			serviceContainer.service.getExistParamCode = function getExistParamCode(){
				return existParamCode;
			};

			service.showForm = function (userFormOpenMethod) {
				let rule = service.parentService().getSelected();
				if(!rule || !rule.FormFk){
					return;
				}

				let basicsUserFormPassthroughDataService = $injector.get('basicsUserFormPassthroughDataService');
				let list = service.getList();
				basicsUserFormPassthroughDataService.setInitialData({
					params: list,
					httpService: $http,
					baseUrl: globals.webApiBaseUrl,
					translate:$injector.get('$translate'),
					editCodeColumn: true,
					currentRule: rule,
					contextInfo: basicsUserFormPassthroughDataService.getContextInfo()
				});

				$http.post(globals.webApiBaseUrl + 'basics/userform/getlistbyids?rubricFk=' + 79, [{FormId: rule.FormFk, ContextId: rule.Id, ContextId1: 0}]).then(function (response) {
					if (response && response.data) {
						let item = response.data[0];
						let userFormCommonService = $injector.get('basicsUserformCommonService');
						let userFormOption = {
							formId: item.Id,
							formDataId: item.CurrentFormDataId,
							contextId: rule.Id,
							context1Id : 0,
							editable: true,
							modal: true,
							rubricFk: 79,
							openMethod: userFormOpenMethod - 0
						};

						userFormCommonService.showData(userFormOption);
					}
				});
			};

			service.UpdateParameter = function(item, col){
				if (col === 'ValueDetail') {
					if(item.ValueType === estimateRuleParameterConstant.Text){
						item.ParameterText = item.ValueDetail;
					}else{
						$injector.get('estimateRuleCommonService').calculateDetails(item, col, 'DefaultValue', service);
						$injector.get('estimateRuleCommonService').calculateDetails(item, col, 'ParameterValue', service);
					}

				}else if(col === 'ParameterText'){
					if(item.ValueType !== estimateRuleParameterConstant.TextFormula){
						item.ValueDetail = item.ParameterText;
					}

				}else if (col === 'ParameterValue'){
					item.DefaultValue = item.ParameterValue = (item.ParameterValue === '') ? 0 : item.ParameterValue;
					$injector.get('estimateRuleCommonService').calculateDetails(item, col);
				}

				service.markItemAsModified(item);
				// check it here
				let params = service.getList();
				if(params){
					checkCodeConflict(params);
				}
			};

			function checkCodeConflict(displayData) {
				_.forEach(displayData,function (param) {
					$injector.get('estimateParameterComplexLookupValidationService').validateCode(param, param.Code, 'Code',displayData);
				});
			}

			return service;
		}]);
})(angular);
