(function (angular) {
	'use strict';
	var moduleName = 'logistic.dispatching';

	/**
	 * @ngdoc service
	 * @name logisticDispatchingDocumentUIStandardService
	 * @function
	 *
	 * @description
	 * This service provides standard layots for different containers of dispatching document entities
	 */
	angular.module(moduleName).service('logisticDispatchingDocumentUIStandardService', LogisticDispatchingDocumentUIStandardService);

	LogisticDispatchingDocumentUIStandardService.$inject = ['platformUIConfigInitService', 'logisticDispatchingContainerInformationService', 'logisticDispatchingTranslationService'];

	function LogisticDispatchingDocumentUIStandardService(platformUIConfigInitService, logisticDispatchingContainerInformationService, logisticDispatchingTranslationService) {
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: logisticDispatchingContainerInformationService.getLogisticDispatchingDocumentLayout(),
			dtoSchemeId: {
				moduleSubModule: 'Logistic.Dispatching',
				typeName: 'DispatchDocumentDto'
			},
			translator: logisticDispatchingTranslationService
		});
	}
})(angular);
