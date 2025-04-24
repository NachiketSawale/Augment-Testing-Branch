/**
 * Created by alm on 22.04.2021.
 */
(function () {

	'use strict';
	var moduleName = 'procurement.common';

	/**
	 * @ngdoc controller
	 * @name procurementCommonUpdatePackageBoqController
	 * @function
	 *
	 * @description
	 * Controller for the update package boa
	 **/
	angular.module(moduleName).controller('procurementCommonUpdatePackageBoqController',
		['$scope',
			function ($scope) {

				$scope.onNewItemChange=function(value){
					if(!value){
						$scope.modalOptions.value.AddQuantity=false;
						$scope.modalOptions.value.AddPrice=false;
					}
				};

				$scope.onNewOptionChange=function(value){
					if(value) {
						$scope.modalOptions.value.AddNewItem = true;
					}
				};

			}
		]);
})();
