/**
 * Created by sandu on 14.09.2015.
 */
(function () {

	'use strict';

	var moduleName = 'usermanagement.right';

	/**
     * @ngdoc service
     * @name usermanagementRightUIService
     * @function
     *
     * @description
     * This service provides standard layouts for different containers of the module
     */
	angular.module(moduleName).factory('usermanagementRoleUIService', usermanagementRoleUIService);

	usermanagementRoleUIService.$inject = ['platformUIStandardConfigService', 'usermanagementRightTranslationService', 'usermanagementRoleDetailLayout', 'platformSchemaService'];

	function usermanagementRoleUIService(platformUIStandardConfigService, usermanagementRightTranslationService, usermanagementRoleDetailLayout, platformSchemaService) {
		const BaseService = platformUIStandardConfigService;
		const domainSchema = platformSchemaService.getSchemaFromCache({
			typeName: 'AccessRoleDto',
			moduleSubModule: 'UserManagement.Main'
		});

		function UsermanagementRoleUIStandardService(layout, scheme, translateService) {
			BaseService.call(this, layout, scheme, translateService);
		}

		UsermanagementRoleUIStandardService.prototype = Object.create(BaseService.prototype);
		UsermanagementRoleUIStandardService.prototype.constructor = UsermanagementRoleUIStandardService;

		return new BaseService(usermanagementRoleDetailLayout, domainSchema.properties, usermanagementRightTranslationService);
	}

	angular.module(moduleName).factory('usermanagementRoleXRoleUIService', usermanagementRoleXRoleUIService);

	usermanagementRoleXRoleUIService.$inject = ['platformUIStandardConfigService', 'usermanagementRightTranslationService', 'usermanagementRoleXRoleDetailLayout', 'platformSchemaService', 'platformObjectHelper', 'platformUIStandardExtentService'];

	function usermanagementRoleXRoleUIService(platformUIStandardConfigService, usermanagementRightTranslationService, usermanagementRoleXRoleDetailLayout, platformSchemaService, platformObjectHelper, platformUIStandardExtentService) {

		var BaseService = platformUIStandardConfigService;

		var domainSchema = platformSchemaService.getSchemaFromCache({
			typeName: 'AccessRole2RoleDto',
			moduleSubModule: 'UserManagement.Main'
		});

		function UsermanagementRoleXRoleUIStandardService(layout, scheme, translateService) {
			BaseService.call(this, layout, scheme, translateService);
		}

		UsermanagementRoleXRoleUIStandardService.prototype = Object.create(BaseService.prototype);
		UsermanagementRoleXRoleUIStandardService.prototype.constructor = UsermanagementRoleXRoleUIStandardService;

	    function extendGroupingFn() {
		    return {
			    'addition': {
				    'grid': platformObjectHelper.extendGrouping([
					    {
						    afterId: 'accessrolefk2',
						    id: 'AccessRole',
						    field: 'AccessRoleFk2',
						    name: 'description',
						    name$tr$: 'usermanagement.right.roleDescription',
						    formatter: 'lookup',
						    formatterOptions: {
							    lookupType: 'AccessRole',
							    displayMember: 'Description'
						    },
						    width: 140
					    }
				    ])
			    }
		    };
	    }

		var service = new BaseService(usermanagementRoleXRoleDetailLayout, domainSchema.properties, usermanagementRightTranslationService);
	    platformUIStandardExtentService.extend(service, extendGroupingFn().addition);
	    return service;
	}
})();