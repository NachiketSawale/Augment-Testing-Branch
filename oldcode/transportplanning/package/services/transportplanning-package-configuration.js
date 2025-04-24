/**
 * Created by las on 7/10/2017.
 */


(function (angular) {
	'use strict';
	var moduleName = 'transportplanning.package';
	var packageModule = angular.module(moduleName);

	function extendGrouping(gridColumns) {
		angular.forEach(gridColumns, function (column) {
			angular.extend(column, {
				grouping: {
					title: column.name$tr$,
					getter: column.field,
					aggregators: [],
					aggregateCollapsed: true
				}
			});
		});
		return gridColumns;
	}

	packageModule.factory('transportplanningPackageMainLayoutConfig', config);
	config.$inject = ['basicsLookupdataConfigGenerator', '_', 'packageTypes'];
	function config(basicsLookupdataConfigGenerator, _, packageTypes) {
		var rteStatusLookupCfg = basicsLookupdataConfigGenerator.provideReadOnlyConfig('basics.customize.transportrtestatus', null, {
			showIcon: true,
			imageSelectorService: 'platformStatusSvgIconService',
			svgBackgroundColor: 'TrsRteBackgroundColor',
			backgroundColorType: 'dec',
			backgroundColorLayer: [1, 2, 3, 4, 5, 6]
		});
		return {
			addition: {
				grid: extendGrouping([{
					afterId: 'projectfk',
					id: 'projectName',
					field: 'ProjectFk',
					name: 'project name',
					name$tr$: 'cloud.common.entityProjectName',
					formatter: 'lookup',
					formatterOptions: {
						lookupType: 'Project',
						displayMember: 'ProjectName',
						width: 140
					}
				}, _.extend({
					afterId: 'trsroutefk',
					id: 'transportrtestatus',
					field: 'TrsRteStatusFk',
					name: 'Transport Route Status',
					name$tr$: 'basics.customize.transportrtestatus'
				}, rteStatusLookupCfg.grid), {
					afterId: 'good',
					id: 'goodsDescription',
					field: 'Good',
					name: '*Transport Goods Description',
					name$tr$: 'transportplanning.package.entityGoodsDescription',
					formatter: 'dynamic',
					domain: function domain(item, column) {
						var domain = 'lookup';//(see domainList in domain-service.js)
						var prop = packageTypes.properties[item.TrsPkgTypeFk];
						if (prop) {
								column.formatterOptions = {
									lookupType: prop.lookupType,
									displayMember: prop.descriptionPropertyName,
								};
							if (prop.version) {
								column.formatterOptions.version = prop.version;//for new lookup master api, the value of version should be greater than 2
							}
						}
						else {
							column.editorOptions = {readonly: true};
							column.formatterOptions = null;
						}

						return domain;
					},
					editor: null,
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
				}]),
				detail: [
					// below detail row will cause issue, to slove it, we duplicate directive transportplanning-package-select-control2
					{
						afterId: 'good',
						rid: 'goodDescription',
						gid: 'baseGroup',
						model: 'Good',
						label: '*Transport Goods Description',
						label$tr$: 'transportplanning.package.entityGoodsDescription',
						type: 'directive',
						directive: 'transportplanning-package-select-control2',
						readonly: true,
						options: {
							rid: 'goodDescription',
							model: 'Good',
							displayMember: 'DescriptionInfo.Translated',
							readonly: true,
							gridOptions: {
								readonly: true,
								disableCreateSimilarBtn: true
							}
						}
					}
				]
			}
		};
	}


	packageModule.factory('transportplanningPackageDetailsLayout', PackageDetailsLayout);
	PackageDetailsLayout.$inject = ['basicsLookupdataConfigGenerator', 'basicsLookupdataLookupFilterService', 'basicsCommonUomDimensionFilterService', '$injector', 'packageTypes', 'trsLgmRecordTypes',
		'transportplanningPackageTypeHelperService', 'transportplanningPackageStatusHelperService', 'productionplanningCommonLookupParamStorage',
		'basicsLookupdataLookupDescriptorService', 'logisticCommonLayoutOverloadService', 'ppsUIUtilService', 'trsGoodsTypes',
		'ppsCommonCustomColumnsServiceFactory'];

	function PackageDetailsLayout(basicsLookupdataConfigGenerator, basicsLookupdataLookupFilterService, uomFilterService, $injector, packageTypes, trsLgmRecordTypes,
								  packageTypeHelperServ, packageStatusHelperServ, lookupParamStorage,
								  lookupService, logisticCommonLayoutOverloadService, ppsUIUtilService, trsGoodsTypes,
								  customColumnsServiceFactory) {

		function getRouteId(entity) {
			var routeId = -1;
			if (entity.TrsRouteFk) {
				routeId = entity.TrsRouteFk;
			}
			return routeId;
		}

		function summaryFormatter(row, cell, value, columnDef, dataContext, flag) {
			var format = '';
			if (dataContext) {
				if (flag) {
					return dataContext.GoodIsCancelled;
				}
				switch (dataContext.GoodIsCancelled) {
					case true:
						format += ppsUIUtilService.getIcon('type-icons ico-warning20', 'transportplanning.package.hasCancelledGood');
						break;
				}
			}
			return format;
		}

		//register filters
		var filters = [
			{
				key: 'transportplanning-package-sitefk-filter',
				serverSide: true,
				fn: function () {
					return {Isdisp: true};
				}
			},
			{
				key: 'transportplanning-package-transportpackagefk-for-package-filter',
				fn: function (item) {
					if (item) {
						if (!packageStatusHelperServ.isTransportable(item.TrsPkgStatusFk) && packageTypeHelperServ.isPkg(item.TrsPkgTypeFk)) {
							return true;
						}
					}
					return false;
				}
			},
			{
				key: 'transportplanning-package-transportpackagefk-for-trspackagesubfk-filter',
				fn: function (item) {
					if (item) {
						if (item.TrsPkgTypeFk !== packageTypes.PackageSelection) {
							return true;
						}
						// if (!packageStatusHelperServ.isComplete(item.TrsPkgStatusFk)) {
						// 	return true;
						// }
					}
					return false;
				}
			},
			{
				key: 'transportplanning-package-trspkgtypefk-filter',
				fn: function (item) {
					if (item) {
						if (item.Description === 'Package Selection' || item.Id === 7) {
							return false;
						}

						//if a package does not belong to a route directly, its type cannot be PackageSelection.
						// if (entity === null || entity.TrsRouteFk === null || entity.TransportPackageFk !== null) {
						// 	return item.Id !== packageTypes.PackageSelection;
						// }
					}
					return true;
				}
			},
			{
				key: 'transportplanning-package-lgmdispatchheaderfk-filter',
				fn: function (item, entity) {
					if (item) {
						return entity && entity.CompanyFk === item.CompanyFk;
					}
					return false;
				}
			},
			{
				key: 'trs-package-lgmdispatchrecordfk-filter',
				fn: function (item, entity) {
					if (item) {
						if (entity.TrsPkgTypeFk === packageTypes.Product) {
							return item.RecordTypeFk === trsLgmRecordTypes.FabricatedProduct;
						}
						else if (entity.TrsPkgTypeFk === packageTypes.Resource) {
							return item.RecordTypeFk === trsLgmRecordTypes.Resource;
						}
						else if (entity.TrsPkgTypeFk === packageTypes.Material) {
							return item.RecordTypeFk === trsLgmRecordTypes.Material;
						}
					}
					return true;
				}
			},
			{
				key: 'trs-package-weight-uomfk-filter',
				fn: function (item) {
					return item.MassDimension !== null && item.MassDimension === 1;
				}
			}
		];

		basicsLookupdataLookupFilterService.registerFilter(filters);
		//declare temp variable for config of field trspkgtypefk
		var trspkgtypefkConfig = basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.transportpackagetype', null, {
			showIcon: true,
			filterKey: 'transportplanning-package-trspkgtypefk-filter'
		});

		var lgmjobfkLookupCfg = {
			navigator: {
				moduleName: 'logistic.job'
			},
			grid: {
				editor: 'lookup',
				editorOptions: {
					directive: 'logistic-job-paging-extension-lookup',
					lookupOptions: {
						displayMember: 'Code',
						showClearButton: true,
						additionalColumns: true,
						addGridColumns: [{
							field: 'Address.Address',
							id: 'address',
							name: 'Address',
							name$tr$: 'basics.common.entityAddress',
							width: 150,
							formatter: 'description'
						}],
					}
				},
				formatter: 'lookup',
				formatterOptions: {
					lookupType: 'logisticJobEx',
					displayMember: 'Code',
					version: 3
				}
			},
			detail: {
				type: 'directive',
				directive: 'basics-lookupdata-lookup-composite',
				options: {
					lookupDirective: 'logistic-job-paging-extension-lookup',
					displayMember: 'Code',
					descriptionMember: 'Address.Address',
					showClearButton: true
				}
			}
		};

		var trsGoodsAdditionalFilters = [{
			trsGoodTypeId: 'typeId',
			getAdditionalEntity: function (selected) {
				var typeId = null;
				switch (selected.TrsPkgTypeFk) {
					case packageTypes.Product:
						typeId = trsGoodsTypes.Product;
						break;
					case packageTypes.Bundle:
						typeId = trsGoodsTypes.Bundle;
						break;
					case packageTypes.Resource:
						typeId = trsGoodsTypes.Resource;
						break;
					case packageTypes.Material:
						typeId = trsGoodsTypes.Material;
						break;
					case packageTypes.Plant:
						typeId = trsGoodsTypes.Plant;
						break;
				}
				return {
					typeId: typeId
				};
			}
		}];

		var layout = {
			'fid': 'transportplanning.package',
			'version': '1.0.0',
			'showGrouping': true,
			'addValidationAutomatically': true,
			'change': function (entity, field) {
				$injector.get('transportplanningPackageDataServicePropertychangedManager').onPropertyChanged(entity, field);
			},
			'groups': [
				{
					gid: 'baseGroup',
					attributes: ['summary', 'trspkgstatusfk','kind', 'code', 'descriptioninfo', 'trspkgtypefk', 'good','trsgoodsfk',
						'lengthcalculated', 'widthcalculated',
						'heightcalculated', 'weightcalculated',
						'lgmdispatchheaderfk',
						'lgmdispatchrecordfk', 'quantity', 'uomfk', 'commenttext', 'projectfk',
						'weight', 'uomweightfk', 'length', 'uomlengthfk', 'width', 'uomwidthfk', 'height', 'uomheightfk',
						'drawingfk', 'bundlefk', 'materialinfo', 'infosummary', 'productstatus']
				},
				{
					gid: 'deliveryGroup',
					attributes: ['trsroutefk', 'lgmjobsrcfk', 'trswaypointsrcfk', 'lgmjobdstfk', 'trswaypointdstfk', 'productionorder', 'reproduced']
				},
				{
					gid: 'dangerousGoodsGroup',
					attributes: ['dangerclassfk', 'packagetypefk', 'dangerquantity', 'uomdgfk']
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
				summary: {
					readonly: true,
					grid: {
						formatter: summaryFormatter
					}, detail: {
						type: 'directive',
						directive: 'productionplanning-common-html-directive',
						options: {
							formatter: summaryFormatter
						}
					}
				},
				trspkgtypefk: trspkgtypefkConfig,
				// trsroutefk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
				// 	dataServiceName: 'transportplanningTransportRouteLookupDataService',
				// 	enableCache: false,
				// 	//readonly: true,
				// 	navigator: {
				// 		moduleName: 'transportplanning.transport'
				// 	}
				// }),
				trsroutefk: {
					navigator: {
						moduleName: 'transportplanning.transport'
					},
					grid: {
						editor: 'lookup',
						editorOptions: {
							directive: 'transportplanning-transport-route-lookup'
						},
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'TrsRoute',
							displayMember: 'Code',
							version: 3,//for new lookup master api, the value of version should be greater than 2
						},
						//width: 70
					},
					detail: {
						type: 'directive',
						directive: 'basics-lookupdata-lookup-composite',
						options: {
							lookupDirective: 'transportplanning-transport-route-lookup',
							descriptionMember: 'DescriptionInfo.Description'
						}
					}
				},
				code: {
					navigator: {
						moduleName: 'transportplanning.package'
					}
				},

				lgmdispatchheaderfk: logisticCommonLayoutOverloadService.getDispatchHeaderLookupOverload('LgmDispatchHeaderFk', true),
				lgmdispatchrecordfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
					dataServiceName: 'trsPkglogisticDispatchingRecordLookupDataService',
					navigator: {
						moduleName: 'logistic.dispatching'
					},
					filterKey: 'trs-package-lgmdispatchrecordfk-filter',
					filter: function (item) {
						var readData = {};
						if (item) {
							if (item.CompanyFk) {
								readData.PKey2 = item.CompanyFk;
							}
							if (item.LgmDispatchHeaderFk) {
								readData.PKey1 = item.LgmDispatchHeaderFk;
							}
						}
						return readData;
					}
				}),
				good: {
					detail: {
						type: 'directive',
						directive: 'transportplanning-package-select-control',
						options: {
							rid: 'good',
							model: 'Good',
							gridOptions: {
								disableCreateSimilarBtn: true
							}
						}
					},
					grid: {
						formatter: 'dynamic',
						editor: 'dynamic',
						domain: function (item, column) {
							var domain = 'lookup';//(see domainList in domain-service.js)
							var prop = packageTypes.properties[item.TrsPkgTypeFk];
							if (prop) {
								//domain = 'lookup';
								column.editorOptions = {
									directive: prop.directive,
									lookupOptions: {
										events: [
											{
												name: 'onSelectedItemChanged',
												handler: function (e, args) {
													args.entity.selectedGood = args.selectedItem;
												}
											}
										],
										gridOptions: {
											disableCreateSimilarBtn: true//for material lookup only
										}
									}
								};
								column.formatterOptions = {
									lookupType: prop.lookupType,
									displayMember: prop.displayMember
								};
								if (prop.version) {
									column.formatterOptions.version = prop.version;//for new lookup master api, the value of version should be greater than 2
								}

								// set lookup default filter
								var additionalFilters = null;
								switch (item.TrsPkgTypeFk) {
									case packageTypes.Bundle:
										additionalFilters = [{
											getAdditionalEntity: function () {
												var route = lookupService.getLookupItem('TrsRoute', item.TrsRouteFk);
												var siteId = _.get(route, 'SiteFk');
												return {
													siteId: siteId
												};
											},
											siteId: 'siteId'
										}, {
											getAdditionalEntity: function () {
												var job = lookupService.getLookupItem('logisticJobEx',item.LgmJobDstFk);
												var projectId = job ? job.ProjectFk : null;
												return {
													projectId: projectId
												};
											},
											projectId: 'projectId',
											projectIdReadOnly: function (entity) {
												return !!entity.projectId;
											}
										}];
										break;
									case packageTypes.Product:
										//noinspection JSConstructorReturnsPrimitive,JSConstructorReturnsPrimitive
										additionalFilters = [{
											getAdditionalEntity: function () {
												var job = lookupService.getLookupItem('logisticJobEx',item.LgmJobDstFk);
												var projectId = job ? job.ProjectFk : null;
												return {
													ProjectId: projectId
												};
											},
											ProjectId: 'ProjectId',
											ProjectIdReadOnly: function (entity) {
												return !!entity.ProjectId;
											}
										}];
										break;
									case packageTypes.Resource:
										additionalFilters = [{
											getAdditionalEntity: function () {
												var route = lookupService.getLookupItem('TrsRoute', item.TrsRouteFk);
												var siteId = _.get(route, 'SiteFk');
												return {
													siteId: siteId
												};
											},
											siteFk: 'siteId'
										}];
										break;
								}
								column.editorOptions.lookupOptions.additionalFilters = additionalFilters;
							}
							else {
								column.editorOptions = {readonly: true};
								column.formatterOptions = null;
							}

							return domain;
						}
					}
				},

				quantity: {
					disallowNegative: true
				},

				projectfk: {
					'navigator': {
						moduleName: 'project.main'
					},
					'detail': {
						'type': 'directive',
						'directive': 'basics-lookupdata-lookup-composite',
						'options': {
							lookupDirective: 'basics-lookup-data-project-project-dialog',
							descriptionField: 'ProjectName',
							descriptionMember: 'ProjectName',
							lookupOptions: {
								initValueField: 'ProjectNo'
							}

						},
					},
					'grid': {
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'Project',
							displayMember: 'ProjectNo'
						},
						editor: 'lookup',
						editorOptions: {
							lookupOptions: {
								initValueField: 'ProjectNo'
							},
							'displayMember': 'ProjectName',
							directive: 'basics-lookup-data-project-project-dialog'

						}
					}
				},
				uomfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
					dataServiceName: 'basicsUnitLookupDataService',
					cacheEnable: true
				}),

				lgmjobsrcfk: lgmjobfkLookupCfg,
				lgmjobdstfk: lgmjobfkLookupCfg,
				trswaypointsrcfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
					dataServiceName: 'transportplanningTransportWaypointLookupDataService',
					additionalColumns: false,
					filter: getRouteId
				}),

				trswaypointdstfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
					dataServiceName: 'transportplanningTransportWaypointLookupDataService',
					additionalColumns: false,
					filter: getRouteId
				}),


				trspkgstatusfk: basicsLookupdataConfigGenerator.provideReadOnlyConfig('basics.customize.trspackagetatus', null, {
					showIcon: true,
					imageSelectorService: 'platformStatusSvgIconService',
					svgBackgroundColor: 'BackgroundColor',
					backgroundColorType: 'dec',
					backgroundColorLayer: [1, 2, 3, 4, 5, 6]
				}),

				weight: {
					disallowNegative: true,
					formatter: 'convert',
					nameExtension: 'uom'
				},
				uomweightfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
					dataServiceName: 'basicsUnitLookupDataService',
					filterKey: uomFilterService.registerMassDimensionFilter(1),
					cacheEnable: true
				}),

				width: {
					disallowNegative: true,
					formatter: 'convert',
					nameExtension: 'uom'
				},
				uomwidthfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
					dataServiceName: 'basicsUnitLookupDataService',
					filterKey: uomFilterService.registerLengthDimensionFilter(1),
					cacheEnable: true
				}),

				length: {
					disallowNegative: true,
					formatter: 'convert',
					nameExtension: 'uom'
				},
				uomlengthfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
					dataServiceName: 'basicsUnitLookupDataService',
					filterKey: uomFilterService.registerLengthDimensionFilter(1),
					cacheEnable: true
				}),

				height: {
					disallowNegative: true,
					formatter: 'convert',
					nameExtension: 'uom'
				},
				uomheightfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
					dataServiceName: 'basicsUnitLookupDataService',
					filterKey: uomFilterService.registerLengthDimensionFilter(1),
					cacheEnable: true
				}),

				kind: {
					'readonly': true,
					'grid': {
						formatter: 'image',
						formatterOptions: {
							imageSelector: 'transportplanningPackageKindIconService',
							tooltip: true,
						}
					},
					'detail': {
						type: 'imageselect',
						options: {
							useLocalIcons: true,
							items: $injector.get('transportplanningPackageKindIconService').getIcons()
						}
					}
				},
				//new info fields
				drawingfk: {
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
								displayMember: 'Code',
								readOnly: true
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
							displayMember: 'Code',
							descriptionMember: 'Description'
						}
					},
					readonly: true
				},
				bundlefk: {
					grid: {
						editor: 'lookup',
						directive: 'basics-lookupdata-lookup-composite',
						editorOptions: {
							directive: 'transportplanning-bundle-lookup',
							lookupOptions: {
								additionalColumns: true,
								addGridColumns: [{
									id: 'Description',
									field: 'DescriptionInfo.Description',
									name: 'Description',
									width: 300,
									formatter: 'description',
									name$tr$: 'cloud.common.entityDescription'
								}],
								displayMember: 'Code',
								readOnly: true
							}
						},
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'TrsBundleWithDocLookup',
							displayMember: 'Code'
						},
						width: 70
					},
					detail: {
						type: 'directive',
						directive: 'basics-lookupdata-lookup-composite',
						options: {
							lookupDirective: 'transportplanning-bundle-lookup',
							displayMember: 'Code',
							descriptionMember: 'DescriptionInfo.Description'
						}
					},
					readonly: true
				},
				materialinfo: {
					readonly: true
				},
				infosummary: {
					readonly: true
				},
				productstatus: basicsLookupdataConfigGenerator.provideReadOnlyConfig('basics.customize.ppsproductstatus', null, {
					field: 'StatusFk',
					showIcon: true,
					imageSelectorService: 'platformStatusSvgIconService',
					svgBackgroundColor: 'ProductStatusBackgroundColor',
					backgroundColorType: 'dec',
					backgroundColorLayer: [1, 2, 3, 4, 5, 6]
				}),
				trsgoodsfk: {
					grid: {
						editor: 'lookup',
						directive: 'basics-lookupdata-lookup-composite',
						editorOptions: {
							directive: 'trs-requisition-trs-goods-dialog-lookup',
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
								displayMember: 'DisplayTxt',
								defaultFilter: {projectId: 'ProjectFk'},
								additionalFilters: trsGoodsAdditionalFilters
							}
						},
						formatter: 'lookup',
						formatterOptions: {
							version: 3,
							lookupType: 'TrsGoods',
							displayMember: 'DisplayTxt'
						},
						width: 70
					},
					detail: {
						type: 'directive',
						directive: 'basics-lookupdata-lookup-composite',
						options: {
							lookupDirective: 'trs-requisition-trs-goods-dialog-lookup',
							descriptionMember: 'Description',
							lookupOptions: {
								defaultFilter: {projectId: 'ProjectFk'},
								additionalFilters: trsGoodsAdditionalFilters
							}
						}
					}
				},
				dangerclassfk: {
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
				packagetypefk:basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.packagingtypes'),
				uomdgfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
					dataServiceName: 'basicsUnitLookupDataService',
					cacheEnable: true,
					showClearButton: false
				}, {required : true}),
				productionorder: {
						readonly: true
					},
				reproduced: {
					readonly: true
				}
			}
		};

		var customColumnService = customColumnsServiceFactory.getService(moduleName);
		customColumnService.setEventTypeConfig(layout, 'productionplanning.common.item.event');

		return layout;
	}

})(angular);
