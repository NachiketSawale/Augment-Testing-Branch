(function (angular) {
	'use strict';
	/**
	 * @ngdoc service
	 * @name basicsCustomizePropertyFilterProcessor
	 * @function
	 *
	 * @description
	 * The basicsCustomizePropertyFilterProcessor initializes the property filterer services.
	 */

	angular.module('basics.customize').service('basicsCustomizePropertyFilterProcessor', BasicsCustomizePropertyFilterProcessor);

	BasicsCustomizePropertyFilterProcessor.$inject = ['_', 'basicsCustomizePropertyFilterService'];

	function BasicsCustomizePropertyFilterProcessor(_, basicsCustomizePropertyFilterService) {
		this.processItem = function processItem(type) {
			if(type && type.Properties && _.some(type.Properties, { IsHidden: true })) {
				var hidden = _.filter(type.Properties, { IsHidden: true });
				basicsCustomizePropertyFilterService.takeHiddenFieldsForType(type, _.map(hidden, function(toFilter) { return toFilter.Name;}));
			}
		};
	}
})(angular);