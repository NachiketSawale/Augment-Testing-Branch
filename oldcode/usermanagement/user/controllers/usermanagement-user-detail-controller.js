/**
 * Created by sandu on 28.09.2015.
 */
(function (angular) {

	'use strict';

	/**
	 * @ngdoc controller
	 * @name usermanagementUserDetailController
	 * @function
	 *
	 * @description
	 * Controller for the  detail view of reportgroup entities.
	 **/
	angular.module('usermanagement.user').controller('usermanagementUserDetailController', usermanagementUserDetailController);

	usermanagementUserDetailController.$inject = ['$scope', '$timeout', 'usermanagementUserMainService', 'platformDetailControllerService', 'usermanagementUserUIService', 'usermanagementUserTranslationService', 'usermanagementUserValidationService'];

	function usermanagementUserDetailController($scope, $timeout, usermanagementUserMainService, platformDetailControllerService, usermanagementUserUIService, usermanagementUserTranslationService, usermanagementUserValidationService) { // jshint ignore:line

		platformDetailControllerService.initDetailController($scope, usermanagementUserMainService, usermanagementUserValidationService, usermanagementUserUIService, usermanagementUserTranslationService);

		$scope.formContainerOptions.deleteBtnConfig.disabled = function () {
			if ($scope.currentItem === null) {
				return true;
			}
			return $scope.currentItem.IsProtected;
		};

		var updateTools = function () {
			var containerScope = $scope.$parent;

			while (containerScope && !containerScope.hasOwnProperty('setTools')) {
				containerScope = containerScope.$parent;
			}
			if (containerScope && containerScope.tools) {
				$timeout(containerScope.tools.refresh, 0, true);
			}
		};

		usermanagementUserMainService.registerSelectionChanged(updateTools);

		$scope.$on('$destroy', function () {
			usermanagementUserMainService.unregisterSelectionChanged(updateTools);
		});
	}
})(angular);
