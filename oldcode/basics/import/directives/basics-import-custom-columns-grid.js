(function (angular) {

	'use strict';

	var moduleName = 'basics.import';

	angular.module(moduleName).directive('basicsImportCustomColumnsGrid', ['$q', '$templateCache',
		function ($q, $templateCache) {
			return {
				restrict: 'AE',
				scope: {
					mode: '=',
					destinationFields: '=',
					sourceFields: '=',
					gridColumns:'=',
					gridData:'=',
					transLate:'=',
					columnName:'=',
				},
				template : $templateCache.get('basics-import-custom-grid.html')
			};
		}
	]);

})(angular);
