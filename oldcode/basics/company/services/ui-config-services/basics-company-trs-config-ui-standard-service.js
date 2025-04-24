/**
 * Created by anl on 10/9/2018.
 */


(function () {
	'use strict';
	var moduleName = 'basics.company';

	/**
	 * @ngdoc service
	 * @name basicsCompanyUIStandardService
	 * @function
	 *
	 * @description
	 * This service provides standard layots for different containers of company entities
	 */
	angular.module(moduleName).factory('basicsCompanyTrsConfigUIStandardService', TrsConfigUIStandardService);

	TrsConfigUIStandardService.$inject = ['platformUIStandardConfigService', 'basicsCompanyTranslationService',
		'platformSchemaService', 'platformObjectHelper',
		'platformUIStandardExtentService', 'basicsLookupdataConfigGenerator',
		'platformLayoutHelperService'];

	/* jshint -W072 */ // many parameters because of dependency injection
	function TrsConfigUIStandardService(platformUIStandardConfigService, basicsCompanyTranslationService,
		platformSchemaService, platformObjectHelper,
		platformUIStandardExtentService, basicsLookupdataConfigGenerator,
		platformLayoutHelperService) {

		function createTrsConfigDetailLayout() {

			return {
				fid: 'basics.company.trsconfigdetailform',
				version: '1.0.0',
				showGrouping: true,
				addValidationAutomatically: true,
				groups: [
					{
						gid: 'baseGroup',
						attributes: ['projectfk', 'jobfk', 'sitefk', 'isdefault', 'remark', 'sitestockfk']
					},
					{
						gid: 'entityHistory',
						isHistory: true
					}
				],
				overloads: {
					projectfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'basicsLookupDataProjectLookupDataService',
						cacheEnable: true,
						additionalColumns: false,
						navigator: {
							moduleName: 'project.main'
						}
					}),
					jobfk: platformLayoutHelperService.provideJobLookupOverload({projectFk: 'ProjectFk'}),
					sitefk: {
						navigator: {
							moduleName: 'basics.site'
						},
						grid: {
							editor: 'lookup',
							editorOptions: {
								lookupOptions: {showClearButton: true},
								directive: 'basics-site-site-lookup'
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'Site',
								displayMember: 'Code'
							},
							width: 70
						},
						detail: {
							type: 'directive',
							directive: 'basics-lookupdata-lookup-composite',
							options: {
								lookupOptions: {showClearButton: true},
								lookupDirective: 'basics-site-site-lookup',
								descriptionMember: 'DescriptionInfo.Translated'
							}
						}
					},
					sitestockfk: {
						navigator: {
							moduleName: 'basics.site'
						},
						grid: {
							editor: 'lookup',
							editorOptions: {
								lookupOptions: {showClearButton: true},
								directive: 'basics-site-site-lookup'
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'Site',
								displayMember: 'Code'
							},
							width: 70
						},
						detail: {
							type: 'directive',
							directive: 'basics-lookupdata-lookup-composite',
							options: {
								lookupOptions: {showClearButton: true},
								lookupDirective: 'basics-site-site-lookup',
								descriptionMember: 'DescriptionInfo.Translated'
							}
						}
					}
				},
				addition: {
					grid: platformObjectHelper.extendGrouping([
						{
							afterId: 'sitefk',
							id: 'siteDesc',
							field: 'SiteFk',
							name: 'Site Description',
							name$tr$: 'resource.master.siteDesc',
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'Site',
								displayMember: 'DescriptionInfo.Translated',
								width: 140
							}
						},
						{
							afterId: 'sitestockfk',
							id: 'siteStockDesc',
							field: 'SiteStockFk',
							name: 'Stock Site Description',
							name$tr$: 'resource.master.siteStockDesc',
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'Site',
								displayMember: 'DescriptionInfo.Translated',
								width: 140
							}
						}
					])
				}
			};
		}

		var trsConfigDetailLayout = createTrsConfigDetailLayout();


		var BaseService = platformUIStandardConfigService;

		var trsConfigAttributeDomains = platformSchemaService.getSchemaFromCache({
			typeName: 'TrsConfigDto',
			moduleSubModule: 'Basics.Company'
		});

		trsConfigAttributeDomains = trsConfigAttributeDomains.properties;

		var service = new BaseService(trsConfigDetailLayout, trsConfigAttributeDomains, basicsCompanyTranslationService);
		platformUIStandardExtentService.extend(service, createTrsConfigDetailLayout().addition, trsConfigAttributeDomains);

		return service;
	}
})();