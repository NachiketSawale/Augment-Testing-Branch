/**
 * Created by zwz on 12/23/2020.
 */

(function (angular) {
	'use strict';
	var moduleName = 'productionplanning.product';
	/**
	 * @ngdoc service
	 * @name productionplanningProductEngProdComponentMdcMaterialCostCodeFkLookupConfigService
	 * @function
	 *
	 * @description
	 * This service provides lookup config for field MdcMaterialCostCodeFk
	 */
	angular.module(moduleName).service('productionplanningProductEngProdComponentMdcMaterialCostCodeFkLookupConfigService', MdcMaterialCostCodeFkLookupConfigService);

	MdcMaterialCostCodeFkLookupConfigService.$inject = ['drawingComponentTypes'];
	function MdcMaterialCostCodeFkLookupConfigService(drawingComponentTypes) {

		this.provideMdcMaterialCostCodeFkLookupConfig = function () {
			var mcOverLoads = {
				'mdcmaterialfk': {
					navigator: {
						moduleName: 'basics.material'
					},
					grid: {
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'MaterialCommodity',
							displayMember: 'Code'
						},
						editor: 'lookup',
						editorOptions: {
							lookupOptions: {
								showClearButton: true
							},
							directive: 'basics-material-material-lookup'
						},
						width: 100
					},
					detail: {
						type: 'directive',
						directive: 'basics-material-material-lookup',
						options: {
							lookupOptions: {
								showClearButton: true
							},
							lookupDirective: 'basics-material-material-lookup',
							descriptionMember: 'DescriptionInfo.Translated'
						}
					}
				},
				'mdccostcodefk': {
					grid: {
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'costcode',
							displayMember: 'Code',
							version: 3
						},
						editor: 'lookup',
						editorOptions: {
							lookupField: 'CostCodeFk',
							lookupOptions: {
								showClearButton: true
							},
							directive: 'basics-cost-codes-lookup'
						}
					},
					detail: {
						type: 'directive',
						directive: 'basics-cost-codes-lookup',
						options: {
							lookupOptions: {
								showClearButton: true
							}
						}
					}
				},
				'ppsproductoriginfk': {
					grid: {
						formatter: 'lookup',
						formatterOptions: {
							version: 3,
							lookupType: 'CommonProduct',
							displayMember: 'Code'
						},
						editor: 'lookup',
						editorOptions: {
							lookupField: 'PpsProductOriginFk',
							lookupOptions: {
								showClearButton: true
							},
							directive: 'productionplanning-common-product-lookup-new'
						}
					},
					detail: {
						type: 'directive',
						directive: 'productionplanning-common-product-lookup-new',
						version: 3,
						options: {
							lookupOptions: {
								showClearButton: true
							}
						}
					}
				}
			};

			var mcLookupInfo = {
				material: { lookup: createOptionsForMCLookup(mcOverLoads, 'mdcmaterialfk'), column: 'MdcMaterialCostCodeProductFk' },
				costCode: { lookup: createOptionsForMCLookup(mcOverLoads, 'mdccostcodefk'), column: 'MdcMaterialCostCodeProductFk' },
				product: { lookup: createOptionsForMCLookup(mcOverLoads, 'ppsproductoriginfk'), column: 'MdcMaterialCostCodeProductFk' }
			};
			mcLookupInfo[drawingComponentTypes.Material] = { lookup: createOptionsForMCLookup(mcOverLoads, 'mdcmaterialfk'), column: 'MdcMaterialCostCodeProductFk' };
			mcLookupInfo[drawingComponentTypes.CostCode] = { lookup: createOptionsForMCLookup(mcOverLoads, 'mdccostcodefk'), column: 'MdcMaterialCostCodeProductFk' };
			mcLookupInfo[drawingComponentTypes.Product] = { lookup: createOptionsForMCLookup(mcOverLoads, 'ppsproductoriginfk'), column: 'MdcMaterialCostCodeProductFk' };

			function getMCLookupInfo(componentType) {
				var info;
				if (componentType === drawingComponentTypes.Material) {
					info = mcLookupInfo.material;
				} else if (componentType === drawingComponentTypes.CostCode) {
					info = mcLookupInfo.costCode;
				} else if (componentType === drawingComponentTypes.Product) {
					info = mcLookupInfo.product;
				}

				if (info) {
					mcLookupInfo[componentType] = info;
				}

				return info;
			}

			function createOptionsForMCLookup(overLoads, propName) {
				var lookupGridCfg = overLoads[propName].grid;
				return {
					directive: lookupGridCfg.editorOptions.lookupDirective || lookupGridCfg.editorOptions.directive,
					options: lookupGridCfg.editorOptions.lookupOptions,
					formatter: lookupGridCfg.formatter,
					formatterOptions: lookupGridCfg.formatterOptions
				};
			}

			return {
				detail: {
					type: 'directive',
					directive: 'pps-dynamic-grid-and-form-lookup',
					options: {
						isTextEditable: false,
						dependantField: 'EngDrwCompTypeFk',
						lookupInfo: mcLookupInfo,
						grid: false,
						dynamicLookupMode: true,
						showClearButton: false
					}
				},
				grid: {
					editor: 'dynamic',
					formatter: 'dynamic',
					domain: function (item, column, flag) {
						var info = item.EngDrwCompTypeFk ? getMCLookupInfo(item.EngDrwCompTypeFk) : undefined;
						if (info) {
							column.editorOptions = {
								directive: 'pps-dynamic-grid-and-form-lookup',
								dependantField: 'EngDrwCompTypeFk',
								lookupInfo: mcLookupInfo,
								isTextEditable: false,
								dynamicLookupMode: true,
								grid: true,
								showClearButton: true
							};
							column.formatterOptions = info.lookup.formatterOptions;
							if (!column.formatterOptions) {
								var prop = info.lookup.options;
								column.formatterOptions = {
									lookupSimpleLookup: prop.lookupSimpleLookup,
									lookupModuleQualifier: prop.lookupModuleQualifier,
									lookupType: prop.lookupType,
									valueMember: 'Id',
									displayMember: prop.displayMember,
									dataServiceName: prop.dataServiceName,
									version: prop.version,
									imageSelector: prop.imageSelector
								};
							}
						} else {
							column.editorOptions = { readonly: true };
							column.formatterOptions = null;
						}

						return flag ? 'directive' : 'lookup';
					}
				}
			};
		};

	}
})(angular);
