/**
 * Created by lvy on 5/15/2019.
 */
(function () {
	'use strict';
	var moduleName = 'basics.materialcatalog';
	var cloudCommonModule = 'cloud.common';

	angular.module(moduleName).factory('basicsMaterialCatalogToCompaniesLayoutService', [

		function () {

			return {

				'fid': 'basics.materialcatalog.tocompanys.layout',
				'version': '1.0.0',
				'showGrouping': true,
				'groups': [
					{
						'gid': 'basicData',
						'attributes': ['isowner', 'canedit', 'canlookup']
					}
				],
				'translationInfos': {
					'extraModules': [moduleName, cloudCommonModule],
					'extraWords': {
						BasCompanyFk: {location: cloudCommonModule, identifier: 'entityCompany', initial: 'Company'},
						IsOwner: {location: moduleName, identifier: 'isOwner', initial: 'Is Owner'},
						CanEdit: {location: moduleName, identifier: 'canEdit', initial: 'Can Edit'},
						CanLookup: {location: moduleName, identifier: 'canLookup', initial: 'Can Lookup'}
					}
				},
				'overloads': {
				},
				'addition': {
					grid: [
						{
							'formatter': 'text',
							'field': 'CompanyName',
							'model': 'CompanyName',
							'name': 'Company Name',
							'name$tr$': 'cloud.common.entityCompanyName',
							'width': 150,
							'readonly': true
						},
						{
							'formatter': 'text',
							'field': 'CompanyCode',
							'model': 'CompanyCode',
							'name': 'Code',
							'name$tr$': 'cloud.common.entityCode',
							'width': 150,
							'readonly': true
						}
					],
					detail: [
						{
							'gid': 'basicData',
							'rid': 'CompanyName',
							'id': 'CompanyName',
							'label': 'Company Name',
							'label$tr$': 'cloud.common.entityCompanyName',
							'type': 'text',
							'readonly': true,
							'model': 'CompanyName'
						}
					]
				}
			};

		}]);

	angular.module(moduleName).factory('basicsMaterialCatalogToCompaniesUIStandardService', ['platformUIStandardConfigService', 'basicsMaterialCatalogToCompaniesLayoutService', 'basicsMaterialcatalogTranslationService', 'platformSchemaService', 'platformUIStandardExtentService',

		function (UIStandardConfigService, layoutService, translationService, platformSchemaService, platformUIStandardExtentService) {
			var domainSchema = platformSchemaService.getSchemaFromCache({ typeName: 'MdcMaterialCatCompanyDto', moduleSubModule: 'Basics.MaterialCatalog'});
			var service = new UIStandardConfigService(layoutService, domainSchema.properties, translationService);

			platformUIStandardExtentService.extend(service, layoutService.addition, domainSchema.properties);

			return service;

		}
	]);
})();