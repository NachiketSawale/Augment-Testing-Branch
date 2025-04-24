/**
 * Created by yew on 28/5/2020.
 */

/* global globals, $, _ */
(function (angular) {
	'use strict';

	var moduleName = 'model.wdeviewer';

	angular.module(moduleName).directive('labelEditor', [
		function () {
			return {
				templateUrl: globals.appBaseUrl + 'model.wdeviewer/templates/label-editor.html',
				restrict: 'A',
				scope: {
					entity: '=',
					config: '='
				},
				controller: ['$scope', 'keyCodes', 'basicsLookupdataPopupService', 'modelWdeViewerPrintingSections',
					function ($scope, keyCodes, basicsLookupdataPopupService, modelWdeViewerPrintingSections) {

						if (angular.isUndefined($scope.sectionContents)) {
							$scope.sectionContents = modelWdeViewerPrintingSections.sections;
						}
						if ($scope.entity === '') {
							$scope.entity = [];
						}
						$scope.labelContents = $scope.entity;

						var instance;
						var popupOpen = false;
						$scope.onPopupSection = function onPopupSection(event) {
							event.preventDefault();
							event.stopPropagation();
							if (popupOpen) {
								instance.close();
								popupOpen = false;
								return;
							}
							var popupOptions = {
								scope: $scope,
								multiPopup: false,
								plainMode: true,
								width: 182,
								hasDefaultWidth: true,
								focusedElement: $(event.target),
								template: '<ul class="dropdown-menu_">' +
									'<li data-ng-repeat="contentItem in sectionContents">' +
									'<button data-ng-click="onPushContent(contentItem)" data-ng-bind="contentItem.code" title="{{ contentItem.title }}" data-ng-disabled="contentItem.disable"></button>' +
									'</li></ul>'
							};
							instance = basicsLookupdataPopupService.showPopup(popupOptions);
							instance.opened.then(function openCallback() {
								popupOpen = true;
							});

							instance.closed.then(function closeCallback() {
								popupOpen = false;
							});
						};

						$scope.focus = function focus(value) {
							$scope.$parent.activeSection = value;
						};

						$scope.onclearValue = function onclearValue() {
							$scope.textValue = '';
						};

						$scope.onPushContent = function onPushContent(item) {
							$scope.labelContents.push(modelWdeViewerPrintingSections.labelContentJson(item.value));
							$scope.$parent.activeSection = $scope.config;
							if (popupOpen) {
								instance.close();
								popupOpen = false;
							}
						};

						$scope.onkeydownEnter = function onkeydownEnter(event, value) {
							if (event.keyCode === keyCodes.ENTER) {
								$scope.labelContents.push(modelWdeViewerPrintingSections.labelContentJson(value));
								$scope.textValue = '';
							}
						};

						$scope.onItemDelete = function onItemDelete(item) {
							$scope.labelContents = _.filter($scope.labelContents, function mapLabelContents(e) {
								return e.id !== item.id;
							});
						};
					}]
			};
		}
	]);

})(angular);