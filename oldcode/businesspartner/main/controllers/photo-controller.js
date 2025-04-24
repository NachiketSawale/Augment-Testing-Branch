(function (angular) {
	'use strict';

	angular.module('businesspartner.main').controller('businesspartnerMainPhotoController',
		['$scope', 'basicsCommonPhotoControllerBase', 'businesspartnerMainPhotoDataService',
			function ($scope, basicsCommonPhotoControllerBase, businesspartnerMainPhotoDataService) {

				basicsCommonPhotoControllerBase($scope, businesspartnerMainPhotoDataService);

			}]);

})(angular);