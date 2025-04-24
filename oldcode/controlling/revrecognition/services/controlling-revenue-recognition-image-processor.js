/**
 * Created by alm on 18.11.2021.
 */
(function (angular) {
	'use strict';

	angular.module('controlling.revrecognition').factory('controllingRevenueRecognitionImageProcessor', ['_', '$injector', function (_, $injector) {

		var service = {};

		service.processItem = function processItem(unit) {
			if (unit) {
				// root (empty)
				if (unit.ParentId === null && !unit.HasChildren) {
					unit.image = 'ico-folder-empty';
				}
				// root (with children)
				else if (unit.ParentId === null && unit.HasChildren) {
					unit.image = 'ico-controlling-unit1';
				}
				// node
				else if (unit.ParentId && unit.HasChildren) {
					unit.image = 'ico-controlling-unit1';
				}
				// leaf
				else if (unit.ParentId && !unit.HasChildren) {
					unit.image = 'ico-controlling-unit2';
				}
				if(unit.isBaseItem){
					unit.cssClass='font-italic';
				}
			}
		};

		service.processTree = function (rootItems, optChildProp) {
			var flatItems = [];
			$injector.get('cloudCommonGridService').flatten(rootItems, flatItems, optChildProp || 'PrrItemE2cChildren');
			_.each(flatItems, service.processItem);
		};

		return service;
	}]);
})(angular);
