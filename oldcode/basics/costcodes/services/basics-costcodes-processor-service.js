/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	let moduleName = 'basics.costcodes';

	angular.module(moduleName).factory('basicsCostCodesProcessorService', ['platformRuntimeDataService',
		function(platformRuntimeDataService){

			function processItem(item) {
				if(!item){
					return;
				}
				let fields = [
					{field: 'IsSubcontractedWork', readonly: item.CostCodeParentFk !== null}
				];
				platformRuntimeDataService.readonly(item, fields);
			}

			function recurseCostCode(costCodes) {
				_.forEach(costCodes, cc => {
					processItem(cc);
					if (cc && cc.CostCodes && cc.CostCodes.length > 0) {
						recurseCostCode(cc.CostCodes);
					}
				});
			}

			// Process the children of the major cost code
			function processChildren(rootParentItem) {
			  processItem(rootParentItem);
				if (rootParentItem && rootParentItem.CostCodes) {
					recurseCostCode(rootParentItem.CostCodes);
				}
			}

			return {
				processItem: processItem,
				processChildren: processChildren
			};
		}
	]);

})(angular);