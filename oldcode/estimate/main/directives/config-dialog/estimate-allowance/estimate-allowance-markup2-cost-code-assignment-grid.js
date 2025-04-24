
(function(angular) {
	/* global globals */
	'use strict';
	let moduleName = 'estimate.main';
	angular.module(moduleName).directive('estimateAllowanceMarkup2CostCodeAssignmentGrid', [
		function () {
			return {
				scope: true,
				restrict: 'A',
				templateUrl: globals.appBaseUrl +'estimate.main/templates/estimate-allowance/estimate-allowance-markup2-cost-code-assignment-grid.html',
				compile: function(){
					return {
						pre : function(scope, iElem){
							iElem.on('$destroy', function() {
								scope.$destroy();
							});
						}
					};
				}
			};
		}
	]);

})(angular);
