(function (angular) {
	/* global _ */
	'use strict';
	angular.module('productionplanning.item').value('entityImageMap', {
		J: 'app-small-icons ico-project', // Project
		H: 'app-small-icons ico-production-orders', // PPS Header
		I: 'app-small-icons ico-production-planning', // PPS Item
		E: 'app-small-icons ico-production-steps', // Events (I...E, P...E)
		R: 'app-small-icons ico-requisition', // Mounting Requisition
		D: 'app-small-icons ico-folder-doc', // Default,
		P: 'app-small-icons ico-product', // Product
		A: 'app-small-icons ico-mounting-activity'  // mounting activity
	});

	angular.module('productionplanning.item').factory('ppsItemMultishiftWizardImageProcessor',
		['entityImageMap', function (entityImageMap) {

			var service = {};

			service.processItem = function processItem(item) {
				var identify = getEntityIdentify(item);
				item.image = entityImageMap[identify];
			};

			service.processEntities = function (entities, childProp) {
				_.forEach(entities, function (entity) {
					service.processItem(entity);
					service.processEntities((entity[childProp]));
				});
			};

			function getEntityIdentify(item) {
				if (!_.isEmpty(item.Id)) {
					var firstChar = item.Id[0];
					switch (firstChar) {
						case 'I':
						case 'P':
							if (item.EventTypeFk > 0) {
								firstChar = 'E';
							} else if (item.Id[1] === 'J') {
								firstChar = 'J';
							}
							break;
						case 'R':
							if (item.EventTypeFk > 0) {
								firstChar = 'A';
							}
							break;
						default:
							break;
					}
					return firstChar;
				}
				return 'D';
			}

			return service;
		}]);
})(angular);
