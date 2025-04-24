/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	let moduleName = 'basics.textmodules';

	/**
	 * @ngdoc service
	 * @name basicsTextModulesUIConfigurationService
	 * @function
	 *
	 * @description
	 * basicsTextModulesUIConfigurationService is the config service for all text modules view.
	 */
	angular.module(moduleName).factory('basicsTextModulesUIConfigurationService', ['basicsLookupdataConfigGenerator',

		function (basicsLookupdataConfigGenerator) {

			return {
				getBasTextModulesDetailLayout: function () {
					return {
						'fid': 'basics.textmodules.detailform',
						'version': '1.0.0',
						'showGrouping': true,
						addValidationAutomatically: true,

						'groups': [
							{
								'gid': 'basicData',
								'attributes': ['textmodulecontextfk', 'code', 'descriptioninfo', 'islive', 'textmoduletypefk', 'islanguagedependent',
									'textformatfk', 'client', 'rubricfk', 'clerkfk', 'accessrolefk', 'portalusergroupfk']
							},
							{
								'gid': 'entityHistory',
								'isHistory': true
							}
						],
						'overloads': {
							'textmodulecontextfk': basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.textmodulecontext', null, {
								filterKey: 'basics-textmodule-textmodulecontext-filter'
							}),
							'code': {
								maxLength: 252
							},
							'textmoduletypefk': basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.textmoduletype'),
							'textformatfk':  basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.textformat'),
							'client': {
								'detail': {
									'type': 'directive',
									'directive': 'basics-company-company-lookup',
									'options': {
										showClearButton: true,
										isTextEditable: true,
										selectableCallback: function (item, entity) {
											return item.TextModuleContextFk === entity.TextModuleContextFk;
										},
										filterKey: 'basics-textmodule-company-filter'
									}
								},
								'grid': {
									editor: 'directive',
									editorOptions: {
										showClearButton: true,
										isTextEditable: true,
										directive: 'basics-company-company-lookup',
										selectableCallback: function (item, entity) {
											return item.TextModuleContextFk === entity.TextModuleContextFk;
										},
										filterKey: 'basics-textmodule-company-filter'
									}
								}
							},
							'rubricfk': basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.rubric'),
							'clerkfk': {
								detail: {
									type: 'directive',
									directive: 'basics-lookupdata-lookup-composite',
									options: {
										lookupDirective: 'cloud-clerk-clerk-dialog',
										descriptionMember: 'Description',
										lookupOptions: {
											showClearButton: true
										}
									},
									requiredInErrorHandling: true
								},
								grid: {
									editor: 'lookup',
									directive: 'basics-lookupdata-lookup-composite',
									editorOptions: {
										lookupDirective: 'cloud-clerk-clerk-dialog',
										lookupOptions: {
											showClearButton: true,
											displayMember: 'Code',
											addGridColumns: [{
												id: 'Description',
												field: 'Description',
												name: 'Description',
												width: 200,
												formatter: 'description',
												name$tr$: 'cloud.common.entityDescription'
											}],
											additionalColumns: true
										}
									},
									formatter: 'lookup',
									formatterOptions: {
										lookupType: 'Clerk',
										displayMember: 'Code'
									}
								}
							},
							'accessrolefk': {
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
							},
							'portalusergroupfk': basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.frmportalusergroup', 'Name')
						}
					};
				}
			};
		}
	]);
})(angular);

