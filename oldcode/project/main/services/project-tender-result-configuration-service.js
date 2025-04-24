
(function () {
	/*global angular*/
	'use strict';
	var moduleName = 'project.main';

	/**
	 * @ngdoc service
	 * @name projectMainTenderResultConfigurationService
	 * @function
	 *
	 * @description
	 * This service provides standard layouts for different containers defined in project main module
	 */
	angular.module(moduleName).factory('projectMainTenderResultConfigurationService', ['platformUIStandardConfigService',
		'projectMainTranslationService', 'basicsLookupdataConfigGenerator', 'platformSchemaService',

		function (platformUIStandardConfigService, projectMainTranslationService, basicsLookupdataConfigGenerator, platformSchemaService) {

			var BaseService = platformUIStandardConfigService;

			function provideTenderResultLayout() {
				return {
					fid: 'project.tenderresult.detailform',
					version: '0.2.4',
					addValidationAutomatically: true,
					showGrouping: true,
					groups: [
						{
							gid: 'baseGroup',
							attributes: [ 'stadiumfk', 'businesspartnerfk', 'businesspartner', 'salefk', 'rank', 'isactive', 'quotation', 'discount', 'globalpercentage', 'otherdiscount', 'finalquotation', 'numberproposals', 'commenttext', 'isbiddingconsortium', 'subsidiaryfk', 'bascurrencyfk', 'deviation']
						},
						{
							gid: 'entityHistory',
							isHistory: true
						}
					],
					overloads: {
						stadiumfk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('project.main.stadium'),
						businesspartnerfk: {
							navigator: {
								moduleName: 'businesspartner.main'
							},
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
						},
						bascurrencyfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
							dataServiceName: 'basicsCurrencyLookupDataService',
							enableCache: true,
							readonly: true
							// readonly: true
						}),
						subsidiaryfk: {
							detail: {
								type: 'directive',
								directive: 'business-partner-main-subsidiary-lookup',
								options: {
									initValueField: 'SubsidiaryAddress',
									filterKey: 'project-main-project-subsidiary-filter',
									showClearButton: true,
									displayMember: 'AddressLine'
								}
							},
							grid: {
								editor: 'lookup',
								editorOptions: {
									directive: 'business-partner-main-subsidiary-lookup',
									lookupOptions: {
										showClearButton: true,
										filterKey: 'project-main-project-subsidiary-filter',
										displayMember: 'AddressLine'
									}
								},
								width: 125,
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'Subsidiary',
									displayMember: 'AddressLine'
								}
							}
						},
						salefk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
							dataServiceName: 'projectSaleLookupDataService',
							additionalColumns: false,
							filter: function (item) {
								if (item) {
									return item.ProjectFk;
								}
								return 0;
							}
						})
					}
				};
			}

			var projectTenderResultDetailLayout = provideTenderResultLayout();

			var projectTenderResultAttributeDomains = platformSchemaService.getSchemaFromCache( { typeName: 'TenderResultDto', moduleSubModule: 'Project.Main'} );
			if(projectTenderResultAttributeDomains) {
				projectTenderResultAttributeDomains = projectTenderResultAttributeDomains.properties;
			}

			function TenderResultUIStandardService(layout, scheme, translateService) {
				BaseService.call(this, layout, scheme, translateService);
			}

			TenderResultUIStandardService.prototype = Object.create(BaseService.prototype);
			TenderResultUIStandardService.prototype.constructor = TenderResultUIStandardService;

			return new BaseService(projectTenderResultDetailLayout, projectTenderResultAttributeDomains, projectMainTranslationService);
		}
	]);
})();
