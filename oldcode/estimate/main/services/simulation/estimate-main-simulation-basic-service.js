/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';

	/**
	 * @ngdoc service
	 * @name estimate.main.estimateMainSimulationBasicService
	 * @function
	 * @requires _, modelSimulationMasterService
	 *
	 * @description
	 */
	angular.module('estimate.main').factory('estimateMainSimulationBasicService', ['_', 'modelSimulationMasterService',
		function (_, modelSimulationMasterService) {
			let controllerUsages = {
				costs: false,
				hours: false,
			};

			let state = {
				currentTotalCost: 0,
				currentTotalCostSum: 0,
				currentTotalHours: 0,
				currentTotalHoursSum: 0
			};

			let ep = {
				id: 'estimate.main.lineitem.basic',
				begin: function (ev) {
					state.currentTotalCost += ev.data.costTotal;
					state.currentTotalHours += ev.data.hoursTotal;
				},
				invertBegin: function (ev) {
					state.currentTotalCost -= ev.data.costTotal;
					state.currentTotalHours -= ev.data.hoursTotal;
				},
				end: function (ev) {
					state.currentTotalCost -= ev.data.costTotal;
					state.currentTotalCostSum += ev.data.costTotal;

					state.currentTotalHours -= ev.data.hoursTotal;
					state.currentTotalHoursSum += ev.data.hoursTotal;
				},
				invertEnd: function (ev) {
					state.currentTotalCost += ev.data.costTotal;
					state.currentTotalCostSum -= ev.data.costTotal;

					state.currentTotalHours += ev.data.hoursTotal;
					state.currentTotalHoursSum -= ev.data.hoursTotal;
				},
				getFinalSnapshot: function (evtIterator, global) {
					return {
						currentTotalCost: 0,
						currentTotalCostSum: global.finalCostTotalSum,
						currentTotalHours: 0,
						currentTotalHoursSum: global.finalHoursTotalSum
					};
				},
				applySnapshot: function (snapshot) {
					_.assign(state, snapshot);
				},
				getContextOptions: function () {
					let res = {};
					if(controllerUsages.costs || controllerUsages.hours) {
						res.estimateHoursAndCost = 1;
					}

					return res;
				}
			};

			modelSimulationMasterService.registerEventProcessor(ep);

			let service = {};

			/**
			 * @ngdoc function
			 * @name getCurrentTotalCost
			 * @function
			 * @methodOf estimateMainSimulationBasicService
			 * @description Retrieves the current total cost.
			 * @returns {Number} The total cost in the current simulation state.
			 */
			service.getCurrentTotalCost = function () {
				return state.currentTotalCost;
			};

			service.useChartController = function useChartController(option) {
				if(_.has(option, 'costs')) {
					controllerUsages.costs = option.costs;
				}
				if(_.has(option, 'hours')) {
					controllerUsages.hours = option.hours;
				}
			};

			/**
			 * @ngdoc function
			 * @name getCurrentTotalCostSum
			 * @function
			 * @methodOf estimateMainSimulationBasicService
			 * @description Retrieves the sum of the total cost during the current run of the simulation until the
			 *              currently simulated time..
			 * @returns {Number} The total cost sum in the current simulation state.
			 */
			service.getCurrentTotalCostSum = function () {
				return state.currentTotalCostSum;
			};

			/**
			 * @ngdoc function
			 * @name getCurrentTotalHours
			 * @function
			 * @methodOf estimateMainSimulationBasicService
			 * @description Retrieves the current total working hours.
			 * @returns {Number} The total working hours in the current simulation state.
			 */
			service.getCurrentTotalHours = function () {
				return state.currentTotalHours;
			};

			/**
			 * @ngdoc function
			 * @name getCurrentTotalHoursSum
			 * @function
			 * @methodOf estimateMainSimulationBasicService
			 * @description Retrieves the sum of the total working hours during the current run of the simulation until
			 *              the currently simulated time..
			 * @returns {Number} The total working hours sum in the current simulation state.
			 */
			service.getCurrentTotalHoursSum = function () {
				return state.currentTotalHoursSum;
			};

			return service;
		}]);
})();
