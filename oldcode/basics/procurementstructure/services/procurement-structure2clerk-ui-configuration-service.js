(function () {
	'use strict';
	var modName = 'basics.procurementstructure', cloudCommonModule = 'cloud.common';
	angular.module(modName)
		.factory('basicsProcurementClerkLayout',
			['basicsLookupdataConfigGenerator', function (basicsLookupdataConfigGenerator) {
				return {
					'fid': 'basics.procurementstructure.clerk.detail',
					'version': '1.0.0',
					'addValidationAutomatically': true,
					'showGrouping': true,
					'groups': [
						{
							'gid': 'basicData',
							'attributes': ['companyfk', 'clerkrolefk', 'clerkfk', 'commenttext']
						},
						{
							'gid': 'entityHistory',
							'isHistory': true
						}
					],
					'translationInfos': {
						'extraModules': [],
						'extraWords': {
							CompanyFk: {
								location: cloudCommonModule,
								identifier: 'entityCompany',
								initial: 'Company'
							},
							ClerkRoleFk: {
								location: cloudCommonModule,
								identifier: 'entityClerkRole',
								initial: 'Clerk Role'
							},
							ClerkFk: {
								location: cloudCommonModule,
								identifier: 'entityClerk',
								initial: 'Clerk Code'
							}
						}
					},
					'overloads': {
						'companyfk': {
							'grid': {
								editor: 'lookup',
								editorOptions: {
									directive: 'basics-company-company-lookup'
								},
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'company',
									displayMember: 'Code'
								},
								width: 140
							},
							'detail': {
								'type': 'directive',
								'directive': 'basics-lookupdata-lookup-composite',
								'options': {
									lookupDirective: 'basics-company-company-lookup',
									descriptionMember: 'CompanyName',
									lookupOptions: {}
								},
								'change': 'formOptions.onPropertyChanged'
							}
						},
						'clerkrolefk': basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.clerk.role'),
						'clerkfk': {
							'grid': {
								editor: 'lookup',
								editorOptions: {
									directive: 'cloud-clerk-clerk-dialog'
								},
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'clerk',
									displayMember: 'Code'
								},
								width: 100
							},
							'detail': {
								'type': 'directive',
								'directive': 'basics-lookupdata-lookup-composite',
								'model': 'ClerkFk',
								'options': {
									lookupDirective: 'cloud-clerk-clerk-dialog',
									descriptionMember: 'Description'
								},
								'change': 'formOptions.onPropertyChanged'
							}
						}
					},
					'addition': {
						grid: [
							{
								lookupDisplayColumn: true,
								field: 'CompanyFk',
								'name': 'Company Name',
								'name$tr$': 'cloud.common.entityCompanyName',
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'company',
									displayMember: 'CompanyName'
								},
								width: 140
							},
							{
								lookupDisplayColumn: true,
								field: 'ClerkFk',
								'name$tr$': 'cloud.common.entityClerkName',
								width: 125
							}
						]
					}
				};
			}])
		.factory('basicsProcurementClerkUIStandardService',
			['platformUIStandardConfigService', 'basicsProcurementstructureTranslationService',
				'basicsProcurementClerkLayout', 'platformSchemaService', 'platformUIStandardExtentService',

				function (platformUIStandardConfigService, translationService, layout, platformSchemaService, platformUIStandardExtentService) {

					var BaseService = platformUIStandardConfigService;

					var domainSchema = platformSchemaService.getSchemaFromCache({
						typeName: 'PrcStructure2clerkDto',
						moduleSubModule: 'Basics.ProcurementStructure'
					});
					if (domainSchema) {
						domainSchema = domainSchema.properties;
					}
					function UIStandardService(layout, scheme, translateService) {
						BaseService.call(this, layout, scheme, translateService);
					}

					UIStandardService.prototype = Object.create(BaseService.prototype);
					UIStandardService.prototype.constructor = UIStandardService;

					var service = new BaseService(layout, domainSchema, translationService);
					platformUIStandardExtentService.extend(service, layout.addition, domainSchema);

					return service;
				}
			]);
})();