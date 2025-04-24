/**
 * Created by wwa on 10/8/2015.
 */
(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,console */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module('procurement.package').controller('procurementPackageEvaluateEventsWizardController',
		['$scope', '$translate', 'procurementPackageWizardEvalutionEventsService',
			function ($scope, $translate, evalutionEventsService) {

				$scope.options = $scope.$parent.modalOptions;

				var extraInfo = $scope.options.StructureFk ? '' : ': (current package structure not exist)';
				var projectInfo = evalutionEventsService.getProjectInfo($scope.options.ProjectFk);

				angular.extend($scope.options,{
					body: {
						bodyTitle:$translate.instant('procurement.package.wizard.evaluationEvents.bodyOptions'),
						selectCurrentItem: $translate.instant('procurement.package.wizard.evaluationEvents.selectCurrentItem',{'code' : extraInfo}),
						selectAllItems:$translate.instant('procurement.package.wizard.evaluationEvents.selectAllItems',{'code' : projectInfo}),
						radioSelect: $scope.options.StructureFk ? 'CurrentItem' : 'AllItems'
					},
					onOK: function(){
						console.log($scope.options.body.radioSelect);
						if($scope.options.body.radioSelect === 'CurrentItem'){
							$scope.$close({ProjectFk: -1});
						}else{
							$scope.$close({ProjectFk: $scope.options.ProjectFk});
						}
					}
				});
			}]);
})(angular);
