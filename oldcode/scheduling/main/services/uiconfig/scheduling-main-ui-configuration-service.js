(function () {
	'use strict';
	var moduleName = 'scheduling.main';

	/**
	 * @ngdoc service
	 * @name schedulingMainEventConfigurationService
	 * @function
	 *
	 * @description
	 * schedulingService is the data service for all scheduling data functions.
	 */
	angular.module(moduleName).factory('schedulingMainUIConfigurationService', schedulingMainUIConfigurationService);

	schedulingMainUIConfigurationService.$inject = ['_', '$injector','basicsLookupdataConfigGenerator', 'platformLayoutHelperService', 'schedulingMainService', 'schedulingMainRelationshipAllService', 'basicsCommonComplexFormatter', 'basicsLookupdataLookupFilterService', 'platformContextService'];

	function schedulingMainUIConfigurationService(_, $injector,basicsLookupdataConfigGenerator, platformLayoutHelperService, schedulingMainService, schedulingMainRelationshipAllService, basicsCommonComplexFormatter, basicsLookupdataLookupFilterService, platformContextService) {

		basicsLookupdataLookupFilterService.registerFilter([
			{
				key: 'scheduling-main-controllingunit-project-context-filter',
				serverKey: 'scheduling.main.controllingunit.project.context.filter',
				serverSide: true,
				fn: function (entity) {
					return {
						ByStructure: true,
						ExtraFilter: false,
						PrjProjectFk: entity ? entity.ProjectFk : null,
						CompanyFk: platformContextService.getContext().clientId,
						ProjectContextFk: entity ? entity.ProjectContextFk : null,
						FilterKey: 'scheduling.main.controllingunit.project.context.filter',
						IsProjectReadonly: function () {
							return true;
						},
						IsCompanyReadonly: function (){
							return true;
						}
					};
				}
			}]);

		function getProjectFk(item) {
			let prj;
			if (item) {
				prj = item.ProjectFk;
				if (!prj && _.isArray(item.Activities) && !_.isEmpty(item.Activities)) {
					// for activity-location matrix, they should have all the same projectFk
					prj = item.Activities[0].ProjectFk;
				}
			}
			return prj;
		}

		function getControllingUnitOverload(filter){
			let ovl = basicsLookupdataConfigGenerator.provideElaboratedLookupConfig('controlling-structure-dialog-lookup', 'controllingunit', 'Code', true, null, null, filter);

			ovl.grid.editorOptions.lookupOptions.additionalColumns = [{
				id: 'Description',
				field: 'DescriptionInfo',
				name: 'Description',
				width: 300,
				formatter: 'translation',
				name$tr$: 'cloud.common.entityDescription'
			}];
			ovl.grid.editorOptions.lookupOptions.columns = ovl.grid.editorOptions.lookupOptions.additionalColumns;

			return ovl;
		}

		return {


			getActivityDetailLayout: function getActivityDetailLayout() {
				return {
					fid: 'scheduling.main.activitydetailform',
					version: '1.0.0',
					addValidationAutomatically: true,
					showGrouping: true,
					groups: [
						{
							'gid': 'baseGroup',
							'attributes': ['icon','code', 'description', 'activitytemplatefk', 'controllingunitfk', 'parentactivityfk', 'activitystatefk', 'projectfk', 'schedulefk', 'calendarfk','addressfk', 'schedulingmethodfk', 'tasktypefk',
								'quantity', 'quantityuomfk', 'isquantityevaluated', 'specification', 'note', 'baselinefk', 'scurvefk', 'projectreleasefk', 'schedulesubfk', 'activitysubfk', 'schedulemasterfk', 'activitymasterfk', 'estimatehourstotal','totalcost','totalcostcompleted']
						},
						{
							'gid': 'procurementGroup',
							'attributes': ['prcstructurefk', 'packagecode', 'packagedesc']
						},
						{
							'gid': 'locationGroup',
							'attributes': ['locationfk', 'activitypresentationfk', 'locationspecification', 'chartpresentationfk', 'bas3dvisualizationtypefk', 'loblabelplacementfk', 'cosmatchtext']
						},
						{
							'gid': 'dateFloatGroup',
							'attributes': ['plannedstart', 'plannedfinish', 'plannedduration','remainingduration', 'plannedcalendardays', 'iscritical', 'earlieststart', 'earliestfinish', 'lateststart', 'latestfinish', 'totalfloattime', 'freefloattime', 'isonlongestpath']
						},
						{
							'gid': 'constraintGroup',
							'attributes': ['constrainttypefk', 'constraintdate']
						},
						{
							'gid': 'execGroup',
							'attributes': ['actualstart', 'executionstarted', 'actualfinish', 'actualduration', 'actualcalendardays', 'executionfinished', 'currentstart', 'currentfinish', 'currentduration', 'currentcalendardays','isdurationestimationdriven']
						},
						{
							'gid': 'performanceGroup',
							'attributes': ['resourcefactor', 'performancefactor', 'perf1uomfk', 'perf2uomfk']
						},
						{
							'gid': 'performanceMeasurementGroup',
							'attributes': ['percentagecompletion', 'periodquantityperformance', 'duedatequantityperformance', 'remainingactivityquantity', 'periodworkperformance', 'duedateworkperformance', 'remainingactivitywork']
						},
						{
							'gid': 'progressGroup',
							'attributes': ['progressreportmethodfk', 'work']
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
							'gid': 'entityHistory',
							'isHistory': true
						}
					],
					overloads: {
						totalcostcompleted:{readonly: true},
						totalcost:{readonly: true},
						icon:{
							'readonly': true,
							'detail': {
								visible: false
							},
							'grid': {
								id: 'iconIndicator',
								name: 'iconIndicator',
								name$tr$: 'cloud.common.entityIcon',
								field: 'iconImage',
								isIndicator: true,
								pinned: true,
								formatter: 'multiImage',
								formatterOptions: {
									imageCount: 2,
									imageSelector: 'schedulingMainActivityIconProcessor',
									tooltip: true
								}
							}
						},
						baselinefk: {
							detail: {
								type: 'description',
								formatter: 'description',
								model: 'Baseline'
							},
							grid: {
								formatter: 'description',
								field: 'Baseline'
							},
							readonly: true
						},
						currentstart: {
							readonly: true,
							formatterOptions:{
								showDayPrefix:true
							}
						},
						currentfinish: {
							readonly: true,
							formatterOptions:{
								showDayPrefix:true
							}
						},
						currentduration: {
							readonly: true
						},
						currentcalendardays: {
							readonly: true
						},
						actualduration: {
							readonly: true
						},
						actualcalendardays: {
							readonly: true
						},
						actualstart: {
							bulkSupport: true,
							formatterOptions:{
								showDayPrefix:true
							}
						},
						actualfinish: {
							bulkSupport: true,
							formatterOptions:{
								showDayPrefix:true
							}
						},
						plannedduration: {
							bulkSupport: true
						},
						remainingduration:{
							readonly: true
						},
						plannedcalendardays: {
							readonly: true
						},
						executionstarted: {
							bulkSupport: true
						},
						executionfinished: {
							bulkSupport: true
						},
						percentagecompletion: {
							bulkSupport: true,
							disallowNegative: true
						},
						periodquantityperformance: {
							bulkSupport: true,
							disallowNegative: true
						},
						duedatequantityperformance: {
							disallowNegative: true,
							bulkSupport: true
						},
						remainingactivityquantity: {
							disallowNegative: true,
							bulkSupport: true
						},
						periodworkperformance: {
							disallowNegative: true,
							bulkSupport: true
						},
						duedateworkperformance: {
							disallowNegative: true,
							bulkSupport: true
						},
						remainingactivitywork: {
							disallowNegative: true,
							bulkSupport: true
						},
						activitytemplatefk: {
							detail: {
								type: 'directive',
								directive: 'scheduling-activity-template-filter-lookup-dialog'
							},
							grid: {
								editor: 'lookup',
								editorOptions: {
									directive: 'scheduling-activity-template-filter-lookup-dialog'
								},
								formatter: 'lookup',
								formatterOptions: {
									/*
									url: {
										getList: 'scheduling/template/activitytemplate/listall',
										getDefault: 'scheduling/template/activitytemplate/listall',
										getItemByKey: 'scheduling/template/activitytemplate/getItemById',
										getSearchList: 'scheduling/template/activitytemplate/listall'
									},
*/
									lookupType: 'schedulingActivityTemplate',
									displayMember: 'Code',
									version: 3
								}
							}
						},
						controllingunitfk: getControllingUnitOverload( 'scheduling-main-controllingunit-project-context-filter'),
						parentactivityfk: {
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
						activitysubfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
							dataServiceName: 'schedulingLookupSumActivityDataService',
							filterKey: 'self-reference-activity-exclude-activity',
							filter: function (item) {
								if(item) {
									return item.ScheduleSubFk;
								}
							},
							additionalColumns: true,
							readonly: false
						}),
						activitymasterfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
							dataServiceName: 'schedulingLookupActivityDataService',
							filterKey: 'self-reference-type-activity-subschedules',
							filter: function (item) {
								if(item) {
									return item.ScheduleMasterFk;
								}
							},
							additionalColumns: true,
							readonly: false
						}),
						activitystatefk: basicsLookupdataConfigGenerator.provideReadOnlyConfig('basics.customize.activitystate', null, {
							showIcon: true,
							filterKey: 'scheduling-main-status-by-rubric-category-filter',
							customIntegerProperty: 'BAS_RUBRIC_CATEGORY_FK',
							imageSelectorService: 'platformStatusIconService'
						}),
						scurvefk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.scurve', 'Description'),
						projectfk: {
							navigator: {
								moduleName: 'project.main',
								targetIdProperty: 'ProjectFk'
							},
							detail: {
								type: 'code',
								formatter: 'code',
								model: 'ProjectNo'
							},
							grid: {
								formatter: 'code',
								field: 'ProjectNo',
								addColumns: [
									{
										id: 'ProjectName',
										field: 'ProjectName',
										name: 'ProjectName',
										width: 200,
										formatter: 'description',
										name$tr$: 'cloud.common.entityName'
									},
									{
										id: 'ProjectName2',
										field: 'ProjectName2',
										name: 'ProjectName2',
										width: 200,
										formatter: 'description',
										name$tr$: 'cloud.common.entityProjectName2'
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

						schedulesubfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
							dataServiceName: 'schedulingLookupSubScheduleDataService',
							moduleQualifier: 'schedulingLookupSubScheduleDataService',
							desMember: 'DescriptionInfo.Translated',
							readonly: false,
							filter: function (item) {
								return item && item.ScheduleFk !== null ? item.ScheduleFk : -1;
							}
						}),

						schedulemasterfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
							dataServiceName: 'schedulingLookupScheduleDataService',
							moduleQualifier: 'schedulingLookupScheduleDataService',
							desMember: 'DescriptionInfo.Translated',
							readonly: true,
							filter: function (item) {
								return item && item.ProjectFk !== null ? item.ProjectFk : -1;
							}
						}),

						/*
													calendarfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
														dataServiceName: 'schedulingLookupCalendarDataService',
														enableCache: true,
														navigator: {
															moduleName: 'scheduling.calendar',
															registerService: 'schedulingCalendarMainService'
														}

													}),
						*/
						calendarfk: {
							grid: {
								bulkSupport: true,
								editor: 'lookup',
								editorOptions: {
									directive: 'project-calendar-lookup',
									lookupOptions: {
										showClearButton: true
									}
								},
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'schedulingCalendar',
									displayMember: 'Code',
									version: 3
								}
							},
							detail: {
								bulkSupport: true,
								type: 'directive',
								directive: 'basics-lookupdata-lookup-composite',
								options: {
									lookupDirective: 'project-calendar-lookup',
									displayMember: 'Code',
									descriptionMember: 'DescriptionInfo.Translated',
									lookupOptions: {
										showClearButton: true,
										version: 3
									}
								}
							}
						},
						plannedstart: {
							editor: 'dateutc',
							formatter: 'dateutc',
							bulkSupport: true,
							formatterOptions:{
								showDayPrefix:true
							}
						},
						plannedfinish: {
							editor: 'dateutc',
							formatter: 'dateutc',
							bulkSupport: true,
							formatterOptions:{
								showDayPrefix:true
							}
						},
						iscritical: {readonly: true},
						earlieststart: {readonly: true},
						earliestfinish: {readonly: true},
						lateststart: {readonly: true},
						latestfinish: {readonly: true},
						totalfloattime: {readonly: true},
						freefloattime: {readonly: true},
						isonlongestpath: {readonly: true},
						schedulingmethodfk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.schedulemethod', 'Description'),
						tasktypefk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.tasktype', 'Description'),
						quantityuomfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
							dataServiceName: 'basicsUnitLookupDataService',
							cacheEnable: true
						}),
						constrainttypefk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.constrainttype', 'Description'),
						progressreportmethodfk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.progressreportmethod'),
						activitypresentationfk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.activitypresentation'),
						chartpresentationfk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.chartpresentation', 'Description', {
							customIntegerProperty: 'COLOR', field: 'Color'
						}),
						bas3dvisualizationtypefk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.threedvisualizationtype'),
						loblabelplacementfk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.labelplacement'),
						cosmatchtext: {readonly: true},
						prcstructurefk: {
							navigator: {
								moduleName: 'basics.procurementstructure'
							},
							grid: {
								editor: 'lookup',
								editorOptions: {
									directive: 'basics-procurementstructure-structure-dialog',
									lookupOptions: {
										showClearButton: true
									}
								},
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'prcstructure',
									displayMember: 'Code'
								}
							},
							detail: {
								type: 'directive',
								directive: 'basics-lookupdata-lookup-composite',
								options: {
									lookupDirective: 'basics-procurementstructure-structure-dialog',
									descriptionField: 'StructureDescription',
									descriptionMember: 'DescriptionInfo.Translated',
									lookupOptions: {
										initValueField: 'StructureCode',
										showClearButton: true
									}
								}
							}
						},
						locationfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
							dataServiceName: 'projectLocationLookupDataService',
							filter: function (item) {
								return getProjectFk(item);
							}
						}, {
							doesDependOn: 'ProjectFk'
						}),
						projectreleasefk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
							dataServiceName: 'projectReleaseLookupDataService',
							filter: function (item) {
								return getProjectFk(item);
							}
						}, {
							doesDependOn: 'ProjectFk'
						}),
						perf1uomfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({dataServiceName: 'basicsUnitLookupDataService'}),
						perf2uomfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({dataServiceName: 'basicsUnitLookupDataService'}),
						predecessor: {
							detail: {
								readonly: true
							},
							grid: {
								$$postApplyValue: (grid, activity, column) => {
									activity.Predecessor = schedulingMainRelationshipAllService.predecessorCodes(activity, _.get(activity, column.field, []));
								}
							}
						},
						successor: {
							detail: {
								readonly: true
							},
							grid: {
								$$postApplyValue: (grid, activity, column) => {
									activity.Successor = schedulingMainRelationshipAllService.successorCodes(activity, _.get(activity, column.field, []));
								}
							}

						},
						addressfk:
							basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
								dataServiceName: 'projectAddressesDescLookupDataService',
								filter: function (item) {
									var prj = {PKey1:null};
									if (item) {
										prj.PKey1 = item.ProjectFk;
									}
									return prj;
								}
							}),
						estimatehourstotal: {
							readonly: true
						}
					}
				};
			},

			getActivityClerkDetailLayout: function () {
				return {
					fid: 'scheduling.schedule.clerkdetailform',
					version: '1.0.0',
					groups: [
						{
							gid: 'baseGroup',
							attributes: ['clerkrolefk', 'clerkfk', 'validfrom', 'remark']
						},
						{
							gid: 'entityHistory',
							isHistory: true
						}
					],
					overloads: {
						clerkrolefk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.clerk.role'),
						clerkfk: {
							detail: {
								type: 'directive',
								directive: 'basics-lookupdata-lookup-composite',
								options: {
									lookupDirective: 'cloud-clerk-clerk-dialog',
									descriptionMember: 'Code'
								}
							},
							grid: {
								editor: 'lookup',
								directive: 'basics-lookupdata-lookup-composite',
								editorOptions: {
									lookupDirective: 'cloud-clerk-clerk-dialog',
									lookupOptions: {
										displayMember: 'Code',
										additionalColumns: true
									}
								},
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'Clerk',
									displayMember: 'Code'
								}
							}
						}
					}
				};
			},

			getActivityProgressReportDetailLayout: function () {
				return {
					fid: 'scheduling.main.progressreportdetailform',
					version: '1.0.0',
					addValidationAutomatically: true,
					groups: [
						{
							gid: 'baseGroup',
							attributes: ['description', 'estlineitemfk', 'estheaderfk', 'quantitytotal', 'basuomfk', 'performancedate', 'plannedquantity', 'quantity', 'remainingquantity', 'pco', 'remainingpco', 'plannedwork', 'work', 'remainingwork', 'worktotal','modelcode', 'modelobjectdesc']
						},
						{
							gid: 'entityHistory',
							isHistory: true
						}
					],
					'overloads': {
						estlineitemfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
							dataServiceName: 'schedulingProgressReportLineItemLookupService',
							moduleQualifier: 'schedulingProgressReportLineItemLookupService',
							dispMember: 'Code',
							valMember: 'Id'
						}),

						estheaderfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
							dataServiceName: 'schedulingProgressReportLineHeaderItemLookupService',
							readonly: true
						}),
						activity2modelobjectfk:	basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
								dataServiceName: 'schedulingLookupActivity2ModelobjectDataService',
								filter: function (item) {
									let activityId;
									if(item) {
										activityId = item.ActivityFk;
									}
									return activityId;
								}
							}),
						// basuomfk: basicsLookupdataConfigGenerator.provideReadOnlyConfig('basics.uom', 'Uom'),
						basuomfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
							dataServiceName: 'basicsUnitLookupDataService',
							cacheEnable: true
						}),
						quantitytotal: {
							readonly: true
						},
						worktotal: {
							readonly: true
						},
						plannedquantity: {
							readonly: true
						},
						plannedwork: {
							readonly: true
						},
						pco: {
							disallowNegative: true
						},
						remainingpco: {
							disallowNegative: true
						},
						quantity: {
							disallowNegative: true
						},
						remainingquantity: {
							disallowNegative: true
						},
						remainingwork: {
							disallowNegative: true
						},
						work: {
							disallowNegative: true
						}
					}
				};
			},

			getActivityRelationshipDetailLayout: function () {
				return {
					fid: 'scheduling.main.relationshipdetailform',
					addValidationAutomatically: true,
					version: '1.0.0',
					groups: [
						{
							gid: 'baseGroup',
							attributes: ['relationkindfk', 'childactivityfk', 'successordesc', 'successorprojectno', 'successorprojectname', 'successorschedule', 'fixlagpercent', 'fixlagtime', 'varlagpercent', 'varlagtime', 'usecalendar']
						},
						{
							gid: 'entityHistory',
							isHistory: true
						}
					],
					overloads: {
						relationkindfk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.relationkind', 'Description'),
						parentactivityfk: {
							detail: {
								type: 'code',
								formatter: 'code',
								model: 'PredecessorCode'
							},
							grid: {
								formatter: 'code',
								field: 'PredecessorCode'
							},
							readonly: true
						},
						predecessordesc: {readonly: true},
						predecessorschedule: {readonly: true},
						predecessorprojectno: {readonly: true},
						predecessorprojectname: {readonly: true},
						childactivityfk: {
							navigator: {
								moduleName: 'scheduling.main',
								force:true //  allow navigate inside a module
							},
							grid: {
								editor: 'lookup',
								editorOptions: {
									directive: 'scheduling-main-activity-dialog-lookup',
									lookupOptions: {
										showClearButton: true,
										pageOptions: {
											enabled: true,
											size: 100
										},
										defaultFilter: function (filterItem) {
											filterItem.projectFk = schedulingMainService.getSelected().ProjectFk;
											filterItem.scheduleFk = schedulingMainService.getSelected().ScheduleFk;
										},
										selectableCallback: function (dataItem) {
											var isSelectable = false;
											if (dataItem.ActivityTypeFk !== 2 && dataItem.ActivityTypeFk !== 5) {
												isSelectable = true;
											}
											return isSelectable;
										}
									}
								},
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'SchedulingActivityNew',
									displayMember: 'Code',
									filter: function (item) {
										return item.ScheduleFk;
									},
									version: 3
								}
							},
							detail: {
								type: 'directive',
								directive: 'basics-lookupdata-lookup-composite',
								options: {
									showClearButton: true,
									lookupDirective: 'scheduling-main-activity-dialog-lookup',
									lookupType: 'SchedulingActivityNew',
									displayMember: 'Code',
									version: 3,
									lookupOptions: {
										showClearButton: true,
										pageOptions: {
											enabled: true,
											size: 100
										},
										defaultFilter: function (filterItem) {
											filterItem.projectFk = schedulingMainService.getSelected().ProjectFk;
											filterItem.scheduleFk = schedulingMainService.getSelected().ScheduleFk;
										},
										selectableCallback: function (dataItem) {
											var isSelectable = false;
											if (dataItem.ActivityTypeFk !== 2 && dataItem.ActivityTypeFk !== 5) {
												isSelectable = true;
											}
											return isSelectable;
										}
									}
								}
							}
						},
						successordesc: {readonly: true},
						successorschedule: {readonly: true},
						successorprojectno: {readonly: true},
						successorprojectname: {readonly: true}
					}
				};
			},

			getObjectSimulationLayout: function getObjectSimulationLayout(){
				return {
					fid: 'scheduling.main.objectSimulation',
					version: '1.0.0',
					addValidationAutomatically: true,
					showGrouping: true,
					groups: [
						{
							gid:'baseGroup',
							attributes: [ 'estlineitemcode', 'estlineitemdescription','estheadercode','estheaderdesc', 'mdlmodelfk', 'objectfk', 'plannedstart', 'plannedfinish', 'plannedduration', 'currentstart','currentfinish', 'currentduration', 'executionstarted',
								'executionfinished', 'actualstart', 'actualfinish', 'actualduration', 'plannedquantity', 'performancedate', 'pco', 'remainingpco', 'quantity', 'remainingquantity',
								'basuomfk','plannedsequence','actualsequence']
						}
					],
					overloads: {
						mdlmodelfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
							dataServiceName: 'modelProjectVersionedModelLookupDataService',
							enableCache: true,
							readonly: true,
							filter: filterBySelectedAnnotationProject

						}),
						objectfk: {
							'detail': {
								'type': 'directive',
								'directive': 'document-model-object-lookup-dialog',
								options: {
									showClearButton: true
								},
								readonly: true
							},
							'grid': {
								editor: 'lookup',
								editorOptions: {
									directive: 'document-model-object-lookup-dialog',
									lookupOptions: {
										showClearButton: true,
										filterKey: 'defect-model-object-by-model-filter',
										'displayMember': 'Description'
									}
								},
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'modelObjects',
									filter: function (item) {
										return item.MdlModelFk || -1;
									},
									displayMember: 'Description',
									dataServiceName: 'documentModelMainObjectLookupDataService'
								}
							}
						},


						basuomfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
							dataServiceName: 'basicsUnitLookupDataService',
							cacheEnable: true,
							readonly: true
						}),
						estlineitemcode: {
							readonly: true
						},
						estlineitemdescription: {
							readonly: true
						},
						estheadercode: {
							readonly: true
						},
						estheaderdesc: {
							readonly: true
						},
						plannedstart: {
							editor: 'dateutc',
							formatter: 'dateutc',
							bulkSupport: true
						},
						plannedfinish: {
							editor: 'dateutc',
							formatter: 'dateutc',
							bulkSupport: true
						},
						plannedduration: {
							// readonly: true
						},
						currentstart: {
							readonly: true
						},
						currentfinish: {
							readonly: true
						},
						currentduration: {
							readonly: true
						},
						actualduration: {
							readonly: true
						}
					}
				};
				function filterBySelectedAnnotationProject(item) {

					if (_.isInteger(item.ProjectFk)) {
						return item.ProjectFk;
					}
					const selActivity = schedulingMainService.getSelected();
					return (selActivity && _.isInteger(selActivity.ProjectFk)) ? selActivity.ProjectFk : -1;
				}
			}


		};
	}
})(angular);

