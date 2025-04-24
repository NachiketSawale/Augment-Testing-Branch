/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	/**
	 * @ngdoc service
	 * @name basicsCostCodesCompanyProcessor
	 * @function
	 *
	 * @description
	 * The basicsCostCodesCompanyProcessor check for same master data context company.
	 */

	angular.module('basics.costcodes').factory('basicsCostCodesCompanyProcessor', ['basicsCostCodesMainService', 'platformRuntimeDataService',
		function (basicsCostCodesMainService, platformRuntimeDataService) {

			let contextFk = null,
				fields = [
					{field: 'IsChecked', readonly: true}
				];

			function getContextId() {
				let ccItem = basicsCostCodesMainService.getSelected();
				return ccItem ? ccItem.ContextFk : 0;
			}

			function processItem(item) {
				contextFk = !contextFk ? getContextId() : contextFk;
				if(item && item.MdcContextFk !== contextFk){
					platformRuntimeDataService.readonly(item, fields);
				}
			}

			return {
				processItem : processItem
			};

		}]);
})(angular);