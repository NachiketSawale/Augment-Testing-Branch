((angular) => {

	'use strict';

	/**
	 * @ngdoc service
	 * @name platformInputDialogController
	 * @function
	 *
	 * @description
	 * Controller for the input dialog
	 **/
	angular.module('platform').controller('platformInputDialogController', ['$scope', 'platformTranslateService', 'platformDialogDefaultButtonIds', 'platformDataValidationService',
		function ($scope, platformTranslateService, defaultButtonIds, platformDataValidationService) {
			const modalOptions = $scope.dialog.modalOptions;
			const dialog = $scope.dialog;
			let isValid = true;
			let errorText;

			dialog.onInputChange = function () {

				validateInput(this);

				if (_.isFunction(modalOptions.onInputChange)) {
					let info = dialog.getStandardInfo(modalOptions);
					_.set(info, 'value.valid', isValid);
					modalOptions.onInputChange.apply(this, [info]);
				}
			};

			function validateInput(that) {
				function evaluateError(validationResult, defaultText) {
					let error = {isValid: true, errorText: undefined};

					error.isValid = _.get(validationResult, 'valid', !!validationResult);

					if (error.isValid) {
						return error;
					}

					let translation = _.get(validationResult, 'error$tr$', defaultText);
					let params = _.get(validationResult, 'error$tr$param$');
					error.errorText = platformTranslateService.instant(translation, params, true);

					return error;
				}

				let result;

				// outer validation
				if (_.isFunction(modalOptions.onValidateInput)) {
					let info = dialog.getStandardInfo(modalOptions);
					const validationResult = modalOptions.onValidateInput.apply(that, [_.get(modalOptions, 'value.text'), info]);

					result = evaluateError(validationResult, 'platform.dialogs.inputDialog.invalidInput');
				}

				// inner validation (framework)
				if (result && result.isValid && !angular.isUndefined(modalOptions.pattern)) {
					let regex = new RegExp(modalOptions.pattern);
					if (!regex.test(modalOptions.value.text)) {
						const validationResult = platformDataValidationService.createErrorObject('platform.dialogs.inputDialog.invalidCharacters');
						result = evaluateError(validationResult);
					}
				}
				if (result) {
					isValid = result.isValid;
					errorText = result.errorText;
				}
			}

			dialog.rt$hasError = () => {
				return !isValid;
			};
			dialog.rt$errorText = () => {
				return errorText;
			};

			const okButton = $scope.dialog.getButtonById(defaultButtonIds.ok);
			okButton.disabled = (info) => {
				let options = info.modalOptions;

				if (dialog.rt$hasError()) {
					return true;
				}

				// any pattern set?
				if (!angular.isUndefined(options.pattern)) {
					// if no text is entered
					if (options.value && !angular.isUndefined(options.value.text)) {
						return options.value.text === '';
					}

					return true;
				}

				return false;
			};
		}
	]);
})(angular);
