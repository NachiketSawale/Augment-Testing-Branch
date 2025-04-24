(function () {
	/* global globals, _ */
	'use strict';

	let moduleName = 'estimate.main';

	/**
	 * @ngdoc service
	 * @name estimateMainGenerateScheduleService
	 * @function
	 *
	 * @description
	 * The service that handles the creation of a bid and subsequent bid boq based on the various settings that are done
	 * in the related wizard dialog.
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).service('estimateMainGenerateScheduleService', EstimateMainGenerateScheduleService);

	EstimateMainGenerateScheduleService.$inject = ['$translate', 'moment', 'platformTranslateService', 'platformSidebarWizardConfigService',
		'platformModalFormConfigService', 'basicsLookupdataConfigGenerator', 'platformSidebarWizardCommonTasksService', 'estimateMainService', '$http', 'platformDataValidationService'];

	function EstimateMainGenerateScheduleService($translate, moment, platformTranslateService, platformSidebarWizardConfigService,
		platformModalFormConfigService, basicsLookupdataConfigGenerator, platformSidebarWizardCommonTasksService, estimateMainService, $http, platformDataValidationService) {

		let selectedLineItem;
		this.startWizard = function startWizard() {
			showDialog();
		};

		function showDialog() {
			let conf = getTaskConfig('estimate.main.generateSchedule');

			platformTranslateService.translateFormConfig(conf.formConfiguration);
			conf.scope = platformSidebarWizardConfigService.getCurrentScope();
			platformModalFormConfigService.showDialog(conf);

			return false;
		}

		function getTaskConfig(title) {
			selectedLineItem = estimateMainService.getSelected();
			let msg = $translate.instant('estimate.main.noCurrentLineItemSelection');

			if (platformSidebarWizardCommonTasksService.assertSelection(selectedLineItem, title, msg)) {
				let myItem = {
					templateProjectFk: null,
					templateScheduleFk: null,
					startDate: moment.utc(),
					useTargetProjectCalendar: true,
					useLineItemQuantity: true,
					useLineItemTime: true,
					code: null
				};
				$http.get(globals.webApiBaseUrl + 'scheduling/schedule/getcode?projectId=' + selectedLineItem.ProjectFk).then(function (response) {
					myItem.code = response.data;
				});
				return {
					title: $translate.instant(title),
					dataItem: myItem,
					formConfiguration: getDialogConfig(myItem),
					dialogOptions: {
						disableOkButton: function disableOkButton() {
							let result = false;
							if(_.isNil(myItem.templateProjectFk) || _.isNil(myItem.templateScheduleFk) ||
									(myItem.__rt$data && myItem.__rt$data.errors && !_.isNil(myItem.__rt$data.errors.code))){
								result = true;
							}
							return result;
						},
						disableCancelButton: function disableCancelButton() {
							return false;
						}
					},
					handleOK: function () {
						let createSchedule = {
							TemplateProject: myItem.templateProjectFk,
							TemplateSchedule: myItem.templateScheduleFk,
							StartDate: myItem.startDate,
							UseTargetProjectCalendar: myItem.useTargetProjectCalendar,
							UseLineItemQuantity: myItem.useLineItemQuantity,
							UseLineItemTime: myItem.useLineItemTime,
							EstimateHeaderId: estimateMainService.getSelectedEstHeaderId(),
							Code: myItem.code
						};

						$http.post(globals.webApiBaseUrl + 'estimate/main/lineitem/generateschedulefromestheader', createSchedule)
							.then(function (result) {/* succeded */
								let msg = $translate.instant('estimate.main.numberOfGeneratedActivities');
								platformSidebarWizardCommonTasksService.showSuccessfullyDoneMessage(title, msg + result.data.toString());
							},
							function (/* error */) {
							});
					},
					handleCancel: function () {
					}
				};
			}
		}

		function getDialogConfig(myItem) {
			return {
				fid: 'estimate.main.generateScheduleWizard',
				version: '0.2.4',
				showGrouping: false,
				groups: [
					{
						gid: 'baseGroup',
						attributes: ['templateProjectFk', 'templateScheduleFk', 'startDate', 'useTargetProjectCalendar']
					}
				],
				rows: [
					basicsLookupdataConfigGenerator.provideDataServiceLookupConfigForForm({
						dataServiceName: 'projectTemplateLookupDataService',
						enableCache: true
					}, {
						gid: 'baseGroup',
						rid: 'templateProjectFk',
						model: 'templateProjectFk',
						sortOrder: 1,
						label: 'Template Project',
						label$tr$: 'project.main.templateProject'
					}
					),
					basicsLookupdataConfigGenerator.provideDataServiceLookupConfigForForm(
						{
							dataServiceName: 'schedulingProjectExecutionScheduleLookupDataService',
							filter: function () {
								return myItem.templateProjectFk ? myItem.templateProjectFk : -1;
							},
							enableCache: true
						}, {
							gid: 'baseGroup',
							rid: 'templateScheduleFk',
							model: 'templateScheduleFk',
							sortOrder: 2,
							label: 'Schedule',
							label$tr$: 'scheduling.schedule.scheduleEntity'
						}
					),
					{
						gid: 'baseGroup',
						rid: 'startDate',
						label$tr$: 'cloud.common.entityStartDate',
						model: 'startDate',
						type: 'dateutc',
						sortOrder: 3
					},
					{
						gid: 'baseGroup',
						rid: 'useTargetProjectCalendar',
						label$tr$: 'estimate.main.useProjectCalendar',
						model: 'useTargetProjectCalendar',
						type: 'boolean',
						sortOrder: 4
					},
					{
						gid: 'baseGroup',
						rid: 'useLineItemQuantity',
						label$tr$: 'estimate.main.useLineItemQuantity',
						model: 'useLineItemQuantity',
						type: 'boolean',
						sortOrder: 5
					},
					{
						gid: 'baseGroup',
						rid: 'useLineItemTime',
						label$tr$: 'estimate.main.useLineItemTime',
						model: 'useLineItemTime',
						type: 'boolean',
						sortOrder: 6
					},
					{
						gid: 'baseGroup',
						rid: 'code',
						label$tr$: 'cloud.common.entityCode',
						model: 'code',
						type: 'code',
						sortOrder: 7,
						asyncValidator: function(entity, value, model){
							let asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, model, estimateMainService);

							asyncMarker.myPromise = $http.get(globals.webApiBaseUrl + 'scheduling/schedule/list/?mainItemID='+ selectedLineItem.ProjectFk).then(function(response) {
								let result = platformDataValidationService.isValueUnique(response.data, 'Code', value, entity.Id, {object: 'code'});
								if(result.valid){
									if(entity && entity.__rt$data && entity.__rt$data.errors) {
										if(entity.__rt$data.errors.code) {
											delete entity.__rt$data.errors.code;
											delete entity.__rt$data.errors;
										}
									}
								}
								return result;
							});
							return asyncMarker.myPromise;
						}
					}
				]
			};
		}
	}


})(angular);
