(function (angular) {

	'use strict';

	var moduleName = 'basics.import';

	angular.module(moduleName).directive('basicsImportCustomWizardGrid', ['$q', '$templateCache',
		function ($q, $templateCache) {
			return {
				restrict: 'AE',
				scope: {
					gridColumns: '=',
					gridData: '=',
					mode: '=',
				},
				template: $templateCache.get('basics-import-custom-wizard-grid.html')
			};
		}
	]);




})(angular);
