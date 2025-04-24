/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	let moduleName = 'estimate.main';
	/**
	 * @ngdoc controller
	 * @name estimateMainQuantityMaintenanceDialogController
	 * @function
	 *
	 * @description
	 * estimateMainQuantityMaintenanceDialogController for Line Item Quantity Maintenance dialog.
	 **/
	angular.module(moduleName).controller('estimateMainQuantityMaintenanceDialogController',[
		'$scope', '$translate', '$modalInstance', '$injector', 'platformCreateUuid', 'estimateMainQuantityMaintenanceDialogConfigService', 'estimateMainQuantityMaintenanceDialogService', 'platformTranslateService',

		function ($scope, $translate, $modalInstance, $injector, platformCreateUuid, quantityDialogConfigService, quantityDialogService, platformTranslateService) {

			let uniqId = platformCreateUuid();

			$scope.getContainerUUID = function () {
				return uniqId;
			};

			$scope.modalOptions = {
				closeButtonText: $translate.instant('cloud.common.cancel'),
				actionButtonText: $translate.instant('cloud.common.ok'),
				headerText: 'estimate.main.quantityMaintenanceWizardDialogTitle',
				ok : function (result) {
					let item = $scope.currentItem;
					// save at server use quantityDialogService update fn.
					if(item){
						quantityDialogService.update(item);
					}
					$modalInstance.close(result);
				},
				close : function () {

					$modalInstance.dismiss('cancel');
				},
				cancel : function () {
					$modalInstance.dismiss('cancel');
				}
			};

			$scope.formContainerOptions = {
				formOptions: {
					configure: quantityDialogConfigService.getFormConfig(),
					validationMethod: function(){return true;}
				}
			};
			platformTranslateService.translateFormContainerOptions($scope.formContainerOptions);
			$scope.currentItem = quantityDialogService.getCurrentItem();

			$scope.$on('$destroy', function () {
				$scope.currentItem = {};
			});
		}
	]);
})(angular);
