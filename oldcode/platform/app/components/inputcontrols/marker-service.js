/*
 * $Id: marker-service.js 467801 2017-11-13 12:55:59Z kh $
 * Copyright (c) RIB Software GmbH
 */

(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name platformMarkerDomainTypeService
	 * @function platformMarkerDomainTypeService
	 * @methodOf platformMarkerDomainTypeService
	 * @description service providing helper methods to be used in
	 * @returns {service} newly created service
	 */
	angular.module('platform').factory('platformMarkerDomainTypeService', platformMarkerDomainTypeService);

	platformMarkerDomainTypeService.$inject = ['$injector', '_'];

	function platformMarkerDomainTypeService($injector, _) {
		var service = {};

		service.handleSelection = function handleSelection(grid, columnDef, currentItem) {
			if ((columnDef.editorOptions && !columnDef.editorOptions.multiSelect) || (columnDef.formatterOptions && !columnDef.formatterOptions.multiSelect)) {
				if (!columnDef.editorOptions.service && _.isString(columnDef.editorOptions.serviceName)) { // jshint ignore:line
					columnDef.editorOptions.service = $injector.get(columnDef.editorOptions.serviceName);
				}

				if (columnDef.editorOptions.service) { // jshint ignore:line
					var refresh = false;
					_.each(_.filter(grid.getData().getFilteredItems().rows, columnDef.field, true), function (item) {
						if (item !== currentItem) {
							_.set(item, columnDef.field, false);
							refresh = true;
						}
					});
					/*_.each(_.filter(columnDef.editorOptions.service[columnDef.editorOptions.serviceMethod](), columnDef.field, true), function (item) {
						if (item !== currentItem) {
							_.set(item, columnDef.field, false);
							refresh = true;
						}
					});*/

					if (refresh) {
						grid.invalidate();
					}
				}
			}
		};

		service.postApplyValueCallback = function postApplyValueCallback(grid, item, columnDef) {
			service.handleSelection(grid.instance, columnDef, item);
		};

		return service;
	}
})(angular);

