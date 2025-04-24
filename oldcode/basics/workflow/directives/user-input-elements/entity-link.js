(function () {
	'use strict';

	function basicsWorkflowEntityLinkDirective(platformModuleNavigationService) {
		return {
			restrict: 'A',
			scope: {
				options: '='
			},
			replace: true,
			template: '<a data-ng-click="goTo()" class="cursor-pointer">{{options.displayText}}</a>',
			link: function (scope) {

				scope.goTo = function goTo() {
					let entity = {};
					const entityId = parseInt(scope.options.entity);
					if (!isNaN(entityId) && typeof entityId === 'number') {
						entity.Id = entityId;
					} else {
						entity = scope.options.entity;
					}

					platformModuleNavigationService.navigate({moduleName: scope.options.moduleName},
						entity, 'Id');
				};
			}
		};
	}

	basicsWorkflowEntityLinkDirective.$inject = ['platformModuleNavigationService'];

	angular.module('basics.workflow').directive('basicsWorkflowEntityLinkDirective', basicsWorkflowEntityLinkDirective);

})();
