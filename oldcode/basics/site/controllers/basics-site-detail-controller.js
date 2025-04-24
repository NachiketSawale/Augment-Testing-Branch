(function (angular) {

	'use strict';
	var moduleName = 'basics.site';
	/**
     * @ngdoc controller
     * @name basicsSiteDetailController
     * @function
     *
     * @description
     * Controller for the  detail view of site entities.
     **/

	angular.module(moduleName).controller('basicsSiteDetailController', BasicsSiteDetailController);

	BasicsSiteDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function BasicsSiteDetailController($scope, platformContainerControllerService)
	{
		platformContainerControllerService.initController($scope, moduleName, 'a34485a41a6d4de6810f5198ac3e2459',
			'basicsSiteTranslationService');
	}
})(angular);