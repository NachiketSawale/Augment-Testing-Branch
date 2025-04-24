/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

// This file uses D3 v4.
(function () {
	'use strict';

	/**
	 * @ngdoc directive
	 * @name model.map.directive:modelMapMinimap
	 * @element div
	 * @restrict A
	 * @description Displays a minimap linked to a HOOPS 3D viewer.
	 */
	angular.module('model.map').directive('modelMapMinimap', ['modelMapMinimapService', 'd3',
		function (modelMapMinimapService, d3) {
			return {
				restrict: 'A',
				scope: {
					minimap: '='
				},
				link: function ($scope, elem) {
					var elemSel = d3.select(elem[0]).classed('minimap', true);
					var minimap = new modelMapMinimapService.Minimap(elemSel);
					$scope.minimap = function getMinimapInstance() {
						return minimap;
					};
					minimap.setSize($scope.$parent.bimUiSettings.miniMapWidth, $scope.$parent.bimUiSettings.miniMapHeight);
					minimap.resize = function (width, height) {
						minimap.setSize(width, height);
					};
				}
			};
		}]);
})();