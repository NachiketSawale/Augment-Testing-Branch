/**
 * Created by wul on 9/1/2020.
 */
(function () {
	'use strict';

	var moduleName = 'procurement.common';
	angular.module(moduleName).value('prcCommonUpdateEstimateLogController',
		function ($scope,  $translate, $sce, platformContextService, prcCommonWizardUpdateEstimateLogService) {

			var result = prcCommonWizardUpdateEstimateLogService.getResultEntity();

			$scope.entity = result;

			$scope.noFilterDataError = {
				show: !!result.failConvertItemNo,
				messageCol: 1,
				message: $translate.instant('procurement.common.wizard.updateEstimate.updateEstimateWarning'),
				iconCol: 1,
				type: 1
			};

			// $scope.configTitle = $translate.instant('procurement.package.updateEstimate');
			$scope.modalOptions = {};
			$scope.modalOptions.headerText = $translate.instant('procurement.package.updateEstimate');

			$scope.updateResult = $sce.trustAsHtml(result.strTipMessage);

			$scope.updateEstimateLogSettings = {
				configure : {
					fid: 'estimate.main.replaceResourceWizard.replaceform',
					version: '1.0.0',
					showGrouping: true,
					groups: [
						{
							gid: 'g1',
							isOpen: true,
							visible: !!result.updatedBoqNo,
							header: $translate.instant('procurement.common.wizard.updateEstimate.updatedBoqNo'),
							attributes: [
								'updatedBoqNo'
							]
						},{
							gid: 'g2',
							isOpen: true,
							visible: !!result.updatedItemNo,
							header: $translate.instant('procurement.common.wizard.updateEstimate.updatedItems'),
							attributes: [
								'updatedItemNo'
							]
						},{
							gid: 'g3',
							isOpen: true,
							visible: !!result.failBoqNo,
							header: $translate.instant('procurement.common.wizard.updateEstimate.failBoqNo'),
							attributes: [
								'failBoqNo'
							]
						},{
							gid: 'g4',
							isOpen: true,
							visible: !!result.failItemNo,
							header: $translate.instant('procurement.common.wizard.updateEstimate.failItem'),
							attributes: [
								'failItemNo'
							]
						},{
							gid: 'g5',
							isOpen: true,
							visible: !!result.prcItemsNoPackage,
							header: $translate.instant('procurement.common.wizard.updateEstimate.prcItemsNoPackage'),
							attributes: [
								'prcItemsNoPackage'
							]
						},{
							gid: 'g6',
							isOpen: true,
							visible: !!result.failConvertItemNo,
							header: $translate.instant('procurement.common.wizard.updateEstimate.uomConflict'),
							attributes: [
								'failConvertItemNo'
							]
						},{
							gid: 'g7',
							isOpen: true,
							visible: !!result.notNewlyOfferedPesBoqNo,
							header: $translate.instant('procurement.common.wizard.updateEstimate.failBoqNo'),
							attributes: [
								'notNewlyOfferedPesBoqNo'
							]
						},{
							gid: 'g8',
							isOpen: true,
							visible: !!result.pesItemNoContractItem,
							header: $translate.instant('procurement.common.wizard.updateEstimate.failPesItem'),
							attributes: [
								'pesItemNoContractItem'
							]
						}
					],
					rows: [
						{
							gid: 'g1', rid: 'updatedBoqNo', label: $translate.instant('procurement.common.wizard.updateEstimate.detail'),
							type: 'directive',directive: 'prc-common-update-estimate-log-boq', model: 'updatedBoqNo',
							readonly: true, rows: 80, visible: true, sortOrder: 30
						},{
							gid: 'g2', rid: 'updatedItemNo', label: $translate.instant('procurement.common.wizard.updateEstimate.detail'),
							type: 'directive',directive: 'prc-common-update-estimate-log-item', model: 'updatedItemNo',
							readonly: true, rows: 80, visible: true, sortOrder: 30
						},{
							gid: 'g3', rid: 'failBoqNo', label: $translate.instant('procurement.common.wizard.updateEstimate.detail'),
							type: 'directive',directive: 'prc-common-update-estimate-log-boqfail', model: 'failBoqNo',
							readonly: true, rows: 80, visible: true, sortOrder: 30
						},{
							gid: 'g4', rid: 'failItemNo', label: $translate.instant('procurement.common.wizard.updateEstimate.detail'),
							type: 'directive',directive: 'prc-common-update-estimate-log-itemfail', model: 'failItemNo',
							readonly: true, rows: 80, visible: true, sortOrder: 30
						},{
							gid: 'g5', rid: 'prcItemsNoPackage', label: $translate.instant('procurement.common.wizard.updateEstimate.detail'),
							type: 'directive',directive: 'prc-common-update-estimate-log-itemnopack', model: 'prcItemsNoPackage',
							readonly: true, rows: 80, visible: true, sortOrder: 30
						},{
							gid: 'g6', rid: 'failConvertItemNo', label: $translate.instant('procurement.common.wizard.updateEstimate.detail'),
							type: 'directive',directive: 'prc-common-update-estimate-log-uomfail', model: 'failConvertItemNo',
							readonly: true, rows: 80, visible: true, sortOrder: 30
						},{
							gid: 'g7', rid: 'notNewlyOfferedPesBoqNo', label: $translate.instant('procurement.common.wizard.updateEstimate.detail'),
							type: 'directive',directive: 'prc-common-update-estimate-log-Notnewboq', model: 'notNewlyOfferedPesBoqNo',
							readonly: true, rows: 80, visible: true, sortOrder: 30
						},{
							gid: 'g8', rid: 'pesItemNoContractItem', label: $translate.instant('procurement.common.wizard.updateEstimate.detail'),
							type: 'directive',directive: 'prc-common-update-estimate-log-pesitem-fail', model: 'pesItemNoContractItem',
							readonly: true, rows: 80, visible: true, sortOrder: 30
						}
					]
				}
			};

			$scope.close = function () {
				$scope.$close(false);
			};

			$scope.modalOptions.cancel = function () {
				$scope.$close(false);
			};

		});
})();