(function () {
	'use strict';
	var moduleName = 'object.project';

	/**
	 * @ngdoc service
	 * @name objectProjectHeaderUIStandardService
	 * @function
	 *
	 * @description
	 * This service provides standard layots for different containers of header entities
	 */
	angular.module(moduleName).factory('objectProjectHeaderUIStandardService',
		['platformUIStandardConfigService', '$injector', 'objectProjectTranslationService', 'platformSchemaService','basicsLookupdataConfigGenerator','basicsCommonComplexFormatter',

			function (platformUIStandardConfigService, $injector, objectProjectTranslationService, platformSchemaService, basicsLookupdataConfigGenerator, basicsCommonComplexFormatter) {

				function createMainDetailLayout() {
					return {

						fid: 'object.project.headerdetailform',
						version: '1.0.0',
						addValidationAutomatically: true,
						showGrouping: true,
						groups: [
							{
								gid: 'baseGroup',
								attributes: ['code', 'description', 'projectfk', 'pricelistfk', 'objecttypefk', 'remark01', 'remark02', 'installmentagreementfk', 'requestedinstallment', 'addressfk']
							},
							{
								gid: 'entityHistory',
								'isHistory': true
							}
						],
						overloads: {
							code: {
								navigator: {
									moduleName: 'object.main',
									registerService: 'objectMainUnitService',
									targetIdProperty: 'Id'
								}
							},
							projectfk: {
								grid: {
									editor: 'lookup',
									editorOptions: {
										directive: 'basics-lookup-data-project-project-dialog',
										lookupOptions: {
											showClearButton: true
										}
									},
									formatter: 'lookup',
									formatterOptions: {
										lookupType: 'project',
										displayMember: 'ProjectNo'
									}
								},
								detail: {
									type: 'directive',
									directive: 'basics-lookupdata-lookup-composite',
									options: {
										lookupDirective: 'basics-lookup-data-project-project-dialog',
										descriptionMember: 'ProjectName',
										lookupOptions: {
											showClearButton: true
										}
									}
								},
								readonly: true
							},
							pricelistfk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.objectpricelist'),
							objecttypefk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.objecttype'),
							addressfk: {
								detail: {
									type: 'directive',
									directive: 'basics-common-address-dialog',
									model: 'AddressDto',
									options: {
										titleField: 'cloud.common.entityAddress',
										foreignKey: 'AddressFk',
										showClearButton: true
									}
								},
								grid: {
									editor: 'lookup',
									field: 'AddressDto',
									editorOptions: {
										lookupDirective: 'basics-common-address-dialog',
										'lookupOptions': {
											foreignKey: 'AddressFk',
											titleField: 'cloud.common.entityAddress'
										}
									},
									formatter: basicsCommonComplexFormatter,
									formatterOptions: {
										displayMember: 'AddressLine'
									}
								}
							},
							installmentagreementfk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.installmentagreement'),
							originfilename: { readonly: true }

						}
					};
				}

				var projectDetailLayout = createMainDetailLayout();

				var BaseService = platformUIStandardConfigService;

				var projectAttributeDomains = platformSchemaService.getSchemaFromCache({
					typeName: 'HeaderDto',
					moduleSubModule: 'Object.Project'
				});
				projectAttributeDomains = projectAttributeDomains.properties;


				function ProjectUIStandardService(layout, scheme, translateService) {
					BaseService.call(this, layout, scheme, translateService);
				}

				ProjectUIStandardService.prototype = Object.create(BaseService.prototype);
				ProjectUIStandardService.prototype.constructor = ProjectUIStandardService;

				return new BaseService(projectDetailLayout, projectAttributeDomains, objectProjectTranslationService);
			}
		]);
})();
