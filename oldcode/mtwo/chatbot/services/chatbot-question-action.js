/* globals */
(function (angular) {
	'use strict';

	var serviceName = 'mtwoChatbotQuestionAction';
	function ChatbotQuestionAction() {
		var self = this;
		self.Id = '00006D1F021542C798756F136F0F716B';
		self.Input = ['Question','Hint','IsOptional'];
		self.Output = ['Context'];
		self.Description = 'Chatbot Question';
		self.ActionType = 6;
		self.templateUrl = 'mtwo.chatbot/templates/chatbot-question-editor.html';
		self.directive = 'mtwoChatbotQuestionActionDirective';
	}

	angular.module('basics.workflow').service(serviceName,
		['_', 'basicsWorkflowUtilityService', ChatbotQuestionAction])
		.config(['basicsWorkflowModuleOptions', function (basicsWorkflowModuleOptions) {
			basicsWorkflowModuleOptions.clientActions.push(serviceName);
		}]);




})(angular);