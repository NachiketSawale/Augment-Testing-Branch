(function () {
	/*global angular*/
	'use strict';
	var moduleName = 'project.main';

	/**
	 * @ngdoc service
	 * @name projectPrj2BPContactConfigurationService
	 * @function
	 *
	 * @description
	 * This service provides standard layouts for different containers defined in project main module
	 */
	angular.module(moduleName).factory('projectPrj2BPContactConfigurationService',

		['platformUIStandardConfigService', 'projectMainTranslationService', 'basicsLookupdataConfigGenerator', 'platformSchemaService', 'basicsCommonComplexFormatter',
			'basicsCommonCommunicationFormatter',

			function (platformUIStandardConfigService, projectMainTranslationService, basicsLookupdataConfigGenerator, platformSchemaService, basicsCommonComplexFormatter,
				communicationFormatter) {

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
								attributes: ['contactfk', 'projectcontactroletypefk', 'firstname', 'familyname', 'remark', 'islive', 'subsidiaryfk', 'telephonenumberfk', 'telephonenumber2fk', 'telephonenumbermobilefk', 'email']
							},
							{
								gid: 'entityHistory',
								isHistory: true
							}
						],
						overloads: {
							email: {
								readonly: true,
								grid: {
									editor: 'directive',
									editorOptions: {
										directive: 'basics-common-email-input',
										dataServiceName: 'projectPrj2BPContactService'
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
									dataServiceName: 'projectPrj2BPContactService'
								}
							},
							firstname: {
								readonly: true
							},
							familyname: {
								readonly: true
							},
							contactfk: {
								mandatory: true,
								navigator: {
									moduleName: 'businesspartner.contact'
								},
								grid: {
									editor: 'lookup',
									editorOptions: {
										directive: 'business-partner-main-contact-dialog',
										lookupOptions: {
											filterKey: 'project-main-bizpartner-contact-filter',
											showClearButton: true
										}
									},
									formatter: 'lookup',
									formatterOptions: {
										lookupType: 'Contact',
										displayMember: 'FullName'
									},
									width: 100
								},
								detail: {
									type: 'directive',
									directive: 'business-partner-main-contact-dialog',
									options: {
										filterKey: 'project-main-bizpartner-contact-filter',
										showClearButton: true
									}
								}
							},
							projectcontactroletypefk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.projectcontractroletype'),
							subsidiaryfk: {
								readonly: true,
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
							},
							telephonenumber2fk: {
								readonly: true,
								detail: {
									type: 'directive',
									directive: 'basics-common-telephone-dialog',
									model: 'TelephoneNumber2',
									options: {
										readOnly: true,
										titleField: 'businesspartner.main.telephoneNumber2',
										foreignKey: 'TelephoneNumber2Fk',
										showClearButton: true
									}
								},
								grid: {
									editor: 'lookup',
									field: 'TelephoneNumber2',
									formatter: basicsCommonComplexFormatter,
									formatterOptions: {
										displayMember: 'Telephone',
										domainType: 'phone'
									}
								}
							},
							telephonenumbermobilefk: {
								readonly: true,
								detail: {
									type: 'directive',
									directive: 'basics-common-telephone-dialog',
									model: 'TelephoneNumberMobile',
									options: {
										readOnly: true,
										titleField: 'cloud.common.mobile',
										foreignKey: 'TelephoneNumberMobileFk',
										showClearButton: true
									}
								},
								grid: {
									editor: 'lookup',
									field: 'TelephoneNumberMobile',
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

				var projectGeneralAttributeDomains = platformSchemaService.getSchemaFromCache({
					typeName: 'Project2BusinessPartnerContactDto',
					moduleSubModule: 'Project.Main'
				});
				if (projectGeneralAttributeDomains) {
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
