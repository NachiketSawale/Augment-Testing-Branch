/*
 * $Id$
 * Copyright (c) RIB Software GmbH
 */

((angular) => {
	'use strict';
	angular.module('cloud.desktop').controller('cloudDesktopLayoutSaveDialog');

	cloudDesktopLayoutSaveDialog.$inject = ['$scope', '$modalInstance', 'platformTranslateService', '$translate'];

	/**
	 * @ngdoc controller
	 * @name cloudDesktopLayoutSaveDialogController
	 * @function
	 *
	 * @description
	 * Controller for the Layout Configurator Dialog view.
	 */
	function cloudDesktopLayoutSaveDialog($scope, $modalInstance, platformTranslateService, $translate) {
		platformTranslateService.registerModule('cloud.desktop');

		$scope.modalOptions = {
			cancelBtnText: $translate.instant('cloud.common.cancel'),
			okBtnText: $translate.instant('cloud.common.ok'),
			headerText: $translate.instant('cloud.common.layoutDialogHeader')
		};

		$scope.modalOptions.ok = function () {
			const result = {};

			result.ok = true;
			$modalInstance.close(result);
		};

		$scope.modalOptions.close = function () {
			$modalInstance.dismiss('cancel');
		};

		// loads or updates translated strings
		const loadTranslations = function () {
			// load translation ids and convert result to object
			$scope.modalOptions.closeButtonText = $translate.instant('cloud.common.cancel');
			$scope.modalOptions.actionButtonText = $translate.instant('cloud.common.ok');
			$scope.modalOptions.headerText = $translate.instant('cloud.common.save');
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
	}
})(angular);

