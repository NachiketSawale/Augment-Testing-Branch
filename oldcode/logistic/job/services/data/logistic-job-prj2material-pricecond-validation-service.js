/**
 * Created by leo on 08.03.2018.
 */
(function (angular) {
	'use strict';
	var moduleName = 'logistic.job';

	/**
	 * @ngdoc service
	 * @name logisticJobPrj2MaterialPriceCondValidationService
	 * @description provides validation methods for logistic job Material entities
	 */
	angular.module(moduleName).service('logisticJobPrj2MaterialPriceCondValidationService', LogisticJobPrj2MaterialPriceCondValidationService);

	LogisticJobPrj2MaterialPriceCondValidationService.$inject = ['platformValidationServiceFactory', 'logisticJobPrj2MaterialPriceConditionDataService'];

	function LogisticJobPrj2MaterialPriceCondValidationService(platformValidationServiceFactory, logisticJobPrj2MaterialPriceConditionDataService) {
		var self = this;

		platformValidationServiceFactory.addValidationServiceInterface({
				typeName: 'Project2MaterialPriceConditionDto',
				moduleSubModule: 'Logistic.Job',
			}, {
				mandatory: ['ProjectMaterialFk', 'PriceConditionTypeFk','Value','Total','TotalOc','IsPriceComponent','IsActivated','',]
			},
			self,
			logisticJobPrj2MaterialPriceConditionDataService);
	}

})(angular);