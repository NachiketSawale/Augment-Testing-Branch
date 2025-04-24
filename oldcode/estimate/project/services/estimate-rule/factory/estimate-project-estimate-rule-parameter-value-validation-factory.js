/**
 * $Id: $
 * Copyright (c) RIB Software SE
 */

(function () {
	/* global _ */
	'use strict';
	/**
	 * @ngdoc Factory
	 * @name
	 * * estimateProjectEstRuleParamValueValidationFactory
	 * @function
	 *
	 * @description
	 * Controller factory for the list view of any kind of entity causing a change in the Estimate rules parameter
	 **/
	angular.module('estimate.project').factory('estimateProjectEstRuleParamValueValidationFactory',
		['$http', '$q', '$injector', 'platformDataValidationService', 'platformRuntimeDataService',
			function ($http, $q, $injector, platformDataValidationService, platformRuntimeDataService) {

				let factoryService = {};

				factoryService.createRuleParamValueValidationService = function createNewEstAssembliesResourceService(options) {

					let dataService = options.dataService,
						parentService = options.parentService,
						estimateRuleCommonService = $injector.get('estimateRuleCommonService'),
						estimateRuleParameterConstant = $injector.get('estimateRuleParameterConstant');

					let service = {};

					let valueTypes = estimateRuleParameterConstant;

					service.handleDefaultItem = function (entity) {
						let entities = [];
						angular.forEach(dataService .getList(), function (item) {
							if (item.Id !== entity.Id && item.IsDefault) {
								entities.push(item);
							}
						});
						_.forEach(entities, function (item) {
							item.IsDefault = false;
							dataService .markItemAsModified(item);
						});
						dataService.gridRefresh();
					};

					service.validateIsDefault = function (entity) {
						service.handleDefaultItem(entity);
						dataService.markItemAsModified(entity);
						let currentItem = dataService.getSelected();
						if (currentItem && currentItem.Id !== entity.Id) {
							dataService.setSelected(entity);
						}
						return true;
					};

					service.validateValueDetail = function (entity, value, field) {
						let commonCalculationSer = $injector.get('estimateMainCommonCalculationService');
						let oldValueDetail = entity.ValueDetail;
						entity.ValueDetail = value;

						let prjectRuleParam = parentService.getSelected();
						if(prjectRuleParam && prjectRuleParam.ValueType === estimateRuleParameterConstant.TextFormula){
							let oldValue = entity.ValueDetail;
							let newValue = value;

							let description =  entity.DescriptionInfo.Translated;

							let parentParamValueText = prjectRuleParam.ValueText;
							if(parentParamValueText && parentParamValueText.includes(description)){

								let parentParamValueDetail = prjectRuleParam.ValueDetail;

								if(oldValue) {
									prjectRuleParam.ValueDetail = estimateRuleCommonService.replaceCharacter(parentParamValueDetail, oldValue, newValue);
									parentService.markItemAsModified(prjectRuleParam);
									parentService.gridRefresh();
								}
							}
							entity.ValueText = value;
						}

						entity.ValueDetail = value;

						if(prjectRuleParam && prjectRuleParam.ValueType === valueTypes.Boolean){
							entity.ValueText = '';
						}else if(prjectRuleParam && (prjectRuleParam.ValueType === valueTypes.Text || prjectRuleParam.ValueType === valueTypes.TextFormula)){
							entity.ValueText = value;
						}

						estimateRuleCommonService.calculateDetails(entity, field, 'Value', dataService);
						entity.ValueDetail = oldValueDetail;
						return commonCalculationSer.mapCultureValidation(entity, value, field, service, dataService);
					};

					service.asyncValidateValueDetail = function (entity, value, model) {
						return estimateRuleCommonService.asyncParameterDetailValidation(entity, value, model, parentService, service);
					};

					service.validateValue = function (entity, value, field) {

						let prjRuleParam = parentService.getSelected();
						if(field ==='ValueText'){
							if(prjRuleParam && prjRuleParam.ValueType === estimateRuleParameterConstant.TextFormula){

								let oldValue = entity.ValueText;
								let newValue = value;

								let description =  entity.DescriptionInfo.Translated;

								let parentParamValueText = prjRuleParam.ValueText;
								if(parentParamValueText && parentParamValueText.includes(description)){

									let parentParamValueDetail = prjRuleParam.ValueDetail;

									if(oldValue) {
										prjRuleParam.ValueDetail = estimateRuleCommonService.replaceCharacter(parentParamValueDetail, oldValue, newValue);
										parentService.markItemAsModified(prjRuleParam);
										parentService.gridRefresh();
									}
								}
							}
						}

						entity.Value = value;
						entity.ValueDetail = value;
						estimateRuleCommonService.calculateDetails(entity, field, 'ValueDetail');
						let res = $injector.get('estimateMainCommonCalculationService').mapCultureValidation(entity, value, entity.ValueDetail, service, dataService);
						if(res && res.valid) {
							platformRuntimeDataService.applyValidationResult(res, entity, 'ValueDetail');
							$injector.get('platformDataValidationService').finishAsyncValidation(res, entity, entity.ValueDetail, 'ValueDetail', null, service, dataService);
						}
						return platformDataValidationService.createSuccessObject();
					};

					service.validateSorting = function (entity, value, model) {
						return platformDataValidationService.isMandatory(value, model);
					};

					service.validateDescription = function validateDescription(entity, value) {

						let fieldToValidate = 'Description';
						let list = dataService.getList();

						let prjRuleParam = parentService.getSelected();
						if(prjRuleParam && prjRuleParam.ValueType === estimateRuleParameterConstant.TextFormula){
							let oldValue = entity.DescriptionInfo.Translated;
							let newValue = value;

							entity.DescriptionInfo.Translated = value;
							entity.DescriptionInfo.Modified = true;

							let parentParamValueText = prjRuleParam.ValueText;
							if(parentParamValueText && parentParamValueText.includes(oldValue)){
								if(oldValue) {
									prjRuleParam.ValueText = estimateRuleCommonService.replaceCharacter(parentParamValueText, oldValue, newValue);
									parentService.markItemAsModified(prjRuleParam);
									parentService.gridRefresh();
								}
							}

						}else {
							entity.DescriptionInfo.Translated = value;
							entity.DescriptionInfo.Modified = true;
						}
						let listByParamCode = _.filter(list, function (item) {
							return item.ParameterCode === entity.ParameterCode;
						});
						return platformDataValidationService.validateMandatoryUniqEntity(entity, value, fieldToValidate, listByParamCode, service, dataService);
					};

					service.validateParameterCode = function validateParameterCode(entity, value, field) {
						let res = platformDataValidationService.isMandatory(value, field);

						return platformDataValidationService.finishValidation(res, entity, value, field, service, dataService);
					};

					service.asyncValidateParameterCode = function validateParameterCode(entity, value, field) {
						let asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, field, dataService);
						asyncMarker.myPromise = $injector.get('estimateRuleParameterCodeLookupService').getListByPrj().then(function(response){
							let res = {};
							if (response.data) {
								let existItem = _.find(response.data, {'Code': value});
								res.valid = !!existItem;
								if(!res.valid){
									res.apply = true;
									res.error$tr$ = 'estimate.rule.errors.noParameterError2';
								}
							} else {
								res.valid = false;
								res.apply = true;
								res.error$tr$ = 'estimate.rule.errors.noParameterError2';
							}

							// Call the platformDataValidationService that everything is finished. Any error is handled before an update call is allowed
							platformDataValidationService.finishAsyncValidation(res, entity, value, field, asyncMarker, service, dataService);

							// Provide result to grid / form container.
							return res;
						});

						return asyncMarker.myPromise;
					};

					return service;
				};

				return factoryService;
			}
		]);
})();
