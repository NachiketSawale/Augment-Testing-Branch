/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	/* global _ */
	'use strict';

	angular.module('estimate.project').factory('estimateProjectEstRuleParamValueValidationService',
		['$http', '$q', '$injector', 'platformDataValidationService', 'estimateRuleCommonService', 'estimateProjectEstRuleParamService', 'estimateProjectEstRuleParameterValueService','platformRuntimeDataService','estimateRuleParameterConstant',
			function ($http, $q, $injector, platformDataValidationService, estimateRuleCommonService, estimateProjectEstRuleParamService, estimateProjectEstRuleParameterValueService,platformRuntimeDataService,estimateRuleParameterConstant) {

				let service = {};

				let valueTypes = estimateRuleParameterConstant;
				service.handleDefaultItem = function (entity) {
					let entities = [];
					angular.forEach(estimateProjectEstRuleParameterValueService.getList(), function (item) {
						if (item.Id !== entity.Id && item.IsDefault) {
							entities.push(item);
						}
					});
					_.forEach(entities, function (item) {
						item.IsDefault = false;
						estimateProjectEstRuleParameterValueService.markItemAsModified(item);
					});
					estimateProjectEstRuleParameterValueService.gridRefresh();
				};

				service.validateIsDefault = function (entity) {
					service.handleDefaultItem(entity);
					estimateProjectEstRuleParameterValueService.markItemAsModified(entity);
					let currentItem = estimateProjectEstRuleParameterValueService.getSelected();
					if (currentItem && currentItem.Id !== entity.Id) {
						estimateProjectEstRuleParameterValueService.setSelected(entity);
					}
					return true;
				};

				service.validateValueDetail = function (entity, value, field) {
					let commonCalculationSer = $injector.get('estimateMainCommonCalculationService');
					let oldValueDetail = entity.ValueDetail;
					entity.ValueDetail = value;

					let prjectRuleParam = estimateProjectEstRuleParamService.getSelected();
					if(prjectRuleParam && prjectRuleParam.ValueType === estimateRuleParameterConstant.TextFormula){
						let oldValue = entity.ValueDetail;
						let newValue = value;

						let description =  entity.DescriptionInfo.Translated;

						let parentParamValueText = prjectRuleParam.ValueText;
						if(parentParamValueText && parentParamValueText.includes(description)){

							let parentParamValueDetail = prjectRuleParam.ValueDetail;

							if(oldValue) {
								prjectRuleParam.ValueDetail = estimateRuleCommonService.replaceCharacter(parentParamValueDetail, oldValue, newValue);
								estimateProjectEstRuleParamService.markItemAsModified(prjectRuleParam);
								estimateProjectEstRuleParamService.gridRefresh();
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

					estimateRuleCommonService.calculateDetails(entity, field, 'Value', estimateProjectEstRuleParameterValueService);
					entity.ValueDetail = oldValueDetail;
					return commonCalculationSer.mapCultureValidation(entity, value, field, service, estimateProjectEstRuleParameterValueService);
				};

				service.asyncValidateValueDetail = function (entity, value, model) {
					return estimateRuleCommonService.asyncParameterDetailValidation(entity, value, model, estimateProjectEstRuleParamService, service);
				};

				service.validateValue = function (entity, value, field) {

					let prjRuleParam = estimateProjectEstRuleParamService.getSelected();
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
									estimateProjectEstRuleParamService.markItemAsModified(prjRuleParam);
									estimateProjectEstRuleParamService.gridRefresh();
								}
							}
						}
					}

					entity.Value = value;
					entity.ValueDetail = value;
					estimateRuleCommonService.calculateDetails(entity, field, 'ValueDetail');
					let res = $injector.get('estimateMainCommonCalculationService').mapCultureValidation(entity, entity.ValueDetail, 'ValueDetail', service, estimateProjectEstRuleParameterValueService);
					if(res && res.valid) {
						platformRuntimeDataService.applyValidationResult(res, entity, 'ValueDetail');
						$injector.get('platformDataValidationService').finishAsyncValidation(res, entity, entity.ValueDetail, 'ValueDetail', null, service, estimateProjectEstRuleParameterValueService);
					}
					return platformDataValidationService.createSuccessObject();
				};

				service.validateSorting = function (entity, value, model) {
					return platformDataValidationService.isMandatory(value, model);
				};

				service.validateDescription = function validateDescription(entity, value) {

					let fieldToValidate = 'Description';
					let list = estimateProjectEstRuleParameterValueService.getList();

					let prjRuleParam = estimateProjectEstRuleParamService.getSelected();
					if(prjRuleParam && prjRuleParam.ValueType === estimateRuleParameterConstant.TextFormula){
						let oldValue = entity.DescriptionInfo.Translated;
						let newValue = value;

						entity.DescriptionInfo.Translated = value;
						entity.DescriptionInfo.Modified = true;

						let parentParamValueText = prjRuleParam.ValueText;
						if(parentParamValueText && parentParamValueText.includes(oldValue)){
							if(oldValue) {
								prjRuleParam.ValueText = estimateRuleCommonService.replaceCharacter(parentParamValueText, oldValue, newValue);
								estimateProjectEstRuleParamService.markItemAsModified(prjRuleParam);
								estimateProjectEstRuleParamService.gridRefresh();
							}
						}

					}else {
						entity.DescriptionInfo.Translated = value;
						entity.DescriptionInfo.Modified = true;
					}
					let listByParamCode = _.filter(list, function (item) {
						return item.ParameterCode === entity.ParameterCode;
					});
					return platformDataValidationService.validateMandatoryUniqEntity(entity, value, fieldToValidate, listByParamCode, service, estimateProjectEstRuleParameterValueService);
				};

				service.validateParameterCode = function validateParameterCode(entity, value, field) {
					let res = platformDataValidationService.isMandatory(value, field);

					return platformDataValidationService.finishValidation(res, entity, value, field, service, estimateProjectEstRuleParameterValueService);
				};

				service.asyncValidateParameterCode = function validateParameterCode(entity, value, field) {
					let asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, field, estimateProjectEstRuleParameterValueService);
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
						platformDataValidationService.finishAsyncValidation(res, entity, value, field, asyncMarker, service, estimateProjectEstRuleParameterValueService);

						// Provide result to grid / form container.
						return res;
					});

					return asyncMarker.myPromise;
				};

				return service;
			}
		]);
})();
