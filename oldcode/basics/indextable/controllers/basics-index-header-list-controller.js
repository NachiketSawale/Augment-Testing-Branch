/**
 * Created by xia on 5/8/2019.
 */
(function () {

	'use strict';
	let moduleName = 'basics.indextable';


	angular.module(moduleName).controller('basicsIndexHeaderListController', BasicsIndexHeaderListController);

	BasicsIndexHeaderListController.$inject = ['$scope','platformContainerControllerService'];
	function BasicsIndexHeaderListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'B20D865CA3594FA98AD281468419BAEB');
	}
})();
