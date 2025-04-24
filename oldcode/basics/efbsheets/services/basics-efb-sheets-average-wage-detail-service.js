/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';

	let moduleName = 'basics.efbsheets';
	/**
     * @ngdoc service
     * @name basicsEfbsheetsAverageWageDetailService
     * @function
     *
     * @description
     * efbsheetsAverageWageDetailService is the data service for Average wage related functionality.
     */
	angular.module(moduleName).factory('basicsEfbsheetsAverageWageDetailService', ['$q', '$injector', 'basicsEfbsheetsProjectMainService', 'basicsEfbsheetsMainService','basicsEfbsheetsProjectAverageWageService','basicsEfbsheetsAverageWageService','basicsEfbsheetsCommonService',
		function ($q, $injector,basicsEfbsheetsProjectMainService, basicsEfbsheetsMainService,basicsEfbsheetsProjectAverageWageService, basicsEfbsheetsAverageWageService,basicsEfbsheetsCommonService) {
			let service = {
				refreshData:refreshData,
				fieldChangeForMaster: fieldChangeForMaster,
				fieldChangeForProject:fieldChangeForProject
			};

			function refreshData(parentCrewMix, isProject) {
				if(isProject){
					if (parentCrewMix) {
						basicsEfbsheetsProjectMainService.markItemAsModified(parentCrewMix);

						// use this to refresh Crew Mix container when the Average wage is changed
						basicsEfbsheetsProjectMainService.fireItemModified();
					}

					angular.forEach(basicsEfbsheetsProjectAverageWageService.getList(), function (resItem) {
						basicsEfbsheetsProjectAverageWageService.markItemAsModified(resItem);
						basicsEfbsheetsProjectAverageWageService.fireItemModified(resItem);
					});

					// work around to display instantly sub-items cost total and other values after quantity has been updated.(the item is marked as modified then is refreshed)
					basicsEfbsheetsProjectAverageWageService.gridRefresh();
					basicsEfbsheetsProjectMainService.gridRefresh();
				}else{
					if(parentCrewMix){
						basicsEfbsheetsMainService.markItemAsModified(parentCrewMix);

						// use this to refresh Crew Mix container when the Average wage is changed
						basicsEfbsheetsMainService.fireItemModified();
					}

					angular.forEach(basicsEfbsheetsAverageWageService.getList(), function (resItem) {
						basicsEfbsheetsAverageWageService.markItemAsModified(resItem);
						basicsEfbsheetsAverageWageService.fireItemModified(resItem);
					});

					// work around to display instantly sub-items cost total and other values after quantity has been updated.(the item is marked as modified then is refreshed)
					basicsEfbsheetsAverageWageService.gridRefresh();
					basicsEfbsheetsMainService.gridRefresh();
				}
				$injector.get('basicsEfbsheetCrewmixAfDetailService').refreshData(null, isProject);
			}
			
			function fieldChangeForMaster(item, field) {
				let selectedCrewMix = basicsEfbsheetsMainService.getSelected();
				if(selectedCrewMix) {
					if(field === 'Count' || field === 'Supervisory' || field === 'MarkupRate' || field === 'MdcWageGroupFk') {
						basicsEfbsheetsCommonService.calculateCrewmixesAndChilds(selectedCrewMix,'AverageWage');
						basicsEfbsheetsCommonService.calculateCrewmixesAndChilds(selectedCrewMix,'CrewmixAF', true);
						basicsEfbsheetsCommonService.calculateCrewmixesAndChilds(selectedCrewMix,'CrewmixAFSN', true);
					}

					refreshData(selectedCrewMix,false);
				}
			}

			function fieldChangeForProject(item, field) {
				let selectedCrewMix = basicsEfbsheetsProjectMainService.getSelected();
				if(field === 'Count' || field === 'Supervisory' || field === 'MarkupRate' || field === 'MdcWageGroupFk') {
					basicsEfbsheetsCommonService.calculateCrewmixesAndChilds(selectedCrewMix, 'AverageWage');
					basicsEfbsheetsCommonService.calculateCrewmixesAndChilds(selectedCrewMix, 'CrewmixAF', true);
					basicsEfbsheetsCommonService.calculateCrewmixesAndChilds(selectedCrewMix, 'CrewmixAFSN', true);
				}

				refreshData(selectedCrewMix,true);
			}
			return service;
		}
	]);
})();