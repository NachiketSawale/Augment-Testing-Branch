/**
 * Created by jes on 12/21/2016.
 */

(function (angular) {
	'use strict';
	let moduleName = 'constructionsystem.main';

	angular.module(moduleName).controller('constructionSystemMainApplyLineItemToEstimateWizardController', constructionSystemMainApplyLineItemToEstimateWizardController);

	constructionSystemMainApplyLineItemToEstimateWizardController.$inject = [
		'_',
		'$translate',
		'$scope'
	];

	function constructionSystemMainApplyLineItemToEstimateWizardController(
		_,
		$translate,
		$scope
	) {
		let options = {
			text: {
				update: $translate.instant('constructionsystem.main.updateAll'),
				updateQuantity: $translate.instant('constructionsystem.main.updateQuantityAndObjectAssignmentOnly'),
				updatePrice: $translate.instant('constructionsystem.main.updatePriceOnly'),
				keepResourcePackageAssignment: $translate.instant('constructionsystem.main.keepAssignmentInEst'),
				doNotUpdateResIfCosResIsNull: $translate.instant('constructionsystem.main.keepEstResIfCosResIsNull'),
				overwriteAll: $translate.instant('constructionsystem.main.overwriteAll'),
				bodyText: $translate.instant('constructionsystem.main.applyNote'),
				bodyTextWhenUpdate: $translate.instant('constructionsystem.main.applyUpdateNote'),
				note: $translate.instant('constructionsystem.main.note'),
				noteText1: $translate.instant('constructionsystem.main.noteText1'),
				noteText2: $translate.instant('constructionsystem.main.noteText2')
			},
			isDisableKeepResPkgAssignment: function () {
				let disable = false;
				if ($scope.modalOptions.model.updateQuantity === true || $scope.modalOptions.model.updatePrice === true) {
					$scope.modalOptions.model.keepResourcePackageAssignment = true;
					disable = true;
				}
				if ($scope.modalOptions.model.overwrite === 'true') {
					disable = true;
				}
				return disable;
			},
			isDisableDoNotUpdateResIfCosResIsNull: function () {
				let disable = false;
				if ($scope.modalOptions.model.updateQuantity === true || $scope.modalOptions.model.updatePrice === true) {
					$scope.modalOptions.model.doNotUpdateResIfCosResIsNull = true;
					disable = true;
				}
				if ($scope.modalOptions.model.overwrite === 'true') {
					disable = true;
				}
				return disable;
			},
			isDisable: function () {
				let disable = false;
				if ($scope.modalOptions.model.overwrite === 'true') {
					disable = true;
				}
				return disable;
			},
			updateQuantityOnly: function (){
				$scope.modalOptions.model.isUpdate = 'false';
				$scope.modalOptions.model.overwrite = 'false';
				$scope.modalOptions.model.keepResourcePackageAssignment = true;
				$scope.modalOptions.model.doNotUpdateResIfCosResIsNull = true;
			},
			updatePriceOnly: function (){
				$scope.modalOptions.model.isUpdate = 'false';
				$scope.modalOptions.model.overwrite = 'false';
				$scope.modalOptions.model.keepResourcePackageAssignment = true;
				$scope.modalOptions.model.doNotUpdateResIfCosResIsNull = true;
			}
		};
		if (!$scope.modalOptions.defaultValue) {
			$scope.modalOptions.defaultValue = {
				overwrite: 'false',
				isUpdate: 'true',
				updateQuantity: true,
				updatePrice: true,
				keepResourcePackageAssignment: true,
				doNotUpdateResIfCosResIsNull: true
			};
		}
		if (!$scope.modalOptions.model) {
			$scope.modalOptions.model = _.clone($scope.modalOptions.defaultValue);
		}
		_.extend($scope.modalOptions, options);
		_.extend($scope.modalOptions.model, $scope.modalOptions.defaultValue);  // Reset to default

		$scope.isUpdate = function () {
			$scope.modalOptions.model.overwrite = 'false';
			$scope.modalOptions.model.isupdate = 'true';
			$scope.modalOptions.model.updateQuantity = false;
			$scope.modalOptions.model.updatePrice = false;
		};

		$scope.isOverwrite = function () {
			$scope.modalOptions.model.overwrite = 'true';
			$scope.modalOptions.model.isupdate = 'false';
			$scope.modalOptions.model.updateQuantity = false;
			$scope.modalOptions.model.updatePrice = false;
		};
	}

})(angular);