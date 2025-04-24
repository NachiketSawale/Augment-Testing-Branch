
(function(angular) {

	'use strict';
	let moduleName = 'project.material';

	angular.module(moduleName).directive('projectCostCodeLookupHelper', ['$compile',
		function ( $compile) {
			let directive = {};
			directive.restrict = 'A';
			directive.scope = {
				entity: '=',
				ngModel: '=',
				options: '='
			};

			directive.link = function (scope, element, attrs) {
				scope.options.idProperty = 'Id';
				scope.options.valueMember = scope.options.lookupField; // Default take the same value as displayMember (Incorrect)
				scope.options.displayMember = scope.options.lookupField;

				// important for styling
				let gridAttribute = scope.options.grid ? 'data-grid="true"' : '';
				let configAttribute = 'data-config="$parent.' + attrs.config+'"';

				let template =  '<div project-cost-code-detail-lookup data-ng-model="ngModel" data-entity="entity" ' + configAttribute + gridAttribute + ' data-options="options"></div>';
				if (scope.options.grid && scope.entity && scope.entity.Id) {
					template = '<div project-cost-code-lookup data-ng-model="ngModel" ' + configAttribute + ' data-entity="entity" ' + gridAttribute + ' data-use-in-grid-cell="true" data-options="options"></div>';
				}
				element.replaceWith($compile(template)(scope));
			};
			return directive;
		}
	]);

})(angular);

