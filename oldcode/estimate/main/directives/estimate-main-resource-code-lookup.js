/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function(angular) {

	'use strict';
	let moduleName = 'estimate.main';
	/**
	 * @ngdoc directive
	 * @name estimateMainCostCodesLookup
	 * @requires  estimateMainLookupService
	 * @description modal dialog window with list of costcodes
	 */

	angular.module(moduleName).directive('estimateMainResourceCodeLookup', ['$compile','$injector',
		function ( $compile,$injector) {
			let directive = {};
			directive.restrict = 'A';
			directive.scope = {
				entity: '=',
				ngModel: '=',
				options: '='
			};

			directive.controller = ['$scope', '$element', '$attrs', controller];

			function controller(scope, element, attrs) {
				// Get entity, read only.
				Object.defineProperty(scope, 'entity', {
					get: function () {
						return scope.$parent.$eval(attrs.entity);
					},
					set: angular.noop
				});

				// Get options, read only.
				Object.defineProperty(scope, 'options', {
					get: function () {
						return scope.$parent.$eval(attrs.options);
					},
					set: angular.noop
				});

				// Get result, read only.
				Object.defineProperty(scope, 'result', {
					get: function () {
						return scope.$parent.$eval(attrs.result);
					},
					set: angular.noop
				});
			}

			directive.link = function (scope, element, attrs) {
				let template;
				scope.options.idProperty = 'Id';
				scope.options.valueMember = scope.options.lookupField; // Default take the same value as displayMember (Incorrect)
				scope.options.displayMember = scope.options.lookupField;
				scope.config = scope.$eval(attrs.config) || scope.$eval('$parent.groups[0].rows[2]');
				let estimateMainResourceType = $injector.get('estimateMainResourceType');

				if(!scope.config){
					scope.config = _.find(scope.$eval('$parent.groups[0].rows'), {'model': 'Code'});
				}

				// important for styling
				let gridAttribute = scope.options.grid ? 'data-grid="true"' : '';
				//let configAttribute = 'data-config="$parent.' + attrs.config+'"';
				let configAttribute = 'data-config="config"';

				if (scope.options.grid && scope.entity && scope.entity.Id) {
					switch (scope.entity.EstResourceTypeFk) {
						case estimateMainResourceType.CostCode: // cost codes
							if(scope.options.usageContext === 'estimateAssembliesResourceService'){
								let lazyLoadSystemOption = $injector.get('estimateAssembliesService').getLazyLoadCostCodeSystemOption();
								if(lazyLoadSystemOption){
									scope.options.lazyLoadSystemOption = lazyLoadSystemOption;
									scope.options.filterKey = 'estimate-assemblies-lazy-load-cost-codes-filter'
								}
								template = '<div assemblies-cost-codes-lookup data-ng-model="ngModel" ' + configAttribute + ' data-entity="entity" ' + gridAttribute + ' data-use-in-grid-cell="true" data-options="options"></div>';
							}else {
								template = '<div estimate-main-cost-codes-lookup data-ng-model="ngModel" ' + configAttribute + ' data-entity="entity" ' + gridAttribute + ' data-use-in-grid-cell="true" data-options="options"></div>';
							}
							break;
						case estimateMainResourceType.Material: // material
							scope.options.materialFkField='MdcMaterialFk';
							scope.options.ignorePricePermission = true;
							// assembly and project assembly should take from master material
							if (scope.options.usageContext === 'estimateAssembliesResourceService' || scope.options.usageContext === 'projectAssemblyResourceService') {
								template = '<div estimate-assemblies-material-lookup data-ng-model="ngModel" ' + configAttribute + gridAttribute + ' data-entity="entity" data-options="options"></div>';
							} else {
								scope.options.isProcessLookupData = true;
								template = '<div estimate-main-material-lookup data-ng-model="ngModel" ' + configAttribute + gridAttribute + ' data-entity="entity" data-options="options"></div>';
							}
							break;
						case estimateMainResourceType.Plant: // plant
							scope.options.valueMember = 'Id';
							if(scope.entity.EtmPlantFk && scope.entity.EstResourceFk === null){
								template = '<div resource-equipment-plant-lookup-dialog-new data-ng-model="ngModel" ' + configAttribute + gridAttribute + ' data-entity="entity" data-options="options"></div>';
							}else{
								template = '<div estimate-main-plant-assembly-dialog data-ng-model="ngModel" ' + configAttribute + gridAttribute + ' data-entity="entity" data-options="options"></div>';
							}
							break;
						case estimateMainResourceType.Assembly: // assembly
							scope.options.valueMember = 'Id'; // Case: Assemblies Description could be empty, and it could not recognize if we change to another assembly with empty description, we require unique identifier
							template = '<div estimate-main-assembly-template-lookup data-ng-model="ngModel" ' + configAttribute + gridAttribute + ' data-entity="entity" data-options="options"></div>';
							break;
						case estimateMainResourceType.SubItem: // subitem
							if(scope.entity.EstAssemblyFk && scope.entity.EstHeaderAssemblyFk){
								scope.options.valueMember = 'Id'; // Case: Assemblies Description could be empty, and it could not recognize if we change to another assembly with empty description, we require unique identifier
								template = '<div estimate-main-assembly-template-lookup data-ng-model="ngModel" ' + configAttribute + gridAttribute + ' data-entity="entity" data-options="options"></div>';
							}else{
								template = '<div estimate-main-resource-sub-item-desc data-entity ="entity" ' + configAttribute + gridAttribute + ' data-ng-model="ngModel" data-display-member="' + scope.options.displayMember + '" data-options="options"></div>';
							}
							break;
						case estimateMainResourceType.ResResource: // res kind/res resources
							template = '<div estimate-main-res-resource-template-lookup data-ng-model="ngModel" ' + configAttribute + gridAttribute + ' data-entity="entity" data-options="options"></div>';
							break;
						case estimateMainResourceType.TextLine: // Text Line
							template = '<div estimate-main-resource-sub-item-desc data-entity ="entity" ' + configAttribute + gridAttribute + ' data-ng-model="ngModel" data-display-member="' + scope.options.displayMember + '" data-options="options"></div>';
							break;
						case estimateMainResourceType.InternalTextLine: // Internal Text Line
							template = '<div estimate-main-resource-sub-item-desc data-entity ="entity" ' + configAttribute + gridAttribute + ' data-ng-model="ngModel" data-display-member="' + scope.options.displayMember + '" data-options="options"></div>';
							break;
						case estimateMainResourceType.EquipmentAssembly: // Equipment Assembly "EA"
							scope.options.valueMember = 'Id';
							template = '<div estimate-main-plant-assembly-dialog data-ng-model="ngModel" ' + configAttribute + gridAttribute + ' data-entity="entity" data-options="options"></div>';
							break;
					}
				}else {
					template = '<div estimate-main-resource-detail-code-lookup data-ng-model="ngModel" data-entity="entity" ' + configAttribute + gridAttribute + ' data-options="options"></div>';
				}

				$compile(template)(scope).appendTo(element);
				//element.replaceWith($compile(template)(scope));
			};
			return directive;
		}
	]);

})(angular);

