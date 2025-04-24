/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	var moduleName = 'controlling.structure';
	angular.module(moduleName).factory('controllingStructureCreateControllingunittemplateWizardService',
		['globals', '_', '$q', '$http', '$translate', 'platformTranslateService', 'platformModalFormConfigService', 'platformSidebarWizardCommonTasksService', 'platformDataValidationService', 'projectMainForCOStructureService',
			function (globals, _, $q, $http, $translate, platformTranslateService, platformModalFormConfigService, platformSidebarWizardCommonTasksService, platformDataValidationService, projectMainForCOStructureService) {

				var service = {
					createControllingUnitTemplateWizard: function createControllingUnitTemplateWizard() {

						var selectedProjects = projectMainForCOStructureService.getSelectedEntities(),
							title = 'controlling.structure.createControllingUnitTemplateWizardTitle';

						// process if only one project is selected
						if (_.size(selectedProjects) !== 1) {
							var msg = $translate.instant('controlling.structure.noCurrentProjectSelection');
							platformSidebarWizardCommonTasksService.showErrorNoSelection(title, msg);
							return;
						}
						var dataItem = {
							Code: ''
						};
						var modalDialogConfig = {
							title: $translate.instant(title),
							dataItem: dataItem,
							formConfiguration: {
								fid: 'controlling.structure.createControllingUnitTemplateWizardDialog',
								version: '0.1.0',
								showGrouping: false,
								groups: [{
									gid: 'baseGroup',
									attributes: ['code', 'description']
								}],
								rows: [
									// Code
									{
										gid: 'baseGroup',
										rid: 'code',
										label$tr$: 'cloud.common.entityCode',
										model: 'Code',
										required: true,
										type: 'code',
										sortOrder: 1,
										asyncValidator: function (entity, code, model) {
											var defer = $q.defer();
											var url = globals.webApiBaseUrl + 'controlling/controllingunittemplate/isuniquecode?code=' + code;
											$http.get(url).then(function (result) {
												defer.resolve(!result.data ? platformDataValidationService.createErrorObject('cloud.common.uniqueValueErrorMessage', {object: model.toLowerCase()}) : true);
											});
											return defer.promise;
										}
									},
									// Description
									{
										gid: 'baseGroup',
										rid: 'description',
										label$tr$: 'cloud.common.entityDescription',
										model: 'Description',
										type: 'description',
										sortOrder: 2
									}]
							},
							dialogOptions: {
								disableOkButton: function () {
									return _.some(_.values(_.get(dataItem, '__rt$data.errors')), _.isObject);
								}
							},
							handleOK: function handleOK(result) {
								projectMainForCOStructureService.updateAndExecute(function () {
									var selectedProject = _.first(selectedProjects);
									var param = {
										code: result.data.Code,
										description: result.data.Description,
										projectId: _.get(selectedProject, 'Id')
									};
									$http.post(globals.webApiBaseUrl + 'controlling/controllingunittemplate/createcontrollingunittemplate', param)
										.then(function (response) {
											if (response.data.withErrors === false) {
												platformSidebarWizardCommonTasksService.showSuccessfullyDoneMessage(title);
											}
										}, function () {
											// TODO:
										});
								});
							},
							handleCancel: function handleCancel() {
							}
						};

						platformTranslateService.translateFormConfig(modalDialogConfig.formConfiguration);
						platformModalFormConfigService.showDialog(modalDialogConfig);
					}
				};
				return service;
			}
		]);
})();