(function (angular) {
	'use strict';
	/**
	 * @ngdoc service
	 * @name basicsCustomizePropertyFilterService
	 * @function
	 *
	 * @description
	 * The basicsCustomizePropertyFilterService manages hidden, i.e. filtered, properties of the different types
	 */

	angular.module('basics.customize').service('basicsCustomizePropertyFilterService', BasicsCustomizePropertyFilterService);

	function BasicsCustomizePropertyFilterService() {
		var data = {};
		this.takeHiddenFieldsForType = function takeHiddenFieldsForType(type, propFilter) {
			data[type.ClassName] = propFilter;
		};

		this.getHiddenFieldsForType = function getHiddenFieldsForType(type) {
			if(type) {
				return data[type.ClassName];
			}

			return null;
		};
	}
})(angular);