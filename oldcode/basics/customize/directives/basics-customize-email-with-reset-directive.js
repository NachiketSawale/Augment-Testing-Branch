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
	angular.module('basics.customize').directive('basicsCustomizeEmailWithResetDirective',['$translate', '$timeout',
		function ($translate, $timeout) {
			return {
				scope: {
					entity: '=',
					model: '=',
					placeholderText: '@',
					btnTooltip: '@',
					getDefaultEmail: '&'
				},
				link: function ($scope, el, attr, opt){
					$scope.resetToDefault = function (){
						$timeout(function (){
							let evalEntity= $scope.$eval(attr.entity);
							evalEntity.SenderEmail = evalEntity.inheritedServer.SenderEmail;
							evalEntity.senderEmailChanged(evalEntity);
						}, 0);
					};

					$scope.$watch('entity.SenderEmail', function(newValue, oldValue) {
						if (newValue){
							$timeout(function (){
								let evalEntity= $scope.$eval(attr.entity);
								evalEntity.SenderEmail = newValue;
								evalEntity.senderEmailChanged(evalEntity);
							}, 0);
						}

					});
				},
				templateUrl: globals.appBaseUrl + 'basics.customize/partials/basics-customize-email-with-reset.html'
			};
		}
	]);


})();