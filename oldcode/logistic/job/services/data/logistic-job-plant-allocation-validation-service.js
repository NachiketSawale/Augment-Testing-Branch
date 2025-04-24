/**
 * Created by baf on 31.08.2018
 */

(function (angular) {
	'use strict';
	var moduleName = 'logistic.job';

	/**
	 * @ngdoc service
	 * @name logisticJobPlantAllocationValidationService
	 * @description provides validation methods for logistic job plantAllocation entities
	 */
	angular.module(moduleName).service('logisticJobPlantAllocationValidationService', LogisticJobPlantAllocationValidationService);

	LogisticJobPlantAllocationValidationService.$inject = ['_', '$injector', 'platformValidationServiceFactory', 'logisticJobPlantAllocationDataService',
		'logisticJobConstantValues'];

	function LogisticJobPlantAllocationValidationService(_, $injector, platformValidationServiceFactory, logisticJobPlantAllocationDataService, constValues) {
		var self = this;

		platformValidationServiceFactory.addValidationServiceInterface(constValues.schemes.plantAllocation, {
			mandatory: platformValidationServiceFactory.determineMandatoryProperties(constValues.schemes.plantAllocation),
			periods: [{from: 'AllocatedFrom', to: 'AllocatedTo'}]
		}, self, logisticJobPlantAllocationDataService);

		self.asyncValidatePlantFk = function validateAdditionalFk(entity, value) {
			var lookupService = $injector.get('basicsLookupdataLookupDataService');
			return lookupService.getItemByKey('equipmentplant', value).then(function (asyncPlant) {
				if (asyncPlant) {
					applyPlantValue(entity, asyncPlant);
				}
				return {apply: true, valid: true};
			});
		};

		function applyPlantValue(oldPlant, newPlant) {
			oldPlant.PlantTypeFk = newPlant.PlantTypeFk;
			oldPlant.PlantCode = newPlant.Code;
			oldPlant.PlantDescription = newPlant.DescriptionInfo.Translated;
			oldPlant.PlantStatusFk = newPlant.PlantStatusFk;
		}

	}
})(angular);
