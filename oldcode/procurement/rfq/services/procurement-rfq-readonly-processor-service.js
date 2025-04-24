/**
 * Created by young on 28.07.2023
 */

(function (angular) {
	'use strict';
	const myModule = angular.module('procurement.rfq');

	/**
     * @ngdoc service
     * @name procurementRfqReadOnlyProcessorService
     * @description pprovides methods to access, create and update procurement rfq item entities
     */
	myModule.service('procurementRfqReadOnlyProcessorService', ProcurementRfqReadOnlyProcessorService);

	ProcurementRfqReadOnlyProcessorService.$inject = ['platformDataServiceConfiguredReadonlyExtension', 'platformRuntimeDataService'];
	function ProcurementRfqReadOnlyProcessorService(platformDataServiceConfiguredReadonlyExtension, platformRuntimeDataService) {

		this.processItem = function processItem(entity) {
			let fields = [];
			platformDataServiceConfiguredReadonlyExtension.overrideReadOnlyProperties('Procurement.Rfq', 'RfqHeader', fields);
			platformRuntimeDataService.readonly(entity, fields);
		};
	}
})(angular);