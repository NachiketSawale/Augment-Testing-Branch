/*
 * $Id: platform-status-bar.js 552456 2019-07-26 12:52:34Z alisch $
 * Copyright (c) RIB Software GmbH
 */

(function (angular) {
	/* global $ */
	'use strict';

	var moduleName = 'platform';

	angular.module(moduleName).directive('platformStatusBar', ['_', '$log', function (_, $log) {
		return {
			restrict: 'A',
			scope: {
				setLink: '&'
			},
			template: '<div platform-status-bar-content platform-refresh-on="version"></div>',
			link: function (scope) {

				function isScopeReady() {
					if (scope) {
						return true;
					}

					$log.warn('Status bar addressed after release of scope.');
					return false;
				}

				function normalizeToArray(fields) {
					if (_.isArray(fields)) {
						return _.filter(fields, function (f) {
							return _.isObject(f);
						});
					}

					if (!_.isObject(fields)) {
						return [];
					}

					var result = [];
					Object.keys(fields).forEach(function (key) {
						var f = fields[key];
						if (f === null) {
							result.push({
								id: key,
								delete: true
							});
						}

						if (_.isObject(f)) {
							f.id = key;
							result.push(f);
						}
					});
					return result;
				}

				function addDefaultSettings(field) {
					return _.assign({
						visible: true,
						disabled: false,
						toolTip: {},
						align: 'right-side',
						ellipsis: false
					}, field);
				}

				function sortFields() {
					scope.fields.sort(function (a, b) {
						if (!_.isObject(a) || !_.isObject(b)) {
							return 0;
						}
						if (a.sortOrder === b.sortOrder) {
							return 0;
						}
						if (a.sortOrder < b.sortOrder) {
							return -1;
						} else {
							return 1;
						}
					});
				}

				var linkObject = {
					setFields: function (fields) {
						if (isScopeReady()) {
							scope.$evalAsync(function () {
								if (isScopeReady()) {
									var normalizedFields = _.map(_.filter(normalizeToArray(fields), function (f) {
										return !f.delete;
									}), addDefaultSettings);
									scope.fields = normalizedFields;
									sortFields();

									scope.version++;
								}
							});
						}
					},
					addFields: function (newFields) {
						if (!_.isNil(newFields)) {
							if (isScopeReady()) {
								scope.$evalAsync(function () {
									if (isScopeReady()) {
										var normalizedFields = _.map(_.filter(normalizeToArray(newFields), function (f) {
											return !f.delete;
										}), addDefaultSettings);
										scope.fields = scope.fields.concat(normalizedFields);
										sortFields();

										scope.version++;
									}
								});
							}
						}
					},
					updateFields: function (changedFields) {
						if (isScopeReady()) {
							scope.$evalAsync(function () {
								if (isScopeReady()) {
									if (!_.isNil(changedFields)) {
										var normalizedFields = normalizeToArray(changedFields);
										normalizedFields.forEach(function (f) {
											if (f.delete) {
												var idx = _.findIndex(scope.fields, {id: f.id});
												if (idx >= 0) {
													scope.fields.splice(idx, 1);
												}
											} else {
												var origField = _.find(scope.fields, {id: f.id});
												if (origField) {
													_.assign(origField, f);
												} else {
													f = addDefaultSettings(f);
													scope.fields.push(f);
												}
											}
										});
										sortFields();
									}

									scope.version++;
								}
							});
						}
					},
					update: function () {
						if (isScopeReady()) {
							scope.$evalAsync(function () {
								if (isScopeReady()) {
									scope.version++;
								}
							});
						}
					}
				};
				scope.setLink({
					link: linkObject
				});

				scope.fields = [];

				scope.version = 0;

				scope.$on('$destroy', () => {
					scope.fields = null;
					scope.setLink = null;
					scope = null;
				});
			}
		};
	}]);

	/**
	 * @ngdoc directive
	 * @name platform.directive:platformStatusBar
	 * @element div
	 * @restrict EA
	 * @description Displays a status bar.
	 */
	angular.module(moduleName).directive('platformStatusBarContent', [function () {
		return {
			restrict: 'A',
			template:
				'<div class="statusbar">' +
				'<div class="left-side flex-box flex-align-center">' +
				'<div data-ng-repeat="field in fields | filter:{align:\'left\'}" data-platform-status-bar-element></div>' +
				'</div>' +
				'<div class="right-side flex-element flex-box flex-align-center">' +
				'<div data-ng-repeat="field in fields | filter:{align:\'right\'}" data-platform-status-bar-element></div>' +
				'</div>' +
				'<div class="last flex-box">' +
				'<div data-ng-repeat="field in fields | filter:{align:\'last\'}" data-platform-status-bar-element></div>' +
				'</div>' +
				'</div>',
			link: function () {

			}
		};
	}]);

	/**
	 * @ngdoc directive
	 * @name platform.directive:platformStatusBarElement
	 * @element div
	 * @restrict EA
	 * @description Displays a status bar Element for Status Bar.
	 */
	angular.module(moduleName).directive('platformStatusBarElement', ['_', '$compile', 'basicsLookupdataPopupService', 'platformMenuListDefaultListConfig', '$timeout', function (_, $compile, basicsLookupdataPopupService, platformMenuListDefaultListConfig, $timeout) {
		return {
			restrict: 'A',
			link: function (scope, element) {
				var cssClass = '';

				function switchToNewToolTipDirective() {
					if (scope.field.toolTip && _.isString(scope.field.toolTip)) {
						scope.field.toolTip = {
							caption: scope.field.toolTip
						};
					}
				}

				if (scope.field.visible === true) {
					if (scope.field.disabled === true) {
						cssClass = 'disabled'; // ??
					} else {
						cssClass = scope.field.cssClass; // ??
					}

					// var css = !scope.field.value ? 'none-distance' : ''; //no value in dom-element --> element dont get padding and margin

					switchToNewToolTipDirective();

					switch (scope.field.type) {
						case 'text':
							var spanTemplate = '<span data-ng-if="field.value" custom-tooltip="{{field.toolTip}}" class="item {{field.cssClass}}" data-ng-class="{\'ellipsis\': field.ellipsis}" ng-click="field.func()" data-ng-disabled="field.disabled">{{field.value}} </span>';
							element.append($compile(spanTemplate)(scope));
							break;
						case 'button':
							(function () {
								var actualIconClass = _.isEmpty(_.trim(scope.field.iconClass)) ? '' : (scope.field.iconClass + ' block-image');
								var buttonTemplate = '<button class="item {{field.cssClass}} ' + actualIconClass + '" data-ng-click="field.func()" custom-tooltip="{{field.toolTip}}" data-ng-disabled="field.disabled">{{field.value}}</button>';
								element.append($compile(buttonTemplate)(scope));
							})();
							break;
						case 'image':
							var imageTemplate = '<i class="item image {{field.cssClass}} {{field.iconClass}}" custom-tooltip="{{field.toolTip}}" data-ng-src="{{field.url}}" data-ng-click="field.func()" data-ng-disabled="field.disabled"></i>';
							element.append($compile(imageTemplate)(scope));
							break;
						case 'sublist':
							(function appendSubList() {
								var subListScope = scope.$new();
								var subListTemplate = '<div data-platform-status-bar-content data-ng-disabled="field.disabled"></div>';
								subListScope.fields = scope.field.value;
								element.append($compile(subListTemplate)(subListScope));
							})();
							break;
						case 'dropdown-btn':
							var dropDownTemplate = '<button data-ng-if="field.value || field.iconClass" class="item {{field.cssClass}} {{field.iconClass}}" data-ng-click="executeFn()" data-data="field" data-ng-disabled="field.disabled"><span>{{field.value}}</span></button>';
							element.append($compile(dropDownTemplate)(scope));
							break;
						case 'input':
							var inputTemplate = '<input type="{{field.inputType}}" custom-tooltip="{{field.toolTip}}" class="item {{field.cssClass}}" data-ng-class="{\'ellipsis\': field.ellipsis}" data-ng-keydown="field.func($event)" data-ng-disabled="field.disabled" data-ng-model="field.value" data-ng-style="field.cssStyle" />';
							element.append($compile(inputTemplate)(scope));
							break;
					}
				}
				var instance;

				var options = {
					multiPopup: false,
					plainMode: true,
					hasDefaultWidth: false
				};

				scope.executeFn = function () {
					var template = '<div data-platform-menu-list data-list="field.list" data-init-once data-popup></div>';
					instance = basicsLookupdataPopupService.toggleLevelPopup($.extend({}, options, {
						scope: scope,
						focusedElement: $(event.currentTarget),
						template: template,
						level: 0
					}));
					if (!(_.isNull(instance) || _.isUndefined(instance))) {
						instance.opened.then(function () {
							$timeout(function () {
								scope.$digest();
							}, 0);
						});
					}
				};

				scope.$on('$destroy', () => {
					scope.executeFn = null;
					element = null;
				});
			}
		};

	}]);
})(angular);
