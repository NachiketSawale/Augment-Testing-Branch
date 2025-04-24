(function (angular) {
	'use strict';
	let moduleName = 'productionplanning.formulaconfiguration';

	angular.module(moduleName).service('ppsPlannedQuantityTypeService', PlannedQuantityTypeService);

	PlannedQuantityTypeService.$inject = ['basicsLookupdataConfigGenerator'];

	function PlannedQuantityTypeService(basicsLookupdataConfigGenerator) {
		let service = {};

		let characteristicConfig = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
			dataServiceName: 'ppsCommonCharacteristicSimpleLookupDataService',
			filter: function (entity) {
				return 61;
			}
		});

		let plannedQuantityTypeConfig =
			{
				Userdefined: 1,
				Material: 2,
				CostCode: 3,
				Property: 4,
				Characteristic: 5,
				FormulaParameter: 6,
				lookupInfo: {
					2: {
						column: 'MdcMaterialFk',
						lookup: {
							directive: 'basics-lookupdata-lookup-composite',
							options: {
								lookupDirective: 'basics-material-material-lookup',
								descriptionMember: 'DescriptionInfo.Translated'
							},
							formatterOptions: {
								lookupType: 'MaterialCommodity',
								displayMember: 'Code'
							}
						}
					},
					3: {
						column: 'MdcCostCodeFk',
						lookup: {
							directive: 'basics-lookupdata-lookup-composite',
							options: {
								lookupDirective: 'basics-cost-codes-lookup',
								descriptionMember: 'Code'
							},
							formatterOptions: {
								lookupType: 'costcode',
								displayMember: 'Code',
								version: 3,
							}
						}
					},
					4: {
						column: 'Property',
						lookup: {
							directive: 'basics-lookupdata-lookup-composite',
							options: {
								lookupDirective: 'pps-planned-quantity-property-lookup',
								descriptionMember: 'Translation'
							},
							formatterOptions: {
								lookupType: 'ProductDescriptionProperties',
								displayMember: 'Translation'
							}
						}
					},
					5: {
						column: 'CharacteristicFk',
						lookup: {
							directive: 'basics-lookupdata-lookup-composite',
							options: {
								lookupDirective: characteristicConfig.grid.editorOptions.lookupDirective,
								descriptionMember: 'DescriptionInfo.Description',
								grid: characteristicConfig.grid,
								lookupOptions: characteristicConfig.grid.editorOptions.lookupOptions
							},
							formatterOptions: characteristicConfig.grid.formatterOptions
						}
					}
				}
			};

		service.getPlannedQuantityTypeConfig = () => {
			return plannedQuantityTypeConfig;
		};

		return service;
	}
})(angular);