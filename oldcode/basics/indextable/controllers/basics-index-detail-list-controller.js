/**
 * Created by xia on 5/8/2019.
 */
(function () {

	'use strict';
	let moduleName = 'basics.indextable';


	angular.module(moduleName).controller('basicsIndexDetailListController', BasicsIndexDetailListController);

	BasicsIndexDetailListController.$inject = ['$scope','platformContainerControllerService'];
	function BasicsIndexDetailListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'E6A6F3D969CE4265955EF17465F662FE');
	}
})();

