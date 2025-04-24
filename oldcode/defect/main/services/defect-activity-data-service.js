/**
 * Created by chase.fan on 1/14/2025.
 */

(function (angular) {
	'use strict';
	const moduleName = 'defect.main';
	/**
     * @ngdoc service
     * @name defectActivityDataService
     * @function
     *
     * @description Provide activity data service
     */
	angular.module(moduleName).factory('defectActivityDataService',
		['_', 'businesspartnerMainActivityDataServiceFactory', 'defectMainHeaderDataService', 'basicsLookupdataLookupDescriptorService',
			function (_, businesspartnerMainActivityDataServiceFactory, defectMainHeaderDataService, basicsLookupdataLookupDescriptorService) {

				basicsLookupdataLookupDescriptorService.loadData('BusinessPartnerStatus');

				const service = businesspartnerMainActivityDataServiceFactory.createService({
					moduleName: moduleName,
					parentService: 'defectMainHeaderDataService',
					serviceName:'defectActivityDataService',
					isReadonlyFn: function () {
						const defect = defectMainHeaderDataService.getSelected();
						if (defect?.BpdBusinesspartnerFk) {
							const statuses = basicsLookupdataLookupDescriptorService.getData('BusinessPartnerStatus');
							const bp = basicsLookupdataLookupDescriptorService.getItemByIdSync(defect.BpdBusinesspartnerFk, {lookupType: 'BusinessPartner'});
							const state = _.find(statuses, {Id: bp?.BpdStatusFk});
							return state?.IsReadonly ?? true;
						}
						return true;
					},
					pKey1Fn: function (header) {
						return header.BpdBusinesspartnerFk;
					}
				});

				// Overwrite this method to provide document's parent fk.
				service.getSelectedParentId = function () {
					const selectParentItem = service.parentService?.().getSelected?.();
					return selectParentItem?.BpdBusinesspartnerFk ?? null;
				};

				return service;
			}]
	);
})(angular);