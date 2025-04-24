/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';

	let moduleName = 'basics.efbsheets';
	/**
     * @ngdoc service
     * @name basicsEfbsheetCrewMixCostCodeDetailService
     * @function
     *
     * @description
     * basicsEfbsheetCrewMixCostCodeDetailService is the data service for Crewmix 2 CostCode related functionality.
     */
	angular.module(moduleName).factory('basicsEfbsheetCrewMixCostCodeDetailService', ['$q', '$injector', 'basicsEfbsheetsProjectMainService','basicsEfbsheetsMainService','basicsEfbsheetsProjectCrewMixCostCodeService','basicsEfbsheetsCrewMixCostCodeService','basicsEfbsheetsCommonService',
		function ($q, $injector, basicsEfbsheetsProjectMainService,basicsEfbsheetsMainService,basicsEfbsheetsProjectCrewMixCostCodeService,basicsEfbsheetsCrewMixCostCodeService,basicsEfbsheetsCommonService) {
			let service = {
				fieldChangeForMaster: fieldChangeForMaster,
				fieldChangeForProject:fieldChangeForProject
			};

			function refreshData(parentCrewMix,isProject) {
				if(isProject){
					if (parentCrewMix) {
						basicsEfbsheetsProjectMainService.markItemAsModified(parentCrewMix);

						// use this to refresh Crew Mix container when the Average wage is changed
						basicsEfbsheetsProjectMainService.fireItemModified();
					}

					angular.forEach(basicsEfbsheetsProjectCrewMixCostCodeService.getList(), function (resItem) {
						basicsEfbsheetsProjectCrewMixCostCodeService.markItemAsModified(resItem);
						basicsEfbsheetsProjectCrewMixCostCodeService.fireItemModified(resItem);
					});

					// work around to display instantly sub-items cost total and other values after quantity has been updated.(the item is marked as modified then is refreshed)
					basicsEfbsheetsProjectCrewMixCostCodeService.gridRefresh();
					basicsEfbsheetsProjectMainService.gridRefresh();
				}else{
					if (parentCrewMix) {
						basicsEfbsheetsMainService.markItemAsModified(parentCrewMix);

						// use this to refresh Crew Mix container when the Average wage is changed
						basicsEfbsheetsMainService.fireItemModified();
					}

					angular.forEach(basicsEfbsheetsCrewMixCostCodeService.getList(), function (resItem) {
						basicsEfbsheetsCrewMixCostCodeService.markItemAsModified(resItem);
						basicsEfbsheetsCrewMixCostCodeService.fireItemModified(resItem);
					});

					// work around to display instantly sub-items cost total and other values after quantity has been updated.(the item is marked as modified then is refreshed)
					basicsEfbsheetsCrewMixCostCodeService.gridRefresh();
					basicsEfbsheetsMainService.gridRefresh();
				}
			}

			function fieldChangeForMaster(item, field) {
				let selectedCrewMix = basicsEfbsheetsMainService.getSelected();
				if(selectedCrewMix){
					basicsEfbsheetsMainService.markItemAsModified(selectedCrewMix);
					if(field === 'MdcCostCodeFk'){
						basicsEfbsheetsCommonService.calculateCrewmixesAndChilds(selectedCrewMix,'CostCode',true);
						basicsEfbsheetsMainService.markItemAsModified(selectedCrewMix);
					}
					refreshData(selectedCrewMix,false);
				}
			}

			function fieldChangeForProject(item, field) {
				let selectedCrewMix = basicsEfbsheetsProjectMainService.getSelected();
				basicsEfbsheetsProjectMainService.markItemAsModified(selectedCrewMix);
				if(field === 'MdcCostCodeFk'){
					basicsEfbsheetsCommonService.calculateCrewmixesAndChilds(selectedCrewMix,'CostCode',true);
					basicsEfbsheetsProjectMainService.markItemAsModified(selectedCrewMix);
				}
				refreshData(selectedCrewMix,true);
			}

			return service;
		}
	]);
})();