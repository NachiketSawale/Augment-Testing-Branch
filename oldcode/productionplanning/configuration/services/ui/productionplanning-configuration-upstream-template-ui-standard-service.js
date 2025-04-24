(function () {
	/* global _ */
	'use strict';
	const moduleName = 'productionplanning.configuration';

	angular.module(moduleName).factory('ppsUpstreamItemTemplateLayout', Layout);

	Layout.$inject = ['basicsLookupdataConfigGenerator', 'basicsLookupdataLookupFilterService', 'ppsProjectUtilService', 'productionplanningItemDataService',
		'upstreamTypes', 'upstreamGoodsTypes', 'prcPackageCreateService', 'basicsCommonCreateDialogConfigService',
		'moment', 'resRequisitionCreateOption', '$injector', 'platformLayoutHelperService'];

	function Layout(basicsLookupdataConfigGenerator, basicsLookupdataLookupFilterService, ppsProjectUtilService, productionplanningItemDataService,
		upstreamTypes, upstreamGoodsTypes, prcPackageCreateService, createDialogConfigService,
		moment, resRequisitionCreateOption, $injector, platformLayoutHelperService) {
		function createLayout(dataService) {

			//initialize some necessary translation first, to avoid active cell destroy
			//platformgrid.directive.js destroy()
			$injector.get('logisticJobTranslationService');

			var upstreamResultLookupOptions = {
				showAddButton: true,
				showClearButton: true,
				openAddDialogFn: function (injector, entity, settings) {
					switch ((settings.lookupType)) {
						case 'PPSItem':
							return productionplanningItemDataService.createUpstreamItem(entity, null).then(function (newItem) {
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
								return {
									Quantity: entity.Quantity,
									UomFk: entity.UomFk,
									ProjectFk: null,
									JobFk: null,
									ResourceFk: entity.PpsUpstreamGoodsTypeFk === 2 ? entity.UpstreamGoods : null
								};
							};
							return createDialogConfigService.showDialog(createOptions).then(function (result) {
								if (result.ok) {
									return result.data;
								}
							});
						case 'PrcPackage':
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
				//filterKey: 'pps-upstream-item-material-is-product-filter',
				events: [
					{
						name: 'onSelectedItemChanged',
						handler: function (e, args) {
							args.entity.selectedUpstreamGoods = args.selectedItem;
						}
					}
				]
			};

			return {
				'fid': 'productionplanning.configuration.ppsUpstreamItemTemplateLayout',
				'version': '1.0.0',
				'showGrouping': true,
				'addValidationAutomatically': true,
				addAdditionalColumns: true,
				'groups': [
					{
						gid: 'baseGroup',
						attributes: ['code', 'descriptioninfo', 'ppsupstreamtypefk', 'upstreamresult', 'upstreamresultstatus', 'ppsupstreamgoodstypefk', 'upstreamgoods', 'quantity', 'basuomfk',
							'commenttext', 'ppseventreqforfk', 'ppseventtypereqforfk', 'isfortransport']
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
					ppsupstreamgoodstypefk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.ppsupstreamgoodstype', null, {filterKey: 'ppsitem-upstream-goodtype-filter', showClearButton: true}),
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
									//finalOptions.filterKey = pesItemPrjFilterKey;
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
					basuomfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
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
					}
				}
			};
		}

		return {
			createLayout: createLayout
		};
	}
})();

(function () {
	'use strict';
	var moduleName = 'productionplanning.configuration';

	angular.module(moduleName).service('ppsUpstreamItemTemplateUIStandardService', UIStandardService);

	UIStandardService.$inject = ['platformUIConfigInitService', 'productionplanningConfigurationTranslationService',
		'ppsUpstreamItemTemplateLayout', 'upstreamTypes', 'platformUIStandardExtentService',
		'platformObjectHelper', 'upstreamGoodsTypes'];

	function UIStandardService(platformUIConfigInitService, productionplanningConfigurationTranslationService,
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
					moduleSubModule: 'ProductionPlanning.Configuration',
					typeName: 'PpsUpstreamItemTemplateDto'
				},
				translator: productionplanningConfigurationTranslationService
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