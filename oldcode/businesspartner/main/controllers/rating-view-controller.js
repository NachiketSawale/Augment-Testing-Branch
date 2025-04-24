(function (angular) {
	'use strict';
	angular.module('businesspartner.main').controller('businesspartnerMainRatingViewController',
		['$scope', 'businesspartnerMainRatingViewDataService',
			function ($scope, businesspartnerMainRatingViewDataService) {
				$scope.getShow = function (index) {
					let item = businesspartnerMainRatingViewDataService.getList()[0];
					return item && (item.Rating === index || (item.Rating > 1 && index === 0));
				};
			}
		]);

	/** @namespace item.Rating */
})(angular);