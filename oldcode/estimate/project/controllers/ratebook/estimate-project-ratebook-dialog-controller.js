/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {

	'use strict';
	let moduleName = 'estimate.project';

	/**
	 * @ngdoc controller
	 * @name estimateProjectRateBookDialogController
	 * @function
	 *
	 * @description
	 * Controller for the  list view of the project ratebook entities
	 **/
	angular.module(moduleName).controller('estimateProjectRateBookDialogController', estimateProjectRateBookDialogController);

	estimateProjectRateBookDialogController.$inject = ['$scope', '$translate', '$modalInstance', 'platformCreateUuid', 'estimateProjectRateBookDataService', 'estimateProjectRateBookDialogUIConfigService', 'estimateProjectRateBookConfigDataService'];
	function estimateProjectRateBookDialogController($scope, $translate, $modalInstance, platformCreateUuid, estimateProjectRateBookDataService, estimateProjectRateBookDialogUIConfigService, estimateProjectRateBookConfigDataService) {

		let uniqId = platformCreateUuid();
		$scope.getContainerUUID = function () {
			return uniqId;
		};

		$scope.currentItem =
		{
			ProjectContentTypeFk: estimateProjectRateBookConfigDataService.getCustomizeContentTypeId(),
			contentDesc: estimateProjectRateBookConfigDataService.getCustomizeContentDes()
		};

		$scope.change = function change(item, model) {
			if (model === 'ProjectContentTypeFk' && item.ProjectContentTypeFk){
				estimateProjectRateBookConfigDataService.setContentTypeId(item.ProjectContentTypeFk);
				estimateProjectRateBookConfigDataService.getContentByTypeId(item.ProjectContentTypeFk).then(function (result) {
					$scope.currentItem.contentDesc = result.data && result.data.DescriptionInfo ? result.data.DescriptionInfo.Description : '';
					estimateProjectRateBookConfigDataService.OnContenTypeChanged.fire(item.ProjectContentTypeFk);
				});
			}
		};

		$scope.modalOptions = {
			closeButtonText: $translate.instant('cloud.common.cancel'),
			actionButtonText: $translate.instant('cloud.common.ok'),
			headerText: $translate.instant('estimate.main.masterDataFilterConfig.header'),

			ok : function () {
				estimateProjectRateBookConfigDataService.setCustomizeContentDes($scope.currentItem.contentDesc);
				estimateProjectRateBookConfigDataService.SetIfClosedInCustomize(true);
				$modalInstance.close({isOK: true});
			},

			close : function () {
				estimateProjectRateBookConfigDataService.SetIfClosedInCustomize(true);
				$modalInstance.dismiss('cancel');
			},

			cancel : function () {
				estimateProjectRateBookConfigDataService.SetIfClosedInCustomize(true);
				$modalInstance.dismiss('cancel');
			}
		};

		$scope.formContainerOptions = {
			formOptions: {
				configure: estimateProjectRateBookDialogUIConfigService.getFormConfig(),
				validationMethod: function(){return true;}
			}
		};

		$scope.$on('$destroy', function () {
			estimateProjectRateBookDataService.clearData();
		});
	}
})(angular);
