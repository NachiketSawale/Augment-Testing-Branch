(function(angular){
	'use strict';

	angular.module('estimate.main').factory('estimateMainMarkup2costcodeCalculationService', ['_', '$injector', 'estimateMainContextDataService',
		'estimateMainSimpleAllowanceCalculationService', 'estimateMainEstimateByMarkupCalculationService',
		function(_, $injector, estimateMainContextDataService, estimateMainSimpleAllowanceCalculationService, estimateMainEstimateByMarkupCalculationService){
			let  service = {};

			function calculateMarkup2costCodes(estAllowanceEntity, markup2CostCodes)
			{
				if(!estAllowanceEntity || !_.isArray(markup2CostCodes)){
					return;
				}

				let estAllMarkup2CostCodes = _.filter(markup2CostCodes, function(e){ return e.Id > 0;});

				let stdAllowanceCalcOption = {
					AllowanceEntity : estAllowanceEntity,
					Markup2CostCodes : estAllMarkup2CostCodes || [],
					FixedLineItems : estimateMainContextDataService.getFixedPriceLineItems(),
					LineItemsWithAA : estimateMainContextDataService.getLineItemsWithAdvancedAll(),
					getAdvanceAll : function(){
						if(!this.AllowanceEntity)
						{
							return 0;
						}

						if (this.AllowanceEntity.QuantityTypeFk === 3)
						{
							return _.sumBy(this.LineItemsWithAA, function(e){
								return e.AdvancedAllUnitItem * e.WqQuantityTarget;
							});
						}
						else
						{
							return _.sumBy(this.LineItemsWithAA, function(e){
								return e.AdvancedAllUnitItem * e.QuantityTarget;
							});
						}
					}
				};

				switch (estAllowanceEntity.MdcAllowanceTypeFk) {
					case 1:{
						estimateMainSimpleAllowanceCalculationService.calculateMarkup(stdAllowanceCalcOption);
						break;
					}
					case 2:{
						estimateMainEstimateByMarkupCalculationService.calculateMarkup(stdAllowanceCalcOption);
						break;
					}
				}
			}

			service.calculateMarkup2costCodes = calculateMarkup2costCodes;

			return service;
		}]);
})(angular);