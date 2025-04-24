/**
 * Created by henkel on 01.02.2018
 */

(function () {
	'use strict';
	var moduleName = 'basics.company';

	/**
	 * @ngdoc service
	 * @name basicsCompanyTransheaderUIStandardService
	 * @function
	 *
	 * @description
	 * This service provides standard layots for different containers of company entities
	 */
	angular.module(moduleName).factory('basicsCompanyTransheaderUIStandardService',
		['platformUIStandardConfigService', 'basicsCompanyTranslationService', 'platformSchemaService', 'basicsLookupdataConfigGenerator', 'platformUIStandardExtentService',

			function (platformUIStandardConfigService, basicsCompanyTranslationService, platformSchemaService, basicsLookupdataConfigGenerator, platformUIStandardExtentService) {

				function createMainDetailLayout() {
					return {
						fid: 'basics.company.transheaderdetailform',
						version: '1.0.0',
						showGrouping: true,
						addValidationAutomatically: true,
						groups: [
							{
								gid: 'baseGroup',
								attributes: ['companyfk', 'transactiontypefk', 'description', 'postingdate', 'commenttext', 'returnvalue', 'issuccess', 'companytransheaderstatusfk']
							},
							{
								gid: 'entityHistory',
								isHistory: true
							}
						],
						overloads: {
							issuccess: {readonly: true},
							companyfk: {
								grid: {
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
								detail: {
									type: 'directive',
									directive: 'basics-lookupdata-lookup-composite',
									options: {
										lookupDirective: 'basics-company-company-lookup',
										descriptionMember: 'CompanyName',
										lookupOptions: {}
									}
								},
								readonly: true
							},
							transactiontypefk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.transactiontype'),
							companytransheaderstatusfk:basicsLookupdataConfigGenerator.provideReadOnlyConfig('basics.customize.companytransheaderstatus', null, {
								showIcon: true,
								imageSelectorService: 'platformStatusIconService'
							})
						},
						addition: {
							grid: [
								{
									field: 'CompanyTransheader',
									name: 'Transaction Header',
									name$tr$: 'basics.company.entityTransheader',
									formatter: 'description',
									readonly: true,
									maxLength: 255,
									width: 150
								}
							],
							detail: [
								{
									rid: 'CompanyTransheader',
									gid: 'baseGroup',
									model: 'BasCompanyTransheader',
									label: 'Transaction Header',
									label$tr$: 'basics.company.entityTransheader',
									type: 'description',
									directive: 'description',
									maxLength: 255,
									readonly: true
								}
							]
						}
					};
				}

				var companyTransheaderDetailLayout = createMainDetailLayout();

				var BaseService = platformUIStandardConfigService;

				var companyTransheaderAttributeDomains = platformSchemaService.getSchemaFromCache({
					typeName: 'CompanyTransheaderDto',
					moduleSubModule: 'Basics.Company'
				});

				companyTransheaderAttributeDomains = companyTransheaderAttributeDomains.properties;

				var service = new BaseService(companyTransheaderDetailLayout, companyTransheaderAttributeDomains, basicsCompanyTranslationService);
				platformUIStandardExtentService.extend(service, companyTransheaderDetailLayout.addition, companyTransheaderAttributeDomains);

				return service;
			}
		]);
})();
