/**
 * Created by luo on 1/4/2016.
 */
(function (angular) {
	'use strict';

	const moduleName = 'basics.common';

	angular.module(moduleName).value('basicsCommonCommunicateAccountFormConfig',
		{
			fid: 'basics.common.communicate.account',
			version: '1.1.0',
			showGrouping: false,
			groups: [
				{
					gid: 1,
					isOpen: true,
					visible: true,
					sortOrder: 1
				}
			],
			rows: [
				{
					rid: 1,
					gid: 1,
					label: 'Username',
					label$tr$: 'platform.loginUsername',
					type: 'email',
					model: 'userName',
					required: true
				},
				{
					rid: 2,
					gid: 1,
					label: 'Password',
					label$tr$: 'platform.loginPassword',
					type: 'password',
					model: 'password',
					required: true
				}
			]
		}
	);

	/**
	 * @ngdoc controller
	 * @name basicsCommonCommunicateAccountController
	 * @requires $scope
	 * @description
	 * #
	 * Controller for communicate email/fax dialog group 'Email/Fax Account'.
	 */
	angular.module(moduleName).controller('basicsCommonCommunicateAccountController', [
		'$scope', 'basicsCommonCommunicateAccountFormConfig', 'basicsCommonCommunicateAccountService', 'platformTranslateService', 'platformUserInfoService',
		function ($scope, formConfig, dataService, platformTranslateService, platformUserInfoService) {

			platformTranslateService.translateFormConfig(formConfig);

			$scope.data = {};

			$scope.sender = {
				userName: dataService.userName ? dataService.userName : platformUserInfoService.getCurrentUserInfo().Email,
				password: null
			};

			$scope.formContainerOptions = {
				formOptions: {
					configure: formConfig
				}
			};

			dataService.userNameChanged.register(onUserNameChanged);

			const watchUnregister = $scope.$watchGroup(['sender.userName', 'sender.password'], function (newValues) {
				dataService.userName = newValues[0];
				dataService.password = newValues[1];
			});

			$scope.$on('$destroy', function () {
				if (watchUnregister) {
					watchUnregister();
				}

				dataService.userNameChanged.unregister(onUserNameChanged);
				dataService.userName = null;
			});

			// /////////////////////
			function onUserNameChanged(e, userName) {
				if (!userName) {
					dataService.userName = platformUserInfoService.getCurrentUserInfo().Email;
				}
				$scope.sender.userName = userName ? userName : platformUserInfoService.getCurrentUserInfo().Email;
			}
		}
	]);
})(angular);
