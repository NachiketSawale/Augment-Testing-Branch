/**
 * Created by sandu on 25.08.2015.
 */
(function () {
	'use strict';

	var mod = new angular.module('usermanagement.group');
	var selectOptions = {
		displayMember: 'description',
		valueMember: 'Id',
		items: 'usermanagementGroupStateValues'
	};

	mod.factory('usermanagementGroupDetailLayout', ['platformUIStandardConfigService', 'platformSchemaService', 'usermanagementGroupFinalTranslationService', function (platformUIStandardConfigService, platformSchemaService, usermanagementGroupFinalTranslationService) {
		function createMainDetailLayout() {
			return {
				fid: 'usermanagement.group.groupdetailform',
				version: '1.0.0',
				addValidationAutomatically: true,
				showGrouping: true,
				groups: [
					{
						gid: 'basicData',
						attributes: ['name', 'description', 'domainsid', 'synchronizedate', 'email']
					},
					{
						gid: 'entityHistory',
						isHistory: true
					}],

				'overloads': {
					'domainsid': {
						'readonly': true
					},
					'synchronizedate': {
						'readonly': true
					}
				}
			};
		}

		var groupLayout = createMainDetailLayout();

		var BaseService = platformUIStandardConfigService;

		var groupAttributeDomains = platformSchemaService.getSchemaFromCache({
			typeName: 'AccessGroupDto',
			moduleSubModule: 'UserManagement.Main'
		});

		groupAttributeDomains = groupAttributeDomains.properties;

		return new BaseService(groupLayout, groupAttributeDomains, usermanagementGroupFinalTranslationService);
	}]);

	mod.factory('usermanagementGroupUserXGroupDetailLayout', ['basicsLookupdataConfigGenerator', 'platformUIStandardConfigService', 'usermanagementGroupFinalTranslationService', 'platformSchemaService','platformObjectHelper','platformUIStandardExtentService', function (basicsLookupdataConfigGenerator, platformUIStandardConfigService, usermanagementGroupFinalTranslationService, platformSchemaService, platformObjectHelper, platformUIStandardExtentService) {
		function createMainDetailLayout() {
			return {
				fid: 'usermanagement.group.userXgroupdetailform',
				version: '1.0.0',
				showGrouping: true,
				groups: [
					{
						gid: 'basicDataUserXGroup',
						attributes: ['userfk','identityprovider']
					},
					{
						gid: 'entityHistory',
						isHistory: true
					}
				],
				'overloads': {
					'userfk':{
						detail: {
							type: 'directive',
							directive: 'basics-lookupdata-lookup-composite',
							options: {
								lookupDirective: 'usermanagement-user-user-dialog',
								descriptionMember: 'Description',
								lookupOptions: {
									showClearButton: true
								}
							}
						},
						grid: {
							editor: 'lookup',
							directive: 'basics-lookupdata-lookup-composite',
							editorOptions: {
								lookupDirective: 'usermanagement-user-user-dialog',
								lookupOptions: {
									showClearButton: true,
									displayMember: 'Name'
								}
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'User',
								displayMember: 'Name'
							}
						}
					},
					identityprovider:basicsLookupdataConfigGenerator.provideReadOnlyConfig('usermanagement.main.user', 'Name')
				}
			};
		}

		var userXGroupLayout = createMainDetailLayout();
		var BaseService = platformUIStandardConfigService;

		var userXGroupAttributeDomains = platformSchemaService.getSchemaFromCache({
			typeName: 'AccessUser2GroupDto',
			moduleSubModule: 'UserManagement.Main'
		});

		if(userXGroupAttributeDomains){
			userXGroupAttributeDomains = userXGroupAttributeDomains.properties;
			userXGroupAttributeDomains.IdentityProvider = {domain: 'comment'};
		}
		function extendGroupingFn() {
			return {
				'addition': {
					'grid': platformObjectHelper.extendGrouping([
						{
							'afterId': 'userfk',
							'id': 'UserName',
							field: 'UserFk',
							'name': 'Logon Name',
							'name$tr$': 'usermanagement.user.userLogonName',
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'User',
								displayMember: 'LogonName'
							},
							width: 140
						},
						{
							'afterId': 'userfk',
							'id': 'UserDomainSID',
							field: 'UserFk',
							'name': 'Domain SID',
							'name$tr$': 'usermanagement.user.userDomainSID',
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'User',
								displayMember: 'DomainSID'
							},
							width: 140
						},
						{
							'afterId': 'userfk',
							'id': 'UserProviderUniqueIdentifier',
							field: 'UserFk',
							'name': 'Provider Unique Identifier',
							'name$tr$': 'usermanagement.user.providerUniqueIdentifier',
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'User',
								displayMember: 'ProviderUniqueIdentifier'
							},
							width: 140
						},
					])
				}
			};
		}

		var service =  new BaseService(userXGroupLayout, userXGroupAttributeDomains, usermanagementGroupFinalTranslationService);
		platformUIStandardExtentService.extend(service, extendGroupingFn().addition);
		return service;
	}]);

	mod.factory('usermanagementGroupXRoleDetailLayout', ['basicsLookupdataConfigGenerator', 'platformObjectHelper', 'platformUIStandardConfigService', 'platformUIStandardExtentService', 'platformSchemaService', 'usermanagementGroupFinalTranslationService',

		function (basicsLookupdataConfigGenerator, platformObjectHelper, platformUIStandardConfigService, platformUIStandardExtentService, platformSchemaService, usermanagementGroupFinalTranslationService) {
			function createMainDetailLayout() {
				return {
					fid: 'usermanagement.group.groupXroledetailform',
					version: '1.0.0',
					showGrouping: true,
					groups: [
						{
							gid: 'basicDataGroupXRole',
							attributes: ['clientfk', 'accessrolefk']
						},
						{
							gid: 'entityHistory',
							isHistory: true
						}
					],
					'overloads': {
						'clientfk': {
							'grid': {
								editor: 'lookup',
								editorOptions: {
									directive: 'basics-company-company-lookup',
									lookupOptions: {
										//filterKey: 'basics-company-profit-center-filter'
									}
								},
								name: 'Company',
								name$tr$: 'usermanagement.group.clientfk',
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'company',
									displayMember: 'Code'
								},
								width: 120
							},
							'detail': {
								'type': 'directive',
								'directive': 'basics-company-company-lookup',
								'options': {
									lookupOptions: {
										//filterKey: 'basics-company-profit-center-filter'
									}
								},
								'change': 'formOptions.onPropertyChanged'
							}
						},
						'accessrolefk':{
							detail: {
								type: 'directive',
								directive: 'basics-lookupdata-lookup-composite',
								options: {
									lookupDirective: 'usermanagement-right-role-dialog',
									descriptionMember: 'Description',
									lookupOptions: {
										showClearButton: true
									}
								}
							},
							grid: {
								editor: 'lookup',
								directive: 'basics-lookupdata-lookup-composite',
								editorOptions: {
									lookupDirective: 'usermanagement-right-role-dialog',
									lookupOptions: {
										showClearButton: true,
										displayMember: 'Name'
									}
								},
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'AccessRole',
									displayMember: 'Name'
								}
							}
						}
					}
				};
			}

			var group2RoleLayout = createMainDetailLayout();

			var BaseService = platformUIStandardConfigService;

			var groupXRoleAttributeDomains = platformSchemaService.getSchemaFromCache({
				typeName: 'AccessGroup2RoleDto',
				moduleSubModule: 'UserManagement.Main'
			});

			groupXRoleAttributeDomains = groupXRoleAttributeDomains.properties;

			function extendGroupingFn() {
				return {
					'addition': {
						'grid': platformObjectHelper.extendGrouping([
							{
								'afterId': 'clientfk',
								'id': 'CompanyName',
								field: 'ClientFk',
								'name': 'Company Name',
								'name$tr$': 'usermanagement.group.entityCompanyName',
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'company',
									displayMember: 'CompanyName'
								},
								width: 140
							}
						])
					}
				};
			}

			var service = new BaseService(group2RoleLayout, groupXRoleAttributeDomains, usermanagementGroupFinalTranslationService);
			platformUIStandardExtentService.extend(service, extendGroupingFn().addition);
			return service;
		}]);

	mod.factory('usermanagementGroupLogDetailLayout', ['platformUIStandardConfigService', 'platformSchemaService', 'usermanagementGroupFinalTranslationService', function (platformUIStandardConfigService, platformSchemaService, usermanagementGroupFinalTranslationService) {
		function createMainDetailLayout() {
			return {
				fid: 'usermanagement.group.logdetailform',
				version: '1.0.0',
				addValidationAutomatically: true,
				showGrouping: true,
				groups: [
					{
						gid: 'basicData',
						attributes: ['name', 'jobstate', 'starttime', 'executionstarttime', 'executionendtime', 'log']
					},
					{
						gid: 'entityHistory',
						isHistory: true
					}],
				overloads: {
					jobstate: {
						grid: {
							formatterOptions: selectOptions
						},
						'readonly': true
					},
					name: {'readonly': true},
					starttime: {'readonly': true},
					executionstarttime: {'readonly': true},
					executionendtime: {'readonly': true},
					loggingmessage: {'readonly': true}
				}
			};
		}

		var groupLayout = createMainDetailLayout();

		var BaseService = platformUIStandardConfigService;

		var groupAttributeDomains = platformSchemaService.getSchemaFromCache({
			typeName: 'JobDto',
			moduleSubModule: 'Services.Scheduler'
		});
		if(groupAttributeDomains){
			groupAttributeDomains = groupAttributeDomains.properties;
			groupAttributeDomains.Log = {domain: 'action'};
		}

		return new BaseService(groupLayout, groupAttributeDomains, usermanagementGroupFinalTranslationService);
	}]);

})();