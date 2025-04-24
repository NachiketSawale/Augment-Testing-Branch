/**
 * Created by chi on 5/30/2018.
 */
(function (angular) {
	'use strict';

	var moduleName = 'basics.common';

	angular.module(moduleName).directive('basicsCommonUniqueFieldsProfile', basicsCommonUniqueFieldsProfile);
	basicsCommonUniqueFieldsProfile.$inject = ['_', '$compile', 'platformModalService', '$translate', 'platformObjectHelper', 'globals'];

	function basicsCommonUniqueFieldsProfile(_, $compile, platformModalService, $translate, platformObjectHelper, globals) {
		return {
			restrict: 'A',
			scope: false,
			link: function (scope, elem, attrs) {

				var options = (attrs.options ? scope.$eval(attrs.options) : {}) || {};
				var template = '<div class="input-group">@@inputHtml@@@@buttonHtml@@</div>';
				var inputHtml = '<select class="form-control" data-ng-model="profile"' +
					' data-ng-options="p.name for p in profiles"' +
					' data-ng-disabled="disable()">' +
					'</select>';
				var buttonHtml = '<span class="input-group-btn">' +
					'<button class="btn btn-default control-icons ico-input-lookup input-sm" data-ng-click="showDialog($event)" data-ng-disabled="disable()"></button>' +
					'</span>';

				template = template.replace('@@inputHtml@@', inputHtml)
					.replace('@@buttonHtml@@', buttonHtml);

				scope.profiles = [{id: 0, name: 'New Profile'}]; // TODO chi: translate
				scope.profile = scope.profiles[0];

				scope.showDialog = showDialog;
				if (!angular.isFunction(options.disable)) {
					scope.disable = function () {
						return false;
					};
				} else {
					scope.disable = options.disable;
				}

				var content = $compile(template)(scope);

				elem.replaceWith(content);

				// //////////////////////////
				function showDialog() {

					if (!scope.profile) {
						return;
					}

					var dlgOptions = {};
					dlgOptions.templateUrl = globals.appBaseUrl + 'basics.common/templates/unique-fields-profile-dialog.html';
					dlgOptions.backdrop = false;
					dlgOptions.height = '500px';
					dlgOptions.width = '400px';
					dlgOptions.resizeable = true;
					dlgOptions.profile = scope.profile;
					dlgOptions.gridId = '6D1B7935263D45A088BF1722B9386AB0';
					dlgOptions.data = angular.copy(platformObjectHelper.getValue(scope, attrs.model || attrs.ngModel));
					dlgOptions.headerTextKey = options.headerTextKey || $translate.instant('basics.common.uniqueFields.uniqueFielsDialogTitle');

					platformModalService.showDialog(dlgOptions).then(function (result) {
						if (result && result.isOk && result.data) {
							platformObjectHelper.setValue(scope, attrs.model || attrs.ngModel, result.data);
						}
					});
				}
			}
		};
	}
})(angular);