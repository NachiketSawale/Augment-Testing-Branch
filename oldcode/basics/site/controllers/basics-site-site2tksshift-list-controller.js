/**
 * Created by lav on 11/28/2019.
 */
(function () {
	'use strict';
	var moduleName = 'basics.site';

	angular.module(moduleName).controller('basicsSite2TksShiftListController', Controller);

	Controller.$inject = ['$scope', 'platformContainerControllerService'];

	function Controller($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'dee5249511c14645a2C91cb84ecab0ad');
	}
})();