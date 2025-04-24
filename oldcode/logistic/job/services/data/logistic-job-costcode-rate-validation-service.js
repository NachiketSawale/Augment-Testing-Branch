/**
 * Created by leo on 12.03.2018
 */

(function (angular) {
	'use strict';
	var moduleName = 'logistic.job';

	/**
	 * @ngdoc service
	 * @name logisticJobCostCodeRateValidationService
	 * @description provides validation methods for logistic job CostCode rates entities
	 */
	angular.module(moduleName).service('logisticJobCostCodeRateValidationService', LogisticJobCostCodeRateValidationService);

	LogisticJobCostCodeRateValidationService.$inject = ['platformValidationServiceFactory','logisticJobCostCodeRateDataService'];

	function LogisticJobCostCodeRateValidationService(platformValidationServiceFactory,logisticJobCostCodeRateDataService) {
		var self = this;
		platformValidationServiceFactory.addValidationServiceInterface({
				typeName: 'LogisticCostCodeRateDto',
				moduleSubModule: 'Logistic.Job'
			},
			{
				mandatory: ['Rate','SalesPrice','JobFk']
			},
			self,
			logisticJobCostCodeRateDataService
		);
	}
})(angular);
