// cost-group-catalog-image-processor.js

/**
 * Created by janas on 12.06.2015.
 */


/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function(angular) {
	'use strict';

	angular.module('estimate.main').factory('costGroupCatalogImageProcessor', [function () {

		let service = {};

		service.processItem = function processItem(entity) {
			if (entity) {
				entity.image = 'ico-folder-assemblies';
			}
		};

		return service;
	}]);
})(angular);
