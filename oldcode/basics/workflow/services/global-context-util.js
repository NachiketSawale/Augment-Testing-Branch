(function () {
	'use strict';

	angular.module('basics.workflow').factory('basicsWorkflowGlobalContextUtil', ['platformModuleStateService',
		'basicsWorkflowUtilityService', 'moment', '$http',
		function (platformModuleStateService, basicsWorkflowUtilityService, moment, $http) {
			var state = platformModuleStateService.state('basics.workflow');

			var actionEnum = {};
			var textModuleEnum = {};

			function loadActions() {
				return $http({
					method: 'GET',
					url: globals.webApiBaseUrl + 'basics/workflow/script/globals/action/list'
				}).then(function (response) {
					actionEnum = response.data;
				});
			}

			function loadTextModules() {
				return $http({
					method: 'GET',
					url: globals.webApiBaseUrl + 'basics/workflow/script/globals/action/textModuleList'
				}).then(function (response) {
					textModuleEnum = response.data;
				});
			}

			function extendDeep(dst) {
				angular.forEach(arguments, function (obj) {
					if (obj !== dst) {
						angular.forEach(obj, function (value, key) {
							if (dst[key] && dst[key].constructor && dst[key].constructor === Object) {
								extendDeep(dst[key], value);
							} else {
								dst[key] = value;
							}
						});
					}
				});
				return dst;
			}

			function getAutoCompleteContext() {
				var structure = {};

				if (state.selectedTemplateVersion) {
					if (angular.isArray(state.selectedTemplateVersion.Context)) {
						for (var i = 0; i < state.selectedTemplateVersion.Context.length; i++) {
							structure[state.selectedTemplateVersion.Context[i].key] = state.selectedTemplateVersion.Context[i].value;
						}
					}

					basicsWorkflowUtilityService.forEachAction(state.selectedTemplateVersion.WorkflowAction, function (item) {
						if (item && angular.isArray(item.output)) {
							for (var o = 0; o < item.output.length; o++) {
								structure[item.output[o].value] = {};
							}
						}
					});
				}

				structure = {
					Context: structure,
					Actions: actionEnum,
					TextModules: textModuleEnum,
					ActionUtil: {
						ExecuteAction: Function('actionName', 'params', '') // jshint ignore:line
					},
					Lib: {
						Import: Function('url', '')// jshint ignore:line
					}
				};
				structure.moment = moment;
				structure._ = _;

				if (state.debugContext) {
					structure = extendDeep(structure, {'Context': state.debugContext});
				}

				return structure;
			}

			return {
				getAutoCompleteContext: getAutoCompleteContext,
				loadActions: loadActions,
				loadTextModules: loadTextModules
			};

		}]);

})();

