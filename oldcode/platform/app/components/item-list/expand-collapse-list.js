(function () {
	'use strict';
	function expandCollapseListDirective() {
		return {
			restrict: 'A',
			scope: {
				groupedList: '='
			},
			template: `<ul class='tools'><li class='sublist'>
                <button class='tlb-icons ico-tree-collapse-all' type='button' title="{{'cloud.common.toolbarCollapseAll' | translate}}"
                        data-ng-click='collapseAll()'>
                </button>
                <button class='tlb-icons ico-tree-expand-all' type='button' data-ng-click='expandAll()' title="{{'cloud.common.toolbarExpandAll' | translate}}">
                </button>
    </li>
    </ul>`,
			link: function (scope) {
				scope.expandAll = function () {
					scope.groupedList.forEach((element) => {
						element.visible = true;
					});
					if (scope.groupedList[0].id === 10000) {
						scope.groupedList[0].iconClass = 'ico-up';
					}
				};

				scope.collapseAll = function () {
					scope.groupedList.forEach((element) => {
						element.visible = false;
					});
					if (scope.groupedList[0].id === 10000) {
						scope.groupedList[0].iconClass = 'ico-down';
					}
				};
			},
		};
	}
	angular.module('platform').directive('platformExpandCollapseListDirective', [expandCollapseListDirective]);
})();
