/**
 * Created by lnt on 10/10/2023.
 */

(function (angular) {
	/* global globals */

	'use strict';

	let moduleName = 'qto.main';

	angular.module(moduleName).constant('qtoCopyOptionsPriority', {
		FromLeadingStructure: 0,
		FromDetails: 1
	});

	/**
	 * @ngdoc controller
	 * @name qtoMainDetailCopyConfigController
	 * @requires $scope
	 * @description
	 * #
	 * qtoMainDetailCopyConfigController
	 */
	/* jshint -W072 */
	angular.module(moduleName).controller('qtoMainDetailCopyConfigController', [
		'$scope', '$http', '$translate', '$injector', 'platformTranslateService', 'qtoMainHeaderDataService', 'QtoTargetType', 'qtoMainDetailCopyConfigService', 'qtoCopyOptionsPriority',
		function ($scope, $http, $translate, $injector, platformTranslateService, qtoMainHeaderDataService, qtoPurposeType, qtoMainDetailCopyOptionService, copyPriority) {
			const formConfig = {

				'fid': 'qot.main.qtodetailconfig',
				'version': '1.1.0',
				showGrouping: true,
				skipPermissionCheck: true,
				'groups': [
					{
						'gid': 'EditCopyOption',
						'header': 'Edit CopyOption',
						'header$tr$': 'qto.main.copyOption.editCopyOptionHeader',
						'isOpen': true,
						'visible': true,
						'sortOrder': 0
					},
					{
						'gid': 'properties',
						'header': 'Properties',
						'header$tr$': 'qto.main.copyOption.properties',
						'isOpen': true,
						'visible': true,
						'sortOrder': 1
					},
					{
						'gid': 'assignments',
						'header': 'Assignments',
						'header$tr$': 'qto.main.copyOption.assignments',
						'isOpen': true,
						'visible': true,
						'sortOrder': 1
					}
				],
				'rows': [
					{
						gid: 'EditCopyOption',
						rid: 'IsActivate',
						label: 'Type',
						label$tr$: 'qto.main.copyOption.IsActivate',
						type: 'boolean',
						model: 'IsActivate',
						visible: true,
						sortOrder: 1,
						change: function(entity){
							onIsActivateChange(entity.IsActivate);
						}
					},
					{
						gid: 'assignments',
						rid: 'copyPriority',
						model: 'CopyPriority',
						type: 'radio',
						label: 'Copy Priority',
						label$tr$: 'qto.main.copyOption.copyPriority',
						sortOrder: 1,
						options: {
							valueMember: 'value',
							labelMember: 'label',
							items: [
								{
									value: copyPriority.FromLeadingStructure,
									label: 'From Leading Structure',
									label$tr$: 'qto.main.copyOption.fromLeadingStructure'
								},
								{
									value: copyPriority.FromDetails,
									label: 'From Details',
									label$tr$: 'qto.main.copyOption.fromDetails'
								}]
						}
					},
					{
						gid: 'properties',
						rid: 'IsBQ',
						label: 'Is BQ',
						label$tr$: 'qto.main.isBq',
						type: 'boolean',
						model: 'IsBQ',
						visible: false,
						sortOrder: 2
					},
					{
						gid: 'properties',
						rid: 'IsGQ',
						label: 'Is GQ',
						label$tr$: 'qto.main.isGq',
						type: 'boolean',
						model: 'IsGQ',
						visible: false,
						sortOrder: 3
					},
					{
						gid: 'properties',
						rid: 'IsAQ',
						label: 'Is AQ',
						label$tr$: 'qto.main.isAq',
						type: 'boolean',
						model: 'IsAQ',
						visible: false,
						sortOrder: 4
					},
					{
						gid: 'properties',
						rid: 'IsWQ',
						label: 'Is WQ',
						label$tr$: 'qto.main.isWq',
						type: 'boolean',
						model: 'IsWQ',
						visible: false,
						sortOrder: 5
					},
					{
						gid: 'properties',
						rid: 'IsIQ',
						label: 'Is IQ',
						label$tr$: 'qto.main.isIq',
						type: 'boolean',
						model: 'IsIQ',
						visible: false,
						sortOrder: 6
					},
					{
						gid: 'properties',
						rid: 'IsType',
						label: 'Type',
						label$tr$: 'qto.main.QtoLineType',
						type: 'boolean',
						model: 'IsType',
						visible: true,
						sortOrder: 7
					},
					{
						gid: 'assignments',
						rid: 'IsContract',
						label: 'Contract',
						label$tr$: 'qto.main.OrdHeaderFk',
						type: 'boolean',
						model: 'IsContract',
						visible: true,
						sortOrder: 8
					},
					{
						gid: 'assignments',
						rid: 'IsBillTo',
						label: 'Bill to',
						label$tr$: 'qto.main.BillToFk',
						type: 'boolean',
						model: 'IsContract',
						visible: true,
						sortOrder: 9
					},
					{
						gid: 'assignments',
						rid: 'IsLocation',
						label: 'Location',
						label$tr$: 'qto.main.location',
						type: 'boolean',
						model: 'IsLocation',
						visible: true,
						sortOrder: 10
					},
					{
						gid: 'assignments',
						rid: 'IsControllingUnit',
						label: 'Controlling Unit',
						label$tr$: 'cloud.common.entityControllingUnitCode',
						type: 'boolean',
						model: 'IsControllingUnit',
						visible: true,
						sortOrder: 11
					},
					{
						gid: 'properties',
						rid: 'IsPerformedDate',
						label: 'Performed Date',
						label$tr$: 'qto.main.PerformedDate',
						type: 'boolean',
						model: 'IsPerformedDate',
						visible: true,
						sortOrder: 12
					},
					{
						gid: 'assignments',
						rid: 'IsProcurementStructure',
						label: 'Procurement Structure Code',
						label$tr$: 'qto.main.PrcStructureFk',
						type: 'boolean',
						model: 'IsProcurementStructure',
						visible: true,
						sortOrder: 13
					},
					{
						gid: 'assignments',
						rid: 'IsAssetMaster',
						label: 'Asset Master',
						label$tr$: 'qto.main.AssetMaster',
						type: 'boolean',
						model: 'IsAssetMaster',
						visible: true,
						sortOrder: 14
					},
					{
						gid: 'assignments',
						rid: 'IsCostGroup',
						label: 'Cost Group',
						label$tr$: 'qto.main.costGroup',
						type: 'boolean',
						model: 'IsCostGroup',
						visible: true,
						sortOrder: 15
					},
					{
						gid: 'assignments',
						rid: 'IsSortCode',
						label: 'Sort Code',
						label$tr$: 'qto.main.sortCode',
						type: 'boolean',
						model: 'IsSortCode',
						visible: true,
						sortOrder: 16
					},
					{
						gid: 'properties',
						rid: 'IsUserDefined',
						label: 'User Defined',
						label$tr$: 'qto.main.userDefined',
						type: 'boolean',
						model: 'IsUserDefined',
						visible: true,
						sortOrder: 17
					},
					{
						gid: 'properties',
						rid: 'IsV',
						label: 'V',
						label$tr$: 'qto.main.v',
						type: 'boolean',
						model: 'IsV',
						visible: true,
						sortOrder: 18
					},
					{
						gid: 'properties',
						rid: 'IsRemark',
						label: 'Remark',
						label$tr$: 'cloud.common.entityRemark',
						type: 'boolean',
						model: 'IsRemark',
						visible: true,
						sortOrder: 19
					},
					{
						gid: 'properties',
						rid: 'IsRemark2',
						label: 'Remark2',
						label$tr$: 'qto.main.Remark1Text',
						type: 'boolean',
						model: 'IsRemark2',
						visible: true,
						sortOrder: 20
					},
					{
						gid: 'assignments',
						rid: 'IsLineItem',
						label: 'Line Item',
						label$tr$: 'qto.main.estLineItemFk',
						type: 'boolean',
						model: 'IsLineItem',
						visible: true,
						sortOrder: 21
					}
				]
			};


			$scope.options = $scope.$parent.modalOptions;
			$scope.isOkDisabled = false;

			// init current item.
			$scope.currentItem = $scope.options.currentItem;

			$scope.modalOptions = {
				headerText: $scope.options.headerText,
				closeButtonText: $translate.instant('basics.common.cancel'),
				actionButtonText: $translate.instant('basics.common.ok')
			};

			// get basic row setting from options
			$scope.options.formRows = $scope.options.formRows || [];
			let index = 0;
			let dialogFormConfig = angular.copy(formConfig);

			const selectedQtoHeader = qtoMainHeaderDataService.getSelected();
			/*
			* IsIQ/IsBQ/IsGQ, Procurement/PES, Sales/WIP&Billing
			* IsWQ/IsAQ,      Procurement WQ/AQ, Sales WQ/AQ
			*  PesBoq: 1
				PrcWqAq: 3
				PrjWqAq: 4
				WipOrBill: 2
			* */

			angular.forEach(dialogFormConfig.rows, (row) => {
				if (row) {
					const isIQBQGQ = ['IsIQ', 'IsBQ', 'IsGQ'].includes(row.rid);
					const isAQWQ = ['IsAQ', 'IsWQ'].includes(row.rid);
					const isPesBoqOrWipOrBill = selectedQtoHeader && [qtoPurposeType.PesBoq, qtoPurposeType.WipOrBill].includes(selectedQtoHeader.QtoTargetType);
					const isPrcWqAqOrPrjWqAq = selectedQtoHeader && [qtoPurposeType.PrcWqAq, qtoPurposeType.PrjWqAq].includes(selectedQtoHeader.QtoTargetType);

					if (!selectedQtoHeader || (isIQBQGQ && isPesBoqOrWipOrBill) || (isAQWQ && isPrcWqAqOrPrjWqAq)) {
						row.visible = true;
					}
				}
			})

			angular.forEach($scope.options.formRows, function (row) {
				row.rid = row.rid || 'formrowid' + index++;
				row.gid = 'DetailCopyConfig';
				dialogFormConfig.rows.unshift(row);
			});

			// translate form config.
			platformTranslateService.translateFormConfig(dialogFormConfig);

			$scope.formContainerOptions = {
				statusInfo: function () {
				}
			};

			$scope.formContainerOptions.formOptions = {
				configure: dialogFormConfig,
				showButtons: [],
				validationMethod: function () {
				}
			};

			$scope.setTools = function (tools) {
				$scope.tools = tools;
			};

			$scope.modalOptions.ok = function onOK() {
				$scope.$close($scope.currentItem);
			};

			$scope.modalOptions.close = function onCancel() {
				$scope.$close(false);
			};

			$scope.modalOptions.cancel = function () {
				$scope.$close(false);
			};

			$scope.$watch('currentItem.IsContract', (newValue) => {
				$scope.currentItem.IsBillTo = newValue;
			});

			function onIsActivateChange(isActivate){
				_.forEach(dialogFormConfig.rows, (row) => {
					if(row.rid === 'IsActivate') return;

					row.readonly = !isActivate;
				});

				$scope.formContainerOptions.formOptions.configure = dialogFormConfig;
				$scope.$broadcast('form-config-updated');
			}

			onIsActivateChange($scope.options.currentItem.IsActivate);

			$scope.$on('$destroy', function () {
				$scope.currentItem = {};
			});
		}
	]);
})(angular);