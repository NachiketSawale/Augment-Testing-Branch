/**
 * Created by Franck.li on 27/04/2017.
 */
(function () {
	'use strict';
	const modName = 'basics.common';
	const cloudCommonModule = 'cloud.common';

	angular.module(modName).factory('basicsCommonPoChangeItemsLayout',
		[
			function () {
				return {
					'fid': 'procurement.common.detail',
					'version': '1.0.0',
					'addValidationAutomatically': true,
					'showGrouping': true,
					'groups': [
						{
							'gid': 'basicData',
							'attributes': ['itemno', 'mdcmaterialfk', 'quantity', 'newquantity']
						}
					],
					'translationInfos': {
						'extraModules': [],
						'extraWords': {
							Itemno: {location: modName, identifier: 'prcItemItemNo', initial: 'prcItemItemNo'},
							MdcMaterialFk: {
								location: modName,
								identifier: 'prcItemMaterialNo',
								initial: 'prcItemMaterialNo'
							},
							Quantity: {
								location: cloudCommonModule,
								identifier: 'entityQuantity',
								initial: 'entityQuantity'
							},
							NewQuantity: {
								location: cloudCommonModule,
								identifier: 'entityNewQuantity',
								initial: 'entityNewQuantity'
							}
						}
					},
					'overloads': {
						'itemno': {
							'mandatory': true,
							'readonly': true,
							'detail': {
								'type': 'directive',
								'model': 'Itemno',
								'directive': 'basics-common-limit-input',
								'options': {
									validKeys: {
										regular: '^[1-9]{1}[0-9]{0,7}$'
									},
									isCodeProperty: true
								}
							},
							'grid': {
								formatter: 'code',
								editor: 'directive',
								editorOptions: {
									directive: 'basics-common-limit-input',
									validKeys: {
										regular: '^[1-9]{1}[0-9]{0,7}$'
									},
									isCodeProperty: true
								}
							}
						},
						'mdcmaterialfk': {
							'readonly': true,
							'detail': {
								'type': 'directive',
								'directive': 'basics-material-material-lookup',
								'options': {
									filterKey: 'procurement-common-item-mdcmaterial-filter',
									showClearButton: true
								}
							},
							'grid': {
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'MaterialCommodity',
									displayMember: 'Code'
								},
								editor: 'lookup',
								editorOptions: {
									lookupOptions: {
										filterKey: 'procurement-common-item-mdcmaterial-filter',
										showClearButton: true
									},
									directive: 'basics-material-material-lookup'
								},
								width: 137
							}
						},
						'quantity': {
							'readonly': true,
							'mandatory': true
						},
						'newquantity': {
							'mandatory': true,
							'readonly': false,
							'detail': {
								'type': 'directive',
								'directive': 'purchase-Order-Change-Items-Quantity',
								'model': 'NewQuantity'
							},
							'grid': {
								formatter: 'quantity',
								editor: 'directive',
								editorOptions: {
									directive: 'purchase-Order-Change-Items-Quantity'
								},
								minWidth: 145
							}
						}
					}
				};
			}
		]);

	angular.module(modName).factory('basicsCommonPoChangeItemsUIStandardService',
		['platformUIStandardConfigService', 'procurementCommonTranslationService',
			'basicsCommonPoChangeItemsLayout', 'platformSchemaService', 'platformUIStandardExtentService', 'procurementContextService', '_',
			function (platformUIStandardConfigService, translationService, layout, platformSchemaService, platformUIStandardExtentService, moduleContext, _) { // jshint ignore:line

				const copyData = function (data) {
					return angular.element.extend(true, {}, data);
				};
				const BaseService = platformUIStandardConfigService;

				let domainSchema = platformSchemaService.getSchemaFromCache({
					typeName: 'PrcItemDto',
					moduleSubModule: 'Procurement.Common'
				});
				if (domainSchema) {
					domainSchema = domainSchema.properties;
					if (!domainSchema.NewQuantity)
						domainSchema.NewQuantity = {domain: 'quantity', mandatory: false};
				}

				function UIStandardService(layout, scheme, translateService) {
					if (!scheme.newquantity)
						scheme.newquantity = 0;
					BaseService.call(this, layout, scheme, translateService);
				}

				UIStandardService.prototype = Object.create(BaseService.prototype);
				UIStandardService.prototype.constructor = UIStandardService;

				const service = new BaseService(layout, domainSchema, translationService);

				const $grids = service.getStandardConfigForListView();

				service.getStandardConfigForListView = function (moduleName) {
					const grids = copyData($grids);
					moduleName = moduleName || moduleContext.getModuleName();

					if (moduleName === 'procurement.quote' && !_.some(grids.columns, function (i) {
						return i.id === 'itemEvaluationFk';
					})) {
						grids.columns.push({
							id: 'itemEvaluationFk',
							field: 'PrcItemEvaluationFk',
							name: 'Item Evaluation',
							name$tr$: 'cloud.common.entityItemEvaluation',
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'PrcItemEvaluation',
								displayMember: 'DescriptionInfo.Translated'
							},
							editor: 'lookup',
							editorOptions: {
								lookupOptions: {
									showClearButton: true
								},
								directive: 'procurement-common-prc-item-evaluation-combobox'
							},
							width: 100
						});
					}
					return grids;
				};

				return service;
			}
		]);
})();
