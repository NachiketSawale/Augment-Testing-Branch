( function (angular) {
	/* global $, globals */
	'use strict';

	let moduleName = 'procurement.rfq';

	/**
	 * @ngdoc service
	 * @name estimateParamComplexLookup
	 * @function
	 *
	 * @description
	 * lookup to show assigned estimate parameters in different estimation structures with two different dropdown popup
	 */
	angular.module(moduleName).directive('procurementRfqComplexLookup', ['$injector', 'BasicsLookupdataLookupDirectiveDefinition','platformModalService',
		'procurementRfqPartialreqAssignedDataDirectiveDataService', '_', 'procurementRfqMainService',
		function ($injector, BasicsLookupdataLookupDirectiveDefinition,platformModalService,
			procurementRfqPartialreqAssignedDataDirectiveDataService, _, procurementRfqMainService) {
			let defaults = {
				lookupType: 'procurementRfqComplexLookup',
				valueMember: 'Id',
				displayMember: 'Id',
				showCustomInputContent: true, // show custom input content.
				formatter: function (row, cell, value, columnDef, dataContext) {
					return procurementRfqPartialreqAssignedDataDirectiveDataService.getSelectedCode(dataContext);
				},
				idProperty: 'Id',
				uuid: 'e7c22016b1c849979665fd18d6f07972',
				columns: [],
				showClearButton: false,
				showEditButton: false
			};

			return new BasicsLookupdataLookupDirectiveDefinition('lookup-edit', defaults, {
				controller: ['$scope', function ($scope) { // do external logic to specific lookup directive controller here.

					let openDialogClicked = function openDialogClicked() {
						procurementRfqMainService.update()
							.then(function () {
								let dlgConfig = {
									templateUrl: globals.appBaseUrl + 'procurement.rfq/templates/procurement-rfq-partialreq-assigned-data-dialog.html',
									width: '650px',
									resizeable: true
								};

								platformModalService.showDialog(dlgConfig);
							})
							.catch(_.noop);
					};

					let clearData = function clearData() {
						procurementRfqPartialreqAssignedDataDirectiveDataService.clearData();
					};

					$.extend($scope.lookupOptions, {
						buttons: [
							{
								img: globals.appBaseUrl + 'cloud.style/content/images/control-icons.svg#ico-input-delete',
								execute: clearData,
								canExecute: function () {
									return true;
								}
							},
							{
								img: globals.appBaseUrl + 'cloud.style/content/images/control-icons.svg#ico-input-add',
								execute: openDialogClicked,
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
