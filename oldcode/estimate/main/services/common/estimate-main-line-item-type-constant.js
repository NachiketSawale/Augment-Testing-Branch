/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function(angular) {
	'use strict';
	angular.module('estimate.main').constant('estimateMainLineItemType', {
		LineItem: 0,
		Assembly: 1,
		PlantAssembly: 2
	});
})(angular);