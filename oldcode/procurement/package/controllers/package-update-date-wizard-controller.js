/**
 * Created by wwa on 9/23/2016.
 */
(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,console */

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module('procurement.package').controller('procurementPackageUpdateDateWizardController',
		['$scope', '$translate',
			function ($scope, $translate) {

				$scope.options = $scope.$parent.modalOptions;

				angular.extend($scope.options,{
					body: {
						containerItems: $translate.instant('procurement.package.wizard.updateDate.containerItems'),
						allItems: $translate.instant('procurement.package.wizard.updateDate.allItems'),
						radioSelect: 'containerItems'
					},
					onOK: function(){
						console.log($scope.options.body.radioSelect);
						if($scope.options.body.radioSelect === 'containerItems'){
							$scope.$close({isUpdateAll: false});
						}else{
							$scope.$close({isUpdateAll: true});
						}
					}
				});
			}]);
})(angular);