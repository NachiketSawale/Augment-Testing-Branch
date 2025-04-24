/**
 * Created by leo on 12.03.2018
 */

(function (angular) {
	'use strict';
	var moduleName = 'logistic.job';

	/**
	 * @ngdoc service
	 * @name logisticJobSundryServicePriceValidationService
	 * @description provides validation methods for logistic job plant price entities
	 */
	angular.module(moduleName).service('logisticJobSundryServicePriceValidationService', LogisticJobSundryServicePriceValidationService);

	LogisticJobSundryServicePriceValidationService.$inject = ['$injector', 'platformValidationServiceFactory', 'logisticJobSundryServicePriceDataService', 'logisticSundryServiceLookupDataService','platformRuntimeDataService'];

	function LogisticJobSundryServicePriceValidationService($injector, platformValidationServiceFactory, logisticJobSundryServicePriceDataService, logisticSundryServiceLookupDataService, platformRuntimeDataService) {
		var self = this;

     platformValidationServiceFactory.addValidationServiceInterface({
				typeName: 'LogisticSundryServicePriceDto',
				moduleSubModule: 'Logistic.Job'
			}, {
				mandatory: ['SundryServiceFk', 'LinkageReasonFk','JobFk','IsManual','PricePortion1','PricePortion2','PricePortion3','PricePortion4','PricePortion5','PricePortion6'],
				periods: [{ from: 'ValidFrom', to: 'ValidTo',checkOverlapping: true}]
			},
			self,
		  logisticJobSundryServicePriceDataService);



		self.validateSundryServiceFk = function (entity, value) {
			var sundryserviceData = $injector.get('logisticSundryServiceLookupDataService').getItemById(value, { lookupType: 'SundryServiceHeaderChained' });

			if (sundryserviceData.IsManual === true) {
				for (var i = 1; i <= 6; i++) {
					platformRuntimeDataService.readonly(entity, [{ field: 'IsManual', readonly: false }]);
					platformRuntimeDataService.readonly(entity, [{ field: 'PricePortion' + i, readonly: false }]);
					
				}

			} else {
				for(var j = 1; j <= 6; j++) { 
					platformRuntimeDataService.readonly(entity, [{ field: 'IsManual', readonly: true }]);
					platformRuntimeDataService.readonly(entity, [{ field: 'PricePortion' + j, readonly: true }]);				
				}


			}
		};


	}

})(angular);
