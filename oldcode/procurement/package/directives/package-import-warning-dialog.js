/**
 * Created by chk on 6/16/2016.
 */
( function (angular) {
	'use strict';

	// eslint-disable-next-line no-redeclare
	/* global angular,globals */
	angular.module('procurement.package').directive('packageImportWarningDialog', ['procurementPackageImportService',
		'procurementPackageImportWaringService',
		function (procurementPackageImportService,procurementPackageImportWaringService) {
			return{
				restrict:'A',
				scope:'=',
				templateUrl: globals.appBaseUrl + 'procurement.package/partials/procurement-package-import-dialog.html',
				link:linker
			};
			function linker(scope){
				scope.search = function(){
					procurementPackageImportWaringService.showWarningDialog();
				};

				if(procurementPackageImportService.hasSelection()){
					scope.WarningMessage = procurementPackageImportService.getSelected().WarningMessage;
				}
			}
		}
	]);
})(angular);