/**
 * Created by henkel
 */
(function () {

	'use strict';
	var moduleName = 'basics.company';
	var angModule = angular.module(moduleName);

	angModule.controller('basicsCompanyDeferaltypeController', BasicsCompanyDeferaltypeController);

	BasicsCompanyDeferaltypeController.$inject = ['$scope','platformContainerControllerService'];
	function BasicsCompanyDeferaltypeController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'd2e263bf9a1240f3bcf041c4fcad67dc');
	}
})();