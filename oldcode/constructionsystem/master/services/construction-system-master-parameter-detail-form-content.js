(function (angular) {
	'use strict';
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module('constructionsystem.master').factory('cosMasterParameterFormControlChangeService',
		['$templateCache',
			function ($templateCache) {
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

					// detailConfig.groups[groupIndex].rows = detailConfig.groups[groupIndex].rows.concat(rows);

					angular.forEach(rows, function (row) { // jshint ignore:line

						var groupIndex = -1;
						var rowIndex = -1;
						var group;

						for (var i = 0; i < detailConfig.groups.length; i++) {
							group = detailConfig.groups[i];
							if (group.gid === row.gid) {
								groupIndex = i;
								break;
							}
						}

						if (group) {
							for (i = 0; i < group.rows.length; i++) {
								if (group.rows[i].rid === row.rid) {
									rowIndex = i;
									break;
								}
							}
						}

						var controlTemplate = getTemplate(row.type);

						var rowBinding = 'groups[' + groupIndex + '].rows[' + rowIndex + ']';
						if (controlTemplate) {
							var directive = row.type === 'directive' ? 'data-' + row.directive : '';

							var placeholder = [
								'data-entity="entity"',
								' data-config="' + rowBinding + '"',
								' data-model="entity.' + row.model + '"',
								' class="form-control"',
								' data-ng-model="entity.' + row.model + '"',
								' data-readonly="' + !!row.readonly + '"',
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

					// must wrap <div class="">
					rowContent = '<div class="">' + rowContent.join('') + '</div>';

					return rowContent;
				};
				return service;
			}]);
})(angular);