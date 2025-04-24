(function () {
	'use strict';
	var modName = 'basics.procurementstructure';
	angular.module(modName)
		.factory('procurementStructureInterCompanyLayout',
			[function () {
				return {
					'fid': 'basics.procurementstructure.procurementStructureInterCompany',
					'version': '1.0.0',
					'addValidationAutomatically': true,
					'showGrouping': true,
					'groups': [
						{
							'gid': 'basicData',
							attributes: ['prcstructurefk', 'prcstructuretofk']
						},
						{
							'gid': 'entityHistory',
							'isHistory': true
						}
					],
					'translationInfos': {
						'extraModules': [modName],
						'extraWords': {
							PrcStructureFk: {
								location: modName,
								identifier: 'entityPrcStructureFk',
								initial: 'Procurement Structure'
							},
							PrcStructureToFk: {
								location: modName,
								identifier: 'entityPrcStructureToFk',
								initial: 'To Procurement Structure'
							}
						}
					},
					'overloads': {
						'prcstructurefk': {
							'readonly': true,
							'detail': {
								'type': 'directive',
								'directive': 'basics-lookupdata-lookup-composite',
								'options': {
									lookupDirective: 'basics-company-structure-dialog',
									descriptionMember: 'DescriptionInfo.Translated',
									version: 3,
									lookupOptions: {
										showClearButton: true
									}
								}
							},
							'grid': {
								editor: 'lookup',
								editorOptions: {
									lookupOptions: {
										showClearButton: true
									},
									directive: 'basics-company-structure-dialog'
								},
								width: 150,
								readonly:true,
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'CompanyPrcStructure',
									displayMember: 'Code',
									version: 3
								}
							}
						},
						'prcstructuretofk': {
							'detail': {
								'type': 'directive',
								'directive': 'basics-lookupdata-lookup-composite',
								'options': {
									lookupDirective: 'basics-company-structure-dialog',
									descriptionMember: 'DescriptionInfo.Translated',
									version: 3,
									lookupOptions: {
										showClearButton: true,
										filterKey: 'inter-company-prc-structure-filter'
									}
								}
							},
							'grid': {
								editor: 'lookup',
								editorOptions: {
									lookupOptions: {
										showClearButton: true,
										filterKey: 'inter-company-prc-structure-filter'
									},
									directive: 'basics-company-structure-dialog'
								},
								width: 150,
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'CompanyPrcStructure',
									displayMember: 'Code',
									version: 3
								}
							}
						}
					},
					'addition': {
						'grid': [
							{
								afterId: 'prcstructurefk',
								id: 'StructureName',
								field: 'PrcStructureFk',
								name: 'Procurement Structure Description',
								name$tr$: 'basics.procurementstructure.entityPrcStructureDesc',
								sortable: true,
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'CompanyPrcStructure',
									displayMember: 'DescriptionInfo.Translated',
									version:3
								},
								width: 150
							}, {
								afterId: 'prcstructuretofk',
								id: 'StructureName2',
								field: 'PrcStructureToFk',
								name: 'To Procurement Structure Description',
								name$tr$: 'basics.procurementstructure.entityPrcStructureToDesc',
								sortable: true,
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'CompanyPrcStructure',
									displayMember: 'DescriptionInfo.Translated',
									version:3
								},
								width: 150
							}]
					}
				};
			}])
		.factory('procurementStructureInterCompanyUIStandardService',
			['platformUIStandardConfigService', 'basicsProcurementstructureTranslationService',
				'procurementStructureInterCompanyLayout', 'platformSchemaService', 'platformUIStandardExtentService',

				function (platformUIStandardConfigService, translationService, layout, platformSchemaService, platformUIStandardExtentService) {

					var BaseService = platformUIStandardConfigService;

					var domainSchema = platformSchemaService.getSchemaFromCache({
						typeName: 'InterCompanyStructureDto',
						moduleSubModule: 'Basics.ProcurementStructure'
					});
					if (domainSchema) {
						domainSchema = domainSchema.properties;
					}

					function UIStandardService(layout, scheme, translationService) {
						BaseService.call(this, layout, scheme, translationService);
					}

					UIStandardService.prototype = Object.create(BaseService.prototype);
					UIStandardService.prototype.constructor = UIStandardService;

					var service = new BaseService(layout, domainSchema, translationService);
					platformUIStandardExtentService.extend(service, layout.addition, domainSchema);

					return service;
				}
			]);
})();