/**
 * Created by lvi on 12/10/2014.
 */
(function (angular) {
	'use strict';


	angular.module('qto.formula').controller('qtoFormulaImageController',
		['$scope', 'qtoFormulaDataService', 'singleImageControllerBase',
			function ($scope, dataService, singleImageControllerBase) {

				var options = {
					parentService: dataService
				};

				singleImageControllerBase($scope, options);

			}]);
})(angular);