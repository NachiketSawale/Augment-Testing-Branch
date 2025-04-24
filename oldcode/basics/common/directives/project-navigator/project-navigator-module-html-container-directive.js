(function () {
	'use strict';

	/**
	 * <div basics-common-project-navi-module-html-container></div>
	 */
	angular.module('basics.common').directive('basicsCommonProjectNaviModuleHtmlContainer', basicsCommonProjectNaviModuleHtmlContainer);
	basicsCommonProjectNaviModuleHtmlContainer.$inject = ['_', 'platformStringUtilsService', '$compile',
		'basicsCommonProjectNavigatorService', '$translate'];

	function basicsCommonProjectNaviModuleHtmlContainer(_, stringUtils, $compile,
		basicsCommonProjectNavigatorService, $translate) {


		return {
			restrict: 'A',
			scope: false,
			link: function(scope, elem) {

				const moduleInfo = scope.moduleItem.moduleInfo;
				const moduleNameTr = $translate.instant(moduleInfo.displayName$tr$);
				const moduleExpanded = scope.moduleItem.moduleSetting ? 'moduleItem.moduleSetting.expanded' : 'false';
				const moduleFilterOptions = scope.moduleItem.moduleSetting ? 'moduleItem.moduleSetting.filterOptions' : '{}';

				const moduleDataIds = JSON.stringify(scope.moduleItem.moduleData.map(md => md.dataItem.id));

				// If the module is expanded, do filter data first
				if(scope.moduleItem.moduleSetting && scope.moduleItem.moduleSetting.expanded){
					scope.naviOpts.onFilterOptionClick(scope.moduleItem);
				}

				let htmlMarkupNaviModule =
					`<div class="naviModule tree-accordion-content" data-basics-common-project-navigator-tree-node
						data-title="${moduleNameTr}"
						data-on-expanded="naviOpts.onModuleExpanded(moduleItem)" data-expanded-model="${moduleExpanded}"
						data-on-click="${moduleInfo.naviToModule} ? naviOpts.onLeaveItemClick(moduleItem,  projectItem.ProjectFk, ${moduleDataIds}, forceNewTab) : null"
						data-filter-option="${moduleFilterOptions}"
						data-get-filter-options="naviOpts.onGetAllFilterOptions(moduleItem)"
						data-on-filter="naviOpts.onFilterOptionClick(moduleItem)"
						data-type="module"
						data-iconclass="${moduleInfo.iconClass}"
						data-ng-disabled="${!moduleInfo.naviToModule}"
						style="border-left-color: ${moduleInfo.color || 'transparent'}">
							<div class="filteroption" ng-repeat="(key, values) in ${moduleFilterOptions}">
									<div ng-repeat="value in values">
										<button class="badge-info action">
											{{ value.title }}
											<span class="close-btn" ng-click="naviOpts.onFilterBadgeClick($event, moduleItem, key, value)"></span>
										</button>
									</div>
							</div>
							<div class="treeleave group-items fav-items level-2"
									ng-repeat="moduleData in moduleItem.moduleData"
									data-basics-common-project-navi-data-html-container>
							</div>
					</div>`;

				elem.append($compile(htmlMarkupNaviModule)(scope));

				if(moduleInfo.hideData){
					angular.element(elem).find('.nodetoggleimg').remove(); // remove toggle image from dom tree if hide data
				}
			}
		};
	}
})();