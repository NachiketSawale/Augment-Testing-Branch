/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function(angular) {

	'use strict';
	let moduleName = 'estimate.main';

	/**
	 * @ngdoc directive
	 * @name estimateMainResourceDetailCodeLookup
	 * @requires  estimateMainResourceDetailCodeLookup
	 * @description replace control and domain according to resource type for detail container
	 */

	angular.module(moduleName).directive('estimateMainResourceDetailCodeLookup', [
		'$timeout', 'estimateMainResourceService', '$compile', 'estimateMainResourceType',
		function ($timeout, estimateMainResourceService, $compile, estimateMainResourceType) {

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

					function getLookupTemplate(entity){
						let template;
						let  domainAttribute;
						switch (entity.EstResourceTypeFk) {
							case estimateMainResourceType.CostCode: // cost codes
								template = '<div estimate-main-cost-codes-lookup data-ng-model="ngModel"  data-config="config" data-entity="entity" ' + gridAttribute + ' data-use-in-grid-cell="true" data-options="options"></div>';
								break;
							case estimateMainResourceType.Material: // material
								scope.options.materialFkField='MdcMaterialFk';
								if (scope.options.usageContext === 'estimateAssembliesResourceService') {
									template = '<div estimate-assemblies-material-lookup data-ng-model="ngModel" data-config="config" ' + gridAttribute + ' data-entity="entity" data-options="options"></div>';
								} else {
									scope.options.isProcessLookupData = true;
									template = '<div estimate-main-material-lookup data-ng-model="ngModel" data-config="config"' + gridAttribute + ' data-entity="entity" data-options="options"></div>';
								}
								break;
							case estimateMainResourceType.Plant:
							case estimateMainResourceType.EquipmentAssembly:
								domainAttribute = scope.options.displayMember === 'DescriptionInfo.Translated' ? ' data-domain="translation"': ' data-domain="description"';
								delete scope.config.validator;
								delete scope.config.asyncValidator;
								template = '<div estimate-main-plant-assembly-dialog data-ng-model="ngModel" data-config="config"' + gridAttribute + ' data-entity="entity" data-options="options" readonly="false"></div>';
								break;
							case estimateMainResourceType.Assembly: // assembly
								template = '<div estimate-main-assembly-template-lookup data-ng-model="ngModel" data-config="config"' + gridAttribute + ' data-entity="entity" data-options="options"></div>';
								break;
							case estimateMainResourceType.SubItem: // subitem
								domainAttribute = scope.options.displayMember === 'DescriptionInfo.Translated' ? ' data-domain="translation"': ' data-domain="description"';
								if (scope.options.displayMember === 'DescriptionInfo.Translated'){
									delete scope.config.validator;
									delete scope.config.asyncValidator;
									$timeout(function(){
										let validator = angular.copy(scope.config.validator);
										let asyncValidator = angular.copy(scope.config.asyncValidator);
										scope.config.validator = validator;
										scope.config.asyncValidator = asyncValidator;
									}, 0);
								}
								template = '<div estimate-main-resource-sub-item-desc data-entity ="entity" data-config="config" ' + gridAttribute + domainAttribute +  ' data-display-member="' + scope.options.displayMember + '" data-ng-model="ngModel"  data-options="options"></div>';
								break;
							case estimateMainResourceType.ResResource: // res kind/res resources
								template = '<div estimate-main-res-resource-template-lookup data-ng-model="ngModel" data-config="config" ' + gridAttribute + ' data-entity="entity" data-options="options"></div>';
								break;
							default:
								domainAttribute = scope.options.displayMember === 'DescriptionInfo.Translated' ? ' data-domain="translation"': ' data-domain="description"';
								delete scope.config.validator;
								delete scope.config.asyncValidator;
								template = '<div estimate-main-resource-sub-item-desc data-entity ="entity" data-config="config" ' + gridAttribute + domainAttribute + ' data-ng-model="ngModel"  data-options="options" readonly="true"></div>';
								break;
						}
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

