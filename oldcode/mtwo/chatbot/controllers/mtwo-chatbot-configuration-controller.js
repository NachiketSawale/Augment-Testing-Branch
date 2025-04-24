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
	angModule.controller('mtwochatbotConfigurationController', MtwoChatbotConfigurationController);

	MtwoChatbotConfigurationController.$inject = ['$scope', 'platformContainerControllerService'];

	function MtwoChatbotConfigurationController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'A906C9A8D9BE43F39F9928EB969A2737');
	}
})();