(function () {
	'use strict';
	/*globals angular*/

	var moduleName = 'productionplanning.productionset';
	angular.module(moduleName).factory('ppsProductionSubsetLayout', [
		'platformLayoutHelperService',
		function (platformLayoutHelperService) {
			var res = platformLayoutHelperService.getMultipleGroupsBaseLayout('1.0.0', 'pps.productionsubset.detailform',
				['ppsfabricationunitfk'],
				[getUserDefineGroup()]);
			res.overloads = getOverloads(['ppsfabricationunitfk']);
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
				var ovl = null;

				switch (lcPropName) {
					case 'ppsproductionsetfk':
						ovl = {
							navigator: {
								moduleName: 'productionplanning.productionset'
							},
							grid: {
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'ProductionsetLookup',
									displayMember: 'Code',
									version: 3
								},
								editor: 'lookup',
								editorOptions: {
									//lookupField: 'ProductionSetFk',
									directive: 'productionplanning-productionset-lookup',
									displayMember: 'Code',
									lookupOptions: {
										additionalColumns: true,
										addGridColumns: [{
											id: 'productionsetDesc',
											field: 'DescriptionInfo.Translated',
											width: 140,
											name: 'Description',
											formatter: 'description',
											name$tr$: 'cloud.common.entityDescription'
										}]
									}
								},
								width: 90
							},
							detail: {
								type: 'directive',
								directive: 'basics-lookupdata-lookup-composite',
								options: {
									lookupDirective: 'productionplanning-productionset-lookup',
									descriptionMember: 'DescriptionInfo.Description'
								}
							}
						};
						break;
					case 'ppsfabricationunitfk':
						ovl = {
							grid: {
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'PpsFabricationUnit',
									displayMember: 'Code',
									version: 3
								},
								editor: 'lookup',
								editorOptions: {
									directive: 'pps-fabrication-unit-lookup',
									displayMember: 'Code',
									lookupOptions: {
										additionalColumns: true,
										addGridColumns: [{
											id: 'fabricationUnitDesc',
											field: 'Description',
											width: 140,
											name: 'Description',
											formatter: 'description',
											name$tr$: 'cloud.common.entityDescription'
										}]
									}
								},
								width: 90
							},
							detail: {
								type: 'directive',
								directive: 'basics-lookupdata-lookup-composite',
								options: {
									lookupDirective: 'pps-fabrication-unit-lookup',
									descriptionMember: 'Description'
								}
							}
						};
						break;
				}
				return ovl;
			}

			function getUserDefineGroup() {
				var res = platformLayoutHelperService.getUserDefinedTextGroup(5, 'userDefTextGroup', 'userdefined', '');
				return res;
			}
		}
	]);

	angular.module(moduleName).service('ppsProductionSubsetUIService', [
		'platformUIConfigInitService', 'ppsProductionSubsetLayout',
		'productionplanningProductionsetTranslationService',
		function (platformUIConfigInitService, ppsProductionSubsetLayout,
		          translationService) {
			platformUIConfigInitService.createUIConfigurationService({
				service: this,
				layout: ppsProductionSubsetLayout,
				dtoSchemeId: {
					moduleSubModule: 'Productionplanning.Fabricationunit',
					typeName: 'PpsProductionSubsetDto'
				},
				translator: translationService
			});
		}
	]);
})();