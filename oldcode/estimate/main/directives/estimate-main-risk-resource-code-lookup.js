/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function(angular) {
	'use strict';
	let moduleName = 'estimate.main';
	angular.module(moduleName).directive('estimateMainRiskResourceCodeLookup', [
		'$compile', 'estimateMainResourceType',
		function ($compile, estimateMainResourceType) {
			let directive = {};
			directive.restrict = 'A';
			directive.scope = {
				entity: '=',
				ngModel: '=',
				options: '='
			};

			directive.link = function (scope, element, attrs){
				let template;
				scope.options.idProperty = 'Id';
				scope.options.valueMember = scope.options.lookupField; // Default take the same value as displayMember (Incorrect)
				scope.options.displayMember = scope.options.lookupField;

				// important for styling
				let gridAttribute = scope.options.grid ? 'data-grid="true"' : '';
				let configAttribute = 'data-config="$parent.' + attrs.config+'"';

				if (scope.options.grid && scope.entity && scope.entity.Id) {

					switch (scope.entity.EstResourceTypeFk) {
						case estimateMainResourceType.CostCode: // cost codes
							template = '<div estimate-main-cost-codes-lookup data-ng-model="ngModel" ' + configAttribute + ' data-entity="entity" ' + gridAttribute + ' data-use-in-grid-cell="true" data-options="options"></div>';
							break;
						case estimateMainResourceType.Material: // material
							scope.options.materialFkField='MdcMaterialFk';

							scope.options.isProcessLookupData = true;
							template = '<div basics-material-material-Lookup data-ng-model="ngModel" ' + configAttribute + gridAttribute + ' data-entity="entity"' +
									' data-options="options"></div>';

							break;
						case estimateMainResourceType.Plant: // plant
							// TODO:
							break;
						case estimateMainResourceType.Assembly: // assembly
							// TODO: Daniel Check for basics approach
							scope.options.valueMember = 'Id'; // Case: Assemblies Description could be empty, and it could not recognize if we change to another assembly with empty description, we require unique identifier
							template = '<div estimate-main-assembly-template-lookup data-ng-model="ngModel" ' + configAttribute + gridAttribute + ' data-entity="entity" data-options="options"></div>';
							break;
						case estimateMainResourceType.SubItem: // subitem
							// TODO: Daniel Check for basics approach
							template = '<div estimate-main-resource-sub-item-desc data-entity ="entity" ' + configAttribute + gridAttribute + ' data-ng-model="ngModel" data-display-member="' + scope.options.displayMember + '" data-options="options"></div>';
							break;
						case estimateMainResourceType.ResResource: // res kind/res resources
							// TODO: Daniel Check for basics approach
							template = '<div estimate-main-res-resource-template-lookup data-ng-model="ngModel" ' + configAttribute + gridAttribute + ' data-entity="entity" data-options="options"></div>';
							break;
					}

				}

				element.replaceWith($compile(template)(scope));
			};
			return directive;
		}
	]);
})(angular);


