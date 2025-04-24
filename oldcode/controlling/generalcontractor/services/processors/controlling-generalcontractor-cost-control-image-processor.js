

(function (angular) {
	'use strict';
	angular.module('controlling.generalcontractor').factory('controllingGeneralcontractorCostControlImageProcessor', ['_', '$injector', function (_, $injector) {

		let service = {};

		service.processItem = function processItem(unit) {
			if (unit) {
				// root (empty)
				if (unit.MdcControllingUnitFk === null && !unit.CostControlVChildren) {
					unit.image = 'ico-folder-empty';
				}
				// root (with children)
				else if (unit.MdcControllingUnitFk === null && unit.CostControlVChildren.length) {
					unit.image = 'ico-controlling-unit1';
				}
				// node
				else if (unit.MdcControllingUnitFk && unit.CostControlVChildren.length) {
					unit.image = 'ico-controlling-unit1';
				}
				// leaf
				else if (unit.MdcControllingUnitFk && !unit.CostControlVChildren.length) {
					unit.image = 'ico-controlling-unit2';
				}

				if(unit.ElementType === 2){
					unit.image = 'ico-boq-note';
				}

				if(unit.IsParent ===-1){
					unit.image = 'ico-boq-textelement';
				}
			}
		};

		service.processTree = function (rootItems, optChildProp) {
			let flatItems = [];
			$injector.get('cloudCommonGridService').flatten(rootItems, flatItems, optChildProp || 'CostControlChildren');
			_.each(flatItems, service.processItem);
		};

		return service;
	}]);
})(angular);
