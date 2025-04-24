/**
 * Created by sprotte on 10.11.2016.
 */
/**
 * @ngdoc service
 * @name cloud.estimate.main.estimateMainGanttService
 * @function
 * @requires chartService
 *
 * @description Provides data and customization for the GANTT directive
 */

/* global Platform */
angular.module('estimate.main').factory('estimateMainGanttService', ['chartService', 'estimateMainService', function (chartService, lineitems) {
	'use strict';
	let service = Object.create(chartService, {});
	service.mainService = lineitems;
	service.entityStart = 'FromDate';
	service.entityEnd = 'ToDate';
	service.listLoaded = new Platform.Messenger();
	service.updateDone = new Platform.Messenger();
	service.mapping = {start: 'FromDate', end: 'ToDate'};

	return service;
}]);
