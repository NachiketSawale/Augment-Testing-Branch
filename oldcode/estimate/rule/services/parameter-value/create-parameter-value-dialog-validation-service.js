/**
 * Created by lnt on 5/10/2019.
 */

(function () {
	'use strict';
	/* global _ */

	/**
	 * @ngdoc service
	 * @name ruleCreateParamValueDialogValidationService
	 * @description provides validation methods for estimate rule
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module('estimate.rule').factory('ruleCreateParamValueDialogValidationService',
		['$http', '$q', '$injector', '$translate', 'platformDataValidationService', 'estimateRuleCreateParameterValueDialogService','estimateRuleCommonService','platformRuntimeDataService','estimateRuleParameterConstant',
			function ($http, $q, $injector, $translate, platformDataValidationService, estimateRuleCreateParameterValueDialogService,estimateRuleCommonService,platformRuntimeDataService,estimateRuleParameterConstant) {

				let service = {};


				service.validateDescription = function validateDescription (entity, value) {
					let dataService = estimateRuleCreateParameterValueDialogService.dataService;

					let fieldToValidate = 'Description';
					let list = dataService.getList();

					entity.DescriptionInfo.Description = value;
					entity.DescriptionInfo.Translated = value;
					entity.DescriptionInfo.Modified = true;

					let listByParamCode = _.filter(list, function (item) {
						return item.ParameterCode === entity.ParameterCode;
					});

					let result = platformDataValidationService.validateMandatoryUniqEntity(entity, value, fieldToValidate, listByParamCode, service, dataService);
					return result;
				};

				service.validateValueDetail = function(entity, value, field){
					let dataService = estimateRuleCreateParameterValueDialogService.dataService;

					let commonCalculationSer = $injector.get('estimateMainCommonCalculationService');
					if(entity.ValueType === estimateRuleParameterConstant.TextFormula){
						entity.ValueText = value;
					}

					entity.Value = value;
					let oldValueDetail = entity.ValueDetail;
					entity.ValueDetail = value;

					if (entity.ValueType === estimateRuleParameterConstant.Boolean) {
						entity.ValueDetail = '';
						entity.ValueText = '';
					} else if (entity.ValueType === estimateRuleParameterConstant.Text) {
						entity.ValueText = value;
					}
					estimateRuleCommonService.calculateDetails(entity, field, 'Value', dataService);
					entity.ValueDetail = oldValueDetail;
					return commonCalculationSer.mapCultureValidation(entity, value, field, service, dataService);
				};

				service.asyncValidateValueDetail = function (entity, value, model) {
					let dataService = estimateRuleCreateParameterValueDialogService.dataService;
					return estimateRuleCommonService.asyncParameterDetailValidation(entity, value, model, dataService, service);
				};

				service.validateValue = function(entity, value, field){
					let dataService = estimateRuleCreateParameterValueDialogService.dataService;

					entity.Value = value;
					entity.ValueDetail = value;
					estimateRuleCommonService.calculateDetails(entity, field,'ValueDetail');
					let res = $injector.get('estimateMainCommonCalculationService').mapCultureValidation(entity, value, entity.ValueDetail, service, dataService);
					if(res && res.valid) {
						platformRuntimeDataService.applyValidationResult(res, entity, 'ValueDetail');
						$injector.get('platformDataValidationService').finishAsyncValidation(res, entity, entity.ValueDetail, 'ValueDetail', null, service, dataService);
					}

					return platformDataValidationService.createSuccessObject();
				};

				return service;
			}
		]);
})();
