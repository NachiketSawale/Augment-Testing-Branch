/*
 * $Id: reporting-sidebar-parameter.js 599337 2020-08-11 14:42:33Z ffo $
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	angular.module('basics.reporting').directive('basicsReportingSidebarParameter', basicsReportingSidebarParameter);

	basicsReportingSidebarParameter.$inject = ['$compile', '_', 'moment'];

	function basicsReportingSidebarParameter($compile, _, moment) {
		return {
			restrict: 'A',
			scope: true,
			link: function (scope, elem, attrs) { // jshint ignore:line
				var template = [];
				var ctrl = scope.reportingSidebar;
				var index = 0;

				_.each(ctrl.report.parameters, function (parameter) { // jshint ignore: line
					if (parameter.context === 0 || parameter.context === 10) {
						var id = _.uniqueId('sidebar-report-id');
						var domain;
						var labelBefore = true;
						var markup;
						var markupStyle = ' style="width: 100%;"';
						var labelStyle = ' style="margin-top: 5px;"';
						var labelClass = ' class="flex-box"';
						var labelAppendBreak = false;
						var markupClass = ' ';

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
								domain = 'comment';
								markupStyle = ' style="height: 28px; padding-top: 4px";';
								break;

							case 'System.Boolean':
								domain = 'boolean';
								labelBefore = false;
								markupStyle = '';
								markupClass = null;
								labelClass = null;
								labelStyle = '';
								labelAppendBreak = false;
								parameter.value = parameter.defaultValue.indexOf('true') !== -1;
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

						markup = '<div><div data-domain-control data-domain="' + domain + '" data-model="reportingSidebar.report.parameters[' + index + '].value" data-entity="reportingSidebar.report.parameters[' + index + ']" id="' + id + '"';

						if (markupStyle) {
							markup += markupStyle;
						}

						if (markupClass) {
							markup += markupClass;
						}

						if (parameter.options) {
							markup += ' data-options="reportingSidebar.report.parameters[' + index + '].options"';
						}

						markup += '></div></div>';

						template.push(markup);
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