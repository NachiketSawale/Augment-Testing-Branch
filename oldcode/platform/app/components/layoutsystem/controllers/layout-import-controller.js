/*
 * $Id$
 * Copyright (c) RIB Software GmbH
 */

(function (angular) {
	'use strict';

	function LayoutImportController($scope, $modalInstance, $translate) {
		$scope.modalOptions = {
			closeButtonText: $translate.instant('platform.cancelBtn'),
			yesButtonText: $translate.instant('platform.yesBtn'),
			noButtonText: $translate.instant('platform.noBtn'),
			headerText: $translate.instant('platform.importLayoutHeader'),
			contentText: $translate.instant('platform.overwriteExisting')
		};

		$scope.modalOptions.yes = function () {
			$modalInstance.close('yes');
		};
		$scope.modalOptions.no = function () {
			$modalInstance.close('no');
		};
		$scope.modalOptions.cancel = function () {
			$modalInstance.dismiss('cancel');
		};
	}

	LayoutImportController.$inject = ['$scope', '$modalInstance', '$translate'];

	angular.module('platform').controller('layoutImportController', LayoutImportController);
})(angular);