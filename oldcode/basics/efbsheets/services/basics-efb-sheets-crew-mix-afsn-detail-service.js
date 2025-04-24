/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';

	let moduleName = 'basics.efbsheets';
	/**
     * @ngdoc service
     * @name basicsEfbsheetCrewmixAfsnDetailService
     * @function
     *
     * @description
     * basicsEfbsheetCrewmixAfsnDetailService is the data service for Crewmix AFsn related functionality.
     */
	angular.module(moduleName).factory('basicsEfbsheetCrewmixAfsnDetailService', ['$q', '$injector', 'basicsEfbsheetsProjectMainService','basicsEfbsheetsMainService','basicsEfbsheetsProjectCrewMixAfsnService','basicsEfbsheetsCrewMixAfsnService','basicsEfbsheetsCommonService',
		function ($q, $injector,basicsEfbsheetsProjectMainService, basicsEfbsheetsMainService,basicsEfbsheetsProjectCrewMixAfsnService ,basicsEfbsheetsCrewMixAfsnService,basicsEfbsheetsCommonService) {
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

					angular.forEach(basicsEfbsheetsProjectCrewMixAfsnService.getList(), function (resItem) {
						basicsEfbsheetsProjectCrewMixAfsnService.markItemAsModified(resItem);
						basicsEfbsheetsProjectCrewMixAfsnService.fireItemModified(resItem);
					});

					// work around to display instantly sub-items cost total and other values after quantity has been updated.(the item is marked as modified then is refreshed)
					basicsEfbsheetsProjectCrewMixAfsnService.gridRefresh();
					basicsEfbsheetsProjectMainService.gridRefresh();
				}else{
					if (parentCrewMix) {
						basicsEfbsheetsMainService.markItemAsModified(parentCrewMix);

						// use this to refresh Crew Mix container when the Average wage is changed
						basicsEfbsheetsMainService.fireItemModified();
					}

					angular.forEach(basicsEfbsheetsCrewMixAfsnService.getList(), function (resItem) {
						basicsEfbsheetsCrewMixAfsnService.markItemAsModified(resItem);
						basicsEfbsheetsCrewMixAfsnService.fireItemModified(resItem);
					});

					// work around to display instantly sub-items cost total and other values after quantity has been updated.(the item is marked as modified then is refreshed)
					basicsEfbsheetsCrewMixAfsnService.gridRefresh();
					basicsEfbsheetsMainService.gridRefresh();
				}
			}

			function fieldChangeForMaster(item, field) {
				let selectedCrewMix = basicsEfbsheetsMainService.getSelected();
				if (selectedCrewMix) {
					if (selectedCrewMix.AverageStandardWage && selectedCrewMix.AverageStandardWage >= 0 && selectedCrewMix.CrewMixAf && selectedCrewMix.CrewMixAf >= 0) {
						if(field === 'MarkupRate' || field === 'MdcWageGroupFk'){
							item.RateHour = selectedCrewMix.CrewMixAf * (item.MarkupRate / 100);
						}
						else if(field === 'RateHour') {
							item.MarkupRate = (item.RateHour / selectedCrewMix.CrewMixAf ) * 100 ;
						}

						basicsEfbsheetsCrewMixAfsnService.markItemAsModified(item);
						if (field === 'MarkupRate' || field === 'RateHour' || field === 'MdcWageGroupFk') {
							basicsEfbsheetsCommonService.calculateCrewmixesAndChilds(selectedCrewMix, 'CrewmixAFSN');
						}
						refreshData(selectedCrewMix, false);
					}
				}
			}

			function fieldChangeForProject(item, field) {
				let selectedCrewMix = basicsEfbsheetsProjectMainService.getSelected();
				if(selectedCrewMix.AverageStandardWage && selectedCrewMix.AverageStandardWage >=0  && selectedCrewMix.CrewMixAf &&  selectedCrewMix.CrewMixAf >=0){
					if(field === 'MarkupRate' || field === 'MdcWageGroupFk'){
						item.RateHour = selectedCrewMix.CrewMixAf * (item.MarkupRate / 100);
					}
					else if (field === 'RateHour') {
						item.MarkupRate = (item.RateHour / selectedCrewMix.CrewMixAf ) * 100 ;
					}

					basicsEfbsheetsProjectCrewMixAfsnService.markItemAsModified(item);
					if (field === 'MarkupRate' || field === 'RateHour' || field === 'MdcWageGroupFk') {
						basicsEfbsheetsCommonService.calculateCrewmixesAndChilds(selectedCrewMix,'CrewmixAFSN');
					}
				}
				refreshData(selectedCrewMix,true);
			}

			return service;
		}
	]);
})();