/**
 * Created by wed on 12/19/2018.
 */

(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals,_ */

	var moduleName = 'businesspartner.main';

	angular.module(moduleName).factory('commonBusinessPartnerEvaluationValidationServiceFactory', [
		'$http',
		'$translate', 'basicsLookupdataLookupDataService',
		'platformRuntimeDataService',
		'basicsLookupdataLookupDescriptorService',
		'platformRuntimeDataService',
		'commonBusinessPartnerEvaluationServiceCache',
		function ($http,
			$translate,
			basicsLookupdataLookupDataService,
			runtimeDataService,
			basicsLookupdataLookupDescriptorService,
			platformRuntimeDataService,
			serviceCache) {

			function createService(serviceDescriptor, evaluationDataService, evaluationDetailService) {

				if (serviceCache.hasService(serviceCache.serviceTypes.EVALUATION_VALIDATION, serviceDescriptor)) {
					return serviceCache.getService(serviceCache.serviceTypes.EVALUATION_VALIDATION, serviceDescriptor);
				}

				var service = {};
				angular.extend(service, {
					validateBusinessPartnerFk: validateBusinessPartnerFk,
					validateEvaluationSchemaFk: validateEvaluationSchemaFk,
					validateCode: validateCode,
					validateProjectFk: validateProjectFk,
					validateQtnHeaderFk: validateQtnHeaderFk,
					validateConHeaderFk: validateConHeaderFk,
					validateInvHeaderFk: validateInvHeaderFk,
					validateValidTo: validateValidTo,
					validateValidFrom: validateValidFrom,
					validateChecked: validateChecked
				});

				function validateCode(entity, value, model) { // jshint ignore:line
					var validateResult = {apply: true, valid: true};
					if (!value || value === '') {
						validateResult.valid = false;
						validateResult.error = $translate.instant('cloud.common.emptyOrNullValueErrorMessage', {fieldName: model});
					} else {
						if (!entity.HasToGenerateCode && value.length > 16) {
							validateResult.valid = false;
							validateResult.error = $translate.instant('basics.common.validation.exceedMaxLength', {length: 16});
							return validateResult;
						}
						var existItems = null;
						if (!evaluationDataService.getList) {
							existItems = _.find(evaluationDataService.service.getList(), function (item) {
								return item.EvaluationSchemaFk === entity.EvaluationSchemaFk && item[model] === value && item.Id > 0;
							});
						} else {
							existItems = _.find(evaluationDataService.getList(), function (item) {
								return item.EvaluationSchemaFk === entity.EvaluationSchemaFk && item[model] === value && item.Id > 0;
							});
						}

						if (existItems) {
							validateResult.valid = false;
							validateResult.error = $translate.instant('cloud.common.uniqueValueErrorMessage', {object: model});
							platformRuntimeDataService.applyValidationResult(validateResult, entity, model);
							evaluationDetailService.evaluationValidationMessenger.fire();
							return validateResult;
						} else {
							var entityTemp = angular.copy(entity);
							entityTemp.Code = value;
							checkUniqueCode(entityTemp).then(function (isUnique) {
								if (!isUnique) {
									validateResult.valid = false;
									validateResult.error = $translate.instant('cloud.common.uniqueValueErrorMessage', {object: model});
								}

								platformRuntimeDataService.applyValidationResult(validateResult, entity, model);
								evaluationDetailService.evaluationValidationMessenger.fire();
								return validateResult;
							});
						}
					}
					evaluationDetailService.evaluationValidationMessenger.fire();
					return validateResult;
				}

				function validateEvaluationSchemaFk(entity, value, model) {
					var validateResult = {apply: true, valid: true};
					if (validationFk(value)) {
						validateResult.valid = false;
						validateResult.error = $translate.instant('cloud.common.emptyOrNullValueErrorMessage', {fieldName: model});
					} else {
						var oldEvaluationSchemaFk = entity.EvaluationSchemaFk;
						entity.Points = 0;
						entity.EvaluationSchemaFk = value;
						var result = validateCode(entity, entity.Code, 'Code');
						platformRuntimeDataService.applyValidationResult(result, entity, 'Code');
						if (oldEvaluationSchemaFk !== value) {
							basicsLookupdataLookupDataService.unregisterDataProvider('EvaluationSchema');
							basicsLookupdataLookupDataService.getItemByKey('EvaluationSchema', value).then(function (evaluationSchema) {
								if (!evaluationSchema) {
									entity.EvaluationMotiveFk = entity.OldEvaluationMotiveId || 1;
								}
								else {
									if (evaluationSchema.EvaluationMotiveFk) {
										entity.EvaluationMotiveFk = evaluationSchema.EvaluationMotiveFk;
									}
									entity.RubricCategoryId = evaluationSchema.RubricCategoryFk;
									entity.FormFk = evaluationSchema.FormFk;
									evaluationDetailService.resetCode(entity);
									result = validateCode(entity, entity.Code, 'Code');
									platformRuntimeDataService.applyValidationResult(result, entity, 'Code');
								}
							});
							evaluationDetailService.evaluationSchemaChangedMessenger.fire(null, value);
						}
					}
					evaluationDetailService.evaluationValidationMessenger.fire();
					return validateResult;
				}

				function validateBusinessPartnerFk(entity, value, model) { // jshint ignore:line
					var validateResult = {apply: true, valid: true};
					if (validationFk(value)) {
						validateResult.valid = false;
						validateResult.error = $translate.instant('cloud.common.emptyOrNullValueErrorMessage', {fieldName: model});
					}
					var businesspartners = basicsLookupdataLookupDescriptorService.getData('businesspartner');
					if (businesspartners[value]) {
						entity.SubsidiaryFk = businesspartners[value].SubsidiaryFk;
					}

					return validateResult;
				}

				function validationFk(value) {
					return (angular.isUndefined(value) || value === null || value === '' || value === -1);
				}

				function validateProjectFk(entity, value) { // jshint ignore:line
					var validateResult = {apply: true, valid: true};
					setEvaluationDescriptionWithProjectName(entity, value);
					return validateResult;
				}

				function validateQtnHeaderFk(entity, value) { // jshint ignore:line
					var validateResult = {apply: true, valid: true};
					if (value) {
						basicsLookupdataLookupDataService.getItemByKey('quote', value).then(function (quote) {
							entity.ProjectFk = quote.ProjectFk;
							setEvaluationDescriptionWithProjectName(entity, entity.ProjectFk);
							evaluationDetailService.gridRefresh();
							evaluationDataService.gridRefresh();

							// recalculate
							var groupService = serviceCache.getService(serviceCache.serviceTypes.GROUP_DATA, serviceDescriptor);
							groupService.recalculateAll('ProjectFk');
						});
					}
					entity.ConHeaderFk = null;
					entity.InvHeaderFk = null;
					return validateResult;
				}

				function validateConHeaderFk(entity, value) { // jshint ignore:line
					var validateResult = {apply: true, valid: true};
					if (value) {
						basicsLookupdataLookupDataService.getItemByKey('conheader', value).then(function (con) {
							entity.ProjectFk = con && con.ProjectFk || entity.ProjectFk;
							setEvaluationDescriptionWithProjectName(entity, entity.ProjectFk);
							entity.QtnHeaderFk = null;
							evaluationDetailService.gridRefresh();
							evaluationDataService.gridRefresh();

							// recalculate
							var groupService = serviceCache.getService(serviceCache.serviceTypes.GROUP_DATA, serviceDescriptor);
							groupService.recalculateAll('ProjectFk');

							if (!con.CodeQuotation) {
								return;
							}
							basicsLookupdataLookupDataService.getSearchList('quote', 'Code="' + (con && con.CodeQuotation) + '"').then(function (quotes) {
								entity.QtnHeaderFk = quotes && quotes.items && quotes.items[0] && quotes.items[0].Id;
								evaluationDetailService.gridRefresh();
								evaluationDataService.gridRefresh();
								// recalculate
								groupService.recalculateAll('QtnHeaderFk');
							});
						});
					}
					entity.InvHeaderFk = null;
					return validateResult;
				}

				function validateInvHeaderFk(entity, value) { // jshint ignore:line
					var validateResult = {apply: true, valid: true};
					if (value) {
						basicsLookupdataLookupDataService.getItemByKey('InvHeaderChained', value).then(function (inv) {
							entity.ProjectFk = inv.ProjectFk;
							setEvaluationDescriptionWithProjectName(entity, entity.ProjectFk);
							evaluationDetailService.gridRefresh();
							evaluationDataService.gridRefresh();
							// recalculate
							var groupService = serviceCache.getService(serviceCache.serviceTypes.GROUP_DATA, serviceDescriptor);
							groupService.recalculateAll('ProjectFk');

							basicsLookupdataLookupDataService.getItemByKey('conheader', inv.ConHeaderFk).then(function (con) {
								if (!con) {
									return;
								}
								entity.ConHeaderFk = con.Id;
								entity.QtnHeaderFk = null;
								evaluationDetailService.gridRefresh();
								evaluationDataService.gridRefresh();

								// recalculate
								groupService.recalculateAll('ConHeaderFk');

								if (!con.CodeQuotation) {
									return;
								}
								basicsLookupdataLookupDataService.getSearchList('quote', 'Code="' + (con && con.CodeQuotation) + '"').then(function (quotes) {
									entity.QtnHeaderFk = quotes && quotes.items && quotes.items[0] && quotes.items[0].Id;
									evaluationDetailService.gridRefresh();
									evaluationDataService.gridRefresh();

									// recalculate
									groupService.recalculateAll('QtnHeaderFk');
								});
							});
						});
					}
					return validateResult;
				}

				function validateValidTo(entity, value) {

					var result = {apply: true, valid: true};

					var fromDate = entity.ValidFrom;
					if (value && fromDate && value < fromDate) {

						var fieldName1 = $translate.instant('businesspartner.main.entityValidTo');
						var fieldName2 = $translate.instant('businesspartner.main.entityValidFrom');
						result.valid = false;
						result.error = $translate.instant('cloud.common.endDateError', {field1: fieldName1, field2: fieldName2});
					}

					if (result.valid) {
						platformRuntimeDataService.applyValidationResult(result, entity, 'ValidFrom');
					}
					return result;
				}

				function validateValidFrom(entity, value) {

					var result = {apply: true, valid: true};

					var toDate = entity.ValidTo;
					if (value && toDate && toDate < value) {

						var fieldName1 = $translate.instant('businesspartner.main.entityValidFrom');
						var fieldName2 = $translate.instant('businesspartner.main.entityValidTo');
						result.valid = false;
						result.error = $translate.instant('cloud.common.startDateError', {field1: fieldName1, field2: fieldName2});
					}

					if (result.valid) {
						platformRuntimeDataService.applyValidationResult(result, entity, 'ValidTo');
					}
					return result;
				}

				function setEvaluationDescriptionWithProjectName(entity, projectFk) {
					if (!entity.Description && angular.isNumber(projectFk)) {
						basicsLookupdataLookupDataService.getItemByKey('project', projectFk).then(function (project) {
							if (project) {
								entity.EvaluationSchemaDescription = entity.Description = project.ProjectName;
								evaluationDetailService.gridRefresh();
								evaluationDataService.gridRefresh();
							}
						});
					}
				}

				function checkUniqueCode(checkParam) {
					return $http.post(globals.webApiBaseUrl + 'businesspartner/main/evaluation/checkcodeunique', checkParam).then(function (response) {
						return response.data;
					});
				}

				serviceCache.setService(serviceCache.serviceTypes.EVALUATION_VALIDATION, serviceDescriptor, service);

				return service;

				function validateChecked(entity) {
					entity.isCheckedChanged = true; // mark field Checked as changed
					return true;
				}
			}

			return {
				createService: createService
			};
		}
	]);
})(angular);