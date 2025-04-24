/**
 * Created by nitsche on 15.11.2021
 */

(function (angular) {
	/* global globals _ */
	'use strict';
	let myModule = angular.module('resource.equipmentgroup');

	/**
	 * @ngdoc service
	 * @name resourceEquipmentGroupPlantGroup2CostCodeValidationService
	 * @description provides validation methods for resource equipment PlantGroup2CostCode entities
	 */
	myModule.service('resourceEquipmentGroupPlantGroup2CostCodeValidationService', ResourceEquipmentGroupPlantGroup2CostCodeValidationService);

	ResourceEquipmentGroupPlantGroup2CostCodeValidationService.$inject = [
		'$q', '$http', '$injector', 'platformValidationServiceFactory', 'resourceEquipmentGroupConstantValues',
		'resourceEquipmentGroupPlantGroup2CostCodeDataService'
	];

	function ResourceEquipmentGroupPlantGroup2CostCodeValidationService(
		$q, $http, $injector, platformValidationServiceFactory, resourceEquipmentGroupConstantValues,
		resourceEquipmentGroupPlantGroup2CostCodeDataService
	) {
		let self = this;
		platformValidationServiceFactory.addValidationServiceInterface(
			resourceEquipmentGroupConstantValues.schemes.plantGroup2CostCode,
			{
				mandatory: platformValidationServiceFactory.determineMandatoryProperties(resourceEquipmentGroupConstantValues.schemes.plantGroup2CostCode)
			},
			self,
			resourceEquipmentGroupPlantGroup2CostCodeDataService);

		let costCodes = [];
		self.asyncValidateCostCodePricePXFk = function asyncValidateCostCodePricePXFk(entity, value, model) {
			if(_.isNil(value)){
				return $q.resolve(platformDataValidationService.createSuccessObject());
			}
			else{
				let costCode = _.find(costCodes, c => c.Id === value);
				if(_.isNil(costCode)){
					return $http.post(globals.webApiBaseUrl + 'basics/costcodes/getcostcodebyid', {Id: value}).then(function (response) {
						costCode = response.data;
						costCodes.push(costCode);
						return self.isCostCodeValid(costCode);
					});
				}
				else{
					return self.isCostCodeValid(costCode);
				}
			}
		};
		let platformDataValidationService = $injector.get('platformDataValidationService');
		self.validateCostCodePricePXFk = function validateCostCodePricePXFk(entity, value, model) {
			let costCode = _.find(costCodes, c => c.Id === value);
			return _.isNil(value) ?
				platformDataValidationService.createSuccessObject() :
				!_.isNil(costCode) ? self.isCostCodeValid(costCode) : platformDataValidationService.createSuccessObject();

		};
		self.isCostCodeValid = function isCostCodeValid(costCode){
			if(costCode.IsRate){
				return platformDataValidationService.createErrorObject('resource.equipmentgroup.errSelectNonFixedCostCode');
			}
			else{
				return platformDataValidationService.createSuccessObject();
			}
		};

		self.asyncValidateCostCodePriceP1Fk = function asyncValidateCostCodePriceP1Fk(entity, value, model) {
			return self.asyncValidateCostCodePricePXFk(entity, value, model);
		};
		self.validateCostCodePriceP1Fk = function asyncValidateCostCodePriceP1Fk(entity, value, model) {
			return self.validateCostCodePricePXFk(entity, value, model);
		};
		self.asyncValidateCostCodePriceP2Fk = function asyncValidateCostCodePriceP1Fk(entity, value, model) {
			return self.asyncValidateCostCodePricePXFk(entity, value, model);
		};
		self.validateCostCodePriceP2Fk = function asyncValidateCostCodePriceP1Fk(entity, value, model) {
			return self.validateCostCodePricePXFk(entity, value, model);
		};
		self.asyncValidateCostCodePriceP3Fk = function asyncValidateCostCodePriceP1Fk(entity, value, model) {
			return self.asyncValidateCostCodePricePXFk(entity, value, model);
		};
		self.validateCostCodePriceP3Fk = function asyncValidateCostCodePriceP1Fk(entity, value, model) {
			return self.validateCostCodePricePXFk(entity, value, model);
		};
		self.asyncValidateCostCodePriceP4Fk = function asyncValidateCostCodePriceP1Fk(entity, value, model) {
			return self.asyncValidateCostCodePricePXFk(entity, value, model);
		};
		self.validateCostCodePriceP4Fk = function asyncValidateCostCodePriceP1Fk(entity, value, model) {
			return self.validateCostCodePricePXFk(entity, value, model);
		};
		self.asyncValidateCostCodePriceP5Fk = function asyncValidateCostCodePriceP1Fk(entity, value, model) {
			return self.asyncValidateCostCodePricePXFk(entity, value, model);
		};
		self.validateCostCodePriceP5Fk = function asyncValidateCostCodePriceP1Fk(entity, value, model) {
			return self.validateCostCodePricePXFk(entity, value, model);
		};
		self.asyncValidateCostCodePriceP6Fk = function asyncValidateCostCodePriceP1Fk(entity, value, model) {
			return self.asyncValidateCostCodePricePXFk(entity, value, model);
		};
		self.validateCostCodePriceP6Fk = function asyncValidateCostCodePriceP1Fk(entity, value, model) {
			return self.validateCostCodePricePXFk(entity, value, model);
		};
	}
})(angular);