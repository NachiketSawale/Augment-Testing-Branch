(function (angular) {

	'use strict';
	var moduleName = 'procurement.rfq';
	/**
	 * @ngdoc service
	 * @name procurementRfqDragDropService
	 * @description provides Drap, Drop and paste functionality for the Bidder
	 */
	angular.module(moduleName).factory('procurementRfqDragDropService', ['platformDragdropService','platformModalService','procurementRfqRequisitionService','procurementRfqBusinessPartnerService',
		'procurementRfqPartialreqAssignedDataDirectiveDataService',
		function ( platformDragdropService,platformModalService,procurementRfqRequisitionService,procurementRfqBusinessPartnerService,
			procurementRfqPartialreqAssignedDataDirectiveDataService) {
			let service = {};
			service.canDrag = function canDrag(type) {
				let result = false;
				if(type==='requisitions')
				{
					result = true;
				}
				return result;
			};

			service.doCanPaste = function doCanPaste(canPastedContent, type) {
				let result=false;
				let isHeaderReadOnly = procurementRfqBusinessPartnerService.isReadonly();
				if(isHeaderReadOnly)
				{
					return result;
				}
				if(type==='rfqBusinessPartner')
				{
					result=true;
				}
				return  result;
			};

			service.doPaste = function doPaste(sourceData, itemOnDragEnd) {
				if (!sourceData || !angular.isObject(sourceData) || !itemOnDragEnd) {
					return;
				}

				procurementRfqPartialreqAssignedDataDirectiveDataService.dragDropDataHandler(sourceData.data, itemOnDragEnd.BusinessPartnerFk);
			};

			return service;
		}
	]);

})(angular);
