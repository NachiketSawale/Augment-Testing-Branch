(function () {

	/*global angular*/
	'use strict';
	var moduleName = 'basics.company';


	angular.module(moduleName).controller('basicsCompanyControllingGroupListController', BasicsCompanyControllingGroupListController);

	BasicsCompanyControllingGroupListController.$inject = ['$scope','platformContainerControllerService'];
	function BasicsCompanyControllingGroupListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '05639a870ca24107b71b7b7501851c93');
	}
})();