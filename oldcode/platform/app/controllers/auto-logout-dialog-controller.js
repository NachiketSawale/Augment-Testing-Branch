/**
 * Created by aljami on 21.09.2022.
 */

(function (angular) {
	'use strict';

	/**
	 * @ngdoc controller
	 * @name platformAutoLogoutDialogController
	 * @description platformAutoLogoutDialogController
	 */
	angular.module('platform').controller('platformAutoLogoutDialogController',
		['$scope', '$translate', '_', '$timeout', 'platformActivityMonitorService',
			function ($scope, $translate, _, $timeout, platformActivityMonitorService) {
				$scope.infoText = $translate.instant('platform.dialogs.autoLogout.infoText');
				$scope.remainingTimeText = $translate.instant('platform.dialogs.autoLogout.remainingTimeText');
				let timeRemaining = $scope.dialog.modalOptions.value.dialogDurationSeconds;
				let timer = undefined;

				timerTick();

				function timerTick() {
					timeRemaining -= 1;
					if(timeRemaining > 0){
						timer = $timeout(() => { timerTick(); }, 1000);
					}else{
						platformActivityMonitorService.forceLogout();
					}
				}

				$scope.getRemainingTime = function () {
					return _.template($scope.remainingTimeText)({timeRemaining: timeRemaining});
				};

				$scope.$on('$destroy', function () {
					if(timer){
						$timeout.cancel(timer);
					}
				});
			}
		]);

})(angular);