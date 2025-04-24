/**
 * Created by spr on 2017-11-06.
 */

/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function(angular) {
	/* global _ */
	'use strict';

	let moduleName = 'estimate.main';

	angular.module(moduleName).factory('estimateMainTriStateCheckboxService', [
		'$timeout', 'cloudCommonGridService', 'platformGridAPI', 'platformRuntimeDataService',
		function ($timeout, cloudCommonGridService, platformGridAPI, platformRuntimeDataService) {

			return function ($scope, childProperty, parentProperty, field, id, gridId) {
				let validationMethodName = 'validate' + field;
				$scope[validationMethodName] = getValidatorMethod;
				return {
					getFieldConfiguration: getFieldConfiguration,
					getValidatorMethod: getValidatorMethod,
					validationMethodName: validationMethodName
				};


				function updateChildren(item, value, field, childProperty) {
					let children = cloudCommonGridService.getAllChildren(item, childProperty);
					angular.forEach(children, function (childItem) {
						childItem[field] = value;
						childItem.isIndeterMinate=false;
					});
				}

				function setItemStatus(item, field, childProperty) {
					if (item && item[childProperty] && item[childProperty] !== null) {
						let allChecked = true, allUnchecked = true;
						for (let index = 0; index < item[childProperty].length && (allChecked || allUnchecked); index++) {
							let childItem = item[childProperty][index];
							if (childItem[field] === true) {
								allUnchecked = false;
							} else if (!childItem[field]) {
								allChecked = false;
							} else {
								allUnchecked = false;
								allChecked = false;
							}
						}
						if (allChecked) {
							item[field] = true;
						} else if (allUnchecked) {
							item[field] = false;
						}
						else {
							item[field] = allChecked || allUnchecked;// 'indeterminate';
						}
					}
				}

				function updateParents(item, field, data, childProperty, parentProperty) {
					if (angular.isNumber(item[parentProperty])) {
						item = _.find(data, {'Id': item[parentProperty]});
						setItemStatus(item, field, childProperty);
						updateParents(item, field, data, childProperty, parentProperty);
					}
				}

				function getFieldConfiguration() {
					return {
						id: id,
						field: field,
						headerChkbox: true,
						toolTip: 'Select',
						name$tr$: 'estimate.main.generateProjectBoQsWizard.select',
						formatter: getFormatter,
						editor: 'boolean',
						validator: validationMethodName
					};
				}

				function getFormatter(row, cell, value, columnDef, dataContext, plainText, uniqueId) {
					let html = '';
					let id= '#'+gridId;
					if (columnDef.editor && !platformRuntimeDataService.isReadonly(dataContext, columnDef.field)) {
						html = '<input type="checkbox"' + (value ? ' checked="checked"' : '') + '>';
					} else {
						if (platformRuntimeDataService.isHideReadonly(dataContext, columnDef.field) || columnDef.formatterOptions && columnDef.formatterOptions.hideReadonly) {
							html = '';
						} else {
							html = '<input type="checkbox" disabled="disabled"' + (value ? ' checked="checked"' : '') + '>';
						}
					}

					if (value === 'indeterminate') {
						$timeout(function () {
							angular.element('#' + uniqueId).find('input[type=checkbox]').prop('indeterminate', true);
						});
					}
					//implement item Checkbox indeterminate property
					if (dataContext.hasOwnProperty('isIndeterMinate') && gridId === '784CB9C7C5024B80BCBF2641C622B7A4') {
						if (dataContext.isIndeterMinate) {
							$timeout(function () {
								angular.element('#' + uniqueId).find('input[type=checkbox]').prop('indeterminate', true);
							});
						}
					}
					//implement title Checkbox indeterminate property
					if (gridId === '784CB9C7C5024B80BCBF2641C622B7A4') {
						setTimeout(() => {
							let itemList = cloudCommonGridService.flatten(platformGridAPI.items.data(gridId), [], childProperty);
							let allSelectedItem = _.filter(itemList, {IsSelected: true});
							let elementList = $(id).find('input[type=checkbox]');
							if ((itemList.length === allSelectedItem.length) || allSelectedItem.length === 0) {
								angular.element(elementList[0]).prop('indeterminate', false);
								if (itemList.length === allSelectedItem.length) {
									angular.element(elementList[0]).prop('checked', true);
								}
							} else {
								angular.element(elementList[0]).prop('indeterminate', true);
							}
						}, 100);
					}
					return '<div class="text-center" >' + html + '</div>';
				}

				function getValidatorMethod(item, value) {
					item[field] = value;
					item.isIndeterMinate = false;
					updateChildren(item, value, field, childProperty);
					let data = cloudCommonGridService.flatten(platformGridAPI.items.data(gridId), [], childProperty);
					if (gridId === '784CB9C7C5024B80BCBF2641C622B7A4') {
						updateParentsIndeterMinate(item, field, data, childProperty, parentProperty);
					} else {
						if (!value) {
							updateParents(item, field, data, childProperty, parentProperty);
						}
					}
					platformGridAPI.grids.refresh(gridId);
				}

				function updateParentsIndeterMinate(item, field, data, childProperty, parentProperty) {
					let selectedCount = 0;
					let parentItem = _.find(data, {Id: item[parentProperty]});
					if (parentItem) {
						parentItem.isIndeterMinate = false;
						let childLength = parentItem[childProperty].length;
						for (let i = 0; i < childLength; i++) {
							if (parentItem[childProperty][i][field]) {
								selectedCount++;
							}
						}
						if (selectedCount === childLength) {
							parentItem[field] = true;
						} else if (childLength > selectedCount) {
							if (selectedCount > 0) {
								parentItem.isIndeterMinate = true;
							} else if (childLength === 1 || parentItem[parentProperty] === null) {
								parentItem.isIndeterMinate = item.isIndeterMinate;
							}
							parentItem[field] = false;
						}
						updateParentsIndeterMinate(parentItem, field, data, childProperty, parentProperty);
					}
				}
			};
		}
	]);
})(angular);
