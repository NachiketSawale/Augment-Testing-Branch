/**
 * Created by Frank on 30.07.2015.
 */
(function (angular) {

	'use strict';
	/**
	 * @ngdoc self
	 * @name platformDataValidationService
	 * @function
	 *
	 * @description
	 * The platformDataValidationService provides common validation functions required by different modules
	 */

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module('platform').service('platformLayoutByDataService', PlatformLayoutByDataService);

	PlatformLayoutByDataService.$inject = ['$cacheFactory', '_'];

	function PlatformLayoutByDataService($cacheFactory, _) {
		var cache = $cacheFactory('platformLayoutByDataServiceCache');

		this.registerLayout = function registerLayout(layoutService, dataService) {
			if (dataService.getServiceName) {
				var servName = dataService.getServiceName();
				if (cache.get(servName) !== layoutService) {
					cache.put(servName, layoutService);
				}
			}
		};

		function changeVisibilityOfGroupsAndRows(standardConf) {
			if (!_.isEmpty(standardConf.rows) && !_.isEmpty(standardConf.groups)) {
				_.each(standardConf.rows, function changeVisibilityOfRows(row) {
					row.visible = true;
				});

				_.each(standardConf.groups, function changeVisibilityOfGroupsAndRows(group) {
					group.visible = true;
					_.each(group.rows, function changeVisibilityOfGroupsAndRows(row) {
						row.visible = true;
					});
				});
			}
		}

		this.provideLayoutFor = function provideLayoutFor(dataService) {
			var standardConf;
			if (dataService.getServiceName) {
				var servName = dataService.getServiceName();
				var layoutService = cache.get(servName);
				if (layoutService && layoutService.getStandardConfigForDetailView) {
					standardConf = _.cloneDeep(layoutService.getStandardConfigForDetailView());
					changeVisibilityOfGroupsAndRows(standardConf);
				}
				return standardConf;
			}

		};
	}
})(angular);