(angular => {
	'use strict';
	const moduleName = 'productionplanning.drawing';
	
	angular.module(moduleName).constant('previewResultType', {
		drawing: 'Drawing',
		element: 'Element',
		article: 'Article',
	});
})(angular);