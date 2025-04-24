/**
 * Created by leo on 20.03.2017.
 */
(function (angular) {
	/* global globals */
	'use strict';

	/**
	 * @ngdoc factory
	 * @name schedulingMainRenumberWizardService
	 * @description
	 * Provides wizard to renumber a selected schedule
	 *
	 * @example
	 * <div paltform-layout initial-layout="name of layout", layout-options="options"></div>
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	/* jshint -W106 */
	angular.module('scheduling.main').factory('schedulingMainRenumberWizardService',
		['_', '$http', 'schedulingMainService', 'platformModalService', 'platformTranslateService', 'platformSidebarWizardConfigService',
			'platformModalFormConfigService', '$translate', 'platformSidebarWizardCommonTasksService', 'platformSchemaService', 'basicsLookupdataConfigGenerator',
			'schedulingMainTranslationService',

			function (_, $http, schedulingMainService, platformModalService, platformTranslateService, platformSidebarWizardConfigService,
				platformModalFormConfigService, $translate, platformSidebarWizardCommonTasksService, platformSchemaService, basicsLookupdataConfigGenerator,
				schedulingMainTranslationService) {

				var service = {};
				var sortTypeItems = [{'Id': 0, 'Description': $translate.instant('scheduling.main.sortOrderAsc')},
					{'Id': 1, 'Description': $translate.instant('scheduling.main.sortOrderDesc')}];
				var props = [];
				var scheme = platformSchemaService.getSchemaFromCache({
					typeName: 'ActivityDto',
					moduleSubModule: 'Scheduling.Main'
				}).properties;
				_.each(Object.getOwnPropertyNames(scheme), function (prop) {
					if ((prop.toLowerCase().lastIndexOf('fk') === -1 ||
						prop === 'LocationFk' || prop === 'ActivityStateFk') && prop !== 'SearchPattern') {
						var translation = schedulingMainTranslationService.getTranslationInformation(prop);
						var description = prop;
						if (translation) {
							description = $translate.instant(translation.location + '.' + translation.identifier);
							if (translation.param) {
								description = description + translation.param.p_0;
							}
						}
						props.push({Id: prop, 'Description': description});
					}
				});
				var attributes = _.orderBy(props, ['Description'], ['asc']);
				service.renumberActivities = function renumberActivities() {
					let modalRenumberConfig;
					let schedule = schedulingMainService.getSelectedSchedule();
					let title = 'scheduling.main.renumberActivities';

					if (platformSidebarWizardCommonTasksService.assertSelection(schedule, 'scheduling.main.renumberActivities')) {
						modalRenumberConfig = {
							title: $translate.instant(title),
							dataItem: {
								codeFormatFk: schedule.CodeFormatFk, sortSetting1: {sortAttr: null, sortType: 0},
								testrun: false,
								sortSetting2: {sortAttr: null, sortType: 0},
								sortSetting3: {sortAttr: null, sortType: 0},
								sortSetting4: {sortAttr: null, sortType: 0},
								sortSetting5: {sortAttr: null, sortType: 0}
							},
							resizeable: true,
							formConfiguration: {
								fid: 'scheduling.main.renumberSchedule',
								version: '0.2.4',
								showGrouping: true,
								groups: [
									{
										gid: 'baseGroup',
										header: 'Renumber settings', header$tr$: 'scheduling.main.wizardSortTitle',
										isOpen: true, visible: true
									},
									{
										gid: 'level1',
										header: 'Level 1', header$tr$: 'scheduling.main.wizardSortLevel1',
										isOpen: true, visible: true
									},
									{
										gid: 'level2',
										header: 'Level 2', header$tr$: 'scheduling.main.wizardSortLevel2',
										isOpen: true, visible: true
									},
									{
										gid: 'level3',
										header: 'Level 3', header$tr$: 'scheduling.main.wizardSortLevel3',
										isOpen: false, visible: true
									},
									{
										gid: 'level4',
										header: 'Level 4', header$tr$: 'scheduling.main.wizardSortLevel4',
										isOpen: false, visible: true
									},
									{
										gid: 'level5',
										header: 'Level 5', header$tr$: 'scheduling.main.wizardSortLevel5',
										isOpen: false, visible: true
									}
								],
								rows: [
									basicsLookupdataConfigGenerator.provideDataServiceLookupConfigForForm({
										dataServiceName: 'basicsCustomCodeFormatLookupDataService',
										enableCache: true
									}, {
										gid: 'baseGroup',
										rid: 'codeFormatFk',
										label: 'Code Format',
										label$tr$: 'basics.customize.codeformat',
										model: 'codeFormatFk',
										sortOrder: 1
									}),
									{
										gid: 'baseGroup',
										rid: 'testRun',
										label$tr$: 'scheduling.main.testRun',
										type: 'boolean',
										model: 'testrun',
										sortOrder: 2,
										visible: true
									},

									{
										gid: 'level1',
										rid: 'sortSetting1',
										label$tr$: 'scheduling.main.wizardSortAttrLevel',
										label$tr$param$: {p_0: '1'},
										type: 'select',
										options: {items: attributes, displayMember: 'Description', valueMember: 'Id'},
										model: 'sortSetting1.sortAttr',
										sortOrder: 3,
										visible: true
									},
									{
										gid: 'level1',
										rid: 'sortTyp1',
										label$tr$: 'scheduling.main.wizardSortTyp',
										label$tr$param$: {p_0: '1'},
										type: 'select',
										options: {items: sortTypeItems, displayMember: 'Description', valueMember: 'Id'},
										model: 'sortSetting1.sortType',
										sortOrder: 4,
										visible: true
									},
									{
										gid: 'level2',
										rid: 'sortSetting2',
										label$tr$: 'scheduling.main.wizardSortAttrLevel',
										label$tr$param$: {p_0: '2'},
										type: 'select',
										options: {items: attributes, displayMember: 'Description', valueMember: 'Id'},
										model: 'sortSetting2.sortAttr',
										visible: true,
										sortOrder: 5
									},
									{
										gid: 'level2',
										rid: 'sortTyp2',
										label$tr$: 'scheduling.main.wizardSortTyp',
										label$tr$param$: {p_0: '2'},
										type: 'select',
										options: {items: sortTypeItems, displayMember: 'Description', valueMember: 'Id'},
										model: 'sortSetting2.sortType',
										visible: true,
										sortOrder: 6
									},
									{
										gid: 'level3',
										rid: 'sortSetting3',
										label$tr$: 'scheduling.main.wizardSortAttrLevel',
										label$tr$param$: {p_0: '3'},
										type: 'select',
										options: {items: attributes, displayMember: 'Description', valueMember: 'Id'},
										model: 'sortSetting3.sortAttr',
										visible: true,
										sortOrder: 7
									},
									{
										gid: 'level3',
										rid: 'sortTyp3',
										label$tr$: 'scheduling.main.wizardSortTyp',
										label$tr$param$: {p_0: '3'},
										type: 'select',
										options: {items: sortTypeItems, displayMember: 'Description', valueMember: 'Id'},
										model: 'sortSetting3.sortType',
										visible: true,
										sortOrder: 8
									},
									{
										gid: 'level4',
										rid: 'sortSetting4',
										label$tr$: 'scheduling.main.wizardSortAttrLevel',
										label$tr$param$: {p_0: '4'},
										type: 'select',
										options: {items: attributes, displayMember: 'Description', valueMember: 'Id'},
										model: 'sortSetting4.sortAttr',
										visible: true,
										sortOrder: 9
									},
									{
										gid: 'level4',
										rid: 'sortTyp4',
										label$tr$: 'scheduling.main.wizardSortTyp',
										label$tr$param$: {p_0: '4'},
										type: 'select',
										options: {items: sortTypeItems, displayMember: 'Description', valueMember: 'Id'},
										model: 'sortSetting4.sortType',
										visible: true,
										sortOrder: 10
									},
									{
										gid: 'level5',
										rid: 'sortSetting5',
										label$tr$: 'scheduling.main.wizardSortAttrLevel',
										label$tr$param$: {p_0: '5'},
										type: 'select',
										options: {items: attributes, displayMember: 'Description', valueMember: 'Id'},
										model: 'sortSetting5.sortAttr',
										visible: true,
										sortOrder: 11
									},
									{
										gid: 'level5',
										rid: 'sortTyp5',
										label$tr$: 'scheduling.main.wizardSortTyp',
										label$tr$param$: {p_0: '5'},
										type: 'select',
										options: {items: sortTypeItems, displayMember: 'Description', valueMember: 'Id'},
										model: 'sortSetting5.sortType',
										visible: true,
										sortOrder: 12
									}
								]
							},
							dialogOptions: {
								disableOkButton: function disableOkButton() {
									return modalRenumberConfig.dataItem.codeFormatFk === null || modalRenumberConfig.dataItem.sortSetting1.sortAttr === null ||
										modalRenumberConfig.dataItem.sortSetting1.sortType === null;
								},
								disableCancelButton: function disableCancelButton() {
									return false;
								}
							},
							handleOK: function handleOK(result) {

								let action = {
									Action: 15,
									EffectedItemId: schedule.Id,
									RenumberInfo: {
										CodeFormatFk: result.data.codeFormatFk,
										IsTestRun: result.data.testrun,
										SortLevels: [{
											SortAttribute: result.data.sortSetting1.sortAttr,
											SortOrder: result.data.sortSetting1.sortType
										},
										{
											SortAttribute: result.data.sortSetting2.sortAttr,
											SortOrder: result.data.sortSetting2.sortType
										},
										{
											SortAttribute: result.data.sortSetting3.sortAttr,
											SortOrder: result.data.sortSetting3.sortType
										},
										{
											SortAttribute: result.data.sortSetting4.sortAttr,
											SortOrder: result.data.sortSetting4.sortType
										},
										{
											SortAttribute: result.data.sortSetting5.sortAttr,
											SortOrder: result.data.sortSetting5.sortType
										}]
									}
								};

								$http.post(globals.webApiBaseUrl + 'scheduling/main/activity/execute', action
								).then(function (response) {// response not used
									if(action.RenumberInfo.IsTestRun) {
										let modalOptions = {
											headerText: $translate.instant(title),
											bodyText: $translate.instant('scheduling.main.infoMsgRenumberWizard'),
											iconClass: 'ico-info'
										};
										if(response.data.ActionResult){
											modalOptions.bodyText = $translate.instant('scheduling.main.infoMsgRenumberWizardNotSuccessfully') + ' ' + response.data.ActionResult;
										}
										platformModalService.showDialog(modalOptions).then(function(){
											platformModalFormConfigService.showDialog(modalRenumberConfig);
										});
									} else {
										platformSidebarWizardCommonTasksService.showSuccessfullyDoneMessage(title);
										schedulingMainService.load();
									}
								});
							}
						};

						platformTranslateService.translateFormConfig(modalRenumberConfig.formConfiguration);

						modalRenumberConfig.scope = platformSidebarWizardConfigService.getCurrentScope();
						platformModalFormConfigService.showDialog(modalRenumberConfig);
					}
				};

				return service;
			}
		]);
})(angular);
