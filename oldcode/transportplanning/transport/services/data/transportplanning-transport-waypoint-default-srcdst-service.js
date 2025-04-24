(function (angular) {
	'use strict';

	var moduleName = 'transportplanning.transport';

	angular.module(moduleName).constant('waypointDefaultSrcDstTypes', {
		None: 0,
		Source: 1,
		Destination: 2,
		Both: 3
	});

	angular.module(moduleName).factory('transportplanningTransportWaypointDefaultSrcDstService', DefaultSrcDstService);

	DefaultSrcDstService.$inject=['waypointDefaultSrcDstTypes', '$translate'];

	function DefaultSrcDstService(defaultSrcDstTypes, $translate) {
		var service = {};

		service.getItemById = function (id) {
			var item = {};

			switch (id) {
				case defaultSrcDstTypes.None: {
					item = {
						Id: 0,
						Name: ''
					};
				} break;
				case defaultSrcDstTypes.Source: {
					item = {
						Id: 1,
						Name: $translate.instant('transportplanning.transport.defaultSource')
					};
				} break;
				case defaultSrcDstTypes.Destination: {
					item = {
						Id: 2,
						Name: $translate.instant('transportplanning.transport.defaultDestination')
					};
				} break;
				case defaultSrcDstTypes.Both: {
					item = {
						Id: 3,
						Name: $translate.instant('transportplanning.transport.defaultSourceAndDestination')
					};
				} break;
				default: break;
			}

			return item;
		};

		service.select = function (item) {
			var image = '';

			if (!_.isNil(item)) {
				switch (item.Id) {
					case defaultSrcDstTypes.Source: image = 'cloud.style/content/images/control-icons.svg#ico-transport-delivery'; break;
					case defaultSrcDstTypes.Destination: image = 'cloud.style/content/images/control-icons.svg#ico-transport-return'; break;
					case defaultSrcDstTypes.Both: image = 'cloud.style/content/images/control-icons.svg#ico-transport-reloc-int'; break;
					default: break;
				}
			}

			return image;
		};

		service.isCss = function () {
			return true;
		};

		service.updateSrcDst = function (waypoint) {
			if (waypoint.IsDefaultSrc === true && waypoint.IsDefaultDst === true) {
				waypoint.DefaultSrcDst = defaultSrcDstTypes.Both;
			} else if (waypoint.IsDefaultDst === true) {
				waypoint.DefaultSrcDst = defaultSrcDstTypes.Destination;
			} else if (waypoint.IsDefaultSrc === true) {
				waypoint.DefaultSrcDst = defaultSrcDstTypes.Source;
			} else {
				waypoint.DefaultSrcDst = defaultSrcDstTypes.None;
			}
		};

		return service;
	}

})(angular);