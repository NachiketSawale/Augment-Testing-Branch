/**
 * Created by chk on 1/11/2016.
 */
/* global _ */
(function (angular) {
	'use strict';
	/* jshint -W072 */
	angular.module('constructionsystem.master')
		.factory('constructionSystemMasterValidationHelperService',
			['platformRuntimeDataService', 'platformDataValidationService', 'platformToolbarService', '$timeout', 'platformObjectHelper','variableNameKeywords',
				function (platformRuntimeDataService, platformDataValidationService, platformToolbarService, $timeout, platformObjectHelper,variableNameKeywords) {
					var service = {};

					function removeError(entity) {
						if (entity.__rt$data && entity.__rt$data.errors) {
							entity.__rt$data.errors = null;
						}
					}

					function handleError(result, entity, model) {
						if (!result.valid) {
							platformRuntimeDataService.applyValidationResult(result, entity, model);
						} else {
							removeError(entity);
						}
					}

					function isUnique(itemList, model, value, id) {

						return _.some(itemList, function (item) {
							var currentValue = platformObjectHelper.getValue(item, model);
							if (currentValue && value && item.Id !== id) {
								return currentValue.toLowerCase() === value.toLowerCase();
							}
							else {
								return currentValue === value && item.Id !== id;
							}
						});
					}

					service.validateSorting = function (value, model) {
						return platformDataValidationService.isMandatory(value, model);
					};

					service.validateDescriptionInfo = function (entity, value, model, dataService) {
						var result = platformDataValidationService.isEmptyProp(value);
						if (result) {
							result = platformDataValidationService.createErrorObject('cloud.common.emptyOrNullValueErrorMessage', {fieldName: 'description'});
						} else {
							result = platformDataValidationService.isUnique(dataService.getList(), model, value, entity.Id);
							if (!result.valid) {
								result = platformDataValidationService.createErrorObject('cloud.common.uniqueValueErrorMessage', {object: 'description'});
							} else {
								result = platformDataValidationService.createSuccessObject();
							}
						}
						handleError(result, entity, 'DescriptionInfo');
						return result;
					};

					service.validateParameterGroupDescriptionInfo = function (entity, value, model, dataService) {
						var result = platformDataValidationService.isEmptyProp(value);
						if (result) {
							result = platformDataValidationService.createErrorObject('cloud.common.emptyOrNullValueErrorMessage', {fieldName: 'description'});
						} else {
							result = isUnique(dataService.getList(), model, value, entity.Id);
							if (result) {
								result = platformDataValidationService.createErrorObject('cloud.common.uniqueValueErrorMessage', {object: 'description'});
							} else {
								result = platformDataValidationService.createSuccessObject();
							}
						}
						handleError(result, entity, 'DescriptionInfo');
						return result;
					};


					service.validateVariableName = function (entity, value, model, dataService) {
						var result = platformDataValidationService.isUnique(dataService.getList(), model, value, entity.Id, false);
						angular.forEach(variableNameKeywords, function (keyWord) {

							if (keyWord === value) {
								result = platformDataValidationService.createErrorObject('cloud.common.keywordValueErrorMessage', {object: 'variablename'});
							}
						});
						handleError(result, entity, 'VariableName');
						return platformDataValidationService.finishValidation(result, entity, value, model, service, dataService);
					};

					service.updateContainTools = function ($scope, dataService) {
						var tools = platformToolbarService.getTools($scope.getContainerUUID());
						for (var i = 0; i < tools.length; i++) {
							// t4:taskBarNewRecord
							if (tools[i].id === 'create') {
								tools[i].disabled = !dataService.canCreate();
							}

							// t3:taskBarDeleteRecord
							if (tools[i].id === 'delete') {
								tools[i].disabled = !dataService.canDelete();
							}

						}
						$scope.tools.update();
						/* $timeout(function () {
						 $scope.$parent.$digest();
						 //$scope.$apply();
						 }, 0, false); */
					};


					return service;
				}]
		);
})(angular);