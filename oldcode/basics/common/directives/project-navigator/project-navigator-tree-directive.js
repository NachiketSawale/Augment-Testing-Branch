(function () {
	'use strict';

	/**
	 * <div data-basics-common-project-navigator-tree data-project-navigator="naviProject"></div>
	 */
	angular.module('basics.common').directive('basicsCommonProjectNavigatorTree', basicsCommonProjectNavigatorTree);

	angular.module('basics.common').run(['$templateCache', function ($templateCache) {
		$templateCache.loadTemplateFile('basics.common/partials/project-navigator/project-navigator-tree-templates.html');
	}]);

	basicsCommonProjectNavigatorTree.$inject = ['_', '$compile','basicsCommonProjectNavigatorService', 'basicsCommonProjectNavigatorConfig'];

	function basicsCommonProjectNavigatorTree(_, $compile,basicsCommonProjectNavigatorService, basicsCommonProjectNavigatorConfig) {

		/**
		 * @param scope
		 * @param cs
		 * @returns {*|Object}
		 */
		function makeChildScopewithClean(scope, cs) {
			if (cs) {
				cs.$destroy();
			}
			return scope.$new();
		}

		return {
			restrict: 'A',
			scope: true,
			replace: true,
			transclude: true,
			template: '<div>@@content@@</div>',
			link: function (scope, elem, attr) {

				let childscope;

				/**
				 * @param naviProject
				 */
				function processNavigator(naviProject){
					let completecontent = '';

					if (naviProject) {
						scope.naviTreeMap = basicsCommonProjectNavigatorService.getNaviTree(naviProject.ProjectFk, basicsCommonProjectNavigatorConfig);
						scope.forceNewTab = false
						scope.projectItem = naviProject;

						completecontent =
							`<ul>
							 	<div basics-common-project-navi-project-html-container data-project-item="projectItem">
								</div>
							 </ul>`;
					}

					elem.empty();
					childscope = makeChildScopewithClean(scope, childscope);
					elem.append($compile(completecontent)(childscope));
				}

				scope.$watch(function () {
					return scope.$eval(attr.projectNavigator);
				}, function (project) {
					processNavigator(project);
				});

				function watchfn() {
					processNavigator(scope.$eval(attr.projectNavigator));
				}

				scope.$watch('version', watchfn);

			}

		}
	}
})();