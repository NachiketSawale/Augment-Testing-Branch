/**
 * Created by jim on 5/11/2017.
 */
// eslint-disable-next-line no-redeclare
/* global angular, globals, _ */
(function (angular) {
	'use strict';

	var moduleName = 'defect.main';
	/* jshint -W072 */
	angular.module(moduleName).factory('defectMainWizardService',
		['$http','$translate','platformTranslateService','platformSidebarWizardCommonTasksService','platformModalService','platformModalFormConfigService','platformSidebarWizardConfigService','basicsCommonChangeStatusService',
			'defectMainHeaderDataService','defectMainSyncIssueToDefectDialogService', 'cloudDeskBim360Service','$injector','basicsLookupdataConfigGenerator',
			function ($http,$translate,platformTranslateService,platformSidebarWizardCommonTasksService,platformModalService,platformModalFormConfigService,platformSidebarWizardConfigService,basicsCommonChangeStatusService,
				// eslint-disable-next-line no-mixed-spaces-and-tabs
					  defectMainHeaderDataService,defectMainSyncIssueToDefectDialogService,cloudDeskBim360Service, $injector,basicsLookupdataConfigGenerator) {
				var service = {};
				var wizardID = 'defectMainSidebarWizards';

				function changeDefectStatus() {
					return basicsCommonChangeStatusService.provideStatusChangeInstance(
						{
							mainService: defectMainHeaderDataService,
							statusField: 'DfmStatusFk',
							projectField: 'PrjProjectFk',
							title: 'defect.main.wizard.change.status.headerText',
							statusName: 'defect',
							updateUrl: 'defect/main/wizard/changestatus',
							statusProvider: function (entity) {
								return $injector.get('basicsLookupdataLookupDescriptorService').loadData('DfmStatus').then(function(status){
									return _.filter(status, function (item) {
										return (item.RubricCategoryFk === entity.RubricCategoryFk && item.Islive) || (entity.DfmStatusFk === item.Id);
									});
								});
							},
							id: 11
						}
					);
				}

				service.changeDefectStatus = changeDefectStatus().fn;

				service.createNewChangeFromDefect = function createNewChangeFromDefect () {

					var currentDefectItem = defectMainHeaderDataService.getSelected();
					var promises = [];
					var defectStatus =$http.post(globals.webApiBaseUrl + 'basics/customize/defect2projectchangetype/instance', {Id: currentDefectItem.Defect2ChangeTypeFk}).then(function (response) {
						if(response && response.data && response.data.Id === 2){
							$http.get(globals.webApiBaseUrl + 'change/main/listbydefect?defectId=' + currentDefectItem.Id).then(function (response){

								if(response && response.data && response.data.length === 0 ){
									var modalCreateConfig = {

										title: $translate.instant('defect.main.createChangeFromDefect'),
										dataItem: {
											defectFk : null,
											rubricCategoryFk : null
										},
										formConfiguration: {
											version: '1.0.0',
											showGrouping: false,
											groups: [
												{
													gid: 'baseGroup',
												}
											],
											rows: [
												basicsLookupdataConfigGenerator.provideDataServiceLookupConfigForForm({
													dataServiceName: 'basicsMasterDataRubricCategoryLookupDataService',
													showClearButton: true,
													filter: function () {
														// RubricFk for change
														return 14;
													}
												},
												{
													gid: 'baseGroup',
													rid: 'group',
													label: 'Rubric Category',
													label$tr$: 'project.inforequest.entityBasRubricCategoryFk',
													type: 'integer',
													model: 'RubricCategory',
													required: true,
													sortOrder: 1,
												}),

											]
										},
										handleOK: function handleOK(result) {
											var data = {
												defectId: defectMainHeaderDataService.getSelected().Id,
												rubricCategoryId: result.data.rubricCategoryFk
											};
											$http.post(globals.webApiBaseUrl + 'change/main/createdchangefromdefect', data
											).then(function (result) {
												if (result && result.data) {

													if (result.data.logText.length > 0) {

														var modalOptions = {
															headerTextKey: 'defect.main.createChangeFromDefect',
															bodyTextKey: result.data.logText,
															showOkButton: true,
															height: '200px',
															iconClass: 'ico-error'
														};
														platformModalService.showDialog(modalOptions);

													} else {

														if (!_.isNil(result.data.newId)) {
															// SUCCESS
															// Empty log message and a valid new id available
															currentDefectItem.ChangeFk = result.data.newId;
															defectMainHeaderDataService.markItemAsModified(currentDefectItem);
															defectMainHeaderDataService.fireItemModified(currentDefectItem);

															platformSidebarWizardCommonTasksService.showSuccessfullyDoneMessage(modalCreateConfig.title);

														} else {
															// TODO: ERROR
															// No change was created
															var modalOptions2 = {
																showGrouping: true,
																headerText: $translate.instant('project.inforequest.createChangeFromRFI'),
																bodyText: 'Please save the Type first',
																iconClass: 'ico-info'
															};
															platformModalService.showDialog(modalOptions2);
														}
													}

												}

											});
										}

									};
									platformTranslateService.translateFormConfig(modalCreateConfig.formConfiguration);

									platformModalFormConfigService.showDialog(modalCreateConfig);

								}
								else if(response.data[0].Code){
									var changeCode = response.data[0].Code;
									var modalOptions = {
										showGrouping: true,
										headerText: $translate.instant('defect.main.createChangeFromDefect'),
										bodyText: 'For the selected Defect already the change ' + changeCode + ' is created. Therefore no change can be created for this Defect.',
										iconClass: 'ico-info'
									};

									platformModalService.showDialog(modalOptions);
								}
							});

							promises.push(defectStatus);
						}else{
							var modalOptions = {
								showGrouping: true,
								headerText: $translate.instant('defect.main.createChangeFromDefect'),
								bodyText: 'The selected Defect has not a state that marks it "to be assigned to change". Therefore no change can be created for this Defect.',
								iconClass: 'ico-info'
							};

							platformModalService.showDialog(modalOptions);
						}
					});
				};


				var wizards = {
					showImages: true,
					showTitles: true,
					showSelected: true,
					items: []
				};

				service.syncAutodesk360BimIssue2Defect = function syncAutodesk360BimIssue2Defect(){
					defectMainSyncIssueToDefectDialogService.showPostDialog();
				};

				service.active = function activate() {
					platformSidebarWizardConfigService.activateConfig(wizardID, wizards);
				};

				service.deactive = function deactivate() {
					platformSidebarWizardConfigService.deactivateConfig(wizardID);
				};
				// loads or updates translated strings
				var loadTranslations = function () {
					platformTranslateService.translateObject(wizards, ['text']);
				};
				// register translation changed event
				platformTranslateService.translationChanged.register(loadTranslations);

				// register a module - translation table will be reloaded if module isn't available yet
				if (!platformTranslateService.registerModule(moduleName)) {
					// if translation is already available, call loadTranslation directly
					loadTranslations();
				}
				return service;
			}]);
})(angular);
