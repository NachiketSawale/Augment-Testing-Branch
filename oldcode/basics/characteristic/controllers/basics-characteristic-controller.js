/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	const moduleName = 'basics.characteristic';

	angular.module(moduleName).controller('basicsCharacteristicController',
		basicsCharacteristicController);

	basicsCharacteristicController.$inject = ['$scope', 'platformMainControllerService', 'basicsCharacteristicMainService', 'basicsCharacteristicTranslationService', 'cloudDesktopInfoService'];

	function basicsCharacteristicController($scope, platformMainControllerService, mainDataService, translateService) {

		const opt = {search: false, auditTrail: '4c6ba1dbb5314915a1830db4be97cb2c'}; // requirement from fre (#70696)
		const ctrlProxy = {};
		mainDataService.dataRefresh();
		const environment = platformMainControllerService.registerCompletely($scope, mainDataService, ctrlProxy, translateService, moduleName, opt);

		$scope.$on('$destroy', function () {
			platformMainControllerService.unregisterCompletely(mainDataService, environment, translateService, opt);
		});
	}
})(angular);
