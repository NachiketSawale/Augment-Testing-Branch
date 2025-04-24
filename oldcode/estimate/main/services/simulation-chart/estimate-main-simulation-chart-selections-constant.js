(function () {

	'use strict';

	let moduleName = 'estimate.main';

	/**
	 * @ngdoc constant
	 * @name estimateMainSimulationChartSelectionsConstant
	 * @function
	 *
	 * @description
	 * estimateMainSimulationChartSelectionsConstant are the possible selections for Resource Column Selection in the Simulation Chart's setttings dialog
	 */
	angular.module(moduleName).constant('estimateMainSimulationChartSelectionsConstant',
		[
			{curveType: 'budget', text:'Budget', text$tr$:'estimate.main.budget', value : 1, default : false},
			{curveType: 'hours', text:'Hours Total', text$tr$:'estimate.main.hoursTotal', value : 2, default : false},
			{curveType: 'cost', text:'Cost Total', text$tr$:'estimate.main.costTotal', value : 3, default : true}
		]);
})();
