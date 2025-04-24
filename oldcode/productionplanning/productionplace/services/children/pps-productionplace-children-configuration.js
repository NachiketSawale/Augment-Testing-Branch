(function () {
	'use strict';
	/* global _ */

	const moduleName = 'productionplanning.productionplace';
	angular.module(moduleName).factory('ppsProductionPlaceChildrenLayout', [
		'platformLayoutHelperService', 'basicsLookupdataConfigGenerator',
		function (platformLayoutHelperService, basicsLookupdataConfigGenerator) {

			function getOverloads(overloads) {
				const ovls = {};
				if (overloads) {
					_.forEach(overloads, function (ovl) {
						const ol = getOverload(ovl);
						if (ol) {
							ovls[ovl] = ol;
						}
					});
				}

				return ovls;
			}

			function getOverload(overload) {
				let ovl = null;
				switch (overload) {
					case 'ppsprodplacechildfk':
						ovl = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
							dataServiceName: 'ppsProductionPlaceChildrenLookupDataService',
							cacheEnable: true,
							additionalColumns: false
						});
						break;
					case 'ppsproductfk':
						ovl = {
							grid: {
								editor: 'lookup',
								editorOptions: {
									directive: 'productionplanning-common-product-lookup-new',
									lookupType: 'CommonProduct'
								},
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'CommonProduct',
									displayMember: 'DescriptionInfo.Translated',
									version: 3
								},
								width: 100
							},
							detail: {
								type: 'directive',
								directive: 'basics-lookupdata-lookup-composite',
								options: {
									lookupDirective: 'productionplanning-common-product-lookup-new',
									displayMember: 'Code',
									descriptionMember: 'DescriptionInfo.Translated'
								}
							},
						};
						break;
					default:
						ovl = {};
						break;
				}

				if(ovl !== null){
					ovl.sortable = false;
				}
				return ovl;
			}

			const layout = platformLayoutHelperService.getMultipleGroupsBaseLayout('1.0.0', 'pps.productionplace.children.detailform',
				['ppsprodplacechildfk', 'timestamp']);

			layout.overloads = getOverloads(['ppsprodplacechildfk', 'ppsproductfk']);
			layout.addAdditionalColumns = true;
			return layout;

		}
	]);

	angular.module(moduleName).factory('ppsProductionPlaceChildrenLayoutConfig', [
		'platformObjectHelper',
		function (platformObjectHelper) {
			return {
				addition: {
					grid: platformObjectHelper.extendGrouping([])
				}
			};
		}
	]);
})();