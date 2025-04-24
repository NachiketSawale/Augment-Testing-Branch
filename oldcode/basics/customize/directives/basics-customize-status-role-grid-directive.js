/**
 * Created by baf on 2015/10/28
 */

(function () {

	/*global angular*/
	'use strict';

	/**
	 * @ngdoc directive
	 * @name basicsCustomizeStatusRoleGridDirective
	 * @requires
	 * @description
	 */
	angular.module('basics.customize').directive('basicsCustomizeStatusRoleGridDirective', function () {

		return {
			restrict: 'A',

			scope: {
				ngModel: '='
			},
			templateUrl: window.location.pathname + '/basics.customize/templates/basics-customize-status-role.html',
			link: function (/*scope, ele, attrs*/) {
			}
		};

	});

})();
