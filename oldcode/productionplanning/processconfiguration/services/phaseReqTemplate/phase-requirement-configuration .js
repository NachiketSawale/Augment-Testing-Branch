(function (angular) {
	'use strict';
	/* global angular */
	var moduleName = 'productionplanning.processconfiguration';
	// master Layout
	angular.module(moduleName).factory('phaseRequirementLayout', phaseRequirementLayout);
	phaseRequirementLayout.$inject = ['platformUIStandardConfigService',
		'productionplanningProcessConfigurationTranslationService',
		'platformSchemaService',
		'basicsLookupdataConfigGenerator',
		'basicsLookupdataLookupDescriptorService',
		'platformLayoutHelperService',
		'upstreamTypes',
		'upstreamGoodsTypes',
		'basicsLookupdataSimpleLookupService',
		'productionplanningItemDataService',
		'prcPackageCreateService',
		'productionplanningProductMainService'];
	function phaseRequirementLayout(platformUIStandardConfigService,
		translationService,
		platformSchemaService,
		basicsLookupdataConfigGenerator,
		basicsLookupdataLookupDescriptorService,
		platformLayoutHelperService,
		upstreamTypes,
		upstreamGoodsTypes,
		baseLookupSimple,
		productionplanningItemDataService,
		prcPackageCreateService,
		productionplanningProductMainService) {

		function createLayout(dataService) {

			var statusLookupInfo = {
				'-1': {
					lookup: {}
				},
				1: {
					column: 'PPS_ITEM_FK',
					lookup: basicsLookupdataConfigGenerator.provideReadOnlyConfig('basics.customize.ppsitemstatus', null, {
						showIcon: true
					}).detail
				},
				2: {
					column: 'PRC_PACKAGE_FK',
					lookup: basicsLookupdataConfigGenerator.provideReadOnlyConfig('basics.customize.packagestatus', null, {
						showIcon: true
					}).detail
				},
				3: {
					lookup: {}
				},
				4: {
					lookup: {}
				},
				5: {
					lookup: {}
				},
				6: {
					lookup: {}
				},
				7: {
					lookup: {}
				},
				8: {
					lookup: {}
				},
				9: {
					lookup: {}
				}
			};

			var requirementResultLookupInfo = _.clone(upstreamTypes.lookupInfo);
			requirementResultLookupInfo[-1] = {
				lookup: {}
			};

			var upstreamGoodsLookupOptions = {
				showClearButton: false,
				events: [
					{
						name: 'onSelectedItemChanged',
						handler: function (e, args) {
							args.entity.selectedUpstreamGoods = args.selectedItem;
							if (!args.selectedItem){
								clearAllGoods(args.entity);
							}
						}
					}
				]
			};

			var upstreamResultLookupOptions = {
				showAddButton: true,
				showClearButton: true,
				openAddDialogFn: function (injector, entity, settings) {
					switch ((settings.lookupType)) {
						case 'PPSItem':
							var ppsItem = dataService.parentService().getServiceName() === 'productionplanningItemDataService' ? dataService.parentService().getSelected() : null;
							return productionplanningItemDataService.createUpstreamItem(entity, ppsItem).then(function (newItem) {
								entity.RequirementResult = newItem.Id; // for somehow, model dialog showup twice, and grid refresh without endedit, so preset value here
								entity.requirementresultstatus = newItem.PPSItemStatusFk;
								return newItem;
							});
						case 'PrcPackage':
							var options = {
								defaults: {
									ProjectFk: productionplanningProductMainService.getSelected().ProjectId
								}
							};
							var selected = dataService.getSelected();
							if (selected.selectedUpstreamGoods) {
								options.defaults.StructureFk = selected.selectedUpstreamGoods.PrcStructureFk;
							}
							return prcPackageCreateService.createItem(options);
					}
				},
				events: [
					{
						name: 'onSelectedItemChanged',
						handler: function (e, args) {
							args.entity.selectedRequirementResult = args.selectedItem;
						}
					},
					{
						name: 'onEditValueChanged',
						handler: function (e, args) {
							if (args.selectedItem){
								args.entity.RequirementResultStatus = args.selectedItem.PPSItemStatusFk ||
									args.selectedItem.PackageStatusFk ||
									args.selectedItem.RequisitionStatusFk;
							}
							else {
								clearAllResults(args.entity);
							}
						}
					}
				],
				defaultFilter: dataService.getDefaultFilter ? dataService.getDefaultFilter : undefined,
			};

			return {
				'fid': 'productionplanning.processconfiguration.phaselayout',
				'version': '1.0.0',
				'showGrouping': true,
				'addValidationAutomatically': true,
				'groups': [
					{
						gid: 'baseGroup',
						attributes: ['ppsphasereqstatusfk', 'ppsupstreamgoodstypefk', 'requirementgoods', 'quantity', 'basuomfk', 'commenttext', 'actualquantity', 'correctionquantity']
					},
					{
						gid: 'result',
						attributes: ['ppsupstreamtypefk', 'requirementresult', 'requirementresultstatus']
					},
					platformLayoutHelperService.getUserDefinedTextGroup(5, 'userDefText', 'userdefined', ''),
					{
						gid: 'entityHistory',
						isHistory: true
					}
				],
				'overloads': {
					ppsphasereqstatusfk: basicsLookupdataConfigGenerator.provideReadOnlyConfig('basics.customize.ppsphaserequirementstatus', null, {
						showIcon: true,
						imageSelectorService: 'platformStatusSvgIconService',
						svgBackgroundColor: 'BackgroundColor',
						backgroundColorType: 'dec',
						backgroundColorLayer: [1, 2, 3, 4, 5, 6]
					}),
					ppsupstreamgoodstypefk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.ppsupstreamgoodstype', null,
						{
							filterKey: 'ppsphase-requirement-upstream-goodtype-filter',
							events: [{
								name: 'onSelectedItemChanged',
								handler: function (e, args) {
									args.entity.ResultType = switchReqirementResult(args.selectedItem.Id, args.entity.PpsUpstreamTypeFk,args.entity);
									clearAllGoods(args.entity);
									clearAllResults(args.entity);
								}
							}]
						}),
					requirementgoods: {
						detail: {
							type: 'directive',
							directive: 'dynamic-grid-and-form-lookup',
							options: {
								isTextEditable: false,
								dependantField: 'PpsUpstreamGoodsTypeFk',
								lookupInfo: upstreamGoodsTypes.lookupInfo,
								grid: false,
								dynamicLookupMode: true,
								showClearButton: false,
								lookupOptions: upstreamGoodsLookupOptions
							}
						},
						grid: {
							formatter: 'dynamic',
							editor: 'dynamic',
							domain: function (item, column) {
								var prop = upstreamGoodsTypes.lookupInfo[item.PpsUpstreamGoodsTypeFk];
								if (prop && prop.column) {
									column.editorOptions = {
										directive: prop.lookup.options.lookupDirective,
										lookupOptions: upstreamGoodsLookupOptions
									};
									column.formatterOptions = prop.lookup.formatterOptions;
								} else {
									column.editorOptions = null;
									column.formatterOptions = null;
								}
								return 'lookup';
							}
						}
					},
					quantity: {
						disallowNegative: true
					},
					actualquantity: {
						disallowNegative: true
					},
					basuomfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'basicsUnitLookupDataService',
						cacheEnable: true,
						showClearButton: true
					}),
					ppsupstreamtypefk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.ppsupstreamtype', null,
						{
							showClearButton: true,
							filterKey: 'ppsphase-requirement-result-type-filter',
							events: [{
								name: 'onSelectedItemChanged',
								handler: function (e, args) {
									args.entity.ResultType = switchReqirementResult(args.entity.PpsUpstreamGoodsTypeFk, args.selectedItem.Id, args.entity);
									clearAllResults(args.entity);
								}
							}]
						}),
					requirementresult: {
						detail: {
							type: 'directive',
							directive: 'pps-dynamic-grid-and-form-lookup',// could not use the same dynamic directive more than one time, not found reason yet
							options: {
								isTextEditable: false,
								dependantField: 'ResultType',
								lookupInfo: requirementResultLookupInfo,
								grid: false,
								dynamicLookupMode: true,
								showClearButton: false,
								lookupOptions: upstreamResultLookupOptions
							}
						},
						grid: {
							formatter: 'dynamic',
							editor: 'dynamic',
							domain: function (item, column) {
								item.ResultType = switchReqirementResult(item.PpsUpstreamGoodsTypeFk, item.PpsUpstreamTypeFk, item);
								var prop = requirementResultLookupInfo[item.ResultType];
								if (prop && prop.column) {
									column.editorOptions = {
										directive: prop.lookup.options.lookupDirective,
										lookupOptions: upstreamResultLookupOptions
									};
									column.formatterOptions = prop.lookup.formatterOptions;
								} else {
									column.editorOptions = null;
									column.formatterOptions = null;
								}

								return 'lookup';
							}
						}
					},
					requirementresultstatus: {
						readonly: true,
						grid: {
							formatter: 'dynamic',
							editor: 'dynamic',
							domain: function (item, column) {
								var options = {};
								item.ResultType = switchReqirementResult(item.PpsUpstreamGoodsTypeFk, item.PpsUpstreamTypeFk, item);
								switch (item.ResultType) {
									case 1:
										options = basicsLookupdataConfigGenerator.provideReadOnlyConfig('basics.customize.ppsitemstatus', null, {
											showIcon: true
										}).grid;
										break;
									case 2:
										options = basicsLookupdataConfigGenerator.provideReadOnlyConfig('basics.customize.packagestatus', null, {
											showIcon: true
										}).grid;
										break;
									case 3:
										options = basicsLookupdataConfigGenerator.provideReadOnlyConfig('basics.customize.resrequisitionstatus', null, {
											showIcon: true
										}).grid;
										break;
									default:
										options = {
											editorOptions: null, formatterOptions: null
										};
										break;
								}
								column.editorOptions = options.editorOptions;
								column.formatterOptions = options.formatterOptions;

								return 'lookup';
							}
						},
						detail: {
							type: 'directive',
							directive: 'pps-second-dynamic-grid-and-form-lookup',// could not use the same dynamic directive more than one time, not found reason yet
							options: {
								isTextEditable: false,
								dependantField: 'ResultType',
								lookupInfo: statusLookupInfo,
								grid: false,
								dynamicLookupMode: true,
								showClearButton: false
							}
						}
					},
				}
			};
		}

		//baseLookupSimple.getList({lookupModuleQualifier:'basics.customize.ppsformworktype', valueMember: 'Id', displayMember: 'Description'});
		// load pps formwork type
		if (_.isNil(basicsLookupdataLookupDescriptorService.getData('FormworkType'))) {
			basicsLookupdataLookupDescriptorService.loadData('FormworkType');
		}

		function switchReqirementResult(goodsTypeId, resultTypeId, entity) {
			if (resultTypeId === 1){// PPS_ITEM
				switch (goodsTypeId) {
					case 1:// Material
						return 1;// PPS_ITEM
					case 6:// PpsFormworkType
						return 6;// PpsFormwork
					case 7:// ProcessTemplate
						return 7;
				}
			}

			if (goodsTypeId === 1){// Material
				if (resultTypeId === 2){// PRC_PACKAGE
					return 2;// PRC_PACKAGE
				}

				if (resultTypeId === 4){// PES_ITEM
					return 4;// PES_ITEM
				}
			}

			return -1;// None
		}

		function clearAllGoods(entity) {
			if(entity){
				entity.PpsFormworkTypeFk =
					entity.PpsProcessTemplateFk =
						entity.MdcMaterialFk =
							entity.RequirementGoods =
								entity.MdcCostCodeFk =
									entity.MdcCostCodeTtFk = undefined;
			}
		}

		function clearAllResults(entity){
			if(entity){
				entity.PpsItemFk =
					entity.PrcPackageFk =
						entity.PesItemFk =
							entity.PpsFormworkFk =
								entity.PpsProcessFk =
									entity.RequirementResultStatus =
										entity.RequirementResult = undefined;
			}
		}

		return {
			createLayout: createLayout
		};

	}
})(angular);