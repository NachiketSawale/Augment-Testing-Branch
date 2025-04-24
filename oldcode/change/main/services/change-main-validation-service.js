/**
 * Created by Frank Baedeker on 14.01.2015.
 */

(function (angular) {
	/* global globals */
	'use strict';

	const moduleName = 'change.main';

	/**
	 * @ngdoc service
	 * @name changeMainValidationService
	 * @description provides validation methods for change entities
	 */
	angular.module(moduleName).service('changeMainValidationService', ChangeMainValidationService);

	ChangeMainValidationService.$inject = ['_', 'platformValidationServiceFactory', 'changeMainConstantValues', 'changeMainService', 'platformDataValidationService',
		'$http', 'basicsCompanyNumberGenerationInfoService', 'platformRuntimeDataService', '$q'];

	function ChangeMainValidationService(_, platformValidationServiceFactory, changeMainConstantValues, changeMainService, platformDataValidationService,
		$http, basicsCompanyNumberGenerationInfoService, platformRuntimeDataService, $q) {
		let self = this;

		platformValidationServiceFactory.addValidationServiceInterface(changeMainConstantValues.schemes.change, {
			mandatory: platformValidationServiceFactory.determineMandatoryProperties(changeMainConstantValues.schemes.change)
		}, self, changeMainService);

		function doAsyncValidateCode(entity, value, model) {
			let defer = $q.defer();
			let id = entity.ProjectFk || 0;
			$http.get(globals.webApiBaseUrl + 'change/main/iscodeunique' + '?projectId=' + id + '&&' + model + '=' + value).then(function (result) {
				if (!result.data) {
					defer.resolve(platformDataValidationService.createErrorObject('cloud.common.uniqueValueErrorMessage', {object: model.toLowerCase()}));
				} else {
					defer.resolve(true);
				}
			});

			return defer.promise;
		}

		function doAsyncValidateElectronicDataExchangeNrGermanGaeb(entity, value, model) {
			let defer = $q.defer();
			let id = entity.ProjectFk || 0;
			$http.get(globals.webApiBaseUrl + 'change/main/isedxgaebunique' + '?projectId=' + id + '&&' + 'edxgaeb=' + value).then(function (result) {
				if (!result.data) {
					defer.resolve(platformDataValidationService.createErrorObject('cloud.common.uniqueValueErrorMessage', {object: model.toLowerCase()}));
				} else {
					defer.resolve(true);
				}
			});

			return defer.promise;
		}

		self.asyncValidateCode = function asyncValidateCode(entity, value, model) {
			let asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, model, changeMainService);

			asyncMarker.myPromise = doAsyncValidateCode(entity, value, model).then(function (response) {
				return platformDataValidationService.finishAsyncValidation(response, entity, value, model, asyncMarker, self, changeMainService);
			});

			return asyncMarker.myPromise;
		};

		self.asyncValidateChangeTypeFk = function (entity, value, model) {
			if(entity.Version === 0)
			{
				let asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, model, changeMainService);
				asyncMarker.myPromise = $http.post(globals.webApiBaseUrl + 'basics/customize/changetype/instance', {Id: value}).then(
					function (response) {
						const type = response.data;
						return $http.get(globals.webApiBaseUrl + 'change/main/defaultbytype?changeTypeFk=' + value + '&rubricCategoryFk=' + type.RubricCategoryFk).then(
							function (result) {
								if (result && result.data && result.data.RubricCategoryFk && entity.RubricCategoryFk !== result.data.RubricCategoryFk) {
									entity.RubricCategoryFk = result.data.RubricCategoryFk;
									entity.ChangeStatusFk = null;
									entity.ChangeReasonFk = null;
									if(result.data.ChangeStatusFk > 0) {
										entity.ChangeStatusFk = result.data.ChangeStatusFk;
									}
									if(result.data.ChangeReasonFk > 0) {
										entity.ChangeReasonFk = result.data.ChangeReasonFk;
									}
									let infoService = basicsCompanyNumberGenerationInfoService.getNumberGenerationInfoService('changeMainNumberInfoService');
									if (infoService.hasToGenerateForRubricCategory(entity.RubricCategoryFk)) {
										platformRuntimeDataService.readonly(entity, [{field: 'Code', readonly: true}]);
										entity.Code = infoService.provideNumberDefaultText(entity.RubricCategoryFk, entity.Code);
									} else {
										entity.Code = '';
										platformRuntimeDataService.readonly(entity, [{field: 'Code', readonly: false}]);
									}
									platformRuntimeDataService.applyValidationResult(self.validateChangeStatusFk(entity, entity.ChangeStatusFk, 'ChangeStatusFk'), entity, 'ChangeStatusFk');
									platformRuntimeDataService.applyValidationResult(self.validateChangeReasonFk(entity, entity.ChangeReasonFk, 'ChangeReasonFk'), entity, 'ChangeReasonFk');
								}

								return platformDataValidationService.finishAsyncValidation(true, entity, value, model, asyncMarker, self, changeMainService);
							});
					});
				return asyncMarker.myPromise;
			}

			return $q.when(true);
		};

		self.validateElectronicDataExchangeNrGermanGaeb = function validateElectronicDataExchangeNrGermanGaeb(entity, value, model) {
			return platformDataValidationService.validateIsNullOrInRange(entity, value, model, 1, 999, self, changeMainService);
		};

		self.asyncValidateElectronicDataExchangeNrGermanGaeb = function asyncValidateElectronicDataExchangeNrGermanGaeb(entity, value, model) {
			if (_.isNil(value)) {
				return $q.when(true);
			}

			let asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, model, changeMainService);

			asyncMarker.myPromise = doAsyncValidateElectronicDataExchangeNrGermanGaeb(entity, value, model).then(function (response) {
				return platformDataValidationService.finishAsyncValidation(response, entity, value, model, asyncMarker, self, changeMainService);
			});

			return asyncMarker.myPromise;
		};
	}
})(angular);
