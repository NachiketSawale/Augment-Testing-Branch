/**
 * $Id$
 * Copyright (c) RIB Software GmbH
 */

(function (angular) {
	'use strict';

	let moduleName = 'sales.common';

	/**
	 * @ngdoc service
	 * @name salesCommonUpdateEstimateUIService
	 * @function
	 * @description retrieve ui configuration from this service
	 */
	angular.module(moduleName).factory('salesCommonUpdateEstimateUIService',
		['_', '$log', '$injector', 'platformTranslateService',
			function (_, $log, $injector, platformTranslateService) {

				// internal
				// ...

				// public
				let service = {};

				service.getLayoutConfig = function getLayoutConfig(dataProvider) {

					if (!_.isFunction(_.get(dataProvider, 'getProjectId'))) {
						$log.warn('No getProjectId() defined on given dataProvider.');
					}

					let config = {
						fid: 'sales.common.update.estimate.wizard',
						version: '1.0.0',
						showGrouping: true,
						groups: [
							{
								gid: 'basicData',
								isOpen: true,
								header: 'Update existing Line Items',
								header$tr$: 'sales.common.updateEstimateWizard.groupTitle',
								attributes: ['estimateFk', 'isLinkedBoqItem', 'isLineItemForNewBoq']
							}
						],
						rows: [
							{
								gid: 'basicData',
								rid: 'isLinkedBoqItem',
								label: 'Linked BoQ Items',
								label$tr$: 'sales.common.updateEstimateWizard.linkedBoQItems',
								type: 'boolean',
								model: 'isLinkedBoqItem',
								sortOrder: 1
							},
							{
								gid: 'basicData',
								rid: 'isLineItemForNewBoq',
								label: 'Create new Line Item for new BoQ Item',
								label$tr$: 'sales.common.updateEstimateWizard.lineItemForNewBoq',
								type: 'boolean',
								model: 'isLineItemForNewBoq',
								sortOrder: 2
							},
							{
								gid: 'basicData',
								rid: 'estimateFk',
								model: 'estimateFk',
								sortOrder: 3,
								label: 'Estimate',
								label$tr$: 'sales.common.updateEstimateWizard.estimate',
								type: 'directive',
								directive: 'basics-lookupdata-lookup-composite',
								visible: true,
								required: true,
								readonly: false,
								options: {
									lookupDirective: 'estimate-main-document-project-lookup',
									displayMember: 'Code',
									descriptionMember: 'DescriptionInfo.Translated',
									lookupOptions: {
										filterOptions: {
											serverSide: true,
											serverKey: 'sales-common-estimate-header-filter',
											fn: function () {
												return {projectId: dataProvider.getProjectId()};
											},
										},
									},
								},
							}
						]
					};
					platformTranslateService.translateFormConfig(config);
					return config;
				};

				return service;
			}]);

	/**
	 * @ngdoc service
	 * @name salesCommonUpdateEstimateWizardService
	 * @function
	 * @description wizard service for "Update Estimate"
	 */
	angular.module(moduleName).factory('salesCommonUpdateEstimateWizardService',
		['_', '$log', '$q', '$http', '$rootScope', '$injector', '$translate', 'globals', 'platformDialogService',
			function (_, $log, $q, $http, $rootScope, $injector, $translate, globals, platformDialogService) {
				// internal
				function getContext() {
					let subModule2Context = {
						'sales.bid': {mainService: 'salesBidService', url: 'sales/bid/updateestimate', salesHeaderPropName: 'BidHeaderFk'},
						'sales.contract': {mainService: 'salesContractService', url: 'sales/contract/updateestimate', salesHeaderPropName: 'OrdHeaderFk'}
					};
					if (!_.includes(_.keys(subModule2Context), $rootScope.currentModule)) {
						$log.warn('No context available for given sub module!');
						return;
					}
					let context = subModule2Context[$rootScope.currentModule];
					let selectedEntity = $injector.get(context.mainService).getSelected();
					if (_.isNil(selectedEntity)) {
						$log.warn('No sales header selected.');
						return context;
					}
					context.salesHeaderId = selectedEntity.Id;
					context.projectId = selectedEntity.ProjectFk;

					return context;
				}

				// public
				let service = {};

				// TODO: check if can be replaced (or simplified) by exsting logic
				service.getEstimates = function getEstimates(projectId) {
					let postData = {
						'SearchFields': [],
						'SearchText': '',
						'FilterKey': 'sales-common-estimate-header-filter',
						'AdditionalParameters': {
							'projectId': projectId
						},
						'TreeState': {
							'StartId': null,
							'Depth': null
						},
						'RequirePaging': false
					};
					let deferred = $q.defer();
					$http.post(globals.webApiBaseUrl + 'basics/lookupdata/masternew/getsearchlist?lookup=estimatemainheader', postData).then(function (resp) {
						// ToDo: Need to check if we can use something else here to validate if no estHeader/active-estimate-header available for selectedEntity
						if (!_.isNull(resp.data.SearchList) && resp.data.SearchList.length > 0) {
							deferred.resolve(resp.data.SearchList);
						} else {
							deferred.resolve(null);
						}
					});
					return deferred.promise;
				};

				service.getCurrentProjectId = function getCurrentProjectId() {
					let context = getContext();
					return _.get(context, 'projectId') || null;
				};

				service.getDefaultEstimate = function getDefaultEstimate(projectId) {
					let deferred = $q.defer();

					projectId = projectId || _.get(getContext(), 'projectId');
					service.getEstimates(projectId).then(function (estimates) {
						if (_.some(estimates)) {
							//  only active estimates
							let activeEstimates = _.filter(estimates, {IsActive: true});
							// get the 'last' one (see story dev-780)
							let lastActiveEstimate = activeEstimates.length === 1 ? activeEstimates[0] : _.head(_.orderBy(activeEstimates, ['UpdatedAt'], ['desc']));
							deferred.resolve(lastActiveEstimate);
						} else {
							deferred.resolve(null);
						}
					});
					return deferred.promise;
				};

				service.showUpdateEstimateWizard = function showUpdateEstimateWizard() {
					let context = getContext();
					if (_.isNil(_.get(context, 'projectId'))) {
						$log.warn('No project id available.');
						return;
					}

					let modalOptions = {
						headerText: 'Update Estimate',
						headerText$tr$: 'sales.common.updateEstimateWizard.wizardTitle',
						showOkButton: true,
						showCancelButton: true,
						bodyTemplateUrl: globals.appBaseUrl + 'sales.common/partials/sales-common-update-estimate-wizard-dialog.html',
						backdrop: false,
						width: '700px',
						height: 'auto',
						resizeable: true,
						value: {}
					};
					platformDialogService.showDialog(modalOptions).then(function (result) {
						let postData = {
							'IsLinkedBoqItems': result.value.isLinkedBoqItem,
							'IsNewLineItemForBoq': result.value.isLineItemForNewBoq,
							'EstimateFk': result.value.estimateFk
						};
						// add custom sales header id property, e.g. 'BidHeaderFk' or 'OrdHeaderFk'
						if (_.get(context, 'salesHeaderPropName')) {
							postData[context.salesHeaderPropName] = context.salesHeaderId;
						} else {
							$log.warn('No salesHeaderPropName defined.');
							return;
						}

						if (result.ok) {
							$http.post(globals.webApiBaseUrl + context.url, postData).then(function (resp) {
								let title = 'sales.common.updateEstimateWizard.wizardTitle';
								let message = resp.data.Message;
								if (resp.data.IsSuccess) {
									platformDialogService.showMsgBox($translate.instant(message), title, 'info');
								} else {
									platformDialogService.showErrorBox($translate.instant(message), title);
								}
							});
						}
					});
				};

				return service;
			}]);

})(angular);
