/**
 * Created by sandu on 08.06.2016.
 */
(function () {
	'use strict';
	var moduleName = 'usermanagement.main';
	angular.module(moduleName).factory('usermanagementMainAdsConfigService', usermanagementMainAdsConfigService);
	usermanagementMainAdsConfigService.$inject = ['$http', '$log', 'platformModalService', '$q', '$translate'];

	function usermanagementMainAdsConfigService($http, $log, platformModalService, $q, $translate) {
		var service = {};

		function processErrorInfoDialog(errorCode, errorCodeTask) {
			var taskMessage = '';
			if (errorCodeTask === 1) {
				taskMessage = $translate.instant('usermanagement.main.adsConfig.adTaskInfo');
			}
			switch (errorCode) {
				case 0:
					return platformModalService.showMsgBox('usermanagement.main.adsConfig.infoBodyText', 'usermanagement.main.adsConfig.infoDialogHeader', 'info');
				case 1:
					return platformModalService.showMsgBox($translate.instant('usermanagement.main.adsConfig.infoBodyTextGroupError') + '<br>' + taskMessage, 'usermanagement.main.adsConfig.infoDialogHeader', 'info');
				case 2:
					return platformModalService.showMsgBox($translate.instant('usermanagement.main.adsConfig.infoBodyTextUserError') + '<br>' + taskMessage, 'usermanagement.main.adsConfig.infoDialogHeader', 'info');
				case 3:
					return platformModalService.showMsgBox($translate.instant('usermanagement.main.adsConfig.infoBodyTextGroupAndUserError') + '<br>' + taskMessage, 'usermanagement.main.adsConfig.infoDialogHeader', 'info');
				case 4:
					return platformModalService.showMsgBox($translate.instant('usermanagement.main.adsConfig.authenticationError'), 'usermanagement.main.adsConfig.infoDialogHeader', 'info');
				case 5:
					return platformModalService.showMsgBox($translate.instant('usermanagement.main.adsConfig.infoBodyTextNoEntryFound') , 'usermanagement.main.adsConfig.infoDialogHeader', 'info');
				case 6:
					return platformModalService.showMsgBox($translate.instant('usermanagement.main.adsConfig.infoBodyTextMultipleEntry') , 'usermanagement.main.adsConfig.infoDialogHeader', 'info');
			}
		}

		function validationErrorInfoDialog(errorCode) {
			switch (errorCode) {
				case 0:
					return platformModalService.showMsgBox('usermanagement.main.adsConfig.validationBodyText', 'usermanagement.main.adsConfig.infoDialogHeader', 'info');
				case 1:
					return platformModalService.showMsgBox($translate.instant('usermanagement.main.adsConfig.validationBodyTextGroupError') , 'usermanagement.main.adsConfig.infoDialogHeader', 'info');
				case 2:
					return platformModalService.showMsgBox($translate.instant('usermanagement.main.adsConfig.validationBodyTextUserError') , 'usermanagement.main.adsConfig.infoDialogHeader', 'info');
				case 3:
					return platformModalService.showMsgBox($translate.instant('usermanagement.main.adsConfig.validationBodyTextGroupAndUserError') , 'usermanagement.main.adsConfig.infoDialogHeader', 'info');
				case 4:
					return platformModalService.showMsgBox($translate.instant('usermanagement.main.adsConfig.validationBodyTextWrongInput') , 'usermanagement.main.adsConfig.infoDialogHeader', 'info');
			}
		}

		/**
		 *
		 */
		service.showConfig = function showConfig() {
			platformModalService.showDialog({
				templateUrl: globals.appBaseUrl + 'usermanagement.main/templates/adConfigDialog.html',
				controller: 'usermanagementMainAdConfigController'
			});
		};

		service.getLastConfig = function () {
			return $http({
				method: 'GET',
				url: globals.webApiBaseUrl + 'services/scheduler/job/lastadconfig'
			}).then(function (response) {
				response.data.ParameterList = JSON.parse(response.data.ParameterList);
				return response.data;
			}, function (error) {
				$log.error(error);
			});
		};

		function saveLdapPath(adsPaths) {
			return $http({
				method: 'POST',
				url: globals.webApiBaseUrl + 'usermanagement/main/adsConfig/savepaths',
				params: {usersPath: adsPaths.usersPath || '', groupsPath: adsPaths.groupsPath || ''}
			});
		}

		service.validateLdapPathsWithCredentials = function validateLdapPathsWithCredentials(ldapParameters) {
			return $http.post(
				globals.webApiBaseUrl + 'usermanagement/main/adsConfig/validatepathswithcredentials',
				ldapParameters);
		};

		service.errorDialog = function errorDialog(errorCode) {
			validationErrorInfoDialog(errorCode);
		};

		service.ldapValidationForParametersList = function ldapValidationForParametersList(entity) {
			const ldapParameters = {
				ldapGroupsPath: entity.GroupPath,
				ldapUsersPath: entity.UserPath,
				ldapUsername: entity.LdapUsername || '',
				ldapPassword: entity.LdapPassword || '',
				useSecureConnection: entity.LdapsMode
			};
			if (entity.LdapAuthentication === false) {
				ldapParameters.ldapUsername = undefined;
				ldapParameters.ldapPassword = undefined;
			}
			return service.validateLdapPathsWithCredentials(ldapParameters)
				.then(function (response) {
					service.errorDialog(response.data);
				})
				.catch(function (error) {
					console.error('Error validating LDAP paths', error);
				});
		};

		service.getPaths = function () {
			return $http({
				method: 'GET',
				url: globals.webApiBaseUrl + 'usermanagement/main/adsConfig/getpaths'
			}).then(function (response) {
				return response.data;
			}, function (error) {
				$log.error(error);
			});
		};


		/**
		 * this method saved the ldap parameters to profile
		 * ldap: groups path, users path, server username, server password
		 * @param ldapparameters  {ldapGroupsPath:  string, ldapUsersPath: string, LdapUsername: string, LdapPassword:string, HasPassword: bool}
		 * @returns {*}
		 */
		service.saveLdapParameters = function saveLdapParameters(ldapparameters) {
			return $http.post(
				globals.webApiBaseUrl + 'usermanagement/main/adsConfig/saveldappathparameters',
				ldapparameters);

		};

		/**
		 * this method read the ldap parameters for the ldap configutation dialog:
		 *  ldap groups path, ldap users path, ldap server username, ldap server password
		 *
		 * @returns {Promise|*|Deferred.promise|PromiseLike<T | never>|Promise<T | never>|c}
		 */
		service.getLdapParameters = function getLdapParameters() {
			return $http({
				method: 'GET',
				url: globals.webApiBaseUrl + 'usermanagement/main/adsConfig/getldappathparameters'
			}).then(function (response) {
				return response.data;
			}, function (error) {
				$log.error(error);
			});
		};

		/**
		 * this method read the ldap parameters list for the ldap configutation dialog:
		 *  ldap groups path, ldap users path, ldap server username, ldap server password
		 *
		 * @returns {Promise|*|Deferred.promise|PromiseLike<T | never>|Promise<T | never>|c}
		 */
		service.getLdapParametersList = function getLdapParametersList() {
			return $http({
				method: 'GET',
				url: globals.webApiBaseUrl + 'usermanagement/main/adsConfig/getldappathparameterslist'
			}).then(function (response) {
				return response.data;
			}, function (error) {
				$log.error(error);
			});
		};

		function saveScheduleTaskConfig(settings) {
			var settingsOpt = {
				Activated: settings.activated,
				AddAdUser: settings.addAdUser,
				SyncAdUser: settings.syncAdUser,
				SyncAdGroup: settings.syncAdGroup,
				Daily: settings.daily === 'true',
				Weekly: settings.daily === 'weekly',
				Date: settings.date,
				ImportEnabledOnly: settings.importEnabledOnly,
				UpnNameFilter: settings.upnNameFilter,
				KeepDuration: (settings.keepDuration && settings.keepDuration > 0) ? settings.keepDuration : 0,
				KeepCount: (settings.keepCount && settings.keepCount > 0) ? settings.keepCount : 0
			};
			return $http({
				method: 'POST',
				url: globals.webApiBaseUrl + 'usermanagement/main/adsConfig/savescheduletaskconfig',
				data: settingsOpt
			});
		}

		function handleErrorDialog(errorCodePaths, errorCodeTask) {
			if (errorCodePaths === 0 && errorCodeTask === 1) {
				processErrorInfoDialog(0);
			} else {
				processErrorInfoDialog(errorCodePaths, errorCodeTask);
			}
		}

		/**
		 * method saveAdConfigurationComplete
		 * @param profileAdPaths    oldValues, for checking if save required
		 * @param adsPaths          newValue,
		 * @param settings          if settings activate we always save it
		 */
		service.saveAdConfigurationCompleteOld = function (profileAdPaths, adsPaths, settings) {
			var errorCodePaths;
			var errorCodeTask;
			var promises = [];
			if (adsPaths.usersPath !== profileAdPaths.usersPath || adsPaths.groupsPath !== profileAdPaths.groupsPath) {

				var promiseLdap = saveLdapPath(adsPaths).then(function (response) {
					errorCodePaths = response.data;
				}, function (error) {
					$log.error(error);
				});
				promises.push(promiseLdap);
			}

			if (settings.activated === true) {
				var promiseTaskConfig = saveScheduleTaskConfig(settings).then(function (response) {
					errorCodeTask = response.data;
				}, function (error) {
					$log.error(error);
				});
				promises.push(promiseTaskConfig);
			}
			// wait for all task have been finished
			$q.all(promises).then(function () {
				handleErrorDialog(errorCodePaths, errorCodeTask);
			});

		};

		/**
		 * this method saved the ldap parameters to profile
		 * ldap: groups path, users path, server username, server password
		 * @param ldapparameters  {ldapGroupsPath:  string, ldapUsersPath: string, LdapUsername: string, LdapPassword:string, HasPassword: bool}
		 * @returns {*}
		 */
		service.saveLdapParameters = function saveLdapParameters(ldapparameters) {
			return $http.post(
				globals.webApiBaseUrl + 'usermanagement/main/adsConfig/saveldappathparameters',
				ldapparameters);

		};


		/**
		 * method saveAdConfigurationComplete
		 * @param profileAdPaths    oldValues, for checking if save required
		 * @param adsPaths          newValue,
		 * @param settings          if settings activate we always save it
		 */
		service.saveAdConfigurationComplete = function (profileAdPaths, ldapparameters, settings) {
			var errorCodePaths;
			var errorCodeTask;
			var promises = [];
			if (!_.isEqual(ldapparameters.adsPaths, profileAdPaths)) {
				var promiseLdap = service.saveLdapParameters(ldapparameters).then(function ok(response) {
					errorCodePaths = response.data;
				}, function error(error) {
					$log.error(error);
				});
				promises.push(promiseLdap);
			}
			/* if (ldapparameters.adsPaths.usersPath !== profileAdPaths.usersPath || ldapparameters.adsPaths.groupsPath !== profileAdPaths.groupsPath) {
				var promiseLdap = saveLdapPath(adsPaths).then(function (response) {
					errorCodePaths = response.data;
				}, function (error) {
					$log.error(error);
				});
				promises.push(promiseLdap);
			}
		 */
			if (settings.activated === true) {
				var promiseTaskConfig = saveScheduleTaskConfig(settings).then(function (response) {
					errorCodeTask = response.data;
				}, function (error) {
					$log.error(error);
				});
				promises.push(promiseTaskConfig);
			}
			// wait for all task have been finished
			$q.all(promises).then(function () {
				handleErrorDialog(errorCodePaths, errorCodeTask);
			});
		};
		return service;
	}
})();