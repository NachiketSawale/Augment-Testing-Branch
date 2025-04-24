/**
 * Created by baf on 20.07.2023
 */

(function (angular) {
	'use strict';
	const moduleName = 'resource.equipmentgroup';

	/**
	 * @ngdoc service
	 * @name resourceEquipmentGroupSpecificValueValidationService
	 * @description provides validation methods for resource equipmentGroup specificValue entities
	 */
	angular.module(moduleName).service('resourceEquipmentGroupSpecificValueValidationService', ResourceEquipmentGroupSpecificValueValidationService);

	ResourceEquipmentGroupSpecificValueValidationService.$inject = ['_','platformValidationServiceFactory', 'basicsLookupdataSimpleLookupService',
		'resourceEquipmentGroupConstantValues', 'resourceEquipmentGroupSpecificValueDataService', 'platformDataValidationService', 'platformRuntimeDataService', '$q'];

	function ResourceEquipmentGroupSpecificValueValidationService(_, platformValidationServiceFactory, basicsLookupdataSimpleLookupService,
	  resourceEquipmentGroupConstantValues, resourceEquipmentGroupSpecificValueDataService, platformDataValidationService, platformRuntimeDataService, $q) {
		let self = this;
		let dataService = resourceEquipmentGroupSpecificValueDataService;

		platformValidationServiceFactory.addValidationServiceInterface(resourceEquipmentGroupConstantValues.schemes.specificValue, {
				mandatory: platformValidationServiceFactory.determineMandatoryProperties(resourceEquipmentGroupConstantValues.schemes.specificValue)
			},
			self,
			resourceEquipmentGroupSpecificValueDataService);


		this.validateAdditionalSpecificValueTypeFk = function validateAdditionalSpecificValueTypeFk(entity, value) {
			let valueType = basicsLookupdataSimpleLookupService.getItemByIdSync(value, { lookupModuleQualifier: 'basics.customize.specificvaluetype', valueMember: 'Id' });
			if(valueType) {
				entity.UomFromTypeFk = valueType.UomFk;
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
