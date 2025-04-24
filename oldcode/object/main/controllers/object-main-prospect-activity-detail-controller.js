(function (angular) {
	'use strict';
	var moduleName = 'object.main';
	/**
	 * @ngdoc controller
	 * @name objectMainProspectActivityDetailController
	 * @function
	 *
	 * @description
	 * Controller for the  detail view of ProspectActivity entities.
	 **/
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('objectMainProspectActivityDetailController', ObjectMainProspectActivityDetailController);

	ObjectMainProspectActivityDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function ObjectMainProspectActivityDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '3c4e746e02154eca9f1e8f8fc832d702', 'objectMainTranslationService');
	}

})(angular);