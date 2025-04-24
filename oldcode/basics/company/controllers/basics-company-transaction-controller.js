/**
 * Created by henkel on 01.02.2018.
 */
(function () {

	'use strict';
	var moduleName = 'basics.company';
	var angModule = angular.module(moduleName);

	angModule.controller('basicsCompanyTransactionController', BasicsCompanyTransactionController);

	BasicsCompanyTransactionController.$inject = ['$scope','platformContainerControllerService'];
	function BasicsCompanyTransactionController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'a47073dd69804cd2947d6a218433f6fb');
	}
})();