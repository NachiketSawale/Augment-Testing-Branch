/**
 * Created by wui on 9/1/2015.
 */

(function (angular) {
	'use strict';

	angular.module('basics.common').controller('basicsCommonMapSettingsDialogController', ['$scope', 'basicsCommonMapKeyService',
		function ($scope, basicsCommonMapKeyService) {
			$scope.showByDefault = basicsCommonMapKeyService.mapOptions.showByDefault;

			$scope.provider = basicsCommonMapKeyService.mapOptions.Provider;

			// by default, this setting is shown
			if (angular.isUndefined($scope.defaultSettingShown)) {
				$scope.defaultSettingShown = true;
			}

			$scope.onOk = function () {
				basicsCommonMapKeyService.updateMap($scope.provider);
				basicsCommonMapKeyService.updateMapState($scope.showByDefault);
				$scope.$close(true);
			};
		}
	]);

})(angular);