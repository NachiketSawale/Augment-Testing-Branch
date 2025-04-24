/**
 * Created by bh on 10.03.2016.
 */

(function () {
	/* global globals */
	'use strict';

	var moduleName = 'scheduling.main';

	/**
	 * @ngdoc service
	 * @name schedulingMainGenerateRequisitionService
	 * @function
	 *
	 * @description
	 * The service that handles the creation of requisitions based on the various settings that are done
	 * in the related wizard dialog.
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).service('schedulingMainGenerateRequisitionService', SchedulingMainGenerateRequisitionService);

	SchedulingMainGenerateRequisitionService.$inject = ['$translate', 'moment', 'platformTranslateService', 'platformSidebarWizardConfigService',
		'platformModalFormConfigService', 'basicsLookupdataConfigGenerator', 'platformSidebarWizardCommonTasksService', 'platformWizardDialogService', 'platformModalService', 'schedulingMainService', '$http'];

	function SchedulingMainGenerateRequisitionService($translate, moment, platformTranslateService, platformSidebarWizardConfigService, platformModalFormConfigService, basicsLookupdataConfigGenerator, platformSidebarWizardCommonTasksService, platformWizardDialogService, platformModalService, schedulingMainService, $http) {

		var service = {};
		var resultData = null;
		var previousGridData = null;

		this.startWizard = function startWizard() {
			showDialog();
		};

		function showDialog() {
			var conf = getTaskConfig('scheduling.main.generateRequisition');

			platformTranslateService.translateFormConfig(conf.formConfiguration);
			conf.scope = platformSidebarWizardConfigService.getCurrentScope();
			platformModalFormConfigService.showDialog(conf);

			return false;
		}

		function getTaskConfig(title) {
			var selectedActivity = schedulingMainService.getSelected(),
				msg = $translate.instant('scheduling.main.noCurrentActivitySelection');

			if (platformSidebarWizardCommonTasksService.assertSelection(selectedActivity, title, msg)) {
				var myItem = {
					description: null,
					projectFk: null,
					activityFk: null
				};
				return {
					title: $translate.instant(title),
					dataItem: myItem,
					formConfiguration: getDialogConfig(myItem),

					handleOK: function () {
						var createRequisition = {
							description: myItem.description,
							projectFk: myItem.projectFk,
							ActivityFk: myItem.activityFk
						};

						$http.post(globals.webApiBaseUrl + 'resource/requisition/generaterequisitionfromschedule', createRequisition)
							.then(function () {/* succeded */
								platformSidebarWizardCommonTasksService.showSuccessfullyDoneMessage(title);
							},
							function (/* error */) {
							});
					},
					handleCancel: function () {
					}
				};
			}
		}

		var creationFlag = 0;

		service.getCreationFlag = function () {
			return creationFlag;
		};

		service.setCreationFlag = function (flag) {
			creationFlag = flag;
		};

		service.setResultData = function (datas) {
			resultData = datas;
		};

		service.getResultData = function () {
			return resultData;
		};

		service.setPreviousGridData = function (datas) {
			previousGridData = datas;
		};

		service.getPreviousGridData = function () {
			return previousGridData;
		};
		service.getSimulation = function getSimulation(matchItems) {
			return $http.post(globals.webApiBaseUrl + 'scheduling/main/requisition', matchItems);
		};

		service.updateOrCreateRequisition = function updateOrCreateRequisition(updateCreateDatas) {
			return $http.post(globals.webApiBaseUrl + 'scheduling/main/updateOrCreateRequisition', updateCreateDatas);
		};

		this.showCreateResourceRequisitionWizardDialog = function showCreateResourceRequisitionWizardDialog() {
			var wzConfig = {
				title$tr$: 'scheduling.main.generateRequisitionWizard',
				steps: [{
					id: 'basicSetting',
					disallowBack: false,
					disallowNext: false,
					canFinish: false
				}, {
					id: 'resourceFilter',
					title$tr$: 'scheduling.main.requisitionResourceFilter',
					topDescription$tr$: 'scheduling.main.requisitionResourceFilter',
					disallowBack: false,
					disallowNext: false,
					canFinish: false
				}, {
					id: 'selection',
					title$tr$: 'scheduling.main.requisitionSelection',
					topDescription$tr$: 'scheduling.main.requisitionSelection',
					// width:'800px',
					disallowBack: false,
					disallowNext: false,
					canFinish: true
				}, {
					id: 'costtype2resourcetype',
					title$tr$: 'scheduling.main.costtype2resourcetypeSelection',
					topDescription$tr$: 'scheduling.main.costtype2resourcetypeSelection',
					// width:'800px',
					disallowBack: false,
					disallowNext: false,
					canFinish: true
				}],
				onChangeStep: function (info) {

					switch (info.step.id) {
						case 'assembleObjectsStep':
					}
				}
			};

			platformWizardDialogService.translateWizardConfig(wzConfig);

			var obj = {
				selector: {},
				__selectorSettings: {}
			};

			var dlgConfig = {
				templateUrl: globals.appBaseUrl + 'scheduling.main/templates/wizard/scheduling-main-create-resource-requisition-wizard.html',
				resizeable: false,
				width: '650px',
				minWidth: '650px',
				value: {
					wizard: wzConfig,
					entity: obj,
					wizardName: 'wz'
				}
			};

			return platformModalService.showDialog(dlgConfig);
		};

		function getDialogConfig(/* myItem */) {
			return {
				fid: 'scheduling.main.generateRequisitionWizard',
				version: '0.2.4',
				showGrouping: false,
				groups: [
					{
						gid: 'baseGroup',
						attributes: ['estLineItemFk', 'scheduleFk', 'activityFk']
					}
				],
				rows: [
					basicsLookupdataConfigGenerator.provideDataServiceLookupConfigForForm({
						dataServiceName: 'schedulingProgressReportLineItemLookupService',
						moduleQualifier: 'schedulingProgressReportLineItemLookupService',
						dispMember: 'DescriptionInfo.Description',
						valMember: 'Id'
					}, {
						gid: 'baseGroup',
						rid: 'estLineItemFk',
						model: 'estLineItemFk',
						sortOrder: 1,
						label: 'estLineItemFkt',
						label$tr$: 'scheduling.main.entityLineItem'
					}),
					basicsLookupdataConfigGenerator.provideDataServiceLookupConfigForForm({
						dataServiceName: 'schedulingProgressReportLineHeaderItemLookupService',
						readonly: true
					}),
					basicsLookupdataConfigGenerator.provideDataServiceLookupConfigForForm({
						dataServiceName: 'schedulingMainActivityLookupService',
						enableCache: true
					}, {
						gid: 'baseGroup',
						rid: 'activityFk',
						model: 'activityFk',
						sortOrder: 2,
						label: 'Template Project',
						label$tr$: 'scheduling.main.entityActivity'
					}
					)
				]
			};
		}
	}

})(angular);
