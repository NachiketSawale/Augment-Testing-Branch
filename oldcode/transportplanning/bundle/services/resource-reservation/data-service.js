/**
 * Created by waz on 11/16/2017.
 */
(function (angular) {
	'use strict';

	var module = 'transportplanning.bundle';
	angular.module(module).factory('transportplanningBundleResourceReservationDataService', TransportplanningBundleResourceReservationDataService);

	TransportplanningBundleResourceReservationDataService.$inject = [
		'_',
		'platformDataServiceFactory', 'transportplanningBundleMainService', 'transportplanningBundleStatusValidationService'];
	function TransportplanningBundleResourceReservationDataService(_,
		platformDataServiceFactory,
		parentService,
		bundlestatusValidationService) {
		var serviceContainer;
		var serviceOption = {
			flatLeafItem: {
				serviceName: 'transportplanningRequisitionResourceRequisitionDataService',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'resource/reservation/',
					endRead: 'getForResRequisition',
					initReadData: function (readData) {
						var entity = parentService.getSelected().LoadingDevice;
						var id = (!_.isNil(entity) && !_.isNil(entity.Id)) ? entity.Id : 0;
						readData.filter = '?resRequisitionId=' + id;
					}
				},
				entityRole: {
					leaf: {
						itemName: 'ResReservation',
						parentService: parentService
					}
				},
				presenter: {
					list: {
						incorporateDataRead: function (readData, data) {
							var result = {
								FilterResult: readData.FilterResult,
								dtos: readData || []
							};
							return serviceContainer.data.handleReadSucceeded(result, data);
						}
					}
				},
				actions: {
					create: 'flat',
					delete: {},
					canCreateCallBackFunc: function () {
						return !isLoadingDeviceEmpty(parentService.getSelected().LoadingDevice) &&
							bundlestatusValidationService.isBundleModifyable(parentService.getSelected());
					},
					canDeleteCallBackFunc: function () {
						return bundlestatusValidationService.isBundleModifyable(parentService.getSelected());
					}
				}
			}
		};

		function isLoadingDeviceEmpty(item) {
			return item === null ||
				(!item.Description &&
					item.Quantity === null &&
					item.RequestedFrom === null &&
					item.RequestedTo === null &&
					item.UomFk === null &&
					item.TypeFk === null &&
					item.ResourceFk === null &&
					item.JobFk === null);
		}

		serviceContainer = platformDataServiceFactory.createNewComplete(serviceOption);
		serviceContainer.service.registerEntityCreated(function (event, entity) {
			entity.RequisitionFk = parentService.getSelected().LoadingDevice.Id;
		});
		return serviceContainer.service;
	}
})(angular);