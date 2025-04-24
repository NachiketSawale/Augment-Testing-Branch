/**
 * Created by zov on 23/04/2019.
 */
(function () {
	/*global angular, _*/
	'use strict';

	var moduleName = 'productionplanning.common';
	angular.module(moduleName).factory('ppsTranslationUtilService', [
		function () {
			var service = {};
			var customizeModule = 'basics.customize';

			function addSequenceTranslation(data, moduleSubmodule, count, keyGetter, initialGetter) {
				if (!_.isNil(data)) {
					if (data.allUsedModules.indexOf(moduleSubmodule) < 0) {
						data.allUsedModules.push(moduleSubmodule);
					}
					if (_.isNil(data.words)) {
						data.words = {};
					}
					for (var i = 1; i <= count; i++) {
						data.words[keyGetter(i)] = {
							location: moduleSubmodule,
							identifier: _.camelCase(keyGetter(i)),
							initial: initialGetter(i)
						};
					}
				}
			}

			service.addLicCostGroupTranslation = function (data) {
				addSequenceTranslation(data, customizeModule, 5,
					function (idx) {
						return 'LicCostGroup' + idx + 'Fk';
					}, function (idx) {
						return '*CostGroup ' + idx;
					}
				);
			};
			service.addPrjCostGroupTranslation = function (data) {
				addSequenceTranslation(data, customizeModule, 5,
					function (idx) {
						return 'PrjCostGroup' + idx + 'Fk';
					}, function (idx) {
						return '*PrjCostGroup ' + idx;
					}
				);
			};

			return service;
		}
	]);
})();
