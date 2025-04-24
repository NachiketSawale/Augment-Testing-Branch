/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	let moduleName = 'estimate.parameter';
	angular.module(moduleName).factory('estimateParameterProcessor', ['_', function (_) {
		let service = {};

		service.assignParameters = function assignParameters(sourceItems, destItem){
			if(destItem && destItem.Id){

				let paramItems = destItem.Param;

				if(paramItems) {
					angular.forEach(sourceItems, function(sourceItem){
						if (!_.find(paramItems, function(code){ return (code === sourceItem.Code); })) {
							paramItems.push(sourceItem);
						}

					});

				}
				if(paramItems && paramItems.length > 0) {
					destItem.Param = paramItems;
				}
			}
		};

		return service;
	}]);
})(angular);
