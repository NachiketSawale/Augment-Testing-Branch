/**
 * Created by sandu on 30.03.2015.
 */
(function () {

	'use strict';

	var moduleName = 'basics.config';

	/**
	 * @ngdoc controller
	 * @name basicsConfigController
	 * @function
	 *
	 * @description
	 * Main controller for the basics.config module
	 **/

	angular.module(moduleName).controller('basicsConfigController', basicsConfigController);

	basicsConfigController.$inject = ['$scope', 'basicsConfigMainService', 'platformMainControllerService', 'basicsConfigTranslationService', 'cloudDesktopInfoService'];

	function basicsConfigController($scope, basicsConfigMainService, platformMainControllerService, basicsConfigTranslationService, cloudDesktopInfoService) {


		cloudDesktopInfoService.updateModuleInfo('cloud.desktop.moduleDisplayNameBasicsConfig');

		var opt = {search: true, reports: false};
		var ctrlProxy = {};
		var environment = platformMainControllerService.registerCompletely($scope, basicsConfigMainService, ctrlProxy, basicsConfigTranslationService, moduleName, opt);

		/**
		 * check main items already loaded to keep items selection
		 */
		if (_.isEmpty(basicsConfigMainService.getList())) {
			basicsConfigMainService.load();
		}


		$scope.$on('$destroy', function () {
			platformMainControllerService.unregisterCompletely(basicsConfigMainService, environment, basicsConfigTranslationService, opt);
		});

	}
})();