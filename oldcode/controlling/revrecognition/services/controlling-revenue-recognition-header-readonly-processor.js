/**
 * Created by alm on 9/04/2021.
 */
/* global _ */
(function (angular) {
	'use strict';
	angular.module('controlling.revrecognition').factory('controllingRevenueRecognitionHeaderReadonlyProcessor',
		['platformRuntimeDataService','basicsCommonReadOnlyProcessor','basicsLookupdataLookupDescriptorService',
			function (platformRuntimeDataService, commonReadOnlyProcessor,lookupDescriptorService) {
				var service = commonReadOnlyProcessor.createReadOnlyProcessor({
					typeName: 'PrrHeaderDto',
					moduleSubModule: 'Controlling.RevRecognition',
					readOnlyFields: ['BasCompanyTransheader']
				});
				var self = this, invStatuses, itemStatus, readOnlyStatus;
				service.handlerItemReadOnlyStatus = function (item) {
					itemStatus = self.getItemStatus(item);
					if (itemStatus) {
						readOnlyStatus = itemStatus.IsReadonly;
					} else {
						readOnlyStatus = false;
					}
					item.IsReadonlyStatus = readOnlyStatus;
					service.setRowReadOnly(item, readOnlyStatus);
					return readOnlyStatus;
				};



				self.getItemStatus = function getItemStatus(item) {
					invStatuses = lookupDescriptorService.getData('RevenueRecognitionStatus');
					return _.find(invStatuses, {Id: item.PrrStatusFk});
				};

				return service;
			}]);

})(angular);