/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	/* global globals */
	const moduleName = 'estimate.main';

	/**
	 * @ngdoc service
	 * @name estimateMainRuleParameterDataServiceFactory
	 * @description This is the data service for estimate main rule parameter item related functionality.
	 */
	angular.module(moduleName).service('estimateMainRuleParameterDataServiceFactory', EstimateMainRuleParameterDataServiceFactory);

	EstimateMainRuleParameterDataServiceFactory.$inject = ['_', '$http', 'PlatformMessenger','$injector','platformDataServiceFactory',
		'platformDataServiceProcessDatesBySchemeExtension', 'estimateMainRuleDataService','estimateRuleParameterConstant',
		'platformRuntimeDataService','basicsLookupdataLookupDescriptorService', 'estimateMainRuleParameterProcessor'];

	function EstimateMainRuleParameterDataServiceFactory(_, $http, PlatformMessenger,$injector,platformDataServiceFactory,
		platformDataServiceProcessDatesBySchemeExtension, ruleDataService,estimateRuleParameterConstant,
		platformRuntimeDataService,basicsLookupdataLookupDescriptorService, estimateMainRuleParameterProcessor) {

		let existParamCode,
			serviceContainer = {};
		let canCreate = function canCreate() {
			let selectedRule = ruleDataService.getSelected();
			return !!selectedRule.IsPrjRule;
		};
		let canDelete = function canDelete() {
			let selectedRule = ruleDataService.getSelected();
			return !!selectedRule.IsPrjRule;
		};

		let option = {
			flatNodeItem: {
				module: angular.module('estimate.main'),
				serviceName: 'estimateMainRuleParameterDataServiceFactory',
				entityNameTranslationID: '',
				httpRead: {
					route: globals.webApiBaseUrl + 'estimate/rule/projectestruleparam/',
					endRead: 'listbycompositeprjrule',
					usePostForRead: true,
					initReadData: function (readData) {
						let rules = ruleDataService.getList();
						let selectedRule = ruleDataService.getSelected();
						// selectedItem = selectedRule;
						let ruleIds = [];
						angular.forEach(rules, function (rule) {
							ruleIds.push(rule.OriginalMainId);
						});

						if (ruleIds && selectedRule) {
							readData.ruleId = selectedRule.OriginalMainId;
							readData.IsPrjRule = selectedRule.IsPrjRule;
							readData.ruleIds = ruleIds;
						}
					}
				},
				httpCreate: {
					route: globals.webApiBaseUrl + 'estimate/rule/projectestruleparam/', endCreate: 'create'
				},
				httpUpdate: {route: globals.webApiBaseUrl + 'estimate/main/lineitem/', endUpdate: 'update'},
				dataProcessor: [estimateMainRuleParameterProcessor],
				entityRole: {
					node: {
						itemName: 'PrjEstRuleParam',
						parentService: ruleDataService,
						doesRequireLoadAlways: true
					}
				},
				presenter: {
					list: {
						initCreationData: function initCreationData(creationData) {
							let selectedRuleItem = ruleDataService.getSelected();
							creationData.PKey1 = selectedRuleItem.OriginalMainId;
						},
						incorporateDataRead: function (readData, data) {
							readData.Main = _.sortBy(readData.Main, 'Sorting');
							angular.forEach(readData.Main, function (item) {
								if (item.ValueType === estimateRuleParameterConstant.Boolean ||  item.ValueType === estimateRuleParameterConstant.TextFormula) {
									if (typeof item.DefaultValue === 'boolean') {
										item.DefaultValue = item.DefaultValue ? 1 : 0;
									}
								}
							});

							estimateMainRuleParameterProcessor.processItems(readData.Main);

							basicsLookupdataLookupDescriptorService.attachData(readData);

							return serviceContainer.data.handleReadSucceeded(readData.Main, data);
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
				},
				actions: {
					create: 'flat',
					canCreateCallBackFunc: canCreate,
					delete: true,
					canDeleteCallBackFunc: canDelete,
				},
			}
		};

		serviceContainer = platformDataServiceFactory.createNewComplete(option);
		let service = serviceContainer.service;

		service.onUpdateData = new PlatformMessenger();

		service.refreshItem = function refreshItem(){
			serviceContainer.data.listLoaded.fire();
		};

		service.getParentItem = function getParentItem() {
			return ruleDataService.getSelected();
		};

		// set the old code before modified in validation
		service.setExistParamCode = function setExistParamCode(paramCode) {
			existParamCode = paramCode;
		};

		service.getExistParamCode = function getExistParamCode() {
			return existParamCode;
		};

		service.fireListLoaded = function fireListLoaded() {
			serviceContainer.data.listLoaded.fire();
		};

		service.fieldChanged = function fieldChanged(field, entity) {
			switch (field) {
				case 'ValueType':
					if(entity.ValueType === estimateRuleParameterConstant.TextFormula){
						entity.IsLookup = true;
					}else{
						entity.DefaultValue = 0;
					}
					estimateMainRuleParameterProcessor.processItem(entity);
					break;
				case 'IsLookup':
					if (!entity.IsLookup) {
						entity.DefaultValue = 0;
						entity.EstRuleParamValueFk = null;
					}else{
						entity.ValueDetail = String.Empty;
					}
					estimateMainRuleParameterProcessor.processItem(entity);
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

			$http.post(globals.webApiBaseUrl + 'basics/userform/getlistbyids?rubricFk=' + 79, [{FormId: rule.FormFk, ContextId: rule.OriginalMainId, ContextId1: 0}]).then(function (response) {
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

		service.onIsLookupChangeEvent = new PlatformMessenger();

		service.setSelectedHeader = function (headerId){
			serviceContainer.data.__IdSelectedCapture = headerId;
		};

		return service;
	}
})(angular);
