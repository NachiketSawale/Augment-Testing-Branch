/**
 * Created by zwz on 7/16/2018.
 * Copy from cosMasterParameterFormControlChangeService
 */

(function (angular) {
	'use strict';
	/* jshint -W072 */
	var moduleName = 'transportplanning.package';
	angular.module(moduleName).factory('transportplanningPackagePkgTypeFormControlChangeService',controlChangeService);
	controlChangeService.$inject = ['$templateCache'];
	function controlChangeService($templateCache) {
		var service = {};

		function getTemplate(key) {
			var template = $templateCache.get(key + '.html');
			if (!template) {
				template = $templateCache.get(key + 'ctrl.html');
			}

			if (!template) {
				template = $templateCache.get('domain.html').replace('$$domain$$', key);
			}

			if (!template) {
				throw new Error('Template ' + key + ' not found');
			}

			return template;
		}

		service.getContextHtml = function (scope, rows) {

			var rowContent = [];
			var detailConfig = scope.formOptions.configure;

			//detailConfig.groups[groupIndex].rows = detailConfig.groups[groupIndex].rows.concat(rows);

			angular.forEach(rows, function (row) { // jshint ignore:line
				var groupIndex ,rowIndex;
				for (var i = 0; i < detailConfig.groups.length; i++) {
					if(rowIndex === undefined) {
						for (var j = 0; j < detailConfig.groups[i].rows.length; j++) {
							if(detailConfig.groups[i].rows[j].rid === row.rid){
								groupIndex = i;
								rowIndex = j;
								break;
							}
						}
					} else {
						break;
					}
				}
				if (groupIndex === undefined || rowIndex === undefined) {
					throw new Error('Cannot get the index of the row.');
				}

				var rowBinding = 'groups[' + groupIndex + '].rows[' + rowIndex + ']';

				var controlTemplate = getTemplate(row.type);
				if (controlTemplate) {
					var directive = row.type === 'directive' ? 'data-' + row.directive : '';

					var placeholder = [
						'data-entity="entity"',
						' data-config="' + rowBinding + '"',
						' data-model="entity.' + row.model + '"',
						' class="form-control"',
						' data-ng-model="entity.' + row.model + '"',
						' data-readonly="' + !!row.readonly + '"',
						' data-ng-readonly="' + !!row.readonly + '"',
						' data-tabstop="' + !!row.tabStop + '"',
						' data-enterstop="' + !!row.enterStop + '"',
						row.options ? ' data-options="options"' : '',
						!detailConfig.dirty ? '' : ' data-dirty="true"'
					].join('');

					controlTemplate = controlTemplate
						.replace(/\$\$row\$\$/g, rowBinding)
						.replace(/\$\$directive\$\$/g, directive)
						.replace(/\$\$placeholder\$\$/g, placeholder);
				}

				rowContent.push(controlTemplate);

			});

			//must wrap <div class="">
			rowContent = '<div class="">' + rowContent.join('') + '</div>';

			return rowContent;
		};
		return service;
	}

})(angular);
