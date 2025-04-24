/**
 * Created by Frank Baedeker on 14.01.2015.
 */
(function () {
	'use strict';
	var moduleName = 'project.main';

	/**
	 * @ngdoc service
	 * @name projectMainClerkConfigurationService
	 * @function
	 *
	 * @description
	 * This service provides standard layouts for different containers defined in project main module
	 */
	angular.module(moduleName).factory('projectMainClerkConfigurationService',

		['platformLayoutHelperService', 'platformUIStandardConfigService', 'projectMainTranslationService', 'basicsLookupdataConfigGenerator',
			'platformSchemaService', 'basicsCommonComplexFormatter',

			function (platformLayoutHelperService, platformUIStandardConfigService, projectMainTranslationService, basicsLookupdataConfigGenerator,
				platformSchemaService, basicsCommonComplexFormatter) {

				var BaseService = platformUIStandardConfigService;

				function provideClerkLayout() {
					return {
						fid: 'project.clerk.detailform',
						version: '0.2.4',
						addValidationAutomatically: true,
						showGrouping: true,
						groups: [
							{
								gid: 'baseGroup',
								attributes: ['comment', 'clerkrolefk', 'clerkfk', 'validfrom', 'validto', 'countryfk', 'addressfk',
									'telephonenumberfk', 'telephonetelefaxfk', 'telephonemobilfk', 'telephoneprivatfk',
									'telephoneprivatmobilfk', 'email']
							},
							{
								gid: 'entityHistory',
								isHistory: true
							}
						],
						overloads: {
							comment: { requiredInErrorHandling: true },
							clerkrolefk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
								dataServiceName: 'basicsCustomClerkRoleLookupDataService',
								enableCache: true,
								filterKey: 'project-clerk-role-by-is-for-project-filter'
							}, {
								requiredInErrorHandling: true
							}),
							clerkfk: platformLayoutHelperService.provideClerkLookupOverload(true, 'ClerkFk', 'basics-clerk-by-company-filter'),
							countryfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
								dataServiceName: 'basicsCountryLookupDataService',
								enableCache: true
							}),
							addressfk: {
								detail: {
									type: 'directive',
									directive: 'basics-common-address-dialog',
									model: 'Address',
									options: {
										titleField: 'cloud.common.address',
										foreignKey: 'AddressFk',
										showClearButton: true
									}
								},
								grid: {
									editor: 'lookup',
									editorOptions: {
										lookupDirective: 'basics-common-address-dialog',
										lookupOptions: {
											foreignKey: 'AddressFk',
											titleField: 'cloud.common.address'
										}
									},
									formatter: 'description',
									field: 'Address',
									formatterOptions: {
										displayMember: 'Street'
									}
								}
							},
							telephonenumberfk: {
								detail: {
									type: 'directive',
									directive: 'basics-common-telephone-dialog',
									model: 'TelephoneNumber',
									options: {
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
							telephonetelefaxfk: {
								detail: {
									type: 'directive',
									directive: 'basics-common-telephone-dialog',
									model: 'TelephoneNumberTelefax',
									options: {
										titleField: 'cloud.common.fax',
										foreignKey: 'TelephoneTelefaxFk',
										showClearButton: true
									}
								},
								grid: {
									editor: 'lookup',
									field: 'TelephoneNumberTelefax',
									editorOptions: {
										lookupDirective: 'basics-common-telephone-dialog',
										lookupOptions: {
											foreignKey: 'TelephoneTelefaxFk',
											titleField: 'cloud.common.fax'
										}
									},
									formatter: basicsCommonComplexFormatter,
									formatterOptions: {
										displayMember: 'Telephone',
										domainType: 'phone'
									}
								}
							},
							telephonemobilfk: {
								detail: {
									type: 'directive',
									directive: 'basics-common-telephone-dialog',
									model: 'TelephoneMobil',
									options: {
										titleField: 'cloud.common.mobile',
										foreignKey: 'TelephoneMobilFk',
										showClearButton: true
									}
								},
								grid: {
									editor: 'lookup',
									field: 'TelephoneMobil',
									editorOptions: {
										lookupDirective: 'basics-common-telephone-dialog',
										lookupOptions: {
											foreignKey: 'TelephoneMobilFk',
											titleField: 'cloud.common.mobile'
										}
									},
									formatter: basicsCommonComplexFormatter,
									formatterOptions: {
										displayMember: 'Telephone',
										domainType: 'phone'
									}
								}
							},
							telephoneprivatfk: {
								detail: {
									type: 'directive',
									directive: 'basics-common-telephone-dialog',
									model: 'TelephonePrivat',
									options: {
										titleField: 'cloud.common.telephonePrivat',
										foreignKey: 'TelephonePrivatFk',
										showClearButton: true
									}
								},
								grid: {
									editor: 'lookup',
									field: 'TelephonePrivat',
									editorOptions: {
										lookupDirective: 'basics-common-telephone-dialog',
										lookupOptions: {
											foreignKey: 'TelephonePrivatFk',
											titleField: 'cloud.common.telephonePrivat'
										}
									},
									formatter: basicsCommonComplexFormatter,
									formatterOptions: {
										displayMember: 'Telephone',
										domainType: 'phone'
									}
								}
							},
							telephoneprivatmobilfk: {
								detail: {
									type: 'directive',
									directive: 'basics-common-telephone-dialog',
									model: 'TelephonePrivatMobil',
									options: {
										titleField: 'cloud.common.privatMobil',
										foreignKey: 'TelephonePrivatMobilFk',
										showClearButton: true
									}
								},
								'grid': {
									editor: 'lookup',
									field: 'TelephonePrivatMobil',
									editorOptions: {
										lookupDirective: 'basics-common-telephone-dialog',
										lookupOptions: {
											foreignKey: 'TelephonePrivatMobilFk',
											titleField: 'cloud.common.privatMobil'
										}
									},
									formatter: basicsCommonComplexFormatter,
									formatterOptions: {
										displayMember: 'Telephone',
										domainType: 'phone'
									}
								}
							},
						}
					};
				}

				var projectClerkDetailLayout = provideClerkLayout();

				var projectClerkAttributeDomains = platformSchemaService.getSchemaFromCache( { typeName: 'Project2ClerkDto', moduleSubModule: 'Project.Main'} );
				if(projectClerkAttributeDomains) {
					projectClerkAttributeDomains = projectClerkAttributeDomains.properties;
				}

				function ClerkUIStandardService(layout, scheme, translateService) {
					BaseService.call(this, layout, scheme, translateService);
				}

				ClerkUIStandardService.prototype = Object.create(BaseService.prototype);
				ClerkUIStandardService.prototype.constructor = ClerkUIStandardService;

				return new BaseService(projectClerkDetailLayout, projectClerkAttributeDomains, projectMainTranslationService);
			}
		]);
})();
