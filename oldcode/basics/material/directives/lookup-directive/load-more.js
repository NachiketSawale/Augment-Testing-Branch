/**
 * Created by wui on 12/6/2018.
 */

(function (angular) {
	'use strict';

	var moduleName = 'basics.material';

	angular.module(moduleName).directive('basicsMaterialLoadMore', ['$timeout',
		function ($timeout) {
			var moreHtml = '<a data-ng-click="more()" class="cursor-pointer" data-ng-hide="loading || hideMore">More</a>';
			var loadingHtml = '<span data-ng-show="loading"><a>Loading</a><span class="spinner-sm margin-left-md"></span></span>';
			var noMoreHtml = '<span data-ng-show="hideMore && !removeMore">There is no more content</span>';

			return {
				restrict: 'A',
				template: moreHtml + loadingHtml + noMoreHtml,
				scope: {
					load: '&'
				},
				link: function (scope) {
					scope.loading = false;
					scope.hideMore = false;
					scope.removeMore = false;

					scope.more = function () {
						scope.loading = true;

						scope.load().then(function (data) {
							if(!data || !data.length){
								scope.hideMore = true;
								$timeout(function () {
									scope.removeMore = true;
								}, 2000);
							}
						}).finally(function () {
							scope.loading = false;
						});
					};
				}
			};
		}
	]);

})(angular);