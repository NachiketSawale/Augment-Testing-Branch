(function (angular) {
	'use strict';

	function getHtmlByConfig(_, config, scope, $templateCache, basicsWorkflowtypeSelectedModes) {
		var html = '<table style="border-spacing: 2px 2px;border-collapse: separate">';
		var labHtml = '';
		var template;
		var result;
		var strVisible = '';

		var labelFn = function (displayText) {
			var cssWhiteSpaceValue = 'normal';
			if (_.includes(displayText, '<script>') || _.includes(displayText, '</script>')) {
				displayText = _.escape(displayText);
			}
			if (isJson(displayText)) {
				cssWhiteSpaceValue = 'pre-wrap';
			}
			labHtml += `<div><label style="white-space: ${cssWhiteSpaceValue};word-break: break-word;">${displayText}</label></div>`;
		};

		function isJson(str) {
			var unescapeStr = _.unescape(typeof str !== 'string' ? JSON.stringify(str) : str);
			try {
				unescapeStr = JSON.parse(unescapeStr);
			} catch (e) {
				return false;
			}
			if (typeof unescapeStr === 'object' && unescapeStr !== null) {
				return true;
			}
			return false;
		}

		var addToTable = function (item, elemHtml) {
			if (!elemHtml) {
				return;
			}
			strVisible = '';
			var colspan = 1;
			var widthStyle = '';
			if (item.visibleCondition) {
				strVisible = 'data-ng-if="' + item.visibleCondition + ' || ' + item.visibleCondition + ' === undefined"';
			}
			html += '<tr ' + strVisible + '>';
			var showDescriptionInFrontAsLabel = item.showDescriptionInFrontAsLabel ? item.showDescriptionInFrontAsLabel : false;
			if (showDescriptionInFrontAsLabel && ((item.options && !item.options.allowMergeColumn) || !item.options)) {
				html += '<td style="width:5%;padding-right: 5px;vertical-align: top;border:none" nowrap><label class="platform-form-label" style="margin-top:5px">' +
					item.description + '</label></td>';
				widthStyle = ' style="border:none"';
			} else {
				colspan = 2;
				widthStyle = ' style="width:5%;border:none"  ';
				if (item.type !== 'clerkLookup' && (!item.options || !item.options.disableNoWrap)){
					widthStyle += ' nowrap ';
				}
			}

			html += '<td colspan=' + colspan + widthStyle + ' >' + elemHtml + '</td></tr>';
		};

		if (!!scope.task && !!scope.task.input) {
			var context = _.find(scope.task.input, { key: 'Context' });
			if (scope.Context && _.isEmpty(scope.Context) && !!context && !!context.value) {
				Object.assign(scope.Context, JSON.parse(context.value));
			}
		}
		_.forEach(config, function (item, i) {
			if (item.type === 'label') {
				labHtml = '';
				var displayText = item.options.displayText;
				if (displayText && _.isString(displayText)) {
					if (item.options.escapeHtml) {
						labelFn(_.escape(displayText));
					} else {
						_.forEach(displayText.split('<br>'), labelFn);
					}
				}
				addToTable(item, labHtml);
				return;
			}

			var isUseTemplate = false;
			template = $templateCache.get('basics.workflow/user-input-action/' + item.type + '.html');
			if (item.type === 'select') {
				if (item.options && item.options.typeSelectedMode && item.options.typeSelectedMode === basicsWorkflowtypeSelectedModes.multi &&
					item.context) {
					isUseTemplate = true;
				}
			} else if (template) {
				isUseTemplate = true;
			}
			if (isUseTemplate) {
				// eslint-disable-next-line no-useless-escape
				var regEx = /\#\#options[^(\#\#)]*\#\#/;
				while ((result = template.match(regEx, template))) {
					var path = 'config[' + i + '].' + result[0].replace(/##/g, '');
					template = template.replace(result[0], path);
				}
				// eslint-disable-next-line no-useless-escape
				var modelRegEx = /\#\#model[^(\#\#)]*\#\#/;
				while ((result = template.match(modelRegEx, template))) {
					template = template.replace(result[0], item.context);
				}
				addToTable(item, template);
				return;
			}

			if (item.context) {
				item.options = !item.options ? {} : item.options;

				if (item.type === 'select') {
					try {
						item.options.items = angular.fromJson(item.options.items);
					} catch (e) {
						// ignore as the items string is already an Object
					}
				}

				var externalString = '';
				if (item.options.hasOwnProperty('defaultValue')) {
					externalString = ' data-ng-init="' + item.context + '=' + item.context + '?' + item.context + ':' + item.options.defaultValue + '"';
				}

				var elemHtml = '<div><span data-suppress-debounce="true" data-model-options="{ updateOn: \'change blur\' }" data-domain-control data-domain="' + item.type + '" class="form-control" ' +
					'data-model="' + item.context + '" data-options="config[' + i + '].options"  ' + externalString + '  ></span></div>';
				addToTable(item, elemHtml);
			}
		});

		html = html + '</table>';

		// Adding html template for reassigning task
		let reassignTaskHtml = $templateCache.get('basics.workflow/reassign-task.html');
		html += reassignTaskHtml;

		return html;
	}

	function basicsWorkflowUserInputActionDirective(_, $compile, $templateCache, basicsWorkflowClientActionUtilService, basicsWorkflowtypeSelectedModes) {
		return {
			restrict: 'A',
			require: 'ngModel',
			compile: function compile() {
				return function postLink(scope, iElement, attrs, ngModelCtrl) {
					ngModelCtrl.$render = async function () {
						await basicsWorkflowClientActionUtilService.initScope(scope, ngModelCtrl);

						scope.config = basicsWorkflowClientActionUtilService.getFromInputParam('Config', ngModelCtrl);
						if (angular.isString(scope.config)) {
							try {
								scope.config = angular.fromJson(scope.config);
							} catch (ex) {
								_.noop(ex);
							}
						}

						var html = getHtmlByConfig(_, scope.config, scope, $templateCache, basicsWorkflowtypeSelectedModes);
						iElement.html($compile(html)(scope));

						setTimeout(function () {
							$('.modal-content input').first().focus();
						});
					};
				};
			}
		};
	}

	basicsWorkflowUserInputActionDirective.$inject = ['_', '$compile', '$templateCache',
		'basicsWorkflowClientActionUtilService', 'basicsWorkflowtypeSelectedModes'];
	angular.module('basics.workflow').directive('basicsWorkflowUserInputActionDirective', basicsWorkflowUserInputActionDirective);
})(angular);
