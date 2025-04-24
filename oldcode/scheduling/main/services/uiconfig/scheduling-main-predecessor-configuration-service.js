/**
 * Created by leo on 03.11.2014.
 */
(function () {
	'use strict';
	var moduleName = 'scheduling.main';

	/**
	 * @ngdoc service
	 * @name schedulingService
	 * @function
	 *
	 * @description
	 * schedulingService is the data service for all scheduling data functions.
	 */
	angular.module(moduleName).factory('schedulingMainPredecessorConfigurationService',

		['platformUIStandardConfigService', 'schedulingMainTranslationService', 'schedulingMainUIConfigurationService', 'platformSchemaService', 'basicsLookupdataConfigGenerator', '$injector',

			function (platformUIStandardConfigService, schedulingMainTranslationService, schedulingMainUIConfigurationService, platformSchemaService, basicsLookupdataConfigGenerator, $injector) {

				function schedulingPredessorDetailLayout() {
					return {
						fid: 'scheduling.main.predecessordetailform',
						addValidationAutomatically: true,
						version: '1.0.0',
						groups: [
							{
								gid: 'baseGroup',
								attributes: ['relationkindfk', 'predecessoractivityfk', 'predecessordesc', 'predecessorprojectno', 'predecessorprojectname', 'predecessorschedule', 'fixlagpercent', 'fixlagtime', 'varlagpercent', 'varlagtime', 'usecalendar']
							},
							{
								gid: 'entityHistory',
								isHistory: true
							}
						],
						overloads: {
							relationkindfk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.relationkind', 'Description'),
							predecessoractivityfk: {
								navigator: {
									moduleName: 'scheduling.main',
									force:true // allow navigate inside a module
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
												var mainServ = $injector.get('schedulingMainService');
												filterItem.projectFk = mainServ.getSelected().ProjectFk;
												filterItem.scheduleFk = mainServ.getSelected().ScheduleFk;
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
												var mainServ = $injector.get('schedulingMainService');
												filterItem.projectFk = mainServ.getSelected().ProjectFk;
												filterItem.scheduleFk = mainServ.getSelected().ScheduleFk;
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
							predecessordesc: {readonly: true},
							predecessorschedule: {readonly: true},
							predecessorprojectno: {readonly: true},
							predecessorprojectname: {readonly: true},
							childactivityfk: {
								detail: {
									type: 'code',
									formatter: 'code',
									model: 'SuccessorCode'
								},
								grid: {
									formatter: 'code',
									field: 'SuccessorCode'
								},
								readonly: true
							},
							successordesc: {readonly: true},
							successorschedule: {readonly: true},
							successorprojectno: {readonly: true},
							successorprojectname: {readonly: true}
						}
					};
				}

				var BaseService = platformUIStandardConfigService;

				var predecessorAttributeDomains = platformSchemaService.getSchemaFromCache({
					typeName: 'ActivityRelationshipDto',
					moduleSubModule: 'Scheduling.Main'
				});
				if (predecessorAttributeDomains) {
					predecessorAttributeDomains = predecessorAttributeDomains.properties;
				}

				function SchedulingUIStandardService(layout, scheme, translateService) {
					BaseService.call(this, layout, scheme, translateService);
				}

				SchedulingUIStandardService.prototype = Object.create(BaseService.prototype);
				SchedulingUIStandardService.prototype.constructor = SchedulingUIStandardService;

				var schedulingMainActivityPredecessorDetailLayout = schedulingPredessorDetailLayout();

				return new BaseService(schedulingMainActivityPredecessorDetailLayout, predecessorAttributeDomains, schedulingMainTranslationService);
			}
		]);
})();
