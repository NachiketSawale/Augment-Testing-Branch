/**
 * @ngdoc directive
 * @name cloud.desktop.directive:cloudDesktopCustomUserCss
 * @element style
 * @restrict A
 * @priority default value
 * @description
 * Insert users custom css, which is defined in the User-Settings-Dialog by the user.
 *
 * @example
 * <style data-cloud-desktop-custom-user-css></style>;
 */
(function (angular) {
	'use strict';

	angular.module('cloud.desktop').directive('cloudDesktopCustomUserCss', ['_', 'cloudDesktopUserSettingsService', 'cloudDesktopDisplaySettingsService', 'cloudDesktopDataLayoutSettingsService', 'platformWysiwygEditorSettingsService',
		function (_, userSettingsService, displaySettingsService, dataLayoutSettingsService, wysiwygEditorSettingsService) {
			return {
				restrict: 'A',
				link: function (scope, elem) {

					var setCustomCss = function () {
						userSettingsService.getCss().then(function (data) {
							if (data) {
								if (data.value1) {
									var content = data.value1;
									elem.text(content);
								}

								var mainLogo = _.get(data, 'value2.mainLogo');
								scope.mainLogo = mainLogo ? mainLogo : '';
							}
						});
					};

					scope.$watchCollection(function () {
						return [displaySettingsService.getLastSettingsUpdate(), dataLayoutSettingsService.getLastSettingsUpdate(), wysiwygEditorSettingsService.getLastSettingsUpdate()];
					}, function () {
						setCustomCss();
					});
				}
			};
		}]
	);
})(angular);
