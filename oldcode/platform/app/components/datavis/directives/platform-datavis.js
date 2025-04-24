/*
 * $Id: platform-datavis.js 467801 2017-11-13 12:55:59Z kh $
 * Copyright (c) RIB Software GmbH
 */

/* global d3 */
(function () {
	'use strict';

	/**
	 * @ngdoc directive
	 * @name platform.directive:platformDatavis
	 * @element div
	 * @restrict A
	 * @description A display for D3.js-based two-dimensional data visualization.
	 */
	angular.module('platform').directive('platformDatavis', ['platformDatavisService',
		function (platformDatavisService) {
			return {
				restrict: 'A',
				scope: {
					visWidth: '=',
					visHeight: '=',
					visLink: '='
				},
				link: function ($scope, elem) {
					elem.addClass('datavis');

					var visParent = d3.select(elem[0]).append('svg');

					var dataVis = platformDatavisService.createDataVisualization($scope.visLink, visParent);

					$scope.$watch('visWidth', function (newValue) {
						if ($scope.visWidth) {
							visParent.attr('width', newValue + 'px');
							if ($scope.visHeight) {
								dataVis.updateSize($scope.visWidth, $scope.visHeight);
							}
						}
					});
					$scope.$watch('visHeight', function (newValue) {
						if ($scope.visHeight) {
							visParent.attr('height', newValue + 'px');
							if ($scope.visWidth) {
								dataVis.updateSize($scope.visWidth, $scope.visHeight);
							}
						}
					});

					$scope.$on('$destroy', function () {
						dataVis.destroy();
					});
				}
			};
		}]);
})();