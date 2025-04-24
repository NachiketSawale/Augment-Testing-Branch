/**
 * Created by janas on 09.02.2015.
 */


(function () {

	'use strict';
	var moduleName = 'controlling.structure',
		angModule = angular.module(moduleName);

	/**
	 * @ngdoc controller
	 * @name controllingStructurePertSettingsController
	 * @function
	 *
	 * @description
	 * Controller for the pert chart view of controlling units.
	 **/
	angModule.value('controllingStructurePertSettingsController',
		function ($scope, $translate, $modalInstance, pertConfig) {
			// default settings
			$scope.size = {width: pertConfig.pertNodeWidth, height: pertConfig.pertNodeHeight};

			$scope.modalOptions = {
				closeButtonText: $translate.instant('cloud.common.cancel'),
				actionButtonText: $translate.instant('cloud.common.ok'),
				headerText: $translate.instant('controlling.structure.containerTitleControllingUnitsPertSettingsTitle')
			};
			$scope.modalOptions.ok = function (result) {
				result = {size: $scope.size};
				$modalInstance.close(result);
			};
			$scope.modalOptions.close = function () {
				$modalInstance.dismiss('cancel');
			};
		})
		.value('pertConfig', {pertNodeWidth: 140, pertNodeHeight: 50});
})();
