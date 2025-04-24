/**
 * Created by wui on 8/2/2017.
 */
(function (angular) {
	'use strict';

	var moduleName = 'basics.material';

	/**
	 * Similar with ngInclude directive, but it doesn't create a new scope.
	 */
	angular.module(moduleName).directive('basicsMaterialInclude', ['$sce', '$compile', '$templateRequest',
		function ($sce, $compile, $templateRequest) {
			return {
				priority: 400, // the same as ngInclude
				link: function (scope, element, attrs) {
					// the template URL is restricted to the same domain and protocol as the application document
					$templateRequest($sce.getTrustedResourceUrl(attrs.basicsMaterialInclude)).then(function (res) {
						element.append($compile(res)(scope));
					});
				}
			};
		}
	]);

})(angular);