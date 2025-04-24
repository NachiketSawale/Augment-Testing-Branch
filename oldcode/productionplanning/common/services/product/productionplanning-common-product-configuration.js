(function (angular) {
	'use strict';
	/* global _ */

	var moduleName = 'productionplanning.common';

	angular.module(moduleName).factory('productionplanningCommonProductMainLayout',
		['basicsLookupdataConfigGenerator', 'ppsCommonTransportInfoHelperService',
			function (basicsLookupdataConfigGenerator, ppsCommonTransportInfoHelperService) {

				function extendGrouping(gridColumns) {
					return gridColumns;
				}

				var result = {
					addition: {
						grid: extendGrouping([
							{
								afterId: 'productdescriptionfk',
								id: 'productDescriptionDesc',
								field: 'ProductDescriptionFk',
								name: 'Product Description Desc',
								name$tr$: 'productionplanning.common.product.productDescriptionDesc',
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'PPSProductDescriptionTiny',
									displayMember: 'DescriptionInfo.Translated',
									width: 140,
									version: 3
								}
							},
							{
								afterId: 'prodplacefk',
								id: 'productionPlaceParentDesc',
								field: 'ProdPlaceParentDescription',
								name: '*Parent Prod_Place',
								name$tr$: 'productionplanning.product.productionPlace.parentProdPlace'
							},
							{
								afterId: 'productionsetfk',
								id: 'productionsetDesc',
								field: 'ProductionSetFk',
								name: 'ProductionSet Description',
								name$tr$: 'productionplanning.common.product.productionSetDes',
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'ProductionsetLookup',
									displayMember: 'DescriptionInfo.Translated',
									width: 140,
									version: 3
								}
							},
							{
								afterId: 'trsproductbundlefk',
								id: 'trsproductbundleDesc',
								field: 'TrsProductBundleFk',
								name: 'Bundle Description',
								name$tr$: 'transportplanning.bundle.bundleDesc',
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'TrsBundleLookup',
									displayMember: 'DescriptionInfo.Translated',
									width: 140
								}
							},
							{
								afterId: 'itemfk',
								id: 'ppsitemDesc',
								field: 'ItemFk',
								name: '*Item Description',
								name$tr$: 'productionplanning.item.translationDescItem',
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'PPSItem',
									displayMember: 'DescriptionInfo.Translated',
									width: 140,
									version: 3
								}
							},
							{
								afterId: 'prjlocationfk',
								id: 'branchpath',
								field: 'PrjLocationFk',
								name: '*Location Full Description',
								name$tr$: 'productionplanning.common.branchPath',
								formatter: 'select',
								formatterOptions: {
									serviceName: 'productionplanningCommonLocationInfoService',
									valueMember: 'Id',
									displayMember: 'BranchPath'
								}
							},
							{
								afterId: 'prjlocationfk',
								id: 'LinkProductIcon',
								field: 'LinkProductIcon',
								name: '*Annotation Status',
								name$tr$: 'productionplanning.common.product.annotationStatus',
								formatter: 'image',
								readonly: true,
								formatterOptions: {
									imageSelector: 'ppsCommonProductLinkIconService',
									tooltip: true
								}
							}
						]),
						detail: []
					}
				};

				ppsCommonTransportInfoHelperService.addAdditionUiConfiguration(result.addition);

				return result;
			}]);

	// master Layout
	angular.module(moduleName).factory('productionplanningCommonProductDetailLayout', ProductionplanningCommonProductDetailLayout);
	ProductionplanningCommonProductDetailLayout.$inject = ['$injector', 'productionplanningItemDataService',
		'basicsLookupdataConfigGenerator', 'platformLayoutHelperService',
		'basicsCommonUomDimensionFilterService', 'ppsCommonCustomColumnsServiceFactory',
		'ppsCommonLayoutOverloadService', 'productionplanningCommonLayoutHelperService',
		'transportplanningRequisitionLookupDataService', 'basicsLookupdataLookupFilterService'];

	function ProductionplanningCommonProductDetailLayout($injector, itemDataService,
		basicsLookupdataConfigGenerator, platformLayoutHelperService,
		uomDimensionFilter, customColumnsServiceFactory,
		ppsCommonLayoutOverloadService, ppsCommonLayoutHelperService,
		trsRequisitionLookupDataService, basicsLookupdataLookupFilterService) {

		function setStrandPatternFilterParamsForBulkEditor(item, params) {
			if (_.isEmpty(item)) {
				let entities = $injector.get('productionplanningProductMainService').getSelectedEntities();
				if (entities.length > 0) {
					let firstEntity = entities[0];
					if (entities.length === 1) {
						params.mdcMaterialId = firstEntity.MaterialFk;
					}
					else {
						let haveDifferentMaterial = _.some(entities, function (entity) {
							return entity.Id !== firstEntity.Id && entity.MaterialFk !== firstEntity.MaterialFk;
						});
						if (haveDifferentMaterial) {
							params.mdcMaterialId = -1;
						} else {
							params.mdcMaterialId = firstEntity.MaterialFk;
						}
					}
				}
			}
		}

		var filters = [{
			key: 'product-trsRequisition-filter',
			serverSide: true,
			fn: function (item) {
				var params = trsRequisitionLookupDataService.getFilterParams(item);
				params.NotIsAccepted = true;
				params.plannedStart1 = item.TrsReq_Start;
				params.plannedFinish1 = item.TrsReq_Finish;
				params.JobId = item.LgmJobFk;
				return params;
			}
		}, {
			key: 'pps-common-product-strand-pattern-filter',
			serverKey: 'pps-common-product-strand-pattern-filter',
			serverSide: true,
			fn: function (item) {
				let params = {};
				if (_.isEmpty(item)) {
					setStrandPatternFilterParamsForBulkEditor(item, params);
				}
				else {
					params.mdcMaterialId = item.MaterialFk;
				}
				return params;
			}
		}, {
			key: 'pps-common-product-prodPlace-site-filter',
			fn: function (item, entity) {
				return entity.SiteFks.includes(item.BasSiteFk);
			}
		}];
		basicsLookupdataLookupFilterService.registerFilter(filters);

		var getProjectId = function getProjectId() {
			var projectId = itemDataService.getProjectID();
			return projectId ? projectId.toString() : '-1';
		};

		function createOverloads() {
			var ols = {
				code: {
					navigator: {
						moduleName: 'productionplanning.product'
					},
					grid: {
						sortOptions: {
							numeric: true
						}
					}
				},
				productdescriptionfk: {
					readonly: true,
					navigator: {
						moduleName: 'productionplanning.producttemplate'
					},
					grid: {
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'PPSProductDescriptionTiny',
							displayMember: 'Code',
							version: 3
						},
						editor: 'lookup',
						editorOptions: {
							lookupField: 'PPSProductDescription',
							directive: 'productionplanning-producttemplate-product-description-lookup',
							displayMember: 'Code'
						},
						width: 90
					},
					detail: {
						type: 'directive',
						directive: 'productionplanning-producttemplate-product-description-lookup'
					}
				},
				productstatusfk: basicsLookupdataConfigGenerator.provideReadOnlyConfig('basics.customize.ppsproductstatus', null, {
					showIcon: true,
					imageSelectorService: 'platformStatusSvgIconService',
					svgBackgroundColor: 'BackgroundColor',
					backgroundColorType: 'dec',
					backgroundColorLayer: [1, 2, 3, 4, 5, 6]
				}),
				prjlocationfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
					dataServiceName: 'projectLocationLookupDataService',
					cacheEnable: true,
					additionalColumns: true,
					filter: function (item) {
						if (item && item.Version !== 0) {
							return item.ProjectId;
						}
						return getProjectId();
					},
					showClearButton: true
				}),
				productionsetfk: {
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
							lookupField: 'ProductionSetFk',
							directive: 'productionplanning-productionset-lookup',
							displayMember: 'Code'
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
				trsproductbundlefk: {
					grid: {
						editor: 'lookup',
						editorOptions: {
							lookupOptions: { showClearButton: true },
							directive: 'transportplanning-bundle-lookup'
						},
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'TrsBundleLookup',
							displayMember: 'Code'
						},
						width: 70
					},
					detail: {
						type: 'directive',
						directive: 'basics-lookupdata-lookup-composite',
						options: {
							lookupOptions: { showClearButton: true },
							lookupDirective: 'transportplanning-bundle-lookup',
							descriptionMember: 'DescriptionInfo.Description'
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

				lgmjobfk: ppsCommonLayoutHelperService.provideJobExtensionLookupOverload({ projectFk: 'ProjectId' }),
				/* lgmjobfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
				 dataServiceName: 'logisticJobLookupByProjectDataService',
				 cacheEnable: true,
				 additionalColumns: false,
				 filter: function (item) {
				 return item.ProjectId;
				 }
				 }),  */

				islive: {
					readonly: true
				},
				length: {
					disallowNegative: true,
					bulkSupport: false,
					formatter: 'convert',
					nameExtension: 'uom'
				},
				width: {
					disallowNegative: true,
					formatter: 'convert',
					nameExtension: 'uom',
					bulkSupport: false
				},
				height: {
					disallowNegative: true,
					formatter: 'convert',
					nameExtension: 'uom',
					bulkSupport: false
				},
				weight: {
					disallowNegative: true,
					formatter: 'convert',
					nameExtension: 'uom'
				},
				weight2: {
					disallowNegative: true,
					formatter: 'convert',
					nameExtension: 'uom'
				},
				weight3: {
					disallowNegative: true,
					formatter: 'convert',
					nameExtension: 'uom'
				},
				actualweight: {
					disallowNegative: true,
					formatter: 'convert',
					nameExtension: 'uom'
				},
				area: {
					disallowNegative: true,
					formatter: 'convert',
					nameExtension: 'uom'
				},
				area2: {
					disallowNegative: true,
					formatter: 'convert',
					nameExtension: 'uom'
				},
				area3: {
					disallowNegative: true,
					formatter: 'convert',
					nameExtension: 'uom'
				},
				productiontime: {
					readonly: true
				},
				itemfk: {
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
							lookupField: 'ItemFk',
							directive: 'productionplanning-item-item-lookup-dialog',
							displayMember: 'Code',
							lookupOptions: {
								events: [{
									name: 'onSelectedItemChanged',
									handler: function (e, args) {
										args.entity.PuPrjLocationFk = args.selectedItem.PrjLocationFk;
									}
								}]
							}
						},
						width: 90
					},
					detail: {
						type: 'directive',
						directive: 'basics-lookupdata-lookup-composite',
						options: {
							lookupOptions: {
								events: [{
									name: 'onSelectedItemChanged',
									handler: function (e, args) {
										args.entity.PuPrjLocationFk = args.selectedItem.PrjLocationFk;
									}
								}]
							},
							lookupDirective: 'productionplanning-item-item-lookup-dialog',
							descriptionMember: 'DescriptionInfo.Description'
						}
					}
				},
				ppsitemstockfk: {
					readonly: true,
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
					},
					detail: {
						type: 'directive',
						directive: 'basics-lookupdata-lookup-composite',
						options: {
							lookupDirective: 'productionplanning-item-item-lookup-dialog',
							descriptionMember: 'DescriptionInfo.Description'
						}
					}
				},
				productionorder: {
					readonly: true
				},
				reproduced: {
					readonly: true
				},
				projectid: makeLookupReadOnly(ppsCommonLayoutOverloadService.getProjectOverload()),
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
				materialfk: makeLookupReadOnly(ppsCommonLayoutHelperService.provideMaterialLookupOverload()),
				puprjlocationfk: makeLookupReadOnly(basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
					dataServiceName: 'projectLocationLookupDataService',
					cacheEnable: true,
					additionalColumns: true,
					readonly: true,
					filter: function (product) {
						return product.ProjectId;
					}
				})),
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
									ProjectId: 'ProjectId',
									ProjectIdReadOnly: true
								},
								filterKey: 'product-trsRequisition-filter'
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
								showClearButton: true,
								defaultFilter: {
									ProjectId: 'ProjectId',
									ProjectIdReadOnly: true
								}
							},
							lookupDirective: 'transportplanning-requisition-lookup-dialog',
							descriptionMember: 'DescriptionInfo.Translated'
						}
					}
				},
				ppsprocessfk: {
					grid: {
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'Process',
							displayMember: 'Code',
							version: 3
						},
						editor: 'lookup',
						editorOptions: {
							lookupOptions: {
								showClearButton: true,
							},
							directive: 'pps-process-configuration-process-dialog-lookup'
						},
						width: 100
					},
					detail: {
						type: 'directive',
						directive: 'basics-lookupdata-lookup-composite',
						options: {
							lookupOptions: {
								showClearButton: true,
							},
							lookupDirective: 'pps-process-configuration-process-dialog-lookup',
						}
					}
				},
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
								displayMember: 'Code',
								filterKey: 'pps-common-product-strand-pattern-filter',
							}
						}
					},
					detail: {
						type: 'directive',
						directive: 'productionplanning-strandpattern-lookup',
						options: {
							displayMember: 'Code',
							lookupOptions: {
								filterKey: 'pps-common-product-strand-pattern-filter'
							}
						}
					}
				},
				ppsproductionsetsubfk: {
					grid: {
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'ProductionsetLookup',
							displayMember: 'Code',
							version: 3
						},
						editor: 'lookup',
						editorOptions: {
							directive: 'productionplanning-sub-production-set-lookup',
							lookupField: 'PpsProductionSetSubFk',
							displayMember: 'Code',
							lookupOptions: {
								filterKey: 'pps-common-product-sub-product-set-filter',
								additionalColumns: true,
								addGridColumns: [{
									id: 'Date',
									field: 'PlannedStart',
									name: 'Date',
									name$tr$: 'cloud.common.entityDate',
									formatter: 'dateutc'
								}, {
									id: 'Supplier',
									field: 'ProductionSiteFk',
									name: 'Supplier',
									name$tr$: 'cloud.common.entitySupplier',
									formatter: 'lookup',
									formatterOptions: {
										lookupType: 'SiteNew',
										displayMember: 'Code',
										version: 3
									}
								}],
								dataProcessor: {
									execute: function (dataList) {
										const platformDataServiceProcessDatesBySchemeExtension =
											$injector.get('platformDataServiceProcessDatesBySchemeExtension');
										dataList.forEach(data => {
											platformDataServiceProcessDatesBySchemeExtension.parseString(data, 'PlannedStart', 'dateutc');
										});
										return dataList;
									}
								}
							}
						},
						width: 120
					},
					detail: {
						type: 'directive',
						directive: 'basics-lookupdata-lookup-composite',
						options: {
							lookupDirective: 'productionplanning-sub-production-set-lookup',
							descriptionMember: 'DescriptionInfo.Description',
							lookupOptions: {
								filterKey: 'pps-common-product-sub-product-set-filter'
							}
						}
					}
				},
				guid: {
					readonly: true
				},
				fabricode: {
					readonly: true
				},
				fabriexternalcode: {
					readonly: true
				},
				prodplacefk: {
					grid: {
						editor: 'lookup',
						editorOptions: {
							directive: 'pps-production-place-dialog-lookup',
							lookupOptions: {
								filterKey: 'pps-common-product-prodPlace-site-filter',
								version: 3
							}
						},
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'PpsProductionPlace',
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
								filterKey: 'pps-common-product-prodPlace-site-filter',
								version: 3
							},
							lookupDirective: 'pps-production-place-dialog-lookup',
							descriptionMember: 'Description'
						}
					}
				},
				installsequence: {
					disallowNegative: true
				}
			};
			var attNames = ['basuomlengthfk', 'basuomwidthfk', 'basuomheightfk', 'basuomweightfk', 'basuomareafk', 'basuombillfk', 'basuomplanfk', 'basuomvolumefk'];
			attNames.forEach(function (col) {
				ols[col] = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
					dataServiceName: 'basicsUnitLookupDataService',
					cacheEnable: true,
					filterKey: getUoMFilterKey(col)
				});
			});
			return ols;
		}

		function makeLookupReadOnly(lookupConfig) {
			if (lookupConfig && typeof lookupConfig === 'object') {
				lookupConfig.readonly = true;
			}
			return lookupConfig;
		}

		function getUoMFilterKey(column) {
			var key;
			switch (column) {
				case 'basuomlengthfk':
				case 'basuomwidthfk':
				case 'basuomheightfk':
					key = uomDimensionFilter.registerLengthDimensionFilter(1);
					break;
				case 'basuomareafk':
					key = uomDimensionFilter.registerLengthDimensionFilter(2);
					break;
				case 'basuomvolumefk':
					key = uomDimensionFilter.registerLengthDimensionFilter(3);
					break;
				case 'basuomweightfk':
					key = uomDimensionFilter.registerMassDimensionFilter();
					break;
				case 'basuombillfk':
			}
			return key;
		}

		var config = {
			'fid': 'productionplanning.common.productlayout',
			'version': '1.0.0',
			'showGrouping': true,
			'addValidationAutomatically': true,
			'groups': [
				{
					gid: 'product',
					attributes: ['productstatusfk', 'code', 'descriptioninfo', 'productdescriptionfk', 'projectid',
						'engdrawingfk', 'materialfk', 'lgmjobfk', 'externalcode', 'ppsstrandpatternfk', 'islive', 'guid', 'installsequence', 'sequence']
				},
				{
					gid: 'production',
					attributes: ['productionsetfk', 'trsproductbundlefk', 'prjlocationfk', 'puprjlocationfk',
						'unitprice', 'billquantity', 'basuombillfk', 'planquantity', 'basuomplanfk', 'itemfk',
						'productionorder', 'reproduced', 'prjstockfk', 'prjstocklocationfk', 'productiontime',
						'ppsprocessfk', 'ppsproductionsetsubfk', 'fabricode', 'fabriexternalcode', 'prodplacefk', 'ppsitemstockfk']
				},
				{
					gid: 'dimensions',
					attributes: [
						'length', 'basuomlengthfk', 'width', 'basuomwidthfk', 'height', 'basuomheightfk',
						'area', 'area2', 'area3', 'basuomareafk', 'volume', 'volume2', 'volume3', 'basuomvolumefk'
					]
				},
				{
					gid: 'propertiesGroup',
					attributes: [
						'isolationvolume', 'concretevolume', 'concretequality', 'weight', 'weight2', 'weight3', 'actualweight', 'basuomweightfk'
					]
				},
				{
					gid: 'transport',
					attributes: ['trsrequisitionfk', 'trsrequisitiondate']
				},
				{
					gid: 'userDefTextGroup',
					attributes: [
						'userdefined1',
						'userdefined2',
						'userdefined3',
						'userdefined4',
						'userdefined5',
						'userdefinedbyproddesc1',
						'userdefinedbyproddesc2',
						'userdefinedbyproddesc3',
						'userdefinedbyproddesc4',
						'userdefinedbyproddesc5'
					]
				},
				{
					gid: 'entityHistory',
					isHistory: true
				}
			],
			'overloads': createOverloads()
		};

		var customColumnsService = customColumnsServiceFactory.getService('productionplanning.common.product');
		customColumnsService.setEventTypeConfig(config, 'productionplanning.common.product.event');
		customColumnsService.setPhaseReqConfig(config);
		customColumnsService.setPhaseDateConfig(config);

		return config;
	}

})(angular);