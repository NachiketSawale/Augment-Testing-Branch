/**
 * Created by henkel on 01.02.2018.
 */
(function () {

	'use strict';
	var moduleName = 'basics.company';
	var angModule = angular.module(moduleName);

	angModule.controller('basicsCompanyTransheaderController', BasicsCompanyTransheaderController);

	BasicsCompanyTransheaderController.$inject = ['$scope','platformContainerControllerService'];
	function BasicsCompanyTransheaderController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '4b65cdfbf33b45e683d06779a5e05574');
	}
})();