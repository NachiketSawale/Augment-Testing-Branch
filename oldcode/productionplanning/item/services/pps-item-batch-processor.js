/**
 * Created by zwz on 12/22/2021.
 */
(function (angular) {
	'use strict';
	var moduleName = 'productionplanning.item';

	angular.module(moduleName).service('productionplanningItemBatchProcessor', Processor);

	Processor.$inject = ['_'];
	function Processor(_) {
		this.processItems = function (items) {
			function flatten(input, output, childProp) {
				var i;
				for (i = 0; i < input.length; i++) {
					output.push(input[i]);
					if (input[i][childProp] && input[i][childProp].length > 0) {
						flatten(input[i][childProp], output, childProp);
					}
				}
				return output;
			}

			function getRootFk(currentItemId, items){
				var currentItem = _.find(items, {Id: currentItemId});
				if(currentItem && !_.isNil(currentItem.PPSItemFk)){
					return getRootFk(currentItem.PPSItemFk, items);
				}
				return currentItemId;
			}
			function setRootFk(items){
				_.each(items,function (item){
					if(_.isNil(item.PPSItemFk)){
						item.RootFk = null;
					}
					else {
						item.RootFk = getRootFk(item.PPSItemFk, items);
					}
				});
			}

			var flatItems = [];
			flatten(items, flatItems, 'ChildItems');
			setRootFk(flatItems); // RootFk will be used in ReassignedProductController for setting PU filter on "To be Reassigned Product" container
		};
	}
})(angular);
