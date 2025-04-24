(function () {

	'use strict';
	var moduleName = 'mtwo.chatbot';
	var angModule = angular.module(moduleName);

	/**
	 * @ngdoc controller
	 * @name mtwochatbotWf2intentController
	 * @function
	 *
	 * @description
	 * Controller for the  list view of configuration entities.
	 **/
	angModule.controller('mtwochatbotWf2intentController', MtwochatbotWf2intentController);

	MtwochatbotWf2intentController.$inject = ['$scope', 'platformContainerControllerService', 'platformGridControllerService', 'mtwoChatBotWf2intentDataService'];
	function MtwochatbotWf2intentController($scope, platformContainerControllerService, platformGridControllerService, mtwoChatBotWf2intentDataService) {
		platformContainerControllerService.initController($scope, moduleName, '0097C0C570744F338742B4E906D1F31C');
		var toolbarItems = [
			{
				id: 't6',
				caption: 'Generate',
				type: 'item',
				iconClass: 'tlb-icons ico-generate-fields',
				fn: function () {
					generateFields();
				}
			}
		];
		platformGridControllerService.addTools(toolbarItems);

		function generateFields() {
			mtwoChatBotWf2intentDataService.generateFields().then(
				function (items) {
					mtwoChatBotWf2intentDataService.setList(items);
					mtwoChatBotWf2intentDataService.load();
				}
			);
		}
	}
})();