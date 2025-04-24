/* global angular */
(function () {
	'use strict';

	var moduleName = 'basics.workflow';

	function basicsWorkflowNavBarService(platformModuleStateService, basicsDocuService) {
		var service = {};

		service.getNavBarUtil = function (module, selectedEntity, entities, changeItemFn) {
			var util = {};
			var state = platformModuleStateService.state(module);

			function getIndexOfItem(item) {
				for (var i = 0; i < state[entities].length; i++) {
					if (state[entities][i].Id === item.Id) {
						return i;
					}
				}
				return 0;
			}

			function setCurrentByIndex(index) {

				index = index > state[entities].length - 1 ? state[entities].length - 1 : index;
				index = index < 0 ? 0 : index;

				if (changeItemFn) {
					changeItemFn(state[entities][index], state[selectedEntity]);
				} else {
					state[selectedEntity] = state[entities][index];
				}
			}

			util.goToPrevFolder = function () {
				setCurrentByIndex(getIndexOfItem(state[selectedEntity]) - 1);
			};

			util.goToNextFolder = function () {
				setCurrentByIndex(getIndexOfItem(state[selectedEntity]) + 1);
			};

			util.goToFirstFolder = function () {
				setCurrentByIndex(0);
			};
			util.goToLastFolder = function () {
				setCurrentByIndex(state[entities].length - 1);
			};

			util.showDocu = function () {
				basicsDocuService.showDocu(moduleName);
			};
			util.refreshSelection = function () {
				if (state[selectedEntity]) {
					setCurrentByIndex(getIndexOfItem(state[selectedEntity]));
				}

			};

			return util;
		};

		return service;
	}

	angular.module(moduleName).factory('basicsWorkflowNavBarService', ['platformModuleStateService', 'basicsDocuService', basicsWorkflowNavBarService]);
})();
