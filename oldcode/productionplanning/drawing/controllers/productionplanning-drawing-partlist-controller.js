/**
 * Created by zov on 28/04/2019.
 */
(function () {
	/*global angular*/
	'use strict';

	var moduleName = 'productionplanning.drawing';
	angular.module(moduleName).controller('productionplanningDrawingPartListController', [
		'$scope',
		'productionplanningDrawingMainService',
		'ppsDrawingPartListInitControllerService',
		function ($scope,
				  drawingMainSrv,
				  drawingPartListInitCtrlSrv) {
			drawingPartListInitCtrlSrv.initController($scope, drawingMainSrv);
		}
	]);
})();