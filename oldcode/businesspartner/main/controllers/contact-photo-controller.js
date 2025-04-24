(function (angular) {
	'use strict';

	angular.module('businesspartner.main').controller('businesspartnerMainContactPhotoController',
		['$scope', 'basicsCommonPhotoControllerBase', 'businesspartnerMainContactPhotoDataService',
			function ($scope, basicsCommonPhotoControllerBase, businesspartnerMainContactPhotoDataService) {

				basicsCommonPhotoControllerBase($scope, businesspartnerMainContactPhotoDataService, {isSingle: true});
			}]);

})(angular);