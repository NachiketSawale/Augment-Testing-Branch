/**
@ngdoc controller
 * @name cloudDesktopLayoutDialogController
 * @function
 *
 * @description
 * Controller for the Layout Configurator Dialog view.
 */
angular.module('cloud.desktop').controller('cloudDesktopLayoutDialogController', ['$scope', '$modalInstance', 'platformTranslateService', '$translate', function ($scope, $modalInstance, platformTranslateService, $translate) {
	'use strict';

	platformTranslateService.registerModule('cloud.desktop');

	$scope.modalOptions = {
		closeButtonText: $translate.instant('cloud.common.cancel'),
		actionButtonText: $translate.instant('cloud.common.ok'),
		headerText: $translate.instant('cloud.common.layoutDialogHeader')
	};

	$scope.modalOptions.ok = function () {
		var result = {};
		result.ok = true;
		$modalInstance.close(result);
	};

	$scope.modalOptions.close = function () {
		$modalInstance.dismiss('cancel');
	};

	// loads or updates translated strings
	var loadTranslations = function () {
		// load translation ids and convert result to object
		$scope.modalOptions.closeButtonText = $translate.instant('cloud.common.cancel');
		$scope.modalOptions.actionButtonText = $translate.instant('cloud.common.ok');
		$scope.modalOptions.headerText = $translate.instant('cloud.desktop.layoutDialogHeader');
	};

	// register translation changed event
	platformTranslateService.translationChanged.register(loadTranslations);

	// un-register on destroy
	$scope.$on('$destroy', function () {
		platformTranslateService.translationChanged.unregister(loadTranslations);
	});

	// register a module - translation table will be reloaded if module isn't available yet
	if (!platformTranslateService.registerModule('cloud.desktop')) {
		// if translation is already available, call loadTranslation directly
		loadTranslations();
	}
}]);
