/**
 * Created by ada on 2018/10/17.
 */
(function (angular) {
	'use strict';
	var moduleName = 'procurement.pricecomparison';

	/**
	 * @ngdoc directive
	 * @name printReportTextareaDirective
	 * @element
	 * @restrict
	 * @priority
	 * @scope
	 * @description
	 * #
	 * A directive for 'create print Report Setting Fieldset'.
	 *
	 */
	angular.module(moduleName).directive('printReportTextareaDirective', [
		'$timeout',
		'procurementPriceComparisonPrintConstants',
		'procurementPriceComparisonPrintSettingService',
		function (
			$timeout,
			printConstants,
			printSettingService) {
			return {
				restrict: 'A',
				scope: {
					value: '=ngModel',
					divFlag: '@'
				},
				require: '?ngModel',
				template: '<div id="editableDiv" contenteditable="true"\n' +
					'     data-ng-model="value"\n' +
					'     class="form-control print-format-div">\n' +
					'</div>',
				link: function (scope, element, attrs, ngModelController) {
					var textarea = element.find('#editableDiv');
					var timeOut;
					textarea.on('keyup', function () {
						if (timeOut) {
							$timeout.cancel($timeout);
						}
						timeOut = $timeout(function () {
							setText();
							clickChange();
						}, 350);
					});

					function setText() {
						var html = textarea.html();
						if (html === '<br>') {
							html = '';
						}
						html = html.replace(/&amp;/g, '&');
						ngModelController.$setViewValue(html);
					}

					textarea.on('mouseup', function () {
						setText();
						textarea.focus();
					});

					function clickChange() {
						printSettingService.onCurrentSettingChanged.fire({
							eventName: printConstants.eventNames.genericClickChange
						});
					}

					// model -> view
					ngModelController.$render = function () {
						textarea.html(ngModelController.$viewValue);
					};
				}
			};
		}
	]);
})(angular);
