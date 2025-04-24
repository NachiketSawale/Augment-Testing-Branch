/**
 * Created by leo on 17.08.2015.
 */
(function () {
	'use strict';
	let moduleName = 'scheduling.main';

	/**
	 * @ngdoc service
	 * @name schedulingMainActivityBaseLineComparisonConfigurationService
	 * @function
	 *
	 * @description
	 * schedulingService is the data service for all scheduling data functions.
	 */
	angular.module(moduleName).factory('schedulingMainActivityBaseLineComparisonConfigurationService',

		['platformUIStandardConfigService', 'schedulingMainTranslationService', 'basicsLookupdataConfigGenerator', 'platformSchemaService',

			function (platformUIStandardConfigService, schedulingMainTranslationService, basicsLookupdataConfigGenerator, platformSchemaService) {

				let BaseService = platformUIStandardConfigService;

				function createActivityBaseLineComparisonDetailLayout() {
					return {
						fid: 'scheduling.main.activitybaselinecmpdetailform',
						version: '0.0.1',
						readonly: true,
						showGrouping: true,
						groups: [
							{
								'gid': 'baseGroup',
								'attributes': ['code', 'description', 'activitytemplatefk', 'controllingunitfk', 'parentactivityfk', 'activitystatefk', 'calendarfk', 'schedulingmethodfk', 'tasktypefk',
									'quantity', 'quantityuomfk', 'specification', 'note', 'baselinefk', 'scurvefk']
							},
							{
								'gid': 'dateFloatGroup',
								'attributes': ['plannedstart', 'plannedfinish', 'plannedduration']
							},
							{
								'gid': 'constraintGroup',
								'attributes': ['constrainttypefk', 'constraintdate']
							},
							{
								'gid': 'execGroup',
								'attributes': ['actualstart', 'executionstarted', 'actualfinish', 'actualduration', 'executionfinished', 'currentstart', 'currentfinish', 'currentduration']
							},
							{
								'gid': 'performanceGroup',
								'attributes': ['resourcefactor', 'performancefactor', 'perf1uomfk', 'perf2uomfk']
							},
							{
								'gid': 'progressGroup',
								'attributes': ['progressreportmethodfk']
							},
							{
								'gid': 'relation',
								'attributes': ['predecessor', 'successor']
							},
							{
								'gid': 'userDefTextGroup',
								'isUserDefText': true,
								'attCount': 10
							},
							{
								'gid': 'userDefNumberGroup',
								'isUserDefNumber': true,
								'attCount': 10
							},
							{
								'gid': 'userDefDateGroup',
								'isUserDefDate': true,
								'attCount': 10
							},
							{
								'gid': 'activeActivity',
								'attributes': ['uptodateactivitystatefk', 'uptodateactualduration', 'uptodateactualfinish', 'uptodateactualstart',
									'uptodatecode', 'uptodateconstraintdate', 'uptodateconstrainttypefk', 'uptodatecurrentduration', 'uptodatecurrentfinish', 'uptodatecurrentstart',
									'uptodatedescription', 'uptodatelocationfk', 'uptodatelocationspecification', 'uptodateparentactivityfk', 'uptodateperf1uomfk','uptodateperf2uomfk',
									'uptodateperformancefactor', 'uptodateplannedduration', 'uptodateplannedfinish', 'uptodateplannedstart', 'uptodateresourcefactor',
									'uptodateschedulingmethodfk','uptodatespecification']
							}
						],
						overloads: {
							baselinefk:{
								detail: {
									type: 'description',
									formatter: 'description',
									model: 'BaselineDescription'
								},
								grid: {
									formatter: 'description',
									field: 'BaselineDescription'
								},
								readonly: true
							},
							activitytemplatefk: {
								detail: {
									type: 'directive',
									directive: 'scheduling-activity-template-lookup-dialog'
								},
								grid: {
									editor: 'lookup',
									editorOptions: {
										directive: 'scheduling-activity-template-lookup-dialog'
									},
									formatter: 'lookup',
									formatterOptions: {
										url: {
											getList: 'scheduling/template/activitytemplate/listall',
											getDefault: 'scheduling/template/activitytemplate/listall',
											getItemByKey: 'scheduling/template/activitytemplate/getItemById',
											getSearchList: 'scheduling/template/activitytemplate/listall'

										},
										lookupType: 'activitytemplatefk',
										displayMember: 'Code'
									}
								}
							},
							controllingunitfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
								dataServiceName: 'controllingStructureUnitLookupDataService',
								filter: function (item) {
									let prj;
									if (item) {
										prj = item.ProjectFk;
									}

									return prj;
								}
							}),
							parentactivityfk: {
								detail: {
									type: 'code',
									formatter: 'code',
									model: 'ActivityParentCode'
								},
								grid: {
									formatter: 'code',
									field: 'ActivityParentCode',
									addColumns: [
										{
											id: 'Description',
											field: 'ActivityParentDescription',
											name: 'Description',
											width: 200,
											formatter: 'description',
											name$tr$: 'cloud.common.entityDescription'
										}
									]
								},
								readonly: true
							},
							activitystatefk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.activitystate', null, {
								showIcon: true,
								imageSelectorService: 'platformStatusIconService'
							}),
							scurvefk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.scurve', 'Description'),
							projectfk: {
								navigator: { moduleName: 'project.main', registerService:'projectMainService' },
								detail: {
									type: 'code',
									formatter: 'code',
									model: 'Schedule.Project.ProjectNo'
								},
								grid: {
									formatter: 'code',
									field: 'Schedule.Project.ProjectNo',
									addColumns: [
										{
											id: 'ProjectName',
											field: 'Schedule.Project.ProjectName',
											name: 'ProjectName',
											width: 200,
											formatter: 'description',
											name$tr$: 'cloud.common.entityName'
										},
										{
											id: 'ProjectName2',
											field: 'Schedule.Project.ProjectName2',
											name: 'ProjectName2',
											width: 200,
											formatter: 'description',
											name$tr$: 'project.main.name2'
										}
									]
								},
								readonly: true
							},
							schedulefk: {
								detail: {
									type: 'code',
									formatter: 'code',
									model: 'Schedule.Code'
								},
								grid: {
									formatter: 'code',
									field: 'Schedule.Code',
									addColumns: [
										{
											id: 'Description',
											field: 'Schedule.DescriptionInfo',
											name: 'Description',
											width: 200,
											formatter: 'translation',
											name$tr$: 'cloud.common.entityDescription'
										},
										{
											id: 'TargetStart',
											field: 'Schedule.TargetStart',
											name: 'TargetStart',
											width: 120,
											formatter: 'dateutc',
											name$tr$: 'scheduling.schedule.targetstart'
										},
										{
											id: 'TargetEnd',
											field: 'Schedule.TargetEnd',
											name: 'TargetEnd',
											width: 120,
											formatter: 'dateutc',
											name$tr$: 'scheduling.schedule.targetend'
										}
									]
								},
								readonly: true
							},
							calendarfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
								dataServiceName: 'schedulingLookupCalendarDataService',
								enableCache: true,
								navigator: {
									moduleName: 'scheduling.calendar',
									registerService: 'schedulingCalendarMainService'
								}

							}),
							plannedstart: {
								editor: 'dateutc',
								formatter: 'dateutc'
							},
							plannedfinish: {
								editor: 'dateutc',
								formatter: 'dateutc'
							},
							constraintdate: {
								editor: 'dateutc',
								formatter: 'dateutc'
							},
							schedulingmethodfk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.schedulemethod', 'Description'),
							tasktypefk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.tasktype', 'Description'),
							quantityuomfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
								dataServiceName: 'basicsUnitLookupDataService',
								cacheEnable: true
							}),
							constrainttypefk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.constrainttype', 'Description'),
							progressreportmethodfk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.progressreportmethod'),
							activitypresentationfk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.activitypresentation'),
							chartpresentationfk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.chartpresentation'),
							bas3dvisualizationtypefk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.threedvisualizationtype'),
							locationfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
								dataServiceName: 'projectLocationLookupDataService',
								filter: function (item) {
									let prj;
									if (item) {
										prj = item.ProjectFk;
									}
									return prj;
								}
							}),
							perf1uomfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({dataServiceName: 'basicsUnitLookupDataService'}),
							perf2uomfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({dataServiceName: 'basicsUnitLookupDataService'}),
							uptodateschedulingmethodfk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.schedulemethod', 'Description'),
							uptodateperf1uomfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({dataServiceName: 'basicsUnitLookupDataService'}),
							uptodateperf2uomfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({dataServiceName: 'basicsUnitLookupDataService'}),
							uptodateparentactivityfk: {
								readonly: true,
								'detail': {
									'type': 'directive',
									'directive': 'scheduling-main-activity-parent-lookup',
									'options': {
										readOnly: true
									}
								},
								'grid': {
									'editor': 'lookup',
									'editorOptions': {
										'lookupDirective': 'scheduling-main-activity-parent-lookup'
									},
									'formatter': 'lookup',
									'formatterOptions': {
										'lookupType': 'activityfk',
										'displayMember': 'Code',
										url: {
											idProperty: 'activityId',
											getItemByKey: 'scheduling/main/activity/get'
										}
									}
								}
							},
							uptodatelocationfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
								dataServiceName: 'projectLocationLookupDataService',
								filter: function (item) {
									let prj;
									if (item) {
										prj = item.ProjectFk;
									}

									return prj;
								}
							}),
							uptodateconstrainttypefk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.constrainttype', 'Description'),
							uptodateactivitystatefk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.activitystate', null, {
								showIcon: true,
								imageSelectorService: 'platformStatusIconService'
							})
						}
					};
				}

				let activityBaseLineComparison = createActivityBaseLineComparisonDetailLayout();

				let activityBaseLineComparisonAttributeDomains = platformSchemaService.getSchemaFromCache({
					typeName: 'ActivityBaselineCmpVDto',
					moduleSubModule: 'Scheduling.Main'
				});
				if (activityBaseLineComparisonAttributeDomains) {
					activityBaseLineComparisonAttributeDomains = activityBaseLineComparisonAttributeDomains.properties;
				}

				return new BaseService(activityBaseLineComparison, activityBaseLineComparisonAttributeDomains, schedulingMainTranslationService);
			}
		]);
})();
