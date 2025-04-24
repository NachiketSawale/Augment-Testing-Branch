(function (angular) {
	'use strict';

	var moduleName = 'procurement.rfq';

	/**
	 * @ngdoc service
	 * @name procurementRfqEmailFaxGaebFormatService
	 * @function
	 * @requires $q
	 * @description
	 * #
	 *  data service for procurement rfq wizard 'email' group 'Email Settings's gaeb format.
	 */
	angular.module(moduleName).factory('procurementRfqEmailFaxGaebFormatService', ['$q', 'basicsLookupdataLookupDescriptorService', '$translate',
		function ($q, lookupDescriptorService, $translate) {
			var gaebFormat = [
				{Id: '.x81', Description: $translate.instant('procurement.rfq.reportTemplates.x81')}, // "x81": "DA81 Bill of Quantities",
				{Id: '.x82', Description: $translate.instant('procurement.rfq.reportTemplates.x82')}, // "x82": "DA82 Cost Planning Transfer",
				{Id: '.x83', Description: $translate.instant('procurement.rfq.reportTemplates.x83')}, // "x83": "DA83 Invitation to Tender/Bid",
				{Id: '.x84', Description: $translate.instant('procurement.rfq.reportTemplates.x84')}, // "x84": "DA84 Tender/Bid Export",
				{Id: '.x85', Description: $translate.instant('procurement.rfq.reportTemplates.x85')}, // "x85": "DA85 Alternative Tender/Bid",
				{Id: '.x86', Description: $translate.instant('procurement.rfq.reportTemplates.x86')}  // "x86": "DA86 Contract Award"
			];

			// add data to lookup descriptor service
			lookupDescriptorService.attachData({RfqEmailFaxGaebFormat: gaebFormat});

			return {
				getList: function () {
					var deferred = $q.defer();
					deferred.resolve(gaebFormat);
					return deferred.promise;
				}
			};
		}
	]);


	angular.module(moduleName).factory('procurementRfqEmailFaxReportFormatService', ['$q', 'basicsLookupdataLookupDescriptorService',
		function ($q, lookupDescriptorService) {
			var reportFormat = [
				{Id: 1, Description: 'PDF'},
				{Id: 2, Description: 'XLSX'}
			];

			// add data to lookup descriptor service
			lookupDescriptorService.attachData({rfqemailfaxreportformat: reportFormat});

			return {
				getList: function () {
					var deferred = $q.defer();
					deferred.resolve(reportFormat);
					return deferred.promise;
				}
			};
		}
	]);

	angular.module(moduleName).factory('procurementRfqEmailFaxReportBoqFormatService', ['$q', 'basicsLookupdataLookupDescriptorService',
		function ($q, lookupDescriptorService) {
			var reportFormat = [
				{Id: 1, Description: 'GAEB'},
				{Id: 2, Description: 'XLSX'}
			];

			// add data to lookup descriptor service
			lookupDescriptorService.attachData({rfqemailfaxreportboqformat: reportFormat});

			return {
				getList: function () {
					var deferred = $q.defer();
					deferred.resolve(reportFormat);
					return deferred.promise;
				}
			};
		}
	]);

})(angular);
