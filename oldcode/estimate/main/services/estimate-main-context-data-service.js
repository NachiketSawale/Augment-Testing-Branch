(function (angular) {
	'use strict';

	angular.module('estimate.main').factory('estimateMainContextDataService', ['_',
		function (_) {
			let service = {};

			let advancedAllowanceCc = null;

			let prjCostCodeStructure = {};

			let mdcCostCodeStructure = {};

			let allowanceEntity = {};

			let estMarkup2CostCode = [];

			let prjCostCodeId2MarkupMap = {};

			let mdcCostCodeId2MarkupMap = {};

			let advancedAll = 0;

			let lineItemsWithAdvancedAll = [];

			let fixedPriceLineItems = [];

			service.reset = function(){
				advancedAllowanceCc = null;
				prjCostCodeStructure = {};
				mdcCostCodeStructure = {};
				allowanceEntity = {};
				estMarkup2CostCode = [];
				prjCostCodeId2MarkupMap = {};
				mdcCostCodeId2MarkupMap = {};
				advancedAll = 0;
				lineItemsWithAdvancedAll = [];
				fixedPriceLineItems = [];
			};

			service.initialize = function(data){
				service.reset();

				if(!data){
					return;
				}

				advancedAllowanceCc = data.advancedAllowanceCc;

				if(data.allowanceEntity){
					allowanceEntity = data.allowanceEntity;
				}

				if(data.advancedAll){
					advancedAll = data.advancedAll;
				}

				lineItemsWithAdvancedAll = data.lineItemsWithAdvancedAll || [];

				fixedPriceLineItems = data.fixedPriceLineItems || [];

				if(data.mdcCostCodeStructure){
					_.forEach(data.mdcCostCodeStructure, function(item){
						mdcCostCodeStructure[item.Id] = item;
					});
				}

				if(data.prjCostCodeStructure){
					_.forEach(data.prjCostCodeStructure, function(item){
						prjCostCodeStructure[item.Id] = item;
					});
				}

				if(data.estMarkup2CostCodes){
					estMarkup2CostCode = _.filter(data.estMarkup2CostCodes, function(e){ return e.Id > 0;});

					_.forEach(data.estMarkup2CostCodes, function(item){
						item.GaPercConverted = item.GaPerc * 0.01;
						item.RpPercConverted = item.RpPerc * 0.01;
						item.AmPercConverted = item.AmPerc * 0.01;

						if(item.Project2MdcCstCdeFk){
							prjCostCodeId2MarkupMap[item.Project2MdcCstCdeFk] = item;
						}

						if(item.MdcCostCodeFk){
							mdcCostCodeId2MarkupMap[item.MdcCostCodeFk] = item;
						}
					});
				}
			};

			service.getAllowanceEntity = function(){
				return allowanceEntity;
			};

			service.setAllowanceEntity = function(activeAllowanceEntity){
				allowanceEntity = activeAllowanceEntity;
			};

			service.isHideGaAmRp = function(){
				return allowanceEntity && [1,3].indexOf(allowanceEntity.MdcAllowanceTypeFk) > -1 && allowanceEntity.IsOneStep;
			};

			service.getAdvancedAllowanceCc = function(){
				return advancedAllowanceCc;
			};

			service.getAdvancedAll = function(){
				return advancedAll;
			};

			service.getMarkupEntityByPrjCostCodeId = function(prjCostCodeId){
				return prjCostCodeId2MarkupMap[prjCostCodeId];
			};

			service.getMarkupEntityByMdcCostCodeId = function(mdcCostCodeId){
				return mdcCostCodeId2MarkupMap[mdcCostCodeId];
			};

			service.getPrjCostCodeById = function(prjCostCodeId){
				if(!prjCostCodeStructure){
					return null;
				}

				return prjCostCodeStructure[prjCostCodeId];
			};

			service.getMdcCostCodeById = function(mdcCostCodeId){
				if(!mdcCostCodeStructure){
					return null;
				}

				return mdcCostCodeStructure[mdcCostCodeId];
			};

			service.getEstMarkup2CostCode = function(){
				return estMarkup2CostCode;
			};

			service.getFixedPriceLineItems = function(){
				return fixedPriceLineItems || [];
			};

			service.getLineItemsWithAdvancedAll = function(){
				return lineItemsWithAdvancedAll;
			};

			return service;
		}]);
})(angular);