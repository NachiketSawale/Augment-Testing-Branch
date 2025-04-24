/**
 * Created by wuj on 2014/8/1.
 */
(function (angular, globals) {

	// eslint-disable-next-line no-redeclare
	/* global angular,globals */

	'use strict';

	var moduleName = 'procurement.common';

	globals.lookups.prcBoqExtended = function prcBoqExtended() {
		return {
			lookupOptions: {
				lookupType: 'PrcBoqExtended',
				valueMember: 'Id',
				displayMember: 'Reference',
				uuid: '18fa9d7b50ed41c1a716129cd970a399',
				columns: [
					{
						id: 'status',
						field: 'PrcItemStatusFk',
						name: 'Status',
						name$tr$: 'cloud.common.entityStatus',
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'PrcItemStatus',
							displayMember: 'DescriptionInfo.Translated',
							imageSelector: 'platformStatusIconService'
						},
						width: 100
					},
					{
						id: 'Reference',
						field: 'Reference',
						name: 'BoQ Reference',
						width: 150,
						name$tr$: 'procurement.common.boq.boqItemReference'
					},
					{
						id: 'Brief',
						field: 'BriefInfo.Translated',
						name: 'Outline Specification',
						width: 150,
						name$tr$: 'procurement.common.boq.boqItemBrief'
					},
					{
						id: 'PackageCode',
						field: 'PackageCode',
						name: 'PackageCode',
						width: 150,
						name$tr$: 'cloud.common.entityPackageCode'
					},
					{
						id: 'PackageDescription',
						field: 'PackageDescription',
						name: 'PackageDescription',
						width: 150,
						name$tr$: 'cloud.common.entityPackageDescription'
					},
					{
						id: 'ControllingCode',
						field: 'ControllingCode',
						name: 'ControllingCode',
						width: 150,
						name$tr$: 'procurement.common.boq.prcItemControllingUnit'
					},
					{
						id: 'ControllingDescription',
						field: 'DescriptionInfo.Translated',
						name: 'ControllingDescription',
						width: 150,
						name$tr$: 'procurement.common.boq.prcItemControllingUnitDes'
					}
				],
				width: 80,
				height: 200
			}
		};
	};

	/**
	 * @ngdoc directive
	 * @name procurement.requisition.directive:procurementCommonAwardMethodCombobox
	 * @element div
	 * @restrict A
	 * @description
	 * Strategy combobox.
	 *
	 */
	angular.module(moduleName).directive('procurementCommonPrcBoqExtendedLookup',
		['basicsLookupdataLookupDescriptorService', 'BasicsLookupdataLookupDirectiveDefinition', '$', 'platformModalService',
			function (lookupDescriptorService, BasicsLookupdataLookupDirectiveDefinition, $, platformModalService) {

				lookupDescriptorService.loadData(['PrcItemStatus']);

				var baseUrl = 'procurement/common/prcboqextended/';

				return new BasicsLookupdataLookupDirectiveDefinition('lookup-edit', globals.lookups.prcBoqExtended().lookupOptions, {
					url: {
						getList: baseUrl + 'getlist',
						getItemByKey: baseUrl + 'getitembykey',
						getSearchList: baseUrl + 'getsearchlist'
					},
					controller: ['$scope', '$translate', 'qtoMainHeaderCreateDialogDataService',
						function ($scope, $translate, qtoMainHeaderCreateDialogDataService) { // do external logic to specific lookup directive controller here.

							var lookupButtonStyle = {'background-size': '15px 15px'}; // IE had problems. Therefore this solution

							var execute = function (/* event, editValue */) {
								var defaultOptions = {
									headerText: $translate.instant('qto.main.selectBoqTemplate'),
									templateUrl: globals.appBaseUrl + 'qto.main/templates/qto-boq-copysource-dialog.html',
									parentService: qtoMainHeaderCreateDialogDataService,
									backdrop: false,
									width: '1200px',
									maxWidth: '1500px',
									uuid: 'aed43af104dc4cd98dccb2f0beb16842'   // grid id (uuid)
								};

								platformModalService.showDialog(defaultOptions).then(function (result) {
									if (result.ok) {
										qtoMainHeaderCreateDialogDataService.setNewBoqs(result.data);
										qtoMainHeaderCreateDialogDataService.handlerError();
									}
									else {
										qtoMainHeaderCreateDialogDataService.setBoqSource(0);
									}
								});
							};

							var canExecute = function(){
								var qtoHeadedCrateItem = qtoMainHeaderCreateDialogDataService.getDataItem();
								return qtoHeadedCrateItem.PrcBoqFk === -1;
							};

							$.extend($scope.lookupOptions, {
								extButtons: [
									{
										class: ' tlb-icons ico-new',
										style: lookupButtonStyle,
										execute: execute,
										canExecute: canExecute
									}
								]
							});
						}]
				});
			}]);
})(angular, globals);
