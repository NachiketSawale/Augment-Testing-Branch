(function (angular) {
	'use strict';


	var moduleName = 'productionplanning.productionset';
	var ProductionsetModul = angular.module(moduleName);

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

	ProductionsetModul.factory('productionplanningProductionsetMainLayoutConfig', ['$translate',
		function ($translate) {
			var service = {};
			service.addition = {
				grid: extendGrouping([
					{
						afterId: 'sitefk',
						id: 'siteDesc',
						field: 'SiteFk',
						name: 'Site-Description',
						name$tr$: 'basics.site.entityDesc',
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'SiteNew',
							displayMember: 'DescriptionInfo.Description',
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
							serviceName : 'productionplanningCommonLocationInfoService',
							valueMember: 'Id',
							displayMember: 'BranchPath'
						}
					}
				]),
				detail:[
					{
						gid: 'Assignment',
						rid: 'branchpath',
						model: 'PrjLocationFk',
						label: $translate.instant('productionplanning.common.branchPath'),
						type: 'select',
						options: {
							serviceName: 'productionplanningCommonLocationInfoService',
							valueMember: 'Id',
							displayMember: 'BranchPath'
						},
						readonly: true
					}
				]
			};
			return service;
		}]);

	//Production Set Details
	ProductionsetModul.factory('productionplanningProductionsetDetailLayout', ProductionsetDetailLayout);
	ProductionsetDetailLayout.$inject = ['$injector',
	'basicsLookupdataConfigGenerator',
	'basicsLookupdataLookupFilterService',
	'productionplanningCommonLayoutHelperService',
	'ppsCommonCustomColumnsServiceFactory'];

	function ProductionsetDetailLayout($injector,
		basicsLookupdataConfigGenerator,
		basicsLookupdataLookupFilterService,
		ppsCommonLayoutHelperService,
		customColumnsServiceFactory) {

		// register lookup filters
		var filters = [{
			key: 'productionplanning-productionset-eventtype-filter',
			fn: function (item) {
				if (item) {
					return item.PpsEntityFk !== null && item.PpsEntityFk === 15;
					//"PpsEntityFK === 15" maps productionset pps entity type
				}
				return false;
			}
		}];
		_.each(filters, function (filter) {
			if (!basicsLookupdataLookupFilterService.hasFilter(filter.key)) {
				basicsLookupdataLookupFilterService.registerFilter(filter);
			}
		});

		var layout =  {
			'fid': 'productionplanning.productionset',
			'version': '1.0.0',
			'showGrouping': true,
			'addValidationAutomatically': true,
			'change': function (entity, field) {
				var dataService = $injector.get('productionplanningProductionsetMainService');
				dataService.onEntityPropertyChanged(entity, field);
			},
			'groups': [
				{
					gid: 'baseGroup',
					attributes: ['ppsprodsetstatusfk', 'code', 'descriptioninfo', 'eventtypefk', 'islive', 'productionsetparentfk', 'isusereditedvalue', 'commenttext']
				},
				{
					gid: 'productionGroup',
					attributes: ['sitefk', 'productionsitefk']
				},
				{
					gid: 'Assignment',
					attributes: ['prjlocationfk', 'mdccontrollingunitfk']
				},
				{
					gid: 'planningInfoGroup',
					attributes: ['quantity', 'actualquantity', 'remainingquantity', 'basuomfk', 'plannedstart',
						'plannedfinish', 'earlieststart', 'lateststart', 'earliestfinish', 'latestfinish', 'dateshiftmode']
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
				productionsitefk: {
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
				ppsprodsetstatusfk: basicsLookupdataConfigGenerator.provideReadOnlyConfig('basics.customize.ppsproductionsetstatus', null, {
					showIcon: true,
					imageSelectorService: 'platformStatusSvgIconService',
					svgBackgroundColor: 'BackgroundColor',
					backgroundColorType: 'dec',
					backgroundColorLayer: [1, 2, 3, 4, 5, 6]
				}),
				eventtypefk: ppsCommonLayoutHelperService.provideEventTypeLookupOverload('productionplanning-productionset-eventtype-filter'),
				mdccontrollingunitfk: ppsCommonLayoutHelperService.providePrjControllingUnitLookupOverload(),
				prjlocationfk: ppsCommonLayoutHelperService.providePrjLocationLookupOverload(),
				basuomfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
					dataServiceName: 'basicsUnitLookupDataService',
					filterKey: '',
					cacheEnable: true,
					showClearButton: false
				}),
				dateshiftmode: {
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
						},
						readonly: true
					},
					detail: {
						type: 'select',
						required: false,
						options: {
							serviceName : 'productionplanningCommonDateShiftModeService',
							valueMember: 'Id',
							displayMember: 'Description'
						}
					}
				},
				actualquantity : {
					readonly : true
				},
				remainingquantity : {
					readonly : true
				},
				productionsetparentfk: {
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
				}
			}
		};

		var customColumnService = customColumnsServiceFactory.getService(moduleName);
		customColumnService.setEventTypeConfig(layout, 'productionplanning.common.item.event');

		return layout;
	}

})(angular);