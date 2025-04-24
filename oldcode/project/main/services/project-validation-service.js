/**
 * Created by Frank Baedeker on 21.08.2014.
 */

(function (angular) {
	/* global globals */
	'use strict';

	const moduleName = 'project.main';

	/**
	 * @ngdoc service
	 * @name projectMainProjectValidationService
	 * @description provides validation methods for project entities
	 */
	angular.module(moduleName).service('projectMainProjectValidationService', ProjectMainProjectValidationService);

	ProjectMainProjectValidationService.$inject = ['_', '$q', 'moment', '$http', '$injector', '$translate', 'platformDataValidationService','projectMainService'];

	function ProjectMainProjectValidationService(_, $q, moment, $http, $injector, $translate, platformDataValidationService, projectMainService) {
		let self = this;

		this.validateProjectNo = function validateProjectNo (entity, value, model) {
			return platformDataValidationService.validateMandatory(entity, value, model, self, projectMainService);
		};

		this.validateGroupFk = function validateGroupFk(entity, value, model) {
			return platformDataValidationService.validateMandatory(entity, value, model, self, projectMainService);
		};

		this.validateProjectGroupFk = function validateProjectGroupFk(entity, value, model) {
			return platformDataValidationService.validateMandatory(entity, value, model, self, projectMainService);
		};

		this.validateRubricCategoryFk = function validateRubricCategoryFk(entity, value, model) {
			return platformDataValidationService.validateMandatory(entity, value, model, self, projectMainService);
		};

		this.asyncValidateRubricCategoryFk = function (entity, value, model) {
			if (entity.RubricCategoryFk !== value) {
				let asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, model, projectMainService);
				asyncMarker.myPromise =  $http.get(globals.webApiBaseUrl + 'project/main/defaultstatus?rubricCategory=' + value).then(function (result) {
					const statusValidationResult = {
						valid: true,
						apply: true
					};
					if(_.isNumber(result.data)) {
						entity.StatusFk = result.data;
						platformDataValidationService.validateMandatory(entity, entity.StatusFk, 'StatusFk', self, projectMainService);
						projectMainService.markItemAsModified(entity);
					}else {
						entity.StatusFk = null;
						platformDataValidationService.validateMandatory(entity, entity.StatusFk, 'StatusFk', self, projectMainService);
						statusValidationResult.valid = false;
						statusValidationResult.error = 'To the selected rubric category no default project status is assigned';
						statusValidationResult.error$tr$ = 'project.main.errRubricCategoryNoDefaultStatus';
					}

					return platformDataValidationService.finishAsyncValidation(statusValidationResult, entity, value, model, asyncMarker, self, projectMainService);
				});

				return asyncMarker.myPromise;
			}

			return $q.when(true);
		};

		this.validateCatalogConfigTypeFk = function validateCatalogConfigTypeFk(entity, value, model) {
			if(_.isNil(value) && !_.isNil(entity.CatalogConfigFk)) {
				return platformDataValidationService.finishValidation(true, entity, value, model, self, projectMainService);
			}
			return platformDataValidationService.validateMandatory(entity, value, model, self, projectMainService);
		};

		this.validateClerkFk = function validateClerkFk(entity, value, model) {
			return platformDataValidationService.validateMandatory(entity, value, model, self, projectMainService);
		};

		this.validateClosingDatetime = function validateClosingDatetime(entity, value /* , model */) {
			if(value && entity.ValidityDate)
			{
				entity.ValidityPeriod = moment(value).diff(moment(entity.ValidityDate), 'days');
			}

			return true;
		};

		this.validateValidityPeriod = function validateValidityPeriod(entity, value /* , model */) {
			if(value && entity.ClosingDatetime)
			{
				entity.ValidityDate = moment(entity.ClosingDatetime).add(value, 'days');
			}

			return true;
		};

		this.validateValidityDate = function validateValidityDate(entity, value /* , model */) {
			if(value && entity.ValidityPeriod)
			{
				entity.ClosingDatetime = moment(value).add(-entity.ValidityPeriod, 'days');
			}

			return true;
		};

		this.asyncValidateProjectNo = function asyncValidateProjectNo (entity, value, model) {
			let param = $translate.instant('project.main.projectNo');
			if(entity.Version === 0 && entity.TheCodeWillBeGenerated) {
				return $q.when(true);
			}
			return applyAsyncFieldTest({ Field2Validate: 5, NewStringValue: value, Project: entity }, value, model, 'cloud.common.uniqueValueErrorMessage', param);
		};

		this.asyncValidateBusinessPartnerFk = function asyncValidateBusinessPartnerFk (entity, value, model) {
			return applyAsyncFieldTest({ Field2Validate: 1, NewIntValue: value, Project: entity }, value, model);
		};

		this.asyncValidateContactFk = function asyncValidateContactFk (entity, value, model) {
			return applyAsyncFieldTest({ Field2Validate: 2, NewIntValue: value, Project: entity }, value, model);
		};

		this.asyncValidateCustomerFk = function asyncValidateCustomerFk (entity, value, model) {
			return applyAsyncFieldTest({ Field2Validate: 3, NewIntValue: value, Project: entity }, value, model);
		};

		this.asyncValidateAssetMasterFk = function asyncValidateAssetMasterFk(entity, value, model) {
			if(!entity.AddressFk && value) {
				return applyAsyncFieldTest({ Field2Validate: 4, NewIntValue: value, Project: entity }, value, model);
			}

			return $q.when(true);
		};

		this.validatePrjContentTypeFk = function validatePrjContentTypeFk (entity, value) {
			let rateBookService = $injector.get('estimateProjectRateBookConfigDataService');
			rateBookService.setContentTypeId(value);
			if(value) {
				rateBookService.initDataByContentType(value);
			}
			else{
				rateBookService.clearData();
			}
			rateBookService.updateProjectId();
			rateBookService.OnContenTypeChanged.fire(value);
			return true;
		};

		function applyAsyncFieldTest(validationSpec, value, model, errorCode, errorParam ) {
			let entity = validationSpec.Project;
			let asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, model, projectMainService);
			asyncMarker.myPromise =  $http.post(globals.webApiBaseUrl + 'project/main/validate', validationSpec).then(function (result) {
				if (!result.data.ValidationResult) {
					return platformDataValidationService.finishAsyncValidation({
						valid: false,
						apply: true,
						error: '...',
						error$tr$: errorCode,
						error$tr$param$: { object: errorParam.toLowerCase() || model.toLowerCase() }
					}, entity, value, model, asyncMarker, self, projectMainService);
				} else {
					if(result.data.Project && result.data.Project.Id && result.data.Project.Id >= 1){
						projectMainService.takeOver(result.data.Project);
					}

					return platformDataValidationService.finishAsyncValidation(true, entity, value, model, asyncMarker, self, projectMainService);
				}
			});

			return asyncMarker.myPromise;
		}

		this.validateStartDate = function validateStartDate(entity, value, model) {
			entity.DateEffective = value || entity.DateEffective;
			return platformDataValidationService.validatePeriod(value, entity.EndDate, entity, model, self, projectMainService, 'EndDate');
		};

		this.validateEndDate = function validateEndDate(entity, value, model) {
			return platformDataValidationService.validatePeriod(entity.StartDate, value, entity, model, self, projectMainService, 'StartDate');
		};
	}
})(angular);
