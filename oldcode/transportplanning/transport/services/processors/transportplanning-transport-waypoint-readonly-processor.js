(function (angular) {
	'use strict';
	/* globals angular, _ */
	var moduleName = 'transportplanning.transport';
	/**
	 * @ngdoc service
	 * @name transportplanningTransportWaypointReadOnlyProcessor
	 * @function
	 * @requires
	 *
	 * @description
	 * transportplanningTransportWaypointReadOnlyProcessor is the service to set fields readonly or editable.
	 *
	 */
	angular.module(moduleName).factory('transportplanningTransportWaypointReadOnlyProcessor', processor);

	processor.$inject = [
		'$injector',
		'basicsCommonReadOnlyProcessor',
		//'platformContextService',
		'platformRuntimeDataService',
		'transportplanningTransportRouteStatusLookupService'
	];

	function processor($injector,
					   commonReadOnlyProcessor,
					   //platformContextService,
					   platformRuntimeDataService,
					   routeStatusServ) {


		var service = commonReadOnlyProcessor.createReadOnlyProcessor({
			uiStandardService: 'transportplanningTransportWaypointUIStandardService'
		});

		service.processItem = function (item) {
			if (item && item.Version > 0) {
				var parentItem = $injector.get('transportplanningTransportMainService').getSelected();
				if (parentItem && parentItem.readonly) {//remark:field "readonly" of route entity is set in transportplanningTransportReadOnlyProcessor
					service.setRowReadonlyFromLayout(item, true);
				}
				else {
					if (item.TrsRouteFk) {
						var statusList = routeStatusServ.getList();
						var status = _.find(statusList, {Id: parentItem.TrsRteStatusFk});
						var flag = status && status.IsInTransport === true;
						service.setColumnsReadOnly(item, ['Code', 'PlannedTime','IsDefaultSrc','IsDefaultDst'], flag);
					}
				}
				service.setColumnsReadOnly(item, ['LgmJobFk'], true);
			}
			service.setColumnsReadOnly(item, ['BusinessPartnerFk'], !item.LgmJobFk);
			service.setColumnsReadOnly(item, ['DeliveryAddressContactFk'], _.isNil(item.BusinessPartnerFk));
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
