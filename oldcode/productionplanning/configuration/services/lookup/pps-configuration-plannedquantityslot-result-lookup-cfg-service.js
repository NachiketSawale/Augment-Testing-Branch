/**
 * Created by zwz on 9/26/2022.
 */

(function (angular) {
	'use strict';
	var moduleName = 'productionplanning.configuration';
	/**
	 * @ngdoc service
	 * @name productionplanningConfigurationResultLookupConfigService
	 * @function
	 *
	 * @description
	 * This service provides lookup config for field Result
	 */
	angular.module(moduleName).service('ppsConfigurationResultLookupConfigService', ResultLookupConfigService);

	ResultLookupConfigService.$inject = ['ppsConfigurationPlannedQuantityTypes', 'basicsLookupdataConfigGenerator'];
	function ResultLookupConfigService(plannedQuantityTypes, basicsLookupdataConfigGenerator) {

		this.provideResultLookupConfig = function () {
			let lookupOptions = {
				showClearButton: false,
				events: [
					{
						name: 'onSelectedItemChanged',
						handler: function (e, args) {
							args.entity.selectedResult = args.selectedItem;
						}
					}
				]
			};

			let overLoads = {
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
							lookupOptions: lookupOptions,
							directive: 'basics-material-material-lookup'
						},
						width: 100
					},
					detail: {
						type: 'directive',
						directive: 'basics-material-material-lookup',
						options: {
							lookupOptions: lookupOptions,
							lookupDirective: 'basics-material-material-lookup',
							descriptionMember: 'DescriptionInfo.Translated',
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
							lookupOptions: lookupOptions,
							directive: 'basics-cost-codes-lookup'
						}
					},
					detail: {
						type: 'directive',
						directive: 'basics-cost-codes-lookup',
						options: {
							lookupOptions: lookupOptions
						}
					}
				},
				'property': {
					grid: {
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'ProductDescriptionProperties',
							displayMember: 'Translation'
						},
						editor: 'lookup',
						editorOptions: {
							lookupField: 'Property',
							lookupOptions: {
								showClearButton: true
							},
							directive: 'pps-planned-quantity-property-lookup'
						}
					},
					detail: {
						type: 'directive',
						directive: 'pps-planned-quantity-property-lookup',
						options: {
							lookupOptions: {
								showClearButton: true
							}
						}
					}
				},
				characteristicfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
					dataServiceName: 'ppsCommonCharacteristicSimpleLookupDataService',
					filter: function (entity) {
						return 61;
					}
				})
			};

			let lookupInfo = {
				material: { lookup: createOptionsForLookup(overLoads, 'mdcmaterialfk'), column: 'Result' },
				costCode: { lookup: createOptionsForLookup(overLoads, 'mdccostcodefk'), column: 'Result' },
				property: { lookup: createOptionsForLookup(overLoads, 'property'), column: 'Result' },
				characteristic: { lookup: createOptionsForLookup(overLoads, 'characteristicfk'), column: 'Result' }
			};
			lookupInfo[plannedQuantityTypes.Material] = { lookup: createOptionsForLookup(overLoads, 'mdcmaterialfk'), column: 'Result' };
			lookupInfo[plannedQuantityTypes.CostCode] = { lookup: createOptionsForLookup(overLoads, 'mdccostcodefk'), column: 'Result' };
			lookupInfo[plannedQuantityTypes.Property] = { lookup: createOptionsForLookup(overLoads, 'property'), column: 'Result' };
			lookupInfo[plannedQuantityTypes.Characteristic] = { lookup: createOptionsForLookup(overLoads, 'characteristicfk'), column: 'Result' };

			function getLookupInfo(type) {
				let info;
				if (type === plannedQuantityTypes.Material) {
					info = lookupInfo.material;
				} else if (type === plannedQuantityTypes.CostCode) {
					info = lookupInfo.costCode;
				} else if (type === plannedQuantityTypes.Property) {
					info = lookupInfo.property;
				}else if (type === plannedQuantityTypes.Characteristic) {
					info = lookupInfo.characteristic;
				}

				if (info) {
					lookupInfo[type] = info;
				}

				return info;
			}

			function createOptionsForLookup(overLoads, propName) {
				let lookupGridCfg = overLoads[propName].grid;
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
						dependantField: 'PpsPlannedQuantityTypeFk',
						lookupInfo: lookupInfo,
						grid: false,
						dynamicLookupMode: true,
						showClearButton: false
					}
				},
				grid: {
					editor: 'dynamic',
					formatter: 'dynamic',
					domain: function (item, column, flag) {
						column.editorOptions = null;
						column.formatterOptions = null;
						let info = item.PpsPlannedQuantityTypeFk ? getLookupInfo(item.PpsPlannedQuantityTypeFk) : undefined;
						if (info) {
							column.editorOptions = {
								directive: 'pps-dynamic-grid-and-form-lookup',
								dependantField: 'PpsPlannedQuantityTypeFk',
								lookupInfo: lookupInfo,
								isTextEditable: false,
								dynamicLookupMode: true,
								grid: true,
								showClearButton: true
							};
							column.formatterOptions = info.lookup.formatterOptions;
							if (!column.formatterOptions) {
								let prop = info.lookup.options;
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
						}
						else if(item.PpsPlannedQuantityTypeFk === 6){
							return 'description';
						}
						else {
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
