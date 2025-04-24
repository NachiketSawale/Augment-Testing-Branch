/**
 * Created by lnt on 2/5/2018.
 */

(function (angular) {
	'use strict';

	// qto detail: image and specification for formula
	angular.module('qto.main').controller('qtoMainFormulaSpecificationImageController',
		['$scope', 'qtoMainDetailService', 'singleImageControllerBase',
			function ($scope, dataService, singleImageControllerBase) {

				var options = {
					parentService: dataService,
					isMap: true
				};

				singleImageControllerBase($scope, options);

			}]);
})(angular);