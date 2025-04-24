/**
 * Created by anl on 2/5/2018.
 */

(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.activity';

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

	//activity Layout
	angular.module(moduleName).factory('ppsActivityLayoutConfig', ['$translate',
		function ($translate) {
			var service = {};
		service.addition = {
			grid: extendGrouping([
				{
					afterId: 'mntrequisitionfk',
					id: 'Mounting Requisition',
					field: 'MntRequisitionFk',
					name$tr$: 'productionplanning.mounting.requisition.description',
					sortable: true,
					width: 140,
					formatter: 'lookup',
					formatterOptions: {
						lookupType: 'MntRequisition',
						displayMember: 'DescriptionInfo.Translated'
					}
				},
				{
					afterId: 'psdactivityfk',
					id: 'Psd Activity',
					field: 'PsdActivityFk',
					name$tr$: 'productionplanning.common.event.psdActivityDesc',
					sortable: true,
					width: 140,
					formatter: 'lookup',
					formatterOptions: {
						lookupType: 'SchedulingActivity',
						displayMember: 'Description'
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
					},
					readonly: true
				}
			]),
			detail: [
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

	angular.module(moduleName).factory('ppsActivityLayout', ActivityLayout);
	ActivityLayout.$inject = ['basicsLookupdataConfigGenerator', 'platformLayoutHelperService', '$injector','productionplanningCommonLayoutHelperService'];
	function ActivityLayout(basicsLookupdataConfigGenerator, platformLayoutHelperService, $injector, ppsCommonLayoutHelperService) {

		return {
			'fid': 'productionplanning.activity.activityLayout',
			'version': '1.0.0',
			'showGrouping': true,
			'addValidationAutomatically': true,
			'groups': [
				{
					gid: 'baseGroup',
					attributes: ['actstatusfk', 'code', 'descriptioninfo', 'mntrequisitionfk', 'estworkinghours', 'actworkinghours',
						'lgmjobfk', 'remarks', 'islive', 'eventtypefk']
				},
				{
					gid: 'planInformation',
					attributes: ['actualstart', 'actualfinish', 'plannedstart', 'plannedfinish', 'earlieststart', 'lateststart',
						'earliestfinish', 'latestfinish', 'dateshiftmode']
				},
				{
					gid: 'Assignment',
					attributes: ['prjlocationfk', 'mdccontrollingunitfk','psdactivityfk']
				},
				{
					gid: 'entityHistory',
					isHistory: true
				},
				{
					gid: 'userDefTextGroup',
					isUserDefText: true,
					attCount: 5,
					attName: 'userdefined',
					noInfix: true
				}
			],
			'overloads': {
				code: {
					navigator: {
						moduleName: 'productionplanning.activity'
					}
				},
				mntrequisitionfk: {
					navigator: {
						moduleName: 'productionplanning.mounting'
					},
					grid: {
						editor: 'lookup',
						editorOptions: {
							directive: 'productionplanning-mounting-requisition-lookup'
						},
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'MntRequisition',
							displayMember: 'Code'
						},
						width: 120
					},
					detail: {
						type: 'directive',
						directive: 'basics-lookupdata-lookup-composite',
						options: {
							lookupDirective: 'productionplanning-mounting-requisition-lookup',
							descriptionMember: 'DescriptionInfo.Description'
						}
					}
				},
				eventtypefk: {
					grid: {
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'EventType',
							displayMember: 'DescriptionInfo.Description',
							version: 3
						},
						editor: 'lookup',
						editorOptions: {
							lookupField: 'EventType',
							directive: 'productionplanning-common-event-type-lookup',
							displayMember: 'DescriptionInfo.Description',
							lookupOptions: {
								showClearButton: true,
								filterKey: 'productionplanning-mounting-activity-eventtype-filter'
							}
						},
						width: 90
					},
					detail: {
						type: 'directive',
						directive: 'basics-lookupdata-lookup-composite',
						options: {
							lookupOptions: {
								filterKey: 'productionplanning-mounting-activity-eventtype-filter'
							},
							lookupDirective: 'productionplanning-common-event-type-lookup',
							descriptionMember: 'DescriptionInfo.Description'
						},
						change: function (entity) {
							if (entity.Version === 0) {
								var actService = $injector.get('productionplanningActivityActivityDataService');
								actService.updateActivity(entity);
							}
						}
					}
				},
				'actstatusfk': basicsLookupdataConfigGenerator.provideReadOnlyConfig('basics.customize.mountingactivitystatus', null, {
					showIcon: true
				}),
				estworkinghours: {
					editorOptions: {
						decimalPlaces: 3
					}
				},
				actworkinghours: {
					editorOptions: {
						decimalPlaces: 3
					}
				},
				islive: {
					readonly: true
				},
				lgmjobfk: ppsCommonLayoutHelperService.provideJobExtensionLookupOverload({projectFk: 'ProjectId'}),
				prjlocationfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
					dataServiceName: 'projectLocationLookupDataService',
					cacheEnable: true,
					additionalColumns: true,
					filter: function (item) {
						return item.ProjectId;
					},
					showClearButton: true
				}),
				mdccontrollingunitfk: {
					detail: {
						type: 'directive',
						directive: 'basics-lookupdata-lookup-composite',
						options: {
							lookupDirective: 'basics-master-data-context-controlling-unit-lookup',
							descriptionMember: 'DescriptionInfo.Translated',
							lookupOptions: {
								filterKey: 'productionplanning-mounting-activity-controlling-unit-filter'
							}
						}
					},
					grid: {
						editor: 'lookup',
						editorOptions: {
							lookupOptions: {
								showClearButton: true,
								filterKey: 'productionplanning-mounting-activity-controlling-unit-filter'
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
				psdactivityfk: {
					grid: {
						editor: 'lookup',
						editorOptions: {
							directive: 'scheduling-main-activity-structure-lookup',
							lookupOptions: {
								filterKey: 'mnt-activity-psd-activity-filter',
								showClearButton: true
							}
						},
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'SchedulingActivity',
							displayMember: 'Code'
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
								filterKey: 'mnt-activity-psd-activity-filter',
								showClearButton: true
							}
						}
					}
				},
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
				}
			}
		};
	}

})(angular);