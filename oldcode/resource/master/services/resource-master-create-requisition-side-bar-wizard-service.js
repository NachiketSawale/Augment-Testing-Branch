/**
 * Created by cakiral on 19.10.2020
 */


(function (angular) {
	/* global globals */
	'use strict';

	/**
	 * @ngdoc factory
	 * @name resourceMasterCreateRequisitionSideBarWizardService
	 * @description
	 * Provides wizard configuration and implementation of all wizards of resourceMaster module
	 */

	var moduleName = 'resource.master';
	angular.module(moduleName).factory('resourceMasterCreateRequisitionSideBarWizardService', ['_', '$http', '$translate', '$injector', '$q', 'moment', 'platformModalService', 'platformTranslateService', 'platformModalFormConfigService', 'resourceMasterMainService',
		'basicsCommonChangeStatusService', 'basicsLookupdataConfigGenerator',

		function (_, $http, $translate, $injector, $q, moment, platformModalService, platformTranslateService, platformModalFormConfigService, resourceMasterMainService,
			basicsCommonChangeStatusService, basicsLookupdataConfigGenerator) {

			var service = {};
			var arrowIcon = ' &#10148; ';
			var modalCreateConfig = null;
			service.createRequisition = function createRequisition() {

				var title = $translate.instant('resource.master.createRequisitionsByResourcesWizard.title');
				var resources = resourceMasterMainService.getSelectedEntities();
				var isValid = validateResources(resources, title);
				if (isValid) {
					modalCreateConfig = {
						title: title,
						dataItem: {
							JobFk: null,
							StatusFk: null,
							Startdate: null,
							UserDefineText4: null,
							UserDefineText5: null,
						},

						formConfiguration: {
							version: '1.0.0',
							showGrouping: false,
							groups: [
								{
									gid: 'baseGroup',
								}
							],
							rows: [
								{
									gid: 'baseGroup',
									rid: 'group',
									label: 'Job',
									label$tr$: 'resource.master.createRequisitionsByResourcesWizard.job',
									type: 'directive',
									directive: 'logistic-job-paging-lookup',
									options: {
										showClearButton: false,
									},
									model: 'JobFk',
									readonly: false,
									required: true,
									sortOrder: 1
								},

								basicsLookupdataConfigGenerator.provideGenericLookupConfigForForm('basics.customize.resrequisitionstatus', 'Description', {
									gid: 'baseGroup',
									rid: 'group',
									label: 'Status',
									label$tr$: 'resource.master.createRequisitionsByResourcesWizard.status',
									type: 'integer',
									model: 'StatusFk',
									required: true,

									sortOrder: 2
								}, false, {
									hasDefault: true,
									showIcon: true,
									imageSelectorService: 'platformStatusIconService'
								}),
								{
									gid: 'baseGroup',
									rid: 'group',
									label: 'Start Date',
									label$tr$: 'resource.master.createRequisitionsByResourcesWizard.startdate',
									type: 'datetime',
									model: 'Startdate',
									readonly: false,
									required: true,
									sortOrder: 3
								},

								{
									gid: 'baseGroup',
									rid: 'group',
									label: 'Text(4)',
									label$tr$: 'resource.master.createRequisitionsByResourcesWizard.userDefineText4',
									type: 'description',
									options: {
										showClearButton: true,
									},
									model: 'UserDefineText4',
									readonly: false,
									sortOrder: 4
								},
								{
									gid: 'baseGroup',
									rid: 'group',
									label: 'Text(5)',
									label$tr$: 'resource.master.createRequisitionsByResourcesWizard.userDefineText5',
									type: 'description',
									options: {
										showClearButton: true,
									},
									model: 'UserDefineText5',
									readonly: false,
									sortOrder: 5
								},

							]
						},

						// action for OK button
						handleOK: function handleOK() {
							var dialogRequisition = modalCreateConfig.dataItem;
							var data = {
								JobFk: dialogRequisition.JobFk,
								StatusFk: dialogRequisition.StatusFk,
								Startdate: dialogRequisition.Startdate,
								UserDefineText4: dialogRequisition.UserDefineText4,
								UserDefineText5: dialogRequisition.UserDefineText5,
								ProjectFk: $injector.get('logisticJobDialogLookupPagingDataService').getSelected().ProjectFk,
								Resource: resources
							};

							$http.post(globals.webApiBaseUrl + 'resource/requisition/creation/createrequisitionsbyresource', data).then(function (response) {
								if (response && response.data) {
									var infoString = '';
									var generatedInfoString = $translate.instant('resource.master.createRequisitionsByResourcesWizard.generatedInfoString');
									var genaralItemInfoString  = response.data.length+' ' + generatedInfoString + '<br/>';
									_.forEach(response.data, function (reqItem) {

										infoString += arrowIcon + reqItem.Description;
									});
									var modalOptions = {
										headerText: $translate.instant(title),
										bodyText:  genaralItemInfoString + infoString,
										iconClass: 'ico-info',
										disableOkButton: false
									};
									platformModalService.showDialog(modalOptions);
								}
							});
						},
						dialogOptions: {
							disableOkButton: function () {
								return validationCheckForRequistionDialog(modalCreateConfig);
							}
						},
					};

					getDefaultRequistionsStatus(modalCreateConfig).then(function (defaultStatus) {
						modalCreateConfig.dataItem.StatusFk = defaultStatus.Id;
					});


					platformTranslateService.translateFormConfig(modalCreateConfig.formConfiguration);
					platformModalFormConfigService.showDialog(modalCreateConfig);
				}

			};

			function getDefaultRequistionsStatus() {
				return $injector.get('basicsLookupdataSimpleLookupService').getList({
					valueMember: 'Id',
					displayMember: 'Description',
					lookupModuleQualifier: 'basics.customize.resrequisitionstatus',
				}).then(function (respons) {
					return _.minBy(respons, function (item) {
						return  item.isDefault && item.sorting;
					});
				});
			}

			function validationCheckForRequistionDialog(modalCreateConfig){
				var result = true;
				var dataItem = null;
				if (modalCreateConfig) {
					dataItem = modalCreateConfig.dataItem;
					if (modalCreateConfig.dataItem && dataItem.JobFk && dataItem.StatusFk && dataItem.Startdate) {
						result = false;
					}
				}
				return result;
			}

			function validateResources(resources, title){
				//Error MessageText
				var modalOptions = {
					headerText: $translate.instant(title),
					bodyText: '',
					iconClass: 'ico-info',
					disableOkButton: false
				};
				var isValid = true;
				var isCurrentSelection = true;

				if (resources.length === 0) {
					modalOptions.bodyText += arrowIcon + $translate.instant('cloud.common.noCurrentSelection');
					isValid = false;
					isCurrentSelection = false;
					platformModalService.showDialog(modalOptions);
				}
				return isValid;
			}
			return service;
		}
	]);
})(angular);
