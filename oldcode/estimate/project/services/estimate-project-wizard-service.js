/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals, _ */
	'use strict';

	/**
	 * @ngdoc factory
	 * @name estimateProjectWizardService
	 * @description
	 **/
	angular.module('estimate.project').service('estimateProjectWizardService', estimateProjectWizardService);

	estimateProjectWizardService.$inject = ['$injector', 'projectMainService', 'basicsCommonChangeStatusService', 'estimateProjectService', 'platformWizardDialogService',
		'platformModalService', '$http', 'platformSidebarWizardConfigService', '$translate'];

	function estimateProjectWizardService(
		$injector, projectMainService, basicsCommonChangeStatusService, estimateProjectService, platformWizardDialogService,
		platformModalService, $http, platformSidebarWizardConfigService, $translate) {

		let service = {};


		// change status of estimate (in project module)
		let changeEstimateStatus = function changeEstimateStatus() {
			return basicsCommonChangeStatusService.provideStatusChangeInstance(
				{
					statusName: 'estimate',
					mainService: projectMainService,
					// estimateProjectService returns a composite object, entity is { EstHeader: {...} }
					getDataService: function () {
						return {
							getSelected: function () {
								return _.get(estimateProjectService.getSelected(), 'EstHeader');
							},
							getSelectedEntities: function () {
								return _.map(estimateProjectService.getSelectedEntities(), 'EstHeader');
							},
							gridRefresh: function () {
								estimateProjectService.gridRefresh();
							}
						};
					},
					statusField: 'EstStatusFk',
					statusDisplayField: 'DescriptionInfo.Translated',
					title: 'estimate.main.wizardChangeEstimateStatus',
					updateUrl: 'estimate/main/header/changestatus',
					getProjectIdFn: function(){
						// fixed issue: #118098, the get available status function need the projectFk, So find it in 'PrjEstimate'
						return _.get(estimateProjectService.getSelected(), 'PrjEstimate').PrjProjectFk;
					}
				}
			);
		};
		service.changeEstimateStatus = changeEstimateStatus().fn;

		service.createOrUpdateEstimateWizard = function (id) {
			let estimateId = -1; // default id
			let action;
			let name;
			let estimateType;
			let estimateTypeDescription;

			let selected = estimateProjectService.getSelected();
			if (selected && selected.EstHeader.Id) {
				estimateId = selected.EstHeader.Id;
				action = 'update';
			} else {
				action = 'create';
				estimateId = id.Template === null ? -1 : id.Template;
				name = id.Name === null ? '' : id.Name;
				estimateType = id.EstimateType === null ? -1 : id.EstimateType;
				estimateTypeDescription = id.EstimateTypeDescription === null ? '' : id.EstimateTypeDescription;
			}

			let selectedProject = projectMainService.getSelected();
			if (selectedProject && selectedProject.Id) {
				let wizardObject =
					{
						action: action,
						projectId: selectedProject.Id,
						estimateId: estimateId,
						name: name,
						estimateType: estimateType,
						estimateTypeDescription: estimateTypeDescription,
					};
				let jsonWizardObject = JSON.stringify(wizardObject);

				$http
					.post(globals.webApiBaseUrl + 'estimate/main/wizard/createorupdateestimatewizard?wizardObject=' + encodeURIComponent(jsonWizardObject))
					.then(function (response) {
						let modalOptions = {
							templateUrl: globals.appBaseUrl + 'estimate.project/templates/sidebar/wizard/estimate-project-estimate-creation-wizard.html',
							backdrop: 'static', // prevents backdrop & modal from disappearing when user clicks outside of pop up.
							windowClass: 'form-modal-dialog',
							width: '700px',
							height: '800px',
							resizeable: false,
							estimateWizardDto: response.data || null,
							value: {
								wizard: {
									steps: [{
										title: $translate.instant('estimate.project.estimateCreationWizard.estimateAttributes'),
										id: 'estimateAttributes',
										disallowBack: true,
										disallowNext: false,
										canFinish: false,
									}, {
										title: $translate.instant('estimate.project.estimateCreationWizard.businessAttributes'),
										id: 'businessAttributes',
										disallowBack: false,
										disallowNext: false,
										canFinish: false,
									}, {
										title: $translate.instant('estimate.project.estimateCreationWizard.generalAssumptions'),
										id: 'generalAssumptions',
										disallowBack: false,
										disallowNext: false,
										canFinish: false,
									}, {
										title: $translate.instant('estimate.project.estimateCreationWizard.laborMaterialAdders'),
										id: 'laborMaterialAdders',
										disallowBack: false,
										disallowNext: false,
										canFinish: false,
									}, {
										title: $translate.instant('estimate.project.estimateCreationWizard.vintageAttributes'),
										id: 'vintageAttributes',
										disallowBack: false,
										disallowNext: true,
										canFinish: true
									}]
								},
								entity: {
									selector: {},
									__selectorSettings: {}
								},
								wizardName: 'wzdlg'
							}
						};

						modalOptions.scope = platformSidebarWizardConfigService.getCurrentScope();
						return platformModalService.showDialog(modalOptions);
					});
			} else {
				let errorDialogConfig = {
					headerTextKey: $translate.instant('estimate.project.noSelectedProject'),
					showCancelButton: true,
					iconClass: 'error',
					bodyTextKey: $translate.instant('estimate.project.noSelectedProject')
				};
				return platformModalService.showDialog(errorDialogConfig);
			}

		};

		service.updateAssemblies = function updateAssemblies() {
			$injector.get('projectAssemblyWizardService').updateAssemblies();
		};
		service.importAssemblies = function importAssemblies() {
			$injector.get('projectAssemblyWizardService').importAssemblies();
		};

		service.updateAssemblyStructure = function updateAssemblyStructure() {
			$injector.get('projectAssemblyWizardService').updateAssemblyStructure();
		};
		service.transferCostCodeOrMaterial = function transferCostCodeOrMaterial() {
			$injector.get('projectAssemblyWizardService').transferCostCodeOrMaterial();
		};
		return service;
	}
})(angular);
