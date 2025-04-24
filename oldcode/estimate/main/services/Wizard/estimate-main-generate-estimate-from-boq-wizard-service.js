/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	/* global globals */
	'use strict';

	let moduleName = 'estimate.main';

	angular.module(moduleName).factory('estimateMainGenerateEstimateFromBoqWizardService', ['$injector','$http','$translate','platformTranslateService',
		'platformModalService', 'estimateMainService',
		function ($injector, $http, $translate, platformTranslateService,platformModalService, estimateMainService) {

			let service = {};

			let self = service;

			service.dataItem = {searchCriteria:1,sourceBoqItems:false, existingEstimate: 1};

			service.formConfiguration = {
				fid:  'estimate.main.generateEstimateFromBoq',
				version: '0.1.1',
				addValidationAutomatically: true,
				showGrouping: true,
				groups: [
					{
						gid: 'searchCriteria',
						header: 'Search Criteria',
						header$tr$: 'estimate.main.searchCriteria',
						visible: true,
						isOpen: true,
						attributes: []
					},
					{
						gid: 'selectBoqs',
						header: 'Select Boqs',
						header$tr$: 'estimate.main.selectBoqs',
						visible: true,
						isOpen: true,
						attributes: []
					},
					{
						gid: 'existingEstimate',
						header: 'Existing Estimate',
						header$tr$: 'estimate.main.existingEstimate',
						visible: true,
						isOpen: true,
						attributes: []
					}],
				rows: [
					{
						gid: 'searchCriteria',
						rid: 'searchCriteria',
						label: 'Search Criteria',
						label$tr$: 'estimate.main.searchCriteria',
						type: 'radio',
						model: 'searchCriteria',
						sortOrder: 0,
						options: {
							labelMember: 'Description',
							valueMember: 'Value',
							groupName: 'SearchCriteria',
							items: [
								{
									Id: 1,
									Description: $translate.instant('estimate.main.refNo'),
									Value: 1
								},
								{
									Id: 2,
									Description: $translate.instant('estimate.main.wic'),
									Value: 2
								}
							]
						}
					},
					{
						gid: 'selectBoqs',
						rid: 'selectProjects',
						type: 'directive',
						model: 'sourceBoqItems',
						required: true,
						'directive': 'estimate-Main-Generate-Estimate-From-Boq-Grid-Dialog',
						sortOrder: 1
					},
					{
						gid: 'existingEstimate',
						rid: 'existingEstimate',
						label: 'Existing Estimate',
						label$tr$: 'estimate.main.existingEstimate',
						type: 'radio',
						model: 'existingEstimate',
						sortOrder: 2,
						options: {
							labelMember: 'Description',
							valueMember: 'Value',
							groupName: 'GenerateEstFromBoq',
							items: [
								{
									Id: 1,
									Description: $translate.instant('estimate.main.overwrite'),
									Value: 1
								},
								{
									Id: 2,
									Description: $translate.instant('estimate.main.append'),
									Value: 2
								},
								{
									Id: 3,
									Description: $translate.instant('estimate.main.ignore'),
									Value: 3
								}
							]
						}
					}

				]
			};

			service.estimateMainGenerateEstimateFromBoqLoadData = function estimateMainGenerateEstimateFromBoqLoadData(result) {
				let postData = {
					'TargetProjectId': estimateMainService.getSelectedProjectId(),
					'TargetEstHeaderId': parseInt(estimateMainService.getSelectedEstHeaderId()),
					'SelectedBoqs': result.data.sourceBoqItems,
					'SearchCriteria': result.data.searchCriteria,
					'ExistingEstimate': result.data.existingEstimate
				};

				if (postData.TargetProjectId > 0 && postData.TargetEstHeaderId>0 &&  postData.SelectedBoqs  ) {
					$http.post(globals.webApiBaseUrl + 'estimate/main/lineitem/generateEstimateFromBoq', postData)
						.then(function (response) {
							if(response && response.data && response.data.length){
								var cols = [{
									id: 'code',
									name$tr$: 'cloud.common.entityCode',
									formatter: 'code',
									field: 'Code',
									width: 100
								}, {
									id: 'desc',
									name$tr$: 'cloud.common.entityDescription',
									formatter: 'translation',
									field: 'DescriptionInfo',
									width: 200
								}];
								return $injector.get('platformGridDialogService').showDialog({
									columns: cols,
									items:response.data,
									idProperty: 'Id',
									tree: true,
									headerText$tr$: 'estimate.main.generateEstimateSummaryTitle',
									topDescription:getSuccessfullMessage(response),
									isReadOnly: true
								}).then(function () {
									estimateMainService.load();
									return {
										success: true
									};
								});
							}else{
								platformModalService.showMsgBox($translate.instant('estimate.main.projectWicSourceTargetErrMsg'));
								return;
							}
						}, function () {
						});
				}else{
					platformModalService.showMsgBox($translate.instant('estimate.main.projectWicSourceTargetMissingErrMsg'));
					return;
				}
			};

			function getSuccessfullMessage(response) {
				if(response.data.length>1) {
					return $translate.instant('estimate.main.multiLineItemAssigned', {
						count: response.data.length
					});
				}
				else if(response.data.length===1){
					return $translate.instant('estimate.main.oneLineItemAssigned', {
						count: response.data.length
					});
				}
			}

			self.showCreateDialog = function showCreateDialog() {
				platformModalService.showDialog({
					templateUrl: globals.appBaseUrl + 'estimate.main/templates/wizard/estimate-main-generate-estimate-from-boq-dialog.html',
					backdrop: false,
					width: 700,
					resizeable: true,
				}).then(function (result) {
					if (result && result.ok && result.data) {
						service.estimateMainGenerateEstimateFromBoqLoadData(result);
					}
				}
				);
			};

			service.showDialog = function showDialog(/* value */) {
				platformTranslateService.translateFormConfig(self.formConfiguration);
				self.showCreateDialog();
			};

			service.getDialogTitle = function getDialogTitle() {
				return $translate.instant('estimate.main.generateEstimateFromBoq');
			};

			Object.defineProperties(service, {
				'dialogTitle': {
					get: function () {
						return '';
					}, enumerable: true
				}
			}
			);

			service.getDataItem = function getDataItem() {
				return service.dataItem;
			};

			service.getFormConfiguration = function getFormConfiguration() {
				return service.formConfiguration;
			};

			return service;
		}]);

})(angular);
