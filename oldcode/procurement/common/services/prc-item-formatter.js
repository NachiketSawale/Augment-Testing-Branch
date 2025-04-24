/**
 * Created by chi on 7/1/2015.
 */
(function ($) {
	'use strict';

	// eslint-disable-next-line no-redeclare
	/* global angular,jQuery,_ */

	angular.module('procurement.common').factory('procurementCommonPrcItemFormatter', ['$injector', '$timeout', 'platformObjectHelper',
		function ($injector, $timeout, platformObjectHelper) {
			var nextId = 0;

			function generateId() {
				nextId++;
				return 'contractFormatter' + nextId;
			}

			// get display value from type.
			// noinspection JSUnusedLocalSymbols
			function getDisplayValue(row, cell, value, columnDef, dataContext) {
				var service = $injector.get('basicsLookupdataLookupDescriptorService');
				var item = null;

				if (service) {
					var targetData = service.getData(columnDef.formatterOptions.lookupType);

					value = platformObjectHelper.getValue(dataContext, columnDef.field);

					if (targetData) {
						item = targetData[value];
					}
				}
				if (item) {
					// return item.Itemno;
					return _.isUndefined(item.Reference) ? item.Itemno : item.Reference;
				}

				return '';
			}

			// get formatter display template
			// noinspection JSUnusedLocalSymbols
			function getFormatterTemplate(row, cell, value, columnDef, dataContext) {
				// var displayValue = getDisplayValue(row, cell, value, columnDef, dataContext);
				return getCreationTemplate(columnDef, dataContext);
				// template = '<div class="model">' + displayValue + '</div>' + template;
			}

			function getCreationTemplate(columnDef, dataContext) {
				var displayAssign = !!columnDef.formatterOptions.create;

				var enableAssign = true;

				// get enable attribute
				if (columnDef.formatterOptions.create && columnDef.formatterOptions.create.enable) {
					enableAssign = columnDef.formatterOptions.create.enable.call(null, dataContext);
				}
				var enableAssignClass = enableAssign ? ' enable' : '';

				var assignTemplate = '<div class="assign' + enableAssignClass + '"></div>';

				assignTemplate = displayAssign ? assignTemplate : '';

				return assignTemplate;
			}

			return function prcItemFormatter(row, cell, value, columnDef, dataContext) { // jshint ignore:line
				var templateId = generateId();
				var template = getFormatterTemplate(row, cell, value, columnDef, dataContext, templateId);
				var displayValue = getDisplayValue(row, cell, value, columnDef, dataContext);
				template =' <div class="assign-filter-editor ' + templateId + '">' + displayValue +  template + '</div>';

				var onCreate = function onCreate(e) {
					e.stopPropagation();
					if ($(this).hasClass('enable') &&
						columnDef.formatterOptions.create &&
						angular.isFunction(columnDef.formatterOptions.create.action)) {
						columnDef.formatterOptions.create.action.call(this,dataContext);
					}
				};


				// use timeout for do ui modify in cell after grid render.
				$timeout(function () {
					$('.' + templateId + ' .assign').bind('click dblclick', onCreate);
				});

				return template;
			};
		}
	]);
})(jQuery);
