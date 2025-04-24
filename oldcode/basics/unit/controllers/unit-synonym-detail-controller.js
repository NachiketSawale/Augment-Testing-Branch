(function (angular) {

	'use strict';
	var moduleName = 'basics.unit';

	/**
	 * @ngdoc controller
	 * @name unitSynonymDetailController
	 * @function
	 *
	 * @description
	 * Controller for the  synonymDetail view of unit entities.
	 **/
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('basicsUnitSynonymDetailController', BasicsUnitSynonymDetailController);

	BasicsUnitSynonymDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function BasicsUnitSynonymDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '7B3E7ACEB29D4EDC9B0F7B4F02F73581', 'basicsUnitTranslationService');
	}
})(angular);