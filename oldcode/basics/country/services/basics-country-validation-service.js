(function (angular) {
	/* global globals */
	'use strict';

	var moduleName = 'basics.country';
	/**
	 * @ngdoc service
	 * @name BasicsCountryValidationService
	 * @description provides validation methods for entities
	 */
	angular.module(moduleName).service('basicsCountryValidationService', BasicsCountryValidationService);

	BasicsCountryValidationService.$inject = ['_', '$http', 'platformDataValidationService', 'basicsCountryMainService', 'platformRuntimeDataService', '$translate', '$q'];

	function BasicsCountryValidationService(_, $http, platformDataValidationService, basicsCountryMainService, platformRuntimeDataService, $translate, $q) {
		var self = this;

		self.validateIsDefault = function validateIsDefault(entity, value) {
			if(value) {
				_.filter(basicsCountryMainService.getList(), 'IsDefault', true)
					.forEach(function(item) {
						item.IsDefault = false;
					});
				basicsCountryMainService.markItemAsModified(entity);
				basicsCountryMainService.gridRefresh();
			}
			return { apply: value, valid: true };
		};


		self.asyncValidateRegexVatno = function asyncValidateRegexVatno(entity, modelValue, field) {
			var asyncMarker = platformDataValidationService.registerAsyncCall(entity, field, modelValue, basicsCountryMainService);
			return $http.get(globals.webApiBaseUrl + 'basics/country/validateCheckRegex?checkRegex=' + modelValue
			).then(function (response) {
				entity.VatNoValidExample = null;
				self.asyncValidateVatNoValidExample(entity, null, 'VatNoValidExample');
				return platformDataValidationService.finishAsyncValidation({
					apply: true,
					valid: response.data,
					error$tr$: 'basics.company.validation.noValidRegEx'
				}, entity,
				modelValue, field, asyncMarker, this, basicsCountryMainService);
			},
			function () {
				entity.VatNoValidExample = null;
				self.asyncValidateVatNoValidExample(entity, null, 'VatNoValidExample');
				return platformDataValidationService.finishAsyncValidation({
					apply: false,
					valid: false,
					error$tr$: 'basics.company.validation.noValidRegEx'
				}, entity,
				modelValue, field, asyncMarker, this, basicsCountryMainService);
			}
			);
		};

		self.validateRegexTaxno = function validateRegexTaxno(entity) {
			entity.TaxNoValidExample = null;
			self.asyncValidateTaxNoValidExample(entity, null, 'TaxNoValidExample');
			return { apply: true, valid: true };
		};

		self.asyncValidateVatNoValidExample = function asyncValidateVatNoValidExample(entity, value, field) {
			var defer = $q.defer();
			var asyncMarker = platformDataValidationService.registerAsyncCall(entity, field, value, basicsCountryMainService);
			asyncMarker.myPromise = defer.promise;
			if (!value || !entity.RegexVatno) {
				platformRuntimeDataService.applyValidationResult(true, entity, field);
				platformDataValidationService.finishAsyncValidation(true, entity, value, field, asyncMarker, this, basicsCountryMainService);
				defer.resolve(true); 
			}
			else {
				$http.get(globals.webApiBaseUrl + 'basics/country/validatevalidexample?pattern=' + entity.RegexVatno + '&source=' + value)
					.then(function (response) {
						var result = platformDataValidationService.finishAsyncValidation({
							apply: true,
							valid: response.data,
							error: $translate.instant('basics.country.validation.invalidExample', {example: $translate.instant('basics.country.entityVatNoValidExample'), regex: $translate.instant('basics.country.entityRegexVatno')})
						}, entity,
						value, field, asyncMarker, this, basicsCountryMainService);
						defer.resolve(result);
					}, function () {
						var result = platformDataValidationService.finishAsyncValidation({
							apply: true,
							valid: false,
							error: $translate.instant('basics.country.validation.invalidExample', {example: $translate.instant('basics.country.entityVatNoValidExample'), regex: $translate.instant('basics.country.entityRegexVatno')})
						}, entity,
						value, field, asyncMarker, this, basicsCountryMainService);
						defer.resolve(result);
					});
			}
			
			return defer.promise;
		};
		
		self.asyncValidateTaxNoValidExample = function asyncValidateTaxNoValidExample(entity, value, field) {
			var defer = $q.defer();
			var asyncMarker = platformDataValidationService.registerAsyncCall(entity, field, value, basicsCountryMainService);
			asyncMarker.myPromise = defer.promise;
			if (!value || !entity.RegexTaxno) {
				platformRuntimeDataService.applyValidationResult(true, entity, field);
				platformDataValidationService.finishAsyncValidation(true, entity, value, field, asyncMarker, this, basicsCountryMainService);
				defer.resolve(true); 
			}
			else {
				defer.promise = $http.get(globals.webApiBaseUrl + 'basics/country/validatevalidexample?pattern=' + entity.RegexTaxno + '&source=' + value)
					.then(function (response) {
						var result = platformDataValidationService.finishAsyncValidation({
							apply: true,
							valid: response.data,
							error: $translate.instant('basics.country.validation.invalidExample', {example: $translate.instant('basics.country.entityTaxNoValidExample'), regex: $translate.instant('basics.country.entityRegexTaxno')})
						}, entity,
						value, field, asyncMarker, this, basicsCountryMainService);
						defer.resolve(result);
					}, function () {
						var result = platformDataValidationService.finishAsyncValidation({
							apply: true,
							valid: false,
							error: $translate.instant('basics.country.validation.invalidExample', {example: $translate.instant('basics.country.entityTaxNoValidExample'), regex: $translate.instant('basics.country.entityRegexTaxno')})
						}, entity,
						value, field, asyncMarker, this, basicsCountryMainService);
						defer.resolve(result);
					});
			}
			
			return defer.promise;
		};
	}

})(angular);