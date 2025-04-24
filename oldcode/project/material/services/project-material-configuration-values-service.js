/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	/* global _ */
	'use strict';
	let moduleName = 'project.material';

	/**
	 * @ngdoc service
	 * @name projectMaterialConfigurationValuesService
	 * @function
	 *
	 * @description
	 * projectMaterialConfigurationValuesService is the config service for all project material's views.
	 */
	angular.module(moduleName).factory('projectMaterialConfigurationValuesService', [ '$injector', 'basicsLookupdataConfigGenerator', 'basicsMaterialRecordLayout',

		function ($injector, basicsLookupdataConfigGenerator, basicsMaterialRecordLayout) {
			let service = {},
				pricecondition = {
					'detail': {
						'type': 'directive',
						'directive': 'basics-Material-Price-Condition-Combobox',
						'options': {
							showClearButton: true,
							dataService: 'projectMaterialPriceConditionServiceNew'
						}
					},
					'grid': {
						editor: 'lookup',
						editorOptions: {
							lookupOptions: {
								showClearButton: true,
								dataService:'projectMaterialPriceConditionServiceNew'
							},
							directive: 'basics-Material-Price-Condition-Combobox'
						},
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'PrcPricecondition',
							displayMember: 'DescriptionInfo.Translated'
						}
					}
				},
				estcosttypefk = basicsLookupdataConfigGenerator.provideGenericLookupConfig('estimate.lookup.costtype', 'Description'),
				projectMaterialDetailLayout = {
					'fid': 'project.Material.detailform',
					'version': '1.0.0',
					'showGrouping': true,
					addValidationAutomatically: true,
					'groups': [
						{
							'gid': 'basicData',
							'attributes': ['basmaterial.code', 'basmaterial.descriptioninfo1', 'basmaterial.descriptioninfo2', 'uomfk', 'basmaterial.estcosttypefk', 'estcosttypefk', 'basmaterial.estimateprice', 'estimateprice', 'bascurrencyfk',
								'retailprice', 'listprice', 'discount', 'charges', 'cost', 'priceunit', 'basuompriceunitfk', 'priceextra', 'factorpriceunit', 'factorhour', 'prcpriceconditionfk', 'materialdiscountgroupfk', 'mdctaxcodefk', 'commenttext',
								'lgmjobfk', 'basmaterial.dayworkrate', 'dayworkrate', 'co2source', 'co2sourcefk', 'co2project','materialgroupfk','materialcatalogfk','prcstructurefk']
						},
						{
							'gid': 'entityHistory',
							'isHistory': true
						}
					],

					'overloads': {
						'lgmjobfk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
							dataServiceName: 'logisticJobLookupByProjectDataService',
							readonly: true,
							cacheEnable: true,
							additionalColumns: false,
							filter: function () {
								return  $injector.get('projectMainService').getIfSelectedIdElse(null);
							}
						}),
						'co2source':{
							readonly: true
						},
						'co2sourcefk': {
							readonly: true,
							'detail': {
								'type': 'directive',
								'directive': 'basics-lookupdata-source-name-lookup',
								'options': {
									version: 3
								}
							},
							'grid': {
								editor: 'lookup',
								editorOptions: {
									lookupDirective: 'basics-lookupdata-source-name-lookup'
								},
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'co2sourcename',
									displayMember: 'DescriptionInfo.Translated',
									version: 3
								}
							}
						},
						prcstructurefk: {
							'readonly': true,
							'grid': {
								'formatter': 'lookup',
								'formatterOptions': {
									'lookupType': 'Prcstructure',
									'displayMember': 'Code'
								},
								'editor': 'lookup',
								'editorOptions': {
									'directive': 'basics-procurementstructure-structure-dialog',
								},
								'width': 150
							},
							'detail': {
								'type': 'directive',
								'directive': 'basics-lookupdata-lookup-composite',
								'options': {
									'lookupDirective': 'basics-procurementstructure-structure-dialog',
									'descriptionMember': 'DescriptionInfo.Translated',
								}
							}
						},
						'materialcatalogfk': {
							'readonly': true,
							'detail': {
								'type': 'directive',
								'directive': 'basics-lookupdata-lookup-composite',
								'options': {
									lookupDirective: 'basics-material-material-catalog-lookup',
									descriptionMember: 'DescriptionInfo.Translated'
								}
							},
							'grid': {
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'MaterialCatalog',
									displayMember: 'Code'
								}
							}
						},
						'materialgroupfk': {
							readonly: true,
							'detail': {
								'type': 'directive',
								'directive': 'basics-lookupdata-lookup-composite',
								'options': {
									lookupDirective: 'basics-material-material-group-lookup',
									descriptionMember: 'DescriptionInfo.Translated'
								}
							},
							'grid': {
								editor: 'lookup',
								editorOptions: {
									lookupDirective: 'basics-material-material-group-lookup'
								},
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'MaterialGroup',
									displayMember: 'Code'
								}
							}
						}
					},
				addition: {
					grid: [{
						lookupDisplayColumn: true,
						field: 'PrcStructureFk',
						name$tr$: 'basics.material.record.prcStructureDescription',
						displayMember: 'DescriptionInfo.Translated',
						width: 150
					},{
						lookupDisplayColumn: true,
						field: 'MaterialCatalogFk',
						name$tr$: 'basics.material.record.materialCatalogDescription',
						displayMember: 'DescriptionInfo.Translated',
						width: 150
					},{
							lookupDisplayColumn: true,
							field: 'MaterialGroupFk',
							name$tr$: 'basics.material.record.materialGroupDescription',
							displayMember: 'DescriptionInfo.Translated',
							width: 150
						}]
				}
				};

			service.getProjectMaterialDetailLayout = function(){
				// basicsMaterialRecordLayout as reference
				let basicsMaterialLayoutLayoutOverloads = basicsMaterialRecordLayout.overloads;
				let basAttr = '';
				let editableAttrs = ['estimateprice', 'listprice', 'discount', 'charges', 'priceextra', 'prcpriceconditionfk', 'mdctaxcodefk', 'commenttext', 'estcosttypefk', 'factorhour', 'dayworkrate', 'priceunit', 'factorpriceunit', 'co2project' ];
				// add overloads from basicsMaterialRecordLayout
				_.each(projectMaterialDetailLayout.groups[0].attributes, function (attr) {

					basAttr = (attr.indexOf('basmaterial') >= 0) ? attr.split('.')[1] : attr;

					if (basicsMaterialLayoutLayoutOverloads[basAttr]) {
						projectMaterialDetailLayout.overloads[attr] = angular.copy(basicsMaterialLayoutLayoutOverloads[basAttr]);
					}
					projectMaterialDetailLayout.overloads[attr] = projectMaterialDetailLayout.overloads[attr] ? projectMaterialDetailLayout.overloads[attr]: {};
					projectMaterialDetailLayout.overloads[attr].readonly = (editableAttrs.indexOf(attr) === -1);

				});
				projectMaterialDetailLayout.overloads.prcpriceconditionfk = pricecondition;
				projectMaterialDetailLayout.overloads.estcosttypefk = estcosttypefk;

				return projectMaterialDetailLayout;
			};

			return service;
		}
	]);
})(angular);

