/**
 * Created by jie on 20/03/2023.
 */
(function (angular) {
	'use strict';
	var moduleName = 'basics.company';
	angular.module(moduleName).factory('basicsCompanyICPartnerAccUIStandardService',
		['platformUIStandardConfigService', 'basicsCompanyTranslationService', 'platformSchemaService','platformUIStandardExtentService',
			function (platformUIStandardConfigService, basicsCompanyTranslationService, platformSchemaService,platformUIStandardExtentService) {

				function createMainDetailLayout() {
					return {
						fid: 'basics.company.companyICPartnerAcc',
						version: '1.0.0',
						'change': 'change',
						showGrouping: true,
						addValidationAutomatically: true,
						groups: [
							{
								gid: 'baseGroup',
								attributes: ['id', 'prcstructurefk', 'accountrevenue', 'accountcost', 'surchargepercent','accountrevenuesurcharge']
							},
							{
								gid: 'entityHistory',
								isHistory: true
							}
						],
						overloads: {
							id:{
								readonly:true
							},
							'prcstructurefk': {
								'detail': {
									'type': 'directive',
									'directive': 'basics-lookupdata-lookup-composite',
									'options': {
										lookupDirective: 'basics-company-structure-dialog',
										descriptionMember: 'DescriptionInfo.Description',
										lookupOptions: {
											showClearButton: true,
											filterKey: 'prc-structure-filter'
										}
									}
								},
								'grid': {
									editor: 'lookup',
									editorOptions: {
										lookupOptions: {
											showClearButton: true,
											filterKey: 'prc-structure-filter'
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
									'afterId': 'prcstructurefk',
									id: 'StructureName',
									field: 'PrcStructureFk',
									name: 'Procurement Structure Description',
									name$tr$: 'basics.company.entityPrcStructureDesc',
									sortable: true,
									formatter: 'lookup',
									formatterOptions: {
										lookupType: 'CompanyPrcStructure',
										displayMember: 'DescriptionInfo.Description',
										version: 3
									},
									width: 150
								}]}
					};
				}

				var companyICPartnerAccDetailLayout = createMainDetailLayout();

				var BaseService = platformUIStandardConfigService;

				var companyICPartnerAttributeDomains = platformSchemaService.getSchemaFromCache({
					typeName: 'CompanyICPartnerAccDto',
					moduleSubModule: 'Basics.Company'
				});

				companyICPartnerAttributeDomains = companyICPartnerAttributeDomains.properties;

				var service = new BaseService(companyICPartnerAccDetailLayout, companyICPartnerAttributeDomains, basicsCompanyTranslationService);
				platformUIStandardExtentService.extend(service, companyICPartnerAccDetailLayout.addition, companyICPartnerAttributeDomains);
				return service;
			}
		]);
})(angular);