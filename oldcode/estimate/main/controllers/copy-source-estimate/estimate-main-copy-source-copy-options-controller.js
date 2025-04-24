/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	let moduleName = 'estimate.main';
	/**
	 * @ngdoc controller
	 * @name estimateMainCopySourceCopyOptionsController
	 * @function
	 *
	 * @description
	 * estimateMainCopySourceCopyOptionsController for Estimate Copy option dialog during source Estimate Copy.
	 **/

	angular.module(moduleName).controller('estimateMainCopySourceCopyOptionsController',[
		'$scope', '$translate', '$modalInstance', '$injector', 'platformCreateUuid', 'estimateMainCopySourceCopyOptionsDialogConfigService','platformTranslateService','estimateMainCopySourceCopyOptionsDialogService',

		function ($scope, $translate, $modalInstance, $injector, platformCreateUuid, estimateMainCopySourceCopyOptionsDialogConfigService,platformTranslateService,estimateMainCopySourceCopyOptionsDialogService) {

			let uniqId = platformCreateUuid();

			$scope.getContainerUUID = function () {
				return uniqId;
			};

			$scope.modalOptions = {
				closeButtonText: $translate.instant('cloud.common.cancel'),
				actionButtonText: $translate.instant('cloud.common.ok'),
				headerText: $translate.instant('estimate.main.copyOptions'),
				ok : function (result) {
					let item = $scope.currentItem;
					estimateMainCopySourceCopyOptionsDialogService.saveCopyOptions(item);
					$modalInstance.close(result);
				},
				close : function () {
					$modalInstance.dismiss('cancel');
				},
				cancel:function () {
					$modalInstance.dismiss('cancel');
				}
			};

			$scope.change = function change() {
			};

			$scope.formContainerOptions = {
				formOptions: {
					configure: estimateMainCopySourceCopyOptionsDialogConfigService.getFormConfig(),
					validationMethod: function(){return true;}
				},
			};
			platformTranslateService.registerModule('cloud.desktop');

			let loadTranslations = function () {
			// load translation ids and convert result to object
				platformTranslateService.translateObject($scope.formContainerOptions, ['text','header','label']);
			};

			// register a module - translation table will be reloaded if module isn't available yet
			if (!platformTranslateService.registerModule('cloud.desktop')) {
				loadTranslations();
			}

			$scope.currentItem = estimateMainCopySourceCopyOptionsDialogService.getCurrentItem();

			$scope.$on('$destroy', function () { });
		}
	]);
})(angular);





