/**
 * Created by zwz on 10/16/2018.
 */
(function () {
	'use strict';
	/* global angular*/
	var moduleName = 'transportplanning.transport';

	angular.module(moduleName).constant('waypointActionTypes', {
		Pickup: 1,
		Dropoff: 2
	});

	/**
	 * @ngdoc service
	 * @name transportplanningTransportWaypointPackageActionImageProcessor
	 * @function
	 *
	 * @description generate group icons
	 *
	 */
	angular.module(moduleName).service('transportplanningTransportWaypointPackageActionImageProcessor', processor);

	processor.$inject = ['platformIconBasisService', 'waypointActionTypes'];

	function processor(platformIconBasisService, waypointActionTypes) {

		var icons = [];
		var service = {};

		var clearCache = function clearCache() {
			icons = [];
		};

		service.setIcons = function setGroupIcons() {
			clearCache();
			platformIconBasisService.setBasicPath('');

			icons.push(platformIconBasisService.createCssIconWithId(waypointActionTypes.Pickup, '', 'control-icons ico-indicator3-2'));
			icons.push(platformIconBasisService.createCssIconWithId(waypointActionTypes.Dropoff, '', 'control-icons ico-indicator3-0'));

			platformIconBasisService.extend(icons, this);
		};

		return service;
	}
})();

