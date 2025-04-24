/**
 * Created by anl on 10/14/2018.
 */

(function (angular) {

	'use strict';
	var moduleName = 'basics.company';
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('basicsCompanyTrsConfigDetailController', TrsConfigDetailController);

	TrsConfigDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function TrsConfigDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '6100bba551854fbcb1f2570b02a1405d', 'basicsCompanyTranslationService');
	}
})(angular);