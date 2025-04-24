/**
 * Created by anl on 5/24/2019.
 */

(function (angular) {
	'use strict';
	var moduleName = 'productionplanning.common';

	angular.module(moduleName).directive('productionplanningCommonCustomFilterValueList',

		['platformStatusIconService',
			function (platformStatusIconService) {  // jshint ignore:line
				return {
					restrict: 'EA',
					scope: true, // will not affect parentScope,
					template: function (elem, attrs) {
						var myTemplate = '<div data-dropdown-select3-tags data-on-changed="onValueListChanged" multiple nosearch data-model="@@model@@" data-options="dropboxOptions"@@attributes@@ data-template-selection="templateSelection" data-template-result="templateResult"></div>';


						function makeTemplate(template, attrs) {
							var attrList = [
								!attrs.readonly ? '' : ' data-ng-readonly="' + attrs.readonly + '" ',
								!attrs.entity ? '' : ' data-entity="$parent.' + attrs.entity + '" ',
								!attrs.class ? '' : ' class="' + attrs.class + '" ',
								!attrs.style ? '' : ' style="' + attrs.style + '" ',
								!attrs.placeholder ? '' : ' placeholder="' + attrs.placeholder + '"'
							];
							template = template
								.replace('@@model@@', attrs.model)
								.replace('@@attributes@@', attrList.join(''));

							return template;
						}

						return makeTemplate(myTemplate, attrs);
					},
					compile: function () {
						return {
							pre: preLink
							//post: postLink
						};
					}
				};

				function preLink(scope, iElement, iAttrs, controller) { // jshint ignore:line

					var targetRow = scope.$eval(iAttrs.config);

					scope.dropboxOptions = targetRow.dropboxOptions;
					if (targetRow.templateOptions) {//easy way for status
						switch (targetRow.templateOptions.type) {
							case 'status':
								scope.templateResult = function (item) {
									if (!item.origin) {
										return item.text;
									}
									var template = '<i class="block-image @@iconCss@@"></i><span class="pane-r">@@text@@</span>';
									template = template
										.replace('@@iconCss@@', platformStatusIconService.getImageResById(targetRow.templateOptions.iconMember ? _.get(item.origin, targetRow.templateOptions.iconMember) : item.origin.Icon))
										.replace('@@text@@', targetRow.templateOptions.displayMember ? _.get(item.origin, targetRow.templateOptions.displayMember) : item.text);
									return $(template);
								};
								break;
						}
					} else {
						scope.templateResult = targetRow.templateResult;
					}
					scope.templateSelection = targetRow.templateSelection || scope.templateResult;//share the same if not set

					scope.onValueListChanged = function (scopeParam, selectedValues) { // jshint ignore:line
						//scope.$parent.entity.Status = selectedValues;

						//trigger row.change to update filter
						scope.$eval(iAttrs.config).rt$change();
					};
				}

				function postLink(scope, elem, attrs) {// jshint ignore:line

				}
			}]);
})(angular);