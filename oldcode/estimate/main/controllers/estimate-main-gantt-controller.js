/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

/**
 * @ngdoc controller
 * @name cloud.estimate.main.controller:estimateMainGanttController
 * @requires $scope, estimateMainGanttService
 * @description Controller for the {@link ganttDirective} directive. Provides data and configuration by specifing the data service to use
 */
angular.module('estimate.main').controller('estimateMainGanttController', ['$scope', 'estimateMainGanttService', function ($scope, ganttservice) {
	'use strict';
	$scope.chartService = ganttservice;
}]);
