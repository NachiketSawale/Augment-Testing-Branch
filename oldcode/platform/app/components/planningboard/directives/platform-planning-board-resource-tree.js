(function (angular) {
	'use strict';
	var moduleName = 'platform';

	angular.module(moduleName).directive('platformPlanningBoardResourceTree', PlatformPlanningBoardResourceTreeDirective);

	function PlatformPlanningBoardResourceTreeDirective() {
		return {
			scope: true,
			template: '<div class="gridwrapper" style="height:100%"><div data-platform-grid data-data="gridData" style="height:100%"></div></div>',
			restrict: 'A',
			link: {
				pre: preLinkPlanningBoardResourceTree
			}
		};

		function preLinkPlanningBoardResourceTree(scope) {
			scope.data = {
				config: {
					columns: [{
						id: 'code',
						formatter: 'code',
						field: 'Code',
						name: 'Code',
						name$tr: 'cloud.common.entityCode',
						tooltip: 'Code',
						sortable: true
					}, {
						id: 'description',
						formatter: 'description',
						field: 'Description',
						name: 'Description',
						name$tr: 'cloud.common.entityDescription',
						tooltip: 'Description',
						sortable: true
					}]
				},
				state: 'a309d342270047469772a53b86c9a84a'
			};
		}
	}
})(angular);
