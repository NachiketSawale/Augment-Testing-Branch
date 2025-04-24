/*
 * $Id: model-project-projectsettings-dialog-service.js 334 2021-05-21 10:07:38Z haagf $
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */
	'use strict';
	var moduleName = 'model.project';

	/**
	 * @ngdoc service
	 * @name modelProjectSelectedModelInfoDialogService
	 * @function
	 *
	 * @description
	 * Provides a dialog box for selected model information.
	 */
	angular.module(moduleName).factory('modelProjectSelectedModelInfoDialogService', ['_', '$translate', '$q',
		'$http', 'basicsLookupdataConfigGenerator', 'platformTranslateService', 'platformModalService', 'platformModalFormConfigService',
		'projectMainService', 'modelViewerModelSelectionService', 'modelViewerHoopsLoadingService','$log',
		function (_, $translate, $q, $http, basicsLookupdataConfigGenerator, platformTranslateService, platformModalService,
		          platformModalFormConfigService, projectMainService, modelViewerModelSelectionService, modelViewerHoopsLoadingService,
			$log) {
			let service = {};

			service.showDialog = function () {
				const selModel = modelViewerModelSelectionService.getSelectedModel();
				const relatedinfo = {
					modelInfo: 'Model (' + selModel.info.modelId + ') Code: ' + selModel.info.modelCode + '/ Description: ' + selModel.info.modelDesc + ' ',
					companyInfo: 'Company (' + selModel.info.companyId + ') / Code: ' + selModel.info.companyCode + '/ Description: ' + selModel.info.companyName + ' ',
					projectInfo: 'Project (' + selModel.info.projectId + ') / Code: ' + selModel.info.projectCode + '/ Description: ' + selModel.info.projectName + ' '
				};
				let submodelsInfo = '';

				if (selModel.info.isComposite) {
					selModel.subModels.forEach(function (sm) {
						submodelsInfo += '-- Submodel (' + sm.info.modelId + ') Code: ' + sm.info.modelCode + '/ Description: ' + sm.info.modelDesc + ' ';
						submodelsInfo += 'Company (' + sm.info.companyId + ') / Code: ' + sm.info.companyCode + '/ Description: ' + sm.info.companyName + ' ';
						submodelsInfo += 'Project (' + sm.info.projectId + ') / Code: ' + sm.info.projectCode + '/ Description: ' + sm.info.projectName + '\n';
					});
				}

				const selModelObj = {
					instanceUrl: modelViewerHoopsLoadingService.getModelInstanceUrl(),
					relatedInfo: relatedinfo.modelInfo + '\n' + relatedinfo.companyInfo + '\n' + relatedinfo.projectInfo,
					submodelsInfo: submodelsInfo,
					modelInfo: 'Instance url: '+modelViewerHoopsLoadingService.getModelInstanceUrl() +'\n'+
						'Model info: '+ relatedinfo.modelInfo + '\n' + relatedinfo.companyInfo + '\n' + relatedinfo.projectInfo +'\n'+
						submodelsInfo
				};

				let modalOptions = {
					headerTextKey: 'model.viewer.infoModel',
					showCancelButton: true,
					customButtons: [{
						id: 'copy',
						caption: 'basics.common.upload.copyToClipboard',
						fn: function (event, info) {
							navigator.clipboard.writeText(selModelObj.modelInfo);
						}
					}],
					iconClass: 'ico-question',
					bodyTemplateUrl: globals.appBaseUrl + 'model.project/templates/model-project-selected-model-info-dialog.html',
					selModelObj: selModelObj
				};

				platformModalService.showDialog(modalOptions).then(function (result) {

				});

			};
			return service;
		}]);
})(angular);
