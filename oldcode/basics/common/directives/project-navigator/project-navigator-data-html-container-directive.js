(function () {
	'use strict';

	/**
	 * <div basics-common-project-navi-data-html-container></div>
	 */
	angular.module('basics.common').directive('basicsCommonProjectNaviDataHtmlContainer', basicsCommonProjectNaviDataHtmlContainer);
	basicsCommonProjectNaviDataHtmlContainer.$inject = ['_', 'platformStringUtilsService', '$compile'];

	function basicsCommonProjectNaviDataHtmlContainer(_, stringUtils, $compile) {
		return {
			restrict: 'A',
			scope: false,
			link: function(scope, elem) {

				const moduleData = scope.moduleData;

				if(moduleData.submoduleInfos && moduleData.submoduleInfos.length > 0){
					const dataExpanded = 'moduleData.dataItem.dataUserSetting.expanded';
					let htmlMarkupNaviDataNode =
						`<div class="tree-accordion-content"
					         data-basics-common-project-navigator-tree-node
				            data-on-click="naviOpts.onLeaveItemClick(moduleItem, projectItem.ProjectFk, ${moduleData.dataItem.id}, forceNewTab)"
								data-title="${moduleData.dataItem.formattedDescription}"
				            data-expanded-model="${dataExpanded}"
				            data-type="item"
				            ng-if="moduleData.dataItem.dataUserSetting.isVisible">
				            <div ng-repeat="moduleItem in moduleData.submoduleInfos" class="sub-module level-3">
										<div basics-common-project-navi-module-html-container></div>
					         </div>
						</div>`;

					elem.append($compile(htmlMarkupNaviDataNode)(scope));
				} else {
					let htmlMarkupNaviDataLeaf =
						`<div class="tree-accordion-content"
					         data-basics-common-project-navigator-tree-leaf
					         data-on-click="naviOpts.onLeaveItemClick(moduleItem, projectItem.ProjectFk, ${moduleData.dataItem.id}, forceNewTab)"
							 	data-title="${moduleData.dataItem.formattedDescription}"
				            data-type="item"
				            ng-if="moduleData.dataItem.dataUserSetting.isVisible">
						</div>`;

					elem.append($compile(htmlMarkupNaviDataLeaf)(scope));
				}
			}
		};
	}
})();