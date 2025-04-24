/**
 * Created by lcn on 10/19/2018.
 */

( function (angular) {
	'use strict';

	// eslint-disable-next-line no-redeclare
	/* global angular,globals */
	angular.module('procurement.common').directive('procurementCommonControllingUnitLookup', ['procurementPackageImportService',
		'procurementPackageImportWaringService',
		function (procurementPackageImportService,procurementPackageImportWaringService) {
			return{
				restrict:'A',
				scope:'=',
				templateUrl: globals.appBaseUrl + 'procurement.common/partials/prc-common-controlling-unit-lookup.html',
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