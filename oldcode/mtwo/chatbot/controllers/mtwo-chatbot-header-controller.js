(function () {

	'use strict';
	var moduleName = 'mtwo.chatbot';
	var angModule = angular.module(moduleName);

	/**
	 * @ngdoc controller
	 * @name mtwochatbotConfigurationController
	 * @function
	 *
	 * @description
	 * Controller for the  list view of configuration entities.
	 **/
	angModule.controller('mtwochatbotHeaderController', MtwoChatbotHeaderController);

	MtwoChatbotHeaderController.$inject = ['$scope', 'platformContainerControllerService'];

	function MtwoChatbotHeaderController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '9DC0F6FEAA284933BC8747871A64C00E');
	}
})();