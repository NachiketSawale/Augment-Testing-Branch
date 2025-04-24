/**
 * Created by baf on 24.08.2016
 */
(function () {
	/* global globals */
	'use strict';
	var modName = 'project.inforequest';
	var module = angular.module(modName);

	/**
	 * @ngdoc service
	 * @name cloudTranslationResourceLayoutService
	 * @function
	 *
	 * @description
	 * This service provides standard layouts for grid / form for translation resource entities
	 */
	module.service('projectInfoRequestWizardService', ProjectInfoRequestWizardService);

	ProjectInfoRequestWizardService.$inject = ['_', '$injector', '$http', '$translate', 'platformSidebarWizardCommonTasksService', 'platformModalService', 'platformModalFormConfigService', 'platformSidebarWizardConfigService',
		'platformGridControllerService', 'platformModalGridConfigService', 'basicsCommonChangeStatusService', 'projectInfoRequestDataService', 'projectInfoRequestSyncBim360RfiDialogService', 'platformTranslateService',
		'basicsLookupdataConfigGenerator', 'projectInfoRequestChangeDataService', 'projectInfoRequestDefectDataService'];

	function ProjectInfoRequestWizardService(_, $injector, $http, $translate, platformSidebarWizardCommonTasksService, platformModalService, platformModalFormConfigService, platformSidebarWizardConfigService,
		platformGridControllerService, platformModalGridConfigService, basicsCommonChangeStatusService, projectInfoRequestDataService, projectInfoRequestSyncBim360RfiDialogService, platformTranslateService,
		basicsLookupdataConfigGenerator, projectInfoRequestChangeDataService, projectInfoRequestDefectDataService) {
		var wizardIds = 'projectInfoRequestSidebarWizards';

		function provideStatusChangeConfig() {
			return basicsCommonChangeStatusService.provideStatusChangeInstance(
				{
					mainService: projectInfoRequestDataService,
					statusField: 'RequestStatusFk',
					descField: 'Description',
					projectField: 'ProjectFk',
					title: 'basics.config.changeStatus',
					statusName: 'inforequest',
					updateUrl: 'project/rfi/informationrequest/changestatus',
					id: 11,
					doStatusChangePostProcessing: function (item, data){
						projectInfoRequestDataService.setReadOnly(data.IsReadonly);
					}
				}
			);
		}

		this.changeInfoRequestStatus = provideStatusChangeConfig().fn;

		this.syncAutodesk360BimRFI2Defect = function syncAutodesk360BimRFI2Defect() {
			projectInfoRequestSyncBim360RfiDialogService.showPostDialog();
		};

		var wizardConfig = {
			showImages: true,
			showTitles: true,
			showSelected: true,
			cssClass: 'sidebarWizard',
			items: [
				{
					id: 1,
					text: 'Wizards',
					text$tr$: 'project.inforequest.wizardsGroupName',
					groupIconClass: 'sidebar-icons ico-wiz-change-status',
					visible: true,
					subitems: [provideStatusChangeConfig()]
				}]
		};

		this.createNewDefectsFromRFI = function createNewDefectsFromRFI() {

			var currentRFIItem = projectInfoRequestDataService.getSelected();
			const promises = [];
			var rfiStatus = $http.post(globals.webApiBaseUrl + 'basics/customize/requestforinfo2defecttype/instance', {Id: currentRFIItem.Rfi2DefectTypeFk}).then(function (response) {
				if (response && response.data && response.data.Id === 2) {
					$http.get(globals.webApiBaseUrl + 'defect/main/header/listbyrfi?rfiId=' + currentRFIItem.Id).then(function (response) {

						if (response && response.data && response.data.length === 0) {
							var modalCreateConfig = {

								title: $translate.instant('project.inforequest.createDefectFromRFI'),
								dataItem: {
									infoReqFk: null,
									rubricCategoryFk: null
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
										{
											gid: 'baseGroup',
											rid: 'group',
											model: 'RubricCategory',
											required: true,
											sortOrder: 1,
											label$tr$: 'project.inforequest.entityBasRubricCategoryFk',
											label: 'Rubric Category',
											type: 'directive',
											directive: 'basics-lookupdata-lookup-composite',
											options: {
												lookupDirective: 'basics-lookupdata-rubric-category-by-rubric-and-company-lookup',
												descriptionMember: 'Description',
												lookupOptions: {
													filterKey: 'defect-rubric-category-lookup-filter',
													showClearButton: true
												}
											},
											formatter: 'lookup',
											formatterOptions: {
												lookupType: 'RubricCategoryByRubricAndCompany',
												displayMember: 'Description'
											}
										}
									]
								},
								handleOK: function handleOK() {
									var dialogDefect = modalCreateConfig.dataItem;
									var data = {
										InfoReqId: projectInfoRequestDataService.getSelected().Id,
										RubricCategoryId: dialogDefect.RubricCategory
									};
									$http.post(globals.webApiBaseUrl + 'defect/main/header/createdefectfromrfi', data
									).then(function (result) {
										if (result && result.data) {

											if (result.data.logText.length > 0) {

												var modalOptions = {
													headerTextKey: 'project.inforequest.createDefectFromRFI',
													bodyTextKey: result.data.logText,
													showOkButton: true,
													showCancelButton: true,
													resizeable: true,
													height: '500px',
													iconClass: 'info'
												};

												platformModalService.showDialog(modalOptions);

											} else {

												if (!_.isNil(result.data.newId)) {
													// SUCCESS
													// Empty log message and a valid new id available
													currentRFIItem.DefectFk = result.data.newId;
													projectInfoRequestDataService.fireItemModified(currentRFIItem);

													platformSidebarWizardCommonTasksService.showSuccessfullyDoneMessage(modalCreateConfig.title);

												} else {
													// TODO: ERROR
													// No defect was created
													var modalOptions = {
														showGrouping: true,
														headerText: $translate.instant('project.inforequest.createChangeFromRFI'),
														bodyText: 'Please save the Type first',
														iconClass: 'ico-info'
													};
													platformModalService.showDialog(modalOptions);
												}
											}

										} else {
											// TODO: ERROR
											// Empty response
										}

									});
								},

							};
							platformTranslateService.translateFormConfig(modalCreateConfig.formConfiguration);

							platformModalFormConfigService.showDialog(modalCreateConfig);

						} else if (response.data[0].Code) {
							var defectCode = response.data[0].Code;
							var modalOptions = {
								showGrouping: true,
								headerText: $translate.instant('project.inforequest.createDefectFromRFI'),
								bodyText: 'For the selected RFI already the defect ' + defectCode + ' is created. Therefore no defect can be created for this RFI.',
								iconClass: 'ico-info'
							};

							platformModalService.showDialog(modalOptions);
						}
					});

					promises.push(rfiStatus);
				} else {
					var name = response.data.DescriptionInfo.Description;
					var modalOptions = {
						showGrouping: true,
						headerText: $translate.instant('project.inforequest.createDefectFromRFI'),
						bodyText: `The selected RFI has a state that marks it "${name}". Therefore no defect can be created for this RFI.`,
						iconClass: 'ico-info'
					};

					platformModalService.showDialog(modalOptions);
				}
			});
		};

		this.createNewChangeFromRFI = function createNewChangeFromRFI() {
			var currentRFIItem = projectInfoRequestDataService.getSelected();
			const promises = [];
			var rfiStatus = $http.post(globals.webApiBaseUrl + 'basics/customize/requestforinfo2projectchangetype/instance', {Id: currentRFIItem.Rfi2ChangeTypeFk}).then(function (response) {

				if (response && response.data && response.data.Id === 2) {
					$http.get(globals.webApiBaseUrl + 'change/main/listbyrif?rfiId=' + currentRFIItem.Id).then(function (response) {

						if (response && response.data && response.data.length === 0) {
							var modalCreateConfig = {

								title: $translate.instant('project.inforequest.createChangeFromRFI'),
								dataItem: {
									infoReqFk: null,
									rubricCategoryFk: null
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
										{
											gid: 'baseGroup',
											rid: 'group',
											model: 'RubricCategory',
											required: true,
											sortOrder: 1,
											label$tr$: 'project.inforequest.entityBasRubricCategoryFk',
											label: 'Rubric Category',
											type: 'directive',
											directive: 'basics-lookupdata-lookup-composite',
											options: {
												lookupDirective: 'basics-lookupdata-rubric-category-by-rubric-and-company-lookup',
												descriptionMember: 'Description',
												lookupOptions: {
													filterKey: 'change-rubric-category-lookup-filter',
													showClearButton: true
												}
											},
											formatter: 'lookup',
											formatterOptions: {
												lookupType: 'RubricCategoryByRubricAndCompany',
												displayMember: 'Description'
											}
										}
									]
								},
								handleOK: function handleOK(result) {
									var data = {
										InfoReqId: projectInfoRequestDataService.getSelected().Id,
										RubricCategoryId: result.data.rubricCategoryFk
									};

									$http.post(globals.webApiBaseUrl + 'change/main/createdchangefromrfi', data)
										.then(function (result) {
											if (result && result.data) {

												if (result.data.logText.length > 0) {

													var modalOptions = {
														headerTextKey: 'project.inforequest.createChangeFromRFI',
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
														currentRFIItem.ChangeFk = result.data.newId;
														projectInfoRequestDataService.fireItemModified(currentRFIItem);

														platformSidebarWizardCommonTasksService.showSuccessfullyDoneMessage(modalCreateConfig.title);

													} else {
														// TODO: ERROR
														// No change was created
														var modalOptions = {
															showGrouping: true,
															headerText: $translate.instant('project.inforequest.createChangeFromRFI'),
															bodyText: 'Please save the Type first',
															iconClass: 'ico-info'
														};

														platformModalService.showDialog(modalOptions);
													}
												}

											} else {
												// TODO: ERROR
												// Empty response
											}

										});
								},

							};
							platformTranslateService.translateFormConfig(modalCreateConfig.formConfiguration);

							platformModalFormConfigService.showDialog(modalCreateConfig);

						} else if (response.data[0].Code) {
							var changeCode = response.data[0].Code;
							var modalOptions = {
								showGrouping: true,
								headerText: $translate.instant('project.inforequest.createChangeFromRFI'),
								bodyText: 'For the selected RFI already the change ' + changeCode + ' is created. Therefore no change can be created for this RFI.',
								iconClass: 'ico-info'
							};

							platformModalService.showDialog(modalOptions);
						}
					});

					promises.push(rfiStatus);
				} else {
					var name = response.data.DescriptionInfo.Description;
					var modalOptions = {
						showGrouping: true,
						headerText: $translate.instant('project.inforequest.createChangeFromRFI'),
						bodyText: `The selected RFI has a state that marks it "${name}". Therefore no change can be created for this RFI.`,
						iconClass: 'ico-info'
					};

					platformModalService.showDialog(modalOptions);
				}
			});
		};

		var loadTranslations = function () {
			platformTranslateService.translateObject(wizardConfig, ['text']);
		};

		// register translation changed event
		platformTranslateService.translationChanged.register(loadTranslations);

		this.activate = function activate() {
			platformSidebarWizardConfigService.activateConfig(wizardIds, wizardConfig);
		};

		this.deactivate = function deactivate() {
			platformSidebarWizardConfigService.deactivateConfig(wizardIds);
		};

		this.createChangeRFI = function createChangeRFI() {
			let currentRFIItems = projectInfoRequestDataService.getSelectedEntities();
			const rfiIds = currentRFIItems.map(item => item.Id);
			const toBeAssignedToChange = 2;
			let itemChange = [];
			let showSmallDialogOptions = [];

			$http.post(globals.webApiBaseUrl + 'basics/customize/changetype/list')
				.then(function (response) {
					$http.post(globals.webApiBaseUrl + 'change/main/listbyrifs', rfiIds)
						.then(function (result) {
							let index = 1;
							currentRFIItems.forEach(currentRFIItem => {
								if (currentRFIItem.Rfi2ChangeTypeFk === toBeAssignedToChange) {
									let findListByRFI = result.data.find(item => item.Id === currentRFIItem.ChangeFk);
									if (findListByRFI === undefined) {
										const defaultChangeType = _.find(response.data, item => item.IsDefault === true);
										itemChange.push({
											"Id": index++,
											"Code": currentRFIItem.Code,
											"Description": currentRFIItem.Description,
											"ChangeTypeFk": defaultChangeType.Id,
											"RubricCategoryFk": defaultChangeType.RubricCategoryFk,
											"InfoReqId": currentRFIItem.Id
										});
									} else {
										let modalOptions = {
											showGrouping: true,
											headerText: $translate.instant('project.inforequest.createChangeFromRFI'),
											bodyText: `The selected RFI: `+ currentRFIItem.Code +`. Therefore no change `+ findListByRFI.Code +` can be created for this RFI.`,
											iconClass: 'ico-info'
										};
										showSmallDialogOptions.push(modalOptions);
									}
								}
							});

							function provideExternalSystemGridLayout() {
								const dataConfigurationColumnGridColumns =
									[
										{
											id: 'Code',
											field: 'Code',
											readonly: true,
											name: 'Code',
											name$tr$: 'basics.common.changeStatus.code',
											formatter: 'code',
											//editor: 'code',
											width: 100

										},
										{
											id: 'Description',
											field: 'Description',
											readonly: true,
											name: 'Description',
											name$tr$: 'basics.common.changeStatus.description',
											formatter: 'description',
											//editor: 'description',
											width: 180
										},
										{
											id: 'RubricCategoryFk',
											field: 'RubricCategoryFk',
											name: 'RubricCategory',
											name$tr$: 'cloud.common.entityRubricDescription',
											formatter: 'lookup',
											formatterOptions: {
												lookupType: 'RubricCategory',
												displayMember: 'Description'
											},
											width: 150,
											readonly: true
										},
										basicsLookupdataConfigGenerator.provideGenericLookupConfigForGrid({
											lookupName: 'basics.customize.changetype',
											att2BDisplayed: 'Description',
											confObj: {
												id: 'ChangeTypeFk',
												field: 'ChangeTypeFk',
												name: 'Change Type',
												name$tr$: 'basics.customize.changetype',
												width: 125,
												validator: function (entity, value) {
													response.data.forEach(currentChangeTypeItem => {
														if(currentChangeTypeItem.Id === value){
															entity.RubricCategoryFk = currentChangeTypeItem.RubricCategoryFk;
														}
													});
													return true;
												}
											}
										})
									];
								return {
									uuid: '4fa009c7355145109e5bca2c05f1ee91',
									columns: dataConfigurationColumnGridColumns,
									tools: {
										showTitles: false,
										cssClass: 'tools',
										items: null,
									}
								};
							}

							function provideColumnInformationConfig() {
								let gridLayout = provideExternalSystemGridLayout();
								return {
									title: $translate.instant('project.inforequest.createChange'),
									getDataItems: function getDataItems() {
										return itemChange;
									},

									gridConfiguration: gridLayout,
									handleOK: function handleOK(result) {
										var data=[]
										result.data.forEach(currentRFIItem => {
											data.push({
												InfoReqId: currentRFIItem.InfoReqId,
												RubricCategoryId: currentRFIItem.RubricCategoryFk,
												ChangeTypeId: currentRFIItem.ChangeTypeFk,
												RequestStatusId: currentRFIItem.RequestStatusFk
											});
										});
										$http.post(globals.webApiBaseUrl + 'change/main/createdchangesfromrfi', data)
											.then(function (result) {
												if (result && result.data) {
													let selectedInfoRequest = projectInfoRequestDataService.getSelected();
													let change = {};
													let tuples = result.data;
													if (tuples.length > 0) {
														tuples.forEach(tuple => {
															let rfiItem = currentRFIItems.find(currentRFIItem => currentRFIItem.Id === tuple.Item2);
															if (rfiItem) {
																rfiItem.ChangeFk = tuple.Item4.Id;
																rfiItem.RequestStatusFk = tuple.Item3;
																rfiItem.Rfi2ChangeTypeFk = 3;
																if (tuple.Item4.Id === selectedInfoRequest.ChangeFk) {
																	change = tuple.Item4;
																}
															}
														});

														projectInfoRequestDataService.fireItemModified(currentRFIItems);
														projectInfoRequestDataService.gridRefresh();
														projectInfoRequestChangeDataService.getList().push(change);
														projectInfoRequestChangeDataService.fireItemModified(change)
														projectInfoRequestChangeDataService.gridRefresh();
														// documentsProjectDocumentDataService.getList().push(change);
														// documentsProjectDocumentDataService.fireItemModified(change);
														// documentsProjectDocumentDataService.gridRefresh();
													}

												}
											});
									}
								};
							}

							if(itemChange.length > 0){
								let modalExternalSystemCredentialsConfig = provideColumnInformationConfig();
								platformModalGridConfigService.showDialog(modalExternalSystemCredentialsConfig);
							}

							showSmallDialogOptions.forEach(showSmallDialogOption => {
								platformModalService.showDialog(showSmallDialogOption);
							});
						})
				});
		};

		this.createDefectRFI = function createDefectRFI() {
			let currentRFIItems = projectInfoRequestDataService.getSelectedEntities();
			const rfiIds = currentRFIItems.map(item => item.Id);
			const toBeAssignedToDefect = 2;
			let itemDefect = [];
			let showSmallDialogOptions = [];

			$http.post(globals.webApiBaseUrl + 'basics/customize/defecttype/list')
				.then(function (response) {
					$http.post(globals.webApiBaseUrl + 'defect/main/header/listbyrifs', rfiIds)
						.then(function (result) {
							let index = 1;
							currentRFIItems.forEach(currentRFIItem => {
								if (currentRFIItem.Rfi2DefectTypeFk === toBeAssignedToDefect) {
									let findListByRFI = result.data.find(item => item.Id === currentRFIItem.DefectFk);
									if (findListByRFI === undefined) {
										const defaultDefectType = _.find(response.data, item => item.IsDefault === true);
										itemDefect.push({
											"Id": index++,
											"Code": currentRFIItem.Code,
											"Description": currentRFIItem.Description,
											"DefectTypeFk": defaultDefectType.Id,
											"RubricCategoryFk": defaultDefectType.RubricCategoryFk,
											"InfoReqId": currentRFIItem.Id
										});
									} else {
										let modalOptions = {
											showGrouping: true,
											headerText: $translate.instant('project.inforequest.createDefectFromRFI'),
											bodyText: `The selected RFI: `+ currentRFIItem.Code +`. Therefore no defect `+ findListByRFI.Code +` can be created for this RFI.`,
											iconClass: 'ico-info'
										};
										showSmallDialogOptions.push(modalOptions);
									}
								}
							});

							function provideExternalSystemGridLayout() {
								const dataConfigurationColumnGridColumns =
									[
										{
											id: 'Code',
											field: 'Code',
											readonly: true,
											name: 'Code',
											name$tr$: 'cloud.common.entityCode',
											formatter: 'code',
											//editor: 'code',
											width: 100

										},
										{
											id: 'Description',
											field: 'Description',
											readonly: true,
											name: 'Description',
											name$tr$: 'cloud.common.entityDescription',
											formatter: 'description',
											//editor: 'description',
											width: 180
										},
										{
											id: 'RubricCategoryFk',
											field: 'RubricCategoryFk',
											name: 'RubricCategory',
											name$tr$: 'cloud.common.entityRubricDescription',
											formatter: 'lookup',
											formatterOptions: {
												lookupType: 'RubricCategory',
												displayMember: 'Description'
											},
											width: 150,
											readonly: true
										},
										basicsLookupdataConfigGenerator.provideGenericLookupConfigForGrid({
											lookupName: 'basics.customize.defecttype',
											att2BDisplayed: 'Description',
											confObj: {
												id: 'DefectTypeFk',
												field: 'DefectTypeFk',
												name: 'Defect Type',
												name$tr$: 'basics.customize.defecttype',
												width: 125,
												validator: function (entity, value) {
													response.data.forEach(currentDefectTypeItem => {
														if(currentDefectTypeItem.Id === value){
															entity.RubricCategoryFk = currentDefectTypeItem.RubricCategoryFk;
														}
													});
													return true;
												}
											}
										})
									];
								return {
									uuid: '7b4cf6c898904ad6b7e0da2dd3d26e42',
									columns: dataConfigurationColumnGridColumns,
									tools: {
										showTitles: false,
										cssClass: 'tools',
										items: null,
									}
								};
							}

							function provideColumnInformationConfig() {
								let gridLayout = provideExternalSystemGridLayout();
								return {
									title: $translate.instant('project.inforequest.createDefectFromRFI'),
									getDataItems: function getDataItems() {
										return itemDefect;
									},

									gridConfiguration: gridLayout,
									handleOK: function handleOK(result) {
										var data=[]
										result.data.forEach(currentRFIItem => {
											data.push({
												InfoReqId: currentRFIItem.InfoReqId,
												RubricCategoryId: currentRFIItem.RubricCategoryFk,
												DefectTypeId: currentRFIItem.DefectTypeFk,
												RequestStatusId: currentRFIItem.RequestStatusFk
											});
										});
										$http.post(globals.webApiBaseUrl + 'defect/main/header/createdefectsfromrfi', data)
											.then(function (result) {
												if (result && result.data) {
													let selectedInfoRequest = projectInfoRequestDataService.getSelected();
													let defect = {};
													let tuples = result.data;
													if (tuples.length > 0) {
														tuples.forEach(tuple => {
															let rfiItem = currentRFIItems.find(currentRFIItem => currentRFIItem.Id === tuple.Item2);
															if (rfiItem) {
																rfiItem.DefectFk = tuple.Item4.Id;
																rfiItem.RequestStatusFk = tuple.Item3;
																rfiItem.Rfi2DefectTypeFk = 3;
																if (tuple.Item4.Id === selectedInfoRequest.DefectFk) {
																	defect = tuple.Item4;
																}
															}
														});

														projectInfoRequestDataService.fireItemModified(currentRFIItems);
														projectInfoRequestDataService.gridRefresh();
														projectInfoRequestDefectDataService.getList().push(defect);
														projectInfoRequestDefectDataService.fireItemModified(defect)
														projectInfoRequestDefectDataService.gridRefresh();
													}
												}
											});
									}
								};
							}

							if(itemDefect.length > 0){
								let modalExternalSystemCredentialsConfig = provideColumnInformationConfig();
								platformModalGridConfigService.showDialog(modalExternalSystemCredentialsConfig);
							}

							showSmallDialogOptions.forEach(showSmallDialogOption => {
								platformModalService.showDialog(showSmallDialogOption);
							});
						})
				});
		};

	}
})();
