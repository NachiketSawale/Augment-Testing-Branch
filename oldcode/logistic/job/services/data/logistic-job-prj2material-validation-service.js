/**
 * Created by leo on 08.03.2018.
 */
(function (angular) {
	'use strict';
	var moduleName = 'logistic.job';

	/**
	 * @ngdoc service
	 * @name logisticJobPrj2MaterialValidationService
	 * @description provides validation methods for logistic job Material entities
	 */
	angular.module(moduleName).service('logisticJobPrj2MaterialValidationService', LogisticJobPrj2MaterialValidationService);

	LogisticJobPrj2MaterialValidationService.$inject = ['platformValidationServiceFactory','platformDataValidationService', 'logisticJobPrj2MaterialDataService', 'platformRuntimeDataService'];

	function LogisticJobPrj2MaterialValidationService(platformValidationServiceFactory,platformDataValidationService, dataService, platformRuntimeDataService) {
		var self = this;

        platformValidationServiceFactory.addValidationServiceInterface({

                typeName: 'Project2MaterialDto',
                moduleSubModule: 'Logistic.Job'
            },
            {
                mandatory: ['ProjectFk','MaterialFk','MaterialGroupFk','UomFk','RetailPrice','ListPrice','Discount','Charges','Cost','PriceExtra','EstimatePrice','PriceUnit','FactorHour']
            },
            self,
	        dataService);

		self.validateMaterialFk = function (entity, value) {
			return platformDataValidationService.validateMandatory(entity, value, 'MaterialFk', self, dataService);
		};
		self.validateMaterialGroupFk = function (entity, value) {
			if(value !== null){
				platformRuntimeDataService.readonly(entity, [{
					field: 'MaterialFk',
					readonly: false
				}]);
				dataService.gridRefresh();
			}
			return platformDataValidationService.validateMandatory(entity, value, 'MaterialGroupFk', self, dataService);
		};
		self.validateUomFk = function (entity, value) {
			return platformDataValidationService.validateMandatory(entity, value, 'UomFk', self, dataService);
		};
		self.validateProjectFk = function (entity, value) {
			return platformDataValidationService.validateMandatory(entity, value, 'ProjectFk', self, dataService);
		};
	}

})(angular);