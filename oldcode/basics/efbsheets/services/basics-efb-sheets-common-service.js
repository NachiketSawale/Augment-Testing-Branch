/**
 * $Id$
 * Copyright (c) RIB Software SE
 */


(function (angular) {
	'use strict';

	let moduleName = 'basics.efbsheets';
	/**
     * @ngdoc service
     * @name basicsEfbsheetsCommonService
     * @function
     * @description
     * estimateMainCommonService is the data service for estimate related common functionality.
     */
	angular.module(moduleName).factory('basicsEfbsheetsCommonService', ['$q','_','$injector','basicsEfbsheetsProjectAverageWageService','basicsEfbsheetsAverageWageService','basicsEfbsheetsProjectCrewMixAfService','basicsEfbsheetsCrewMixAfService',
		'basicsEfbsheetsProjectCrewMixAfsnService','basicsEfbsheetsCrewMixAfsnService','basicsEfbsheetsProjectCrewMixCostCodeService','basicsEfbsheetsCrewMixCostCodeService',
		function ( $q,_,$injector,basicsEfbsheetsProjectAverageWageService,basicsEfbsheetsAverageWageService,basicsEfbsheetsProjectCrewMixAfService,basicsEfbsheetsCrewMixAfService,
			basicsEfbsheetsProjectCrewMixAfsnService,basicsEfbsheetsCrewMixAfsnService,basicsEfbsheetsProjectCrewMixCostCodeService, basicsEfbsheetsCrewMixCostCodeService) {
			let service = {};

			// Update est crewmixes and childres (averagWages, Crewmix AF,CrewMixAFSN)
			function calculateCrewmixesAndChilds(crewMixItem, childtype, doUpdateRateHour){
				/* validate crewMixItem is not null */
				if(!crewMixItem) {
					return;
				}

				switch(childtype){
					case 'AverageWage' :
						{
							calculateBasedOnAverageWage(crewMixItem);
						}
						break;
					case 'CrewmixAF' :
						{
							calculateBasedOnCrewMixAF(crewMixItem, doUpdateRateHour);
						}
						break;
					case 'CrewmixAFSN' :
						{
							calculateBasedOnCrewMixAFSN(crewMixItem, doUpdateRateHour);
						}
						break;
					case 'CostCode' :
						{
							calculateBasedOnCrewmixCostCode(crewMixItem);
						}
						break;
				}
			}

			function calculateBasedOnAverageWage(crewMixItem){
				if(!crewMixItem){
					return;
				}
				let allAverageWages;

				if(crewMixItem.ProjectFk){
					allAverageWages = basicsEfbsheetsProjectAverageWageService.getList();
				}else{
					allAverageWages = basicsEfbsheetsAverageWageService.getList();
				}

				crewMixItem.CrewSize=0;
				crewMixItem.CrewAverage=0;

				angular.forEach(allAverageWages,function(averageWageItem){
					if(averageWageItem && _.isNumber(averageWageItem.Count)){
						if(!averageWageItem.Supervisory){
							crewMixItem.CrewSize= crewMixItem.CrewSize + averageWageItem.Count;
						}
						crewMixItem.CrewAverage += averageWageItem.MarkupRate * averageWageItem.Count;
					}
				});

				if (crewMixItem.CrewSize > 0){
					crewMixItem.CrewAverage =  crewMixItem.CrewAverage /  crewMixItem.CrewSize;
				}

				crewMixItem.WagePIncrease1 = _.isNumber(crewMixItem.WagePIncrease1) ? crewMixItem.WagePIncrease1 : 0;
				crewMixItem.WagePIncrease2 = _.isNumber(crewMixItem.WagePIncrease2) ? crewMixItem.WagePIncrease2 : 0;

				crewMixItem.WageIncrease1 = (crewMixItem.WagePIncrease1/100) * (crewMixItem.HourPIncrease1/100) * crewMixItem.CrewAverage;
				crewMixItem.WageIncrease2 = (crewMixItem.WagePIncrease2/100) * (crewMixItem.HourPIncrease2/100) * crewMixItem.CrewAverage;

				crewMixItem.ExtraPay = _.isNumber(crewMixItem.ExtraPay) ? crewMixItem.ExtraPay : 0;

				crewMixItem.AverageStandardWage = crewMixItem.CrewAverage + crewMixItem.WageIncrease1 + crewMixItem.WageIncrease2 + crewMixItem.ExtraPay;
			}

			function calculateBasedOnCrewMixAF(crewMixItem, doUpdateRateHour){
				if(!crewMixItem){
					return;
				}
				let allCrewmixAfs,
					totalRateHour= 0;

				if(crewMixItem.ProjectFk){
					allCrewmixAfs = basicsEfbsheetsProjectCrewMixAfService.getList();
				}else{
					allCrewmixAfs = basicsEfbsheetsCrewMixAfService.getList();
				}

				angular.forEach(allCrewmixAfs,function(crewmixAfItem){
					if(crewmixAfItem && crewmixAfItem.MdcWageGroupFk){
						crewmixAfItem.RateHour = doUpdateRateHour && crewmixAfItem.MarkupRate && crewmixAfItem.PercentHour && crewMixItem.AverageStandardWage
							? (crewMixItem.AverageStandardWage * (crewmixAfItem.MarkupRate / 100) * (crewmixAfItem.PercentHour / 100))
							: crewmixAfItem.RateHour;
						totalRateHour += _.isNumber(crewmixAfItem.RateHour) ? crewmixAfItem.RateHour : 0;
					}
				});

				crewMixItem.TotalSurcharge = _.isNumber(totalRateHour) ? totalRateHour : 0;
				crewMixItem.CrewMixAf = (_.isNumber(crewMixItem.AverageStandardWage) ? crewMixItem.AverageStandardWage : 0) + crewMixItem.TotalSurcharge;
			}

			function calculateBasedOnCrewMixAFSN(crewMixItem, doUpdateRateHour){
				if(!crewMixItem){
					return;
				}
				let allCrewmixAfsns,
					totalRateHour= 0;

				if(crewMixItem.ProjectFk){
					allCrewmixAfsns = basicsEfbsheetsProjectCrewMixAfsnService.getList();
				}else{
					allCrewmixAfsns = basicsEfbsheetsCrewMixAfsnService.getList();
				}

				angular.forEach(allCrewmixAfsns,function(crewmixAfsnItem){
					if(crewmixAfsnItem && crewmixAfsnItem.MdcWageGroupFk) {
						crewmixAfsnItem.RateHour = doUpdateRateHour && crewmixAfsnItem.MarkupRate && crewMixItem.CrewMixAf
							? (crewMixItem.CrewMixAf * (crewmixAfsnItem.MarkupRate/100))
							: crewmixAfsnItem.RateHour;
						totalRateHour += _.isNumber(crewmixAfsnItem.RateHour) ? crewmixAfsnItem.RateHour : 0;
					}
				});

				crewMixItem.TotalExtraCost = _.isNumber(totalRateHour) ? totalRateHour : 0;
				crewMixItem.CrewMixAfsn = (_.isNumber(crewMixItem.CrewMixAf) ? crewMixItem.CrewMixAf : 0) + crewMixItem.TotalExtraCost;
			}

			function calculateBasedOnCrewmixCostCode(crewMixItem){
				if(crewMixItem.ProjectFk){
					$injector.get('basicsEfbsheetsProjectMainService').markItemAsModified(crewMixItem);
				}else{
					$injector.get('basicsEfbsheetsMainService').markItemAsModified(crewMixItem);
				}
			}

			service.setSelectedLookupItem = function setSelectedLookupItem(lookupItem,isProject) {
				let selectedCrewMix2CostCodeItem;
				if(lookupItem){
					if(isProject){
						selectedCrewMix2CostCodeItem = basicsEfbsheetsProjectCrewMixCostCodeService.getSelected();
						selectedCrewMix2CostCodeItem.MdcCostCodeFk = lookupItem.OriginalId;
					}else{
						selectedCrewMix2CostCodeItem = basicsEfbsheetsCrewMixCostCodeService.getSelected();
						selectedCrewMix2CostCodeItem.MdcCostCodeFk = lookupItem.Id;
					}
					selectedCrewMix2CostCodeItem.Rate = lookupItem.Rate;
				}
			};

			service.calculateCrewmixesAndChilds = calculateCrewmixesAndChilds;

			return service;

		}]);
})(angular);
