/*
 * Copyright(c) RIB Software GmbH
 */

(function () {
	'use strict';

	const moduleName = 'basics.material';

	angular.module(moduleName).controller('basicsMaterialFilterSaveOptionsController', ['$scope', '$translate',
		function ($scope, $translate) {

			$scope.options = [
				{
					asChange: true,
					title: $translate.instant('basics.material.lookup.filter.saveChanges')
				},
				{
					asCopy: true,
					title: $translate.instant('basics.material.lookup.filter.saveAsCopy')
				}
			];

			$scope.select = function (option) {
				$scope.$close(option);
			};
		}
	]);

})();