/**
 * Created by lav on 4/29/2019.
 */

(function () {
	'use strict';
	/* global _ */
	var moduleName = 'productionplanning.drawing';

	angular.module(moduleName).factory('productionplanningDrawingComponentUIStandardService', ResultUIStandardService);

	ResultUIStandardService.$inject = ['platformUIStandardConfigService', 'productionplanningDrawingTranslationService',
		'drawingComponentTypes',
		'platformSchemaService', 'platformLayoutHelperService',
		'basicsLookupdataLookupFilterService',
		'basicsLookupdataConfigGenerator',
		'platformUIStandardExtentService',
		'mdcDrawingComponentLayoutConfig'];

	function ResultUIStandardService(platformUIStandardConfigService, drawingTranslationService,
									 drawingComponentTypes,
									 platformSchemaService,
									 platformLayoutHelperService,
									 basicsLookupdataLookupFilterService,
									 basicsLookupdataConfigGenerator,
									platformUIStandardExtentService,
									mdcDrawingComponentLayoutConfig) {

		var serviceCache = {};

		function createLayout() {
			// register lookup filters
			var filters = [{
				key: 'productionplanning-drawing-engDrawingComponent-engdrwcomptypefk-filter',
				fn: function (item) {
					return  item.Id === drawingComponentTypes.Material || item.Id === drawingComponentTypes.CostCode;
				}
			}];
			_.each(filters, function (filter) {
				if (!basicsLookupdataLookupFilterService.hasFilter(filter.key)) {
					basicsLookupdataLookupFilterService.registerFilter(filter);
				}
			});

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
								showClearButton: true,
								gridOptions: {
									disableCreateSimilarBtn: true
								},
								events: [
									{
										name: 'onSelectedItemChanged',
										handler: function (e, args) {
											args.entity.Uom3Fk = args.entity.Uom2Fk = args.entity.BasUomFk = args.selectedItem.BasUomFk;
										}
									}
								]
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
								showClearButton: true,
								gridOptions: {
									disableCreateSimilarBtn: true
								},
								events: [
									{
										name: 'onSelectedItemChanged',
										handler: function (e, args) {
											args.entity.Uom3Fk = args.entity.Uom2Fk = args.entity.BasUomFk = args.selectedItem.BasUomFk;
										}
									}
								]
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
								showClearButton: true,
								events: [
									{
										name: 'onSelectedItemChanged',
										handler: function (e, args) {
											args.entity.Uom3Fk = args.entity.Uom2Fk = args.entity.BasUomFk = args.selectedItem.UomFk;
										}
									}
								]
							},
							directive: 'basics-cost-codes-lookup'
						}
					},
					detail: {
						type: 'directive',
						directive: 'basics-cost-codes-lookup',
						options: {
							lookupOptions: {
								showClearButton: true,
								events: [
									{
										name: 'onSelectedItemChanged',
										handler: function (e, args) {
											args.entity.Uom3Fk = args.entity.Uom2Fk = args.entity.BasUomFk = args.selectedItem.UomFk;
										}
									}
								]
							}
						}
					}
				}
			};

			var mcLookupInfo = {};
			mcLookupInfo[1] = {lookup: createOptionsForMCLookup(mcOverLoads, 'mdcmaterialfk'), column: 'MdcMaterialCostCodeFk'}; // material, componentType===1
			mcLookupInfo[2] = {lookup: createOptionsForMCLookup(mcOverLoads, 'mdccostcodefk'), column: 'MdcMaterialCostCodeFk'}; // costcode, componentType===2
			mcLookupInfo[99999999] = {column: 'MdcMaterialCostCodeFk'}; // add a "empty" lookupInfo, just a temporary solution for fixing similar validation issue of MdcMaterialCostCodeFk of ticket #136944(by zwz on 2022/11/28)

			function createOptionsForMCLookup(overLoads, propName) {
				var lookupGridCfg = overLoads[propName].grid;
				return{
					directive: lookupGridCfg.editorOptions.lookupDirective || lookupGridCfg.editorOptions.directive,
					options: lookupGridCfg.editorOptions.lookupOptions,
					formatter: lookupGridCfg.formatter,
					formatterOptions: lookupGridCfg.formatterOptions
				};
			}

			var res = platformLayoutHelperService.getMultipleGroupsBaseLayout('1.0.0',
				'productionplanning.drawing.component',
				['description', 'engdrwcompstatusfk', 'engdrwcomptypefk', 'mdcmaterialcostcodefk', 'remark', 'islive','sorting'
				],
				[
					{
						gid: 'Quantities',
						attributes: ['quantity', 'basuomfk', 'quantity2', 'uom2fk', 'quantity3', 'uom3fk', 'billingquantity', 'basuombillfk']
					},
					{
						gid: 'RuleInformation',
						attributes: ['engaccountingrulefk', 'engaccrulesetresultfk', 'isimported']
					},
					{
						gid: 'userDefTextGroup',
						isUserDefText: true,
						attCount: 5,
						attName: 'userdefined',
						noInfix: true
					}]);
			res.overloads = {
				'engdrwcompstatusfk': basicsLookupdataConfigGenerator.provideReadOnlyConfig('basics.customize.engineeringdrawingcomponentstatus',
					null,
					{
						showIcon: true
					}
				),
				'engdrwcomptypefk': basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.engineeringdrawingcomponenttype',
					null,
					{
						filterKey: 'productionplanning-drawing-engDrawingComponent-engdrwcomptypefk-filter',
						showIcon: true
					}),
				'mdcmaterialcostcodefk': {
					navigator: {
						moduleName: 'basics.material' // cannot dynamically goto different module base on component type
													  // but fortunately the requirement here is only goto material module
					},
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
							var info = item.EngDrwCompTypeFk ? mcLookupInfo[item.EngDrwCompTypeFk] : undefined;
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
								column.editorOptions = {readonly: true};
								column.formatterOptions = null;
							}

							return flag ? 'directive' : 'lookup';
						}
					}
				},
				'basuomfk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
					dataServiceName: 'basicsUnitLookupDataService',
					filterKey: '',
					cacheEnable: true
				}),
				'basuombillfk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
					dataServiceName: 'basicsUnitLookupDataService',
					filterKey: '',
					cacheEnable: true
				}),
				'engaccrulesetresultfk': {
					grid: {
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'PpsAccountingRulesetResult',
							displayMember: 'Description',
							version: 3
						},
						editor: 'lookup',
						editorOptions: {
							lookupField: 'EngAccRulesetResultFk',
							directive: 'productionplanning-accounting-ruleset-result-lookup',
							displayMember: 'Description'
						},
						width: 90
					},
					detail: {
						type: 'directive',
						directive: 'basics-lookupdata-lookup-composite',
						options: {
							lookupDirective: 'productionplanning-accounting-ruleset-result-lookup',
							descriptionMember: 'Description'
						}
					}
				},
				'engaccountingrulefk': {
					readonly: true,
					grid: {
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'PpsAccountingRule',
							displayMember: 'MatchPattern',
							version: 3
						},
						editor: 'lookup',
						editorOptions: {
							directive: 'productionplanning-accounting-rule-lookup',
							displayMember: 'MatchPattern'
						},
						width: 90
					},
					detail: {
						type: 'directive',
						directive: 'basics-lookupdata-lookup-composite',
						options: {
							lookupDirective: 'productionplanning-accounting-rule-lookup',
							descriptionMember: 'MatchPattern'
						}
					}
				},
				'isimported': {readonly: true},
				'islive': {readonly: true},
				uom2fk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
					dataServiceName: 'basicsUnitLookupDataService',
					filterKey: '',
					cacheEnable: true
				}),
				uom3fk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
					dataServiceName: 'basicsUnitLookupDataService',
					filterKey: '',
					cacheEnable: true
				})
			};
			return res;
		}

		function createService(dataService, isReadonly) {
			var BaseService = platformUIStandardConfigService;

			var ruleSetAttributeDomains = platformSchemaService.getSchemaFromCache({
				typeName: 'EngDrawingComponentDto',
				moduleSubModule: 'ProductionPlanning.Drawing'
			});
			ruleSetAttributeDomains = ruleSetAttributeDomains.properties;

			var config = new BaseService(createLayout(), ruleSetAttributeDomains, drawingTranslationService);
			platformUIStandardExtentService.extend(config, mdcDrawingComponentLayoutConfig.addition, ruleSetAttributeDomains);
			//set the callback function manually, in case the detail container not load
			if (dataService.handleFieldChanged && !isReadonly) {
				_.forEach(config.getStandardConfigForDetailView().rows, function (row) {
					row.change = function (entity, field) {
						dataService.handleFieldChanged(entity, field);
					};
				});
			}

			if(isReadonly){
				_.forEach(config.getStandardConfigForListView().columns, function (o) {
					o.editor = null;
				});
				_.forEach(config.getStandardConfigForDetailView().rows, function (o) {
					o.reaonly = true;
				});
			}
			return config;
		}

		function getService(dataService, isReadonly) {
			var key = dataService.getServiceName();
			if (!serviceCache[key]) {
				serviceCache[key] = createService(dataService, isReadonly);
			}
			return serviceCache[key];
		}

		return {
			getService: getService
		};
	}
})();