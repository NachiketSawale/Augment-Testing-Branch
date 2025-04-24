(function (angular) {
	'use strict';
	var moduleName = 'logistic.dispatching';
	/**
	 * @ngdoc directive
	 * @name logisticDispatchingRecordCodeLookup
	 * @requires
	 * @description modal dialog window with list of codes depending in record type e.g. material lookup, plant lookup
	 */

	angular.module(moduleName).directive('logisticDispatchingRecordCodeLookup', LogisticDispatchingRecordCodeLookup);

	LogisticDispatchingRecordCodeLookup.$inject = ['$compile', 'logisticDispatchingConstantValues'];

	function LogisticDispatchingRecordCodeLookup($compile, logisticDispatchingConstantValues) {
		var directive = {};
		directive.restrict = 'A';
		directive.scope = {
			entity: '=',
			ngModel: '=',
			options: '='
		};

		directive.link = function (scope, element, attrs) {
			var template;
			scope.options.idProperty = 'Id';
			scope.options.valueMember = 'Id';
			scope.options.displayMember = scope.options.lookupField;
			// important for styling
			var gridAttribute = scope.options.grid ? 'data-grid="true"' : '';
			var configAttribute = 'data-config="$parent.' + attrs.config+'"';

			if (scope.options.grid && scope.entity && scope.entity.Id) {
				switch (scope.entity.RecordTypeFk) {
					case logisticDispatchingConstantValues.record.type.resource:
						template = '<div resource-master-resource-lookup-dialog-new data-entity ="entity" ' + configAttribute + gridAttribute + ' data-ng-model="ngModel" data-display-member="' + scope.options.displayMember + '" data-options="options"></div>';
						break;
					case logisticDispatchingConstantValues.record.type.plant:
						template = '<div resource-equipment-plant-lookup-dialog-new data-ng-model="ngModel" ' + configAttribute + gridAttribute + ' data-entity="entity" data-options="options"></div>';
						break;
					case logisticDispatchingConstantValues.record.type.material:
						template = '<div basics-material-material-lookup data-ng-model="ngModel" ' + configAttribute + gridAttribute + ' data-entity="entity" data-options="options"></div>';
						break;
					case logisticDispatchingConstantValues.record.type.sundryService:
						template = '<div logistic-sundry-service-lookup-dialog data-ng-model="ngModel" ' + configAttribute + gridAttribute + ' data-entity="entity" data-options="options"></div>';
						break;
					case logisticDispatchingConstantValues.record.type.costCode:
						template = '<div basics-cost-codes-lookup data-ng-model="ngModel" ' + configAttribute + ' data-entity="entity" ' + gridAttribute + ' data-use-in-grid-cell="true" data-options="options"></div>';
						break;
					case logisticDispatchingConstantValues.record.type.fabricatedProduct:
						template = '<div productionplanning-common-product-lookup data-ng-model="ngModel" ' + configAttribute + ' data-entity="entity" ' + gridAttribute + ' data-use-in-grid-cell="true" data-options="options"></div>';
						break;
				}
			}else {
				template = '<div logistic-dispatching-record-detail-code-lookup data-ng-model="ngModel" data-entity="entity" ' + configAttribute + gridAttribute + ' data-options="options"></div>';
			}

			element.replaceWith($compile(template)(scope));
		};

		return directive;
	}
})(angular);

