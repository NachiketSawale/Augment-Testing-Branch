/**
 * Created by janas on 15.12.2014.
 */


(function (angular) {
	'use strict';
	/**
	 * @ngdoc service
	 * @name controllingStructureImageProcessor
	 * @function
	 *
	 * @description
	 * The controllingStructureImageProcessor adds appropriate images to controlling structure tree.
	 */

	angular.module('controlling.structure').factory('controllingStructureImageProcessor', ['_', '$injector', function (_, $injector) {

		var service = {};

		service.processItem = function processItem(unit) {
			if (unit) {
				// root (empty)
				if (unit.ControllingunitFk === null && !unit.HasChildren) {
					unit.image = 'ico-folder-empty';
				}
				// root (with children)
				else if (unit.ControllingunitFk === null && unit.HasChildren) {
					unit.image = 'ico-controlling-unit1';
				}
				// node
				else if (unit.ControllingunitFk && unit.HasChildren) {
					unit.image = 'ico-controlling-unit1';
				}
				// leaf
				else if (unit.ControllingunitFk && !unit.HasChildren) {
					unit.image = 'ico-controlling-unit2';
				}
			}
		};

		service.processTree = function (rootItems, optChildProp) {
			var flatItems = [];
			$injector.get('cloudCommonGridService').flatten(rootItems, flatItems, optChildProp || 'ControllingUnits');
			_.each(flatItems, service.processItem);
		};

		return service;
	}]);
})(angular);
