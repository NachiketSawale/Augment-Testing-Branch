/**
 * Created by joy on 12.08.2021.
 */
(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name mtwoChatbotWf2intentValidationService
	 * @description provides validation methods for chatbot Wf2intent
	 */
	var moduleName = 'mtwo.chatbot';
	angular.module(moduleName).service('mtwoChatbotWf2intentValidationService', MtwoChatbotWf2intentValidationService);

	MtwoChatbotWf2intentValidationService.$inject = ['platformDataValidationService', 'mtwoChatBotWf2intentDataService'];

	function MtwoChatbotWf2intentValidationService(platformDataValidationService, mtwoChatBotWf2intentDataService) {
		var self = this;
		self.validateIntent = function (entity, value,model) {
			return platformDataValidationService.validateMandatory(entity, value, model, self, mtwoChatBotWf2intentDataService);

		};
	}

})(angular);
