/**
 * Created by Nitsche on 17/09/2018.
 */

(function () {

	'use strict';

	let moduleName = 'estimate.main';

	/**
	 * @ngdoc service
	 * @name estimateChartDialog2SimulationCurveDto
	 * @function
	 *
	 * @description
	 * estimateChartDialog2SimulationCurveDto is the service for transforming the simulation chart settings data into server request data object EstCostCodeSimulationCurveDto Collection.
	 */
	angular.module(moduleName).factory('estimateChartDialog2SimulationCurveDto',
		['_',
			function (_) {
				let service = {};

				let determinCostCodeCalculationSettings = function determinCostCodeCalculationSettings (dataSelectionsItem, costCodeCalculationSettings) {
					_.forEach(dataSelectionsItem, function (item) {
						if (item.Add || item.Subtract) {
							costCodeCalculationSettings.push({
								Id : item.Id,
								Add: item.Add,
								Subtract:item.Subtract
							});
						}
						determinCostCodeCalculationSettings(item.Children, costCodeCalculationSettings);
					});
				};

				let getCostCodeCalculationSettingsDto = function getCostCodeCalculationSettingsDto(dataSelection){
					let  costCodeCalculationSettings = [];
					determinCostCodeCalculationSettings(dataSelection,costCodeCalculationSettings);
					return costCodeCalculationSettings;
				};

				let getSimulationCurveDto = function getSimulationCuveDto(curveSettingsItem, defaultTimelineRequest){
					return {
						CurveId : curveSettingsItem.Id,
						CurveName: curveSettingsItem.getFullCurveName(),
						Color: curveSettingsItem.Color,
						CostCodeCalculationSettings: getCostCodeCalculationSettingsDto(curveSettingsItem.dataSelection),
						CalculationField: curveSettingsItem.calcSettings.selection,
						TimelineRequest: curveSettingsItem.timelineRequest !== null ? curveSettingsItem.timelineRequest : defaultTimelineRequest
					};
				};

				let isSimulationCurveDtoEmpty = function isSimulationCurveDtoEmpty(simulationCurveDto){
					if (_.isEmpty(simulationCurveDto.CostCodeCalculationSettings)){
						return true;
					}
					else {
						return false;
					}
				};

				let getSimulationCurveDtos = function getSimulationCurveDtos(settingsDataOrCurveSettingsItems, defaultTimelineRequest){
					let curveSettingsItems = null;
					if (settingsDataOrCurveSettingsItems.value !== undefined && settingsDataOrCurveSettingsItems.value.items !== undefined){
						curveSettingsItems = settingsDataOrCurveSettingsItems.value.items;
					}
					else{
						curveSettingsItems = settingsDataOrCurveSettingsItems;
					}
					let costCurveDtos = [];
					_.forEach(curveSettingsItems, function (curveSettingsItem) {
						let simulationCurveDto = getSimulationCurveDto(curveSettingsItem, defaultTimelineRequest);
						if (!isSimulationCurveDtoEmpty(simulationCurveDto)){
							costCurveDtos.push(simulationCurveDto);
						}
					});
					return costCurveDtos;
				};

				service.getSimulationCurveDtos = getSimulationCurveDtos;
				return service;
			}
		]
	);
})();
