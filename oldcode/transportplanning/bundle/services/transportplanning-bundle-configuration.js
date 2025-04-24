(function (angular) {
	'use strict';

	var moduleName = 'transportplanning.bundle';
	var BundleModul = angular.module(moduleName);

	BundleModul.factory('transportplanningBundleMainLayoutConfig', ['platformObjectHelper', 'basicsLookupdataConfigGenerator', 'platformLayoutHelperService',
		'ppsCommonTransportInfoHelperService', '_', 'productionplanningCommonLayoutHelperService',
		function (platformObjectHelper, basicsLookupdataConfigGenerator, platformLayoutHelperService,
			ppsCommonTransportInfoHelperService, _, ppsCommonLayoutHelperService) {

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

			var trsRequisitionStatusLookup = basicsLookupdataConfigGenerator.provideReadOnlyConfig('basics.customize.transportrequisitionstatus', null, {
				field: 'requisition.TrsReqStatusFk',
				showIcon: true
			});
			var bundle = {
				grid: [{
					afterId: 'sitefk',
					id: 'siteDesc',
					field: 'SiteFk',
					name: 'Site-Description',
					name$tr$: 'basics.site.entityDesc',
					formatter: 'lookup',
					formatterOptions: {
						lookupType: 'SiteNew',
						displayMember: 'DescriptionInfo.Translated',
						width: 140,
						version: 3
					}
				}],
				detail: []
			};

			ppsCommonTransportInfoHelperService.addAdditionUiConfiguration(bundle);

			var productsStatusMinLookup = basicsLookupdataConfigGenerator.provideReadOnlyConfig('basics.customize.ppsproductstatus', null, {
				field: 'ProductCollectionInfo.ProductsStatusMinId',
				showIcon: true
			});
			var productStatusMaxLookup = basicsLookupdataConfigGenerator.provideReadOnlyConfig('basics.customize.ppsproductstatus', null, {
				field: 'ProductCollectionInfo.ProductsStatusMaxId',
				showIcon: true
			});

			var productInfo = gengerateUIConfig(
				[{
					afterId: 'trsrequisitionfkDesc',
					id: 'productsDescription',
					gid: 'products',
					field: 'ProductCollectionInfo.ProductsDescription',
					name: '*Descriptions of Products',
					name$tr$: 'transportplanning.bundle.product.descriptionsOfProducts',
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
				}
				]);

			var jobSetting = ppsCommonLayoutHelperService.provideJobExtensionLookupOverload({
				projectFk: 'ProjectFk',
				activeJob: true,
				jobType: 'external'
			});
			var resourceSetting = platformLayoutHelperService.provideResourceLookupOverload({
				'typeFk': 'ResTypeFk'
			});

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

			var loadingDevice = {
				grid: [
					{
						'afterId': 'trsrequisitionfkDesc',
						'id': 'loadingDeviceDesc',
						'field': 'LoadingDevice.Description',
						'name': 'LD Description',
						'name$tr$': 'transportplanning.loadingDevice.desc',
						'sortable': true,
						'editor': 'description',
						'formatter': 'description'
					},
					{
						'afterId': 'loadingDeviceDesc',
						'id': 'loadingDeviceQuantity',
						'field': 'LoadingDevice.Quantity',
						'name': 'LD Quantity',
						'name$tr$': 'transportplanning.loadingDevice.quantity',
						'sortable': true,
						'editor': 'quantity',
						'formatter': 'quantity'
					},
					{
						'afterId': 'loadingDeviceQuantity',
						'id': 'loadingDeviceStartDate',
						'field': 'LoadingDevice.RequestedFrom',
						'name': 'LD Start Date',
						'name$tr$': 'transportplanning.loadingDevice.startDate',
						'sortable': true,
						'editor': 'date',
						'formatter': 'date'
					},
					{
						'afterId': 'loadingDeviceStartDate',
						'id': 'loadingDeviceEndDate',
						'field': 'LoadingDevice.RequestedTo',
						'name': 'LD End Date',
						'name$tr$': 'transportplanning.loadingDevice.endDate',
						'sortable': true,
						'editor': 'date',
						'formatter': 'date'
					}, basicsLookupdataConfigGenerator.provideDataServiceLookupConfigForGrid({
						dataServiceName: 'resourceTypeLookupDataService',
						showClearButton: true,
						cacheEnable: true
					}, {
						'afterId': 'loadingDeviceEndDate',
						'id': 'loadingDeviceResourceType',
						'field': 'LoadingDevice.TypeFk',
						'name': 'LD Type',
						'name$tr$': 'transportplanning.loadingDevice.resType',
						'sortable': true
					}),
					basicsLookupdataConfigGenerator.provideDataServiceLookupConfigForGrid({
						dataServiceName: 'basicsUnitLookupDataService',
						showClearButton: true,
						//cacheEnable: true
					}, {
						'afterId': 'loadingDeviceResourceType',
						'id': 'loadingDeviceUom',
						'field': 'LoadingDevice.UomFk',
						'name': 'LD Uom',
						'name$tr$': 'transportplanning.loadingDevice.uom',
						'sortable': true
					}),
					_.merge(jobSetting.grid, {
						'afterId': 'loadingDeviceUom',
						'id': 'loadingDeviceJob',
						'field': 'LoadingDevice.JobFk',
						'name': 'LD Job',
						'name$tr$': 'transportplanning.loadingDevice.job',
						'sortable': true,
						navigator: {
							moduleName: 'logistic.job'
						}
					}),
				_.merge(resourceSetting.grid, {
					'afterId': 'loadingDeviceResourceType',
					'id': 'LDResourceFk',
					'field': 'LoadingDevice.ResourceFk',
					'name': '*LD Resource',
					'name$tr$': 'transportplanning.loadingDevice.resource',
					'sortable': true
					}
				)],
				detail: [{
					'afterId': 'trsrequisitionfkDesc',
					'rid': 'loadingDeviceDesc',
					'gid': 'loadingDevice',
					'model': 'LoadingDevice.Description',
					'label': 'LD Description',
					'label$tr$': 'transportplanning.loadingDevice.desc',
					'type': 'description'
				}, {
					'afterId': 'trsrequisitionfkDesc',
					'rid': 'loadingDeviceQuantity',
					'gid': 'loadingDevice',
					'model': 'LoadingDevice.Quantity',
					'label': 'LD Quantity',
					'label$tr$': 'transportplanning.loadingDevice.quantity',
					'type': 'quantity'
				}, {
					'afterId': 'loadingDeviceQuantity',
					'rid': 'loadingDeviceStartDate',
					'gid': 'loadingDevice',
					'model': 'LoadingDevice.RequestedFrom',
					'label': 'LD Start Date',
					'label$tr$': 'transportplanning.loadingDevice.startDate',
					'type': 'date'
				}, {
					'afterId': 'loadingDeviceStartDate',
					'rid': 'loadingDeviceEndDate',
					'gid': 'loadingDevice',
					'model': 'LoadingDevice.RequestedTo',
					'label': 'LD End Date',
					'label$tr$': 'transportplanning.loadingDevice.endDate',
					'type': 'date'
				}, basicsLookupdataConfigGenerator.provideDataServiceCompositeLookupConfigForForm({
					dataServiceName: 'resourceTypeLookupDataService',
					showClearButton: true,
					cacheEnable: true
				}, {
					'afterId': 'loadingDeviceEndDate',
					'rid': 'loadingDeviceResourceType',
					'gid': 'loadingDevice',
					'model': 'LoadingDevice.TypeFk',
					'label': 'LD Type',
					'label$tr$': 'transportplanning.loadingDevice.resType'
				}), basicsLookupdataConfigGenerator.provideDataServiceCompositeLookupConfigForForm({
					dataServiceName: 'basicsUnitLookupDataService',
					showClearButton: true,
					//cacheEnable: true
				}, {
					'afterId': 'loadingDeviceResourceType',
					'rid': 'loadingDeviceUom',
					'gid': 'loadingDevice',
					'model': 'LoadingDevice.UomFk',
					'label': 'LD Uom',
					'label$tr$': 'transportplanning.loadingDevice.uom'
				}),
					_.merge(jobSetting.detail, {
					'afterId': 'loadingDeviceUom',
					'rid': 'loadingDeviceJobFk',
					'gid': 'loadingDevice',
					'model': 'LoadingDevice.JobFk',
					'label': 'LD Job',
					'label$tr$': 'transportplanning.loadingDevice.job',
					navigator: {
						moduleName: 'logistic.job'
					}
				}),
					_.merge(resourceSetting.detail, {
						'afterId': 'loadingDeviceResourceType',
						'rid': 'LDResourceFk',
						'gid': 'loadingDevice',
						'model': 'LoadingDevice.ResourceFk',
						'label': '*LD Resource',
						'label$tr$': 'transportplanning.loadingDevice.resource'
					})
				]
			};

			var prjStock = {
				grid: [{
					afterId: 'minDeliveryDate',
					id: 'prjStockFk',
					gid: 'products',
					field: 'ProductCollectionInfo.PrjStockFk',
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
					gid: 'products',
					field: 'ProductCollectionInfo.PrjStockFk',
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
					'gid': 'products',
					'field': 'ProductCollectionInfo.PrjStockLocationFk',
					'name': '*Stock Location',
					'name$tr$': 'procurement.common.entityPrjStockLocation',
					'sortable': true
				}), {
					afterId: 'prjStockLocationFk',
					id: 'prjStockLocationDescription',
					gid: 'products',
					field: 'ProductCollectionInfo.PrjStockLocationFk',
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
					afterId: 'minDeliveryDate',
					rid: 'prjStockFk',
					gid: 'products',
					model: 'ProductCollectionInfo.PrjStockFk',
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
					gid: 'products',
					model: 'ProductCollectionInfo.PrjStockLocationFk',
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
								return !_.isNil(item.ProductCollectionInfo.PrjStockFk) ? item.ProductCollectionInfo.PrjStockFk : undefined;
							}
						}
					},
					readonly: true
				}]
			};

			var additionalProductFields = {
				grid: [{
						afterId: 'prjStockLocationFk',
						id: 'engDrawing',
						gid: 'products',
						name: '*Engineering Drawing',
						name$tr$: 'transportplanning.bundle.product.engDrawing',
						sortable: true,
						field: 'ProductCollectionInfo.EngDrawingFk',
						navigator: {
							moduleName: 'productionplanning.drawing'
						},
						editor: null,
						directive: 'basics-lookupdata-lookup-composite',
						formatter: 'lookup',
						formatterOptions: {
							version: 3,
							lookupType: 'EngDrawing',
							displayMember: 'Code'
						},
						width: 70,
						readonly: true
					}, {
						afterId: 'engDrawing',
						id: 'mdcMaterials',
						gid: 'products',
						field: 'ProductCollectionInfo.MaterialInfos',
						name: 'Materials',
						name$tr$: 'transportplanning.bundle.product.materialInfos',
						sortable: true,
						editor: null,
						readonly: true,
						formatter: 'description'
					}, {
						afterId: 'mdcMaterials',
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
					rid: 'engDrawing',
					gid: 'products',
					label: '*Engineering Drawing',
					label$tr$: 'transportplanning.bundle.product.engDrawing',
					model: 'ProductCollectionInfo.EngDrawingFk',
					navigator: {
						moduleName: 'productionplanning.drawing'
					},
					type: 'directive',
					directive: 'basics-lookupdata-lookup-composite',
					options: {
						lookupDirective: 'productionplanning-drawing-lookup',
						descriptionMember: 'Code'
					},
					readonly: true
				}, {
					afterId: 'engDrawing',
					rid: 'mdcMaterials',
					gid: 'products',
					model: 'ProductCollectionInfo.MaterialInfos',
					label: 'Materials',
					label$tr$: 'transportplanning.bundle.product.materialInfos',
					type: 'description',
					readonly: true
				}, {
					afterId: 'mdcMaterials',
					//goto...
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

			return {
				addition: {
					grid: platformObjectHelper.extendGrouping(_.concat([], bundle.grid, productInfo.grid, prjStock.grid, loadingDevice.grid, additionalProductFields.grid)),
					detail: _.concat([], bundle.detail, productInfo.detail, prjStock.detail, loadingDevice.detail, additionalProductFields.detail)
				}
			};
		}]);


	BundleModul.factory('transportplanningBundleDetailLayout', BundleDetailLayout);
	BundleDetailLayout.$inject = ['$injector', 'platformLayoutHelperService', 'basicsLookupdataConfigGenerator', 'basicsCommonUomDimensionFilterService', 'ppsCommonCustomColumnsServiceFactory',
		'basicsLookupdataLookupFilterService',
		'transportplanningRequisitionLookupDataService',
	'productionplanningCommonLayoutHelperService'];

	function BundleDetailLayout($injector, platformLayoutHelperService, basicsLookupdataConfigGenerator, uomFilterService, customColumnsServiceFactory,
								basicsLookupdataLookupFilterService,
								trsRequisitionLookupDataService,
		ppsCommonLayoutHelperService) {
		var filters = [{
			key: 'bundle-trsRequisition-filter',
			serverSide: true,
			fn: function (item) {
				var params = trsRequisitionLookupDataService.getFilterParams(item);
				params.NotIsAccepted = true;
				params.plannedStart1 = item.TrsReq_Start;
				params.plannedFinish1 = item.TrsReq_Finish;
				params.JobId = item.LgmJobFk;
				return params;
			}
		}];
		basicsLookupdataLookupFilterService.registerFilter(filters);

		var config = {
			'fid': 'transportplanning.bundle',
			'version': '1.0.0',
			'showGrouping': true,
			'addValidationAutomatically': true,
			'groups': [
				{
					gid: 'baseGroup',
					attributes: ['code', 'trsbundletypefk', 'trsbundlestatusfk', 'projectfk', 'lgmjobfk', 'descriptioninfo', 'sitefk', 'drawingfkofstack', 'islive', 'productionorder', 'reproduced']
				},
				{
					gid: 'dimensions',
					attributes: ['length', 'basuomlengthfk', 'width', 'basuomwidthfk', 'height', 'basuomheightfk', 'weight', 'basuomweightfk']
				},
				{
					gid: 'transport',
					attributes: ['trsrequisitionfk', 'trsrequisitiondate']
				},
				{
					gid: 'loadingDevice',
					attributes: []
				},
				{
					gid: 'products',
					attributes: []
				},
				{
					gid: 'userDefTextGroup',
					isUserDefText: true,
					attCount: 5,
					attName: 'userdefined',
					noInfix: true
				},
				{
					gid: 'entityHistory',
					isHistory: true
				}
			],
			'overloads': {
				code: {
					navigator: {
						moduleName: 'transportplanning.bundle'
					},
					grid:{
						sortOptions: {
							numeric: true
						}
					}
				},
				projectfk: platformLayoutHelperService.provideProjectLookupOverload(),
				lgmjobfk: ppsCommonLayoutHelperService.provideJobExtensionLookupOverload({
					projectFk: 'ProjectFk',
					activeJob: true,
					jobType: 'external'
				}),
				sitefk: {
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
				trsbundlestatusfk: basicsLookupdataConfigGenerator.provideReadOnlyConfig('basics.customize.transportbundlestatus', null, {
					showIcon: true
				}),
				drawingfkofstack: {
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
					}
				}
			}
		};

		var customColumnsService = customColumnsServiceFactory.getService(moduleName);
		customColumnsService.setEventTypeConfig(config);

		return config;
	}

})(angular);