(function (angular) {
	'use strict';
	/* globals angular */
	var moduleName = 'transportplanning.transport';
	/**
	 * @ngdoc service
	 * @name transportplanningTransportWaypointProcessor
	 * @function
	 * @requires
	 *
	 * @description
	 * transportplanningTransportWaypointProcessor is the service to process fields.
	 *
	 */
	angular.module(moduleName).factory('transportplanningTransportWaypointProcessor', transportplanningTransportWaypointProcessor);

	transportplanningTransportWaypointProcessor.$inject = [
		'$injector',
		'moment',
		'transportplanningTransportWaypointDefaultSrcDstService'
	];

	function transportplanningTransportWaypointProcessor($injector,
														 moment,
														 defaultSrcDstService) {
		var service = {};

		service.processItem = function processItem(item) {
			var parentItem = $injector.get('transportplanningTransportMainService').getSelected();
			// if (item.Version === 0) {
			// 	service.InitPlannedTime(item, parentItem);
			// }
			defaultSrcDstService.updateSrcDst(item);
		};

		service.InitPlannedTime = function (item, parentItem) {
			if (!item.ignoreInitPlannedTime) {
				var dataServ = $injector.get('transportplanningTransportWaypointDataService');
				var list = dataServ.getList();
				service.InitPlannedTime1(item, parentItem, list);
			}
		};

		service.InitPlannedTime1 = function (item, parentItem, list) {
			if (!list || list.length < 1 || (list.length === 1 && list[0].Id === item.Id)) {
				item.PlannedTime = parentItem.PlannedStart.clone();
			}
			else {
				var maxDateTime = _.max(_.map(list, 'PlannedTime'));
				var momentStr = _.clone(moment(maxDateTime)).add(1, 'hours').format('YYYY-MM-DDTHH:mm:ssZ');
				item.PlannedTime = moment.utc(momentStr);
			}
		};

		return service;
	}
})(angular);
