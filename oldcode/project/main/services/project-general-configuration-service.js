(function (angular) {
	'use strict';
	var moduleName = 'project.main';

	/**
	 * @ngdoc service
	 * @name projectMainGeneralConfigurationService
	 * @function
	 *
	 * @description
	 * This service provides standard layouts for different containers defined in project main module
	 */
	angular.module(moduleName).factory('projectMainGeneralConfigurationService',

		['platformUIStandardConfigService', 'projectMainTranslationService', 'basicsLookupdataConfigGenerator', 'platformSchemaService', 'basicsLookupdataLookupDescriptorService', '$translate',

			function (platformUIStandardConfigService, projectMainTranslationService, basicsLookupdataConfigGenerator, platformSchemaService, basicsLookupdataLookupDescriptorService, $translate) {

				var BaseService = platformUIStandardConfigService;

				function provideGeneralLayout() {
					return {
						fid: 'project.general.detailform',
						version: '0.2.4',
						addValidationAutomatically: true,
						showGrouping: true,
						groups: [
							{
								gid: 'baseGroup',
								attributes: ['generalstypefk', 'value', 'commenttext', 'valuetype']
							},
							{
								gid: 'entityHistory',
								isHistory: true
							}
						],
						overloads: {
							generalstypefk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('prc.common.generalstype'),
							valuetype: {
								readonly: true,
								grid: {
									formatter: 'lookup',
									formatterOptions: {
										lookupType: 'generalsvaluetype',
										displayMember: 'Description'
									}
								},
								'detail': {
									'type': 'directive',
									'directive': 'procurement-common-generals-value-type-combobox',
									'options': {
										descriptionMember: 'Description'
									}
								}
							}
						}
					};
				}

				var projectGeneralDetailLayout = provideGeneralLayout();

				var projectGeneralAttributeDomains = platformSchemaService.getSchemaFromCache({
					typeName: 'GeneralDto',
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
				basicsLookupdataLookupDescriptorService.attachData({
					generalsvaluetype: [{
						Id: 0, Name: 'amount', Description: $translate.instant('cloud.common.entityAmount')
					}, {
						Id: 1, Name: 'percent', Description: $translate.instant('cloud.common.entityPercent')
					}]
				});

				return new BaseService(projectGeneralDetailLayout, projectGeneralAttributeDomains, projectMainTranslationService);
			}
		]);
})(angular);
