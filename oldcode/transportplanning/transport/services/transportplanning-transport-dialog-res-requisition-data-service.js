/* global angular, globals */
(function (angular) {
	'use strict';

	var moduleName = 'transportplanning.transport';

	angular.module(moduleName).factory('transportplanningTransportDialogResRequisitionListService', DialogResRequisitionListService);
	DialogResRequisitionListService.$inject = ['platformDataServiceFactory'];
	function DialogResRequisitionListService(platformDataServiceFactory) {

		var service = [];
		service.createService = function (parentService) {
			var serviceOptions = {
				flatLeafItem: {
					serviceName: 'transportplanningTransportDialogResRequisitionListService',
					httpRead: {
						route: globals.webApiBaseUrl + 'resource/requisition/',
						endRead: 'lookuplist'
					},
					entityRole: {
						leaf: {
							itemName: 'ResRequisition',
							parentService: parentService
						}
					},
					entitySelection: {supportsMultiSelection: true},
					presenter: {
						list: {
							incorporateDataRead: function (readData, data) {
								//filter by PpsEventFk is null
								var dtos = [];
								_.each(readData, function (item) {
									if (item.PpsEventFk === null) {
										dtos.push(item);
									}
								});
								dtos = _.orderBy(dtos, ['ProjectFk'], ['asc']);
								var result = {
									FilterResult: readData.FilterResult,
									dtos: dtos || []
								};

								return serviceContainer.data.handleReadSucceeded(result, data);
							}
						}
					}
				}
			};

			/* jshint -W003 */
			var serviceContainer = platformDataServiceFactory.createNewComplete(serviceOptions);
			serviceContainer.data.doNotLoadOnSelectionChange = true;
			return serviceContainer.service;
		};
		return service;
	}
})(angular);