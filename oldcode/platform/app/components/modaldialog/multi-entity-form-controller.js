(function (angular) {

	'use strict';
	angular.module('platform').controller('multiEntityFormController', ['$scope', 'platformModalFormConfigService', 'platformFormConfigService', '$translate', 'platformTranslateService', 'platformDataValidationService', '_',

		function ($scope, platformModalFormConfigService, platformFormConfigService, $translate, platformTranslateService, platformDataValidationService, _) {
			/*
				the directive dir-pagination-controls in template calls this controller once again.
				then is the common dialog-service not available. Thats why I added a getter/setter
				for the dialog-config.
			 */
			if($scope.dialog) {
				platformModalFormConfigService.setDialogConfig($scope.dialog);
			}
			else {
				$scope.dialog = platformModalFormConfigService.getDialogConfig();
			}

			$scope.items = $scope.dialog.modalOptions.items;

			platformTranslateService.registerModule('basics.common', true).then(function () {
				$scope.info = {message: $translate.instant($scope.dialog.modalOptions.message)};
			});

			$scope.showOkButton = $scope.dialog.modalOptions.showOkButton;
			$scope.showCancelButton = $scope.dialog.modalOptions.showCancelButton;

			$scope.customBtn1 = getButtonById('customBtn1');
			$scope.onCustomBtn = function () {
				$scope.$close({custom1: true, data: $scope.dataItem});
			};

			$scope.customBtn2 = getButtonById('customBtn2');
			$scope.onCustom2Btn = function () {
				$scope.$close({custom2: true, data: $scope.dataItem});
			};

			$scope.onOK = function () {
				$scope.$close({ok: true, data: $scope.dataItem});
			};

			$scope.onCancel = function () {
				$scope.$close({});
			};

			function getButtonById(id) {
				return $scope.dialog.getButtonById(id);
			}

			$scope.hasErrors = function checkForErrors() {
				let service = $scope.dialog.modalOptions.rootService;
				return platformDataValidationService.hasErrors(service);
			};

			$scope.checkItemByPageNumber = function checkItemByPageNumber(number) {
				let valid = true;
				let entity = $scope.items[number - 1].entity;
				let keys = _.keys(entity.__rt$data.errors);
				// not valid when there are still error objects
				_.each(keys, function (key) {
					if (_.isObject(entity.__rt$data.errors[key]) && !_.isEmpty(entity.__rt$data.errors[key])) {
						valid = false;
						return;
					}
				});
				return valid;
			};
		}
	]);
})(angular);
