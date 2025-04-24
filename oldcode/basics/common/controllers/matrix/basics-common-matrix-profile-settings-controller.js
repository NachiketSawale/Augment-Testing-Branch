/**
 * Created by balkanci on 25.11.2015.
 */
(function (angular) {
	'use strict';

	angular.module('basics.common').controller('basicsCommonMatrixProfileSettingsController', ['$scope', '$translate', 'globals',
		function ($scope, $translate, globals) {

			$scope.tabs = [
				{
					title: $translate.instant('platform.bulkEditor.contentDefinition'),
					content: globals.appBaseUrl + 'basics.common/templates/matrixSettingsDialog/matrix-settings-content-tab.html',
					active: true,
					disabled: false
				},
				{
					title: $translate.instant('platform.bulkEditor.backgrounds'),
					content: globals.appBaseUrl + 'basics.common/templates/matrixSettingsDialog/matrix-settings-background-tab.html',
					disabled: false
				},
				{
					title: $translate.instant('platform.bulkEditor.fonts'),
					content: globals.appBaseUrl + 'basics.common/templates/matrixSettingsDialog/matrix-settings-font-tab.html',
					disabled: false
				}
			];
		}
	]);

})(angular);
