/**
 * Created by chd on 3/1/2018.
 */

(function () {
	'use strict';
	var prcCommonModName = 'procurement.common';
	var contractModName = 'procurement.contract';
	var cloudCommonModule = 'cloud.common';
	// eslint-disable-next-line no-redeclare
	/* global angular */

	angular.module(contractModName).factory('procurementChangeOrderItemsLayout',
		['procurementCommonPrcItemDataService', 'procurementContextService', 'basicsCommonComplexFormatter',
			function (dataServiceFactory, moduleContext, basicsCommonComplexFormatter) {
				return {
					'fid': 'procurement.common.detail',
					'version': '1.0.0',
					'addValidationAutomatically': true,
					'showGrouping': true,
					'groups': [
						{
							'gid': 'basicData',
							'attributes': ['itemno', 'prcitemstatusfk', 'mdcmaterialfk', 'description1', 'quantity', 'address', 'newaddress']
						},
						{
							'gid': 'plantHire',
							'attributes': [
								'daterequired', 'newdaterequired'
							]
						}
					],
					'translationInfos': {
						'extraModules': [],
						'extraWords': {
							Itemno: {location: contractModName, identifier: 'prcItemItemNo', initial: 'prcItemItemNo'},
							PrcItemstatusFk: {
								location: cloudCommonModule,
								identifier: 'entityState',
								initial: 'entityState'
							},
							MdcMaterialFk: {
								location: prcCommonModName,
								identifier: 'prcItemMaterialNo',
								initial: 'prcItemMaterialNo'
							},
							Description1: {
								location: prcCommonModName,
								identifier: 'prcItemDescription1',
								initial: 'prcItemDescription1'
							},
							Quantity: {
								location: cloudCommonModule,
								identifier: 'entityQuantity',
								initial: 'entityQuantity'
							},
							Address: {
								location: prcCommonModName,
								identifier: 'prcItemDeliveryAddress',
								initial: 'prcItemDeliveryAddress'
							},
							NewAddress: {
								location: prcCommonModName,
								identifier: 'entityNewDeliveryAddress',
								initial: 'entityNewDeliveryAddress'
							},
							DateRequired: {
								location: cloudCommonModule,
								identifier: 'entityRequiredBy',
								initial: 'entityRequiredBy'
							},
							NewDateRequired: {
								location: cloudCommonModule,
								identifier: 'entityNewDateRequired',
								initial: 'entityNewDateRequired'
							},
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
						'prcitemstatusfk': {
							'detail': {
								'type': 'directive',
								'model': 'PrcItemstatusFk',
								'directive': 'procurement-common-prc-item-status-combobox',
								'options': {
									readOnly: true
								}
							},
							'grid': {
								editor: null,
								type: '',
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'PrcItemStatus',
									displayMember: 'DescriptionInfo.Translated',
									imageSelector: 'platformStatusIconService'
								},
								width: 100
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
						'description1': {
							'readonly': true,
							'mandatory': true
						},
						'quantity': {
							'readonly': true,
							'mandatory': true
						},
						'address': {
							'detail': {
								'type': 'directive',
								'directive': 'basics-common-address-dialog',
								'options': {
									titleField: 'procurement.common.prcItemDeliveryAddress',
									foreignKey: 'BasAddressFk'
								}
							},
							'grid': {
								editor: 'lookup',
								editorOptions: {
									lookupDirective: 'basics-common-address-dialog',
									lookupOptions: {
										foreignKey: 'BasAddressFk',
										titleField: 'cloud.common.entityDeliveryAddress'
									}
								},
								formatter: basicsCommonComplexFormatter,
								formatterOptions: {
									displayMember: 'AddressLine'
								},
								width: 150
							},
							'readonly': true,
						},
						'newaddress': {
							'detail': {
								'type': 'directive',
								'directive': 'basics-common-address-dialog',
								'options': {
									titleField: 'procurement.common.prcItemDeliveryAddress',
									foreignKey: 'BasAddressFk'
								}
							},
							'grid': {
								editor: 'lookup',
								editorOptions: {
									lookupDirective: 'basics-common-address-dialog',
									lookupOptions: {
										foreignKey: 'BasAddressFk',
										titleField: 'cloud.common.entityDeliveryAddress'
									}
								},
								formatter: basicsCommonComplexFormatter,
								formatterOptions: {
									displayMember: 'AddressLine'
								},
								width: 150
							}
						},
						'daterequired': {
							'readonly': true,
							'mandatory': true
						},
						'newdaterequired': {
							'mandatory': true
						}
					}
				};
			}
		]);

	angular.module(contractModName).factory('procurementChangeOrderItemsUIStandardService',
		['platformUIStandardConfigService', 'procurementCommonTranslationService',
			'procurementChangeOrderItemsLayout', 'platformSchemaService', 'platformUIStandardExtentService', 'procurementChangeOrderContextService',
			// eslint-disable-next-line no-unused-vars
			function (platformUIStandardConfigService, translationService, layout, platformSchemaService, platformUIStandardExtentService, moduleContext) { // jshint ignore:line

				/* var copyData = function (data) {
					return angular.element.extend(true, {}, data);
				}; */
				var BaseService = platformUIStandardConfigService;
				var domainSchema = platformSchemaService.getSchemaFromCache({
					typeName: 'PrcItemDto',
					moduleSubModule: 'Procurement.Common'
				});

				if (domainSchema) {
					domainSchema = domainSchema.properties;
					if(!domainSchema.NewAddress) {
						domainSchema.NewAddress={domain:'address',mandatory:true};
					}

					if(!domainSchema.NewDateRequired) {
						domainSchema.NewDateRequired={domain:'date',mandatory:true};
					}
				}

				function ItemsUIStandardService(layout, scheme, translateService) {
					BaseService.call(this, layout, scheme, translateService);
				}

				ItemsUIStandardService.prototype = Object.create(BaseService.prototype);
				ItemsUIStandardService.prototype.constructor = ItemsUIStandardService;

				return new BaseService(layout, domainSchema, translationService);
			}
		]);
})();
