/**
 * Created by anl on 1/22/2018.
 */


(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.report';

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

	//report Layout
	angular.module(moduleName).value('productionplanningReportLayoutConfig', {
		addition: {
			grid: extendGrouping([
				{
					'afterId': 'clerkfk',
					'id': 'clerkDesc',
					'field': 'ClerkFk',
					'name': 'Clerk Description',
					'name$tr$': 'basics.clerk.clerkdesc',
					formatter: 'lookup',
					formatterOptions: {
						lookupType: 'Clerk',
						displayMember: 'Description',
						width: 140,
						version: 3
					}
				},
				{
					'afterId': 'activityfk',
					'id': 'activityDesc',
					'field': 'ActivityFk',
					'name': 'Activity-Description',
					'name$tr$': 'productionplanning.activity.activity.activityDesc',
					formatter: 'lookup',
					formatterOptions: {
						lookupType: 'MntActivity',
						displayMember: 'DescriptionInfo.Description',
						width: 140,
						version: 3
					}
				},
				{
					afterId: 'mntrequisitionid',
					id: 'Mounting Requisition',
					field: 'MntRequisitionId',
					name$tr$: 'productionplanning.mounting.requisition.description',
					sortable: true,
					width: 140,
					formatter: 'lookup',
					formatterOptions: {
						lookupType: 'MntRequisition',
						displayMember: 'DescriptionInfo.Translated'
					}
				}
			])
		}
	});

	angular.module(moduleName).factory('productionplanningReportLayout', ReportLayout);
	ReportLayout.$inject = ['basicsLookupdataConfigGenerator', 'platformLayoutHelperService'];
	function ReportLayout(basicsLookupdataConfigGenerator, platformLayoutHelperService) {

		var projectConfig = platformLayoutHelperService.provideProjectLookupOverload(null, 'ProjectId');
		projectConfig = _.merge(projectConfig, {readonly: true});

		return {
			'fid': 'productionplanning.report.reportLayout',
			'version': '1.0.0',
			'showGrouping': true,
			'addValidationAutomatically': true,
			'groups': [
				{
					gid: 'baseGroup',
					attributes: ['repstatusfk', 'code', 'descriptioninfo', 'activityfk', 'clerkfk', 'starttime', 'endtime', 'remarks',
					'mntrequisitionid', 'projectid']
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
						moduleName: 'productionplanning.report'
					}
				},
				activityfk: {
					navigator: {
						moduleName: 'productionplanning.activity'
					},
					grid: {
						editor: 'lookup',
						directive: 'basics-lookupdata-lookup-composite',
						editorOptions: {
							lookupOptions: {
								showClearButton: true
							},
							directive: 'productionplanning-activity-lookup-new-directive'
						},
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'MntActivity',
							displayMember: 'Code',
							version: 3
						},
						width: 70
					},
					detail: {
						type: 'directive',
						directive: 'basics-lookupdata-lookup-composite',
						options: {
							lookupDirective: 'productionplanning-activity-lookup-new-directive',
							descriptionMember: 'DescriptionInfo.Description'
						}
					}
				},
				clerkfk: {
					grid: {
						editor: 'lookup',
						directive: 'basics-lookupdata-lookup-composite',
						editorOptions: {
							lookupOptions: {showClearButton: true},
							directive: 'cloud-clerk-clerk-dialog'
						},
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'Clerk',
							displayMember: 'Code',
							version: 3,
						},
						width: 70
					},
					detail: {
						type: 'directive',
						directive: 'basics-lookupdata-lookup-composite',
						options: {
							lookupOptions: {showClearButton: true},
							lookupDirective: 'cloud-clerk-clerk-dialog',
							descriptionMember: 'Description'
						}
					}
				},
				repstatusfk: basicsLookupdataConfigGenerator.provideReadOnlyConfig('basics.customize.mountingreportstatus', null, {
					showIcon: true
				}),

				mntrequisitionid:{
					readonly: true,
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
				projectid: projectConfig
			}
		};
	}
})(angular);