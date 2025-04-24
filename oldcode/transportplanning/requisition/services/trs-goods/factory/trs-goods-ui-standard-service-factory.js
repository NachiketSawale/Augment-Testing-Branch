/**
 * Created by anl on 5/8/2020.
 */

(function () {
	'use strict';
	/*global angular*/

	var moduleName = 'transportplanning.requisition';
	angular.module(moduleName).factory('transportplanningRequisitionTrsGoodsUIStandardServiceFactory', UIStandardService);

	UIStandardService.$inject = ['platformUIConfigInitService', 'platformLayoutHelperService', 'transportplanningRequisitionTranslationService', 'basicsLookupdataConfigGenerator',
		'trsGoodsTypes', 'platformUIStandardExtentService',
		'basicsCommonUomDimensionFilterService',
		'$injector',
		'platformObjectHelper',
		'$q', '_', 'ppsCommonLayoutOverloadService', 'productionplanningCommonLayoutHelperService'];

	function UIStandardService(platformUIConfigInitService, platformLayoutHelperService, translationService,
							   basicsLookupdataConfigGenerator,
							   trsGoodsTypes,
							   platformUIStandardExtentService,
							   uomFilterService,
							   $injector,
							   platformObjectHelper,
							   $q, _, ppsCommonLayoutOverloadService,
							   ppsCommonLayoutHelperService) {

		var factory = {};

		var serviceCache = {};

		factory.createNewService = function (dataService) {
			var service = {};
			var goodLookupOptions = {
				notChangeProjectByJob: true,
				events: [
					{
						name: 'onSelectedItemChanged',
						handler: function (e, args) {
							args.entity.selectedGood = args.selectedItem;
							//change selected good!
							let lookupInfo = trsGoodsTypes.lookupInfo[args.entity.TrsGoodsTypeFk] || {};
							if (_.isFunction(dataService.selectedGoodChanged)) {
								dataService.selectedGoodChanged(args.entity, args.selectedItem, args.previousItem);
							}
						}
					},
					{
						name: 'onSelectedItemsChanged',
						handler: function (e, args) {
							var allowMultiSelected = args.lookupOptions.lookupType === 'CommonProduct'
													|| args.lookupOptions.lookupType === 'MaterialCommodity'
													|| args.lookupOptions.lookupType === 'ResourceMasterResource';

							if (allowMultiSelected && args.selectedItems.length > 1) {
								var sample = dataService.getSelected();
								var targets = _.clone(args.selectedItems);
								targets.shift();
								dataService.createItems(targets, sample.TrsGoodsTypeFk);
							}
						}
					}
				],
				defaultFilter: dataService && dataService.getDefaultFilter ? dataService.getDefaultFilter : undefined,
				gridOptions: {
					multiSelect: true,
					disableCreateSimilarBtn: true
				}//no solution to dynamic this to detail form part, so all of the type set it
			};

			var layout = platformLayoutHelperService.getMultipleGroupsBaseLayout('1.0.0', 'trs.requisition.trsgoods',
				['trsgoodstypefk', 'good', 'uomfk', 'quantity', 'description', 'commenttext', 'engdrawingfk', 'currentlocationjobfk'],
				[{
					gid: 'dimensions',
					attributes: ['length', 'basuomlengthfk', 'width', 'basuomwidthfk', 'height', 'basuomheightfk', 'weight', 'basuomweightfk', 'minproductstatus', 'maxproductstatus']
				}, {
					gid: 'transportInformation',
					attributes: ['ontime', 'planningstate', 'pkgsquantity', 'minpkgsstatus', 'maxpkgsstatus']
				}, {
					gid: 'productsGroup',
					attributes: ['productsdescription', 'producttemplatecodes', 'producttemplatedescriptions', 'minproductiondate', 'maxproductiondate']
				},{
					gid: 'dangerousGoodsGroup',
					attributes: ['basdangerclassfk', 'dangerquantity', 'basuomdgfk']
				}, platformLayoutHelperService.getUserDefinedTextGroup(5, null, 'userdefined', '')]);
			layout.overloads = {
				trsgoodstypefk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.transportgoodstype', null, {showIcon: true}),
				good: {
					detail: {
						type: 'directive',
						directive: 'dynamic-grid-and-form-lookup',
						options: {
							isTextEditable: false,
							dependantField: 'TrsGoodsTypeFk',
							lookupInfo: trsGoodsTypes.lookupInfo,
							grid: false,
							dynamicLookupMode: true,
							showClearButton: false,
							lookupOptions: goodLookupOptions
						}
					},
					grid: {
						formatter: 'dynamic',
						editor: 'dynamic',
						domain: function (item, column) {
							var prop = trsGoodsTypes.lookupInfo[item.TrsGoodsTypeFk];
							if (prop && prop.column) {
								column.editorOptions = {
									directive: prop.lookup.options.lookupDirective,
									lookupOptions: goodLookupOptions
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
				uomfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
					dataServiceName: 'basicsUnitLookupDataService',
					cacheEnable: true
				}),
				length: {
					readonly: true,
					disallowNegative: true,
					formatter: 'convert',
					nameExtension: 'uom'
				},
				basuomlengthfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
					dataServiceName: 'basicsUnitLookupDataService',
					cacheEnable: true,
					filterKey: uomFilterService.registerLengthDimensionFilter(1),
					readonly: true
				}),
				width: {
					readonly: true,
					disallowNegative: true,
					formatter: 'convert',
					nameExtension: 'uom'
				},
				basuomwidthfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
					dataServiceName: 'basicsUnitLookupDataService',
					cacheEnable: true,
					filterKey: uomFilterService.registerLengthDimensionFilter(1),
					readonly: true
				}),
				height: {
					readonly: true,
					disallowNegative: true,
					formatter: 'convert',
					nameExtension: 'uom'
				},
				basuomheightfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
					dataServiceName: 'basicsUnitLookupDataService',
					cacheEnable: true,
					filterKey: uomFilterService.registerLengthDimensionFilter(1),
					readonly: true
				}),
				weight: {
					readonly: true,
					disallowNegative: true,
					formatter: 'convert',
					nameExtension: 'uom'
				},
				basuomweightfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
					dataServiceName: 'basicsUnitLookupDataService',
					cacheEnable: true,
					filterKey: uomFilterService.registerMassDimensionFilter(1),
					readonly: true
				}),
				ontime: {readonly: true},
				planningstate: {readonly: true},
				pkgsquantity: {readonly: true},
				minpkgsstatus: basicsLookupdataConfigGenerator.provideReadOnlyConfig('basics.customize.trspackagetatus', null, {
					showIcon: true
				}),
				maxpkgsstatus: basicsLookupdataConfigGenerator.provideReadOnlyConfig('basics.customize.trspackagetatus', null, {
					showIcon: true
				}),
				minproductstatus: basicsLookupdataConfigGenerator.provideReadOnlyConfig('basics.customize.ppsproductstatus', null, {
					showIcon: true
				}),
				maxproductstatus: basicsLookupdataConfigGenerator.provideReadOnlyConfig('basics.customize.ppsproductstatus', null, {
					showIcon: true
				}),
				basdangerclassfk: {
					grid: {
						editor: 'lookup',
						editorOptions: {
							lookupOptions:{
								disableInput: true
							},
							directive: 'basics-lookupdata-danger-class-combobox'
						},
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'dangerclass',
							displayMember: 'Code'
						}
					},
					detail: {
						type: 'directive',
						directive: 'basics-lookupdata-lookup-composite',
						options: {
							lookupDirective: 'basics-lookupdata-danger-class-combobox',
							descriptionMember: 'DescriptionInfo.Translated',
							eagerLoad: true
						}
					}
				},
				basuomdgfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
					dataServiceName: 'basicsUnitLookupDataService',
					cacheEnable: true,
					showClearButton: false
				}, {required : true}),

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
							lookupDirective: 'productionplanning-drawing-dialog-lookup',
							descriptionMember: 'Description'
						}
					}
				},
				currentlocationjobfk : ppsCommonLayoutHelperService.provideJobExtensionLookupOverload({
					projectFk: 'ProjectFk',
					activeJob: true,
					jobType: 'external',
				}),
			},
			platformUIConfigInitService.createUIConfigurationService({
				service: service,
				layout: layout,
				dtoSchemeId: {
					moduleSubModule: 'TransportPlanning.Requisition',
					typeName: 'TrsGoodsDto'
				},
				translator: translationService
			});

			var deliveryInfo = {
				grid: [{
					id: 'routeCodes',
					field: 'RoutesInfo.Codes',
					name: 'Routes',
					name$tr$: 'transportplanning.transport.TransportCodes',
					sortable: true,
					editor: null,
					formatter: 'description',
					readonly: true,
					navigator: {
						moduleName: 'transportplanning.transport'
					}
				}], detail: [{
					rid: 'routeCodes',
					gid: 'transportInformation',
					model: 'RoutesInfo.Codes',
					label: 'Transport Routes',
					label$tr$: 'transportplanning.transport.TransportCodes',
					type: 'description',
					readonly: true,
					navigator: {
						moduleName: 'transportplanning.transport'
					}
				}]
			};

			function gengerateUIConfig(commonConfigs) {
				var configs = _.map(commonConfigs, function (commonConfig) {
					var config = {};
					config.grid = _.assign({}, commonConfig);
					config.detail = {
						afterId: commonConfig.afterId,
						rid: commonConfig.id,
						gid: commonConfig.gid,
						model: commonConfig.field,
						label: commonConfig.name,
						label$tr$: commonConfig.name$tr$,
						readonly: commonConfig.editor === null,
						type: commonConfig.formatter === 'lookup' ? 'directive' : commonConfig.formatter,
						directive: commonConfig.directive,
						options: commonConfig.options
					};
					return config;
				});
				return {
					grid: _.flatMap(configs, 'grid'),
					detail: _.flatMap(configs, 'detail')
				};
			}
						
			const bundleProductCollectionInfo = gengerateUIConfig([
				{
					afterId: 'basuomweightfk',
					id: 'productsWeightSum',
					gid: 'dimensions',
					field: 'ProductsDimensionInfo.ProductsWeightSum.Value',
					name: 'Products Weight Sum',
					name$tr$: 'transportplanning.bundle.product.entityProductsWeightSum',
					sortable: true,
					editor: null,
					formatter: 'convert',
					weightsourceuomfactor: 1
				}, {
					afterId: 'productsWeightSum',
					id: 'productsActualWeightSum',
					gid: 'dimensions',
					field: 'ProductsDimensionInfo.ProductsActualWeightSum.Value',
					name: '*Products Total Actual Weight',
					name$tr$: 'transportplanning.bundle.product.entityProductsActualWeightSum',
					sortable: true,
					editor: null,
					formatter: 'convert',
					weightsourceuomfactor: 1
				},
				{
					afterId: 'productsActualWeightSum',
					id: 'productsAreaSum',
					gid: 'dimensions',
					field: 'ProductsDimensionInfo.ProductsAreaSum.Value',
					name: '*Products Area Sum',
					name$tr$: 'transportplanning.bundle.product.entityProductsAreaSum',
					sortable: true,
					editor: null,
					formatter: 'convert',
					areasourceuomfactor: 1
				}, {
					afterId: 'productsAreaSum',
					id: 'productsHeightSum',
					gid: 'dimensions',
					field: 'ProductsDimensionInfo.ProductsHeightSum.Value',
					name: 'Products Height Sum',
					name$tr$: 'transportplanning.bundle.product.entityProductsHeightSum',
					sortable: true,
					editor: null,
					formatter: 'decimal'
				}, {
					afterId: 'productsHeightSum',
					id: 'productsMaxLength',
					gid: 'dimensions',
					field: 'ProductsDimensionInfo.ProductsMaxLength.Value',
					name: 'Products Max Length',
					name$tr$: 'transportplanning.bundle.product.entityProductsMaxLength',
					sortable: true,
					editor: null,
					formatter: 'decimal'
				}, {
					afterId: 'productsMaxLength',
					id: 'productsMaxWidth',
					gid: 'dimensions',
					field: 'ProductsDimensionInfo.ProductsMaxWidth.Value',
					name: 'Products Max Width',
					name$tr$: 'transportplanning.bundle.product.entityProductsMaxWidth',
					sortable: true,
					editor: null,
					formatter: 'decimal'
				}
			]);

			const prjStockLocation = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
				dataServiceName: 'projectStockLocationLookupDataService',
				enableCache: true,
				valMember: 'Id',
				dispMember: 'Code',
				filter: function (item) {
					return !_.isNil(item.PrjStockFk) ? item.PrjStockFk : undefined;
				},
				readonly: true
			});

			const prjStock = {
				grid: [{
					afterId: 'productsMaxWidth',
					id: 'prjStockFk',
					gid: 'productsGroup',
					field: 'PrjStockFk',
					name: '*Stock',
					name$tr$: 'procurement.common.entityPrjStock',
					sortable: true,
					editor: null,
					formatter: 'lookup',
					formatterOptions: {
						displayMember: 'Code',
						lookupType: 'ProjectStockNew',
						version: 3
					}
				}, {
					afterId: 'prjStockFk',
					id: 'prjStockDescription',
					gid: 'productsGroup',
					field: 'PrjStockFk',
					name: '*Stock-Description',
					name$tr$: 'transportplanning.bundle.product.stockDescription',
					sortable: true,
					editor: null,
					formatter: 'lookup',
					formatterOptions: {
						displayMember: 'Description',
						lookupType: 'ProjectStockNew',
						version: 3
					}
				}, _.merge(prjStockLocation.grid, {
					'afterId': 'prjStockDescription',
					'id': 'prjStockLocationFk',
					'gid': 'productsGroup',
					'field': 'PrjStockLocationFk',
					'name': '*Stock Location',
					'name$tr$': 'procurement.common.entityPrjStockLocation',
					'sortable': true
				}), {
					afterId: 'prjStockLocationFk',
					id: 'prjStockLocationDescription',
					gid: 'productsGroup',
					field: 'PrjStockLocationFk',
					name: '*Stock Location-Description',
					name$tr$: 'transportplanning.bundle.product.stockLocationDescription',
					sortable: true,
					editor: null,
					formatter: 'lookup',
					formatterOptions: {
						displayMember: 'DescriptionInfo.Translated',
						dataServiceName: 'projectStockLocationLookupDataService',
						version: 3
					},
				}],
				detail: [{
					afterId: 'productsMaxWidth',
					rid: 'prjStockFk',
					gid: 'productsGroup',
					model: 'PrjStockFk',
					label: '*Stock',
					label$tr$: 'procurement.common.entityPrjStock',
					type: 'directive',
					directive: 'basics-lookupdata-lookup-composite',
					options: {
						descriptionMember: 'Description',
						lookupDirective: 'basics-site-stock-lookup-dialog'
					},
					readonly: true
				}, {
					afterId: 'prjStockFk',
					rid: 'prjStockLocationFk',
					gid: 'productsGroup',
					model: 'PrjStockLocationFk',
					label: '*Stock Location',
					label$tr$: 'procurement.common.entityPrjStockLocation',
					type: 'directive',
					directive: 'basics-lookupdata-lookup-composite',
					options: {
						descriptionMember: 'DescriptionInfo.Translated',
						lookupDirective: 'basics-lookup-data-by-custom-data-service',
						lookupOptions: {
							displayMember: 'Code',
							dataServiceName: 'projectStockLocationLookupDataService',
							filter: function (item) {
								return !_.isNil(item.PrjStockFk) ? item.PrjStockFk : undefined;
							}
						}
					},
					readonly: true
				}]
			};

			var addition = {
				grid: _.concat(platformObjectHelper.extendGrouping([{
					afterId: 'good',
					id: 'goodDescription',
					field: 'Good',
					name: '*Good Description',
					name$tr$: 'transportplanning.requisition.trsGoods.goodDescription',
					formatter: 'dynamic',
					domain: function (item, column) {
						var prop = trsGoodsTypes.lookupInfo[item.TrsGoodsTypeFk];
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
					field: 'PpsUpstreamItemFk',
					name: '*Belonging',
					name$tr$: 'productionplanning.item.upstreamItem.belonging',
					readonly: true,
					formatter: 'image',
					formatterOptions: {
						imageSelector: 'trsGoodsUpstreamItemIconService',
						tooltip: true
					}
				}]), deliveryInfo.grid, bundleProductCollectionInfo.grid, prjStock.grid),
				detail: _.concat([],deliveryInfo.detail, bundleProductCollectionInfo.detail, prjStock.detail)
			};

			//set the callback function manually, in case the detail container not load
			_.forEach(service.getStandardConfigForDetailView().rows, function (row) {
				row.change = function (entity, field) {
					dataService.onPropertyChanged(entity, field);
				};
			});

			platformUIStandardExtentService.extend(service, addition);

			if (dataService && dataService.additionalUIConfigs) {
				processAdditionalUIConfigs(service, dataService.additionalUIConfigs);
			}
			ppsCommonLayoutOverloadService.translateCustomUom(service);
			return service;
		};

		function processAdditionalUIConfigs(currentService, additionalUIConfigs) {
			var trsGoodsLayout = currentService.getStandardConfigForListView();
			_.forEach(additionalUIConfigs.combineUIConfigs, function (config) {
				var gridLayout = $injector.get(config.UIService).getStandardConfigForListView();
				_.forEach(gridLayout.columns, function (column) {
					var map = _.find(config.columns, {id: column.id});
					if (map) {
						var cloned = _.cloneDeep(column);
						_.extend(cloned, map.overload);
						trsGoodsLayout.columns.push(cloned);
					}
				});
			});

			_.forEach(trsGoodsLayout.columns, function (column) {
				if (!_.includes(additionalUIConfigs.editableColumns, column.id)) {
					column.editor = null;
				}
			});

			currentService.getStandardConfigForListView = function () {
				return trsGoodsLayout;
			};
		}

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
