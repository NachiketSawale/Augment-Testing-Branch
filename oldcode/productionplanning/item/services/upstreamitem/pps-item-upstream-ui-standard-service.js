/**
 * Created by lav on 7/21/2019.
 */
(function () {
	/* global _ */
	'use strict';
	const moduleName = 'productionplanning.item';

	angular.module(moduleName).factory('ppsUpstreamItemLayout', Layout);

	Layout.$inject = ['basicsLookupdataConfigGenerator', 'basicsLookupdataLookupFilterService', 'ppsProjectUtilService', 'productionplanningItemDataService',
		'upstreamTypes', 'upstreamGoodsTypes', 'prcPackageCreateService', 'basicsCommonCreateDialogConfigService',
		'moment', 'resRequisitionCreateOption', '$injector', 'platformLayoutHelperService'];

	function Layout(basicsLookupdataConfigGenerator, basicsLookupdataLookupFilterService, ppsProjectUtilService, productionplanningItemDataService,
					upstreamTypes, upstreamGoodsTypes, prcPackageCreateService, createDialogConfigService,
					moment, resRequisitionCreateOption, $injector, platformLayoutHelperService) {
		function createLayout(dataService) {
			// register filter
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

			//initialize some necessary translation first, to avoid active cell destroy
			//platformgrid.directive.js destroy()
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
								entity.PpsItemUpstreamFk = newItem.Id;
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
						//disbaled for now - start via wizard

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
				// filterKey: 'pps-upstream-item-material-is-product-filter',
				events: [
					{
						name: 'onSelectedItemChanged',
						handler: function (e, args) {
							args.entity.selectedUpstreamGoods = args.selectedItem;
						}
					}
				]
			};

			var result = {
				'fid': 'productionplanning.item.ppsUpstreamItemLayout',
				'version': '1.0.0',
				'showGrouping': true,
				'addValidationAutomatically': true,
				addAdditionalColumns: true,
				'groups': [
					{
						gid: 'baseGroup',
						attributes: ['ppsitemfk', 'ppsupstreamstatusfk', 'ppsupstreamtypefk', 'upstreamresult', 'upstreamresultstatus', 'ppsupstreamgoodstypefk', 'upstreamgoods', 'quantity', 'uomfk',
							'comment', 'ppseventreqforfk', 'availablequantity', 'openquantity', 'splitquantity', 'remainingquantity', 'ppseventtypereqforfk', 'isfortransport', 'isimported', 'trsopenquantity',
							'trsassignedquantity', 'engdrawingfk','prcstocktransactiontypefk', 'prjstockfk', 'transactioninfo']
					},
					{
						gid: 'planningGroup',
						attributes: ['duedate']
					},
					{
						gid: 'userDefTextGroup',
						isUserDefText: true,
						attCount: 5,
						attName: 'userdefined',
						noInfix: true
					},
					platformLayoutHelperService.getUserDefinedDateGroup(5, 'userDefDateGroup', 'userdefineddate', ''),
					platformLayoutHelperService.getUserDefinedDateGroup(5, 'userDefDateTimeGroup', 'userdefineddatetime', ''),
					{
						gid: 'entityHistory',
						isHistory: true
					}
				],
				'overloads': {
					ppsitemfk: {
						navigator: {
							moduleName: 'productionplanning.item'
						},
						grid: {
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'PPSItem',
								displayMember: 'Code',
								version: 3
							},
							editor: 'lookup',
							editorOptions: {
								directive: 'pps-item-complex-lookup',
								displayMember: 'Code',
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
									defaultFilter: {
										ProjectId: 'PrjProjectFk',
										JobId: 'LgmJobFk'
									}
								}
							}
						},
						detail: {
							type: 'directive',
							directive: 'basics-lookupdata-lookup-composite',
							options: {
								lookupDirective: 'pps-item-complex-lookup',
								descriptionMember: 'DescriptionInfo.Translated',
								lookupOptions: {
									showClearButton: true,
									defaultFilter: {
										ProjectId: 'PrjProjectFk',
										JobId: 'LgmJobFk'
									}
								}
							}
						}
					},
					ppsupstreamstatusfk: basicsLookupdataConfigGenerator.provideReadOnlyConfig('basics.customize.ppsupstreamstatus', null, {
						showIcon: true,
						imageSelectorService: 'platformStatusSvgIconService',
						svgBackgroundColor: 'BackgroundColor',
						backgroundColorType: 'dec',
						backgroundColorLayer: [1, 2, 3, 4, 5, 6]
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
									column.editorOptions.lookupOptions.filterKey = (item.PpsUpstreamGoodsTypeFk === upstreamGoodsTypes.Material && item.PpsUpstreamTypeFk === upstreamTypes.Production) ? 'pps-upstream-item-material-is-product-filter' : null;
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
							directive: 'pps-dynamic-grid-and-form-lookup',//could not use the same dynamic directive more than one time, not found reason yet
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
										break;
									case 2:
										finalOptions.showAddButton = false;
										break;
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
					uomfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'basicsUnitLookupDataService',
						cacheEnable: true,
						showClearButton: true
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
					availablequantity: {
						readonly: true
					},
					openquantity: {
						readonly: true
					},
					// ppsupstreamitemfk:{
					// 	readonly: true,
					// 	grid:{
					// 		formatter: 'lookup',
					// 		formatterOptions:{
					// 			lookupType: 'PpsUpstreamItem',
					// 			displayMember: 'Comment',
					// 			version: 3
					// 		}
					// 	}
					// },
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
					},
					ppseventtypereqforfk: {
						grid: {
							editor: 'lookup',
							editorOptions: {
								lookupOptions: {
									showClearButton: true,
									additionalFilters:{
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
					isimported:{
						readonly:true
					},
					engdrawingfk: {
						readonly:true,
						navigator: {
							moduleName: 'productionplanning.drawing'
						},
						grid: {
							formatter: 'lookup',
							formatterOptions: {
								version: 3,
								lookupType: 'EngDrawing',
								displayMember: 'Code'
							},
							width: 70
						},
					},
					prcstocktransactiontypefk: {
						readonly: true,
						'grid': {
							'formatter': 'lookup',
							'formatterOptions': {
								'lookupType': 'StockTransactionType',
								'displayMember': 'DescriptionInfo.Translated',
								'imageSelector': 'basicsCustomizeProcurementStockTransactionTypeIconService'
							},
							'width': 100
						},
						'detail': {
							'type': 'directive',
							'directive': 'procurement-stock-transaction-type-dialog'
						}
					},
					'prjstockfk': {
						readonly: true,
						grid: {
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'ProjectStock',
								displayMember: 'Code'
							},
							width: 100
						},
						detail: {
							type: 'directive',
							directive: 'basics-lookupdata-lookup-composite',
							options: {
								lookupDirective: 'procurement-stock-lookup-dialog',
								descriptionMember: 'Description'
							}
						}
					},
					transactioninfo: {
						readonly: true,
						grid: {
							formatter: 'image',
							formatterOptions: {
								imageSelector: 'ppsUpstreamItemTransactionInfoIconService',
								tooltip: true
							}
						},
						detail: {
							type: 'imageselect',
							options: {
								useLocalIcons: true,
								items: $injector.get('ppsUpstreamItemTransactionInfoIconService').getIcons()
							}
						}
					}
				}
			};

			if (dataService.additionalColumns) {
				_.forEach(dataService.additionalColumns, function (column) {
					switch (column) {
						case 'ppsitemfk':
							_.find(result.groups, {gid: 'baseGroup'}).attributes.unshift(column);
							break;
					}
				});
			}

			return result;
		}

		return {
			createLayout: createLayout
		};
	}
})();

(function () {
	'use strict';
	var moduleName = 'productionplanning.item';

	angular.module(moduleName).service('ppsUpstreamItemUIStandardService', UIStandardService);

	UIStandardService.$inject = ['platformUIConfigInitService', 'productionplanningItemTranslationService',
		'ppsUpstreamItemLayout', 'upstreamTypes', 'platformUIStandardExtentService',
		'platformObjectHelper', 'upstreamGoodsTypes'];

	function UIStandardService(platformUIConfigInitService, productionplanningItemTranslationService,
							   layout, upstreamTypes, platformUIStandardExtentService,
							   platformObjectHelper, upstreamGoodsTypes) {

		var factory = {};

		var serviceCache = {};

		factory.createNewService = function (dataService) {
			var service = {};

			platformUIConfigInitService.createUIConfigurationService({
				service: service,
				layout: layout.createLayout(dataService),
				dtoSchemeId: {
					moduleSubModule: 'ProductionPlanning.Item',
					typeName: 'PpsUpstreamItemDto'
				},
				translator: productionplanningItemTranslationService
			});

			//set the callback function manually, in case the detail container not load
			_.forEach(service.getStandardConfigForDetailView().rows, function (row) {
				row.change = function (entity, field) {
					dataService.onPropertyChanged(entity, field);
				};
			});

			var addition = {
				grid: platformObjectHelper.extendGrouping([{
					afterId: 'upstreamresult',
					id: 'upstreamresultdescription',
					field: 'UpstreamResult',
					name: '*Upstream Result Description',
					name$tr$: 'productionplanning.item.upstreamItem.upstreamResultDesc',
					formatter: 'dynamic',
					domain: function (item, column) {
						var prop = upstreamTypes.lookupInfo[item.PpsUpstreamTypeFk];
						if (prop && prop.column) {
							column.formatterOptions = _.clone(prop.lookup.formatterOptions);
							column.formatterOptions.displayMember = column.formatterOptions.descriptionMember || 'DescriptionInfo.Translated';
						} else {
							column.editorOptions = null;
							column.formatterOptions = null;
						}
						return 'lookup';
					}
				}, {
					afterId: 'upstreamgoods',
					id: 'upstreamgoodsdescription',
					field: 'UpstreamGoods',
					name: '*Upstream Goods Description',
					name$tr$: 'productionplanning.item.upstreamItem.upstreamGoodsDesc',
					formatter: 'dynamic',
					domain: function (item, column) {
						var prop = upstreamGoodsTypes.lookupInfo[item.PpsUpstreamGoodsTypeFk];
						if (prop && prop.column) {
							column.formatterOptions = _.clone(prop.lookup.formatterOptions);
							column.formatterOptions.displayMember = 'DescriptionInfo.Translated';
						} else {
							column.editorOptions = null;
							column.formatterOptions = null;
						}
						return 'lookup';
					}
				},{
					id: 'belonging',
					field: 'Belonging',
					name: '*Belonging',
					name$tr$: 'productionplanning.item.upstreamItem.belonging',
					readonly: true,
					formatter: 'image',
					formatterOptions: {
						imageSelector: 'ppsItemUpstreamItemIconService',
						tooltip: true
					}
				}])
			};

			platformUIStandardExtentService.extend(service, addition);

			return service;
		};

		factory.getService = function (dataService) {
			var key = dataService.getServiceName();
			if (_.isNil(serviceCache[key])) {
				serviceCache[key] = factory.createNewService(dataService);
			}
			return serviceCache[key];
		};

		return factory;
	}
})();