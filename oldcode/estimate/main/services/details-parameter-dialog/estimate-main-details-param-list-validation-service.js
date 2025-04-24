/**
 * Created by Joshi on 16.12.2016.
 */
(function () {
	'use strict';
	/* global globals, _ */
	let moduleName = 'estimate.main';
	/**
	 * @ngdoc service
	 * @name estimateMainDetailsParamListValidationService
	 * @description provides validation methods for estimate details dialog parameter
	 */
	angular.module(moduleName).factory('estimateMainDetailsParamListValidationService',
		['$http', '$q', '$injector', '$translate', 'platformDataValidationService','platformRuntimeDataService','PlatformMessenger', 'estimateParamUpdateService',
			function ($http, $q, $injector, $translate, platformDataValidationService, platformRuntimeDataService, PlatformMessenger, estimateParamUpdateService) {

				let service = {};
				let commonCalculationSer = $injector.get('estimateMainCommonCalculationService');
				let estimateRuleCommonService = $injector.get('estimateRuleCommonService');

				angular.extend(service, {
					onCodeChange: new PlatformMessenger()
				});

				service.validateCode = function validateCode(entity, value, field, source) {
					entity.Code = value;
					let params = $injector.get('estimateMainDetailsParamListDataService').getList();
					let count = 0;
					let isValid = false;
					let result;

					_.forEach(params, function (param) {
						if (param.Code.toUpperCase() === value.toUpperCase() && param.Id !== entity.Id) {
							if (param.AssignedStructureId === entity.AssignedStructureId) {
								count++;
							}
						}
					});

					if (value === '...' || count > 0 || value === '') {
						if (value === '...') {
							result = platformDataValidationService.createErrorObject('cloud.common.Error_RuleParameterCodeHasError', {object: field.toLowerCase()});
						} else {
							result = platformDataValidationService.createErrorObject('cloud.common.uniqueValueErrorMessage', {object: field.toLowerCase()});
						}
						result.entity = entity;
						result.value = value;
						result.model = field;
						result.valideSrv = service;
						result.dataSrv = $injector.get('estimateMainDetailsParamListDataService');
						isValid = true;
						service.onCodeChange.fire(isValid);
					}
					else {
						result = platformDataValidationService.createSuccessObject();
						isValid = false;
						if ((source !== 'listLoad')) {
							service.onCodeChange.fire(isValid);
						}
					}

					platformRuntimeDataService.applyValidationResult(result, entity, field);
					return result;

				};
				service.validateValueDetail = function validateValueDetail(entity, value, field) {

					let detailsParamListDataService = $injector.get('estimateMainDetailsParamListDataService');
					let paramlist = detailsParamListDataService.getList();
					entity[field] = value;

					let parameterReference = {};

					entity.nonVallid = false;
					let isValid = false;
					let isMapCulture = true;
					let result = platformDataValidationService.createSuccessObject();


					let paramReference = {isLoop: false, linkReference: ''};
					estimateRuleCommonService.checkLoopReference(entity, detailsParamListDataService, paramReference);
					if (paramReference.isLoop) {
						result = {
							apply: true,
							valid: false,
							error: $translate.instant('estimate.rule.ParamReferenceLoop', {value1: paramReference.linkReference})
						};

						isValid = entity.nonVallid = true;
						service.onCodeChange.fire(isValid);
						platformRuntimeDataService.applyValidationResult(result, entity, field);
						return result;
					}


					let valueTypes = $injector.get('estimateRuleParameterConstant');
					if (entity.ValueType !== valueTypes.Text) {
						isMapCulture = commonCalculationSer.getIsMapCulture(value);
						parameterReference = estimateRuleCommonService.checkParameterReference(entity, paramlist, value);
					}

					if(!isMapCulture)
					{
						result = {
							apply: true,
							valid: false,
							error: $translate.instant('cloud.common.computationFormula')
						};
						isValid = true;
					}
					else
					{
						let isBoolean = estimateRuleCommonService.isBooleanType(value, detailsParamListDataService);
						if (isBoolean) {
							result = platformDataValidationService.createErrorObject('estimate.rule.errors.calculationRule', {object: field.toLowerCase()});
							result.entity = entity;
							result.value = value;
							result.model = field;
							result.valideSrv = service;
							result.dataSrv = detailsParamListDataService;
							isValid = true;
						}
						else {
							result = platformDataValidationService.createSuccessObject();
							isValid = false;
						}
					}

					if (parameterReference.invalidParam) {
						result.error = parameterReference.error;
						result.entity = entity;
						result.value = value;
						result.model = field;
						result.valideSrv = service;
						result.dataSrv = detailsParamListDataService;
						result.valid = false;
						isValid = true;
						entity.nonVallid = true;
					}

					if(!isValid) {
						let data = detailsParamListDataService.getList();
						let nonVallidData = _.filter(data, {'nonVallid': true});
						if (nonVallidData && nonVallidData.length) {
							isValid = true;
						}
					}
					service.onCodeChange.fire(isValid);
					platformRuntimeDataService.applyValidationResult(result, entity, field);
					return result;
				};

				service.validateDefaultValue = function validateDefaultValue(entity, value, field) {
					return platformDataValidationService.isMandatory(value, field);
				};

				service.validateParameterValue = function validateParameterValue(entity, value, field) {
					if (field === 'ParameterText') {
						let estimateMainParameterValueLookupService = $injector.get('estimateMainParameterValueLookupService');
						let paramValueList = estimateMainParameterValueLookupService.getList();
						return estimateRuleCommonService.validateParameterValue(service, entity, value, field, paramValueList);
					}
					return platformDataValidationService.isMandatory(value, field);
				};


				service.asyncValidateValueDetail = function (entity, value, model) {
					let detailsParamListDataService = $injector.get('estimateMainDetailsParamListDataService');
					let asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, model, detailsParamListDataService);

					asyncMarker.myPromise = estimateRuleCommonService.asyncParameterDetailValidation(entity, value, model, detailsParamListDataService, service).then(function(result){
						if(result.valid){
							let data = detailsParamListDataService.getList();
							let nonVallidData = _.filter(data, {'nonVallid': true});
							if (nonVallidData && nonVallidData.length) {
								service.onCodeChange.fire(true);
							}
						}
						return $q.when(result);
					});

					return asyncMarker.myPromise;
				};

				service.validateAssignedStructureId = function validateAssignedStructureId(entity, value, field) {
					entity.AssignedStructureId = value;

					let detailsParamListDataService = $injector.get('estimateMainDetailsParamListDataService');
					let data = detailsParamListDataService.getList();
					let count = 0;

					_.forEach(data, function (param) {
						let result = service.validateCode(param, param.Code, 'Code');
						if (result && !result.valid) {
							count++;
						}
					});

					if (count > 0) {
						service.onCodeChange.fire(true);
					}


					detailsParamListDataService.showSameCodeWarning(entity, entity.Code);

					platformDataValidationService.isMandatory(value, field);
				};

				service.asyncValidateCode = function asyncValidateCode(entity, value, field) {
					let detailsParamListDataService = $injector.get('estimateAssembliesDetailsParamListDataService');

					let asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, field, detailsParamListDataService);

					let estimateMainParamStructureConstant = $injector.get('estimateMainParamStructureConstant');
					let estimateMainDetailsParamDialogService = $injector.get('estimateMainDetailsParamDialogService');

					let dataServName = $injector.get('estimateMainService').getServiceName();
					let mainService = dataServName === 'estimateAssembliesResourceService' || dataServName === 'estimateAssembliesService' ?  $injector.get('estimateAssembliesService') : $injector.get('estimateMainService');
					let modificationTrackingExtension = $injector.get('platformDataServiceModificationTrackingExtension');
					let containerData = currentMainService
						? (currentMainService.getContainerData ? currentMainService.getContainerData() : {itemName: ''})
						: mainService.getContainerData();
					let updateData = modificationTrackingExtension.getModifications(mainService);
					let EstLeadingStructureContext = currentMainService ? currentMainService.getSelected() : mainService.getSelected();

					if(!EstLeadingStructureContext){
						if(mainService.getList() && mainService.getList().length>0){
							EstLeadingStructureContext =mainService.getList()[0];
						}
					}
					updateData.EstLeadingStuctureContext = updateData.EstLeadingStuctureContext ? updateData.EstLeadingStuctureContext : {};
					updateData.EstLeadingStuctureContext = estimateParamUpdateService.getLeadingStructureContext(updateData.EstLeadingStuctureContext, EstLeadingStructureContext, 'estimateMainService');

					let strId = estimateMainDetailsParamDialogService.getLeadingStructureId();
					if(strId === estimateMainParamStructureConstant.BasCostGroup){
						updateData.EstLeadingStuctureContext.Id = -1;
						let curtCostGroup = $injector.get('costGroupsStructureMainDataServiceFactory').getService().getSelected();
						updateData.EstLeadingStuctureContext.BasCostGroupFk = curtCostGroup ? curtCostGroup.Id : updateData.EstLeadingStuctureContext.BasCostGroupFk;
					}

					updateData.ParamsOfSpecialStructureId = $injector.get('estimateMainDetailsParamDialogService').getSelectedStructureId() || strId;
					updateData.ParamsOfSpecialStructureId =
						updateData.ParamsOfSpecialStructureId === estimateMainParamStructureConstant.LineItem
							? null
							: updateData.ParamsOfSpecialStructureId;
					updateData.IgnoreParentParameter = !!$injector.get('estimateMainDetailsParamDialogService').getSelectedStructureId();

					updateData.DetailFormulaField = null;
					updateData.DetailFormula = value.toUpperCase();
					updateData.MainItemName = containerData.itemName;
					updateData.ProjectId = dataServName === 'estimateAssembliesResourceService' || dataServName === 'estimateAssembliesService' ? null : mainService.getSelectedProjectId();
					updateData.IsFromDetailFormula = true;

					asyncMarker.myPromise =$http.post(globals.webApiBaseUrl + 'estimate/main/calculator/getdetailsparameters', updateData).then(function (response) {
						let res = {
							apply: true,
							valid: true,
							error: ''
						};
						if (response && response.data) {
							if(response.data.FormulaParameterEntities && response.data.FormulaParameterEntities.length>0) {
								let param = response.data.FormulaParameterEntities[0];

								let selectedStructureId = $injector.get('estimateMainDetailsParamDialogService').getSelectedStructureId();
								if(selectedStructureId){
									param.Version = param.AssignedStructureId === selectedStructureId ? param.Version : -1;
									param.AssignedStructureId = selectedStructureId;
								}

								if(!entity.IsCreateFromUserForm){
									entity.DefaultValue = param.DefaultValue;
									entity.Code = param.Code;
									entity.DescriptionInfo = param.DescriptionInfo;
									entity.EstParameterGroupFk = param.EstParameterGroupFk;
									entity.ParameterText = param.ParameterText;
									entity.ParameterValue = param.ParameterValue;
									entity.ValueType = param.ValueType;
									entity.ValueText = param.ValueText;
									entity.ValueDetail = param.ValueDetail;
									entity.IsLookup = param.IsLookup;
								}

								entity.Version = param.Version;
								entity.Id = entity.Version === -1 ? entity.originId : param.Id;

								if(entity.AssignedStructureId !== estimateMainParamStructureConstant.LineItem){
									entity.AssignedStructureId = param.AssignedStructureId === null ?entity.AssignedStructureId:param.AssignedStructureId;
								}else{
									entity.AssignedStructureId = param.AssignedStructureId === null ? estimateMainParamStructureConstant.LineItem : param.AssignedStructureId;
								}

								entity.UomFk = param.UomFk;
								entity.BoqHeaderFk = param.BoqHeaderFk;
								res = service.validateCode(entity, value, field);
							}


							estimateMainDetailsParamDialogService.setCurrentItem(response.data);
						}
						platformDataValidationService.finishAsyncValidation(res, entity, value, field, asyncMarker, service, detailsParamListDataService);

						return res;
					});

					return asyncMarker.myPromise;
				};

				let currentMainService = null;

				service.setCurrentDataService = function (service){
					currentMainService = service;
				};

				return service;
			}
		]);


	angular.module(moduleName).factory('estimateMainParamListValidationService',
		['$http', '$q', '$injector', '$translate', 'platformDataValidationService','platformRuntimeDataService','PlatformMessenger','estimateRuleParameterConstant',
			function ($http, $q, $injector, $translate, platformDataValidationService, platformRuntimeDataService, PlatformMessenger, estimateRuleParameterConstant) {

				let service = {};
				let commonCalculationSer = $injector.get('estimateMainCommonCalculationService');
				let estimateRuleCommonService = $injector.get('estimateRuleCommonService');

				angular.extend(service, {
					onCodeChange: new PlatformMessenger()
				});

				service.validateValueDetail = function validateValueDetail(entity, value, field) {

					let detailsParamListDataService = $injector.get('estimateMainLineitemParamertersService');
					let selectedItem = detailsParamListDataService.getSelected();
					let paramList = detailsParamListDataService.getList();
					if(selectedItem){
						paramList = _.filter(paramList, function (item){
							return item.level >= selectedItem.level;
						});
					}
					entity[field] = value;

					let parameterReference = {};

					entity.nonVallid = false;
					let isValid;
					let isMapCulture = true;
					let result;

					let paramReference = {isLoop: false, linkReference: ''};
					estimateRuleCommonService.checkLoopReference(entity, detailsParamListDataService, paramReference);
					if (paramReference.isLoop) {
						result = {
							apply: true,
							valid: false,
							error: $translate.instant('estimate.rule.ParamReferenceLoop', {value1: paramReference.linkReference})
						};

						isValid = entity.nonVallid = true;
						service.onCodeChange.fire(isValid);
						platformRuntimeDataService.applyValidationResult(result, entity, field);
						return result;
					}


					let valueTypes = $injector.get('estimateRuleParameterConstant');
					if (entity.ValueType !== valueTypes.Text) {
						isMapCulture = commonCalculationSer.getIsMapCulture(value);
						parameterReference = estimateRuleCommonService.checkParameterReference(entity, paramList, value);
					}

					if(!isMapCulture)
					{
						result = {
							apply: true,
							valid: false,
							error: $translate.instant('cloud.common.computationFormula')
						};
						isValid = true;
					}
					else
					{
						let isBoolean = estimateRuleCommonService.isBooleanType(value, detailsParamListDataService);
						if (isBoolean) {
							result = platformDataValidationService.createErrorObject('estimate.rule.errors.calculationRule', {object: field.toLowerCase()});
							result.entity = entity;
							result.value = value;
							result.model = field;
							result.valideSrv = service;
							result.dataSrv = detailsParamListDataService;
							isValid = true;
						}
						else {
							result = platformDataValidationService.createSuccessObject();
							isValid = false;
						}
					}

					if (parameterReference.invalidParam) {
						result.error = parameterReference.error;
						result.entity = entity;
						result.value = value;
						result.model = field;
						result.valideSrv = service;
						result.dataSrv = detailsParamListDataService;
						result.valid = false;
						isValid = true;
						entity.nonVallid = true;
					}

					if(!isValid) {
						let data = detailsParamListDataService.getList();
						let nonVallidData = _.filter(data, {'nonVallid': true});
						if (nonVallidData && nonVallidData.length) {
							isValid = true;
						}
					}
					service.onCodeChange.fire(isValid);
					platformRuntimeDataService.applyValidationResult(result, entity, field);
					return result;
				};

				service.validateDefaultValue = function validateDefaultValue(entity, value, field) {
					return platformDataValidationService.isMandatory(value, field);
				};

				service.validateParameterValue = function validateParameterValue(entity, value, field) {
					if (field === 'ParameterText') {
						let estimateMainParameterValueLookupService = $injector.get('estimateMainParameterValueLookupService');
						let paramValueList = estimateMainParameterValueLookupService.getList();
						return estimateRuleCommonService.validateParameterValue(service, entity, value, field, paramValueList);
					}
					entity.ParameterValue = value;
					entity.ValueDetail = value;
					let detailsParamListDataService = $injector.get('estimateMainLineitemParamertersService');
					estimateRuleCommonService.calculateDetails(entity, field, 'ValueDetail');
					let res = $injector.get('estimateMainCommonCalculationService').mapCultureValidation(entity, entity.ValueDetail, 'ValueDetail', service, detailsParamListDataService);
					if(res && res.valid) {
						platformRuntimeDataService.applyValidationResult(res, entity, 'ValueDetail');
						$injector.get('platformDataValidationService').finishAsyncValidation(res, entity, entity.ValueDetail, 'ValueDetail', null, service, detailsParamListDataService);
					}
					return platformDataValidationService.isMandatory(value, field);
				};


				service.asyncValidateValueDetail = function (entity, value, model) {
					let detailsParamListDataService = $injector.get('estimateMainLineitemParamertersService');
					let asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, model, detailsParamListDataService);

					asyncMarker.myPromise = estimateRuleCommonService.asyncParameterDetailValidation(entity, value, model, detailsParamListDataService, service).then(function(result){
						if(result.valid){
							let data = detailsParamListDataService.getList();
							let selectedItem = detailsParamListDataService.getSelected();
							if(selectedItem){
								data = _.filter(data, {AssignedStructureId: selectedItem.AssignedStructureId});
							}
							let nonVallidData = _.filter(data, {'nonVallid': true});
							if (nonVallidData && nonVallidData.length) {
								service.onCodeChange.fire(true);
							}

							entity.ValueDetail = value;
							if(entity.ValueType === estimateRuleParameterConstant.Text){
								entity.ParameterText = entity.ValueDetail;
							}else{

								if(!entity.CalculateDefaultValue){
									estimateRuleCommonService.calculateDetails(entity, model, 'ParameterValue', detailsParamListDataService);
								}else{
									if(detailsParamListDataService &&  _.isFunction(detailsParamListDataService.getList)) {
										estimateRuleCommonService.calculateReferenceParams(entity, detailsParamListDataService);
									}
								}
							}
						}
						return $q.when(result);
					});

					return asyncMarker.myPromise;
				};

				return service;
			}
		]);
})();
