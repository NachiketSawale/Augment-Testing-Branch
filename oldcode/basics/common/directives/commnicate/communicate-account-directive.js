/**
 * Created by luo on 1/8/2016.
 */
(function (angular) {
	'use strict';

	/**
	 * @ngdoc directive
	 * @name basicsCommonCommunicateAccountDirective
	 * @element div
	 * @restrict A
	 * @description
	 * #
	 * a directive for communicate email/fax dialog group 'Email/Fax Account'.
	 */
	angular.module('basics.common').directive('basicsCommonCommunicateAccountDirective', ['globals',
		function (globals) {
			return {
				restrict: 'A',
				templateUrl: globals.appBaseUrl + 'basics.common/partials/communicate-account.html',
				controller: 'basicsCommonCommunicateAccountController'
			};
		}
	]);

})(angular);
