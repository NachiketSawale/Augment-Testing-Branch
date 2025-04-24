/**
 * Created by csalopek on 12.12.2017.
 */

(function (angular) {
	/* global globals */
	'use strict';
	var moduleName = 'scheduling.extsys';

	/**
	 * @ngdoc service
	 * @name schedulingExtSysPrimaveraService
	 * @function
	 *
	 * @description
	 * This service provides Primavera import/export integration with Scheduling
	 */
	angular.module(moduleName).factory('schedulingExtSysPrimaveraService', [
		'_',
		'$q',
		'$http',
		'$injector',
		'$translate',
		'$log',
		'$rootScope',
		'basicsLookupdataConfigGenerator',
		'platformRuntimeDataService',
		'platformContextService',
		'platformTranslateService',
		'platformModalFormConfigService',
		'platformModalService',
		'platformModalGridConfigService',
		'platformSidebarWizardCommonTasksService',
		'basicsCommonServiceUploadExtension',
		'platformDataServiceFactory',
		'platformDataServiceProcessDatesBySchemeExtension',
		'basicsLookupdataLookupDescriptorService',
		'PlatformMessenger',
		'platformDialogService',

		function (
			_,
			$q,
			$http,
			$injector,
			$translate,
			$log,
			$rootScope,
			basicsLookupdataConfigGenerator,
			platformRuntimeDataService,
			platformContextService,
			platformTranslateService,
			platformModalFormConfigService,
			platformModalService,
			platformModalGridConfigService,
			platformSidebarWizardCommonTasksService,
			basicsCommonServiceUploadExtension,
			platformDataServiceFactory,
			platformDataServiceProcessDatesBySchemeExtension,
			basicsLookupdataLookupDescriptorService,
			PlatformMessenger,
			platformDialogService
		) {

			var service = {},
				configurations = [],
				primaveraConfigurations = [],
				primaveraDatabases = [],
				projectFk = null;

			function setConfigurations() {
				configurations = [];

				return $http.get(globals.webApiBaseUrl + 'scheduling/extsys/primavera/configurations', configurations).then(function (response) {
					primaveraConfigurations = response.data || [];
				}, function () {
					$log.error('Failed to load data for Primavera Configurations ' + globals.webApiBaseUrl + 'scheduling/extsys/primavera/configurations');
				});
			}

			function createDialog(modalPrimaveraConfig) {
				platformTranslateService.translateFormConfig(modalPrimaveraConfig.formConfiguration);
				return platformModalFormConfigService.showDialog(modalPrimaveraConfig);
			}
			// new form configuration for seprate xer and web service view

			service.getImportConfig = function getImportConfig() {
				return {
					fid: 'scheduling.main.primavera.importPrimavera',
					version: '0.0.1',
					showGrouping: true,
					groups: [
						{
							gid: 'baseGroup',
							header: 'Direct Import', header$tr$: 'Direct Import',
							isOpen: true, visible: true
						},
						{
							gid: 'xerfile',
							header: 'XER File Import', header$tr$: 'XER File Import',
							isOpen: false, visible: true
						}
					],
					rows: [
						{
							gid: 'baseGroup',
							rid: 'importconfiguration',
							label$tr$: 'scheduling.main.primavera.config',
							type: 'select',
							model: 'ImportConfiguration',
							sortOrder: 1,
							options: {
								items: primaveraConfigurations,
								displayMember: 'DescriptionInfo.Description',
								valueMember: 'ExternalConfigFk'
							},
							change: function onPropertyChanged(item, property) {
								if (property && _.isString(property) && property === 'ImportConfiguration') {
									return $http.get(globals.webApiBaseUrl + 'scheduling/extsys/primavera/databases?configurationId=' + item.ImportConfiguration, {}).then(function (response) {
										item.ImportDatabase = undefined;
										primaveraDatabases.length = 0;
										for (var i = 0; i < response.data.length; i++) {
											primaveraDatabases.push(response.data[i]);
										}
										return true;
									}, function () {
										$log.error('Failed to load data for Primavera Databases ' + globals.webApiBaseUrl + 'scheduling/extsys/primavera/import/primaveradatabases');
										return true;
									});
								}
							}
						},
						{
							gid: 'baseGroup',
							rid: 'importdatabase',
							label$tr$: 'scheduling.main.primavera.database',
							type: 'select',
							model: 'ImportDatabase',
							sortOrder: 1,
							options: {
								// Reinstated ability to import and export from P6 EPPM
								// valueMember: 'databaseInstanceIdField',
								valueMember: 'DatabaseInstanceId',
								// displayMember: 'databaseNameField',
								displayMember: 'DatabaseName',
								items: primaveraDatabases
							}
						},
						basicsLookupdataConfigGenerator.provideDataServiceLookupConfigForForm({
							dataServiceName: 'schedulingExtSysPrimaveraEpsProjectsLookupDataService',
							filter: function (item) {
								return { configurationId: item.ImportConfiguration, databaseId: item.ImportDatabase };
							},
							enableCache: false
						},
						{
							gid: 'baseGroup',
							rid: 'project',
							model: 'Project',
							sortOrder: 1,
							label: 'Project'
						}),
						{
							gid: 'xerfile',
							rid: 'ImportXERFile',
							model: 'ImportXERFile',
							sortOrder: 2,
							label$tr$: 'scheduling.main.primavera.importXERFile',
							type: 'boolean'
						}
					]
				};
			};

			service.getExportConfig = function getExportConfig() {
				return {
					fid: 'scheduling.main.primavera.exportToPrimavera',
					version: '0.0.1',
					showGrouping: true,
					groups: [
						{
							gid: 'baseGroup',
							attributes: ['exportconfiguration', 'exportdatabase', 'epsitem', 'projectId', 'projectDescription'],
							header: 'New Project', header$tr$: 'New Project',
                            isOpen: true, visible: true
						},
                        {
                            gid: 'existingproject',
                            header: 'Existing Project', header$tr$: 'Existing Project',
                            isOpen: false, visible: true
                        }
					],
					rows: [
						{
							gid: 'baseGroup',
							rid: 'exportconfiguration',
							label$tr$: 'scheduling.main.primavera.config',
							type: 'select',
							model: 'ExportConfiguration',
							sortOrder: 1,
							options: {
								items: primaveraConfigurations,
								displayMember: 'DescriptionInfo.Description',
								valueMember: 'ExternalConfigFk'
							},
							change: function onPropertyChanged(item, property) {
								if (property && _.isString(property) && property === 'ExportConfiguration') {
									return $http.get(globals.webApiBaseUrl + 'scheduling/extsys/primavera/databases?configurationId=' + item.ExportConfiguration, {}).then(function (response) {
										item.ExportDatabase = undefined;
										item.EpsItem = undefined;
										primaveraDatabases.length = 0;
										for (var i = 0; i < response.data.length; i++) {
											primaveraDatabases.push(response.data[i]);
										}
										return true;
									}, function () {
										$log.error('Failed to load data for Primavera Databases ' + globals.webApiBaseUrl + 'scheduling/extsys/primavera/import/primaveradatabases');
										return true;
									});
								}
							}
						},
						{
							gid: 'baseGroup',
							rid: 'exportdatabase',
							label$tr$: 'scheduling.main.primavera.database',
							type: 'select',
							model: 'ExportDatabase',
							sortOrder: 1,
							options: {
								// Reinstated ability to import and export from P6 EPPM
								// valueMember: 'databaseInstanceIdField',
								valueMember: 'DatabaseInstanceId',
								// displayMember: 'databaseNameField',
								displayMember: 'DatabaseName',
								items: primaveraDatabases
							}
						},
						basicsLookupdataConfigGenerator.provideDataServiceLookupConfigForForm({
							dataServiceName: 'schedulingExtSysPrimaveraEpsLookupDataService',
							filter: function (item) {
								return { configurationId: item.ExportConfiguration, databaseId: item.ExportDatabase };
							},
							enableCache: false
						},
						{
							gid: 'baseGroup',
							rid: 'epsitem',
							model: 'EpsItem',
							sortOrder: 1,
							label: 'EPS'
						}),
						{
							gid: 'baseGroup',
							rid: 'projectId',
							model: 'ProjectId',
							label$tr$: 'scheduling.main.primavera.project',
							type: 'description',
							sortOrder: 1
						},
						{
							gid: 'baseGroup',
							rid: 'projectDescription',
							model: 'ProjectDescription',
							label$tr$: 'scheduling.main.primavera.projectDescription',
							type: 'description',
							sortOrder: 3,
						},
						{
                            gid: 'existingproject',
                            rid: 'exportconfiguration',
                            label$tr$: 'scheduling.main.primavera.config',
                            type: 'select',
                            model: 'ExportConfiguration',
                            sortOrder: 1,
                            options: {
                                items: primaveraConfigurations,
                                displayMember: 'DescriptionInfo.Description',
                                valueMember: 'ExternalConfigFk'
                            },
                            change: function onPropertyChanged(item, property) {
                                if (property && _.isString(property) && property === 'ExportConfiguration') {
                                    return $http.get(globals.webApiBaseUrl + 'scheduling/extsys/primavera/databases?configurationId=' + item.ExportConfiguration, {}).then(function (response) {
                                        item.ExportDatabase = undefined;
                                        item.EpsItem = undefined;
                                        primaveraDatabases.length = 0;
                                        for (var i = 0; i < response.data.length; i++) {
                                            primaveraDatabases.push(response.data[i]);
                                        }
                                        return true;
                                    }, function () {
                                        $log.error('Failed to load data for Primavera Databases ' + globals.webApiBaseUrl + 'scheduling/extsys/primavera/import/primaveradatabases');
                                        return true;
                                    });
                                }
                            }
                        },
                        {
                            gid: 'existingproject',
                            rid: 'exportdatabase',
                            label$tr$: 'scheduling.main.primavera.database',
                            type: 'select',
                            model: 'ExportDatabase',
                            sortOrder: 1,
                            options: {
                                // Reinstated ability to import and export from P6 EPPM
                                //valueMember: 'databaseInstanceIdField',
                                valueMember: 'DatabaseInstanceId',
                                //displayMember: 'databaseNameField',
                                displayMember: 'DatabaseName',
                                items: primaveraDatabases
                            }
                        },
                        basicsLookupdataConfigGenerator.provideDataServiceLookupConfigForForm({
                            dataServiceName: 'schedulingExtSysPrimaveraEpsProjectsLookupDataService',
                            filter: function (item) {
                                return { configurationId: item.ExportConfiguration, databaseId: item.ExportDatabase };
                            },
                            enableCache: false

                        },
                            {
                                gid: 'existingproject',
                                rid: 'project',
                                model: 'Project',
                                sortOrder: 6,
                                label: 'Project'
                            }),
					]
				};
			};

			service.exportToPrimavera = function exportToPrimavera(schedule) {
				setConfigurations().then(function () {
					var scheduleId = schedule.Id;
					// var projectId = schedule.ProjectFk;
					var validateDataItem = function () {
						var dataItem = modalExportPrimaveraConfig.dataItem;
						var isValid = dataItem.ExportConfiguration !== 0 && dataItem.ExportConfiguration !== undefined &&
							dataItem.ExportDatabase !== undefined && dataItem.ExportDatabase !== 0;
						return isValid;
					};

					var title = 'scheduling.main.primavera.exportToPrimavera';
					var modalExportPrimaveraConfig = {
						title: $translate.instant(title),
						dataItem: {
							ExportConfiguration: undefined,
							ExportDatabase: undefined,
							EpsItem: undefined,
                            Project: undefined
						},
						dialogOptions: {
							disableOkButton: function disableOkButton() {
								return !validateDataItem();
							}
						},
						formConfiguration: service.getExportConfig(),
						handleOK: function handleOK(result) {
							$rootScope.$broadcast('asyncInProgress', true);
							$http.post(globals.webApiBaseUrl + 'scheduling/extsys/primavera/export/exportprimavera?configurationId=' + result.data.ExportConfiguration + '&databaseId=' + result.data.ExportDatabase + '&scheduleId=' + scheduleId + '&projectId=' + (result.data.Project || result.data.ProjectId) + '&projectDescription=' + result.data.ProjectDescription + '&primaveraEpsId=' + (result.data.EpsItem || 0), result).then(function (response)
							{
								var infoMessage = response.data; // Get the 'info' message from the response
                                if (infoMessage) {
                                    createDialog(modalExportPrimaveraConfig);
                                    let message = infoMessage;
                                    let title = 'Error';
                                    platformDialogService.showMsgBox(message, title, 'warning');
                                    $rootScope.$broadcast('asyncInProgress', false);


                                } else {
                                    // Handle other success operations
									platformSidebarWizardCommonTasksService.showSuccessfullyDoneMessage(title);
									var schedulingMainService = $injector.get('schedulingMainService');
									schedulingMainService.load();
									$rootScope.$broadcast('asyncInProgress', false);
								}
							}).catch(function (error) {
								// Handle error response
                                // Display error message or perform appropriate error handling
							});
						},
						handleCancel: function handleCancel() {
							service.ExportConfiguration = undefined;
							service.ExportDatabase = undefined;
							service.EpsItem = undefined;
						}
					};

					return createDialog(modalExportPrimaveraConfig);
				});
			};

			service.importPrimavera = function importPrimavera(schedule) {
				// setEstimates(schedule.ProjectFk);

				setConfigurations(schedule).then(function () {
					var scheduleId = schedule.Id;
					var projectId = schedule.ProjectFk;
					projectFk = schedule.ProjectFk;
					var validateDataItem = function () {
						var dataItem = modalImportPrimaveraConfig.dataItem;
						var isValid = (dataItem.ImportConfiguration !== 0 && dataItem.ImportConfiguration !== undefined &&
							dataItem.ImportDatabase !== undefined && dataItem.ImportDatabase !== 0 &&
							// dataItem.Estimate !== undefined && dataItem.Estimate !== 0 &&
							dataItem.Project !== undefined && dataItem.Project !== 0) ||
							(dataItem.ImportXERFile !== false);
						return isValid;
					};

					var title = 'scheduling.main.primavera.importPrimavera';
					var modalImportPrimaveraConfig = {
						title: $translate.instant(title),
						dataItem: {
							ImportConfiguration: undefined,
							ImportDatabase: undefined,
							Estimate: undefined,
							Project: undefined
						},
						dialogOptions: {
							disableOkButton: function disableOkButton() {
								return !validateDataItem();
							}
						},
						formConfiguration: service.getImportConfig(),
						handleOK: function handleOK(result) {						
							if (result.data.ImportXERFile) {
								importFile(result.data.Estimate, scheduleId, projectId, title);
							}
							else {
								$rootScope.$broadcast('asyncInProgress', true);
								var estimateIdWithoutId = '0';
								$http.post(globals.webApiBaseUrl + 'scheduling/extsys/primavera/import/importprimavera?configurationId=' + result.data.ImportConfiguration + '&databaseId=' + result.data.ImportDatabase + '&scheduleId=' + scheduleId + '&projectId=' + projectId + '&estimateId=' + estimateIdWithoutId + '&primaveraProjectId=' + result.data.Project, result).then(function (response) {
									// Handle success response
									var responseData = response.data; // Get the 'info' message from the response
									if (responseData.Info) {

										let message = responseData.Info;
										let title = 'Error';
										platformDialogService.showMsgBox(message, title, 'warning');
										$rootScope.$broadcast('asyncInProgress', false);
									} else {
										showCalendarInfoDialog(responseData.AllCalendars);
										var schedulingMainService = $injector.get('schedulingMainService');
										schedulingMainService.load();
										$rootScope.$broadcast('asyncInProgress', false);
									}
								}).catch(function (error) {
									// Handle error response
									// Display error message or perform appropriate error handling
								});
							}					
						},
						handleCancel: function handleCancel() {
							service.ImportConfiguration = undefined;
							service.ImportDatabase = undefined;
							service.Estimate = undefined;
							service.Project = undefined;
							service.ImportXERFile = false;
						}
					};
					return createDialog(modalImportPrimaveraConfig);
				});
				function importFile(estimateId, scheduleId, projectId, title) {
					var fileUpload = angular.element('<input type="file" accept=".xer"/>');
					if (fileUpload) {
						fileUpload.bind('change', function () {
							var file = fileUpload[0].files[0];

							if (file !== undefined) {
								if (file.name.substr(file.name.lastIndexOf('.')).toLowerCase() === '.xer') {
									$rootScope.$broadcast('asyncInProgress', true);
									var reader = new FileReader();
									reader.onload = function (e) {
										var contents = e.target.result;
										console.time('zipping');
										var zip = new JSZip();
										var newFile = file.name.replace('xer', 'zip');
										zip.file(file.name, contents);
										zip.generateAsync({
											type: 'blob',
											compression: 'DEFLATE'
										}).then(function (zipped) {
											console.timeEnd('zipping');
											$http({
												method: 'POST',
												url: globals.webApiBaseUrl + 'scheduling/extsys/primavera/import/importprimaveraxer',
												headers: { 'Content-Type': undefined },
												transformRequest: function (data) {
													var fd = new FormData();
													fd.append('estimate', angular.toJson(data.estimate));
													fd.append('schedule', angular.toJson(data.schedule));
													fd.append('project', angular.toJson(data.project));
													if (data.blob) {
														fd.append('blob', data.blob, data.name);
													}
													return fd;
												},
												data: {
													estimate: estimateId,
													schedule: scheduleId,
													project: projectId,
													blob: zipped,
													name: newFile
												}
											}).then(function (success) {
												$log.log(success);
												showCalendarInfoDialog(success.data.AllCalendars);
												var schedulingMainService = $injector.get('schedulingMainService');
												schedulingMainService.load();
												$rootScope.$broadcast('asyncInProgress', false);
											},
											function (failure) {
												$log.log(failure);
												schedulingMainService.load();
												$rootScope.$broadcast('asyncInProgress', false);
											});
										});
									};
									reader.readAsText(file);
								} else {
									platformModalService.showErrorBox('scheduling.main.primavera.importPrimaveraError');
								}
							}
						}).bind('destroy', function () {
							fileUpload.unbind('change');
						});
						fileUpload.click();
					}
				}
			};

			function showCalendarInfoDialog(calendarsData) {
				let textExisting = '';
				let textNew = '';
				
				_.forEach(calendarsData, function (value, key) {
					if (value) {
						textExisting += key + '<br/>';
					} else {
						textNew += key + '<br/>';
					}
				});
			
				let modalOptions = {
					headerTextKey: 'scheduling.main.primavera.importPrimavera',
					bodyTemplateUrl: globals.appBaseUrl + 'scheduling.extsys/templates/wizard/scheduling-ext-sys-import-calendar-info-dialog.html',
					bodyText1: textExisting + '<br/>',
					bodyText2: textNew,
					showOkButton: true,
					resizeable: true,
					height: '400px'
				};
			
				platformModalService.showDialog(modalOptions);
			}			

			return service;


		}
	]);
})(angular);
