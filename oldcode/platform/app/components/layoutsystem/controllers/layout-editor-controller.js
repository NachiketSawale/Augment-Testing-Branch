/*
 * $Id$
 * Copyright (c) RIB Software GmbH
 */

(function (angular) {
	'use strict';

	/**
	 * @ngdoc controller
	 * @name layoutEditorController
	 * @description layoutEditorController
	 */
	angular.module('platform').controller('layoutEditorController',
		['$scope', 'mainViewService', '$modalInstance', 'platformTranslateService', '$translate', 'layoutEditorService',
			function ($scope, mainViewService, $modalInstance, platformTranslateService, $translate, layoutEditorService) {

				$scope.result = {layoutName: '', config: {}};
				$scope.modalOptions = {
					closeButtonText: $translate.instant('cloud.common.cancel'),
					actionButtonText: $translate.instant('cloud.common.ok'),
					headerText: $translate.instant('cloud.common.layoutDialogHeader'),
					width: 'max',
					height: 'max',
					onReturnButtonPress: function () {
						$scope.modalOptions.ok();
					}
				};

				$scope.modalOptions.ok = function () {
					var result = {};
					result.ok = true;
					var config = layoutEditorService.getSelectedConfig();
					$modalInstance.close(result);
					mainViewService.applyConfig(config, true, true);
				};

				$scope.modalOptions.close = function () {
					var result = {};
					result.cancel = true;
					$modalInstance.close(result);
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
			}
		]);

})(angular);