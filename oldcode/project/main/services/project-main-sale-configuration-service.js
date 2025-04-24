/**
 * Created by leo on 14.10.2015.
 */
(function () {
	'use strict';
	var moduleName = 'project.main';

	/**
	 * @ngdoc service
	 * @name projectMainSaleConfigurationService
	 * @function
	 *
	 * @description
	 * This service provides standard layots for different containers defined in project main module
	 */
	angular.module(moduleName).factory('projectMainSaleConfigurationService',

		['platformUIStandardConfigService', 'projectMainTranslationService', 'basicsLookupdataConfigGenerator', 'platformSchemaService',

			/* jshint -W072 */ // many parameters because of dependency injection
			function (platformUIStandardConfigService, projectMainTranslationService, basicsLookupdataConfigGenerator, platformSchemaService) {

				function createMainSaleDetailLayout() {
					return {
						fid: 'project.main.saledetailform',
						version: '0.2.4',
						addValidationAutomatically: true,
						showGrouping: true,
						groups: [
							{
								gid: 'baseGroup',
								attributes: ['code', 'description', 'decisionfk', 'chancesfk', 'volume', 'profitpercent', 'remark', 'outcomefk', 'closingdate', 'closingtime', 'businesspartnerfk', 'remarkoutcome', 'stadiumfk', 'valuationlowest', 'valuationhighest', 'valuationown', 'valuationdifference', 'rank', 'remark01', 'remark02', 'remark03', 'remark04', 'remark05', 'bascurrencyfk']
							},
							{
								gid: 'entityHistory',
								isHistory: true
							}
						],
						overloads: {
							decisionfk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('project.main.decision'),
							chancesfk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('project.main.chances'),
							outcomefk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('project.main.outcome'),
							stadiumfk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('project.main.stadium'),
							bascurrencyfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
								dataServiceName: 'basicsCurrencyLookupDataService',
								enableCache: true
								// readonly: true
							}),
							businesspartnerfk: {
								detail: {
									type: 'directive',
									directive: 'business-partner-main-business-partner-dialog',
									options: {
										initValueField: 'BusinesspartnerBpName1',
										showClearButton: true
									}
								},
								grid: {
									editor: 'lookup',
									editorOptions: {
										directive: 'business-partner-main-business-partner-dialog'
									},
									formatter: 'lookup',
									formatterOptions: {
										lookupType: 'BusinessPartner',
										displayMember: 'BusinessPartnerName1'
									}
								}
							}
						}
					};
				}

				var projectMainSaleDetailLayout = createMainSaleDetailLayout();

				var BaseService = platformUIStandardConfigService;

				var projectSaleAttributeDomains = platformSchemaService.getSchemaFromCache({
					typeName: 'SaleDto',
					moduleSubModule: 'Project.Main'
				});
				if (projectSaleAttributeDomains) {
					projectSaleAttributeDomains = projectSaleAttributeDomains.properties;
				}

				function ProjectUIStandardService(layout, scheme, translateService) {
					BaseService.call(this, layout, scheme, translateService);
				}

				ProjectUIStandardService.prototype = Object.create(BaseService.prototype);
				ProjectUIStandardService.prototype.constructor = ProjectUIStandardService;

				return new BaseService(projectMainSaleDetailLayout, projectSaleAttributeDomains, projectMainTranslationService);
			}
		]);
})();
