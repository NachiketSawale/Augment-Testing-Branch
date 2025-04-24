/**
 *
 *
 *
 |  ++++++++++++++++++++++++++++++++++++++++++++++++++++
 |
 |  Line Item calculation:
 |
 |  ++++++++++++++++++++++++++++++++++++++++++++++++++++


 @QuantityUnitTarget = Quantity x QuantityFactor(1,2,3,4) x ProduktivityFactor
 @QuantityTotal = QuantityTarget  x QuantityUnitTarget

 @CostUnit =  Sum of “CostUnitLineItem” from Resources or Subitems of first level (level 0)
 @CostUnitTarget  = QuantityUnitTarget x CostUnit x CostFactor1 x CostFactor2



 @CostTotal = QuantityTarget x CostUnitTarget

            .................................................................................

            QuantityTarget: field at db
            CostUnitTarget: =       Quantity x QuantityFactor(1,2,3,4) x ProduktivityFactor x
					                 @CostUnit x CostFactor1 x CostFactor2


            - So cost total is related to @costUnit and other direct db fields down below
            CostTotal: =       QuantityTarget x Quantity x QuantityFactor(1,2,3,4) x ProduktivityFactor x
					                 @CostUnit x CostFactor1 x CostFactor2
            .................................................................................




 @HoursUnit =  Sum of “HoursUnitLineItem” from Resources or Subitems of first level (level 0)
 @HoursUnitTarget  = QuantityUnitTarget x HoursUnit
 @HoursTotal = QuantityTarget x HoursUnitTarget



 |  ++++++++++++++++++++++++++++++++++++++++++++++++++++
 |  RESOURCES:
 |
 |  4.3 Calculation of subitems and resource detail lines
 |
 |  ++++++++++++++++++++++++++++++++++++++++++++++++++++


 @QuantityReal:
		 Resources: QuantityReal = Quantity x QuantityFactor(1,2,3,4) x ProduktivityFactor / EfficiencyFactor(1, 2) x QuantityFactorCC
		 Subitems: QuantityReal = Quantity x QuantityFactor(1,2,3,4) x ProduktivityFactor / EfficiencyFactor(1, 2)
 @QuantityInternal:
		 First Level: QuantityInternal =  QuantityReal
		 Next levels: QuantityInternal = QuantityReal * QuantityInternal(Level-1)
 @QuantityUnitTarget  = QuantityUnitTarget (of parent Line Item) x QuantityInternal
 @QuantityTotal = QuantityTotal (of parent Line Item) x QuantityInternal
 @CostUnit:
		 Resources: (at time, only Cost Code or Material)  Cost Code: Market Rate; Material: Estimate Price, value in curreny of resource
		 Subitems: total of “(QuantityReal x CostReal) “ of direct children (child subitems[Level+1] and direct resource children)
 @CostReal = CostUnit x CostFactor1 x CostFactor2 x CostFactorCC (in currency of resource, not displayed in iTWO, …maybe should be))
 @CostInternal = CostReal x (product of all cost factors from all parent levels above) (in currency of resource, not displayed in iTWO, …maybe should be)
 @CostUnitSubitem  = QuantityReal x CostInternal                value in currency of Estimate
 @CostUnitLineItem  = QuantityInternal x CostInternal           value in currency of Estimate
 @CostUnitTarget = QuantityUnitTarget x CostInternal            value in currency of Estimate
 //deprecated:  CostTotal  = QuantityTotal (of parent Line Item) x  CostInternal             value in currency of Estimate
 @CostTotal  = QuantityTotal x  CostInternal  x CostFactor1 (of parent Line Item) x CostFactor2 (of parent Line Item)        value in currency of Estimate

 @HoursUnit: Cost Code with flag “Labour cc” : 1,000, other Cost codes: 0,000 (empty)
 Assembly: take over hous value
 Plants: ??
 Material: at time: 0,000 (empty)
 @SubItem: total of “HoursUnitSubitem” of direct children (child subitems[Level+1] and direct resource children)

 @HoursUnitSubitem = QuantityReal x HoursUnit
 @HoursUnitLinitem = QuantityInternal x HoursUnit
 @HoursUnitTarget  = QuantityUnitTarget x HoursUnit
 //deprecated: HoursTotal = QuantityTotal (of parent Line Item) x  HoursUnit
 @HoursTotal = QuantityTotal  x  HoursUnit
 *
 */

/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	/* global _ */
	let moduleName = 'estimate.assemblies';
	let estimateAssembliesModule = angular.module(moduleName);
	/**
	 * @ngdoc service
	 * @name estimateAssembliesTotalService
	 * @function
	 *
	 * @description
	 * estimateTotalService is the data service for totals of line items.
	 */

	estimateAssembliesModule.factory('estimateAssembliesTotalCalculateService', [
		'basicsLookupdataLookupDescriptorService',
		'cloudCommonGridService',
		'estimateAssembliesService',
		function (basicsLookupdataLookupDescriptorService,
			cloudCommonGridService,
			estimateAssembliesService)
		{
			let service = {
				calculateTotal: calculateTotal
			};

			function totalHoursAndRisk() {
				let assemblyItem = estimateAssembliesService.getSelected() || {};
				let hoursAndRisk = {
					h: 0,
					r: 0
				};
				if (assemblyItem.EstCostRiskFk !== null && assemblyItem.EstCostRiskFk > 0) {
					hoursAndRisk.r = assemblyItem.CostTotal;
				}
				hoursAndRisk.h = assemblyItem.HoursTotal;
				return hoursAndRisk;
			}

			function calculateTotal (assemblyTotalItems) {
				let currency = '', // EUR
					hours = '', // h
					id = -1;
				if(assemblyTotalItems.length > 0) {
					currency = _.first(assemblyTotalItems).CurUoM;
					hours = 'h';
				}
				let hoursAndRisk = totalHoursAndRisk();
				let bottomRows = [
					{
						'Id': id--,
						'TotalOf': 'Direct Job Cost',
						'Description': '',
						'Total': _.sum(assemblyTotalItems, 'Total'),
						'CurUoM': currency,
						'cssClass':'font-bold'
					},
					{'Id': id--, 'TotalOf': 'Labor Hours', 'Description': '', 'Total': hoursAndRisk.h, 'CurUoM': hours},
					{'Id': id--, 'TotalOf': 'Cost Risk', 'Description': '', 'Total': hoursAndRisk.r, 'CurUoM': currency}
				];
				assemblyTotalItems = assemblyTotalItems.concat(bottomRows);

				return assemblyTotalItems;
			}

			return service;
		}]);


})();
