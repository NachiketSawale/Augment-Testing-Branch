/**
 * Created by leo on 11.04.2018.
 */
(function () {
	'use strict';
	var moduleName = 'project.main';

	/**
	 * @ngdoc service
	 * @name projectMainCertificateConfigurationService
	 * @function
	 *
	 * @description
	 * This service provides standard layouts for certificate containers
	 */
	angular.module(moduleName).factory('projectMainCertificateConfigurationService',

		['platformUIStandardConfigService', 'projectMainTranslationService', 'basicsLookupdataConfigGenerator', 'platformSchemaService',

			function (platformUIStandardConfigService, projectMainTranslationService, basicsLookupdataConfigGenerator, platformSchemaService) {

				var BaseService = platformUIStandardConfigService;

				function provideCertificateLayout() {
					return {
						fid: 'project.certificate.detailform',
						version: '0.2.4',
						addValidationAutomatically: true,
						showGrouping: true,
						groups: [
							{
								gid: 'baseGroup',
								attributes: ['prcstructurefk', 'certificatetypefk', 'isrequired', 'ismandatory', 'isrequiredsub', 'ismandatorysub', 'commenttext']
							},
							{
								gid: 'entityHistory',
								isHistory: true
							}
						],
						overloads: {
							prcstructurefk: {
								navigator: {
									moduleName: 'basics.procurementstructure'
								},
								grid: {
									editor: 'lookup',
									editorOptions: {
										directive: 'basics-procurementstructure-structure-dialog',
										lookupOptions: {
											showClearButton: true
										}
									},
									formatter: 'lookup',
									formatterOptions: {
										lookupType: 'prcstructure',
										displayMember: 'Code'
									}
								},
								detail: {
									type: 'directive',
									directive: 'basics-lookupdata-lookup-composite',
									options: {
										lookupDirective: 'basics-procurementstructure-structure-dialog',
										descriptionField: 'StructureDescription',
										descriptionMember: 'DescriptionInfo.Translated',
										lookupOptions: {
											initValueField: 'StructureCode',
											showClearButton: true
										}
									}
								}
							},
							certificatetypefk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('businesspartner.main.certificatetype')
						}
					};
				}

				var projectCertificateDetailLayout = provideCertificateLayout();

				var projectCertificateAttributeDomains = platformSchemaService.getSchemaFromCache({
					typeName: 'Project2CertificateDto',
					moduleSubModule: 'Project.Main'
				});
				if (projectCertificateAttributeDomains) {
					projectCertificateAttributeDomains = projectCertificateAttributeDomains.properties;
				}

				function ClerkUIStandardService(layout, scheme, translateService) {
					BaseService.call(this, layout, scheme, translateService);
				}

				ClerkUIStandardService.prototype = Object.create(BaseService.prototype);
				ClerkUIStandardService.prototype.constructor = ClerkUIStandardService;

				return new BaseService(projectCertificateDetailLayout, projectCertificateAttributeDomains, projectMainTranslationService);
			}
		]);
})();
