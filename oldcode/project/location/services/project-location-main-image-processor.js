(function(angular) {
	'use strict';
	angular.module('project.location').factory('projectLocationMainImageProcessor', function() {

		var service = {};

		service.processItem = function processItem(item) {
			if (item.HasChildren) {
				item.image = item.isFilter ? 'ico-location-group-filter':'ico-location-group';
			}
			else {
				item.image = item.isFilter ? 'ico-location-filter' : 'ico-location2';
			}
		};

		return service;
	});
})(angular);
