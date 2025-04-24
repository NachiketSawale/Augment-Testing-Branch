/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	/**
     * @ngdoc service
     * @name estimateMainPlantStructureImageProcessor
     * @function
     *
     * @description
     * The estimateMainPlantStructureImageProcessor adds appropriate images to plant group structure tree.
     */

	angular.module('estimate.main').factory('estimateMainPlantStructureImageProcessor', [function () {

		let service = {};

		service.processItem = function processItem(entity) {
			if (entity) {
				entity.image = entity.IsPlantGroup ? 'ico-resource-groups' : 'ico-equipment';
			}
		};

		return service;
	}]);
})(angular);
