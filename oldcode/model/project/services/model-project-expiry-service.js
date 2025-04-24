/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */
	'use strict';

	/**
	 * @ngdoc service
	 * @name model.project.modelProjectExpiryService
	 * @function
	 *
	 * @description Provides all client-side functions and UI related to auto-expiry of models.
	 */
	angular.module('model.project').factory('modelProjectExpiryService', ['_', '$http', '$translate', '$injector',
		'platformTranslateService', 'platformModalFormConfigService', 'servicesSchedulerUILogLevelValues', 'moment',
		'servicesSchedulerUIJobLogDialogService', 'platformDialogService', 'platformPermissionService',
		function (_, $http, $translate, $injector, platformTranslateService, platformModalFormConfigService,
			servicesSchedulerUILogLevelValues, moment, servicesSchedulerUIJobLogDialogService, platformDialogService,
		          platformPermissionService) {
			var service = {};

			const modelExpiryJobConfigPermissionGuid = 'cc2c8d4010bd4a398623345423024bca';

			// service must be initialized
			$injector.get('modelProjectMainTranslationService');

			function showDialog(jobEntity) {
				var logLevelValues = _.cloneDeep(servicesSchedulerUILogLevelValues);
				platformTranslateService.translateObject(logLevelValues, ['description']);

				var dlgConfig = {
					title: $translate.instant('model.project.expiry.title'),
					dataItem: jobEntity,
					formConfiguration: {
						fid: 'model.project.expiry',
						showGrouping: false,
						groups: [{
							gid: 'default'
						}],
						rows: [{
							gid: 'default',
							rid: 'repeatunit',
							label$tr$: 'model.project.expiry.execution',
							type: 'directive',
							directive: 'model-project-expiry-job-execution',
							model: 'Execution',
							options: {
								model: 'Execution'
							}
						}, {
							gid: 'default',
							rid: 'repeatfactor',
							label$tr$: 'model.project.expiry.repeatFactor',
							model: 'RepeatFactor',
							type: 'integer'
						}, {
							gid: 'default',
							rid: 'starttime',
							label$tr$: 'model.project.expiry.startTime',
							model: 'StartTime',
							type: 'datetime'
						}, {
							gid: 'default',
							rid: 'loglevel',
							label$tr$: 'model.project.expiry.logLevel',
							model: 'LogLevel',
							type: 'select',
							options: {
								displayMember: 'description',
								valueMember: 'Id',
								items: logLevelValues
							}
						}, {
							gid: 'default',
							rid: 'lastLog',
							label$tr$: 'model.project.expiry.lastLog',
							type: 'directive',
							directive: 'platform-btn-form-control',
							options: {
								caption: $translate.instant('model.project.expiry.showLog'),
								fnc: function () {
									return $http.get(globals.webApiBaseUrl + 'model/project/model/expiry/lastjobid').then(function (response) {
										if (_.isInteger(response.data)) {
											return servicesSchedulerUIJobLogDialogService.showLogDialog(response.data);
										} else {
											return platformDialogService.showMsgBox('model.project.expiry.noLastLog', 'cloud.desktop.infoDialogHeader', 'info');
										}
									});
								}
							}
						}]
					}
				};

				platformTranslateService.translateFormConfig(dlgConfig.formConfiguration);
				return platformModalFormConfigService.showDialog(dlgConfig).then(function (result) {
					return result.data;
				});
			}

			service.editExpiry = function () {
				if (!platformPermissionService.hasExecute(modelExpiryJobConfigPermissionGuid)) {
					return platformDialogService.showMsgBox('model.project.expiry.noPermission', 'model.project.expiry.noPermissionTitle', 'error');
				}

				return $http.get(globals.webApiBaseUrl + 'model/project/model/expiry/loadrecurring').then(function (response) {
					var jobEntity = response.data;
					jobEntity.StartTime = moment(jobEntity.StartTime);
					jobEntity.StartTime.local();
					return showDialog(jobEntity).then(function (result) {
						if (result) {
							result.StartTime.utc();
							return $http.post(globals.webApiBaseUrl + 'model/project/model/expiry/saverecurring', jobEntity).then(function () {
								return platformDialogService.showMsgBox('model.project.expiry.jobConfigured', 'cloud.desktop.infoDialogHeader', 'info');
							});
						} else {
							return false;
						}
					});
				});
			};

			return service;
		}]);
})(angular);
