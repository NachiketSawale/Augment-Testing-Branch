/*
 * Created by aljami on 13.10.2021
 */

(function () {
	/* global globals */
	'use strict';

	/**
	 * @ngdoc directive
	 * @name basicsCustomizeCheckEmailDirective
	 *
	 * @description A control for checking email connection
	 */
	angular.module('basics.customize').directive('basicsCustomizeCheckEmailDirective',['$translate', '$timeout', 'basicsCustomizeEmailServerConfigurationService',
		function ($translate, $timeout, basicsCustomizeEmailServerConfigurationService) {
			return {
				restrict: 'A',
				scope: {
					entity: '=',
					model: '=',
					placeholderText: '@'
				},
				link: function ($scope, el, attrs){
					$scope.sendEmail = function (){

						$timeout(function (){
							let evalEntity= $scope.$eval(attrs.entity);
							basicsCustomizeEmailServerConfigurationService.testEmailConnection(evalEntity);
						}, 0);

					};
				},
				templateUrl: globals.appBaseUrl + 'basics.customize/partials/basics-customize-check-email.html'
			};
		}
	]);


})();
