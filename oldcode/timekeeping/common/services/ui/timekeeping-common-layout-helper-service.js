/**
 * Created by baf on 28.05.2019
 */

(function (angular) {
	'use strict';
	var moduleName = 'timekeeping.common';

	/**
	 * @ngdoc service
	 * @name timekeepingCommonLayoutHelperService
	 * @description provides methods for easily building user interface layouts
	 */
	angular.module(moduleName).service('timekeepingCommonLayoutHelperService', TimekeepingCommonLayoutHelperService);

	TimekeepingCommonLayoutHelperService.$inject = ['basicsLookupdataConfigGenerator'];

	function TimekeepingCommonLayoutHelperService(basicsLookupdataConfigGenerator) {
		this.provideResourceSkillOverload = function provideResourceSkillOverload() {
			return basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
				dataServiceName: 'resourceCommonSkillLookupDataService',
				filter: function () {
					return -1;
				}
			});
		};
	}
})(angular);
