(function (angular) {
	'use strict';
	let moduleName = 'businesspartner.contact';

	/**
	 * @ngdoc controller
	 * @name businesspartnerContactPhotoController
	 * @requires
	 * @description
	 * #
	 * Controller for businesspartner contact 'contact photo' container.
	 */
	angular.module(moduleName).controller('businesspartnerContactPhotoController', [
		'$scope', 'basicsCommonPhotoControllerBase', 'businesspartnerContactPhotoDataService',
		function ($scope, basicsCommonPhotoControllerBase, businesspartnerContactPhotoDataService) {

			basicsCommonPhotoControllerBase($scope, businesspartnerContactPhotoDataService, {isSingle: true});
		}
	]);
})(angular);