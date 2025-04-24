/**
 * Created by chk on 5/3/2017.
 */
(function (angular) {
	'use strict';

	var moduleName = 'basics.procurementstructure';
	angular.module(moduleName).factory('basicsProcurementEventOptionService', ['platformTranslateService','basicsLookupdataLookupDescriptorService',
		function (platformTranslateService, lookupDescriptorService) {
			var eventOption = [
				{Id: 1, Description: 'Supplier Lead Time', Description$tr$: 'basics.procurementstructure.event.supplierLeadTime'},
				{Id: 2, Description: 'Supplier lead Time + Safety Lead Time', Description$tr$: 'basics.procurementstructure.event.supplierAndSafetyLeadTime'},
				{Id: 3, Description: 'Buffer Lead Time + Supplier Lead Time + Safety Lead Time', Description$tr$: 'basics.procurementstructure.event.prcAndSupplierAndSafetyLeadTime'},
				{Id: 4, Description: 'Buffer Lead Time', Description$tr$: 'basics.procurementstructure.event.prcLeadTime'},
				{Id: 5, Description: 'Safety Lead Time', Description$tr$: 'basics.procurementstructure.event.safetyLeadTime'}
			];
			var lookupItems = {'PrcEventOption':eventOption};

			platformTranslateService.translationChanged.register(function(){
				platformTranslateService.translateObject(eventOption);
			});
			lookupDescriptorService.attachData(lookupItems);
			return lookupItems;
		}]);
})(angular);