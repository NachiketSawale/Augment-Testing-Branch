/**
 * Created by pel on 7/12/2018.
 */
/* global  */
(function (angular) {
	'use strict';

	angular.module('defect.main').controller('defecdtMainPhotoController',
		['$scope', 'basicsCommonImageControllerBase', 'defectMainPhotoDataService',
			function ($scope, basicsCommonImageControllerBase, defectMainPhotoDataService) {
				basicsCommonImageControllerBase($scope, defectMainPhotoDataService);

			}]);

})(angular);
