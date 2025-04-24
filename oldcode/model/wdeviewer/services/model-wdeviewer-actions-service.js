(function(angular){
	'use strict';

	var moduleName = 'model.wdeviewer';

	angular.module(moduleName).factory('modelWdeViewerActionsService', [
		function () {
			return {
				getActions: function () {
					return {
						showCamPos: function () {

						},
						setSelection: function () {

						},
						setTemporaryManipulationOperator: function () {

						},
						unsetTemporaryManipulationOperator: function () {

						},
						reload: function () {

						},
						initialize: function () {

						},
						getSelectabilityInfo: function () {
							return {};
						},
						getFilterEngine: function () {
							return null;
						},
						updateNumber: function () {

						},
						getCurrentCamPos: function () {
							return null;
						},
						getCuttingPlane: function () {
							return null;
						},
						takeSnapshot: function () {

						},
						setCuttingPlane: function () {

						},
						setCuttingActive: function () {

						},
						getCuttingActive: function () {

						},
						setCuttingInactive: function () {

						}
					};
				}
			};
		}
	]);

})(angular);