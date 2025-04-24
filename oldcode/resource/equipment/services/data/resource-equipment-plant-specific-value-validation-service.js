/**
 * Created by Nikhil on 08.08.2023
 */

(function (angular) {
	'use strict';
	const moduleName = 'resource.equipment';

	/**
	 * @ngdoc service
	 * @name resourceEquipmentPlantSpecificValueValidationService
	 * @description provides validation methods for resource equipment specificValue entities
	 */
	angular.module(moduleName).service('resourceEquipmentPlantSpecificValueValidationService', resourceEquipmentPlantSpecificValueValidationService);

	resourceEquipmentPlantSpecificValueValidationService.$inject = ['_','platformValidationServiceFactory', 'basicsLookupdataSimpleLookupService',
		'resourceEquipmentConstantValues', 'resourceEquipmentSpecificValueDataService', 'platformDataValidationService', 'platformRuntimeDataService', '$q'];

	function resourceEquipmentPlantSpecificValueValidationService(_, platformValidationServiceFactory, basicsLookupdataSimpleLookupService,
		resourceEquipmentConstantValues, resourceEquipmentSpecificValueDataService, platformDataValidationService, platformRuntimeDataService, $q) {
		let self = this;
		let dataService = resourceEquipmentSpecificValueDataService;

		platformValidationServiceFactory.addValidationServiceInterface(resourceEquipmentConstantValues.schemes.specificValues, {
				mandatory: platformValidationServiceFactory.determineMandatoryProperties(resourceEquipmentConstantValues.schemes.specificValues)
			},
			self,
			dataService);

		this.validateAdditionalSpecificValueTypefkFk = function validateAdditionalSpecificValueTypefkFk(entity, value) {
			let valueType = basicsLookupdataSimpleLookupService.getItemById(value, { lookupModuleQualifier: 'basics.customize.specificvaluetype' });
			if(valueType) {
				entity.UomFromTypeFK = value.Type.UomFk;
			}

			return true;
		};

		this.asyncValidateSpecificValueTypeFk = function asyncValidateSpecificValueTypeFk(entity, value) {

			return doAsyncValidateCostCodeFk(entity, value, entity.CostCodeFk).then(function (result){
				result.valid = true;
			});
		};

		this.asyncValidateCostCodeFk = function asyncValidateCostCodeFk(entity, value, model){

			if(!_.isNil(entity.SpecificValueTypeFk) && entity.SpecificValueTypeFk !== 0){

				return doAsyncValidateCostCodeFk(entity, entity.SpecificValueTypeFk, value);
			}
			else{
				platformDataValidationService.finishValidation({valid: true}, entity, value, model, self, dataService);
				return $q.when(true);
			}
		};

		function doAsyncValidateCostCodeFk(entity, specValueTypeFk, costCodeFk){
			let asyncMarker = platformDataValidationService.registerAsyncCall(entity, costCodeFk, 'CostCodeFk', dataService);
			asyncMarker.myPromise = basicsLookupdataSimpleLookupService.getList({ lookupModuleQualifier: 'basics.customize.specificvaluetype' }).then(function (res) {
				if(res) {
					let specValueType = _.find(res, {Id: specValueTypeFk});
					var result = {apply: true, valid: true, error: ''};
					if(specValueType.Iscostcode === true){

						result = platformDataValidationService.validateMandatory(entity, costCodeFk, 'CostCodeFk', self, dataService);
						platformRuntimeDataService.applyValidationResult(result, entity, 'CostCodeFk');
					}
					else{
						platformRuntimeDataService.applyValidationResult(result, entity, 'CostCodeFk');
					}
					return platformDataValidationService.finishAsyncValidation(result, entity, costCodeFk, 'CostCodeFk',asyncMarker, self, dataService);
				}
			});

			return asyncMarker.myPromise;
		}
	}
})(angular);
