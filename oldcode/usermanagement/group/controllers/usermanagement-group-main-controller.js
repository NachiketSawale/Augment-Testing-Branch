/**
 * Created by sandu on 25.08.2015.
 */
(function (){
	'use strict';
	var moduleName = 'usermanagement.group';

	/**
     * @ngdoc controller
     * @name usermanagementGroupController
     * @function
     *
     * @description
     * Main controller for the usermanagement.group module
     **/
	angular.module(moduleName).controller('usermanagementGroupController',usermanagementGroupController);

	usermanagementGroupController.$inject = ['$scope', 'usermanagementGroupMainService', 'platformMainControllerService', 'usermanagementGroupFinalTranslationService'];

	function usermanagementGroupController($scope, usermanagementGroupMainService, platformMainControllerService, usermanagementGroupFinalTranslationService){

		var opt = {search: true, reports: false, auditTrail: 'cf38e2193fcf440a94c621898ea752cc'};
		var ctrlProxy = {};
		var environment = platformMainControllerService.registerCompletely($scope, usermanagementGroupMainService, ctrlProxy,usermanagementGroupFinalTranslationService, moduleName, opt );

	    /**
	     * check main items already loaded to keep items selection
	     */
	    if (_.isEmpty(usermanagementGroupMainService.getList())) {
		    usermanagementGroupMainService.load();
	    }

		$scope.$on('$destroy', function () {
			platformMainControllerService.unregisterCompletely(usermanagementGroupMainService, environment, usermanagementGroupFinalTranslationService, opt);

		});
	}
})();