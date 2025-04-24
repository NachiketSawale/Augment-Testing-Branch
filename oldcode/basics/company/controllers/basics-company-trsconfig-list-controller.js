/**
 * Created by anl on 10/12/2018.
 */

(function () {

	'use strict';
	var moduleName = 'basics.company';
	var angModule = angular.module(moduleName);

	/* jshint -W072 */ // many parameters because of dependency injection
	angModule.controller('basicsCompanyTrsConfigController', BasicsCompanyTrsConfigController);

	BasicsCompanyTrsConfigController.$inject = ['$scope','platformContainerControllerService'];
	function BasicsCompanyTrsConfigController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'a855590680c442409dff5ee324e97071');
	}
})();