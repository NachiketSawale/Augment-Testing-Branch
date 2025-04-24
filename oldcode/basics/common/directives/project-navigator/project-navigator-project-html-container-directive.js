(function () {
	'use strict';

	/**
	 * <div basics-common-project-navi-project-html-container></div>
	 */
	angular.module('basics.common').directive('basicsCommonProjectNaviProjectHtmlContainer', basicsCommonProjectNaviProjectHtmlContainer);
	basicsCommonProjectNaviProjectHtmlContainer.$inject = ['_', '$compile'];

	function basicsCommonProjectNaviProjectHtmlContainer(_, $compile) {


		return {
			restrict: 'A',
			scope: true,
			link: function(scope, elem) {

				let htmlMarkup = `<div class="treelist tree-accordion tree-accordion-type-1 project" data-basics-common-project-navigator-tree-node
												data-expanded-model="${true}"
												data-on-click="naviOpts.onProjectClick(naviTreeMap.project.id, forceNewTab)"
												data-title="{{naviTreeMap.project.title}}"
												data-type="project"
												data-iconclass="ico-project">
												<div ng-repeat="moduleItem in naviTreeMap.modules" class="level-1">
													<div data-basics-common-project-navi-module-html-container></div>
												</div>
										</div>`;

				elem.append($compile(htmlMarkup)(scope));
				angular.element(elem).find('.nodetoggleimg').remove(); // remove toggle image from dom tree

			}
		};
	}
})();