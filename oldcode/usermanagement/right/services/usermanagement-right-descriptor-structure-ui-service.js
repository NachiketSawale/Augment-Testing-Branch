/**
 * Created by sandu on 13.10.2015.
 */
(function (angular) {
	'use strict';
	angular.module('usermanagement.right').factory('usermanagementRightDescriptorStructureUIService', usermanagementRightDescriptorStructureUIService);

	usermanagementRightDescriptorStructureUIService.$inject = ['platformUIStandardConfigService', 'usermanagementRightTranslationService', 'usermanagementRightDetailLayout', 'platformSchemaService'];

	function usermanagementRightDescriptorStructureUIService(platformUIStandardConfigService, usermanagementRightTranslationService, usermanagementRightDetailLayout, platformSchemaService) {
		var BaseService = platformUIStandardConfigService;
		var domains = platformSchemaService.getSchemaFromCache({
			typeName: 'DescriptorStructureDto',
			moduleSubModule: 'UserManagement.Main'
		});

		return new BaseService(usermanagementRightDetailLayout, domains.properties, usermanagementRightTranslationService);
	}
})(angular);