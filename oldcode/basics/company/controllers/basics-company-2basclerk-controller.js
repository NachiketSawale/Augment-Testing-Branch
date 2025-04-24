/**
 * Created by leo on 05.11.2015.
 */
(function () {

	'use strict';
	var moduleName = 'basics.company';

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('basicsCompany2BasClerkController', BasicsCompany2BasClerkController);

	BasicsCompany2BasClerkController.$inject = ['$scope','platformContainerControllerService'];
	function BasicsCompany2BasClerkController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '60355de3d08848ebaadf73aaeac28f92');
	}
})();