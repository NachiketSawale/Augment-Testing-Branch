/*
* $Id$
* Copyright (c) RIB Software AG
*/

(function (ng) {
	'use strict';

	ng.module('controlling.projectcontrols').factory('controllingProjectcontrolsVersionComparisonStructureService', [
		'$injector',
		'groupingItemStructureServiceFactory',
		'projectControlsGroupingType',
		function ($injector, groupingItemStructureServiceFactory, projectControlsGroupingType) {
			const dataService = $injector.get('controllingProjectcontrolsVersionComparisonService');
			return groupingItemStructureServiceFactory.createStructureService(dataService, 'Controlling.Projectcontrols', projectControlsGroupingType);
		}
	]);

})(angular);
