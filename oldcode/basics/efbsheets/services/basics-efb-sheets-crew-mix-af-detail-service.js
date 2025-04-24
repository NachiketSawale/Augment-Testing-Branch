/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';

	let moduleName = 'basics.efbsheets';
	/**
     * @ngdoc service
     * @name basicsEfbsheetCrewmixAfDetailService
     * @function
     *
     * @description
     * basicsEfbsheetCrewmixAfDetailService is the data service for Crewmix AF related functionality.
     */
	angular.module(moduleName).factory('basicsEfbsheetCrewmixAfDetailService', ['$q', '$injector','basicsEfbsheetsProjectMainService', 'basicsEfbsheetsMainService', 'basicsEfbsheetsProjectCrewMixAfService','basicsEfbsheetsCrewMixAfService','basicsEfbsheetsCommonService',
		function ($q, $injector,basicsEfbsheetsProjectMainService,basicsEfbsheetsMainService,basicsEfbsheetsProjectCrewMixAfService,basicsEfbsheetsCrewMixAfService, basicsEfbsheetsCommonService) {
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

					angular.forEach(basicsEfbsheetsProjectCrewMixAfService.getList(), function (resItem) {
						basicsEfbsheetsProjectCrewMixAfService.markItemAsModified(resItem);
						basicsEfbsheetsProjectCrewMixAfService.fireItemModified(resItem);
					});

					// work around to display instantly sub-items cost total and other values after quantity has been updated.(the item is marked as modified then is refreshed)
					basicsEfbsheetsProjectCrewMixAfService.gridRefresh();
					basicsEfbsheetsProjectMainService.gridRefresh();
				}else{
					if(parentCrewMix){
						basicsEfbsheetsMainService.markItemAsModified(parentCrewMix);

						// use this to refresh Crew Mix container when the Average wage is changed
						basicsEfbsheetsMainService.fireItemModified();
						basicsEfbsheetsMainService.gridRefresh();
					}

					angular.forEach(basicsEfbsheetsCrewMixAfService.getList(), function (resItem) {
						basicsEfbsheetsCrewMixAfService.markItemAsModified(resItem);
						basicsEfbsheetsCrewMixAfService.fireItemModified(resItem);
					});

					// work around to display instantly sub-items cost total and other values after quantity has been updated.(the item is marked as modified then is refreshed)
					basicsEfbsheetsCrewMixAfService.gridRefresh();
				}
				$injector.get('basicsEfbsheetCrewmixAfsnDetailService').refreshData(null, isProject);
			}

			function fieldChangeForMaster(item, field) {
				let selectedCrewMix = basicsEfbsheetsMainService.getSelected();
				if(selectedCrewMix){
					selectedCrewMix.AverageStandardWage = _.isNumber(selectedCrewMix.AverageStandardWage) ? selectedCrewMix.AverageStandardWage : 0;

					if(field === 'PercentHour' || field === 'MarkupRate' || field === 'MdcWageGroupFk'){
						if (item.MarkupRate && selectedCrewMix.AverageStandardWage && item.PercentHour) {//todo check condition
							item.RateHour = selectedCrewMix.AverageStandardWage * (item.MarkupRate / 100) * (item.PercentHour / 100);
							//crewmixAfItem.RateHour = ((crewMixItem.AverageStandardWage * crewmixAfItem.MarkupRate * crewmixAfItem.PercentHour) / 10000);
						}
					} else if(field === 'RateHour'){
						item.MarkupRate = 0;
						item.PercentHour = 0;
					}

					basicsEfbsheetsCrewMixAfService.markItemAsModified(item);
					if(field === 'PercentHour' || field === 'MarkupRate' || field === 'RateHour' || field === 'MdcWageGroupFk'){
						basicsEfbsheetsCommonService.calculateCrewmixesAndChilds(selectedCrewMix,'CrewmixAF');
						basicsEfbsheetsCommonService.calculateCrewmixesAndChilds(selectedCrewMix,'CrewmixAFSN', true);
					}
					refreshData(selectedCrewMix,false);
				}
			}

			function fieldChangeForProject(item, field) {
				let selectedCrewMix = basicsEfbsheetsProjectMainService.getSelected();
				if(selectedCrewMix){
					selectedCrewMix.AverageStandardWage = _.isNumber(selectedCrewMix.AverageStandardWage) ? selectedCrewMix.AverageStandardWage : 0;

					if(field === 'PercentHour' || field === 'MarkupRate' || field === 'MdcWageGroupFk'){
						if (item.MarkupRate && selectedCrewMix.AverageStandardWage && item.PercentHour) {
							item.RateHour = selectedCrewMix.AverageStandardWage * (item.MarkupRate / 100) * (item.PercentHour / 100);
						}
					} else if(field === 'RateHour'){
						item.MarkupRate = 0;
						item.PercentHour = 0;
					}

					basicsEfbsheetsProjectCrewMixAfService.markItemAsModified(item);
					if(field === 'PercentHour' || field === 'MarkupRate' || field === 'RateHour' || field === 'MdcWageGroupFk'){
						basicsEfbsheetsCommonService.calculateCrewmixesAndChilds(selectedCrewMix,'CrewmixAF');
						basicsEfbsheetsCommonService.calculateCrewmixesAndChilds(selectedCrewMix,'CrewmixAFSN', true);
					}
					refreshData(selectedCrewMix,true);
				}
			}

			return service;
		}
	]);
})();