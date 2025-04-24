(function (angular) {
	'use strict';
	/* global _ */
	var moduleName = 'transportplanning.requisition';
	angular.module(moduleName).factory('transportplanningToBeAssignedLayout', Layout);
	Layout.$inject = ['$injector', 'platformLayoutHelperService', 'basicsLookupdataConfigGenerator', 'basicsCommonUomDimensionFilterService', 'ppsCommonCustomColumnsServiceFactory',
		'basicsLookupdataLookupFilterService',
		'transportplanningRequisitionLookupDataService',
		'productionplanningCommonLayoutHelperService',
		'upstreamTypes',
		'upstreamGoodsTypes',
		'productionplanningItemDataService',
		'ppsProjectUtilService',
		'basicsCommonCreateDialogConfigService',
		'resRequisitionCreateOption'];

	function Layout($injector, platformLayoutHelperService, basicsLookupdataConfigGenerator, uomFilterService, customColumnsServiceFactory,
		basicsLookupdataLookupFilterService,
		trsRequisitionLookupDataService,
		ppsCommonLayoutHelperService,
		upstreamTypes,
		upstreamGoodsTypes,
		productionplanningItemDataService,
		ppsProjectUtilService,
		createDialogConfigService,
		resRequisitionCreateOption) {

		// let dataService = $injector.get('transportplanningRequisitionToBeAssignedDataService').getService();

		return {createLayout: function createLayout(dataService){

			let parentService = dataService.parentService();
			const pesItemPrjFilterKey = `${parentService.getServiceName()}-pps-pes-item-project-and-unassigned-filter`;
			if (!basicsLookupdataLookupFilterService.hasFilter(pesItemPrjFilterKey)) {
				let filters = [{
					key: pesItemPrjFilterKey,
					serverKey: 'unassigned-upstream-filter',
					serverSide: true,
					fn: function (item, option) {
						let selectedItem = parentService.getSelected();
						// option.PrjProjectFk = selectedItem.ProjectFk;
						return {PrjProjectFk : ppsProjectUtilService.getProjectId(selectedItem, null)};
						// return item.PrjProjectFk === selectedItem.ProjectFk && !item.PpsUpStreamId;
					}
				}];
				basicsLookupdataLookupFilterService.registerFilter(filters);
			}

			// initialize some necessary translation first, to avoid active cell destroy
			// platformgrid.directive.js destroy()
			$injector.get('logisticJobTranslationService');

			var upstreamResultLookupOptions = {
				showAddButton: true,
				showClearButton: true,
				openAddDialogFn: function (injector, entity, settings) {
					switch ((settings.lookupType)) {
						case 'PPSItem':
							var ppsItem = dataService.parentService().getServiceName() === 'productionplanningItemDataService' ? dataService.parentService().getSelected() : null;
							return productionplanningItemDataService.createUpstreamItem(entity, ppsItem).then(function (newItem) {
								entity.UpstreamResult = newItem.Id; // for somehow, model dialog showup twice, and grid refresh without endedit, so preset value here
								entity.UpstreamResultStatus = newItem.PPSItemStatusFk;
								return newItem;
							});
						case 'resourceRequisition':
							var createOptions = resRequisitionCreateOption;
							var defaultOptions = {
								title: ('cloud.common.toolbarInsert'),
								fid: 'basic.lookup.newDialog',
								attributes: {},
							};
							createOptions = _.merge({}, defaultOptions, createOptions);
							var domains = createOptions.uiStandardService.getDtoScheme();
							_.each(createOptions.fields, function (field) {
								if (Object.prototype.hasOwnProperty.call(domains,field)) {
									createOptions.attributes[field] = domains[field];
								}
							});

							createOptions.attributes.JobFk.mandatory = true;
							createOptions.attributes.RequisitionTypeFk.mandatory = true;
							createOptions.creationData = function () {
								var ProjectFk = null;
								var JobFk = null;
								var parentSelected = dataService.parentService().getSelected();
								switch (dataService.parentService().getServiceName()) {
									case 'productionplanningEngineeringMainService':
										ProjectFk = parentSelected.ProjectId;
										JobFk = parentSelected.LgmJobFk;
										break;
									case 'productionplanningItemDataService':
										ProjectFk = parentSelected.ProjectFk;
										JobFk = parentSelected.LgmJobFk;
										break;
								}
								return {
									Quantity: entity.Quantity,
									UomFk: entity.UomFk,
									ProjectFk: ProjectFk,
									JobFk: JobFk,
									ResourceFk: entity.PpsUpstreamGoodsTypeFk === 2 ? entity.UpstreamGoods : null
								};
							};
							return createDialogConfigService.showDialog(createOptions).then(function (result) {
								if (result.ok) {
									return result.data;
								}
							});
						case 'PrcPackage':
							// disbaled for now - start via wizard

							// var options = {
							// 	defaults: {
							// 		ProjectFk: productionplanningItemDataService.getSelected().ProjectFk
							// 	}
							// };
							// var selected = dataService.getSelected();
							// if (selected.selectedUpstreamGoods) {
							// 	options.defaults.StructureFk = selected.selectedUpstreamGoods.PrcStructureFk;
							// }
							// return prcPackageCreateService.createItem(options);
					}
				},
				events: [
					{
						name: 'onSelectedItemChanged',
						handler: function (e, args) {
							args.entity.selectedUpstreamResult = args.selectedItem;
						}
					}
				],
				defaultFilter: dataService.getDefaultFilter ? dataService.getDefaultFilter : undefined,
			};

			var upstreamGoodsLookupOptions = {
				showClearButton: false,
				filterKey: 'pps-upstream-item-material-is-product-filter',
				events: [
					{
						name: 'onSelectedItemChanged',
						handler: function (e, args) {
							args.entity.selectedUpstreamGoods = args.selectedItem;
						}
					}
				]
			};

			function createOptionsForMCLookup(overLoad) {
				var lookupGridCfg = overLoad.grid;
				return{
					directive: !_.isNil(lookupGridCfg.editorOptions) ? (lookupGridCfg.editorOptions.lookupDirective || lookupGridCfg.editorOptions.directive) : undefined,
					options: !_.isNil(lookupGridCfg.editorOptions) ? lookupGridCfg.editorOptions.lookupOptions : undefined,
					formatter: lookupGridCfg.formatter,
					formatterOptions: lookupGridCfg.formatterOptions
				};
			}

			var statusLookupInfo = {
				product: { // lookup for product
					lookup: createOptionsForMCLookup(basicsLookupdataConfigGenerator.provideReadOnlyConfig('basics.customize.ppsproductstatus', null, {
						showIcon: true,
						imageSelectorService: 'platformStatusSvgIconService',
						svgBackgroundColor: 'ProductStatusBackgroundColor',
						backgroundColorType: 'dec',
						backgroundColorLayer: [1, 2, 3, 4, 5, 6]
					})),
					column: 'ProductStatusFk'
				},
				bundle: { // lookup for bundle
					lookup: createOptionsForMCLookup(basicsLookupdataConfigGenerator.provideReadOnlyConfig('basics.customize.transportbundlestatus', null, {
						showIcon: true
					})),
					column: 'BundleStatusFk'
				},
				upstreamItem: {
					lookup: createOptionsForMCLookup(basicsLookupdataConfigGenerator.provideReadOnlyConfig('basics.customize.ppsupstreamstatus', null, {
						showIcon: true,
						imageSelectorService: 'platformStatusSvgIconService',
						svgBackgroundColor: 'UpstreamItemBackgroundColor',
						backgroundColorType: 'dec',
						backgroundColorLayer: [1, 2, 3, 4, 5, 6]
					})),
					column: 'UpstreamItemStatusFk'
				},
			};

			function getStatusLookupInfo(item) {
				if (item.ProductId) {
					return statusLookupInfo.product;
				} else if (item.BundleId) {
					return statusLookupInfo.bundle;
				} else if (item.UpstreamItemId) {
					return statusLookupInfo.upstreamItem;
				}
			}

			var config = {
				'fid': 'transportplanning.bundle',
				'version': '1.0.0',
				'showGrouping': true,
				'addValidationAutomatically': true,
				'groups': [
					{
						gid: 'baseGroup',
						attributes: ['statusid', 'code', 'trsbundletypefk', 'projectfk', 'uomfk', 'targetjobfk', 'currentlocationjobfk',
							'timestamp', 'descriptioninfo', 'engdrawingfk', 'ppsheaderfk', 'ppsupstreamtypefk', 'upstreamresult', 'upstreamresultstatus',
							'ppsupstreamgoodstypefk', 'upstreamgoods', 'quantity', 'ppseventreqforfk', 'ppseventtypereqforfk',
							'prjstockfk', 'prjstocklocationfk','materialfk',
							'trsopenquantity', 'trsassignedquantity', 'availablequantity', 'openquantity', 'splitquantity', 'remainingquantity'
						]
					},
					{
						gid: 'dimensions',
						attributes: ['length', 'basuomlengthfk', 'width', 'basuomwidthfk', 'height', 'basuomheightfk', 'weight', 'basuomweightfk']
					},
					{
						gid: 'transport',
						attributes: ['trsrequisitionfk', 'isfortransport']
					},
					{
						gid: 'entityHistory',
						isHistory: true
					}
				],
				'overloads': {
					code:{
						navigator: {
							moduleName: 'transportplanning.requisition.toBeAssigned.bundleOrProduct',
							'navFunc': function (triggerFieldOption, item) {
								// goto bundle or product
								const navModuleName = item.IsProduct ? 'productionplanning.product' : (!_.isNil(item.Bundle) ? 'transportplanning.bundle' : '');
								if(navModuleName !== ''){
									$injector.get('platformModuleNavigationService').navigate({moduleName: navModuleName}, {Id: item.RealId, Code: item.Code}, 'Code');
								}
							}
						},
					},
					statusid: {
						grid: {
							formatter: 'dynamic',
							editor: 'dynamic',
							domain: function (item, column) {
								var info = getStatusLookupInfo(item);
								if (info) {
									column.editorOptions = {
										directive: 'pps-second-dynamic-grid-and-form-lookup',
										dependantField: 'IsProduct',
										lookupInfo: statusLookupInfo,
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
									column.editorOptions = null;
									column.formatterOptions = null;
								}
								return 'lookup';
							}
						},
						detail: {
							type: 'directive',
							directive: 'pps-second-dynamic-grid-and-form-lookup',
							options: {
								isTextEditable: false,
								dependantField: 'IsProduct',
								lookupInfo: statusLookupInfo,
								grid: false,
								dynamicLookupMode: true,
								showClearButton: false
							}
						},
						readonly: true
					},
					materialfk: {
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
									additionalColumns: true,
									addGridColumns: [{
										id: 'Description',
										field: 'DescriptionInfo.Translated',
										width: 150,
										name: 'Description',
										formatter: 'description',
										name$tr$: 'cloud.common.entityDescription'
									}],
									gridOptions: {
										disableCreateSimilarBtn: true
									}
								},
								directive: 'basics-material-material-lookup'
							},
							width: 100
						},
						detail: {
							type: 'directive',
							directive: 'basics-material-material-lookup',
							options: {
								showClearButton: true,
								gridOptions: {
									disableCreateSimilarBtn: true
								}
							}
						}
					},
					uomfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'basicsUnitLookupDataService',
						cacheEnable: true,
						showClearButton: true
					}),
					projectfk: platformLayoutHelperService.provideProjectLookupOverload(),
					targetjobfk: ppsCommonLayoutHelperService.provideJobExtensionLookupOverload({
						projectFk: 'ProjectFk',
						activeJob: true,
						jobType: 'external'
					}),
					currentlocationjobfk: ppsCommonLayoutHelperService.provideJobExtensionLookupOverload({
						projectFk: 'ProjectFk',
						activeJob: true,
						jobType: 'external'
					}),
					trsrequisitionfk: {
						navigator: {
							moduleName: 'transportplanning.requisition'
						},
						grid: {
							editor: 'lookup',
							editorOptions: {
								lookupOptions: {
									showClearButton: true,
									defaultFilter: {
										ProjectId: 'ProjectFk',
										ProjectIdReadOnly: true
									},
									filterKey: 'bundle-trsRequisition-filter'
								},
								directive: 'transportplanning-requisition-lookup-dialog'
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'TrsRequisition',
								displayMember: 'Code',
								version: 3
							},
							width: 70
						},
						detail: {
							type: 'directive',
							directive: 'basics-lookupdata-lookup-composite',
							options: {
								lookupOptions: {
									showClearButton: true
								},
								lookupDirective: 'transportplanning-requisition-lookup-dialog',
								descriptionMember: 'DescriptionInfo.Translated'
							}
						}
					},
					length: {
						disallowNegative: true,
						formatter: 'convert',
						nameExtension: 'uom'
					},
					basuomlengthfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'basicsUnitLookupDataService',
						cacheEnable: true,
						filterKey: uomFilterService.registerLengthDimensionFilter(1)
					}),
					width: {
						disallowNegative: true,
						formatter: 'convert',
						nameExtension: 'uom'
					},
					basuomwidthfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'basicsUnitLookupDataService',
						cacheEnable: true,
						filterKey: uomFilterService.registerLengthDimensionFilter(1)
					}),
					height: {
						disallowNegative: true,
						formatter: 'convert',
						nameExtension: 'uom'
					},
					basuomheightfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'basicsUnitLookupDataService',
						cacheEnable: true,
						filterKey: uomFilterService.registerLengthDimensionFilter(1)
					}),
					weight: {
						disallowNegative: true,
						formatter: 'convert',
						nameExtension: 'uom'
					},
					basuomweightfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'basicsUnitLookupDataService',
						cacheEnable: true,
						filterKey: uomFilterService.registerMassDimensionFilter(1)
					}),
					ppseventreqforfk: {
						grid: {
							editor: 'lookup',
							editorOptions: {
								lookupOptions: {
									showClearButton: true
								},
								directive: 'pps-common-pps-event-lookup'
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'PpsEvent',
								displayMember: 'DisplayTxt',
								version: 3
							},
							width: 70
						},
						detail: {
							type: 'directive',
							directive: 'basics-lookupdata-lookup-composite',
							options: {
								lookupOptions: {
									showclearButton: true,
									version: 3
								},
								lookupDirective: 'pps-common-pps-event-lookup',
								descriptionMember: 'DescriptionInfo.Description'
							}
						}
					},
					ppseventtypereqforfk: {
						grid: {
							editor: 'lookup',
							editorOptions: {
								lookupOptions: {
									showClearButton: true,
									additionalFilters: {
										'isForSequence': true
									}
								},
								directive: 'productionplanning-common-event-type-lookup'
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'EventType',
								displayMember: 'DescriptionInfo.Translated',
								version: 3
							},
							width: 70
						},
						detail: {
							type: 'directive',
							directive: 'basics-lookupdata-lookup-composite',
							options: {
								lookupOptions: {
									showclearButton: true,
									version: 3
								},
								lookupDirective: 'productionplanning-common-event-type-lookup',
								descriptionMember: 'DescriptionInfo.Description'
							}
						}
					},
					isfortransport: {
						width: 80
					},
					islive: {
						readonly: true
					},
					productionorder: {
						readonly: true
					},
					reproduced: {
						readonly: true
					},
					trsbundletypefk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.transportbundletype', null, {
						showIcon: true
					}),
					engdrawingfk: {
						navigator: {
							moduleName: 'productionplanning.drawing'
						},
						readonly: true,
						grid: {
							editor: 'lookup',
							directive: 'basics-lookupdata-lookup-composite',
							editorOptions: {
								directive: 'productionplanning-drawing-dialog-lookup',
								lookupOptions: {
									displayMember: 'Code',
									defaultFilter: {projectId: 'ProjectFk'}
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
								lookupDirective: 'productionplanning-drawing-dialog-lookup',
								descriptionMember: 'Description',
								lookupOptions: {
									defaultFilter: {projectId: 'ProjectFk'}
								}
							}
						},
					},
					ppsheaderfk: {
						navigator: {
							moduleName: 'productionplanning.item'
						},
						grid: {
							editor: 'lookup',
							directive: 'basics-lookupdata-lookup-composite',
							editorOptions: {
								directive: 'productionplanning-common-header-simple-lookup',
								lookupOptions: {
									filterKey: 'pps-header-with-job-info-filter'
								}
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'CommonHeaderV3',
								displayMember: 'Code',
								version: 3
							},
							width: 70
						},
						detail: {
							type: 'directive',
							directive: 'basics-lookupdata-lookup-composite',
							options: {
								lookupOptions: {
									filterKey: 'pps-header-with-job-info-filter'
								},
								lookupDirective: 'productionplanning-common-header-simple-lookup',
								descriptionMember: 'DescriptionInfo.Translated'
							}
						}
					},
					prjstockfk: {
						grid: {
							editor: 'lookup',
							editorOptions: {
								directive: 'basics-site-stock-lookup-dialog',
								lookupOptions: {
									displayMember: 'Code',
									addGridColumns: [{
										id: 'Description',
										field: 'Description',
										name: 'Description',
										formatter: 'description',
										name$tr$: 'cloud.common.entityDescription',
										width: 200
									}],
									additionalColumns: true
								}
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'ProjectStockNew',
								displayMember: 'Code',
								version: 3
							}
						},
						detail: {
							type: 'directive',
							directive: 'basics-lookupdata-lookup-composite',
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'ProjectStockNew',
								displayMember: 'Code',
								version: 3
							},
							options: {
								lookupDirective: 'basics-site-stock-lookup-dialog',
								descriptionMember: 'Description'
							}
						},
						readonly: true
					},
					prjstocklocationfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'projectStockLocationLookupDataService',
						enableCache: true,
						valMember: 'Id',
						dispMember: 'Code',
						filter: function (item) {
							return !_.isNil(item.PrjStockFk) ? item.PrjStockFk : undefined;
						},
						readonly: true
					}),
					ppsupstreamgoodstypefk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.ppsupstreamgoodstype', null, {filterKey: 'ppsitem-upstream-goodtype-filter',showClearButton: true}),
					upstreamgoods: {
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
					ppsupstreamtypefk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.ppsupstreamtype', null, {showClearButton: true}),
					upstreamresult: {
						detail: {
							type: 'directive',
							directive: 'pps-dynamic-grid-and-form-lookup',// could not use the same dynamic directive more than one time, not found reason yet
							options: {
								isTextEditable: false,
								dependantField: 'PpsUpstreamTypeFk',
								lookupInfo: upstreamTypes.lookupInfo,
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
								var prop = upstreamTypes.lookupInfo[item.PpsUpstreamTypeFk];
								let finalOptions = _.clone(upstreamResultLookupOptions);
								switch (item.PpsUpstreamTypeFk) {
									case 4:
										finalOptions.filterKey = pesItemPrjFilterKey;
								}
								if (prop && prop.column) {
									column.editorOptions = {
										directive: prop.lookup.options.lookupDirective,
										lookupOptions: finalOptions
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
					upstreamresultstatus: {
						readonly: true,
						grid: {
							formatter: 'dynamic',
							editor: 'dynamic',
							domain: function (item, column) {
								var options = {};
								switch (item.PpsUpstreamTypeFk) {
									case 1:
										options = basicsLookupdataConfigGenerator.provideReadOnlyConfig('basics.customize.ppsitemstatus', null, {
											showIcon: true
										}).grid;
										break;
									case 2:
										options.formatterOptions = {
											lookupType: 'PackageStatus',
											displayMember: 'DescriptionInfo.Translated',
											imageSelector: 'platformStatusIconService'
										};
										break;
									case 3:
										options = basicsLookupdataConfigGenerator.provideReadOnlyConfig('basics.customize.resrequisitionstatus', null, {
											showIcon: true
										}).grid;
										break;
									case 4:
										options.formatterOptions = {
											lookupType: 'PesStatus',
											displayMember: 'Description',
											imageSelector: 'platformStatusIconService'
										};
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
						}
					},
					availablequantity: {
						readonly: true
					},
					openquantity: {
						readonly: true
					},
					splitquantity: {
						readonly: true
					},
					remainingquantity:{
						readonly:true
					},
					trsopenquantity:{
						readonly:true
					},
					trsassignedquantity:{
						readonly:true
					}
				}
			};

			return config;
		}};
		
	}

})(angular);