
(function () {
	/*global angular*/
	'use strict';
	var moduleName = 'project.main';

	/**
	 * @ngdoc service
	 * @name projectPrj2BPConfigurationService
	 * @function
	 *
	 * @description
	 * This service provides standard layouts for different containers defined in project main module
	 */
	angular.module(moduleName).factory('projectPrj2BPConfigurationService',

		['platformUIStandardConfigService', 'projectMainTranslationService', 'basicsLookupdataConfigGenerator', 'platformSchemaService',
			'basicsCommonComplexFormatter', 'basicsCommonCommunicationFormatter', function (platformUIStandardConfigService,
				projectMainTranslationService, basicsLookupdataConfigGenerator, platformSchemaService,
				basicsCommonComplexFormatter, communicationFormatter) {

				var BaseService = platformUIStandardConfigService;

				function provideGeneralLayout() {
					return {
						fid: 'project.businesspartner.detailform',
						version: '0.2.4',
						addValidationAutomatically: true,
						showGrouping: true,
						groups: [
							{
								gid: 'baseGroup',
								attributes: [ 'rolefk', 'businesspartnerfk', 'subsidiaryfk', 'remark', 'islive', 'telephonenumberfk', 'email' ]
							},
							{
								gid: 'entityHistory',
								isHistory: true
							}
						],
						overloads: {
							rolefk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('project.prj2bp.role'),
							businesspartnerfk: {
								'navigator': {
									moduleName: 'businesspartner.main',
									registerService: 'businesspartnerMainHeaderDataService'
								},
								detail: {
									type: 'directive',
									directive: 'business-partner-main-business-partner-dialog',
									options: {
										initValueField: 'BusinesspartnerBpName1',
										showClearButton: true,
										'mainService':'projectPrj2BPService',
										'BusinessPartnerField':'BusinesspartnerFk',
										'SubsidiaryField':'SubsidiaryFk'
									}
								},
								grid: {
									editor: 'lookup',
									editorOptions: {
										directive: 'business-partner-main-business-partner-dialog',
										'lookupOptions': {
											'mainService':'projectPrj2BPService',
											'BusinessPartnerField':'BusinesspartnerFk',
											'SubsidiaryField':'SubsidiaryFk'
										}
									},
									formatter: 'lookup',
									formatterOptions: {
										lookupType: 'BusinessPartner',
										displayMember: 'BusinessPartnerName1'
									}
								}
							},
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
							email: {
								readonly: true,
								grid: {
									editor: 'directive',
									editorOptions: {
										directive: 'basics-common-email-input',
										dataServiceName: 'projectPrj2BPService'
									},
									formatter: communicationFormatter,
									formatterOptions: {
										domainType: 'email'
									},
									width: 150
								},
								detail: {
									type: 'directive',
									directive: 'basics-common-email-input',
									dataServiceName: 'projectPrj2BPService'
								}
							},
							telephonenumberfk: {
								readonly: true,
								detail: {
									type: 'directive',
									directive: 'basics-common-telephone-dialog',
									model: 'TelephoneNumber',
									options: {
										readOnly: true,
										titleField: 'cloud.common.TelephoneDialogPhoneNumber',
										foreignKey: 'TelephoneNumberFk',
										showClearButton: true
									}
								}, grid: {
									editor: 'lookup',
									field: 'TelephoneNumber',
									editorOptions: {
										lookupDirective: 'basics-common-telephone-dialog',
										lookupOptions: {
											foreignKey: 'TelephoneNumberFk',
											titleField: 'cloud.common.TelephoneDialogPhoneNumber'
										}
									},
									formatter: basicsCommonComplexFormatter,
									formatterOptions: {
										displayMember: 'Telephone',
										domainType: 'phone'
									}
								}
							}
						}
					};
				}

				var projectGeneralDetailLayout = provideGeneralLayout();

				var projectGeneralAttributeDomains = platformSchemaService.getSchemaFromCache( { typeName: 'Project2BusinessPartnerDto', moduleSubModule: 'Project.Main'} );
				if(projectGeneralAttributeDomains) {
					projectGeneralAttributeDomains = projectGeneralAttributeDomains.properties;
				}

				function GeneralUIStandardService(layout, scheme, translateService) {
					BaseService.call(this, layout, scheme, translateService);
				}

				GeneralUIStandardService.prototype = Object.create(BaseService.prototype);
				GeneralUIStandardService.prototype.constructor = GeneralUIStandardService;

				return new BaseService(projectGeneralDetailLayout, projectGeneralAttributeDomains, projectMainTranslationService);
			}
		]);
})();
