(function (angular) {
	'use strict';
	/* globals angular, _ */
	var moduleName = 'transportplanning.transport';

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

	var defaultColumnConfig = {
		grid: {
			id: 'defaultIcon',
			field: 'DefaultSrcDst',
			name: 'Default Source/Destination',
			name$tr$: 'transportplanning.transport.defaultSrcDst',
			readonly: true,
			formatter: 'lookup',
			formatterOptions: {
				displayMember: '',
				dataServiceName: 'transportplanningTransportWaypointDefaultSrcDstService',
				imageSelector: 'transportplanningTransportWaypointDefaultSrcDstService'
			}
		},
		detail: {
			gid: 'baseGroup',
			model: 'DefaultSrcDst',
			label: 'Default Source/Destination',
			label$tr$: 'transportplanning.transport.defaultSrcDst',
			readonly: true,
			type: 'directive',
			directive: 'transportplanning-transport-waypoint-defaultsrcdst-lookup',
			options: {
				imageSelector: 'transportplanningTransportWaypointDefaultSrcDstService'
			}
		}
	};

	//Waypoint Layout Config
	angular.module(moduleName).value('transportplanningTransportWaypointLayoutConfig', {
		'addition': {
			'grid': extendGrouping([defaultColumnConfig.grid]),
			'detail': [defaultColumnConfig.detail]
		}
	});

	//Waypoint Layout
	angular.module(moduleName).factory('transportplanningTransportWaypointLayout', transportplanningTransportWaypointLayout);
	transportplanningTransportWaypointLayout.$inject = ['basicsLookupdataConfigGenerator', '$injector', 'platformLayoutHelperService', 'transportplanningTransportWaypointDataService'];
	function transportplanningTransportWaypointLayout(basicsLookupdataConfigGenerator, $injector, platformLayoutHelperService, waypointDataService) {
		var uomfkLookupCfg = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
			dataServiceName: 'basicsUnitLookupDataService',
			filterKey: 'transportplanning-transport-waypoint-uomfk-filter',
			cacheEnable: true,
			events: [
				{
					name: 'onSelectedItemChanged',
					handler: function UpdateDisctance(e, args) {
						var waypointService = $injector.get('transportplanningTransportWaypointDataService');
						waypointService.setWaypointDistanceUom(args.selectedItem);
						var transportMainService = $injector.get('transportplanningTransportMainService');
						transportMainService.setRouteDistanceUom('waypoint', args.selectedItem);
						if (args.selectedItem) {
							transportMainService.updateSumInfo('Distance');
							transportMainService.updateSumInfo('ActualDistance');
						}
						var waypointValidationService = $injector.get('transportplanningTransportWaypointValidationService');
						waypointValidationService.doValidateUomFk(args.entity, args.entity.UomFk, 'UomFk', args.entity.Distance);
					}
				}]
		});
		uomfkLookupCfg.grid = _.merge(uomfkLookupCfg.grid, {sortable: false});

		var currencyLookupCfg = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
			dataServiceName: 'basicsCurrencyLookupDataService',
			enableCache: true,
			readonly: false,
			additionalColumns: false
		});
		currencyLookupCfg.grid = _.merge(currencyLookupCfg.grid, {sortable: false});

		var businesspartnerLookupCfg = platformLayoutHelperService.provideBusinessPartnerLookupOverload();
		businesspartnerLookupCfg.grid = _.merge(businesspartnerLookupCfg.grid, {sortable: false});

		var jobfkLookupEvents = [{
			name: 'onSelectedItemChanged',
			handler: function (e, args) {
				args.entity.selectedJobDef = args.selectedItem;//remark:selectedJobDef will be used by onLgmJobFkChanged in waypoint-data-service-entity-propertychanged-extension.
			}
		}];

		var layout = {
			'fid': 'transportplanning.transport.waypointLayout',
			'version': '1.0.0',
			'showGrouping': true,
			'addValidationAutomatically': true,
			'change': function (entity, field) {
				waypointDataService.handleFieldChanged(entity, field);
			},
			'groups': [{
				gid: 'baseGroup',
				attributes: ['code', 'lgmjobfk', 'businesspartnerfk', 'deliveryaddresscontactfk',
						'distance', 'actualdistance', 'uomfk', 'expenses', 'currencyfk', 'commenttext']
			}, {
				gid: 'timeInfo',
				attributes: ['plannedtime', 'plannedfinish', 'earlieststart', 'earliestfinish',
					'lateststart', 'latestfinish', 'actualtime', 'actualend']
			},{
				gid: 'entityHistory',
				isHistory: true
			}],
			'overloads': {
				uomfk: uomfkLookupCfg,
				distance: {
					disallowNegative: true
				},
				lgmjobfk: {
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
								events: jobfkLookupEvents,
								defaultFilter: {activeJob: true, jobType: 'external'}
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
							showClearButton: true,
							lookupOptions: {
								events: jobfkLookupEvents,
								defaultFilter: {activeJob: true, jobType: 'external'}
							}
						}
					}
				},
				//lgmjobfk: platformLayoutHelperService.provideJobLookupOverload(),
				// lgmjobfk:  basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
				// 	dataServiceName: 'productionplanningCommonLogisticJobLookupDataService',
				// 	navigator: {
				// 		moduleName: 'logistic.job'
				// 	},
				// 	filter: function (entity) {
				// 		var projectId = -1;
				// 		var serv = $injector.get('transportplanningTransportMainService');
				// 		var selectedRoute = serv.getSelected();
				// 		if (selectedRoute && selectedRoute.ProjectFk !== null) {
				// 			projectId = selectedRoute.ProjectFk;
				// 		}
				// 		return projectId;
				// 	}
				// })
				currencyfk: currencyLookupCfg,
				actualdistance: {
					disallowNegative: true
				},
				expenses: {
					disallowNegative: true
				},
				businesspartnerfk: businesspartnerLookupCfg,
				deliveryaddresscontactfk: (function () {
					var settings = platformLayoutHelperService.provideBusinessPartnerFilteredContactLookupOverload(
						'logistic-job-business-partner-contact-filter'
					);
					settings.detail.options.showDetailButton = settings.grid.editorOptions.lookupOptions.showDetailButton = true;
					settings.detail.options.detailOptions = settings.grid.editorOptions.lookupOptions.detailOptions = $injector.get('businessPartnerContactDetailOptions');

					settings.detail.options.showAddButton = settings.grid.editorOptions.lookupOptions.showAddButton = true;
					var contactCreateOptions = _.clone($injector.get('businessPartnerContactCreateOptions'));//use the copy
					contactCreateOptions.creationData = function () {
						var selectedItem = $injector.get('transportplanningTransportWaypointDataService').getSelected();
						if (selectedItem) {
							return {mainItemId: selectedItem.BusinessPartnerFk};
						}
					};
					settings.detail.options.createOptions = settings.grid.editorOptions.lookupOptions.createOptions = contactCreateOptions;
					return settings;
				})()
			}
		};

		//set all attributes unsortable
		_.each(layout.groups, function (group) {
			if (group.attributes) {
				_.each(group.attributes, function (att) {
					if (!layout.overloads[att]) {
						layout.overloads[att] = {};
						layout.overloads[att].sortable = false;
					} else if (!layout.overloads[att].grid) {
						layout.overloads[att].sortable = false;
					} else {
						layout.overloads[att].grid.sortable = false;
					}
				});
			}
		});

		return layout;
	}

	angular.module(moduleName).factory('transportplanningTransportWaypointCreateService',
		['$q', 'transportplanningTransportWaypointDataService',
			'platformRuntimeDataService', 'transportplanningTransportWaypointProcessor',
			'transportplanningTransportReturnResourceWaypointLookupDataService', 'transportplanningTransportReturnResourcesRouteSettingService',
			'transportplanningTransportWaypointValidationService',
			function ($q, dataService,
					  platformRuntimeDataService, transportWaypointProcessor,
					  transportWaypointLookupDataService, transportReturnResourcesRouteSettingService,
					  transportWaypointValidationService) {
				var service = {};
				service.createItem = function (creationOptions, customCreationData) {
					customCreationData.existedCodes = [];
					_.each(transportWaypointLookupDataService.getListSync(), function (item) {
						customCreationData.existedCodes.push(item.Code);
					});
					return dataService.createItemSimple(creationOptions, customCreationData, function (data) {
						var route = transportReturnResourcesRouteSettingService.getResult().routeEntity;
						data.LgmJobFk = route.LgmJobFk;
						//transportWaypointProcessor.InitPlannedTime1(data, route, transportWaypointLookupDataService.getListSync());
						service.updateData = data;
						var validateResult = transportWaypointValidationService.validateLgmJobFk(data, data.LgmJobFk, 'LgmJobFk');
						platformRuntimeDataService.applyValidationResult(validateResult, data, 'LgmJobFk');
						return data;
					});
				};
				service.update = function () {
					var defer = $q.defer();
					dataService.updateSimple(service.updateData).then(function (result) {
						transportWaypointLookupDataService.clearCache();
						transportWaypointLookupDataService.updateWaypoint(service.updateData);
						defer.resolve(result);
					});
					return defer.promise;
				};
				service.deleteItem = function () {
					service.updateData = null;
					return $q.when(true);
				};
				return service;
			}]);

	angular.module(moduleName).factory('transportplanningTransportWaypointCreateOptions', ['$injector', function ($injector) {
		return {
			dataService: 'transportplanningTransportWaypointCreateService',
			uiStandardService: (function () {
				var service = {};
				service = Object.create($injector.get('transportplanningTransportWaypointUIStandardService'));
				var originalDetailView = _.cloneDeep(service.getStandardConfigForDetailView());
				originalDetailView.change = null;
				_.forEach(originalDetailView.rows, function (row) {
					row.navigator = null;
					row.change = null;
					if (row.options && row.options.lookupOptions) {
						row.options.lookupOptions.events = null;
					}
				});
				service.getStandardConfigForDetailView = function () {
					return originalDetailView;
				};
				return service;
			})(),
			validationService: 'transportplanningTransportWaypointValidationService',
			fields: ['Code', 'PlannedTime', 'LgmJobFk', 'CommentText'],
			creationData: {mainItemId: null}
		};
	}]);

})(angular);
