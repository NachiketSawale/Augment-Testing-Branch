/*
* $Id$
* Copyright (c) RIB Software AG
*/

(function (ng) {
	'use strict';

	ng.module('awp.main').factory('awpGroupingItemStructureService', [
		'$injector',
		'groupingItemStructureServiceFactory',
		'awpGroupingType',
		function ($injector, groupingItemStructureServiceFactory, awpGroupingType) {
			const dataService = $injector.get('awpPackageStructureLineItemService');
			return groupingItemStructureServiceFactory.createStructureService(dataService, 'awp.main', awpGroupingType);
		}
	]);

})(angular);