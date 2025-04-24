/**
 * Created by leo on 20.09.2016.
 */
(function (angular) {
	'use strict';
	var moduleName = 'model.main';

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('modelMainEstLineItem2ObjectDetailController', ModelMainLineItem2ObjectDetailController);

	ModelMainLineItem2ObjectDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function ModelMainLineItem2ObjectDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'ba1de7e62142473a862e1d8991b43593', 'modelMainTranslationService');
	}
})(angular);