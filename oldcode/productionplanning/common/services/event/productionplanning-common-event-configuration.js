(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.common';

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

	//master Layout
	angular.module(moduleName).factory('productionplanningCommonEventDetailLayout', ProductionplanningCommonEventLayout);
	ProductionplanningCommonEventLayout.$inject = ['productionplanningCommonEventDetailLayoutFactory'];
	function ProductionplanningCommonEventLayout(detailLayoutFactory) {
		return detailLayoutFactory.getLayout();
	}

	angular.module(moduleName).factory('productionplanningCommonEventDetailLayoutFactory', DetailLayoutFactory);
	DetailLayoutFactory.$inject = ['$injector', 'basicsLookupdataConfigGenerator',
		'platformLayoutHelperService', 'productionplanningCommonLayoutHelperService'];
	function DetailLayoutFactory($injector, basicsLookupdataConfigGenerator,
								 platformLayoutHelperService, ppsCommonLayoutHelperService) {

		var belongingColumnConfig = {
			grid: {
				id: 'Belonging',
				field: 'Belonging',
				name: '*Belonging',
				name$tr$: 'productionplanning.common.event.belonging',
				readonly: true,
				formatter: 'image',
				formatterOptions: {
					imageSelector: 'productionplanningCommonEventIconService',
					tooltip: true
				}
			},
			detail: {
				gid: 'baseGroup',
				model: 'Belonging',
				label: '*Belonging',
				label$tr$: 'productionplanning.common.event.belonging',
				readonly: true,
				type: 'imageselect',
				options: {
					useLocalIcons: true,
					items: $injector.get('productionplanningCommonEventIconService').getIcons()
				}
			}
		};

		var service = {};

		service.getLayout = function (foreignKey) {
			var eventTypeFilter = 'productionplanning-common-event-ordinary-filter';
			switch (foreignKey) {
				case 'ProductFk': eventTypeFilter = 'pps-common-event-type-product-filter'; break;
				case 'ProductionSetFk': eventTypeFilter = 'pps-common-event-type-productionset-filter'; break;
			}

			return {
				'fid': 'productionplanning.common.eventlayout',
				'version': '1.0.0',
				'showGrouping': true,
				'addValidationAutomatically': true,
				'groups': [{
					gid: 'event',
					attributes: ['eventcode', 'eventtypefk', 'plannedstart', 'plannedfinish', 'earlieststart', 'lateststart',
						'earliestfinish', 'latestfinish', 'calcalendarfk', 'psdactivityfk', 'actualstart', 'actualfinish',
						'quantity', 'basuomfk', 'islocked','islive','userflag1','userflag2', 'dateshiftmode']
				}, {
					gid: 'Assignment',
					attributes: ['prjlocationfk', 'mdccontrollingunitfk', 'lgmjobfk']
				}, {
					gid: 'entityHistory',
					isHistory: true
				}],
				'overloads': {
					eventcode: {
						readonly: true,
						detail: {
							requiredInErrorHandling: true
						}
					},
					eventtypefk: ppsCommonLayoutHelperService.provideEventTypeLookupOverload(eventTypeFilter),
					psdactivityfk: {
						readonly: true,
						navigator: {
							moduleName: 'scheduling.main'
						},
						grid: {
							editor: 'lookup',
							editorOptions: {
								directive: 'scheduling-main-activity-structure-lookup',
								lookupOptions: {
									filterKey: 'procurement-payment-schedule-activity-filter',
									displayMember: 'Description',
									showClearButton: true
								}
							},
							formatter: 'lookup',
							sortable: false,
							formatterOptions: {
								lookupType: 'SchedulingActivity',
								displayMember: 'Description'
							},
							width: 100
						},
						detail: {
							type: 'directive',
							directive: 'basics-lookupdata-lookup-composite',
							options: {
								lookupDirective: 'scheduling-main-activity-structure-lookup',
								descriptionMember: 'Description',
								lookupOptions: {
									filterKey: 'procurement-payment-schedule-activity-filter',
									showClearButton: true
								}
							}
						}
					},
					calcalendarfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'schedulingLookupCalendarDataService',
						enableCache: true
					}),
					'prjlocationfk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'projectLocationLookupDataService',
						cacheEnable: true,
						additionalColumns: true,
						filter: function (item) {
							return _.isNull(item.ProjectFk) ? -1 : item.ProjectFk;
						},
						showClearButton: true,
						readonly: true
					}),
					'mdccontrollingunitfk': {
						'detail': {
							'type': 'directive',
							'directive': 'basics-lookupdata-lookup-composite',
							'options': {
								lookupDirective: 'basics-master-data-context-controlling-unit-lookup',
								descriptionMember: 'DescriptionInfo.Translated',
								lookupOptions: {
									filterKey: 'productionplanning-common-event-controlling-unit-filter'
								}
							}
						},
						'grid': {
							editor: 'lookup',
							editorOptions: {
								lookupOptions: {
									showClearButton: true,
									filterKey: 'productionplanning-common-event-controlling-unit-filter'
								},
								directive: 'basics-master-data-context-controlling-unit-lookup'
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'Controllingunit',
								displayMember: 'Code'
							}
						}
					},
					'lgmjobfk': ppsCommonLayoutHelperService.provideJobExtensionLookupOverload({projectFk: 'ProjectFk'}),
					'basuomfk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'basicsUnitLookupDataService',
						filterKey: '',
						cacheEnable: true
					}),
					dateshiftmode:  {
						grid: {
							formatter: 'select',
							formatterOptions: {
								serviceName : 'productionplanningCommonDateShiftModeService',
								valueMember: 'Id',
								displayMember: 'Description'
							},
							editor: 'select',
							editorOptions: {
								serviceName : 'productionplanningCommonDateShiftModeService',
								valueMember: 'Id',
								displayMember: 'Description'
							}
						},
						detail: {
							type: 'select',
							required: false,
							options: {
								serviceName : 'productionplanningCommonDateShiftModeService',
								valueMember: 'Id',
								displayMember: 'Description'
							},
							readonly: true
						}
					}
				},
				'addition': {
					grid: extendGrouping([belongingColumnConfig.grid]),
					detail: [belongingColumnConfig.detail]
				}
			};
		};

		return service;
	}

})(angular);