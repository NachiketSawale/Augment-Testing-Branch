/**
 * Created by janas on 06.07.2018.
 */
(function (angular) {
	'use strict';
	/**
	 * jasmine custom equality tester for controlling unit structures
	 */
	function unitTreeEquality(first, second) {
		// helper functions
		function prepare2Compare(tree, childProp) {
			// TODO: better define which properties should not be included, instead defining which should be tested?
			// imagine there are new properties. how would be the behaviour of this routine?
			var result = [];
			childProp = childProp || 'ControllingUnits';
			_.each(tree, function (item) {
				var copy = {
					Code: item.Code,
					Description: item.DescriptionInfo ? item.DescriptionInfo.Translated : item.Description,
					Assignment01: item.Assignment01,
					Assignment02: item.Assignment02,
					Assignment03: item.Assignment03,
					Assignment04: item.Assignment04,
					Assignment05: item.Assignment05,
					Assignment06: item.Assignment06,
					Assignment07: item.Assignment07,
					Assignment08: item.Assignment08,
					Assignment09: item.Assignment09,
					Assignment10: item.Assignment10
				};
				result.push(copy);
				copy[childProp] = prepare2Compare(item[childProp], childProp); // children?
			});
			return result;
		}

		function isControllingUnitStructure(obj) {
			return _.isArray(obj) &&
				_.has(_.first(obj), 'Code') &&
				_.has(_.first(obj), 'ControllingUnits');
		}

		// both controlling unit structures?
		if (isControllingUnitStructure(first) && isControllingUnitStructure(second)) {
			return _.isEqual(prepare2Compare(first), prepare2Compare(second));
		}
	}
})(angular);

