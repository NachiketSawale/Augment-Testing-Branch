/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	let moduleName = 'estimate.common';
	/**
	 * @ngdoc controller
	 * @name estimateCommonOverlayDialogController
	 * @function
	 *
	 * @description
	 * estimateCommonOverlayDialogController.
	 **/
	angular.module(moduleName).controller('estimateCommonOverlayDialogController',[
		'$scope', '$translate', '$modalInstance', '$injector', 'platformCreateUuid', 'estimateParamComplexLookupCommonService', 'estimateParameterComplexInputgroupLookupService',
		function ($scope, $translate, $modalInstance, $injector, platformCreateUuid, estParamComplexLookupService, estParamInputLookupService) {

			let uniqId = platformCreateUuid();

			$scope.getContainerUUID = function () {
				return uniqId;
			};

			$scope.modalOptions = {
				close : function () {
					close();
				}
			};
			$scope.displayTextMessage = $translate.instant('estimate.common.paramDeleteOverlayDialogInfo');
			$scope.viewDeleting = true;

			function close(){
				$scope.viewDeleting = false;
				$modalInstance.dismiss('undefined');
			}

			estParamComplexLookupService.onCloseOverlayDialog.register(close);
			estParamInputLookupService.onCloseOverlayDialog.register(close);

			$scope.$on('$destroy', function () {
				estParamComplexLookupService.onCloseOverlayDialog.unregister(close);
				estParamInputLookupService.onCloseOverlayDialog.unregister(close);
			});
		}
	]);
})(angular);
