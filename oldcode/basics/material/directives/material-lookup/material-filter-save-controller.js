/*
 * Copyright(c) RIB Software GmbH
 */

(function () {
	'use strict';

	const moduleName = 'basics.material';

	angular.module(moduleName).controller('basicsMaterialFilterSaveController', ['$scope', '$translate', 'materialFilterAccessLevel', 'profile', 'postProfile',
		function ($scope, $translate, materialFilterAccessLevel, profile, postProfile) {

			$scope.accessLevelOptions = {
				valueList: [
					{
						value: materialFilterAccessLevel.user,
						title: $translate.instant('basics.material.lookup.filter.user')
					},
					{
						value: materialFilterAccessLevel.role,
						title: $translate.instant('basics.material.lookup.filter.role')
					},
					{
						value: materialFilterAccessLevel.system,
						title: $translate.instant('basics.material.lookup.filter.system')
					}
				]
			};

			$scope.profile = profile;

			$scope.save = function () {
				postProfile($scope.profile).then(res => {
					const success = res.data;

					if (success) {
						$scope.profile.IsNew = false;
					} else {
						throw new Error('Error saving filter');
					}

					$scope.$close($scope.profile);
				});
			};
		}
	]);

})();