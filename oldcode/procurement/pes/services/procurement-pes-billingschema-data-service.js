/**
 * Created by wed on 6/1/2018.
 */

(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,_ */
	angular.module('procurement.pes').factory('procurementPesBillingSchemaDataService', ['basicsBillingSchemaServiceFactory', 'procurementPesHeaderService','basicsLookupdataLookupDescriptorService', function (basicsBillingSchemaServiceFactory, parentService,basicsLookupdataLookupDescriptorService) {

		var qualifier = 'procurement.pes.billingschmema';
		var service = basicsBillingSchemaServiceFactory.getService(qualifier, parentService, {
			autoCreateWhenHeaderEntityCreated: true,
			onUpdateSuccessNotify: parentService.onUpdateSucceeded
		});

		service.getRubricCategory = function (item) {
			var selectItem = item || parentService.getSelected();
			var config = _.find(basicsLookupdataLookupDescriptorService.getData('prcconfiguration'), {
				Id: selectItem.PrcConfigurationFk
			});
			if(config) {
				selectItem.RubricCategoryFk = config.RubricCategoryFk;
			}
			return selectItem.RubricCategoryFk;
		};

		service.registerParentEntityCreateEvent();

		return service;
	}]);

})(angular);
