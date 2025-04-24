/**
 * Created by alm on 9/22/2020.
 */
/* global _ */
(function () {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular */

	var moduleName = 'constructionsystem.common';

	angular.module(moduleName).directive('constructionSystemFormulaDialog', ['$compile', '$translate', '$templateCache', 'platformDialogService',
		function ($compile, $translate, $templateCache, platformDialogService) {
			return {
				restrict: 'A',
				require: 'ngModel',
				controller: ['$scope', function ($scope) {
					var title = $translate.instant('constructionsystem.master.formulaToolTipTitle');
					var title1 = $translate.instant('constructionsystem.master.formulaToolTipTitle1');
					var title2 = $translate.instant('constructionsystem.master.formulaToolTipTitle2');

					function showFormulaToolTip() {
						var arrMessage = [];
						var formulaList = ['count', 'length', 'area', 'height', 'offset', 'multiplier', 'segmentCount', 'vertexCount', 'cutoutArea', 'cutoutLength', 'areaExcludingCutouts', 'lengthExcludingCutouts', 'segmentCountExcludingCutouts', 'vertexCountExcludingCutouts'];
						arrMessage.push(title + '&#10;');
						arrMessage.push(title1 + '&#10;');
						_.forEach(formulaList, function (item) {
							arrMessage.push(' &#160;&#160;&#160;&#149; ' + item + '&#10;');
						});
						arrMessage.push(title2 + '&#10;');
						return arrMessage.join('');
					}

					function showFormulaToolTipInDialog() {
						var arrMessage = [];
						var formulaList = ['count', 'length', 'area', 'height', 'offset', 'multiplier', 'segmentCount', 'vertexCount', 'cutoutArea', 'cutoutLength', 'areaExcludingCutouts', 'lengthExcludingCutouts', 'segmentCountExcludingCutouts', 'vertexCountExcludingCutouts'];
						arrMessage.push('<div style="text-align:left;"><div>' + title + '</div>');
						arrMessage.push('<div>' + title1 + '</div>');
						arrMessage.push('<ul style="list-style-type:disc;padding-left:30px;">');
						_.forEach(formulaList, function (item) {
							arrMessage.push('<li>' + item + '</li>');
						});
						arrMessage.push('</ul>');
						arrMessage.push('<div>' + title2 + '</div></div>');
						return arrMessage.join('');
					}

					$scope.execute = function () {
						platformDialogService.showDialog({
							headerText$tr$: 'cloud.common.informationDialogHeader',
							bodyTemplate: showFormulaToolTipInDialog(),
							showOkButton: true
						});
					};

					$scope.options = {
						showClearButton: false,
						isTextEditable: true,
						domain: 'description',
						extendButtons: [
							{
								iconClass: 'ico-question',
								toolTip: showFormulaToolTip
							}
						]
					};


				}],
				link: function (scope, element, attrs) {

					var isCellEditor = !!attrs.grid;

					var options = scope.options;


					var buttons = options.extendButtons;
					var template = '<div class="input-group  $$inputGroupStyleHolder$$ "> $$inputGroupContentHolder$$<span  class="input-group-btn">$$extButtonsHtmlHolder$$</span></div>';

					var btnTemplate = '';
					if (buttons && buttons.length > 0) {
						var button = buttons[0];
						var iconClass = button.iconClass;
						btnTemplate = '<button class="hasToolTip btn btn-default control-icons ' + iconClass + '" title="$$title$$"  data-ng-click="execute()"> </button>';
						var title = '';
						if (Object.prototype.hasOwnProperty.call(button, 'toolTip')) {
							title = button.toolTip();
						}
						btnTemplate = btnTemplate.replace(/\$\$title\$\$/gm, title);
					}

					var inputContent = $templateCache.get('input-group-content-default.html');
					inputContent = inputContent.replace(/\$\$modelHolder\$\$/gm, options.isTextEditable ? (attrs.model || attrs.ngModel) : 'displayText')
						.replace(/\$\$inputStyleHolder\$\$/gm, options.textAlign === 'right' ? 'text-right' : '')
						.replace(/\$\$placeholder\$\$/gm, options.placeholder ? ('placeholder="' + options.placeholder + '"') : '')
						.replace(/\$\$restrictHolder\$\$/gm, !options.regex ? '' : ' data-ng-pattern-restrict="' + options.regex + '"');

					template = template.replace(/\$\$inputGroupContentHolder\$\$/gm, inputContent)
						.replace(/\$\$extButtonsHtmlHolder\$\$/gm, btnTemplate)
						.replace(/\$\$inputGroupStyleHolder\$\$/gm, isCellEditor ? 'grid-container' : 'form-control')
						.replace(/\$\$btnStyleHolder\$\$/gm, isCellEditor ? '' : 'input-sm');

					var content = angular.element(template);
					$compile(content)(scope).appendTo(element);

				}

			};
		}
	]);
})();
