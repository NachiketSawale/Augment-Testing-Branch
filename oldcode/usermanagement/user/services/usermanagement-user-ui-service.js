/**
 * Created by sandu on 26.08.2015.
 */
(function () {

	'use strict';

	var moduleName = 'usermanagement.user';

	/**
	 * @ngdoc service
	 * @name usermanagementUserUIService
	 * @function
	 *
	 * @description
	 * This service provides standard layouts for different containers of the module
	 */
	angular.module(moduleName).factory('usermanagementUserUIService', usermanagementUserUIService);

	usermanagementUserUIService.$inject = ['platformUIStandardConfigService', 'usermanagementUserTranslationService', 'usermanagementUserDetailLayout', 'platformSchemaService'];

	function usermanagementUserUIService(platformUIStandardConfigService, usermanagementUserTranslationService, usermanagementUserDetailLayout, platformSchemaService) {

		var BaseService = platformUIStandardConfigService;

		var domainSchema = platformSchemaService.getSchemaFromCache({
			typeName: 'UserDto',
			moduleSubModule: 'UserManagement.Main'
		});
		if (domainSchema) {
			domainSchema = domainSchema.properties;
			domainSchema.Password = {domain: 'password'};
			domainSchema.ConfirmPassword = {domain: 'password'};
		}

		function UsermanagementUserUIStandardService(layout, scheme, translateService) {
			BaseService.call(this, layout, scheme, translateService);
		}

		UsermanagementUserUIStandardService.prototype = Object.create(BaseService.prototype);
		UsermanagementUserUIStandardService.prototype.constructor = UsermanagementUserUIStandardService;

		return new BaseService(usermanagementUserDetailLayout, domainSchema, usermanagementUserTranslationService);
	}

	angular.module(moduleName).factory('usermanagementUserXGroupUIService', usermanagementUserXGroupUIService);

	usermanagementUserXGroupUIService.$inject = ['platformUIStandardConfigService', 'usermanagementUserTranslationService', 'usermanagementUserXGroupDetailLayout', 'platformSchemaService', 'platformObjectHelper', 'platformUIStandardExtentService'];

	function usermanagementUserXGroupUIService(platformUIStandardConfigService, translationService, usermanagementUserXGroupDetailLayout, platformSchemaService, platformObjectHelper, platformUIStandardExtentService) {

		var BaseService = platformUIStandardConfigService;

		var domainSchema = platformSchemaService.getSchemaFromCache({
			typeName: 'AccessUser2GroupDto',
			moduleSubModule: 'UserManagement.Main'
		});

		function ConfigUIStandardService(layout, scheme, translateService) {
			BaseService.call(this, layout, scheme, translateService);
		}

		ConfigUIStandardService.prototype = Object.create(BaseService.prototype);
		ConfigUIStandardService.prototype.constructor = ConfigUIStandardService;

		function extendGroupingFn() {
			return {
				'addition': {
					'grid': platformObjectHelper.extendGrouping([
						{
							'afterId': 'accessgroupfk',
							'id': 'AccessGroupName',
							field: 'AccessGroupFk',
							'name': 'Group',
							'name$tr$': 'usermanagement.group.groupDescription',
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'AccessGroup',
								displayMember: 'Description'
							},
							width: 140
						},
						{
							'afterId': 'AccessGroupName',
							'id': 'AccessGroupDomainSID',
							field: 'AccessGroupFk',
							'name': 'DomainSID',
							'name$tr$': 'usermanagement.group.groupDomainSID',
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'AccessGroup',
								displayMember: 'DomainSID'
							},
							width: 140
						}
					])
				}
			};
		}

		var service = new BaseService(usermanagementUserXGroupDetailLayout, domainSchema.properties, translationService);
		platformUIStandardExtentService.extend(service, extendGroupingFn().addition);
		return service;
	}

	angular.module(moduleName).factory('usermanagementUserLogUIService', usermanagementUserLogUIService);

	usermanagementUserLogUIService.$inject = ['platformUIStandardConfigService', 'usermanagementUserTranslationService', 'usermanagementUserLogDetailLayout', 'platformSchemaService'];

	function usermanagementUserLogUIService(platformUIStandardConfigService, translationService, usermanagementUserLogDetailLayout, platformSchemaService) {

		var BaseService = platformUIStandardConfigService;

		var domainSchema = platformSchemaService.getSchemaFromCache({
			typeName: 'JobDto',
			moduleSubModule: 'Services.Scheduler'
		});
		if (domainSchema) {
			domainSchema = domainSchema.properties;
			domainSchema.Log = {domain: 'action'};
		}

		function LogUIStandardService(layout, scheme, translateService) {
			BaseService.call(this, layout, scheme, translateService);
		}

		LogUIStandardService.prototype = Object.create(BaseService.prototype);
		LogUIStandardService.prototype.constructor = LogUIStandardService;

		return new BaseService(usermanagementUserLogDetailLayout, domainSchema, translationService);
	}
})();
