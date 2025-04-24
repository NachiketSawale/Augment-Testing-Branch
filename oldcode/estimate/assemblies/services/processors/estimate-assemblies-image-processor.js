/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	/**
	 * @ngdoc service
	 * @name estimateAssembliesImageProcessor
	 * @function
	 *
	 * @description
	 * The estimateAssembliesImageProcessor adds appropriate images to assemblies.
	 */

	angular.module('estimate.assemblies').factory('estimateAssembliesImageProcessor', [function () {

		let service = {};

		service.processItem = function processItem(entity) {
			if (entity) {
				// root (empty)
				if (entity.EstLineItemFk === null && !entity.HasChildren) {
					entity.image = 'ico-folder-empty';
				}
				// root (with children)
				else if (entity.EstLineItemFk === null && entity.HasChildren) {
					entity.image = 'ico-folder-doc';
				}
				// node
				else if (entity.EstLineItemFk && entity.HasChildren) {
					entity.image = 'ico-folder-doc';
				}
				// leaf
				else if (entity.EstLineItemFk && !entity.HasChildren) {
					entity.image = 'ico-doc-position';
				}
			}
		};

		return service;
	}]);
})(angular);
