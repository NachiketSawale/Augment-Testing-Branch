(function (angular) {
	'use strict';
	angular.module('procurement.common').factory('procurementCommonDataImageProcessor',
		['platformObjectHelper',function (platformObjectHelper) {
			return function(parentProp,collapsed){
				return {
					processItem : function processItem(item) {
						var parentId = platformObjectHelper.getValue(item, parentProp || 'DataFk');
						if (!parentId || parentId < 1) {
							item.image = 'ico-accordion-root';
							item.nodeInfo = item.nodeInfo || {level:0};
							item.nodeInfo.collapsed = angular.isFunction(collapsed)?collapsed(item):!!collapsed;
						}
						else if (parentId === 1) {
							item.image = 'ico-accordion-grp';
						}
						else {
							item.image = 'ico-accordion-pos';
						}
					}
				};
			};
		}]);
})(angular);