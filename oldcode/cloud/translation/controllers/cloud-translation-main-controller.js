/**
 * Created by baf on 30.05.2016.
 */
(function () {
	'use strict';

	var moduleName = 'cloud.translation';

	/**
	 * @ngdoc controller
	 * @name basicsConfigController
	 * @function
	 *
	 * @description
	 * Main controller for the basics.config module
	 **/

	angular.module(moduleName).controller('cloudTranslationController', CloudTranslationMainController);

	CloudTranslationMainController.$inject = ['$scope', '$injector', 'cloudTranslationResourceDataService', 'platformMainControllerService', 'cloudTranslationTranslationService', 'cloudDesktopInfoService'];

	function CloudTranslationMainController($scope, $injector, cloudTranslationResourceDataService, platformMainControllerService, cloudTranslationTranslationService, cloudDesktopInfoService) {
		cloudDesktopInfoService.updateModuleInfo('cloud.desktop.moduleDisplayNameBasicsConfig');

		var opt = {search: true, reports: false, wizard: true, auditTrail: '39486cf44c304711b1c1296ad778b620'};
		var ctrlProxy = {};
		var environment = platformMainControllerService.registerCompletely($scope, cloudTranslationResourceDataService, ctrlProxy, cloudTranslationTranslationService, moduleName, opt);

		$scope.$on('$destroy', function () {
			platformMainControllerService.unregisterCompletely(cloudTranslationResourceDataService, environment, cloudTranslationTranslationService, opt);
		});

		var langServ = $injector.get('cloudTranslationLanguageDataService');
		langServ.assertLanguagesLoaded();
	}
})();
