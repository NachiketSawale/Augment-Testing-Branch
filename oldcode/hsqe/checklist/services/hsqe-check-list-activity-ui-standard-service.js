/*
 * Created by alm on 01.25.2021.
 */

(function (angular) {

	'use strict';
	var moduleName = 'hsqe.checklist';
	angular.module(moduleName).factory('hsqeCheckList2ActivityLayout', ['basicsLookupdataConfigGenerator','hsqeCheckListDataService',
		function hsqeCheckList2ActivityLayout(basicsLookupdataConfigGenerator,hsqeCheckListDataService) {
			return {
				fid: 'hsqe.checklist.hsqechecklistactivityform',
				version: '1.0.0',
				showGrouping: true,
				addValidationAutomatically: true,
				'groups': [
					{
						gid: 'basicData',
						attributes: ['psdschedulefk','psdactivityfk']
					},
					{
						gid: 'entityHistory',
						isHistory: true
					}
				],
				'translationInfos': {
					'extraModules': [moduleName],
					'extraWords': {
						'PsdScheduleFk': {location: moduleName, identifier: 'activity.entitySchedule', initial: 'Schedule'},
						'PsdActivityFk': {location: moduleName, identifier: 'activity.entityActivity', initial: 'Activity'}
					}
				},
				overloads: {
					'psdschedulefk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'defectSchedulingLookupService',
						showClearButton: true,
						isComposite: true,
						desMember: 'DescriptionInfo.Translated',
						dispMember: 'Code',
						filter: function () {
							var parentItem = hsqeCheckListDataService.getSelected();
							if (parentItem) {
								return parentItem.PrjProjectFk ? parentItem.PrjProjectFk : 0;
							}
							return 0;
						},
						navigator: {
							moduleName: 'scheduling.main'
						}
					}),
					'psdactivityfk': {
						'grid': {
							'editor': 'lookup',
							'editorOptions': {
								'directive': 'scheduling-main-activity-structure-lookup',
								'lookupOptions': {
									filterKey: 'check-list-psdactivity-filter'
								}
							},
							'formatter': 'lookup',
							'formatterOptions': {
								'lookupType': 'SchedulingActivity',
								'displayMember': 'Code'
							},
							'bulkSupport': false
						},
						'detail': {
							'type': 'directive',
							'directive': 'basics-lookupdata-lookup-composite',
							'options': {
								'lookupDirective': 'scheduling-main-activity-structure-lookup',
								'descriptionMember': 'Description',
								'lookupOptions': {
									filterKey: 'check-list-psdactivity-filter'
								}
							}
						}
					}
				},
				'addition': {
					'grid': [
						{
							id:'activityDescription',
							lookupDisplayColumn: true,
							field: 'PsdActivityFk',
							name$tr$: 'hsqe.CheckList.activity.description',
							displayMember: 'Description'
						},
						{
							id:'activityPlannedStart',
							lookupDisplayColumn: true,
							field: 'PsdActivityFk',
							name$tr$: 'hsqe.CheckList.activity.plannedStart',
							displayMember: 'PlannedStart',
							lookupDomain:'dateutc'
						},
						{
							id:'activityPlannedFinish',
							lookupDisplayColumn: true,
							field: 'PsdActivityFk',
							name$tr$: 'hsqe.CheckList.activity.plannedFinish',
							displayMember: 'PlannedFinish',
							lookupDomain:'dateutc'
						},
						{
							id:'activityActualStart',
							lookupDisplayColumn: true,
							field: 'PsdActivityFk',
							name$tr$: 'hsqe.CheckList.activity.actualStart',
							displayMember: 'ActualStart',
							lookupDomain:'dateutc'
						},
						{
							id:'activityActualFinish',
							lookupDisplayColumn: true,
							field: 'PsdActivityFk',
							name$tr$: 'hsqe.CheckList.activity.actualFinish',
							displayMember: 'ActualFinish',
							lookupDomain:'dateutc'
						}
					]
				}
			};
		}
	]);

	angular.module(moduleName).factory('hsqeCheckListActivityUIStandardService',

		['platformUIStandardConfigService', 'hsqeCheckListTranslationService', 'platformSchemaService', 'hsqeCheckList2ActivityLayout', 'platformUIStandardExtentService',

			function (platformUIStandardConfigService, translationService, platformSchemaService, hsqeCheckList2ActivityLayout, platformUIStandardExtentService) {

				var BaseService = platformUIStandardConfigService;

				var domainSchema = platformSchemaService.getSchemaFromCache({
					typeName: 'HsqCheckList2ActivityDto',
					moduleSubModule: 'Hsqe.CheckList'
				});

				if (domainSchema) {
					domainSchema = domainSchema.properties;
				}

				function UIStandardService(layout, scheme, translateService) {
					BaseService.call(this, layout, scheme, translateService);
				}

				UIStandardService.prototype = Object.create(BaseService.prototype);
				UIStandardService.prototype.constructor = UIStandardService;

				var service = new BaseService(hsqeCheckList2ActivityLayout, domainSchema, translationService);

				platformUIStandardExtentService.extend(service, hsqeCheckList2ActivityLayout.addition, domainSchema);

				return service;
			}
		]);
})(angular);
