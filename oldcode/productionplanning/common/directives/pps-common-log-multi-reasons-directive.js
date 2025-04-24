/**
 * Created by zov on 3/31/2020.
 */
(function () {
	'use strict';
	/* global angular */

	var moduleName = 'productionplanning.common';
	angular.module(moduleName).directive('ppsCommonLogMultiReasonsDirective', [
		'$compile',
		'$translate',
		'$injector',
		'ppsCommonLoggingConstant',
		'ppsCommonLoggingValidationExtension',
		function ($compile,
			$translate,
			$injector,
			ppsCommonLoggingConstant,
			loggingValidationExtension) {
			return {
				restrict: 'A',
				// require: '^ngModel',
				scope: {},
				controller: ['$scope', '$attrs',
					'platformModalService', 'platformRuntimeDataService',
					function ($scope, $attrs,
						platformModalService, platformRuntimeDataService) {
						let updateReasonDialogService = $injector.get('ppsCommonLoggingUpdateReasonsDialogService');
						updateReasonDialogService.closeOpenedDialogs();
						var options = $scope.$eval('$parent.' + $attrs.options);
						var entity = $scope.$eval('$parent.' + $attrs.entity);
						var unwatchEntity = $scope.$watch('$parent.' + $attrs.entity, function (value) {
							entity = value;
						});
						var unwatchDisplayReason = $scope.$watch('$parent.' + $attrs.entity + '.' + ppsCommonLoggingConstant.DisplayedReasonPropName, function (value) {
							if(value === undefined){
								value = $translate.instant('productionplanning.common.phEditUpdateReasons');
							}
							$scope.displayTxt = value;
						});
						$scope.$on('$destroy', function () {
							unwatchEntity();
							unwatchDisplayReason();
						});
						$scope.openDialog2FillUpdateReasons = function () {
							loggingValidationExtension.showLoggingDialog(entity, options.schemaOption, options.translationSrv, true).then(function (result) {
								if (result.ok === true) {
									setUpdateReasonsAndValidate(entity, result.value);
								} else if (result.applyAll === true) {
									if (angular.isFunction(entity.getDataService)) {
										const entities = loggingValidationExtension.getModifiedEntitiesInCurrentModule(entity);
										loggingValidationExtension.setUpdateReasonsAndValidateEntities(entities, entity, result.value, getValidator($scope, $attrs));
										entities.forEach(entity => updateUI(entity));
									}
								}
							});
						};

						var setUpdateReasonsAndValidate = function(entity, reason) {
							loggingValidationExtension.setUpdateReasons(entity, reason);
							validate(entity);
							updateUI(entity);
						};

						var validate = function (entity) {
							var validator = getValidator($scope, $attrs);
							var validResult = validator(entity, entity[ppsCommonLoggingConstant.ModificationInfoPropName], ppsCommonLoggingConstant.ModificationInfoPropName, true);
							platformRuntimeDataService.applyValidationResult(validResult, entity, ppsCommonLoggingConstant.ModificationInfoPropName);
						};

						var updateUI = function(entity) {
							entity[ppsCommonLoggingConstant.DisplayedReasonPropName] =
								$injector.get('ppsCommonLoggingHelper').getDisplayedUpdateReason(entity, options.translationSrv);
						};

						$scope.canEditReasons = function () {
							return !!entity;
						};
					}],
				link: function ($scope, element, attrs) {
					var template =
                        /* jshint multistr: true */
                        '<div class="input-group #formGridClass#">\
								<input type="text" class="input-group-content" data-platform-control-validation data-platform-select-on-focus\
								data-ng-readonly="true" data-config="#config#" data-entity="#entity#" data-ng-value="displayTxt" placeholder="#placeholder#"/>\
								<span class="input-group-btn">\
									<button btn-edit="" class="btn btn-default input-sm" data-ng-click="openDialog2FillUpdateReasons()" data-ng-disabled="!canEditReasons()">\
                                        <div class="control-icons ico-input-lookup lookup-ico-dialog"></div>\
                                    </button>\
								</span>\
							</div>';

					template = template.replace('#formGridClass#', attrs.grid ? 'lookup-container grid-container' : 'form-control control-directive')
						.replace('#config#', '$parent.' + attrs.config)
						.replace('#entity#', '$parent.' + attrs.entity)
						.replace('#placeholder#', $translate.instant('productionplanning.common.phEditUpdateReasons'));

					var ctrlElement = angular.element(template);
					element.html('');
					element.append(ctrlElement);
					$compile(ctrlElement)($scope);
				}
			};

			function getValidator($scope, $attrs) {
				if($attrs.grid){
					return $scope.$parent.config.validator;
				}else{
					return $scope.$eval('$parent.' + $attrs.config).validator;
				}
			}
		}
	]);
})();