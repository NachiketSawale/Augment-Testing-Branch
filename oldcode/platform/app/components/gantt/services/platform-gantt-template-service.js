(function (angular) {
	'use strict';

	var moduleName = 'platform';

	angular.module(moduleName).service('platformGanttTemplateService', PlatformGanttTemplateService);

	PlatformGanttTemplateService.$inject = ['_', '$injector', '$q', '$http'];

	function PlatformGanttTemplateService(_, $injector, $q, $http) {
		var service = this,
			templatecollection = {
				templates: localTemplateDefaults()
			},
			templateversion = 0.4;

		service.loadTemplates = loadTemplatesAsync;

		service.getTemplates = function () {
			if (templatecollection) {
				return templatecollection.templates;
			}
		};

		function loadTemplatesAsync() {
			var templatesAsync = $q.defer();
			$http.get(globals.webApiBaseUrl + 'scheduling/main/settings/load', {
				params: {
					key: 'templates'
				}
			})
				.then(function (response) {
					templatecollection = JSON.parse(response.data.Value);
					// check for version number
					if (!correctVersion(templatecollection, templateversion)) {
						templatecollection.templates = localTemplateDefaults();
					}

					templatesAsync.resolve(templatecollection);

				})
				.catch(function () {
					templatesAsync.reject();
				});

			return templatesAsync.promise;

			function correctVersion(settingsobject, version) {
				var lowerboundary = Math.floor(version * 10) / 10;
				var upperboundary = lowerboundary + 0.1;

				return settingsobject && settingsobject.version &&
					settingsobject.version >= lowerboundary && settingsobject.version < upperboundary;
			}
		}

		function localTemplateDefaults() {
			return [{
				id: 1,
				name: 'Current version template',
				templates: [{
					type: 1,
					state: null,
					bartype: {
						id: 10,
						up: 0.2,
						down: 0.8,
						fill: '#7FB2D7'
					}
				}, {
					type: 2,
					state: null,
					bartype: {
						id: 10,
						up: 0.3,
						down: 0.5,
						iconstart: 'triangle-down',
						iconend: 'triangle-down',
						fill: '#000000'
					}
				}, {
					type: 4,
					state: null,
					bartype: {
						id: 10,
						up: 0.2,
						down: 0.8,
						fill: '#C5CAE9'
					}
				}, {
					type: 3,
					state: null,
					bartype: {
						id: 10,
						up: 0,
						down: 0,
						iconend: 'diamond',
						fill: '#000000'
					}
				}]
			}, {
				id: 2,
				name: 'Progress template',
				templates: [{
					type: 1,
					state: null,
					bartype: {
						id: 10,
						up: 0.2,
						down: 0.8,
						fill: '#7986CB'
					}
				}, {
					type: 2,
					state: null,
					bartype: {
						id: 10,
						up: 0.3,
						down: 0.5,
						iconstart: 'triangle-down',
						iconend: 'triangle-down',
						fill: '#7986CB'
					}
				}, {
					type: 4,
					state: null,
					bartype: {
						id: 10,
						up: 0.2,
						down: 0.8,
						fill: '#C5CAE9'
					}
				}, {
					type: 3,
					state: null,
					bartype: {
						id: 10,
						up: 0,
						down: 0,
						iconend: 'diamond',
						fill: '#7986CB'
					}
				}]
			}, {
				id: 3,
				name: 'Baseline template',
				templates: [{
					type: 1,
					state: null,
					bartype: {
						id: 10,
						up: 0.8,
						down: 1,
						fill: '#BDBDBD'
					}
				}, {
					type: 2,
					state: null,
					bartype: {
						id: 10,
						up: 0.3,
						down: 0.5,
						iconstart: 'triangle-down',
						iconend: 'triangle-down',
						fill: '#BDBDBD'
					}
				}, {
					type: 4,
					state: null,
					bartype: {
						id: 10,
						up: 0.2,
						down: 0.8,
						fill: '#C5CAE9'
					}
				}, {
					type: 3,
					state: null,
					bartype: {
						id: 10,
						up: 0,
						down: 0,
						iconend: 'diamond',
						fill: '#BDBDBD'
					}
				}]
			}];
		}
	}
})(angular);