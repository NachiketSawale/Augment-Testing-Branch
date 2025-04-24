(function (angular) {

	'use strict';
	var moduleName = 'logistic.dispatching';

	/**
	 * @ngdoc directive
	 * @name logisticDispatchingRecordDetailCodeLookup
	 * @requires
	 * @description replace control and domain according to record type for detail container
	 */

	angular.module(moduleName).directive('logisticDispatchingRecordDetailCodeLookup', LogisticDispatchingRecordDetailCodeLookup);

	LogisticDispatchingRecordDetailCodeLookup.$inject = ['$timeout', '$compile', 'logisticDispatchingConstantValues'];

	function LogisticDispatchingRecordDetailCodeLookup($timeout, $compile, logisticDispatchingConstantValues) {

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
				var newScope;
				scope.$watch('entity.RecordTypeFk',function(){
					if (newScope){
						newScope.$destroy();
					}
					var template = getLookupTemplate(scope.entity || {});
					if (template){
						newScope = scope.$new();
						elements.children().replaceWith($compile(template)(newScope));
					}
				});

				var gridAttribute = attrs.grid ? 'data-grid="true"' : '';
				var template = '<div data-domain-control data-cssclass="grid-control" ' + gridAttribute + ' class ="fullwidth" data-ng-model="ngModel" data-entity="entity" data-domain="description" readonly="true" data-config="config"/>';

				function getLookupTemplate(entity){
					var template = '<div class="form-control" data-ng-readonly="true"></div>';
					var  domainAttribute;
					switch (entity.RecordTypeFk) {
						case logisticDispatchingConstantValues.record.type.resource:
							domainAttribute = scope.options.displayMember === 'DescriptionInfo.Translated' ? ' data-domain="translation"': ' data-domain="description"';
							if (scope.options.displayMember === 'DescriptionInfo.Translated'){
								delete scope.config.validator;
								delete scope.config.asyncValidator;
								$timeout(function(){
									var validator = angular.copy(scope.config.validator);
									var asyncValidator = angular.copy(scope.config.asyncValidator);
									scope.config.validator = validator;
									scope.config.asyncValidator = asyncValidator;
								}, 0);
							}
							template = '<div resource-master-resource-lookup-dialog-new data-entity ="entity" ' + domainAttribute + gridAttribute + ' data-ng-model="ngModel" data-display-member="' + scope.options.displayMember + '" data-options="options"></div>';
							break;
						case logisticDispatchingConstantValues.record.type.plant:
							domainAttribute = scope.options.displayMember === 'DescriptionInfo.Translated' ? ' data-domain="translation"': ' data-domain="description"';
							delete scope.config.validator;
							delete scope.config.asyncValidator;
							template = '<div resource-equipment-plant-lookup-dialog-new data-ng-model="ngModel" ' + gridAttribute + domainAttribute +' data-entity="entity" data-options="options"></div>';
							break;
						case logisticDispatchingConstantValues.record.type.material:
							scope.options.materialFkField='MdcMaterialFk';
							template = '<div basics-material-material-lookup data-ng-model="ngModel" ' + gridAttribute + ' data-entity="entity" data-options="options"></div>';
							break;
						case logisticDispatchingConstantValues.record.type.sundryService:
							domainAttribute = scope.options.displayMember === 'DescriptionInfo.Translated' ? ' data-domain="translation"': ' data-domain="description"';
							template = '<div logistic-sundry-service-lookup-dialog data-ng-model="ngModel" ' + gridAttribute + domainAttribute +' data-entity="entity" data-options="options"></div>';
							break;
						case logisticDispatchingConstantValues.record.type.costCode:
							template = '<div basics-cost-codes-lookup data-ng-model="ngModel" data-entity="entity" ' + gridAttribute + ' data-use-in-grid-cell="true" data-options="options"></div>';
							break;
						case logisticDispatchingConstantValues.record.type.fabricatedProduct:
							template = '<div productionplanning-common-product-lookup data-ng-model="ngModel" ' + gridAttribute + ' data-entity="entity" ' + gridAttribute + ' data-use-in-grid-cell="true" data-options="options"></div>';
							break;
					}
					return template;
				}

				elements.replaceWith($compile(template)(scope));
			},
			template: function (elem, attrs) {
				var gridAttribute = attrs.grid ? 'data-grid="true"' : '';
				return '<div data-domain-control data-cssclass="grid-control"' + gridAttribute + ' class ="fullwidth" data-ng-model="ngModel" data-entity="entity" data-domain="description" readonly="false" data-config="config"/>';
			}
		};
	}
})(angular);

