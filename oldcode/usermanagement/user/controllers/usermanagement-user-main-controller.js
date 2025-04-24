/**
 * Created by sandu on 26.08.2015.
 */
(function () {
	'use strict';
	var moduleName = 'usermanagement.user';

	/**
	 * @ngdoc controller
	 * @name usermanagementUserController
	 * @function
	 *
	 * @description
	 * Main controller for the usermanagement.user module
	 **/
	angular.module(moduleName).controller('usermanagementUserController', usermanagementUserController);

	usermanagementUserController.$inject = ['$scope', 'usermanagementUserMainService', 'platformMainControllerService', 'usermanagementUserTranslationService'];

	function usermanagementUserController($scope, usermanagementUserMainService, platformMainControllerService, usermanagementUserTranslationService) {

		var opt = {search: true, reports: false, auditTrail: '61bb869533cc4d42bfd5e62e3e783ed4'};
		var ctrlProxy = {};
		var environment = platformMainControllerService.registerCompletely($scope, usermanagementUserMainService, ctrlProxy, usermanagementUserTranslationService, moduleName, opt);

		/**
		 * check main items already loaded to keep items selection
		 */
		if (_.isEmpty(usermanagementUserMainService.getList())) {
			usermanagementUserMainService.load();
		}

		$scope.$on('$destroy', function () {
			platformMainControllerService.unregisterCompletely(usermanagementUserMainService, environment, usermanagementUserTranslationService, opt);

		});

	}

})();
