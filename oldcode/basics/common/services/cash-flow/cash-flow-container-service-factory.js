/**
 * Created by wui on 11/23/2016.
 */

(function (angular) {
	'use strict';

	const moduleName = 'basics.common';

	angular.module(moduleName).factory('basicsCommonCashFlowContainerServiceFactory', [
		'platformSchemaService',
		'platformUIStandardConfigService',
		'basicsCommonCashFlowLayout',
		'basicsCommonCashFlowDataServiceFactory',
		'basicsCommonCashFlowValidationServiceFactory',
		function (
			platformSchemaService,
			UIStandardConfigService,
			basicsCommonCashFlowLayout,
			basicsCommonCashFlowDataServiceFactory,
			basicsCommonCashFlowValidationServiceFactory) {
			const containerServiceCache = {};

			return {
				get: getContainerService
			};

			function getContainerService(id, parentService, translationService) {
				if (!containerServiceCache[id]) {
					containerServiceCache[id] = createContainerService(id, parentService, translationService);
				}
				return containerServiceCache[id];
			}

			function createContainerService(id, parentService, translationService) {
				const containerService = {};

				// cash flow ui standard service
				const domains = platformSchemaService.getSchemaFromCache({
					typeName: 'CashProjectionDetailDto',
					moduleSubModule: 'Basics.Common'
				}).properties;
				containerService.ui = new UIStandardConfigService(basicsCommonCashFlowLayout, domains, translationService);

				// certificate data service
				containerService.data = basicsCommonCashFlowDataServiceFactory.get(id, parentService);

				// platformUIStandardExtentService.extend(containerService.ui, containerService.layout.addition, domains);

				// certificate validation service
				containerService.validation = basicsCommonCashFlowValidationServiceFactory.create(containerService.data);

				return containerService;
			}
		}
	]);

})(angular);