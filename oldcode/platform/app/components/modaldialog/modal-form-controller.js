/**
 * Created in workshop GZ
 */
(function (angular) {

	'use strict';

	/**
	 * @ngdoc service
	 * @name platformModalFormController
	 * @function
	 *
	 * @description
	 * Controller for a modal dialogue displaying the data in a form container
	 **/
	angular.module('platform').controller('platformModalFormController', ['$scope',

		function ($scope) {
			$scope.dataItem = $scope.dialog.modalOptions.dataItem;
			let formConfig = $scope.dialog.modalOptions.formConfiguration;
			let validationService = $scope.dialog.modalOptions.validationService;

			if (validationService && formConfig.addValidationAutomatically) {
				_.forEach(formConfig.rows, function (row) {
					let rowModel = row.model.replace(/\./g, '$');

					let syncName = 'validate' + rowModel;
					let asyncName = 'asyncValidate' + rowModel;

					if (validationService[syncName]) {
						row.validator = validationService[syncName];
					}

					if (validationService[asyncName]) {
						row.asyncValidator = validationService[asyncName];
					}
				});
			}

			$scope.formOptions = {
				configure: formConfig
			};

			$scope.formContainerOptions = {
				formOptions: $scope.formOptions,
				setTools: function () {
				}
			};

			let okButton = getButtonById('ok');
			if (okButton) {
				okButton.disabled = function () {
					if ($scope.dialog.modalOptions.hasOwnProperty('disableOkButton')) {
						return _.isFunction($scope.dialog.modalOptions.disableOkButton) ? $scope.dialog.modalOptions.disableOkButton() : $scope.dialog.modalOptions.disableOkButton;
					}
					return false;
				};
				okButton.fn = function () {
					$scope.$close({ ok: true, data: $scope.dataItem });
				};
			}

			let customBtn1 = getButtonById('customBtn1');
			if(customBtn1) {
				customBtn1.fn = function () {
					$scope.$close({custom1: true, data: $scope.dataItem});
				};
			}

			let customBtn2 = getButtonById('customBtn2');
			if(customBtn2) {
				customBtn2.fn = function () {
					$scope.$close({custom2: true, data: $scope.dataItem});
				};
			}

			getButtonById('cancel').fn = function () {
				$scope.$close({});
			};

			function getButtonById(id) {
				return $scope.dialog.getButtonById(id);
			}
		}
	]);
})(angular);
