/**
 * Created by baf on 08.02.2018
 */

(function (angular) {
	'use strict';
	var moduleName = 'logistic.job';

	/**
	 * @ngdoc service
	 * @name logisticJobMaterialRateValidationService
	 * @description provides validation methods for logistic job Material rates entities
	 */
	angular.module(moduleName).service('logisticJobMaterialRateValidationService', LogisticJobMaterialRateValidationService);

	LogisticJobMaterialRateValidationService.$inject = ['platformValidationServiceFactory','logisticJobMaterialRateDataService'];

	function LogisticJobMaterialRateValidationService(platformValidationServiceFactory,logisticJobMaterialRateDataService) {
		var self = this;
		platformValidationServiceFactory.addValidationServiceInterface({
				typeName: 'LogisticMaterialRateDto',
				moduleSubModule: 'Logistic.Job'
			},
			{
				mandatory: ['MaterialFk','PricePortion1','PricePortion2','PricePortion3','PricePortion4','PricePortion5','PricePortion6']
			},
			self,
			logisticJobMaterialRateDataService);
	}

})(angular);
