(function (angular) {
	'use strict';


	angular.module('basics.procurementconfiguration').controller('procurementConfigurationTotalTypeFormulaErrorController',
		[ '$scope', '$translate','basicsProcurementConfigHeaderDataService', function ($scope, $translate,basicsProcurementConfigHeaderDataService) {

			var translatePrefix = 'basics.procurementconfiguration.';

			$scope.modalOptions = {
				header: {
					title: $translate.instant(translatePrefix + 'formulaErrorMessage')
				},
				body: {
					title:'The total formula "'+basicsProcurementConfigHeaderDataService.wrongFormula+'"could not be executed due to below reasons. Please check and fix.',
					detail:[
						{
							index:1,
							content:$translate.instant(translatePrefix + 'formulaSortingError')
						},
						{
							index:2,
							content:$translate.instant(translatePrefix + 'formulaCodeError')
						},
						{
							index:3,
							content:$translate.instant(translatePrefix + 'formulaReferError')
						},
						{
							index:4,
							content:$translate.instant(translatePrefix + 'formulaSelfError')
						},
					]
				},
				footer: {
					ok: $translate.instant('cloud.common.ok')
				},
				onOK: function () {
					$scope.$close(false);
				}
			};

		}]);

})(angular);