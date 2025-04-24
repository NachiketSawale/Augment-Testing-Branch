(function() {
	'use strict';
	/* global globals, angular */
	var moduleName = 'productionplanning.formwork';

	angular.module(moduleName).factory('ppsFormworkLayout', PpsFormworkLayout);

	PpsFormworkLayout.$inject = ['$injector', 'basicsLookupdataConfigGenerator', 'productionplanningFormworktypeLookupOverloadProvider'];

	function PpsFormworkLayout($injector, basicsLookupdataConfigGenerator, formworktypeLookupOverloadProvider) {
		return {
			fid: 'productionplanning.formwork.formwork',
			version: '1.0.0',
			showGrouping: true,
			addValidationAutomatically: true,
			change: function(entity, field) {
				let formworkDataService = $injector.get('ppsFormworkDataService');
				formworkDataService.onEntityPropertyChanged(entity, field);
			},
			groups: [
				{
					gid: 'baseGroup',
					attributes: ['code','description', 'formworktypefk', 'islive']
				},
				{
					gid: 'productionGroup',
					attributes: ['processfk','bassitefk', 'productionplacefk']
				},
				{
					gid: 'userDefTextGroup',
					isUserDefText: true,
					attCount: 5,
					attName: 'userdefined',
					noInfix: true
				},
				{
					gid: 'entityHistory',
					isHistory: true
				}
			],
			overloads: {
				formworktypefk: formworktypeLookupOverloadProvider.provideFormworktypeLookupOverload(),
				islive: {
					readonly: true
				},
				processfk: {
					grid: {
						editor: 'lookup',
						editorOptions: {
							directive: 'pps-process-configuration-process-dialog-lookup'
						},
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'Process',
							displayMember: 'Code',
							version: 3
						},
						width: 70
					},
					detail: {
						type: 'directive',
						directive: 'basics-lookupdata-lookup-composite',
						options: {
							lookupOptions: {
								version: 3
							},
							lookupDirective: 'pps-process-configuration-process-dialog-lookup',
							descriptionMember: 'Description'
						}
					}
				},
				bassitefk: {
					grid: {
						editor: 'lookup',
						editorOptions: {
							directive: 'basics-site-site-lookup'
						},
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'SiteNew',
							displayMember: 'Code',
							version: 3
						},
						width: 70
					},
					detail: {
						type: 'directive',
						directive: 'basics-lookupdata-lookup-composite',
						options: {
							lookupOptions: {
								version: 3
							},
							lookupDirective: 'basics-site-site-lookup',
							descriptionMember: 'DescriptionInfo.Description'
						}
					}
				},
				productionplacefk: {
					grid: {
						editor: 'lookup',
						editorOptions: {
							directive: 'pps-production-place-dialog-lookup',
							lookupOptions: {
								filterKey: 'pps-production-place-filter-bysite',
								version: 3
							}
						},
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'PpsProductionPlace',
							displayMember: 'Code',
							version: 3
						},
						width: 70
					},
					detail: {
						type: 'directive',
						directive: 'basics-lookupdata-lookup-composite',
						options: {
							lookupOptions: {
								filterKey: 'pps-production-place-filter-bysite',
								version: 3
							},
							lookupDirective: 'pps-production-place-dialog-lookup',
							descriptionMember: 'Description'
						}
					}
				}
			}
		};
	}

	angular.module(moduleName).factory('ppsFormworkUIStandardService', PpsFormworkUIStandardService);

	PpsFormworkUIStandardService.$inject = ['platformUIStandardConfigService', 'platformSchemaService',
		'productionplanningFormworkTranslationService',
		'ppsFormworkLayout'];

	function PpsFormworkUIStandardService(platformUIStandardConfigService, platformSchemaService, translationService, ppsFormworkLayout) {
		var BaseService = platformUIStandardConfigService;

		var attributeDomains = platformSchemaService.getSchemaFromCache({
			typeName: 'FormworkDto',
			moduleSubModule: 'Productionplanning.Formwork'
		});

		var schemaProperties = attributeDomains.properties;

		var service = new BaseService(ppsFormworkLayout, schemaProperties, translationService);

		return service;
	}
})();