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

	angular.module('basics.customize').service('basicsCustomizeTypeDocumentationProcessor', BasicsCustomizeTypeDocumentationProcessor);

	BasicsCustomizeTypeDocumentationProcessor.$inject = ['platformRuntimeDataService'];

	function BasicsCustomizeTypeDocumentationProcessor(platformRuntimeDataService) {
		this.processItem = function processItem(type) {
			if(type && type.Documentation) {
				platformRuntimeDataService.readonly(type.Documentation, [{ field: 'Documentation', readonly: true }]);
			}
		};
	}
})(angular);