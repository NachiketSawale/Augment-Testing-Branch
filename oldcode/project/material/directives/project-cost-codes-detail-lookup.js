

(function(angular) {

	'use strict';
	let moduleName = 'project.material';

	angular.module(moduleName).directive('projectCostCodeDetailLookup', [
		'$timeout', 'estimateMainResourceService', '$compile',
		function ($timeout, estimateMainResourceService, $compile) {

			return {
				restrict: 'A',
				scope : {
					entity:'=',
					ngModel:'=',
					options:'=',
					config:'=',
					grid: '='
				},
				link: function(scope, elements, attrs){
					let newScope;
					scope.$watch('entity.EstResourceTypeFk',function(){
						if (newScope){
							newScope.$destroy();
						}
						let template = getLookupTemplate(scope.entity || {});
						if (template){
							newScope = scope.$new();
							elements.children().replaceWith($compile(template)(newScope));
						}
					});

					let gridAttribute = attrs.grid ? 'data-grid="true"' : '';
					let template = '<div data-domain-control data-cssclass="grid-control"' + gridAttribute + ' class ="fullwidth" data-ng-model="ngModel" data-entity="entity" data-domain="description" readonly="true" data-config="config"/>';

					function getLookupTemplate(){
						let template = '<div project-cost-code-lookup data-ng-model="ngModel"  data-config="config" data-entity="entity" ' + gridAttribute + ' data-use-in-grid-cell="true" data-options="options"></div>';
						return template;
					}

					elements.replaceWith($compile(template)(scope));
				},
				template: function (elem, attrs) {
					let gridAttribute = attrs.grid ? 'data-grid="true"' : '';
					return '<div data-domain-control data-cssclass="grid-control"' + gridAttribute + ' class ="fullwidth" data-ng-model="ngModel" data-entity="entity" data-domain="description" readonly="false" data-config="config"/>';
				}
			};
		}
	]);

})(angular);

