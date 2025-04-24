/*
 * $Id: reporting-sidebar-parameter.js 599337 2020-08-11 14:42:33Z ffo $
 * Copyright (c) RIB Software GmbH
 */

(function (angular) {
	'use strict';

	angular.module('platform').directive('genericWizardReportParametersEditor', genericWizardReportParametersEditor);

	genericWizardReportParametersEditor.$inject = ['$compile', '_', 'moment'];

	function genericWizardReportParametersEditor($compile, _, moment) {
		return {
			restrict: 'A',
			scope: {
				parameterList: '='
			},
			link: function (scope, elem, attrs) { // jshint ignore:line
				var template = [];
				var index = 0;

				_.each(scope.parameterList, function (parameter) { // jshint ignore: line
					var id = _.uniqueId('report-parameter-id');
					var domain;
					var labelBefore = true;
					var markup;
					var markupStyle = ' style="width: 100%;"';
					var labelStyle = '';
					var labelClass = '';
					var labelAppendBreak = false;
					var markupClass = ' ';
					var maxLength;

					switch (parameter.dataType) {
						case 'System.Int32':
							domain = 'integer';

							if (parameter.defaultValue) {
								parameter.value = parseInt(parameter.defaultValue);
							}

							if (parameter.values.length) {
								domain = 'select';
								parameter.options = {
									displayMember: 'name',
									valueMember: 'value',
									items: parameter.values
								};
							}
							break;

						case 'System.Decimal':
						case 'System.Double':
						case 'System.Float':
							if (parameter.defaultValue) {
								var offset = parameter.defaultValue.indexOf('(');

								if (offset !== -1) {
									parameter.value = parseInt(parameter.defaultValue.substr(0, offset));
								} else {
									parameter.value = parseInt(parameter.defaultValue);
								}
							}
							domain = 'factor';
							break;

						case 'System.String':
							if (parameter.Name.toLowerCase() === 'link' || parameter.Name.toLowerCase() === 'link1') {
								domain = 'url';
							} else {
								domain = 'comment';
								markupStyle = ' style="height: 28px; padding-top: 4px";';
							}

							if (!parameter.value && parameter.defaultValue) {
								parameter.value = parameter.defaultValue.toString();
							}
							break;

						case 'System.Boolean':
							domain = 'boolean';
							labelBefore = false;
							markupStyle = '';
							markupClass = null;
							labelClass = null;
							labelStyle = '';
							labelAppendBreak = false;
							parameter.value = parameter.defaultValue/* parameter.defaultValue.indexOf('true') !== -1 */;
							parameter.options = {
								labelText: parameter.name,
								ctrlId: id
							};
							break;

						case 'System.DateTime':
							domain = 'dateutc';

							switch (parameter.defaultValue) {
								case '@today':
									parameter.value = moment.utc();
									break;

								case '@startofyear':
									parameter.value = moment.utc().startOf('year');
									break;

								case '@endofyear':
									parameter.value = moment.utc().endOf('year');
									break;

								case '@startofmonth':
									parameter.value = moment.utc().startOf('month');
									break;

								case '@endofmonth':
									parameter.value = moment.utc().endOf('month');
									break;

								case '@time':
									domain = 'timeutc';
									parameter.value = moment.utc();
									break;
							}
							break;
					}

					if (parameter.context === 0 || parameter.context === 10) {
						template.push('<div class="margin-top-ld">');

						var labelMarkup = '<label for="' + id + '"';

						if (labelClass) {
							labelMarkup += labelClass;
						}

						if (labelStyle) {
							labelMarkup += labelStyle;
						}

						labelMarkup += '>' + parameter.name + '</label>';

						if (labelAppendBreak) {
							labelMarkup += '<br>';
						}

						if (labelBefore) {
							template.push(labelMarkup);
						}

						markup = '<div><div data-domain-control data-domain="' + domain + '" data-model="parameterList[' + index + '].value" data-entity="parameterList[' + index + ']" id="' + id + '"';

						if (maxLength) {
							markup += ' max-length="' + maxLength + '"';
						}

						if (markupStyle) {
							markup += markupStyle;
						}

						if (markupClass) {
							markup += markupClass;
						}

						if (parameter.options) {
							markup += ' data-options="parameterList[' + index + '].options"';
						}

						markup += '></div></div>';

						template.push(markup);
						template.push('</div>'); // close div.margin-top-ld
					}

					++index;
				});

				var parent = elem[0].parentNode;
				var content = angular.element(template.join(''));

				elem.replaceWith(content);
				$compile(parent)(scope);
			}
		};
	}
})(angular);
