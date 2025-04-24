/**
 * Created by zos on 3/23/2016.
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
	 * estimateRuleService is the data service for estimate rule item related functionality.
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	estimateRuleModule.factory('estimateRuleParameterService', [
		'_', '$injector', 'platformDataServiceFactory', 'PlatformMessenger', 'platformRuntimeDataService', 'estimateRuleService', 'estimateRuleParameterConstant', 'basicsLookupdataLookupDescriptorService', 'estimateRuleParamValidationProcessService', 'platformModalService', '$http',
		function (_, $injector, platformDataServiceFactory, PlatformMessenger, platformRuntimeDataService, estimateRuleService, estimateRuleParameterConstant, basicsLookupdataLookupDescriptorService, estimateRuleParamValidationProcessService, platformModalService, $http) {

			let existParamCode;

			let estimateRuleParameterServiceOption = {
				flatNodeItem: {
					module: estimateRuleModule,
					serviceName: 'estimateRuleParameterService',
					httpCRUD: {route: globals.webApiBaseUrl + 'estimate/rule/parameter/'},
					httpCreate: {route: globals.webApiBaseUrl + 'estimate/rule/parameter/'},
					httpRead: {route: globals.webApiBaseUrl + 'estimate/rule/parameter/'},
					setCellFocus: true,
					entityRole: {
						node: {
							itemName: 'EstRuleParam',
							parentService: estimateRuleService,
							doesRequireLoadAlways: true
						}
					},
					presenter: {
						list: {
							incorporateDataRead: function (readData, data) {
								readData.Main = _.sortBy(readData.Main, 'Sorting');
								angular.forEach(readData.Main, function (item) {
									let readOnlyField = [];
									if (item.ValueType === estimateRuleParameterConstant.Decimal2 || item.ValueType === estimateRuleParameterConstant.Text) {
										if (item.IsLookup) {
											readOnlyField = [{
												field: 'ValueDetail',
												readonly: true
											}];
											platformRuntimeDataService.readonly(item, readOnlyField);
										}
									} else if (item.ValueType === estimateRuleParameterConstant.TextFormula) {
										readOnlyField = [
											{field: 'IsLookup', readonly: true},
											{field: 'ValueDetail', readonly: true}];
										platformRuntimeDataService.readonly(item, readOnlyField);
									} else {
										readOnlyField = [
											{field: 'IsLookup', readonly: true},
											{field: 'ValueDetail', readonly: true}];
										platformRuntimeDataService.readonly(item, readOnlyField);
									}

									if (item.IsLookup) {
										item.DefaultValue = item.EstRuleParamValueFk;
									}
								});
								basicsLookupdataLookupDescriptorService.attachData(readData);

								let childServices = serviceContainer.service.getChildServices();
								let result = serviceContainer.data.handleReadSucceeded(readData.Main, data);

								if (!result.length) {
									if (childServices && childServices.length > 0) {
										let found = _.find(childServices, {name: 'estimaterule.parametervalue'});
										if (found) {
											found.loadSubItemList();
										}
									}
								}

								return result;// data.handleReadSucceeded(readData, data);
							},
							initCreationData: function initCreationData(creationData) {
								let selectedRuleItem = estimateRuleService.getSelected();
								creationData.PKey1 = selectedRuleItem.Id;
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
					translation: {
						uid: 'estimateRuleParameterService',
						title: 'estimate.rule.estimateRuleParameter',
						columns: [{
							header: 'cloud.common.entityDescription',
							field: 'DescriptionInfo',
							maxLength : 255
						}],
						dtoScheme: {
							typeName: 'EstRuleParamDto',
							moduleSubModule: 'Estimate.Rule'
						}
					}
				}
			};

			let serviceContainer = platformDataServiceFactory.createNewComplete(estimateRuleParameterServiceOption);

			serviceContainer.service.onIsLookupChangeEvent = new PlatformMessenger();

			// serviceContainer.service.onCodeChangeEvent = new PlatformMessenger();

			serviceContainer.service.fieldChanged = fieldChanged;

			// let data = serviceContainer.data;
			// this validation has been move to function createItem
			// data.newEntityValidator = estimateRuleParamValidationProcessService;

			function fieldChanged(field, entity) {
				let readOnlyField = [];
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
						} else if (entity.ValueType === estimateRuleParameterConstant.TextFormula) {
							readOnlyField = [
								{field: 'IsLookup', readonly: true},
								{field: 'ValueDetail', readonly: true}];
							platformRuntimeDataService.readonly(entity, readOnlyField);
							entity.IsLookup = true;
						} else {
							entity.DefaultValue = 0;
							readOnlyField = [
								{field: 'IsLookup', readonly: true},
								{field: 'ValueDetail', readonly: true}];
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
						} else {
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
						} else if (entity.IsLookup && entity.DefaultValue === null) {
							entity.EstRuleParamValueFk = null;
						}
						serviceContainer.service.fireItemModified(entity);
						break;
					default:
						break;
				}
			}

			serviceContainer.service.getParentItem = function getParentItem() {
				return estimateRuleService.getSelected();
			};

			serviceContainer.service.fireListLoaded = function fireListLoaded() {
				serviceContainer.data.listLoaded.fire();
			};

			serviceContainer.service.setReadOnly = function setReadOnly(entity) {
				let readOnlyField = [{field: 'IsLookup', readonly: false}, {field: 'ValueDetail', readonly: false}];
				if (entity.ValueType === estimateRuleParameterConstant.Boolean || entity.ValueType === estimateRuleParameterConstant.TextFormula) {
					entity.DefaultValue = entity.DefaultValue ? 1 : 0;
					readOnlyField[0].readonly = true;
					readOnlyField[1].readonly = true;
				}
				platformRuntimeDataService.readonly(entity, readOnlyField);

				serviceContainer.service.fireItemModified(entity);
			};

			let createItem = serviceContainer.service.createItem;
			serviceContainer.service.createItem = function (code, fromUserForm) {
				// save
				return estimateRuleService.update().then(function () {
					let entity = createItem();
					if (fromUserForm) {
						return entity;
					}

					return entity.then(function (item) {
						return estimateRuleParamValidationProcessService.validate(item);
					});
				});
			};

			serviceContainer.service.SaveParameterInfo = function SaveParameterInfo() {
				estimateRuleService.update().then(function () {
				});
			};

			serviceContainer.service.parameterGetValueListComplete = new PlatformMessenger();

			serviceContainer.service.parameterSetValueList = new PlatformMessenger();

			serviceContainer.service.deleteValuesComplete = new PlatformMessenger();

			// set the old code before modified in validation
			serviceContainer.service.setExistParamCode = function setExistParamCode(paramCode) {
				existParamCode = paramCode;
			};

			serviceContainer.service.getExistParamCode = function getExistParamCode() {
				return existParamCode;
			};

			serviceContainer.service.showForm = function (userFormOpenMethod) {
				let rule = serviceContainer.service.parentService().getSelected();
				if (!rule || !rule.FormFk) {
					return;
				}

				let basicsUserFormPassthroughDataService = $injector.get('basicsUserFormPassthroughDataService');
				let list = serviceContainer.service.getList();
				if (list) {
					_.forEach(list, function (item) {
						item.ParameterValue = item.DefaultValue;
					});
				}
				basicsUserFormPassthroughDataService.setInitialData({
					params: list,
					httpService: $http,
					baseUrl: globals.webApiBaseUrl,
					translate: $injector.get('$translate'),
					editCodeColumn: true,
					currentRule: rule,
					contextInfo: basicsUserFormPassthroughDataService.getContextInfo()
				});

				$http.post(globals.webApiBaseUrl + 'basics/userform/getlistbyids?rubricFk=' + 70, [{
					FormId: rule.FormFk,
					ContextId: rule.Id,
					ContextId1: 0
				}]).then(function (response) {
					if (response && response.data) {
						let item = response.data[0];
						let userFormCommonService = $injector.get('basicsUserformCommonService');
						let userFormOption = {
							formId: item.Id,
							formDataId: item.CurrentFormDataId,
							contextId: rule.Id,
							context1Id: 0,
							editable: true,
							modal: true,
							rubricFk: 70,
							openMethod: userFormOpenMethod - 0
						};

						userFormCommonService.showData(userFormOption);
					}
				});
			};

			serviceContainer.service.UpdateParameter = function (item, col) {
				if (col === 'ValueDetail') {
					if (item.ValueType === estimateRuleParameterConstant.Text) {
						item.ParameterText = item.ValueDetail;
					} else {
						$injector.get('estimateRuleCommonService').calculateDetails(item, col, 'DefaultValue', serviceContainer.service);
						$injector.get('estimateRuleCommonService').calculateDetails(item, col, 'ParameterValue', serviceContainer.service);
					}

				} else if (col === 'ParameterText') {
					if (item.ValueType !== estimateRuleParameterConstant.TextFormula) {
						item.ValueDetail = item.ParameterText;
					}

				} else if (col === 'ParameterValue') {
					item.DefaultValue = item.ParameterValue = (item.ParameterValue === '') ? 0 : item.ParameterValue;
					$injector.get('estimateRuleCommonService').calculateDetails(item, col);
				}

				serviceContainer.service.markItemAsModified(item);
				// check it here
				let params = serviceContainer.service.getList();
				if (params) {
					checkCodeConflict(params);
				}
			};

			function checkCodeConflict(displayData) {
				_.forEach(displayData, function (param) {
					$injector.get('estimateParameterComplexLookupValidationService').validateCode(param, param.Code, 'Code', displayData);
				});
			}

			return serviceContainer.service;
		}]);
})(angular, _);
