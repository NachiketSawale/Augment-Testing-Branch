/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	/**
	 * @ngdoc service
	 * @name controllingControllingunittemplateImageProcessor
	 * @function
	 *
	 * @description
	 * The controllingControllingunittemplateImageProcessor adds appropriate images to controlling unit template tree.
	 */
	angular.module('controlling.controllingunittemplate').factory('controllingControllingunittemplateImageProcessor', ['_', '$injector', function (_, $injector) {

		var service = {};

		service.processItem = function processItem(unit) {
			if (unit) {
				// root (empty)
				if (unit.ControltemplateUnitFk === null && !unit.HasChildren) {
					unit.image = 'ico-folder-empty';
				}
				// root (with children)
				else if (unit.ControltemplateUnitFk === null && unit.HasChildren) {
					unit.image = 'ico-controlling-unit1';
				}
				// node
				else if (unit.ControltemplateUnitFk && unit.HasChildren) {
					unit.image = 'ico-controlling-unit1';
				}
				// leaf
				else if (unit.ControltemplateUnitFk && !unit.HasChildren) {
					unit.image = 'ico-controlling-unit2';
				}
			}
		};

		service.processTree = function (rootItems, optChildProp) {
			var flatItems = [];
			$injector.get('cloudCommonGridService').flatten(rootItems, flatItems, optChildProp || 'ControltemplateUnitChildren');
			_.each(flatItems, service.processItem);
		};

		return service;
	}]);
})(angular);
