/**
 Create by alm on 12/12/2019
 */
(function (angular) {
	'use strict';
	var moduleName = 'basics.material';
	angular.module(moduleName).factory('materialReferenceLayout',  [function () {
		return {
			'fid': 'material.Reference',
			version: '1.0.0',
			showGrouping: true,
			addValidationAutomatically: true,
			groups: [
				{
					'gid': 'basicData',
					'attributes': ['mdcmaterialcatalogfk', 'mdcmaterialaltfk', 'commenttext', 'userdefined1', 'userdefined2', 'userdefined3',
						'userdefined4', 'userdefined5']
				},
				{
					'gid': 'entityHistory',
					'isHistory': true
				}
			],
			translationInfos: {
				'extraModules': [moduleName, 'basics.materialcatalog', 'basics.common'],
				'extraWords': {
					MdcMaterialCatalogFk: {
						location: moduleName,
						identifier: 'record.materialCatalog',
						initial: 'Material Catalog'
					},
					MdcMaterialAltFk: {
						location: moduleName,
						identifier:'record.material',
						initial: 'Material'
					}
				}
			},
			'overloads': {
				'userdefined1': {
					grid: {
						regex: '^[\\s\\S]{0,252}$'
					},
					detail: {
						regex: '^[\\s\\S]{0,252}$'
					}
				},
				'userdefined2': {
					grid: {
						regex: '^[\\s\\S]{0,252}$'
					},
					detail: {
						regex: '^[\\s\\S]{0,252}$'
					}
				},
				'userdefined3': {
					grid: {
						regex: '^[\\s\\S]{0,252}$'
					},
					detail: {
						regex: '^[\\s\\S]{0,252}$'
					}
				},
				'userdefined4': {
					grid: {
						regex: '^[\\s\\S]{0,252}$'
					},
					detail: {
						regex: '^[\\s\\S]{0,252}$'
					}
				},
				'userdefined5': {
					grid: {
						regex: '^[\\s\\S]{0,252}$'
					},
					detail: {
						regex: '^[\\s\\S]{0,252}$'
					}
				},
				'mdcmaterialcatalogfk':{
					navigator : {
						moduleName: 'basics.materialcatalog'
					},
					'grid': {
						'formatter': 'lookup',
						'formatterOptions': {
							'lookupType': 'MaterialCatalog',
							'displayMember': 'Code'
						},
						'editor': 'lookup',
						'editorOptions': {
							'directive': 'basics-material-material-catalog-lookup',
							'lookupOptions': {
								'title': {name: 'Material Catalog', name$tr$: 'basics.material.materialCatalog'}
							}
						}

					},
					'detail': {
						'type': 'directive',
						'directive': 'basics-lookupdata-lookup-composite',
						'options': {
							'lookupDirective': 'basics-material-material-catalog-lookup',
							'descriptionMember': 'DescriptionInfo.Translated',
							'lookupOptions': {
								'title': {name: 'Material Catalog', name$tr$: 'basics.material.materialCatalog'}
							}
						}
					}
				},
				'mdcmaterialaltfk': {
					'detail': {
						'type': 'directive',
						'directive': 'basics-lookupdata-lookup-composite',
						'options': {
							'lookupDirective':'basics-material-material-lookup',
							'descriptionMember': 'DescriptionInfo.Translated',
							'lookupOptions': {
								'filterKey': 'basics-material-reference-material-filter'
							}
						}
					},
					'grid': {
						editor: 'lookup',
						editorOptions: {
							lookupOptions: {
								filterKey: 'basics-material-reference-material-filter'
							},
							directive: 'basics-material-material-lookup'
						},
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'MaterialCommodity',
							displayMember: 'Code'
						}
					}
				}
			},
			addition: {
				grid: [{
					lookupDisplayColumn: true,
					field: 'MdcMaterialCatalogFk',
					name$tr$: 'basics.material.record.materialCatalogDescription',
					displayMember: 'DescriptionInfo.Translated',
					width: 150
				},{
					lookupDisplayColumn: true,
					field: 'MdcMaterialAltFk',
					name$tr$: 'basics.material.record.materialDescription',
					displayMember: 'DescriptionInfo.Translated',
					width: 150
				}]
			}
		};
	}]);

	angular.module(moduleName).factory('basicsMaterialReferenceUIStandardService',
		['platformUIStandardConfigService', 'basicsMaterialTranslationService', 'materialReferenceLayout', 'platformSchemaService','platformUIStandardExtentService',
			function (platformUIStandardConfigService, translationService, layout, platformSchemaService,platformUIStandardExtentService) {
				var BaseService = platformUIStandardConfigService;
				var domainSchema = platformSchemaService.getSchemaFromCache({
					typeName: 'MdcMaterialReferenceDto',
					moduleSubModule: 'Basics.Material'
				});

				function UIStandardService(layout, scheme, translateService) {
					BaseService.call(this, layout, scheme, translateService);
				}

				UIStandardService.prototype = Object.create(BaseService.prototype);
				UIStandardService.prototype.constructor = UIStandardService;

				var service = new UIStandardService(layout, domainSchema.properties, translationService);
				platformUIStandardExtentService.extend(service, layout.addition);

				return service;
			}
		]);

})(angular);
