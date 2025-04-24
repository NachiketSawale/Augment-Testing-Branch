/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */
	'use strict';
	var moduleName = 'model.project';

	/**
	 * @ngdoc service
	 * @name modelProjectProjectSettingsDialogService
	 * @function
	 *
	 * @description
	 * Provides a dialog box for model projectSettings.
	 */
	angular.module(moduleName).factory('modelProjectProjectSettingsDialogService', ['_', '$translate', '$q',
		'$http', 'basicsLookupdataConfigGenerator', 'platformTranslateService', 'platformModalFormConfigService',
		'projectMainService', 'projectMainFixedModuleConfigurationService', 'projectMainProjectSelectionService',
		'ServiceDataProcessDatesExtension',
		function (_, $translate, $q, $http, basicsLookupdataConfigGenerator, platformTranslateService,
		          platformModalFormConfigService, projectMainService, projectMainFixedModuleConfigurationService,
		          projectMainProjectSelectionService, ServiceDataProcessDatesExtension) {
			var service = {};

			service.showDialog = function () {
				projectMainFixedModuleConfigurationService.updateProjectSelectionSource();
				var id = projectMainProjectSelectionService.getSelectedProjectId();

				return $http.get(globals.webApiBaseUrl + 'model/project/projectsettings/getsettings', {
					params: {
						projectId: id
					}
				}).then(function (response) {

					var dateProc = new ServiceDataProcessDatesExtension(['ExpiryDate']);
					dateProc.processItem(response.data);

					var dlgConfig = {
						title: $translate.instant('model.project.projectsettings'),
						dataItem: response.data,
						formConfiguration: {
							fid: 'model.project.projectsettings',
							showGrouping: true,
							groups: [{
								gid: 'defaults',
								header$tr$: 'model.project.defaultsGroup',
								isOpen: true
							}, {
								gid: 'versionNames',
								header$tr$: 'model.project.versionNamesGroup',
								isOpen: true
							}, {
								gid: 'expiry',
								header$tr$: 'model.project.expiryGroup',
								isOpen: true,
							}],
							rows: [basicsLookupdataConfigGenerator.provideGenericLookupConfigForForm('basics.customize.mdltype', null, {
								gid: 'defaults',
								rid: 'type',
								label$tr$: 'cloud.common.entityType',
								model: 'TypeFk'
							}, false, {
								showClearButton: true
							}), basicsLookupdataConfigGenerator.provideGenericLookupConfigForForm('basics.customize.lod', null, {
								gid: 'defaults',
								rid: 'lod',
								label$tr$: 'model.project.entityLod',
								model: 'LodFk'
							}, false, {
								showClearButton: true
							}), {
								gid: 'versionNames',
								rid: 'versioncode',
								label$tr$: 'model.project.versionCodePattern',
								type: 'comment',
								model: 'VersionCodePattern',
								placeholder: response.data.DefaultVersionCodePattern
							}, {
								gid: 'versionNames',
								rid: 'versiondesc',
								label$tr$: 'model.project.versionDescPattern',
								type: 'remark',
								model: 'VersionDescriptionPattern',
								placeholder: response.data.DefaultVersionDescriptionPattern
							}, {
								gid: 'expiry',
								rid: 'active',
								label$tr$: 'model.project.active',
								type: 'boolean',
								model: 'Active'
							}, {
								gid: 'expiry',
								rid: 'expirydate',
								label$tr$: 'model.project.defaultExpiryDate',
								type: 'dateutc',
								model: 'ExpiryDate',
								showClearButton: true
							}, {
								gid: 'expiry',
								rid: 'expirydays',
								label$tr$: 'model.project.defaultExpiryDays',
								type: 'integer',
								model: 'ExpiryDays'
							}]
						}
					};

					platformTranslateService.translateFormConfig(dlgConfig.formConfiguration);
					return platformModalFormConfigService.showDialog(dlgConfig).then(function (result) {
						if (result.ok) {
							return $http.post(globals.webApiBaseUrl + 'model/project/projectsettings/setsettings',
								dlgConfig.dataItem);
						} else {
							return $q.reject('No model project settings changed.');
						}
					});
				});
			};
			return service;
		}]);
})(angular);
