/**
 * Created by zos on 2/27/2018.
 */

(function (angular) {
	/* global globals, $ */ 
	'use strict';

	var moduleName = 'boq.main';

	/**
	 * @ngdoc service
	 * @name boqParamComplexLookup
	 * @function
	 *
	 * @description
	 * lookup to show assigned boq parameters in different boq structures with two different dropdown popup
	 */
	angular.module(moduleName).directive('boqParamComplexLookup', ['boqParameterComplexLookupService', 'BasicsLookupdataLookupDirectiveDefinition', 'boqParamComplexLookupCommonService',
		function (boqParameterComplexLookupService, BasicsLookupdataLookupDirectiveDefinition, boqParamComplexLookupCommonService) {

			var defaults = {
				lookupType: 'boqParamComplexLookup',
				valueMember: 'Code',
				displayMember: 'Code',
				showCustomInputContent: true, // show custom input content.
				formatter: boqParamComplexLookupCommonService.displayFormatter, // return custom input content
				idProperty: 'Id',
				uuid: 'e0ce6eaa77bb4de988a3279a19333220',
				columns: boqParamComplexLookupCommonService.getColumns(),
				onDataRefresh: function ($scope) {
					boqParameterComplexLookupService.loadLookupData().then(function (data) {
						if (data) {
							$scope.refreshData(data);
						}
					});
				},
				events: [
					{
						name: 'onSelectedItemChanged',
						handler: function (e, args) {
							var scope = this;
							// add item
							boqParamComplexLookupCommonService.onSelectionChange(args, scope);
						}
					},
					{
						name: 'onInputGroupClick',
						handler: function (e, args) {
							var scope = this;
							// if this has been setted readonly,
							if (this.ngReadonly) {
								return;
							}
							// clear all items
							if (e && e.target && e.target.className && e.target.className.indexOf('ico-input-delete') !== -1) {
								boqParamComplexLookupCommonService.clearAllItems(args, scope);
							} else if (e.target.className.indexOf('block-image') !== -1 &&
								(e.target.className.indexOf('ico-parameter') !== -1 || e.target.className.indexOf('ico-menu') !== -1)) {
								// edit param items
								// e.target.className: block-image control-icons ico-parameter
								// or
								// block-image tlb-icons ico-menu
								boqParamComplexLookupCommonService.openPopup(e, scope);
							}
						}
					}
				]
			};

			return new BasicsLookupdataLookupDirectiveDefinition('lookup-edit', defaults, {
				dataProvider: {

					getList: function () {
						return boqParameterComplexLookupService.getListAsync();
					},

					getItemByKey: function (value) {
						return boqParameterComplexLookupService.getItemByIdAsync(value);
					},

					getDisplayItem: function (value) {
						return boqParameterComplexLookupService.getItemByIdAsync(value);
					}
				},
				controller: ['$scope', function ($scope) { // do external logic to specific lookup directive controller here.

					var onOpenPopupClicked = function (event, editValue) {
						editValue(event);
					};

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
				}]
			});
		}
	]);
})(angular);
