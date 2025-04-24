(function (angular) {
	'use strict';
	var moduleName = 'mtwo.chatbot';

	/**
	 * @ngdoc service
	 * @name mtwoChatbotConstantValues
	 * @function
	 *
	 * @description
	 * mtwoChatbotConstantValues provides definitions and constants frequently used in mtwo chatbot module
	 */
	angular.module(moduleName).value('mtwoChatbotConstantValues', {
		uuid: {
			container: {
				configurationList: 'A906C9A8D9BE43F39F9928EB969A2737',
				wf2intent: '0097C0C570744F338742B4E906D1F31C',
				header: '9DC0F6FEAA284933BC8747871A64C00E',
			}
		},
		schemes: {
			configuration: {typeName: 'MtoCbtConfigDto', moduleSubModule: 'Mtwo.ChatBot'},
			wf2intent: {typeName: 'MtoCbtWf2intentDto', moduleSubModule: 'Mtwo.ChatBot'},
			header: {typeName: 'MtoCbtHeaderDto', moduleSubModule: 'Mtwo.ChatBot'}
		}
	});
})(angular);