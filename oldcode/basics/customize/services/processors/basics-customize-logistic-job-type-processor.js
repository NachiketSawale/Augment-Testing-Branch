(function (angular) {
	'use strict';
	/**
	 * @ngdoc service
	 * @name basicsCustomizeTypeProcessor
	 * @function
	 *
	 * @description
	 * The basicsCustomizeTypeProcessor set the type property documentation readonly
	 */

	angular.module('basics.customize').service('basicsCustomizeLogisticJobTypeProcessor', BasicsCustomizeLogisticJobTypeProcessor);

	BasicsCustomizeLogisticJobTypeProcessor.$inject = ['platformRuntimeDataService'];

	function BasicsCustomizeLogisticJobTypeProcessor(platformRuntimeDataService) {
		this.processItem = function processItem(type) {
			if (type) {
				var fields = [
					{
						field: 'HasLoadingCost',
						readonly: !type.IsJointVenture
					}
				];
				platformRuntimeDataService.readonly(type, fields);
			}
		};
	}
})(angular);