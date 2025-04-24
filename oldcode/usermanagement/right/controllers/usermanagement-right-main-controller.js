/**
 * Created by sandu on 14.09.2015.
 */
(function (){
	'use strict';
	var moduleName = 'usermanagement.right';

	/**
     * @ngdoc controller
     * @name usermanagementRightController
     * @function
     *
     * @description
     * Main controller for the usermanagement.right module
     **/
	angular.module(moduleName).controller('usermanagementRightController',usermanagementRightController);

	usermanagementRightController.$inject = ['$scope', 'usermanagementRightMainService', 'platformMainControllerService', 'usermanagementRightTranslationService', 'cloudDesktopSidebarService'];

	function usermanagementRightController($scope, usermanagementRightMainService, platformMainControllerService, usermanagementRightTranslationService, sidebarService){

		var opt = {search: true, reports: false, auditTrail: '25dba3e0f7514d9ea0e00017bb92c70b'};
		var ctrlProxy = {};
		var environment = platformMainControllerService.registerCompletely($scope, usermanagementRightMainService,
			ctrlProxy,usermanagementRightTranslationService, moduleName, opt );

		var loadRolesList = function (){
			usermanagementRightMainService.load();
		};
		sidebarService.onAutoFilterLoaded.register(loadRolesList);

		$scope.$on('$destroy', function () {
			platformMainControllerService.unregisterCompletely(usermanagementRightMainService, environment, usermanagementRightTranslationService, opt);
			sidebarService.onAutoFilterLoaded.unregister(loadRolesList);
		});
	}
})();
