/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */
	'use strict';

	let moduleName = 'estimate.main';

	angular.module(moduleName).directive('estimateMainAssignBoqPackageDynamicCompositeLookup', [
		'_',
		'$compile',
		'$templateCache',
		'platformObjectHelper',
		'basicsLookupdataLookupOptionService',
		'$http',
		'platformModalService',
		function (_,
			$compile,
			$templateCache,
			platformObjectHelper,
			basicsLookupdataLookupOptionService,
			$http,
			platformModalService) {
			let defaultOptions = {
				// specific lookup directive to be used to edit value.
				lookupDirective: '',
				// property name , get its value to show in description box.
				descriptionMember: '',
				// options for specific directive.
				lookupOptions: {}
			};

			return {
				restrict: 'A',
				scope: {},
				link: linker
			};

			function linker(scope, element, attrs) {
				let template = $templateCache.get('estimate-main-assign-boq-package-dynamic-composite-lookup-template.html'),
					options = scope.$parent.$eval(attrs.options),
					settings = _.mergeWith({}, defaultOptions, options, basicsLookupdataLookupOptionService.customizer);
				options = angular.copy(options);

				let descriptionReadonlyField = null;
				if (angular.isFunction(options.isDescriptionReadonly)) {
					scope.isDescriptionReadonly = function () {
						return options.isDescriptionReadonly();
					}
					descriptionReadonlyField = 'isDescriptionReadonly()';
				}

				template = template.replace(/\$\$directiveHolder\$\$/gm, settings.lookupDirective ? ('data-' + settings.lookupDirective) : '')
					.replace(/\$\$entityHolder\$\$/gm, attrs.entity ? ('data-entity="$parent.' + attrs.entity + '"') : '')
					.replace(/\$\$configHolder\$\$/gm, attrs.config ? ('data-config="$parent.' + attrs.config + '"') : '')
					.replace(/\$\$descriptionReadonlyHolder\$\$/gm, descriptionReadonlyField ?
						'data-readonly="' + descriptionReadonlyField + '"' : 'data-readonly="!hideLookup"');
				scope.description = '';

				scope.lookupOptions = settings.lookupOptions;

				if(scope.$parent.entity[options.boqPackageAssignmentEntityField]){
					scope.isReadOnlyPackageCode =  scope.$parent.entity[options.boqPackageAssignmentEntityField][options.IsReadOnlyPackageCodeField];
				}

				if(options.codeField){
					scope.codeField = '$parent.entity.' + options.codeField;
				}
				if(options.descriptionField){
					scope.descriptionField = '$parent.entity.' + options.descriptionField;
				}

				if(options.readOnlyField) {
					scope.$watch('$parent.entity.' + options.readOnlyField, function (newValue) {
						scope.hideLookup = newValue;
					});
				}

				// watch the procument package description
				scope.$watch('$parent.entity.' + options.descriptionField, function (newValue) {
					if(scope.$parent.entity[options.boqPackageAssignmentEntityField]){
						scope.$parent.entity[options.boqPackageAssignmentEntityField][options.SubPackageDescriptionField]= newValue;
					}
				});

				scope.$watch('$parent.entity.' + options.codeField, function (newValue) {
					if(scope.$parent.entity[options.boqPackageAssignmentEntityField] && scope.$parent.entity[options.boqPackageAssignmentEntityField].IsCreateNew){


						let isReadOnlyPackageCode = scope.isReadOnlyPackageCode =  scope.$parent.entity[options.boqPackageAssignmentEntityField][options.IsReadOnlyPackageCodeField];

						if(!isReadOnlyPackageCode && newValue){

							$http.get(globals.webApiBaseUrl + 'procurement/package/package/CheckPackageCodeIsUnique?code=' +newValue)
								.then(function (response) {
									if(response && !response.data){
										platformModalService.showMsgBox('estimate.main.createBoqPackageWizard.codeConflict', 'estimate.main.createBoqPackageWizard.codeConflictInfo', 'ico-info');
										updateCanFinish(scope, false);
										scope.$parent.entity[options.boqPackageAssignmentEntityField].CodeConflict = true;
									}else {
										updateCanFinish(scope, true);
										scope.$parent.entity[options.boqPackageAssignmentEntityField].CodeConflict = false;
									}

									if(!(scope.$parent.entity && scope.$parent.entity.boqPackageAssignmentEntity && scope.$parent.entity.boqPackageAssignmentEntity.Package.StructureFk)){
										updateCanFinish(scope, false);
									}
								});
						}else {

							// if the lineitems has no resources
							if (scope.$parent.entity[options.boqPackageAssignmentEntityField].filterResourceWithOutPackage) {
								updateCanFinish(scope, !!newValue);
							} else {
								let costTransferOptprofile = scope.$parent.entity[options.boqPackageAssignmentEntityField].CostTransferOptprofile;
								if (costTransferOptprofile && costTransferOptprofile.length) {
									updateCanFinish(scope, !!newValue);
								}
							}
						}

						if(!(scope.$parent.entity && scope.$parent.entity.boqPackageAssignmentEntity && scope.$parent.entity.boqPackageAssignmentEntity.Package.StructureFk)){
							updateCanFinish(scope, false);
						}
					}

				});

				scope.$watch('$parent.entity.' + options.boqPackageAssignmentEntityField + '.IsCreateNew', function (newValue) {
					if (!newValue && scope.hideLookup) {
						scope.isReadOnlyPackageCode = true;
					}
				});

				$compile(angular.element(template).appendTo(element))(scope);
			}

			function updateCanFinish(scope, newValue) {
				let currentStep = getCurrentStep(scope);
				if (!currentStep) {
					return;
				}

				currentStep.canFinish = newValue;
			}

			function getCurrentStep(scope) {
				if (!scope) {
					return null;
				}
				let parent = scope.$parent;
				let currentStep = null;
				while (parent && !currentStep) {
					currentStep = parent.currentStep;
					parent = parent.$parent;
				}
				return currentStep;
			}
		}]);

})(angular);
