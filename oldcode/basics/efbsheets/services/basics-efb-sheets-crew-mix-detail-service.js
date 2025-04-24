/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';

	let moduleName = 'basics.efbsheets';
	/**
     * @ngdoc service
     * @name basicsEfbsheetCrewmixDetailService
     * @function
     *
     * @description
     * basicsEfbsheetCrewmixDetailService is the data service for Crewmix related functionality.
     */
	angular.module(moduleName).factory('basicsEfbsheetCrewmixDetailService', ['$q', '$injector', 'basicsEfbsheetsMainService','basicsEfbsheetsProjectMainService','basicsEfbsheetsCommonService',
		function ($q, $injector, basicsEfbsheetsMainService,basicsEfbsheetsProjectMainService,basicsEfbsheetsCommonService) {
			let service = {
				fieldChange: fieldChange
			};

			function fieldChange(selectedCrewMix, field) {
				if(field === 'WagePIncrease1' || field === 'WagePIncrease2' || field === 'ExtraPay' || field === 'HourPIncrease1' || field === 'HourPIncrease2'){
					basicsEfbsheetsCommonService.calculateCrewmixesAndChilds(selectedCrewMix,'AverageWage');
					basicsEfbsheetsCommonService.calculateCrewmixesAndChilds(selectedCrewMix,'CrewmixAF', true);
					basicsEfbsheetsCommonService.calculateCrewmixesAndChilds(selectedCrewMix,'CrewmixAFSN', true);

					$injector.get('basicsEfbsheetsAverageWageDetailService').refreshData(selectedCrewMix, selectedCrewMix.ProjectFk);
				}
			}
			return service;
		}
	]);
})();