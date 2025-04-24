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
	 * @name estimateMainRuleParameterValueDataServiceFactory
	 * @description This is the data service for estimate main rule parameter value item related functionality.
	 */
	angular.module(moduleName).service('estimateMainRuleParameterValueDataServiceFactory', EstimateMainRuleParameterValueDataServiceFactory);

	EstimateMainRuleParameterValueDataServiceFactory.$inject = ['_', '$injector','platformDataServiceFactory',
		'platformDataServiceProcessDatesBySchemeExtension', 'estimateMainRuleDataService','estimateRuleParameterConstant',
		'platformRuntimeDataService','basicsLookupdataLookupDescriptorService','estimateMainRuleParameterDataServiceFactory', 'estimateMainRuleParameterValueProcessor'];

	function EstimateMainRuleParameterValueDataServiceFactory(_, $injector,platformDataServiceFactory,
		platformDataServiceProcessDatesBySchemeExtension, estimateMainRuleDataService,estimateRuleParameterConstant,
		platformRuntimeDataService,basicsLookupdataLookupDescriptorService, parentRuleParamDataFactory, estimateMainRuleParameterValueProcessor) {

		let service = {};
		let isFilterActive = false;

		// get parent Rule Parameter service
		let parentRuleParamService = parentRuleParamDataFactory;

		let getProjectId = function getProjectId(){
			return $injector.get('estimateMainService').getProjectId();
		};

		let canCreate = function canCreate() {
			let isParentReadOnly = !parentRuleParamService.canCreate();
			let parentItem = parentRuleParamService.getSelected();
			if (service.isSelection(parentItem) && !isParentReadOnly) {
				return !(!parentItem.IsLookup && !isFilterActive);
			}
			return false;
		};

		let canDelete = function canDelete() {
			let selectedRule = estimateMainRuleDataService.getSelected();
			return !!selectedRule.IsPrjRule;
		};

		let option = {
			flatLeafItem: {
				module: angular.module('estimate.main'),
				serviceName: 'estimateMainRuleParameterValueDataServiceFactory',
				entityNameTranslationID: '',
				httpUpdate: {route: globals.webApiBaseUrl + 'estimate/main/lineitem/', endUpdate: 'update'},
				httpCreate: {route: globals.webApiBaseUrl + 'estimate/rule/projectestruleparam/value/', endCreate: 'createitem'},
				httpRead: {
					route: globals.webApiBaseUrl + 'estimate/rule/projectestruleparam/value/',
					endRead: 'listbycompositeparam',
					usePostForRead: true,
					initReadData: function (readData) {
						let ruleItem = estimateMainRuleDataService.getSelected();
						let ruleParameterItem = parentRuleParamService.getSelected();
						
						if (ruleParameterItem) {
							readData.PrjEstRuleFk = ruleParameterItem.PrjEstRuleFk;
							readData.code = ruleParameterItem.Code;
							readData.isLookup = ruleParameterItem.IsLookup;
							readData.ValueType = ruleParameterItem.ValueType;
						}

						let paroject = getProjectId();
						readData.PrjProjectFk = paroject > 0 ? paroject : null;
						readData.lineItemContextId = ruleItem ? ruleItem.MdcLineItemContextFk : null;
						readData.isFilter = isFilterActive;
						readData.IsPrjRuleParamValue = ruleItem ? ruleItem.IsPrjRule : false;
					}
				},
				actions: {
					create: 'flat',
					canCreateCallBackFunc: canCreate,
					delete : true,
					canDeleteCallBackFunc: canDelete,
				},
				dataProcessor: [estimateMainRuleParameterValueProcessor],
				entityRole: {
					leaf: {
						itemName: 'PrjRuleParamValue',
						parentService: parentRuleParamService,
						doesRequireLoadAlways: true
					}
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
				},
			}
		};

		let serviceContainer = platformDataServiceFactory.createNewComplete(option);
		service = serviceContainer.service;
		service.name = 'estimate.main.rule.parametervalue';
		serviceContainer.data.newEntityValidator = $injector.get('estimateMainRuleParameterValueEntityValidator');

		service.handleCellChanged = function handleCellChanged(arg) {

			let ruleParamSelectItem = parentRuleParamService.getSelected();
			let col = arg.grid.getColumns()[arg.cell].field;
			let curItem = arg.item;

			if (col === 'ValueDetail') {
				if (curItem.Id === ruleParamSelectItem.EstRuleParamValueFk) {
					ruleParamSelectItem.ValueDetail = curItem.ValueDetail;
					ruleParamSelectItem.ActualValue = curItem.Value;
				}
			}

			if (col === 'Value') {
				if (curItem.Id === ruleParamSelectItem.EstRuleParamValueFk) {
					ruleParamSelectItem.ValueDetail = curItem.Value;
					ruleParamSelectItem.ActualValue = curItem.Value;
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
			}

			parentRuleParamService.markItemAsModified(ruleParamSelectItem);
			parentRuleParamService.gridRefresh();
		};

		function initCreationData(creationData) {
			// set rule parameter id
			let selectRuleParameterItem = parentRuleParamService.getSelected();
			if (selectRuleParameterItem) {
				creationData.MainItemId = selectRuleParameterItem.Id;
				creationData.Code = selectRuleParameterItem.Code;
				creationData.ValueType = selectRuleParameterItem.ValueType;
			}

			// set rule id
			let selectRuleItem = estimateMainRuleDataService.getSelected();
			if (selectRuleItem) {
				creationData.parentId = selectRuleItem.OriginalMainId;
				creationData.PrjProjectFk = getProjectId();
				creationData.MdcLineItemContextFk = selectRuleItem.MdcLineItemContextFk;
			}
		}

		function incorporateDataRead(responseData, data) {
			_.each(responseData, function (entity) {
				platformRuntimeDataService.readonly(entity, [{field: 'IsDefault', readonly: isFilterActive},
					{field: 'ParameterCode', readonly: true}]);
			});
			basicsLookupdataLookupDescriptorService.removeData('PrjRuleParameterValueLookup');
			basicsLookupdataLookupDescriptorService.addData('PrjRuleParameterValueLookup', responseData);
			return data.handleReadSucceeded(responseData, data);
		}

		let doLoadAlways = false;
		function getLoadAlwaysStatus() {
			return doLoadAlways;
		}
		function loadDataByFilter(){
			let isFilterActive = service.getFilterStatus();
			if(isFilterActive || getLoadAlwaysStatus()) {
				service.load();
			}else{
				service.setList([]);
			}
		}

		service.getFilterStatus = function getFilterStatus() {
			return isFilterActive;
		};

		service.setFilterStatus = function setFilterStatus(value) {
			isFilterActive = value;
		};

		// if filter by all,  doNotLoadOnSelectionChange
		service.hasToLoadOnFilterActiveChange = function hasToLoadOnFilterActiveChange(isFilterActive) {
			serviceContainer.data.doNotLoadOnSelectionChange = isFilterActive;
			serviceContainer.data.doNotUnloadOwnOnSelectionChange = isFilterActive;
		};

		function setLoadAlwaysStatus(doLoad) {
			doLoadAlways = doLoad;
		}

		service.loadByFilter = function loadByFilter(doLoadAlways){
			setLoadAlwaysStatus(doLoadAlways);
			let mainService = $injector.get('estimateMainService');
			let modificationTrackingExtension = $injector.get('platformDataServiceModificationTrackingExtension');
			let updateData = modificationTrackingExtension.getModifications(mainService);

			if(updateData && updateData.EntitiesCount > 0){
				mainService.updateAndExecute(loadDataByFilter);
			}else{
				loadDataByFilter();
			}
		};

		service.refreshLookupData = function refreshLookupData(){
			let list = service.getList();
			basicsLookupdataLookupDescriptorService.removeData('PrjRuleParameterValueLookup');
			basicsLookupdataLookupDescriptorService.addData('PrjRuleParameterValueLookup', list);
		};

		return service;
	}

})(angular);
