/**
 * Created by lav on 11/14/2018.
 */
(function (angular) {
	'use strict';

	var moduleName = 'transportplanning.transport';

	angular.module(moduleName).controller('transportplanningTransportReturnResourcesDialogController', Controller);
	Controller.$inject = [
		'$scope',
		'$options',
		'$injector',
		'transportplanningTransportMainService',
		'platformModuleStateService',
		'transportplanningTransportStepsService'];

	function Controller($scope,
						$options,
						$injector,
						transportMainService,
						platformModuleStateService,
						transportplanningTransportStepsService) {

		initializeScope();

		function initializeScope() {

			$injector.get($options.service).initialize($scope, $options);
			transportplanningTransportStepsService.initialize($scope);

			_.extend($scope.modalOptions, {
				cancel: close
			});

			function close() {
				return $scope.$close(false);
			}

			$scope.$on('$destroy', function () {
				var modState = platformModuleStateService.state(transportMainService.getModule());
				if (modState.validation && modState.validation.issues) {
					modState.validation.issues.length = 0;//delete all the issues
				}
			});
		}
	}
})(angular);