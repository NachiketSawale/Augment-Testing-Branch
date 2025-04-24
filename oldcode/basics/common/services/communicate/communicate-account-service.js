(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name basicsCommonCommunicateAccountService
	 * @function
	 * @requires []
	 *
	 * @description
	 * #
	 * data service for communicate email/fax dialog group 'Email/Fax Account'.
	 */
	/* jshint -W072 */
	angular.module('basics.common').factory('basicsCommonCommunicateAccountService', ['PlatformMessenger',
		function (PlatformMessenger) {
			const service = {
				userName: null,
				password: null
			};

			/**
			 * used to enable or disable send button
			 */
			service.getBtnSendStatus = function getBtnSendStatus() {
				return (!!service.userName) && (!!service.password);
			};

			service.setUserName = function setUserName(userName) {
				service.userName = userName;
				service.userNameChanged.fire(null, userName);
			};

			service.userNameChanged = new PlatformMessenger();

			return service;
		}
	]);
})(angular);