/**
 * Created by baf on 27.09.2018
 */

(function (angular) {
	'use strict';
	var moduleName = 'resource.common';

	/**
	 * @ngdoc service
	 * @name resourceCommonLayoutHelperService
	 * @description provides methods for easily building user interface layouts
	 */
	angular.module(moduleName).service('resourceCommonLayoutHelperService', ResourceCommonLayoutHelperService);

	ResourceCommonLayoutHelperService.$inject = ['_', 'basicsLookupdataConfigGenerator'];

	function ResourceCommonLayoutHelperService(_, basicsLookupdataConfigGenerator) {
		this.provideControllingUnitOverload = function provideControllingUnitOverload(showClear, filter) {
			var ovl = basicsLookupdataConfigGenerator.provideElaboratedLookupConfig('controlling-structure-dialog-lookup', 'controllingunit', 'Code', showClear, null, null, filter);
			return ovl;
		};

		this.providePlantCatalogOverload = function providePlantCatalogOverload() {
			return basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
				dataServiceName: 'resourceCatalogLookupDataService'
			});
		};

		this.providePlantCatalogRecordOverload = function providePlantCatalogRecordOverload() {
			let conf = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
				dataServiceName: 'resourceCatalogDetailLookupDataService',
				filter: function (item) {
					return item;
				}
			});
			conf.grid.formatter = function (row, cell, value, model, item) {
				if(model.id === 'catalogrecordfkdescription') {
					return item.CatalogRecordDescription;
				}
				else if(model.id === 'catalogrecordfk') {
					return item.CatalogRecordCode;
				}
				else{
					return value;
				}
			};
			return conf;
		};

		this.providePlantGroupOverload = function providePlantGroupOverload() {
			return basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
				dataServiceName: 'resourceEquipmentGroupLookupDataService'
			});
		};

		this.providePricePortionFormGroup = function providePricePortionFormGroup(portions, preFix, interFix) {
			preFix = preFix || 'priceportion';
			interFix = interFix || '';

			var res = {
				gid: 'groupEntityPricePortions',
				attributes: []
			};

			_.times(portions, function(portion) {
				res.attributes.push(preFix + interFix + (portion + 1));
				if(portion === 8) {
					interFix = '';
				}
			});

			return res;
		};

		this.provideResourceEstimatePricelistOverload = function provideResourceEstimatePricelistOverload() {
			return basicsLookupdataConfigGenerator.provideGenericLookupConfig('resource.plantpricing.estimatepricelist');
		};

		this.provideResourcePartTypeOverload = function provideResourcePartTypeOverload() {
			return basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.resourceparttype');
		};

		this.provideResourcePricelistOverload = function provideResourcePricelistOverload() {
			return basicsLookupdataConfigGenerator.provideGenericLookupConfig('resource.plantpricing.pricelist');
		};

		this.provideResourcePricelistTypeOverload = function provideResourcePricelistTypeOverload() {
			return basicsLookupdataConfigGenerator.provideGenericLookupConfig('resource.plantpricing.pricelisttype');
		};

		this.provideResourceSkillOverload = function provideResourceSkillOverload() {
			return basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
				dataServiceName: 'resourceCommonSkillLookupDataService',
				filter: function() {
					return -1;
				}
			});
		};

		this.provideRubricCategoryOverload = function provideRubricCategoryOverload(filter) {
			return basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.rubriccategory', 'Description', {
				field: 'RubricFk',
				filterKey: filter,
				customIntegerProperty: 'BAS_RUBRIC_FK'
			});
		};

		this.providePlantComponentOverload = function providePlantComponentOverload(filterProp) {
			var propName = filterProp || 'PlantFk';

			return basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
				dataServiceName: 'resourceCommonPlantComponentLookupDataService',
				filter: function (item) {
					var plant;
					if (item) {
						plant = item[propName];
					}
					return plant;
				}
			});
		};

		this.provideMassDataPlantLookupOverload = function provideMassDataPlantLookupOverload() {
			return {
				grid: {
					editor: 'lookup',
					editorOptions: {
						directive: 'resource-equipment-plant-lookup-dialog-new',
						lookupOptions: {
							showClearButton: true,
							displayMember: 'Code',
							additionalColumns: true,
							addGridColumns: [{
								id: 'Description',
								field: 'DescriptionInfo',
								name: 'Description',
								width: 200,
								name$tr$: 'cloud.common.entityDescription',
								searchable: true
							}]
						}
					},
					formatter: function getPlantCode(row, cell, value, model, item) {
						if(model.id === 'plantfkdescription') {
							return item.PlantDescription;
						}
						return item.PlantCode;
					},
					formatterOptions: {
						searchable: true
					}
				},
				detail: {
					type: 'directive',
					directive: 'basics-lookupdata-lookup-composite',
					options: {
						lookupDirective: 'resource-equipment-plant-lookup-dialog-new',
						displayMember: 'Code',
						descriptionMember: 'DescriptionInfo.Translated',
						showClearButton: true
					}
				}
			};
		};
	}
})(angular);
