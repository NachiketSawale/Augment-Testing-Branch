/**
 * Created by zos on 5/15/2015.
 */

(function (angular) {
	'use strict';

	var moduleName = 'businesspartner.certificate';

	angular.module(moduleName).factory('businesspartnerCertificateReminderValidationService', ['validationService', 'businesspartnerCertificateReminderDataService',
		'$translate',
		function (validationService, reminderDataService, $translate) {

			reminderDataService.requiredValidationEvent.register(handleRequiredValidation);

			return {
				// validateCertificateStatusFk: validateCertificateStatusFk,
				validateBatchDate: createRequiredValidator('BatchDate'),
				validateCertificateStatusFk: createRequiredValidator('CertificateStatusFk'),
				validateBatchId: createRequiredValidator('BatchId'),
				validateTelefax: validateTelefax
			};

			// noinspection JSUnusedLocalSymbols
			function handleRequiredValidation(e, entity) {
				var fields = ['BatchId', 'BatchDate', 'CertificateStatusFk'];
				fields.forEach(function (field) {
					var requiredValidator = createRequiredValidator(field);
					var result = requiredValidator(entity, entity[field]);
					if (!result.valid) {
						handleValidation(result, entity, field);
					}
				});
			}

			function createRequiredValidator(field) {
				return function (entity, value) {
					var result = {
						apply: true,
						valid: !(value === '' || value === null || value === -1 || value === 0)
					};
					if (!result.valid) {
						result.error = $translate.instant('cloud.common.emptyOrNullValueErrorMessage', {fieldName: field});
					}
					return result;
				};
			}

			// noinspection JSUnusedLocalSymbols
			function validateTelefax(entity, value) {
				var rx = new RegExp('^(\\++)(?=[1-9]+)[0-9|\\s]*$', 'g');
				var rx2 = new RegExp('^(0{2})(?=[1-9]+)[0-9|\\s]*$', 'g');
				if (!rx.test(value) && !rx2.test(value)) {
					return {
						apply: true,
						valid: false,
						error: $translate.instant('businesspartner.certificate.error.faxFormatterError')
					};
				}

				return {apply: true, valid: true};
			}

			function handleValidation(result, item, model) {
				if (result.valid) {
					if (item.__rt$data && item.__rt$data.errors) {
						delete item.__rt$data.errors[model];
					}
				} else {
					if (!item.__rt$data) {
						item.__rt$data = {errors: {}};
					} else if (!item.__rt$data.errors) {
						item.__rt$data.errors = {};
					}
					item.__rt$data.errors[model] = result;
				}
			}

		}
	]);

})(angular);