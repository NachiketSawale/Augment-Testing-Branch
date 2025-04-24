
(function (angular) {
	'use strict';
	let moduleName = 'qto.main';
	
	angular.module(moduleName).factory('qtoAddressRangeDetailUIConfigService',
		['$injector', 'basicsLookupdataConfigGenerator', 'platformTranslateService', 'platformUIStandardExtentService', 'platformUIStandardConfigService', 'platformSchemaService', 'qtoMainTranslationService',
			function ($injector, basicsLookupdataConfigGenerator, platformTranslateService, platformUIStandardExtentService, platformUIStandardConfigService, platformSchemaService, qtoMainTranslationService) {
				
				let BaseService = platformUIStandardConfigService;
				
				function qtoAddressRangeDetailLayout() {
					return {
						fid: 'qto.main.addressRangeDetail',
						version: '0.2.4',
						addValidationAutomatically: true,
						showGrouping: true,
						groups: [
							{
								gid: 'basicData',
								attributes: ['sheetarea', 'linearea', 'indexarea', 'basclerkrolefk', 'basclerkfk']
							}
						],
						overloads: {
							basclerkrolefk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
								dataServiceName: 'basicsCustomClerkRoleLookupDataService',
								enableCache: true,
								filterKey: 'project-clerk-role-by-is-for-project-filter'
							}),
							basclerkfk:
								{
									grid: {
										editor: 'lookup',
										directive: 'basics-lookupdata-lookup-composite',
										editorOptions: {
											lookupDirective: 'cloud-clerk-clerk-dialog',
											lookupOptions: {
												showClearButton: true,
												displayMember: 'Code',
												filterKey: 'basics-clerk-by-company-filter',
												addGridColumns: [{
													id: 'Description',
													field: 'Description',
													name: 'Description',
													width: 300,
													formatter: 'description',
													name$tr$: 'cloud.common.entityDescription'
												}],
												additionalColumns: true
											}
										},
										formatter: 'lookup',
										formatterOptions: {
											lookupType: 'Clerk',
											displayMember: 'Code',
											version: 3
										}
									}
								}
						}
					};
				}
				
				let detailLayout = qtoAddressRangeDetailLayout();
				
				let domains = platformSchemaService.getSchemaFromCache({
					typeName: 'QtoAddressRangeDetailDto',
					moduleSubModule: 'Qto.Main'
				});
				if (domains) {
					domains = domains.properties;
				}
				
				function ClerkUIStandardService(layout, scheme, translateService) {
					BaseService.call(this, layout, scheme, translateService);
				}
				
				ClerkUIStandardService.prototype = Object.create(BaseService.prototype);
				ClerkUIStandardService.prototype.constructor = ClerkUIStandardService;
				
				let service = new BaseService(detailLayout, domains, qtoMainTranslationService);
				
				platformUIStandardExtentService.extend(service, detailLayout.addition, domains);
				return service;
			}
		]);
	
})(angular);
