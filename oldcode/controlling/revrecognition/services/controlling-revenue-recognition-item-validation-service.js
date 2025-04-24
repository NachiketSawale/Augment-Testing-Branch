/*
 * Created by alm on 01.29.2021.
 */

(function (angular) {
	'use strict';
	var moduleName = 'controlling.revrecognition';


	angular.module(moduleName).factory('controllingRevenueRecognitionItemValidationService', ['$translate', 'platformRuntimeDataService', 'platformDataValidationService', 'controllingRevenueRecognitionItemService',
		function ($translate, platformRuntimeDataService, platformDataValidationService, dataService) {
			var service = {};

			service.validateAmountInc = function (entity, value,model,chainParent) {
				entity.AmountInc=value;
				entity.AmountTotal=entity.AmountPervious+value;
				entity.Percentage=(0!==entity.AmountContractTotal)?(entity.AmountTotal/entity.AmountContractTotal)*100:null;
				if(null!==chainParent) {
					dataService.calcParentChain(entity);
				}
				if(entity.ItemType>0) {
					dataService.markItemAsModified(entity);
				}
				dataService.prrItemAmountChanged.fire(entity);
				return true;
			};

			service.validateAmountTotal = function (entity, value /* , model */) {
				entity.AmountTotal=value;
				entity.AmountInc=value-entity.AmountPervious;
				entity.Percentage=(0!==entity.AmountContractTotal)?(entity.AmountTotal/entity.AmountContractTotal)*100:null;
				dataService.calcParentChain(entity);
				dataService.markItemAsModified(entity);
				dataService.prrItemAmountChanged.fire(entity);
				return true;
			};

			service.validatePercentage = function (entity, value /* , model */) {
				entity.Percentage=value;
				entity.AmountInc=(value/100)*(entity.AmountContract+entity.AmountContractCo)-entity.AmountPervious;
				dataService.calcParentChain(entity);
				dataService.markItemAsModified(entity);
				dataService.prrItemAmountChanged.fire(entity);
				return true;
			};
			return service;
		}
	]);
})(angular);
