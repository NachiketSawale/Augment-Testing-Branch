(function (angular) {
	'use strict';
	/* globals angular, _ */
	var moduleName = 'transportplanning.transport';
	/**
	 * @ngdoc service
	 * @name transportplanningTransportResReservationReadOnlyProcessor
	 * @function
	 * @requires
	 *
	 * @description
	 * transportplanningTransportResReservationReadOnlyProcessor is the service to set fields readonly or editable.
	 *
	 */
	angular.module(moduleName).factory('transportplanningTransportResReservationReadOnlyProcessor', processor);

	processor.$inject = [
		'$injector',
		'platformRuntimeDataService',
		'transportplanningTransportRouteStatusLookupService'
	];

	function processor($injector,
					   platformRuntimeDataService,
					   routeStatusServ) {
		var service = {};

		service.processItem = function (item) {
			if (item && item.Version > 0) {
				var fields = ['Description', 'ResourceFk', 'ReservationTypeFk', 'RequisitionFk', 'ReservedFrom', 'ReservedTo', 'Quantity', 'UomFk', 'Comment', 'UserDefinedText01', 'UserDefinedText02', 'UserDefinedText03', 'UserDefinedText04', 'UserDefinedText05'];
				var route = $injector.get('transportplanningTransportMainService').getSelected();
				if (route) {
					var statusList = routeStatusServ.getList();
					var status = _.find(statusList, {Id: route.TrsRteStatusFk});
					var flag = status && status.IsInTransport === true;
					service.setColumnsReadOnly(item, fields, flag);
				}
			}
		};
		service.setColumnsReadOnly = function setColumnsReadOnly(item, columns, flag) {
			var fields = [];
			_.each(columns, function (column) {
				fields.push({field: column, readonly: flag});
			});
			platformRuntimeDataService.readonly(item, fields);
		};

		return service;
	}
})(angular);
