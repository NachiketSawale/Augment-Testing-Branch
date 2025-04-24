(function (angular) {
	'use strict';
	/**
	 * @ngdoc service
	 * @name businesspartner.main.businesspartnerMainRealestateValidationService
	 * @function
	 * @requireds validationService
	 *
	 * @description validate the data service
	 */
	angular.module('businesspartner.main').factory('businesspartnerMainRealestateValidationService',
		['$translate', '$timeout', 'basicsLookupdataLookupDescriptorService', 'basicsCommonUtilities',
			function ($translate, $timeout, basicsLookupdataLookupDescriptorService, basicsCommonUtilities) {

				return function (dataService) {
					let service = {};

					let fields = {
						TelephoneNumber: 'TelephonePattern',
						TelephoneNumberTeleFax: 'TelefaxPattern'
					};

					function requiredValidator(value, model) {
						let result = {apply: true, valid: true};
						if (angular.isUndefined(value) || value === null || value === -1 || value === '') {
							result.valid = false;
							result.error = $translate.instant('cloud.common.emptyOrNullValueErrorMessage', {fieldName: model});
						}

						return result;
					}

					function gridRefresh() {
						$timeout(dataService.gridRefresh, 100, false);
					}

					function updatePattern(entity, value, model) {
						if (!entity) {
							return;
						}
						entity[fields[model]] = basicsCommonUtilities.generatePhonePattern(value ? value.Telephone : '');
					}

					function validateTelephone(entity, value, model) {
						updatePattern(entity, value, model);
						gridRefresh();
					}

					service.validateRealestateTypeFk = function validateRealestateTypeFk(entity, value, model) {
						return requiredValidator(value, model);
					};

					service.validatePotential = function validatePotential(entity, value, model) {
						return requiredValidator(value, model);
					};

					service.validateSubsidiaryFk = function validateSubsidiaryFk(entity, value) {
						if (entity) {
							let subsidiaries = basicsLookupdataLookupDescriptorService.getData('Subsidiary') || {};
							entity.SubsidiaryDescriptor = subsidiaries[value];
						}
						return {apply: true, valid: true};
					};

					service.validateAddress = gridRefresh;
					service.validateTelephoneNumber = validateTelephone;
					service.validateTelephoneNumberTeleFax = validateTelephone;

					return service;
				};
			}
		]);
})(angular);
