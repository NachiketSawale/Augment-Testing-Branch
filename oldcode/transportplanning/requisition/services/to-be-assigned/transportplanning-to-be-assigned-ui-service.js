(function (angular) {
	'use strict';

	var moduleName = 'transportplanning.requisition';

	angular.module(moduleName).factory('transportplanningToBeAssignedUIReadonlyService',
		['transportplanningToBeAssignedUIStandardService',
			function (uiStandardService) {

				return {getReadOnlyUIService: function (dataService) {
					var columns = _.cloneDeep(uiStandardService.getUIService(dataService).getStandardConfigForListView().columns);
					_.forEach(columns, function (o) {
						o.editor = null;
					});
					var rows = _.cloneDeep(uiStandardService.getUIService(dataService).getStandardConfigForDetailView().rows);
					_.forEach(rows, function (o) {
						o.reaonly = true;
					});
					return {
						getStandardConfigForListView: function () {
							return {
								columns: columns
							};
						},
						getStandardConfigForDetailView: function () {
							return {
								rows: rows
							};
						}
					};
				}};
			}]);

	angular.module(moduleName).factory('transportplanningToBeAssignedUIStandardService', UIStandardService);
	UIStandardService.$inject = ['_', 'platformTranslateService', 'platformUIStandardConfigService',
		'platformSchemaService', 'platformUIStandardExtentService',
		'transportplanningBundleTranslationService', 'transportplanningToBeAssignedLayout',
		'ppsCommonCustomColumnsServiceFactory', 'ppsCommonLayoutOverloadService',
		'basicsLookupdataConfigGenerator', 'ppsCommonTransportInfoHelperService', 'productionplanningCommonLayoutHelperService',
		'platformObjectHelper',
		'upstreamTypes',
		'upstreamGoodsTypes'];

	function UIStandardService(_, platformTranslateService, platformUIStandardConfigService,
		platformSchemaService, platformUIStandardExtentService,
		transportplanningBundleTranslationService, transportplanningToBeAssignedLayout,
		customColumnsServiceFactory, ppsCommonLayoutOverloadService,
		basicsLookupdataConfigGenerator, ppsCommonTransportInfoHelperService, ppsCommonLayoutHelperService,
		platformObjectHelper,
		upstreamTypes,
		upstreamGoodsTypes) {

		return {getUIService: function (dataService) {
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

			var BaseService = platformUIStandardConfigService;

			var attributeDomains = platformSchemaService.getSchemaFromCache({
				typeName: 'ToBeAssignedDto',
				moduleSubModule: 'TransportPlanning.Bundle'
			}).properties;

			let toBeAssigned = {
				grid: []
			};
			ppsCommonTransportInfoHelperService.addAdditionUiConfiguration(toBeAssigned);

			var productsStatusMinLookup = basicsLookupdataConfigGenerator.provideReadOnlyConfig('basics.customize.ppsproductstatus', null, {
				field: 'ProductCollectionInfo.ProductsStatusMinId',
				showIcon: true,
				imageSelectorService: 'platformStatusSvgIconService',
				svgBackgroundColor: 'ProductStatusBackgroundColor',
				backgroundColorType: 'dec',
				backgroundColorLayer: [1, 2, 3, 4, 5, 6]
			});
			var productStatusMaxLookup = basicsLookupdataConfigGenerator.provideReadOnlyConfig('basics.customize.ppsproductstatus', null, {
				field: 'ProductCollectionInfo.ProductsStatusMaxId',
				showIcon: true,
				imageSelectorService: 'platformStatusSvgIconService',
				svgBackgroundColor: 'ProductStatusBackgroundColor',
				backgroundColorType: 'dec',
				backgroundColorLayer: [1, 2, 3, 4, 5, 6]
			});

			var productInfo = gengerateUIConfig(
				[{
					id: 'mdcMaterials',
					gid: 'products',
					field: 'ProductCollectionInfo.MaterialInfos',
					name: 'Materials',
					name$tr$: 'transportplanning.bundle.product.materialInfos',
					sortable: true,
					editor: null,
					readonly: true,
					formatter: 'description'
				},{
					afterId: 'mdcMaterials',
					id: 'productsDescription',
					gid: 'products',
					field: 'ProductCollectionInfo.ProductsDescription',
					name: '*Descriptions of Products',
					name$tr$: 'transportplanning.requisition.trsGoods.descriptionsOfProducts',
					sortable: true,
					editor: null,
					formatter: 'remark'
				}, {
					afterId: 'productsDescription',
					id: 'productsCode',
					gid: 'products',
					field: 'ProductCollectionInfo.ProductsCode',
					name: 'Products',
					name$tr$: 'transportplanning.bundle.products',
					sortable: true,
					editor: null,
					formatter: 'remark'
				}, {
					afterId: 'productsCode',
					id: 'productsByDrawing',
					gid: 'products',
					field: 'ProductCollectionInfo.ProductsByDrawing',
					name: '*Products by Drawing',
					name$tr$: 'transportplanning.bundle.productsByDrawing',
					sortable: true,
					editor: null,
					formatter: 'remark'
				},{
					afterId: 'productsByDrawing',
					id: 'productsCount',
					gid: 'products',
					field: 'ProductCollectionInfo.ProductsCount',
					name: 'Products Count',
					name$tr$: 'transportplanning.bundle.product.entityProductsCount',
					sortable: true,
					editor: null,
					formatter: 'decimal'
				}, {
					afterId: 'productsCount',
					id: 'productsMountedCount',
					gid: 'products',
					field: 'ProductCollectionInfo.ProductsMountedCount',
					name: 'Products Mounted Count',
					name$tr$: 'transportplanning.bundle.product.entityProductsMountedCount',
					sortable: true,
					editor: null,
					formatter: 'quantity'
				}, {
					afterId: 'productsMountedCount',
					id: 'productsWeightSum',
					gid: 'products',
					field: 'ProductCollectionInfo.ProductsWeightSum.Value',
					name: 'Products Weight Sum',
					name$tr$: 'transportplanning.bundle.product.entityProductsWeightSum',
					sortable: true,
					editor: null,
					formatter: 'convert',
					weightsourceuomfactor:1
				}, {
					afterId: 'productsWeightSum',
					id: 'productsActualWeightSum',
					gid: 'products',
					field: 'ProductCollectionInfo.ProductsActualWeightSum.Value',
					name: '*Products Total Actual Weight',
					name$tr$: 'transportplanning.bundle.product.entityProductsActualWeightSum',
					sortable: true,
					editor: null,
					formatter: 'convert',
					weightsourceuomfactor:1
				}, {
					afterId: 'productsActualWeightSum',
					id: 'productsAreaSum',
					gid: 'products',
					field: 'ProductCollectionInfo.ProductsAreaSum.Value',
					name: '*Products Area Sum',
					name$tr$: 'transportplanning.bundle.product.entityProductsAreaSum',
					sortable: true,
					editor: null,
					formatter: 'convert',
					areasourceuomfactor:1
				}, {
					afterId: 'productsAreaSum',
					id: 'productsHeightSum',
					gid: 'products',
					field: 'ProductCollectionInfo.ProductsHeightSum.Value',
					name: 'Products Height Sum',
					name$tr$: 'transportplanning.bundle.product.entityProductsHeightSum',
					sortable: true,
					editor: null,
					formatter: 'decimal'
				}, {
					afterId: 'productsHeightSum',
					id: 'productsMaxLength',
					gid: 'products',
					field: 'ProductCollectionInfo.ProductsMaxLength.Value',
					name: 'Products Max Length',
					name$tr$: 'transportplanning.bundle.product.entityProductsMaxLength',
					sortable: true,
					editor: null,
					formatter: 'decimal'
				}, {
					afterId: 'productsMaxLength',
					id: 'productsMaxWidth',
					gid: 'products',
					field: 'ProductCollectionInfo.ProductsMaxWidth.Value',
					name: 'Products Max Width',
					name$tr$: 'transportplanning.bundle.product.entityProductsMaxWidth',
					sortable: true,
					editor: null,
					formatter: 'decimal'
				}, _.extend({
					afterId: 'productsMaxWidth',
					id: 'productsStatusMin',
					gid: 'products',
					name: 'Product Status Min',
					name$tr$: 'transportplanning.bundle.product.entityProductsStatusMin',
					sortable: true,
					editor: null,
					field: 'ProductCollectionInfo.ProductsStatusMinId',
					options: productsStatusMinLookup.detail.options,
					directive: productsStatusMinLookup.detail.directive
				}, productsStatusMinLookup.grid), _.extend({
					afterId: 'productsStatusMin',
					id: 'productsStatusMax',
					gid: 'products',
					name: 'Product Status Max',
					name$tr$: 'transportplanning.bundle.product.entityProductsStatusMax',
					sortable: true,
					editor: null,
					field: 'ProductCollectionInfo.ProductsStatusMaxId',
					options: productStatusMaxLookup.detail.options,
					directive: productStatusMaxLookup.detail.directive
				}, productStatusMaxLookup.grid), {
					afterId: 'productsStatusMax',
					id: 'maxDeliveryDate',
					gid: 'products',
					field: 'ProductCollectionInfo.MaxProductionDate',
					name: '*Max Production Date',
					name$tr$: 'transportplanning.bundle.product.entityMaxDeliveryDate',
					sortable: true,
					editor: null,
					formatter: 'datetimeutc'
				}, {
					afterId: 'maxDeliveryDate',
					id: 'minDeliveryDate',
					gid: 'products',
					field: 'ProductCollectionInfo.MinProductionDate',
					name: '*Min Production Date',
					name$tr$: 'transportplanning.bundle.product.entityMinDeliveryDate',
					sortable: true,
					editor: null,
					formatter: 'datetimeutc'
				}, {
					afterId: 'minDeliveryDate',
					id: 'productTemplateCodes',
					gid: 'products',
					field: 'ProductCollectionInfo.ProductTemplateCodes',
					name: '*Products Template Code(s)',
					name$tr$: 'transportplanning.bundle.product.productTemplateCodes',
					sortable: true,
					editor: null,
					formatter: 'remark'
				}, {
					afterId: 'productTemplateCodes',
					id: 'productTemplateDescriptions',
					gid: 'products',
					field: 'ProductCollectionInfo.ProductTemplateDescriptions',
					name: '*Products Template Description(s)',
					name$tr$: 'transportplanning.bundle.product.productTemplateDescriptions',
					sortable: true,
					editor: null,
					formatter: 'remark'
				}
				]);

			var prjStockLocation = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
				dataServiceName: 'projectStockLocationLookupDataService',
				enableCache: true,
				valMember: 'Id',
				dispMember: 'Code',
				filter: function (item) {
					return !_.isNil(item.ProductCollectionInfo.PrjStockFk) ? item.ProductCollectionInfo.PrjStockFk : undefined;
				},
				readonly: true
			});

			var additionalProductFields = {
				grid: [{
					afterId: 'prjStockLocationFk',
					id: 'puCodes',
					gid: 'products',
					field: 'PuInfo.Codes',
					name: 'Planning Unit',
					name$tr$: 'productionplanning.common.logLayout.planningUnit',
					sortable: true,
					editor: null,
					readonly: true,
					formatter: 'description',
					navigator: {
						moduleName: 'productionplanning.item'
					}
				}
				],
				detail: [{
					afterId: 'prjStockLocationFk',
					// goto...
					rid: 'puCodes',
					gid: 'products',
					model: 'PuInfo.Codes',
					label: 'Planning Unit',
					label$tr$: 'productionplanning.common.logLayout.planningUnit',
					type: 'description',
					readonly: true,
					navigator: {
						moduleName: 'productionplanning.item'
					}
				}
				]
			};

			var upstreamDesc = {
				grid: [{
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
				}]
			};

			let addition = {
				grid: platformObjectHelper.extendGrouping(_.concat([{
					id: 'info',
					field: 'image',
					name: '*Type',
					width: 50,
					readonly: true,
					name$tr$: 'productionplanning.item.upstreamItem.belonging',
					formatter: 'image',
					formatterOptions: {
						tooltip: true,
						imageSelector: 'ppsItemTransportableProcessor'
					},
					sorting: 0
				},], toBeAssigned.grid, productInfo.grid, additionalProductFields.grid, upstreamDesc.grid)),
			};

			var service = new BaseService(transportplanningToBeAssignedLayout.createLayout(dataService), attributeDomains, transportplanningBundleTranslationService);
			platformUIStandardExtentService.extend(service, addition, attributeDomains);
			platformTranslateService.translateFormConfig(service.getStandardConfigForDetailView());

			ppsCommonLayoutOverloadService.translateCustomUom(service);

			return service;
		}};
		
	}
})(angular);
