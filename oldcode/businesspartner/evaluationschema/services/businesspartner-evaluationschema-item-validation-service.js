(function (angular) {
	'use strict';
	angular.module('businesspartner.evaluationschema').factory('businessPartnerEvaluationschemaItemValidationService',
		['platformDataValidationService', 'platformPropertyChangedUtil', 'platformRuntimeDataService', '$translate', 'businesspartnerEvaluationschemaHeaderService',
			function (platformDataValidationService, platformPropertyChangedUtil, platformRuntimeDataService, $translate, schemaService) {

				return function (dataService) {
					return {
						validateModel: function () {
							return true;
						},
						validatePoints: function (entity, value, model) {
							let result = {apply: true, valid: true};
							let subGroupSelected = dataService.parentService().getSelected();
							if (!subGroupSelected) {
								return;
							}
							let subGroupPointsPossible = subGroupSelected.PointsPossible,
								subGroupPointsMinimum = subGroupSelected.PointsMinimum,
								subGroupMultiSelect = subGroupSelected.IsMultiSelect;
							if (platformDataValidationService.isEmptyProp(value)) {
								result.valid = false;
								result.error = $translate.instant('cloud.common.emptyOrNullValueErrorMessage', {fieldName: model.toLowerCase()}); // jshint ignore:line
							}
							if (subGroupMultiSelect) {
								let schemaItemList = dataService.getList(),
									totalPoint = 0,
									isCreateEntity = true;
								schemaItemList.forEach(function (item) {
									if (item.Id !== entity.Id) {
										totalPoint += item.Points;
									} else {
										isCreateEntity = false;
										totalPoint += value;
									}
								});

								if (isCreateEntity) {
									totalPoint += value;
								}

								if (totalPoint > subGroupPointsPossible || totalPoint < subGroupPointsMinimum) {
									result.valid = false;
									result.error = $translate.instant('cloud.common.amongValueErrorMessage', {
										object: 'summary of the ' + model.toLowerCase(),  // jshint ignore:line
										rang: subGroupPointsMinimum + '-' + subGroupPointsPossible
									}, true);
								} else {
									schemaItemList.forEach(function (item) {
										platformRuntimeDataService.applyValidationResult(true, item, model);
										// dataService.markItemAsModified(item);//todo-jes: this will cause unnecessary update action as no field of the item has been modified
									});
									dataService.gridRefresh();
								}
							} else {
								if (value < subGroupPointsMinimum || value > subGroupPointsPossible) {
									result.valid = false;
									result.error = $translate.instant('cloud.common.amongValueErrorMessage', {
										object: model.toLowerCase(), // jshint ignore:line
										rang: subGroupPointsMinimum + '-' + subGroupPointsPossible
									}, true);
								}
							}

							platformRuntimeDataService.applyValidationResult(result, entity, model);
							platformDataValidationService.finishValidation(result, entity, value, model, this, dataService);
							return result;
						},
						validateIsDefault: function (entity, value, model) {
							platformPropertyChangedUtil.onlyOneIsTrue(dataService, entity, value, model);
							return {apply: value, valid: true};
						},
						validateFormFieldFk: function (entity, value, model){
							if (!schemaService.oldFormFieldId){
								schemaService.oldFormFieldId = entity.FormFieldFk;
							}
							return {apply: true, valid: true};
						}
					};
				};
			}
		]);
})(angular);
