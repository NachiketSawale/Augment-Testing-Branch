(function () {
	'use strict';
	/*global angular*/

	var moduleName = 'productionplanning.fabricationunit';
	angular.module(moduleName).factory('ppsNestingLayout', [
		'platformLayoutHelperService',
		function (platformLayoutHelperService) {

			var res = platformLayoutHelperService.getMultipleGroupsBaseLayout('1.0.0', 'pps.nesting.detailform',
				['ppsproductfk', 'positionx', 'positiony', 'positionz', 'anglea', 'angleb', 'anglec', 'slabnumber', 'engdrawingfk', 'ppsitemfk'],
				[getUserDefineGroup()]);
			res.overloads = getOverloads(['ppsproductfk','engdrawingfk', 'ppsitemfk']);
			res.addAdditionalColumns = true;
			return res;

			function getOverloads(overloads) {
				var ovls = {};
				if (Array.isArray(overloads)) {
					_.forEach(overloads, function (ovl) {
						var ol = getOverload(ovl);
						if (ol) {
							ovls[ovl] = ol;
						}
					});
				}

				return ovls;
			}

			function getOverload(lcPropName) {
				var ovl = {
					ppsproductfk: {
						navigator: {
							moduleName: 'productionplanning.product'
						},
						grid: {
							editor: 'lookup',
							editorOptions: {
								directive: 'productionplanning-common-product-lookup-new',
								lookupType: 'CommonProduct'
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'CommonProduct',
								displayMember: 'Code',
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
						}
					},
					engdrawingfk: {
						navigator: {
							moduleName: 'productionplanning.drawing'
						},
						readonly: true,
						grid: {
							editor: 'lookup',
							directive: 'basics-lookupdata-lookup-composite',
							editorOptions: {
								directive: 'productionplanning-drawing-lookup',
								lookupOptions: {
									additionalColumns: true,
									addGridColumns: [{
										id: 'Description',
										field: 'Description',
										name: 'Description',
										width: 300,
										formatter: 'description',
										name$tr$: 'cloud.common.entityDescription'
									}],
									displayMember: 'Code'
								}
							},
							formatter: 'lookup',
							formatterOptions: {
								version: 3,
								lookupType: 'EngDrawing',
								displayMember: 'Code'
							},
							width: 70
						},
						detail: {
							type: 'directive',
							directive: 'basics-lookupdata-lookup-composite',
							options: {
								lookupDirective: 'productionplanning-drawing-lookup',
								descriptionMember: 'Description'
							}
						}
					},
					ppsitemfk: {
						navigator: {
							moduleName: 'productionplanning.item'
						},
						readonly: true,
						grid: {
							editor: 'lookup',
							directive: 'basics-lookupdata-lookup-composite',
							editorOptions: {
								directive: 'productionplanning-item-item-lookup-dialog',
								lookupOptions: {
									additionalColumns: true,
									addGridColumns: [{
										id: 'Description',
										field: 'DescriptionInfo',
										name: 'Description',
										width: 300,
										formatter: 'translation',
										name$tr$: 'cloud.common.entityDescription'
									}],
									displayMember: 'Code'
								}
							},
							formatter: 'lookup',
							formatterOptions: {
								version: 3,
								lookupType: 'PPSItem',
								displayMember: 'Code'
							},
							width: 70
						},
						detail: {
							type: 'directive',
							directive: 'basics-lookupdata-lookup-composite',
							options: {
								lookupDirective: 'productionplanning-item-item-lookup-dialog',
								descriptionMember: 'DescriptionInfo.Translated'
							}
						}
					},
				};
				return ovl[lcPropName];
			}

			function getUserDefineGroup() {
				var res = platformLayoutHelperService.getUserDefinedTextGroup(5, 'userDefTextGroup', 'userdefined', '');
				return res;
			}
		}
	]);

	angular.module(moduleName).service('ppsNestingUIService', [
		'platformUIConfigInitService', 'ppsNestingLayout',
		'ppsFabricationunitTranslationService',
		function (platformUIConfigInitService, ppsNestingLayout,
		          ppsFabricationunitTranslationService) {
			platformUIConfigInitService.createUIConfigurationService({
				service: this,
				layout: ppsNestingLayout,
				dtoSchemeId: {
					moduleSubModule: 'Productionplanning.Fabricationunit',
					typeName: 'PpsNestingDto'
				},
				translator: ppsFabricationunitTranslationService
			});
		}
	]);
})();