/**
 * Created by baf on 04.09.2014.
 */
(function (angular) {
	'use strict';
	var moduleName = 'model.main';

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('modelMainObject3DDetailController', ModelMainObject3DDetailController);

	ModelMainObject3DDetailController.$inject = ['$scope','platformContainerControllerService'];
	function ModelMainObject3DDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'B0F9D6D8E5CF4FF5B8EC3733BCE8013D', 'modelMainTranslationService');
	}
})(angular);