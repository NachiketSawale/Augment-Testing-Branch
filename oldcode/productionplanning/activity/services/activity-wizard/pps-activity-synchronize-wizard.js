/**
 * Created by anl on 8/27/2018.
 */

(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.activity';

	angular.module(moduleName).service('productionpalnningActivitySynchronizeWizardService', ActivitySynchronizeWizardService);

	ActivitySynchronizeWizardService.$inject = ['$q', '$http', 'platformModalService', 'basicsLookupdataConfigGenerator',
		'PlatformMessenger', 'platformTranslateService'];

	function ActivitySynchronizeWizardService($q, $http, platformModalService, basicsLookupdataConfigGenerator,
											  PlatformMessenger, platformTranslateService) {
		var self = this;

		//var selectedItems = [];
		var synList = [];
		var projectId;
		var module;

		var activityGridConfig = {};

		var mntActivityColumns = [
			{
				editor: null,
				field: 'MntCode',
				formatter: 'code',
				id: 'mntCode',
				name: 'MntActivityCode',
				name$tr$: '',
				searchable: true,
				sortable: true,
				width: 100
			},
			{
				editor: null,
				field: 'MntDescription',
				formatter: 'description',
				id: 'mntDescription',
				name: 'MntActivityDescription',
				name$tr$: '',
				sortable: true,
				width: 300
			}];

		var synchronizeColumn = [
			{
				editor: 'boolean',
				field: 'Synchronize',
				formatter: 'boolean',
				id: 'synchronize',
				name: 'Synchronize',
				name$tr$: '',
				width: 85
			}];

		var psdActivityColumns = [
			{
				editor: null,
				field: 'PsdCode',
				formatter: 'code',
				id: 'psdCode',
				name: 'PsdActivityCode',
				name$tr$: '',
				searchable: true,
				sortable: true,
				width: 100
			},
			{
				editor: null,
				field: 'PsdDescription',
				formatter: 'description',
				id: 'psdDescription',
				name: 'PsdActivityDescription',
				name$tr$: '',
				sortable: true,
				width: 300
			}
		];

		var mntActivityConfig = {
			title: 'Mounting Activity',
			entity: {
				MntActualStart: '',
				MntActualFinish: '',
				MntPlannedStart: '',
				MntPlannedFinish: '',
				MntEarliestStart: '',
				MntEarliestFinish: '',
				MntLatestStart: '',
				MntLatestFinish: '',
				MntLocationFk: '',
				MntControllingUnitFk: '',
				MntCalendarFk: ''
			},
			configure: {
				fid: 'Mounting Activity',
				//version: '0.2.4',
				showGrouping: true,
				groups: [
					{
						gid: 'planningInfo',
						header: 'Plan Info',
						isOpen: true,
						attributes: ['MntActualStart', 'MntActualFinish', 'MntPlannedStart', 'MntPlannedFinish',
							'MntEarliestStart', 'MntEarliestFinish', 'MntLatestStart', 'MntLatestFinish']
					},
					{
						gid: 'assignment',
						header: 'Assignment',
						isOpen: true,
						attributes: ['MntLocationFk', 'MntControllingUnitFk', 'MntCalendarFk']
					}
				],
				rows: [
					{
						gid: 'planningInfo',
						label: 'Planned Start Date',
						label$tr$: 'productionplanning.common.event.plannedStart',
						model: 'MntPlannedStart',
						rid: 'plannedstart',
						sortOrder: 1,
						type: 'datetimeutc',
						readonly: false
					},
					{
						gid: 'planningInfo',
						label: 'Planned Finish Date',
						label$tr$: 'productionplanning.common.event.plannedFinish',
						model: 'MntPlannedFinish',
						rid: 'plannedfinish',
						sortOrder: 2,
						type: 'datetimeutc',
						readonly: false
					},
					{
						gid: 'planningInfo',
						label: 'Earliest Start Date',
						label$tr$: 'productionplanning.common.event.earliestStart',
						model: 'MntEarliestStart',
						rid: 'earlieststart',
						sortOrder: 3,
						type: 'datetimeutc',
						readonly: false
					},
					{
						gid: 'planningInfo',
						label: 'Earliest Finish Date',
						label$tr$: 'productionplanning.common.event.earliestFinish',
						model: 'MntEarliestFinish',
						rid: 'earliestfinish',
						sortOrder: 4,
						type: 'datetimeutc',
						readonly: false
					},
					{
						gid: 'planningInfo',
						label: 'Latest Start Date',
						label$tr$: 'productionplanning.common.event.latestStart',
						model: 'MntLatestStart',
						rid: 'lateststart',
						sortOrder: 5,
						type: 'datetimeutc',
						readonly: false
					},
					{
						gid: 'planningInfo',
						label: 'Latest Finish Date',
						label$tr$: 'productionplanning.common.event.latestFinish',
						model: 'MntLatestFinish',
						rid: 'latestfinish',
						sortOrder: 6,
						type: 'datetimeutc',
						readonly: false
					},
					{
						gid: 'planningInfo',
						label: 'Actual Start Date',
						label$tr$: 'productionplanning.common.event.actualStart',
						model: 'MntActualStart',
						rid: 'actualstart',
						sortOrder: 7,
						type: 'datetimeutc',
						readonly: false
					},
					{
						gid: 'planningInfo',
						label: 'Actual Finish Date',
						label$tr$: 'productionplanning.common.event.actualFinish',
						model: 'MntActualFinish',
						rid: 'actualfinish',
						sortOrder: 8,
						type: 'datetimeutc',
						readonly: false
					},
					basicsLookupdataConfigGenerator.provideDataServiceLookupConfigForForm({
							dataServiceName: 'projectLocationLookupDataService',
							filter: function () {
								return self.getProjectId();
							},
							showClearButton: true
						},
						{
							gid: 'assignment',
							rid: 'prjlocationfk',
							label: 'Project Location',
							label$tr$: '',
							model: 'MntLocationFk',
							sortOrder: 9
						}
					),
					{
						gid: 'assignment',
						rid: 'ctlunitfk',
						label: 'Controlling Unit',
						label$tr$: '',
						model: 'MntControllingUnitFk',
						sortOrder: 10,
						type: 'directive',
						directive: 'basics-lookupdata-lookup-composite',
						options: {
							lookupDirective: 'basics-master-data-context-controlling-unit-lookup',
							descriptionMember: 'DescriptionInfo.Translated',
							lookupOptions: {
								showClearButton: true,
								filterKey: 'productionplanning-mounting-activity-controlling-unit-filter'
							}
						},
						readonly: false
					},
					basicsLookupdataConfigGenerator.provideDataServiceLookupConfigForForm({
							dataServiceName: 'schedulingLookupCalendarDataService',
							enableCache: true
						},
						{
							gid: 'assignment',
							rid: 'calendarfk',
							label: 'Calendar',
							label$tr$: '',
							model: 'MntCalendarFk',
							sortOrder: 11
						}
					)
				]
			}
		};
		var psdActivityConfig = {
			title: 'Schedule Activity',
			entity: {
				PsdActualStart: '',
				PsdActualFinish: '',
				PsdPlannedStart: '',
				PsdPlannedFinish: '',
				PsdEarliestStart: '',
				PsdEarliestFinish: '',
				PsdLatestStart: '',
				PsdLatestFinish: '',
				PsdLocationFk: '',
				PsdControllingUnitFk: ''
			},
			configure: {
				fid: 'Schedule Activity',
				version: '0.2.4',
				showGrouping: true,
				groups: [
					{
						gid: 'planningInfo',
						header: 'Plan Info',
						isOpen: true,
						attributes: ['PsdActualStart', 'PsdActualFinish', 'PsdPlannedStart', 'PsdPlannedFinish',
							'PsdEarliestStart', 'PsdEarliestFinish', 'PsdLatestStart', 'PsdLatestFinish']
					},
					{
						gid: 'assignment',
						header: 'Assignment',
						isOpen: true,
						attributes: ['PsdLocationFk', 'PsdControllingUnitFk', 'PsdCalendarFk']
					}
				],
				rows: [
					{
						gid: 'planningInfo',
						label: 'Planned Start Date',
						label$tr$: 'productionplanning.common.event.plannedStart',
						model: 'PsdPlannedStart',
						rid: 'plannedstart',
						sortOrder: 1,
						type: 'datetimeutc'
					},
					{
						gid: 'planningInfo',
						label: 'Planned Finish Date',
						label$tr$: 'productionplanning.common.event.plannedFinish',
						model: 'PsdPlannedFinish',
						rid: 'plannedfinish',
						sortOrder: 2,
						type: 'datetimeutc'
					},
					{
						gid: 'planningInfo',
						label: 'Earliest Start Date',
						label$tr$: 'productionplanning.common.event.earliestStart',
						model: 'PsdEarliestStart',
						rid: 'earlieststart',
						sortOrder: 3,
						type: 'datetimeutc'
					},
					{
						gid: 'planningInfo',
						label: 'Earliest Finish Date',
						label$tr$: 'productionplanning.common.event.earliestFinish',
						model: 'PsdEarliestFinish',
						rid: 'earliestfinish',
						sortOrder: 4,
						type: 'datetimeutc'
					},
					{
						gid: 'planningInfo',
						label: 'Latest Start Date',
						label$tr$: 'productionplanning.common.event.latestStart',
						model: 'PsdLatestStart',
						rid: 'lateststart',
						sortOrder: 5,
						type: 'datetimeutc'
					},
					{
						gid: 'planningInfo',
						label: 'Latest Finish Date',
						label$tr$: 'productionplanning.common.event.latestFinish',
						model: 'PsdLatestFinish',
						rid: 'latestfinish',
						sortOrder: 6,
						type: 'datetimeutc'
					},
					{
						gid: 'planningInfo',
						label: 'Actual Start Date',
						label$tr$: 'productionplanning.common.event.actualStart',
						model: 'PsdActualStart',
						rid: 'actualstart',
						sortOrder: 7,
						type: 'datetimeutc',
						readonly: false
					},
					{
						gid: 'planningInfo',
						label: 'Actual Finish Date',
						label$tr$: 'productionplanning.common.event.actualFinish',
						model: 'PsdActualFinish',
						rid: 'actualfinish',
						sortOrder: 8,
						type: 'datetimeutc',
						readonly: false
					},
					basicsLookupdataConfigGenerator.provideDataServiceLookupConfigForForm({
							dataServiceName: 'projectLocationLookupDataService',
							filter: function () {
								return self.getProjectId();
							},
							showClearButton: true
						},
						{
							gid: 'assignment',
							rid: 'prjlocationfk',
							label: 'Project Location',
							label$tr$: '',
							model: 'PsdLocationFk',
							sortOrder: 9
						}
					),
					{
						gid: 'assignment',
						rid: 'ctlunitfk',
						label: 'Controlling Unit',
						label$tr$: '',
						model: 'PsdControllingUnitFk',
						sortOrder: 10,
						type: 'directive',
						directive: 'basics-lookupdata-lookup-composite',
						options: {
							lookupDirective: 'basics-master-data-context-controlling-unit-lookup',
							descriptionMember: 'DescriptionInfo.Translated',
							lookupOptions: {
								showClearButton: true,
								filterKey: 'productionplanning-mounting-activity-controlling-unit-filter'
							}
						}
					},
					basicsLookupdataConfigGenerator.provideDataServiceLookupConfigForForm({
							dataServiceName: 'schedulingLookupCalendarDataService',
							enableCache: true
						},
						{
							gid: 'assignment',
							rid: 'calendarfk',
							label: 'Calendar',
							label$tr$: '',
							model: 'PsdCalendarFk',
							sortOrder: 11
						}
					)
				]
			}
		};


		self.listLoaded = new PlatformMessenger();

		self.showActivitySynchronizeWizardDialog = function showGenerateMntActivityWizardDialog(activities) {
			var modalConfig = {
				templateUrl: 'productionplanning.activity/templates/synchronize-activity-template.html',
				controller: 'productionplanningActivitySynchronizeController',
				resizeable: true,
				height: '700px',
				width: '1000px'
			};

			$q.when(self.initData(activities)).then(function () {
				platformTranslateService.translateFormConfig(psdActivityConfig.configure);
				platformTranslateService.translateFormConfig(mntActivityConfig.configure);
				platformModalService.showDialog(modalConfig);
			});
		};

		self.getActivityGridConfig = function () {
			return activityGridConfig;
		};

		self.getMntActivityConfig = function () {
			return mntActivityConfig;
		};

		self.getPsdActivityConfig = function () {
			return psdActivityConfig;
		};

		self.initData = function (activities) {
			self.setModule(activities);
			synList = [];

			var ids = _.map(activities, 'Id');
			var request = {Ids: ids, Type: module};
			var url = globals.webApiBaseUrl + 'productionplanning/activity/wizard/synlist';
			return $http.post(url, request).then(function (response) {
				synList = response.data;
				//self.listLoaded.fire(synList);
			});
		};

		self.getData = function () {
			return synList;
		};

		self.getProjectId = function () {
			return projectId;
		};

		self.setModule = function (activities) {
			var activity = _.first(activities);
			if (activity.ActStatusFk) {
				module = 'Mounting-Activity';
				projectId = activity.ProjectId;
				activityGridConfig.columns = _.union(mntActivityColumns, synchronizeColumn, psdActivityColumns);
			}
			else {
				module = 'Schedule-Activity';
				projectId = activity.ProjectFk;
				activityGridConfig.columns = _.union(psdActivityColumns, synchronizeColumn, mntActivityColumns);
			}
		};
		self.getCurrentModule = function () {
			return module;
		};
	}

})(angular);