/**
 * Created by joy on 28.05.2019
 */

(function (angular) {
	'use strict';
	var moduleName = 'mtwo.chatbot';

	/**
	 * @ngdoc service
	 * @name mtwoChatbotLayoutHelperService
	 * @description provides methods for easily building user interface layouts
	 */
	angular.module(moduleName).service('mtwoChatbotLayoutHelperService', MtwoChatbotLayoutHelperService);

	MtwoChatbotLayoutHelperService.$inject = ['basicsLookupdataConfigGenerator'];

	function MtwoChatbotLayoutHelperService(basicsLookupdataConfigGenerator) {
		this.provideWorkflowOverload = function provideWorkflowOverload() {
			return basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
				dataServiceName: 'workflowLookupDataService'
			});
		};
		this.provideNlpOverload = function provideNlpOverload() {
			return basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
				dataServiceName: 'nlpDataService'
			});
		};
	}
})(angular);
