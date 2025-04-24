(function (angular) {
	'use strict';

	let moduleName = 'businesspartner.contact';

	angular.module(moduleName).factory('businessPartnerContact2BpAssignmentUIStandardService', [
		'platformUIStandardConfigService', 'businesspartnerContact2BpAssignmentLayout', 'businesspartnerContactTranslationService',
		'platformSchemaService',
		function (platformUIStandardConfigService, businesspartnerContact2BpAssignmentLayout, businesspartnerContactTranslationService,
			platformSchemaService) {

			let BaseService = platformUIStandardConfigService;
			let domains = platformSchemaService.getSchemaFromCache({
				typeName: 'BusinessPartnerAssignmentDto',
				moduleSubModule: 'BusinessPartner.Contact'
			}).properties;

			function UIStandardService(layout, scheme, translateService) {
				BaseService.call(this, layout, scheme, translateService);
			}

			UIStandardService.prototype = Object.create(BaseService.prototype);
			UIStandardService.prototype.constructor = UIStandardService;
			let service = new BaseService(businesspartnerContact2BpAssignmentLayout, domains, businesspartnerContactTranslationService);

			return service;
		}
	]);
})(angular);
