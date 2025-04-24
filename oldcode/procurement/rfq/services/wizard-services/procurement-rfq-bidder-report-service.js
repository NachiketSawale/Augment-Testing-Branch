(function (angular) {
	'use strict';

	var moduleName = 'procurement.rfq';
	/**
	 * @ngdoc service
	 * @name procurementRfqBidderReportService.js
	 * @function
	 * @requires platformDataServiceFactory
	 *
	 * @description
	 * #
	 *  data service of rfq bidder wizard report container
	 */
	angular.module(moduleName).factory('procurementRfqBidderReportService', ['$injector', 'genericWizardReportService', '_',
		function ($injector, GenericWizardReportService, _) {

			function getPlaceholder() {
				var genericWizardService = $injector.get('genericWizardService');
				var defaultBusinessPartnerId = genericWizardService.config.businessPartnerList[0].BusinessPartnerFk;
				var entityId = genericWizardService.getStartEntityId();

				var placeHolder = {
					RfqHeaderID: entityId,
					RfqID: entityId,
					'Module_RfqID': entityId,
					RFQID: entityId,
					BidderID: defaultBusinessPartnerId,
					BusinessPartnerID: defaultBusinessPartnerId
				};

				if (genericWizardService.config.prcInfo && genericWizardService.config.prcInfo.Requisition && !_.isEmpty(genericWizardService.config.prcInfo.Requisition)) {
					placeHolder.ReqID = genericWizardService.config.prcInfo.Requisition[0].Id;
				}

				return placeHolder;
			}

			return new GenericWizardReportService(moduleName, 'procurementRfqBidderReportService', getPlaceholder, false);
		}
	]);
})(angular);
