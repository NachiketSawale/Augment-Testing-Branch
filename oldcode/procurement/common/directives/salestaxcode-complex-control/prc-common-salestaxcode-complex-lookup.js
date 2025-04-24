/**
 * Created by lcn on 03/04/2022.
 */
(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular */

	let moduleName = 'procurement.common';
	angular.module(moduleName).directive('procurementCommonSalesTaxCodeComplexLookup',
		['BasicsLookupdataLookupDirectiveDefinition', 'procurementCommonSalesTaxCodeComplexService', '$q',
			// eslint-disable-next-line no-unused-vars
			function (BasicsLookupdataLookupDirectiveDefinition, procurementCommonSalesTaxCodeComplexService, $q) {
				let defaults = {
					lookupType: 'SalesTaxCode',
					valueMember: 'Id',
					displayMember: 'Code',
					isClientSearch: true,
					isExactSearch: true,
					showClearButton: true,
					showEditButton: false,
					showCustomInputContent: true,

					uuid: 'b0cc9237d4e34262a72fef3ab135366d',
					formatter: procurementCommonSalesTaxCodeComplexService.displayFormatter,
					columns: procurementCommonSalesTaxCodeComplexService.getColumns(),
					gridOptions: {
						multiSelect: true
					},
					isStaticGrid: true,
					title: {
						name: 'Sales Tax Code',
						name$tr$: 'procurement.common.saleTaxCode.SalesTaxCodeGridTitle'
					},
					events: [
						{
							name: 'onSelectedItemChanged',
							handler: function (e, arg) {
								let scope = this;
								procurementCommonSalesTaxCodeComplexService.onSelectedItemChanged(arg, scope);
							}
						},
						{
							name: 'onSelectedItemsChanged',
							handler: function (e, arg) {
								let scope = this;
								procurementCommonSalesTaxCodeComplexService.onSelectedItemsChanged(arg, scope);
							}
						},
						{
							name: 'onInputGroupClick',
							handler: function (e, arg) {
								if (!arg.entity.SalesTaxItems) {
									let scope = this;
									if (e && e.target && e.target.className) {
										if (e.target.className.indexOf('input-group-content ng-binding') !== -1) {
											// edit
											procurementCommonSalesTaxCodeComplexService.openPopup(e, scope);
										}
										if (e.target.className.indexOf('ico-input-delete') !== -1) {
											// delete
											procurementCommonSalesTaxCodeComplexService.clear(arg, scope);
										}
									}
								}
							}
						}
					]
				};

				return new BasicsLookupdataLookupDirectiveDefinition('dialog-edit', defaults, {
					dataProvider: {
						getList: function (config, scope) {
							return procurementCommonSalesTaxCodeComplexService.getSearchList(config, scope);
						},

						getItemByKey: function (value, config, scope) {
							return procurementCommonSalesTaxCodeComplexService.getSearchList(config, scope);
						},

						getSearchList: function (value, config, scope) {
							return procurementCommonSalesTaxCodeComplexService.getSearchList(config, scope, value);
						}
					},
					controller: ['_', '$', '$scope', 'globals',
						function (_, $, $scope, globals) {
							var isNoShow = (!$scope.$parent.entity) || ($scope.$parent.entity && $scope.$parent.entity.SalesTaxItems);
							if (isNoShow) {
								$scope.lookupOptions.showClearButton = false;
							} else {
								let onOpenPopupClicked = function (event, editValue) {
									$scope.$$childTail.displayText = '';
									if (!_.isArray($scope.$$childTail.ngModel)) {
										$scope.$$childTail.ngModel = [];
									}
									editValue(event);
								};

								$scope.lookupOptions.popupOptions.width = 1000;
								$.extend($scope.lookupOptions, {
									buttons: [
										{
											img: globals.appBaseUrl + 'cloud.style/content/images/control-icons.svg#ico-input-add',
											execute: onOpenPopupClicked,
											canExecute: function () {
												return true;
											}
										}
									]
								});
							}
						}]
				});
			}]);

})(angular);