(() => {
	'use strict';

	function cloudDesktopHeaderBreadcrumbs($compile, platformModuleNavigationService, basicsCommonProjectNavigatorConfig) {
		return {
			restrict: 'EA',
			scope: false,
			link: function(scope, elem, attr) {
				let naviConfig = _.cloneDeep(basicsCommonProjectNavigatorConfig);

				scope.getCSSClass = function(subTitle) {
					if(subTitle.moduleName && subTitle.moduleName === 'project.main' && subTitle.id) {
						return 'clickable';
					}
				};

				function getfurtherFilters(moduleName) {
					let moduleInfo = _.find(naviConfig, {moduleName: moduleName});
					return moduleInfo.hasOwnProperty('furtherFilters') ? moduleInfo.furtherFilters : 'projectId';
				}

				scope.breadCrumbLink = function(subTitle) {
					let furtherFilter = getfurtherFilters(subTitle.moduleName);

					platformModuleNavigationService.navigate({
						moduleName: subTitle.moduleName,
					}, {projectId: subTitle.id}, furtherFilter);
				}

				let template = `<div data-ng-repeat="subTitle in headerInfo.subTitle track by $index" class="ui-breadcrumb-item" title="{{subTitle.description}}">
							<span class="control-icons ico-arrow-right image" data-ng-if="!$first"></span>
							<a ng-click="breadCrumbLink(subTitle)" data-ng-class="getCSSClass(subTitle)">
									<span data-ng-class="subTitle.cssClass">{{subTitle.description}}</span>
							</a>
						</div>`;

				elem.empty().append($compile(template)(scope));
			}
		};
	}


	cloudDesktopHeaderBreadcrumbs.$inject = ['$compile', 'platformModuleNavigationService', 'basicsCommonProjectNavigatorConfig'];
	angular.module('cloud.desktop').directive('cloudDesktopHeaderBreadcrumbs', cloudDesktopHeaderBreadcrumbs);
})();