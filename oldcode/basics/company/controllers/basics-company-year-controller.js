/**
 * Created by henkel on 15.09.2014.
 */
(function () {

	'use strict';
	var moduleName = 'basics.company';
	var angModule = angular.module(moduleName);

	angModule.controller('basicsCompanyYearController', BasicsCompanyYearController);

	BasicsCompanyYearController.$inject = ['$scope','platformContainerControllerService'];
	function BasicsCompanyYearController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'B13485C47DE64239B64A9D573E03ABA4');
	}
})();