(function () {
	'use strict';
	/*global angular*/

	var moduleName = 'productionplanning.fabricationunit';
	angular.module(moduleName).factory('ppsFabricationunitLayout', [
		'platformLayoutHelperService', 'productionplanningCommonLayoutHelperService',
		'basicsLookupdataLookupFilterService', 'basicsLookupdataConfigGenerator',
		function (platformLayoutHelperService, ppsCommonLayoutHelperService,
		          basicsLookupdataLookupFilterService, basicsLookupdataConfigGenerator) {

			// register lookup filters
			var filters = [{
				key: 'pps-fabricationunit-eventtype-filter',
				fn: function (item) {
					if (item) {
						return item.PpsEntityFk !== null && item.PpsEntityFk === 17; //"PpsEntityFK === 17" maps fabricationunit
					}
					return false;
				}
			}];
			_.each(filters, function (filter) {
				if (!basicsLookupdataLookupFilterService.hasFilter(filter.key)) {
					basicsLookupdataLookupFilterService.registerFilter(filter);
				}
			});

			var res = platformLayoutHelperService.getMultipleGroupsBaseLayout('1.0.0', 'pps.fabricationunit.detailform',
				['code', 'externalcode', 'description', 'ppsproductionsetmainfk', 'bassitefk', 'eventtypefk', 'ppsprodplacetypefk', 'ppsproductionplacefk', 'ppsstrandpatternfk', 'commenttext', 'islive'],
				[{
					gid: 'planningInfoGroup',
					attributes: ['quantity', 'actualquantity', 'remainingquantity', 'plannedstart',
						'plannedfinish', 'earlieststart', 'lateststart', 'earliestfinish', 'latestfinish',
						'dateshiftmode', 'basuomfk']
				},
				getUserDefineGroup()]);
			res.overloads = getOverloads(['eventtypefk', 'bassitefk', 'ppsproductionsetmainfk', 'ppsprodplacetypefk', 'ppsproductionplacefk', 'ppsstrandpatternfk', 'islive', 'dateshiftmode', 'basuomfk']);
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
					eventtypefk: ppsCommonLayoutHelperService.provideEventTypeLookupOverload(filters[0].key),
					bassitefk: {
						grid: {
							editor: 'lookup',
							editorOptions: {
								lookupOptions: {showClearButton: true},
								directive: 'basics-site-site-lookup'
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'SiteNew',
								displayMember: 'Code',
								version: 3
							},
							width: 70
						},
						detail: {
							type: 'directive',
							directive: 'basics-lookupdata-lookup-composite',
							options: {
								lookupOptions: {showClearButton: true},
								lookupDirective: 'basics-site-site-lookup',
								descriptionMember: 'DescriptionInfo.Description'
							}
						}
					},
					ppsproductionsetmainfk: {
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
								directive: 'productionplanning-productionset-lookup',
								displayMember: 'Code',
								lookupOptions: {
									additionalColumns: true,
									addGridColumns: [{
										id: 'productionsetDesc',
										field: 'DescriptionInfo.Translated',
										width: 140,
										name: 'Description',
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
					},
					ppsprodplacetypefk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.ppsproductplacetype', null, {
						showIcon: true,
						customBoolProperty: 'CANHAVECHILDREN'
					}),
					ppsproductionplacefk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'ppsProductionPlaceLookupDataService',
						cacheEnable: true,
						additionalColumns: false
					}),
					ppsstrandpatternfk: {
						grid: {
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'PpsStrandPattern',
								displayMember: 'Code',
								version: 3
							},
							editor: 'lookup',
							editorOptions: {
								lookupDirective: 'productionplanning-strandpattern-lookup',
								lookupOptions: {
									displayMember: 'Code'
								}
							}
						},
						detail: {
							type: 'directive',
							directive: 'productionplanning-strandpattern-lookup',
							options: {
								displayMember: 'Code'
							}
						}
					},
					islive: {readonly: true},
					dateshiftmode: {
						grid: {
							formatter: 'select',
							formatterOptions: {
								serviceName : 'productionplanningCommonDateShiftModeService',
								valueMember: 'Id',
								displayMember: 'Description'
							},
							editor: 'select',
							editorOptions: {
								serviceName : 'productionplanningCommonDateShiftModeService',
								valueMember: 'Id',
								displayMember: 'Description'
							},
							readonly: true
						},
						detail: {
							type: 'select',
							required: false,
							options: {
								serviceName : 'productionplanningCommonDateShiftModeService',
								valueMember: 'Id',
								displayMember: 'Description'
							}
						}
					},
					basuomfk: {
						detail: {
							type: 'directive',
							directive: 'basics-lookupdata-uom-lookup',
							options: {
								eagerLoad: true
							}
						},
						grid: {
							editor: 'lookup',
							editorOptions: {
								lookupDirective: 'basics-lookupdata-uom-lookup'
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'uom',
								displayMember: 'Unit'
							}
						}
					}
				};
				return ovl[lcPropName];
			}

			function getUserDefineGroup() {
				var res = platformLayoutHelperService.getUserDefinedTextGroup(5, 'userDefTextGroup', 'userdefined', '');
				return res;
			}
		}
	]);

	angular.module(moduleName).factory('ppsFabricationunitUIService', [
		'platformUIStandardConfigService', 'ppsFabricationunitLayout',
		'ppsFabricationunitTranslationService', 'platformSchemaService',
		function (PlatformUIStandardConfigService, ppsFabricationunitLayout,
		          ppsFabricationunitTranslationService, platformSchemaService) {

			var schemaOption = { typeName: 'PpsFabricationUnitDto', moduleSubModule: 'Productionplanning.Fabricationunit' };
			var dtoAttrs = platformSchemaService.getSchemaFromCache(schemaOption).properties;
			return new PlatformUIStandardConfigService(ppsFabricationunitLayout, dtoAttrs, ppsFabricationunitTranslationService);
		}
	]);
})();