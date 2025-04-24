/**
 * Created by lav on 11/22/2018.
 */
(function (angular) {
	'use strict';

	var moduleName = 'transportplanning.transport';

	angular.module(moduleName).factory('transportplanningTransportCreateTransportRouteDialogResReservationService', Service);

	Service.$inject = [
		'$injector',
		'transportplanningTransportCreateTransportRouteDialogServiceFactory',
		'platformModalService',
		'basicsLookupdataConfigGenerator',
		'packageTypes'];

	function Service($injector,
					 transportplanningTransportCreateTransportRouteDialogServiceFactory,
					 platformModalService,
					 basicsLookupdataConfigGenerator,
					 packageTypes) {

		var service = transportplanningTransportCreateTransportRouteDialogServiceFactory.createInstance({
			pkgType: packageTypes.ResourceReservation,
			resultName: 'ResReservations'
		});

		service.createItem = function () {
			var modalCreateConfig = {
				resizeable: true,
				templateUrl: globals.appBaseUrl + 'basics.lookupdata/partials/lookup-filter-dialog-form-grid.html',
				controller: 'transportplanningTransportResReservationLookupController'
			};
			platformModalService.showDialog(modalCreateConfig);
		};

		service.onAddNewItem = function (item) {
			item.PUomFk = item.UomFk;
			item.PQuantity = 1;
		};

		return service;
	}
})(angular);