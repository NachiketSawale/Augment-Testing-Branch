/**
 * Created by wed on 12/26/2018.
 */

(function (angular) {

	'use strict';
	var moduleName = 'businesspartner.main';

	angular.module(moduleName).factory('commonBusinessPartnerEvaluationTreeUIStandardServiceFactory', [
		'platformSchemaService',
		'platformUIStandardExtentService',
		'platformUIStandardConfigService',
		'commonBusinessPartnerEvaluationServiceCache',
		'commonBusinessPartnerEvaluationTreeLayoutFactory',
		function (platformSchemaService,
			platformUIStandardExtentService,
			platformUIStandardConfigService,
			serviceCache,
			evaluationTreeLayoutFactory) {

			function createService(serviceDescriptor, translationService, options) {

				if (serviceCache.hasService(serviceCache.serviceTypes.EVALUATION_UI_STANDARD, serviceDescriptor)) {
					return serviceCache.getService(serviceCache.serviceTypes.EVALUATION_UI_STANDARD, serviceDescriptor);
				}

				var evaluationDetailLayout = evaluationTreeLayoutFactory.createLayout(serviceDescriptor, options);
				var BaseService = platformUIStandardConfigService;

				function StructureUIStandardService(layout, dtoScheme, translationService) {
					BaseService.call(this, layout, dtoScheme, translationService);
				}

				StructureUIStandardService.prototype = Object.create(BaseService.prototype);
				StructureUIStandardService.prototype.constructor = StructureUIStandardService;

				var attributeDomains = platformSchemaService.getSchemaFromCache({
					typeName: 'EvaluationDto',
					moduleSubModule: 'BusinessPartner.Main'
				});

				attributeDomains = attributeDomains.properties;
				attributeDomains.EvalStatusFk.mandatory = false;
				attributeDomains.CompanyFk.mandatory = false;
				var uiService = new StructureUIStandardService(evaluationDetailLayout, attributeDomains, translationService);
				platformUIStandardExtentService.extend(uiService, evaluationDetailLayout.addition, attributeDomains);

				// return uiService;

				serviceCache.setService(serviceCache.serviceTypes.EVALUATION_UI_STANDARD, serviceDescriptor, uiService);

				return uiService;

			}

			return {
				createService: createService
			};
		}]);
})(angular);