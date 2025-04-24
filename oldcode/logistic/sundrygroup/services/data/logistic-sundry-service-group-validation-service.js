/**
 * Created by baf on 05.03.2018
 */

(function (angular) {
	'use strict';
	var moduleName = 'logistic.sundrygroup';

	/**
	 * @ngdoc service
	 * @name logisticSundryServiceGroupValidationService
	 * @description provides validation methods for logistic sundrygroup  entities
	 */
	angular.module(moduleName).service('logisticSundryServiceGroupValidationService', LogisticSundryServiceGroupValidationService);

	LogisticSundryServiceGroupValidationService.$inject = ['_', '$http', 'platformValidationServiceFactory', 'logisticSundryServiceGroupConstantValues',
		'logisticSundryServiceGroupDataService'];

	function LogisticSundryServiceGroupValidationService(_, $http, platformValidationServiceFactory, logisticSundryServiceGroupConstantValues,
		logisticSundryServiceGroupDataService) {
		var self = this;

		platformValidationServiceFactory.addValidationServiceInterface(logisticSundryServiceGroupConstantValues.schemes.group, {
			mandatory: platformValidationServiceFactory.determineMandatoryProperties(logisticSundryServiceGroupConstantValues.schemes.group)
		},
		self,
		logisticSundryServiceGroupDataService);

		this.validateIsDefault = function validateIsDefault(entity, value) {
			if (value) {
				_.filter(logisticSundryServiceGroupDataService.getList(), 'IsDefault', true)
					.forEach(function (item) {
						item.IsDefault = false;
						logisticSundryServiceGroupDataService.markItemAsModified(item);
					});
				logisticSundryServiceGroupDataService.markItemAsModified(entity);
				logisticSundryServiceGroupDataService.gridRefresh();
			}
		};
	}
})(angular);
