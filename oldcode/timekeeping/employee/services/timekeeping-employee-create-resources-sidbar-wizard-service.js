/**
 * Created by cakiral on 30.11.2020
 */

(function (angular) {
	/* global globals */
	'use strict';

	/**
	 * @ngdoc factory
	 * @name timekeepingEmployeeCreateResourcesSideBarWizardService
	 * @description
	 * Provides wizard configuration and implementation of all wizards of timekeeping.employee module
	 */

	var moduleName = 'timekeeping.employee';
	angular.module(moduleName).factory('timekeepingEmployeeCreateResourcesSideBarWizardService', ['_', '$http', '$translate', '$injector', '$q', 'moment', 'platformModalService', 'platformTranslateService', 'platformModalFormConfigService', 'timekeepingEmployeeDataService',
		'basicsCommonChangeStatusService', 'basicsLookupdataConfigGenerator',

		function (_, $http, $translate, $injector, $q, moment, platformModalService, platformTranslateService, platformModalFormConfigService, timekeepingEmployeeDataService,
			basicsCommonChangeStatusService, basicsLookupdataConfigGenerator) {

			var service = {};
			var arrowIcon = ' &#10148; ';
			var modalCreateConfig = null;
			var selectedEmployees = null;
			var defaultTimeUnit = null;
			service.createResources = function createResources() {

				var title = $translate.instant('timekeeping.employee.createResourcesByEmployeesWizard.title');
				selectedEmployees = timekeepingEmployeeDataService.getSelectedEntities();
				var employeeIds = selectedEmployees.map(function (item) {
					return item.Id;
				});
				// get default for wizard to show --> only timeUnit possible at this time
				$http.post(globals.webApiBaseUrl + 'timekeeping/employee/wizard/getdefaulttimeunit').then(function (response) {
					if (response && response.data) {
						defaultTimeUnit = response.data;
					}

					var isValid = validateEmployees(employeeIds, title);
					if (isValid) {
						modalCreateConfig = {
							title: title,
							dataItem: {
								SiteFk: null,
								ResTypeFk: null,
								ResKindFk: null,
								ResGroupFk: null,
								UoMTimeFk: defaultTimeUnit,
								CostCodeFk: null,
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
										label: 'Site',
										label$tr$: 'timekeeping.employee.createResourcesByEmployeesWizard.Site',
										type: 'directive',
										directive: 'basics-site-site-lookup',
										options: {
											showClearButton: true,
										},
										model: 'SiteFk',
										readonly: false,
										required: true,
										sortOrder: 1
									},

									basicsLookupdataConfigGenerator.provideDataServiceLookupConfigForForm({
										dataServiceName: 'resourceTypeLookupDataService',
										showClearButton: true
									}, {
										gid: 'baseGroup',
										rid: 'group',
										label: 'Type',
										label$tr$: 'timekeeping.employee.createResourcesByEmployeesWizard.resType',
										type: 'integer',
										model: 'ResTypeFk',
										required: true,
										sortOrder: 2,

									}),

									basicsLookupdataConfigGenerator.provideGenericLookupConfigForForm('basics.customize.resourcekind', 'Description', {
										gid: 'baseGroup',
										rid: 'group',
										label: 'Resource Kind',
										label$tr$: 'timekeeping.employee.createResourcesByEmployeesWizard.resKind',
										type: 'integer',
										model: 'ResKindFk',
										required: true,
										sortOrder: 3
									}, false, {
										hasDefault: true,
									}),

									basicsLookupdataConfigGenerator.provideGenericLookupConfigForForm('basics.customize.resourcegroup', 'Description', {
										gid: 'baseGroup',
										rid: 'group',
										label: 'Resource Group',
										label$tr$: 'timekeeping.employee.createResourcesByEmployeesWizard.resGroup',
										type: 'integer',
										model: 'ResGroupFk',
										required: true,
										sortOrder: 4
									}, false, {
										hasDefault: true,
									}),

									basicsLookupdataConfigGenerator.provideDataServiceLookupConfigForForm({
										dataServiceName: 'basicsUnitLookupDataService',
										showClearButton: true
									}, {
										gid: 'baseGroup',
										rid: 'group',
										label: 'Time Unit',
										label$tr$: 'timekeeping.employee.createResourcesByEmployeesWizard.uomTime',
										type: 'integer',
										model: 'UoMTimeFk',
										required: true,
										sortOrder: 5,

									}),

									{
										gid: 'baseGroup',
										rid: 'group',
										label: 'Cost Code',
										label$tr$: 'timekeeping.employee.createResourcesByEmployeesWizard.costCode',
										type: 'directive',
										directive: 'basics-cost-codes-lookup',
										options: {
											showClearButton: true,
										},
										model: 'CostCodeFk',
										readonly: false,
										required: true,
										sortOrder: 6
									},

								]
							},

							// action for OK button
							handleOK: function handleOK() {
								var dialogResource = modalCreateConfig.dataItem;
								var data = {
									SiteFk: dialogResource.SiteFk,
									ResTypeFk: dialogResource.ResTypeFk,
									ResKindFk: dialogResource.ResKindFk,
									ResGroupFk: dialogResource.ResGroupFk,
									UoMTimeFk: dialogResource.UoMTimeFk,
									CostCodeFk: dialogResource.CostCodeFk,
									EmployeeFks: employeeIds
								};

								$http.post(globals.webApiBaseUrl + 'timekeeping/employee/wizard/createresourcesbyemployees', data).then(function (response) {
									if (response && response.data) {
										var infoString = informationStringForGeneratedResources(response.data);
										var notGeneratedInfoString = '';
										var generatedInfoString = $translate.instant('timekeeping.employee.createResourcesByEmployeesWizard.generatedInfo');
										var generalItemInfoString = response.data.length + ' ' + generatedInfoString + '<br/>';
										var genaralNotGeneratedInfoString = $translate.instant('timekeeping.employee.createResourcesByEmployeesWizard.genaralNotGeneratedInfo') + '<br/>';
										var notGeneratedInfoStringItems = informationStringForNotGeneratedResources(response.data);

										if (notGeneratedInfoStringItems !== '') {
											notGeneratedInfoString = genaralNotGeneratedInfoString + notGeneratedInfoStringItems;
										}

										var modalOptions = {
											headerText: $translate.instant(title),
											bodyText: generalItemInfoString + infoString + '<br/>' + notGeneratedInfoString,
											iconClass: 'ico-info',
											disableOkButton: false
										};
										platformModalService.showDialog(modalOptions);
									} else {
										var modalOptionsfailed = {
											headerText: $translate.instant(title),
											bodyText: $translate.instant('timekeeping.employee.createResourcesByEmployeesWizard.noGeneratedAtAllInfo'),
											iconClass: 'ico-info',
											disableOkButton: false
										};
										platformModalService.showDialog(modalOptionsfailed);
									}
								});
							},
							dialogOptions: {
								disableOkButton: function () {
									return validationCheckForResourceDialog(modalCreateConfig);
								}
							},
						};
						setDefaultResourceKind().then(function () {
							platformTranslateService.translateFormConfig(modalCreateConfig.formConfiguration);
							platformModalFormConfigService.showDialog(modalCreateConfig);
						});
					}});

			};

			function setDefaultResourceKind() {
				return $http.post(globals.webApiBaseUrl + 'basics/customize/resresourcekind/list').then(function (result) {
					var kindList = result.data;
					modalCreateConfig.dataItem.ResKindFk = getDefaultResourceKind(kindList).Id;
				});
			}

			function getDefaultResourceKind(kindList) {
				return _.minBy(kindList, function (item) {
					return item.IsDefault && item.Sorting;
				});
			}

			function validationCheckForResourceDialog(modalCreateConfig) {
				var result = true;
				var dataItem = null;
				if (modalCreateConfig) {
					dataItem = modalCreateConfig.dataItem;
					if (modalCreateConfig.dataItem && dataItem.ResTypeFk && dataItem.ResKindFk && dataItem.ResGroupFk && dataItem.UoMTimeFk && dataItem.CostCodeFk) {
						result = false;
					}
				}
				return result;
			}

			function validateEmployees(resources, title) {
				// Error MessageText
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

			function informationStringForGeneratedResources(dataResourceResults) {
				var infoString = '';
				_.forEach(dataResourceResults, function (resourceItem) {
					infoString += arrowIcon + resourceItem.Code;
				});
				return infoString;
			}

			function informationStringForNotGeneratedResources(dataResourceResults) {
				var isGenerated = null;
				var infoString = '';
				_.forEach(selectedEmployees, function (employee) {
					isGenerated = false;
					_.forEach(dataResourceResults, function (resource) {
						if (employee.Code === resource.Code) {
							isGenerated = true;
						}
					});
					if (!isGenerated) {
						infoString += arrowIcon + employee.Code;
					}
				});
				return infoString;
			}

			return service;
		}
	]);
})(angular);
