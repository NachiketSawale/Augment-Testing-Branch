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
	angular.module('basics.customize').directive('basicsCustomizeSelectWithResetDirective',['$translate', '$timeout',
		function ($translate, $timeout) {
			return {
				scope: {
					entity: '=',
					model: '=',
					options: '=',
					btnTooltip: '@'
				},
				link: function ($scope, el, attrs, other){
					$scope.resetToDefault = function (){
						$timeout(function (){
							let evalEntity= $scope.$eval(attrs.entity);
							evalEntity.ServerId = evalEntity.inheritedServer.Id;
							evalEntity.serverSelectionChanged(evalEntity);
						}, 0);
					};

					$scope.$watch('entity.ServerId', function(newValue, oldValue) {
						if (newValue){
							$timeout(function (){
								let evalEntity= $scope.$eval(attrs.entity);
								evalEntity.ServerId = newValue;
								evalEntity.serverSelectionChanged(evalEntity);
							}, 0);
						}

					});
				},
				templateUrl: globals.appBaseUrl + 'basics.customize/partials/basics-customize-select-with-reset.html'
			};
		}
	]);


})();