/**
 * Created by hzh on 2020/04/20
 */
(function (angular) {
	/* global globals, moment */
	'use strict';
	var moduleName = 'project.main';
	var projectMainModule = angular.module(moduleName);

	/**
	 * @ngdoc service
	 * @name projectMainItwoproject2Bim360DialogService
	 * @function
	 *
	 * @description
	 * projectLocationMainService is the data service for all location related functionality.
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	projectMainModule.service('projectMainItwoproject2Bim360DialogService', projectMainItwoproject2Bim360DialogService);

	projectMainItwoproject2Bim360DialogService.$inject = ['_', '$q', '$injector', '$translate', '$http', '$interval', '$window',
		'platformTranslateService', 'platformModalFormConfigService', 'basicsLookupdataLookupDescriptorService',
		'cloudDesktopBim360GetParamsService', 'cloudDeskBim360Service', 'platformRuntimeDataService'];

	function projectMainItwoproject2Bim360DialogService(_, $q, $injector, $translate, $http, $interval, $window,
		platformTranslateService, platformModalFormConfigService, basicsLookupdataLookupDescriptorService,
		cloudDesktopBim360GetParamsService, cloudDeskBim360Service, platformRuntimeDataService) {
		var projectData = {};
		var services = {};
		var projectTypeItem = [];
		var languageItem = [];
		var usersItem = [];
		var activeServicesItem = [];
		var projectTemplateItem = [];
		var contractTypeItem = [];
		var paramsInfo = {};
		var modalCreateProjectConfig = {};
		var formConfig = {
			fid: 'project.main.createProjectModal',
			version: '0.2.4',
			showGrouping: false,
			change: function (/*entity, model, row*/) {
			},
			groups: [
				{
					gid: 'baseGroup',
					attributes: ['ProjectName', 'StartDate', 'FinishDate', 'projectType', 'language', 'assignProjectAdmin', 'projectTemplate', 'activeServices']
				},
				{
					gid: 'remarkGroup',
					attributes: ['activateServiceNote']
				}
			],
			rows: [
				{
					gid: 'baseGroup',
					rid: 'ProjectName',
					model: 'ProjectName',
					label$tr$: 'project.main.projectName',
					type: 'description',
					sortOrder: 1,
					readonly: true
				},
				{
					gid: 'baseGroup',
					rid: 'StartDate',
					model: 'StartDate',
					required: true,
					label$tr$: 'project.main.autodesk.startDate',
					type: 'description',
					sortOrder: 2,
					readonly: true
				},
				{
					gid: 'baseGroup',
					rid: 'FinishDate',
					model: 'FinishDate',
					required: true,
					label$tr$: 'project.main.autodesk.finishDate',
					type: 'description',
					sortOrder: 3,
					readonly: true
				},
				{
					gid: 'baseGroup',
					rid: 'projectTemplate',
					model: 'projectTemplate',
					sortOrder: 4,
					type: 'select',
					label$tr$: 'project.main.autodesk.projectTemplate',
					options: {
						items: projectTemplateItem,
						valueMember: 'id',
						displayMember: 'name',
						modelIsObject: false
					},
					change: function (entity) {
						if (!entity.projectTemplate) {
							setTemplateParmReadonly(false);
							return;
						}
						setTemplateParmReadonly(true);

						var tokenInfo = cloudDeskBim360Service.getSessionAuth(0);
						var request = {};
						request.ProjInfo = {
							projectNo: entity.projectTemplate
						};
						request.TokenInfo = tokenInfo;
						$http.post(globals.webApiBaseUrl + 'basics/common/bim360/projects/byid', request)
							.then(function (response) {
								var resData = response.data;
								var resToken = resData.TokenInfo;
								cloudDeskBim360Service.setSessionAuth(resToken);
								var arr = [];
								var language = {};
								var project_type = {};
								if (resData) {
									var json = JSON.parse(response.data.ResultMsg);
									var service_types = json.service_types;
									_.forEach(service_types.split(','), function (item) {
										var service_type = _.find(activeServicesItem, function (detail) {
											return item === detail.value;
										});
										if (service_type) {
											arr.push(service_type.Id);
										}
									});
									language = _.find(languageItem, function (item) {
										return item.value === json.language;
									});
									project_type = _.find(projectTypeItem, function (item) {
										return item.value === json.project_type;
									});
								}

								modalCreateProjectConfig.dataItem.language = language ? language.Id : {};
								modalCreateProjectConfig.dataItem.projectType = project_type ? project_type.Id : {};
								modalCreateProjectConfig.dataItem.activeServices = arr;
								if (arr.length === 0) {
									serviceTypeChange(modalCreateProjectConfig.dataItem, arr, 'activeServices');
								}
							});
					}
				},
				{
					gid: 'baseGroup',
					rid: 'projectType',
					required: true,
					sortOrder: 5,
					type: 'directive',
					model: 'projectType',
					directive: 'project-autodesk-project-type-lookup',
					label$tr$: 'project.main.autodesk.projectType',
					readonly: false,
					options: {
						displayMember: 'name',
						showClearButton: false,
						multipleSelection: false
					}
				},
				{
					gid: 'baseGroup',
					rid: 'language',
					required: true,
					sortOrder: 5,
					type: 'directive',
					model: 'language',
					directive: 'project-autodesk-language-lookup',
					label$tr$: 'project.main.autodesk.language',
					readonly: false,
					options: {
						displayMember: 'name',
						showClearButton: false,
						multipleSelection: false
					}
				},
				{
					gid: 'baseGroup',
					rid: 'assignProjectAdmin',
					required: true,
					model: 'assignProjectAdmin',
					sortOrder: 7,
					type: 'select',
					label$tr$: 'project.main.autodesk.assignProjectAdmin',
					options: {
						items: usersItem,
						valueMember: 'email',
						displayMember: 'name',
						modelIsObject: false
					}
				},
				{
					gid: 'baseGroup',
					rid: 'activeServices',
					required: true,
					sortOrder: 8,
					type: 'directive',
					model: 'activeServices',
					directive: 'project-autodesk-service-type-lookup',
					label$tr$: 'project.main.autodesk.activateServices',
					readonly: false,
					options: {
						displayMember: 'name',
						showClearButton: true,
						multipleSelection: true,
						events: [{
							name: 'onEditValueChanged',
							handler: function (e, args) {
								var arr = args.selectedItems.map(function (item) {
									return item.Id;
								});
								serviceTypeChange(modalCreateProjectConfig.dataItem, arr, 'activeServices');
							}
						}],
					},
					validator: serviceTypeChange
				}
			]
		};

		function serviceTypeChange(entity, value, model) {
			var isValid = true;
			var msg = '';
			_.forEach(activeServicesItem, function (service) {
				if (service.required) {
					var validService = _.find(value, function (item) {
						return item === service.Id;
					});
					if (!validService) {
						isValid = false;
						var servicevalue = '"' + service.name + '"';
						msg += msg ? ' , ' + servicevalue : servicevalue;
					}
				}
			});

			if (msg) {
				msg = $translate.instant('project.main.autodesk.activeServiceNote', {object: msg});
			}

			var result = {apply: true, valid: isValid, error: msg};
			platformRuntimeDataService.applyValidationResult(result, entity, model);
			return result;
		}

		function setTemplateParmReadonly(isReadonly) {
			platformRuntimeDataService.readonly(modalCreateProjectConfig.dataItem, [{
				field: 'language',
				readonly: isReadonly
			}]);

			platformRuntimeDataService.readonly(modalCreateProjectConfig.dataItem, [{
				field: 'projectType',
				readonly: isReadonly
			}]);

			platformRuntimeDataService.readonly(modalCreateProjectConfig.dataItem, [{
				field: 'activeServices',
				readonly: isReadonly
			}]);
		}

		function getDialogConfig() {
			var modalCreateProjectConfig = {
				title: $translate.instant('project.main.autodesk.postProjectToAutodesk360BimTitle'),
				resizeable: true,
				dataItem: {
					ProjectName: projectData.ProjectName,
					StartDate: projectData.StartDate ? moment(projectData.StartDate).format('YYYY-MM-DD') : 'NULL',
					FinishDate: projectData.EndDate ? moment(projectData.EndDate).format('YYYY-MM-DD') : 'NULL',
					projectType: {},
					language: {},
					projectTemplate: '',
					assignProjectAdmin: '',
					activeServices: []
				},
				formConfiguration: formConfig,
				handleOK: function handleOK(result) {//result not used
					var newProject = result.data;
					var requestInfo = {};
					var selUser = {};
					var serviceTypes = [];
					var activeServicesSort = _.sortBy(newProject.activeServices);
					_.forEach(activeServicesSort, function (item) {
						var serviceType = _.find(activeServicesItem, function (detail) {
							return item === detail.Id;
						});
						if (serviceType) {
							serviceTypes.push(serviceType.value);
						}
					});

					var user = _.find(usersItem, function (item) {
						return item.email === result.data.assignProjectAdmin;
					});
					if (user) {
						selUser.company_id = user.company_id;
						selUser.email = user.email;
						selUser.service_type = serviceTypes.toString();
						selUser.role = user.default_role_id;
						selUser.uid = user.id;
					}
					requestInfo.UserData = selUser;

					var prjInfo = {};
					prjInfo.name = projectData.ProjectName;

					prjInfo.service_types = serviceTypes.toString();
					prjInfo.start_date = moment(projectData.StartDate).format('YYYY-MM-DD');
					prjInfo.end_date = moment(projectData.EndDate).format('YYYY-MM-DD');
					var projectType = _.find(projectTypeItem, function (item) {
						return item.Id === modalCreateProjectConfig.dataItem.projectType;
					});
					prjInfo.project_type = projectType ? projectType.value : '';
					prjInfo.value = '0';
					prjInfo.currency = paramsInfo.currency;
					prjInfo.country = paramsInfo.country;
					prjInfo.job_number = projectData.ProjectNo;
					if (projectData.AddressEntity) {
						prjInfo.address_line_1 = projectData.AddressEntity.Street;
						prjInfo.city = projectData.AddressEntity.City;
						prjInfo.state_or_province = paramsInfo.state;
						prjInfo.postal_code = projectData.AddressEntity.ZipCode;
					}
					var language = _.find(languageItem, function (item) {
						return item.Id === modalCreateProjectConfig.dataItem.language;
					});
					prjInfo.language = language ? language.value : '';
					prjInfo.contract_type = _.find(contractTypeItem, function (item) {
						return item.value === paramsInfo.contract;
					});
					prjInfo.template_project_id = modalCreateProjectConfig.dataItem.projectTemplate;
					prjInfo.template_project_id = prjInfo.template_project_id === 0 ? '' : prjInfo.template_project_id;
					// prjInfo.include_locations = '0' ;
					// prjInfo.include_companies = '0' ;
					// prjInfo.address_line_2 = '' ;
					// prjInfo.business_unit_id = '';
					// prjInfo.timezone = '' ;
					// prjInfo.construction_type = '' ;
					requestInfo.CreateProjectData = prjInfo;
					requestInfo.TokenInfo = cloudDeskBim360Service.getSessionAuth(0);

					PostProject(requestInfo).then(function (response) {
						var prjSyncInfo = response.prjSynInfo;
						var msg = '';
						var icon = 'ico-info';
						if (prjSyncInfo.StateCode !== 'Created') {
							msg = $translate.instant('project.main.autodesk.syncProjectFail') + '\n' + prjSyncInfo.ResultMsg;
							cloudDeskBim360Service.showMsgDialog('', msg, 'ico-error');
							return;
						}
						msg = $translate.instant('project.main.autodesk.syncProjectSuccess');

						var activeServiceInfo = response.activateServiceInfo;
						if (activeServiceInfo && activeServiceInfo.length > 0) {
							msg += '\n' + $translate.instant('project.main.autodesk.activeServiceFail');
							_.forEach(activeServiceInfo, function (item) {
								msg += item + item.ResultMsg + '\n';
							});
						}
						cloudDeskBim360Service.showMsgDialog('', msg, 'ico-info');
					});
				}
			};

			function PostProject(prjData) {
				var deffer = $q.defer();
				$http.post(globals.webApiBaseUrl + 'basics/common/bim360/projects/create', prjData)
					.then(function (response) {
						deffer.resolve(response.data);
					});

				return deffer.promise;
			}

			modalCreateProjectConfig.dialogOptions = {
				disableOkButton: function () {
					var serviceTypeRequired = true;
					var i = activeServicesItem.length;
					_.forEach(activeServicesItem, function (item) {
						if (item.required === 1) {
							var service = _.find(modalCreateProjectConfig.dataItem.activeServices, function (services) {
								return item.Id === services;
							});
							if (!service) {
								serviceTypeRequired = false;
							}
						}
					});

					return typeof (modalCreateProjectConfig.dataItem.projectType) === 'object' || typeof (modalCreateProjectConfig.dataItem.language) === 'object' ||
						!modalCreateProjectConfig.dataItem.StartDate || !modalCreateProjectConfig.dataItem.FinishDate ||
						modalCreateProjectConfig.dataItem.StartDate === 'NULL' || modalCreateProjectConfig.dataItem.FinishDate === 'NULL' ||
						!modalCreateProjectConfig.dataItem.assignProjectAdmin || !serviceTypeRequired;
				}
			};

			return modalCreateProjectConfig;
		}

		function GetAutodeskParam(modalCreateProjectConfig) {
			if (projectTypeItem.length === 0) {
				_.forEach(cloudDesktopBim360GetParamsService.getProjectType(), function (item) {
					projectTypeItem.push(item);
				});
			}

			if (languageItem.length === 0) {
				_.forEach(cloudDesktopBim360GetParamsService.getLanguage(), function (item) {
					languageItem.push(item);
				});
			}

			if (activeServicesItem.length === 0) {
				_.forEach(cloudDesktopBim360GetParamsService.getActiveService(), function (item) {
					activeServicesItem.push(item);
				});
			}

			modalCreateProjectConfig.dataItem.activeServices.length = 0;
			_.forEach(activeServicesItem, function (item) {
				modalCreateProjectConfig.dataItem.activeServices.push(item.Id);
			});

			if (contractTypeItem.length === 0) {
				_.forEach(cloudDesktopBim360GetParamsService.getContractType(), function (item) {
					contractTypeItem.push(item);
				});
			}
		}

		function autodeskInit() {
			paramsInfo = {
				'BasCurrencyFk': projectData.CurrencyFk ? projectData.CurrencyFk : undefined,
				'BasStateFk': projectData.AddressEntity && projectData.AddressEntity.StateFk ? projectData.AddressEntity.StateFk : undefined,
				'BasCountryFk': projectData.CountryFk ? projectData.CountryFk : undefined,
				'BasContractFk': projectData.ContractTypeFk ? projectData.ContractTypeFk : undefined
			};

			//request two-Legged token
			var tokenInfo = cloudDeskBim360Service.getSessionAuth(0);
			if (!tokenInfo) {
				tokenInfo = {
					tokenLegged: 0
				};
			}

			paramsInfo.TokenInfo = tokenInfo;
			var deffer = $q.defer();
			$http.post(globals.webApiBaseUrl + 'project/main/bim360/Init', paramsInfo)
				.then(function (response) {
					deffer.resolve(response.data);
				});

			return deffer.promise;
		}

		services.getServiceType = function () {
			return activeServicesItem;
		};

		services.getProjectType = function () {
			return projectTypeItem;
		};

		services.getLanguage = function () {
			return languageItem;
		};

		services.showPostDialog = function showPostDialog(serviceData) {
			projectData = serviceData;

			if (!projectData.StartDate || !serviceData.EndDate) {
				var msg = $translate.instant('project.main.autodesk.startDateOrFinishDataIsNullError');
				cloudDeskBim360Service.showMsgDialog('', msg, 'ico-error');
				return;
			}

			if (!projectData.ProjectName) {
				var msg = $translate.instant('project.main.autodesk.projectNameIsNullError');
				cloudDeskBim360Service.showMsgDialog('', msg, 'ico-error');
				return;
			}

			usersItem.length = 0;
			projectTemplateItem.length = 0;
			modalCreateProjectConfig = getDialogConfig();
			cloudDeskBim360Service.showDialog(modalCreateProjectConfig);
			GetAutodeskParam(modalCreateProjectConfig);
			autodeskInit().then(function (response) {
				if (response.StateCode && response.StateCode !== 'OK') {
					cloudDeskBim360Service.showMsgDialog('', response.ResultMsg, 'ico-error');
					return;
				}
				var info = response.paramsInfo;
				paramsInfo.contract = info.Contract;
				paramsInfo.country = info.Country;
				paramsInfo.currency = info.Currency;
				paramsInfo.state = info.State;

				//users
				var users = JSON.parse(response.usersInfo.ResultMsg);
				_.forEach(users, function (item) {
					usersItem.push(item);
				});

				//project template
				var projects = JSON.parse(response.projectsInfo.ResultMsg);
				projectTemplateItem.push({'id': 0, 'name': ''});
				_.forEach(projects, function (item) {
					projectTemplateItem.push(item);
				});

				cloudDeskBim360Service.setSessionAuth(response.tokenInfo);
			});
		};

		return services;
	}
})(angular);
