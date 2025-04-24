/**
 * Created by rei on 22.01.2018.
 */
/* globals app */

(function () {
	'use strict';

	var initChangePasswordController = function ($log, $scope, tokenAuthentication, globals, _, platformContextService, platformTranslateService, $timeout, logonService, platformUserInfoService, platformLogonService) {

		$scope.modalOptions = {
			cancel: function () {
				$scope.onDefaultClose();
			}
		};
		$scope.path = globals.appBaseUrl;

		$scope.loginOptions = {
			loading: true,
			loadingInfo: '',
			errorInfo: ''
		};

		$scope.version = app.productBuildVersion;
		$scope.productName = app.productName;
		$scope.productLogoPrimary = app.productLogoPrimary;

		$scope.loginData = {
			username: null,
			logonname: null,
			oldpassword: null,
			newpassword: null,
			confirmpassword: null
		};

		if (!platformUserInfoService.isUserValid()) {
			navigateToLogon();
		}

		// read password rule from server and sets the hint for the UI
		platformLogonService.loadPasswordRules().then(function (response) {
			$scope.passwordHint = response.hint;
			$scope.instructionLoaded = true;
		});

		// read user data from server
		platformUserInfoService.getUserInfoPromise().then(function (userinfo) {
			console.log(userinfo);
			$scope.loginOptions.loading = false;
			$scope.loginData.username = userinfo.UserName;
			$scope.loginData.logonname = userinfo.LogonName;
			if (!userinfo.ExplicitAccess) {
				_.noop();
				// error message password change not allowed
			}
			$scope.showExtendedInfo = userinfo.LogonName.includes('@') && userinfo.IntegratedAccess;

		});

		// object holding translated strings
		$scope.text = {};
		$scope.passwordHintFromServer = '';
		$scope.instructionLoaded = false;

		// loads or updates translated strings
		var loadTranslations = function () {
			// $log.debug('loadTranslations called', logonService.getUiLanguages());
			// load translation of tile-group definition
			$scope.text = platformTranslateService.instant({
				platform: [
					'loginUsername', 'loginLogonName', 'newLoginPassword', 'oldLoginPassword', 'confirmLoginPassword',
					'newLoginEnterPassword', 'oldLoginEnterPassword', 'confirmLoginEnterPassword',
					'changePwdBtn', 'backButton', 'backButtonNavInfo',
					'changechangedinfo', 'changenotchangedinfo', 'changepasswordinfo', 'changepasswordchangedprocess',
					'navToCompanyPage', 'navToLogonPage', 'changePasswordHeaderText', 'changePasswordInstruction', 'changePasswordInfoIntegrated'
				]
			});

			$scope.modalOptions.headerText = $scope.text.platform.changePasswordHeaderText;
			$scope.instructionText = $scope.text.platform.changePasswordInstruction;
		};

		// register translation changed event
		platformTranslateService.translationChanged.register(loadTranslations);

		// register a module - translation table will be reloaded if module isn't available yet
		if (!platformTranslateService.registerModule('app')) {
			// if translation is already available, call loadTranslation directly
			loadTranslations();
		}

		/**
		 * method canChangePassword()
		 * @returns {boolean}
		 */
		$scope.canChangePassword = function () {

			var ret = platformLogonService.passwordValidation(
				$scope.loginOptions.username,
				$scope.loginOptions.oldpassword,
				$scope.loginOptions.newpassword,
				$scope.loginOptions.confirmpassword);

			return ret !== null;
		};

		/**
		 * called when Back Button is called
		 */
		$scope.onBackBtn = function back() {

			function reloadLoginPage() {
				app.reloadLoginPage(true);
			}

			// $scope.loginOptions.loading = true;

			tokenAuthentication.clearToken();  // if already logged in we first logout.

			$scope.loginOptions.loadingInfo = $scope.text.platform.backButtonNavInfo;
			// refresh dialogOptions first...
			$timeout(reloadLoginPage(), 500);
		};

		/*
         called when Login Button is pressed, or Enter Key
         */
		$scope.onChangeBtn = function () {
			// $log.info('Logon triggered ');
			var errMsg;
			errMsg = platformLogonService.passwordValidation($scope.loginData.username, $scope.loginData.oldpassword, $scope.loginData.newpassword, $scope.loginData.confirmpassword);

			if (errMsg === null) {
				$scope.feedback = {
					show: true,
					message: $scope.text.platform.changepasswordchangedprocess,
					alertClass: 'alert-info'
				};
				$scope.loginOptions.loading = true;

				platformLogonService.changeLogonPassword($scope.loginData.logonname, $scope.loginData.oldpassword, $scope.loginData.newpassword)
					.then(function ok(result) {
						$scope.loginOptions.loading = false;
						if (result.Exception) {
							$scope.feedback = {
								show: true,
								message: result.ErrorMessage,
								alertClass: 'alert-info'
							};
						} else {
							$scope.feedback = {
								show: true,
								message: $scope.text.platform.changechangedinfo,
								alertClass: 'alert-info'
							};
							$scope.onChangeSuccess();
						}
					});
			} else {
				$scope.feedback = {
					show: true,
					message: errMsg,
					alertClass: 'alert-danger'
				};
			}
		};

		/**
		 *
		 */
		function navigateToLogon() {
			$scope.loginOptions.loading = true;
			if ($scope.text && $scope.text.platform) {
				$scope.loginOptions.loadingInfo = $scope.text.platform.navToLogonPage;
			}

			// refresh dialogOptions first...
			$timeout(app.navigateToLoginPage, 1500);
		}

		/**
		 *
		 */

		// un-register on destroy
		$scope.$on('$destroy', function () {
			platformTranslateService.translationChanged.unregister(loadTranslations);
		});
	};

	/**
	 @ngdoc controller
	 * @name platformChangePasswordDialogController
	 * @function
	 *
	 * @description
	 * Controller for Login dialog.
	 */
	angular.module('platform').controller('platformChangePasswordDialogController',
		['$log', '$scope', '$modalInstance', 'tokenAuthentication', 'globals', '_', 'platformContextService', 'platformTranslateService', '$timeout', 'platformLogonService', 'platformUserInfoService', 'platformLogonService',
			function platformChangePasswordDialogController($log, $scope, $modalInstance, tokenAuthentication, globals, _, platformContextService,
				platformTranslateService, $timeout, logonService, platformUserInfoService, platformLogonService) { // jshint ignore:line

				initChangePasswordController($log, $scope, tokenAuthentication, globals, _, platformContextService,
					platformTranslateService, $timeout, logonService, platformUserInfoService, platformLogonService);

				var cancelFn = function () {
					if ($modalInstance) {
						$modalInstance.dismiss('cancel'); // only closes the dialog, but leaves the backdrop
					}
				};

				$scope.onCancelBtn = cancelFn;
				$scope.onDefaultClose = cancelFn;

				$scope.onChangeSuccess = function () {
					$timeout($scope.onCancelBtn, 1500);
				};
			}
		]);

	angular.module('platform').controller('platformChangePasswordPageController',
		['$log', '$scope', 'tokenAuthentication', 'globals', '_', 'platformContextService', 'platformTranslateService', '$timeout', 'platformLogonService', 'platformUserInfoService', 'platformLogonService',
			function platformChangePasswordDialogController($log, $scope, tokenAuthentication, globals, _, platformContextService,
				platformTranslateService, $timeout, logonService, platformUserInfoService, platformLogonService) { // jshint ignore:line

				initChangePasswordController($log, $scope, tokenAuthentication, globals, _, platformContextService,
					platformTranslateService, $timeout, logonService, platformUserInfoService, platformLogonService);

				$scope.onChangeSuccess = function () {
					navigateToCompany();
				};

				function navigateToCompany() {
					$scope.loginOptions.loading = true;

					if ($scope.text && $scope.text.platform) {
						$scope.loginOptions.loadingInfo = $scope.text.platform.navToCompanyPage;
					}

					// refresh dialogOptions first...
					$timeout(app.navigateToCompany, 1500);
				}
			}
		]);
})();
