/**
 * Created by rei on 23.05.2019. copy with modifications from user/group
 */
(function (angular) {
	'use strict';

	var moduleName = 'usermanagement.main';
	angular.module(moduleName).controller('usermanagementMainAdConfigController', usermanagementMainAdConfigController);
	usermanagementMainAdConfigController.$inject = ['_', '$scope', '$translate', '$modalInstance', 'usermanagementMainAdsConfigService', 'platformModalService', 'moment', 'platformModuleNavigationService'];

	function usermanagementMainAdConfigController(_, $scope, $translate, $modalInstance, usermanagementMainAdsConfigService, platformModalService, moment, naviService) {

		$scope.modalOptions = {
			ok: onOk,
			cancel: onCancel,
			canSetDateTime: onCanSetDateTime,
			headerText: $translate.instant('usermanagement.main.dialog.adConfig'),
			ldapUrl: $translate.instant('usermanagement.main.dialog.ldapUrl'),
			// {{'usermanagement.main.dialog.ldapSampleLabel' | translate}}
			validateOptions: {
				fnc: onValidate,
				caption$tr$: 'usermanagement.main.dialog.validate'
			},
			onTabSelect: function (tab) {
				// update selected tab status
				$scope.selectedTab = tab.title;
			}
		};
		$scope.modalOptions.tabs = [
			{
				title: $translate.instant('usermanagement.main.dialog.tab-adConfig'),
				content: globals.appBaseUrl + 'usermanagement.main/templates/tab-adConfig.html',
				active: true,
				isTabActive: function () {
					return $scope.selectedTab === this.title;
				}
			},
			{
				title: $translate.instant('usermanagement.main.dialog.tab-scheduleConfig'),
				content: globals.appBaseUrl + 'usermanagement.main/templates/tab-scheduleConfig.html',
				reloadTab: true,
				isTabActive: function () {
					return $scope.selectedTab === this.title;
				}
			}
		];

		$scope.selectedTab = $scope.modalOptions.tabs.find(tab => tab.active).title;
		$scope.isAdConfigTabActive = function () {
			return $scope.modalOptions.tabs[0].isTabActive();
		}

		$scope.adSettings = {};
		$scope.settings = {};
		$scope.settings.activatedOpt = {
			ctrlId: 'activated',
			labelText: $translate.instant('usermanagement.main.dialog.activated')
		};
		$scope.settings.addAdUserOpt = {
			ctrlId: 'addAdUser',
			labelText: $translate.instant('usermanagement.main.dialog.addAdUser')
		};
		$scope.settings.syncAdUserOpt = {
			ctrlId: 'syncAdUser',
			labelText: $translate.instant('usermanagement.main.dialog.syncAdUser')
		};
		$scope.settings.syncAdGroupOpt = {
			ctrlId: 'syncAdGroup',
			labelText: $translate.instant('usermanagement.main.dialog.syncAdGroup')
		};
		$scope.settings.importEnabledOnlyOpt = {
			ctrlId: 'importEnabledOnly',
			labelText: $translate.instant('usermanagement.main.dialog.importEnabledOnly')
		};
		$scope.settings.dailyOpt = {
			ctrlId: 'daily',
			labelText: $translate.instant('usermanagement.main.dialog.daily')
		};
		$scope.settings.weeklyOpt = {
			ctrlId: 'weekly',
			labelText: $translate.instant('usermanagement.main.dialog.weekly')
		};
		$scope.settings.nonrepOpt = {
			ctrlId: 'nonrep',
			labelText: $translate.instant('usermanagement.main.dialog.nonrep')
		};

		var settings = $scope.settings;
		$scope.settings.activated = false;
		$scope.settings.addAdUser = false;
		$scope.settings.syncAdUser = false;
		$scope.settings.syncAdGroup = false;
		$scope.settings.importEnabledOnly = false;
		$scope.settings.upnNameFilter = '';
		$scope.settings.daily = false;
		$scope.settings.weekly = false;
		$scope.settings.nonrep = false;
		$scope.settings.date = moment();
		$scope.settings.keepDuration = 0;
		$scope.settings.keepCount = 0;

		usermanagementMainAdsConfigService.getLastConfig().then(function (lastConfig) {
			$scope.settings.addAdUser = lastConfig.ParameterList[0].Value === 'True';
			$scope.settings.syncAdUser = lastConfig.ParameterList[1].Value === 'True';
			$scope.settings.syncAdGroup = lastConfig.ParameterList[2].Value === 'True';
			$scope.settings.daily = (lastConfig.RepeatUnit === 3).toString();
			$scope.settings.daily = lastConfig.RepeatUnit === 4 ? 'weekly' : 'true';
			$scope.settings.daily = lastConfig.RepeatUnit === 0 ? 'nonrep' : lastConfig.RepeatUnit === 4 ? 'weekly' : 'true';
			$scope.settings.date = moment(lastConfig.StartTime);
		});

		usermanagementMainAdsConfigService.getLdapParametersList().then(function (parametersList) {
			if (parametersList.length === 1) {
				$scope.singleConfigVisible = true;
				$scope.multiConfigVisible = false;

				console.log('Single LDAP parameter found. Initializing configuration...');
				initializeSingleConfiguration(parametersList[0]);
				//saving will be handled from the OK btn (single configuration)
			} else if (parametersList.length > 1) {
				$scope.singleConfigVisible = false;
				$scope.multiConfigVisible = true;

				console.log('Multiple LDAP parameters found. Navigating to Customize module...');
				$scope.navigateToCustomizingModule = function () {
					navigateToCustomizingModule(parametersList);
				};
			} else {
				$scope.singleConfigVisible = true;
				$scope.multiConfigVisible = false;

				$scope.configMessage = "No configurations available.";
				initializeSingleConfiguration();
			}
		})

		var profileAdPaths;
		var authInfo;

		function initializeSingleConfiguration(parameters) {

			if(parameters === undefined) {
				parameters = {
					ldapUsersPath: '',
					ldapGroupsPath: '',
					ldapUsername: '',
					showPreValidation: false,
					useSecureConnection: false
				}
			}

			authInfo = {
				username: parameters.ldapUsername,
				password: '',
				useAuthentication: false
			};
			authInfo.useAuthentication = !((_.isNil(parameters.ldapUsername)) || (parameters.ldapUsername.length === 0));
			if (parameters.hasPassword === true) {
				authInfo.password = '';
			}

			profileAdPaths = {
				usersPath: parameters.ldapUsersPath,
				groupsPath: parameters.ldapGroupsPath
			};

			$scope.adSettings.adsPaths = _.cloneDeep(profileAdPaths);
			$scope.adSettings.authInfo = _.cloneDeep(authInfo);
			$scope.adSettings.showPreValidation = parameters.showPreValidation === 'true';
			$scope.adSettings.useSecureConnection = parameters.useSecureConnection;
		}

		function navigateToCustomizingModule(parametersList) {
			naviService.navigate({moduleName: 'basics.customize-userDirectory'});

			$modalInstance.close({cancel: true});
		}

		// on action handlers
		function onCancel() {
			$modalInstance.close({cancel: true});
		}

		function onOk() {
			var parameters = {
				ldapGroupsPath: $scope.adSettings.adsPaths.groupsPath,
				ldapUsersPath: $scope.adSettings.adsPaths.usersPath,
				ShowPreValidation: $scope.adSettings.showPreValidation === true ? 'true' : 'false',
				authenticationchanged: false,
				useSecureConnection: $scope.adSettings.useSecureConnection
			};
			// check authInfo changes
			if (!_.isEqual(authInfo, $scope.adSettings.authInfo)) {
				parameters.authenticationchanged = true;
				if ($scope.adSettings.authInfo.useAuthentication === true) {
					parameters.ldapUsername = $scope.adSettings.authInfo.username || '';
					parameters.ldapPassword = $scope.adSettings.authInfo.password || '';
					// validate input
					if (_.isEqual(parameters.ldapPassword, '') || _.isNil(parameters.ldapPassword) || _.isNil(parameters.ldapPassword) ||
						(parameters.ldapPassword.length === 0) || (parameters.ldapPassword.length === 0)) {

						platformModalService.showMsgBox('usermanagement.main.adsConfig.usernamepasswordErr', 'usermanagement.main.adsConfig.infoDialogHeader', 'info');
						return;
					}
				} else {
					parameters.ldapUsername = '';
					parameters.ldapPassword = '';
				}
			}

			usermanagementMainAdsConfigService.saveAdConfigurationComplete(profileAdPaths, parameters, settings);

			$modalInstance.close({cancel: true});
		}

		function onCanSetDateTime() {
			if (settings.activated === false) {
				return true;
			}
		}

		function onValidate() {
			const parameters = {
				ldapGroupsPath: $scope.adSettings.adsPaths.groupsPath,
				ldapUsersPath: $scope.adSettings.adsPaths.usersPath,
				ldapUsername: $scope.adSettings.authInfo.username || '',
				ldapPassword: $scope.adSettings.authInfo.password || '',
				useSecureConnection: $scope.adSettings.useSecureConnection
			};
			if ($scope.adSettings.authInfo.useAuthentication === false) {
				parameters.ldapUsername = undefined;
				parameters.ldapPassword = undefined;
			}
			usermanagementMainAdsConfigService.validateLdapPathsWithCredentials(parameters).then(function (response) {
				usermanagementMainAdsConfigService.errorDialog(response.data);
			});
		}
	}
})(angular);