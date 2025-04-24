/**
 * Created by wed on 6/1/2018.
 */

(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,_ */
	angular.module('procurement.contract').factory('prcContractBillingSchemaDataService', ['basicsBillingSchemaServiceFactory', 'procurementContractHeaderDataService', 'basicsLookupdataLookupDescriptorService', function (basicsBillingSchemaServiceFactory, parentService, basicsLookupdataLookupDescriptorService) {

		var qualifier = 'procurement.contract.billingschmema';
		var service = basicsBillingSchemaServiceFactory.getService(qualifier, parentService, {
			autoCreateWhenHeaderEntityCreated: true,
			onUpdateSuccessNotify: parentService.onParentUpdated
		});

		service.getRubricCategory = function (item) {
			var selectItem = item || parentService.getSelected();
			var config = _.find(basicsLookupdataLookupDescriptorService.getData('prcconfiguration'), {
				Id: selectItem.PrcHeaderEntity ? selectItem.PrcHeaderEntity.ConfigurationFk : 0
			});
			if (config) {
				selectItem.RubricCategoryFk = config.RubricCategoryFk;
			}
			return selectItem.RubricCategoryFk;
		};

		return service;
	}]);

})(angular);
