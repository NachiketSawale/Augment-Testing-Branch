/**
 * Created by lnt on 5/26/2017.
 */

(function () {
	'use strict';
	/* global _ */

	/**
	 * @ngdoc service
	 * @name estimateRuleParamValueValidationService
	 * @description provides validation methods for estimate rule
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module('estimate.rule').factory('estimateRuleParamValueValidationService',
		['$http', '$q', '$injector', '$translate', 'platformDataValidationService', 'estimateRuleParameterValueService','estimateRuleCommonService','platformRuntimeDataService','estimateRuleParameterConstant','estimateRuleParameterService',
			function ($http, $q, $injector, $translate, platformDataValidationService, estimateRuleParameterValueService,estimateRuleCommonService,platformRuntimeDataService,estimateRuleParameterConstant,estimateRuleParameterService) {

				let service = {};
				let self = this;

				self.handleDefaultItem = function (entity) {
					let entities = [];
					angular.forEach(estimateRuleParameterValueService.getList(), function (item) {
						if (item.Id !== entity.Id && item.IsDefault) {
							entities.push(item);
						}
					});
					_.forEach(entities, function (item) {
						item.IsDefault = false;
						estimateRuleParameterValueService.markItemAsModified(item);
					});
					estimateRuleParameterValueService.gridRefresh();
				};

				service.validateDescription = function validateDescription (entity, value) {
					let fieldToValidate = 'Description';
					let list = estimateRuleParameterValueService.getList();

					let ruleParam = estimateRuleParameterService.getSelected();
					if(ruleParam && ruleParam.ValueType === estimateRuleParameterConstant.TextFormula){
						let oldValue = entity.DescriptionInfo.Translated;
						let newValue = value;

						entity.DescriptionInfo.Translated = value;
						entity.DescriptionInfo.Modified = true;

						let parentParamValueText = ruleParam.ValueText;
						if(parentParamValueText && parentParamValueText.includes(oldValue)){
							if(oldValue) {
								ruleParam.ValueText = estimateRuleCommonService.replaceCharacter(parentParamValueText, oldValue, newValue);
								estimateRuleParameterService.markItemAsModified(ruleParam);
								estimateRuleParameterService.gridRefresh();
							}
						}

					}else{
						entity.DescriptionInfo.Translated = value;
						entity.DescriptionInfo.Modified = true;
					}

					let listByParamCode = _.filter(list,function(item){
						return item.ParameterCode === entity.ParameterCode;
					});

					return platformDataValidationService.validateMandatoryUniqEntity(entity, value, fieldToValidate, listByParamCode, service, estimateRuleParameterValueService);
				};

				service.validateParameterCode = function validateParameterCode(entity, value, field) {
					return platformDataValidationService.isMandatory(value, field);
				};

				service.asyncValidateParameterCode = function validateParameterCode(entity, value, field) {
					let asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, field, estimateRuleParameterValueService);
					asyncMarker.myPromise = $injector.get('estimateRuleParameterCodeLookupService').getList().then(function(response){
						let res = {};
						if (response.data) {
							let existItem = _.find(response.data, {'Code': value});
							res.valid = existItem ? true : false;
							if(!res.valid){
								res.apply = true;
								res.error$tr$ = 'estimate.rule.errors.noParameterError1';
							}
						} else {
							res.valid = false;
							res.apply = true;
							res.error$tr$ = 'estimate.rule.errors.noParameterError1';
						}

						// Call the platformDataValidationService that everything is finished. Any error is handled before an update call is allowed
						platformDataValidationService.finishAsyncValidation(res, entity, value, field, asyncMarker, service, estimateRuleParameterValueService);

						// Provide result to grid / form container.
						return res;
					});

					return asyncMarker.myPromise;
				};

				service.validateIsDefault = function (entity) {
					self.handleDefaultItem(entity);
					estimateRuleParameterValueService.markItemAsModified(entity);
					let currentItem = estimateRuleParameterValueService.getSelected();
					if (currentItem && currentItem.Id !== entity.Id) {
						estimateRuleParameterValueService.setSelected(entity);
					}
					return true;
				};

				service.validateValueDetail = function(entity, value, field){

					let commonCalculationSer = $injector.get('estimateMainCommonCalculationService');

					let ruleParam = estimateRuleParameterService.getSelected();
					if(ruleParam && ruleParam.ValueType === estimateRuleParameterConstant.TextFormula){
						let oldValue = entity.ValueDetail;
						let newValue = value;

						let description =  entity.DescriptionInfo.Translated;

						let parentParamValueText = ruleParam.ValueText;
						if(parentParamValueText && parentParamValueText.includes(description)){

							let parentParamValueDetail = ruleParam.ValueDetail;

							if(oldValue){
								ruleParam.ValueDetail = estimateRuleCommonService.replaceCharacter(parentParamValueDetail,oldValue,newValue);
								estimateRuleParameterService.markItemAsModified(ruleParam);
								estimateRuleParameterService.gridRefresh();
							}
						}
						entity.ValueText = value;

					}
					entity.Value = value;
					let oldValueDetail = entity.ValueDetail;
					entity.ValueDetail = value;

					if (ruleParam && ruleParam.ValueType === estimateRuleParameterConstant.Boolean) {
						entity.ValueDetail = '';
						entity.ValueText = '';
					} else if (ruleParam && (ruleParam.ValueType === estimateRuleParameterConstant.Text)) {
						entity.ValueText = value;
					}
					estimateRuleCommonService.calculateDetails(entity, field, 'Value', estimateRuleParameterValueService);
					entity.ValueDetail = oldValueDetail;
					return commonCalculationSer.mapCultureValidation(entity, value, field, service, estimateRuleParameterValueService);
				};

				service.asyncValidateValueDetail = function (entity, value, model) {
					return estimateRuleCommonService.asyncParameterDetailValidation(entity, value, model, estimateRuleParameterValueService, service);
				};

				service.validateValue = function(entity, value, field){

					let ruleParam = estimateRuleParameterService.getSelected();
					if(field ==='ValueText'){
						if(ruleParam && ruleParam.ValueType === estimateRuleParameterConstant.TextFormula){

							let oldValue = entity.ValueText;
							let newValue = value;

							let description =  entity.DescriptionInfo.Translated;

							let parentParamValueText = ruleParam.ValueText;
							if(parentParamValueText && parentParamValueText.includes(description)){

								let parentParamValueDetail = ruleParam.ValueDetail;
								if(oldValue) {
									ruleParam.ValueDetail = estimateRuleCommonService.replaceCharacter(parentParamValueDetail, oldValue, newValue);
									estimateRuleParameterService.markItemAsModified(ruleParam);
									estimateRuleParameterService.gridRefresh();
								}
							}

						}
					}
					entity.Value = value;
					entity.ValueDetail = value;
					estimateRuleCommonService.calculateDetails(entity, field,'ValueDetail');

					let res = $injector.get('estimateMainCommonCalculationService').mapCultureValidation(entity, entity.ValueDetail, 'ValueDetail', service, estimateRuleParameterValueService);
					if(res && res.valid) {
						platformRuntimeDataService.applyValidationResult(res, entity, 'ValueDetail');
						$injector.get('platformDataValidationService').finishAsyncValidation(res, entity, entity.ValueDetail, 'ValueDetail', null, service, estimateRuleParameterValueService);
					}

					return platformDataValidationService.createSuccessObject();
				};

				return service;
			}
		]);
})();

