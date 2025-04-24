(function (angular) {
	'use strict';

	// eslint-disable-next-line no-redeclare
	/* global angular,globals,_ */
	var moduleName = 'procurement.rfq';
	/** @namespace item.IsTo */
	/**
	 * @ngdoc service
	 * @name procurementRfqEmailRecipientService
	 * @function
	 * @requires platformDataServiceFactory
	 *
	 * @description
	 * #
	 * data service of wizard 'send email' dialog form group 'recipient'.
	 */
	angular.module(moduleName).factory('procurementRfqEmailRecipientService', ['platformDataServiceFactory', 'procurementRfqMainService',
		function (platformDataServiceFactory, mainDataService) {
			var serviceOption = {
				module: angular.module(moduleName),
				serviceName: 'procurementRfqEmailRecipientService',
				httpRead: {
					route: globals.webApiBaseUrl + 'procurement/rfq/wizard/',
					endRead: 'emailrecipient',
					usePostForRead: true,
					initReadData: function initReadData(readData) {
						readData.Value = mainDataService.getSelected().Id || -1;
					}
				},
				dataProcessor: [],
				presenter: {list: {}},
				entitySelection: {}
			};

			var service = platformDataServiceFactory.createNewComplete(serviceOption).service;

			/**
			 * used to enable or disable send button
			 */
			service.getBtnSendStatus = function getBtnSendStatus() {
				var receivers = [];

				angular.forEach(service.getList(), function (item) {
					if (item.IsTo && !_.isEmpty(item.To)) {
						receivers.push(item);
					}
				});

				return !!receivers.length;
			};

			return service;
		}
	]);
})(angular);
