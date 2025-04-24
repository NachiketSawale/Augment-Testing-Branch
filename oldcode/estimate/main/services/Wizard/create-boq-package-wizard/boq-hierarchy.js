(function () {
	'use strict';
	const moduleName = 'estimate.main';
	angular.module(moduleName).constant('boqHierarchy', {
		projectBoqAndLineItem: 1, // project boq + line item as boq hierarchy
		lineItem: 2 //line item as boq hierarchy
	});
})();
