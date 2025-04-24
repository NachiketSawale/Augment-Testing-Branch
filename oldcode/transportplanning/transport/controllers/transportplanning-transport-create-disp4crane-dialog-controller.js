/**
 * Created by zov on 19/11/2018.
 */
(function () {
	'use strict';
	/*global angular*/

	var moduleName = 'transportplanning.transport';
	angular.module(moduleName).controller('trsTransportCreateDisp4CraneDialogController', controller);
	controller.$inject = ['$scope', 'params', 'trsTransportCreateDisp4CraneDialogService'];
	function controller($scope, params, dialogService) {
		dialogService.init($scope, params.dispParam, params.selectedResReq, params.wizParam, params.selectedRoute);
		$scope.title = params.title;
		$scope.dispatchCfgFormOptions = dialogService.getDispCfgFormOptions($scope);
		$scope.craneRsvFormContainerOptions = {
			formOptions: dialogService.getCraneRsvFormOptions()
		};
		$scope.isOKDisabled = function () {
			return !dialogService.isExecutable($scope);
		};
		$scope.handleOK = function (config) {
			dialogService.endEdit($scope).then(function (hasError) {
				if(!hasError){
					dialogService.execute(config, $scope).then(function (result) {
						$scope.$close(result);
					});
				}
			});
		};
		$scope.$on('$destroy', function () {
			dialogService.destroy();
		});
	}
})(angular);