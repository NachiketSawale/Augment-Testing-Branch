/**
 * Created by janas on 12.06.2015.
 */
/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	/**
	 * @ngdoc service
	 * @name estimateAssembliesStructureImageProcessor
	 * @function
	 *
	 * @description
	 * The estimateAssembliesStructureImageProcessor adds appropriate images to assembly structure tree.
	 */

	angular.module('estimate.assemblies').factory('estimateAssembliesStructureImageProcessor', [function () {

		let service = {};

		service.processItem = function processItem(entity) {
			if (entity) {
				// root (empty): entity.EstAssemblyCatFk === null && !entity.HasChildren
				// root (with children): entity.EstAssemblyCatFk === null && entity.HasChildren
				// node: entity.EstAssemblyCatFk && entity.HasChildren
				// leaf: entity.EstAssemblyCatFk && !entity.HasChildren

				entity.image = 'ico-folder-assemblies';
			}
		};

		return service;
	}]);
})(angular);
