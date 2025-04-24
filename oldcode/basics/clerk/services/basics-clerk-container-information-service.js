(function (angular) {
	'use strict';
	var basicsClerkModule = angular.module('basics.clerk');

	/**
	 * @ngdoc service
	 * @name basicsClerkContainerInformationService
	 * @function
	 *
	 * @description
	 *
	 */
	basicsClerkModule.factory('basicsClerkContainerInformationService', ['_', '$injector', 'platformLayoutHelperService', 'basicsLookupdataConfigGenerator',
		/* jshint -W072 */ // many parameters because of dependency injection
		function (_, $injector, platformLayoutHelperService, basicsLookupdataConfigGenerator) {
			var service = {};

			service.getContainerInfoByGuid = function getContainerInfoByGuid(guid) {
				var config = {};
				var layServ = null;
				switch (guid) {
					case 'F01193DF20E34B8D917250AD17A433F1': //basicsClerkListController
						layServ = $injector.get('basicsClerkUIStandardService');
						config.layout = layServ.getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'basicsClerkUIStandardService';
						config.dataServiceName = 'basicsClerkMainService';
						config.validationServiceName = 'basicsClerkValidationService';
						config.listConfig = { initCalled: false,
							columns: [],
							sortOptions:
								{
									initialSortColumn:
										{   field: 'Code',
											id: 'code'
										},
									isAsc: true
								}
						};
						break;
					case '8B10861EA9564D60BA1A86BE7E7DA568': //basicsClerkDetailController
						layServ = $injector.get('basicsClerkUIStandardService');
						config = layServ.getStandardConfigForDetailView();
						config.ContainerType = 'Detail';
						config.standardConfigurationService = 'basicsClerkUIStandardService';
						config.dataServiceName = 'basicsClerkMainService';
						config.validationServiceName = 'basicsClerkValidationService';
						break;
					case 'DDE598002BBF4A2D96C82DC927E3E578': //basicsClerkAbsenceListController
						layServ = $injector.get('basicsClerkAbsenceUIStandardService');
						config.layout = layServ.getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'basicsClerkAbsenceUIStandardService';
						config.dataServiceName = 'basicsClerkAbsenceService';
						config.validationServiceName = 'basicsClerkAbsenceValidationService';
						config.listConfig = { initCalled: false, columns: [] };
						break;
					case '6122EEE3BF1A41CE994E0F1E5C165850': //basicsClerkAbsenceDetailController
						layServ = $injector.get('basicsClerkAbsenceUIStandardService');
						config = layServ.getStandardConfigForDetailView();
						config.ContainerType = 'Detail';
						config.standardConfigurationService = 'basicsClerkAbsenceUIStandardService';
						config.dataServiceName = 'basicsClerkAbsenceService';
						config.validationServiceName = 'basicsClerkAbsenceValidationService';
						break;
					case '82bb9ecf97e94aadab3d30f79cba2c02': //basicsClerkGroupListController
						layServ = $injector.get('basicsClerkGroupUIStandardService');
						config.layout = layServ.getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'basicsClerkGroupUIStandardService';
						config.dataServiceName = 'basicsClerkGroupService';
						config.validationServiceName = 'basicsClerkGroupValidationService';
						config.listConfig = { initCalled: false, columns: [] };
						break;
					case '008843fcaa8246faa41f620a0742b3ae': //basicsClerkGroupDetailController
						layServ = $injector.get('basicsClerkGroupUIStandardService');
						config = layServ.getStandardConfigForDetailView();
						config.ContainerType = 'Detail';
						config.standardConfigurationService = 'basicsClerkGroupUIStandardService';
						config.dataServiceName = 'basicsClerkGroupService';
						config.validationServiceName = 'basicsClerkGroupValidationService';
						break;
					case '4fefcbe307f14fb09e7371b5726e8b85': //basicsClerkForPackageListController
						config = service.getBasicsClerkForPackageServiceInfos();
						config.layout = service.getBasicsClerkForPackageLayout();
						config.listConfig = { initCalled: false, columns: [] };
						config.ContainerType = 'Grid';
						break;
					case 'f8e0f47316db4f628e0f3c394e0bda2f': //basicsClerkForPackageDetailController
						config = service.getBasicsClerkForPackageServiceInfos();
						config.layout = service.getBasicsClerkForPackageLayout();
						config.ContainerType = 'Detail';
						break;
					case '81de3f7a458942018890cd82b2333e5b': //basicsClerkForProjectListController
						config = service.getBasicsClerkForProjectServiceInfos();
						config.layout = service.getBasicsClerkForProjectLayout();
						config.listConfig = { initCalled: false, columns: [] };
						config.ContainerType = 'Grid';
						break;
					case '5af6320d446b4945a1d4f7daa9eb1013': //basicsClerkForProjectDetailController
						config = service.getBasicsClerkForProjectServiceInfos();
						config.layout = service.getBasicsClerkForProjectLayout();
						config.ContainerType = 'Detail';
						break;
					case 'e84e703543fd4cb2b8d9bd8e48ecce94': //basicsClerkForScheduleListController
						config = service.getBasicsClerkForScheduleServiceInfos();
						config.layout = service.getBasicsClerkForScheduleLayout();
						config.listConfig = { initCalled: false, columns: [] };
						config.ContainerType = 'Grid';
						break;
					case 'be18520a1fb34649bf3c4ebcd6da2eea': //basicsClerkForScheduleDetailController
						config = service.getBasicsClerkForScheduleServiceInfos();
						config.layout = service.getBasicsClerkForScheduleLayout();
						config.ContainerType = 'Detail';
						break;
					case '9f5b6cfd39114a25b04b7ea69ef0ddc7': //basicsClerkForWicListController
						config = service.getBasicsClerkForWicServiceInfos();
						config.layout = service.getBasicsClerkForWicLayout();
						config.listConfig = { initCalled: false, columns: [] };
						config.ContainerType = 'Grid';
						break;
					case '6042e0bf1d66478da8042b3a207d77bf': //basicsClerkForWicDetailController
						config = service.getBasicsClerkForWicServiceInfos();
						config.layout = service.getBasicsClerkForWicLayout();
						config.ContainerType = 'Detail';
						break;
					case 'd0919db314094f058b6eca179f017e6d': // basicsClerkForEstimateListController
						config = service.getBasicsClerkForEstimateServiceInfos();
						config.layout = service.getBasicsClerkForEstimateLayout();
						config.listConfig = { initCalled: false, columns: [] };
						config.ContainerType = 'Grid';
						break;
					case '874e6bfd2cad48bca4a578699a51ee81': // basicsClerkForEstimateDetailController
						config = service.getBasicsClerkForEstimateServiceInfos();
						config.layout = service.getBasicsClerkForEstimateLayout();
						config.ContainerType = 'Detail';
						break;
					case 'b5f01723e4c34b8d8f5b90262d7f0288': //basicsClerkAbsenceProxyListController
						config = service.getBasicsClerkAbsenceProxyServiceInfos();
						config.layout = service.getBasicsClerkAbsenceProxyLayout();
						config.listConfig = { initCalled: false, columns: [] };
						config.ContainerType = 'Grid';
						break;
					case 'dcb1b0d146af4bec84d574de19a9f01b': //basicsClerkAbsenceProxyDetailController
						config = service.getBasicsClerkAbsenceProxyServiceInfos();
						config.layout = service.getBasicsClerkAbsenceProxyLayout();
						config.ContainerType = 'Detail';
						break;
					case '1e606c28d2244e6587965611e602244d': //basicsClerkMemberListController
						layServ = $injector.get('basicsClerkMemberUIStandardService');
						config.layout = layServ.getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'basicsClerkMemberUIStandardService';
						config.dataServiceName = 'basicsClerkMemberService';
						config.validationServiceName = 'basicsClerkMemberValidationService';
						config.listConfig = { initCalled: false, columns: [] };
						break;
					case '6723baf728274de9a7b455bd518c0a79': //basicsClerkMemberDetailController
						layServ = $injector.get('basicsClerkMemberUIStandardService');
						config = layServ.getStandardConfigForDetailView();
						config.ContainerType = 'Detail';
						config.standardConfigurationService = 'basicsClerkMemberUIStandardService';
						config.dataServiceName = 'basicsClerkMemberService';
						config.validationServiceName = 'basicsClerkMemberValidationService';
						break;
					case '087f9e6948a2416e936e7e88f33e46df': //basicsClerkRoleDefaultValueListController
						config = service.getBasicsClerkRoleDefaultValueServiceInfos();
						config.layout = service.getBasicsClerkRoleDefaultValueLayout();
						config.listConfig = { initCalled: false, columns: [] };
						config.ContainerType = 'Grid';
						break;
					case '88bddfa6b18e4f6c81960df2fc0e6744': //basicsClerkRoleDefaultValueDetailController
						config = service.getBasicsClerkRoleDefaultValueServiceInfos();
						config.layout = service.getBasicsClerkRoleDefaultValueLayout();
						config.ContainerType = 'Detail';
						break;
				}

				return config;
			};

			service.getBasicsClerkForPackageServiceInfos = function getBasicsClerkForPackageServiceInfos() {
				return {
					standardConfigurationService: 'basicsClerkForPackageLayoutService',
					dataServiceName: 'basicsClerkForPackageDataService',
					validationServiceName: 'basicsClerkForPackageValidationService'
				};
			};

			service.getBasicsClerkForPackageLayout = function getBasicsClerkForPackageLayout() {
				var res = platformLayoutHelperService.getSimpleBaseLayout('1.0.0', 'basics.clerk.clerkforpackage',
					['clerk2fk','clerkrolefk','commenttext']);
				res.overloads = service.getOverloads(['clerk2fk','clerkrolefk']);
				res.addAdditionalColumns = true;

				return res;
			};

			service.getBasicsClerkForProjectServiceInfos = function getBasicsClerkForProjectServiceInfos() {
				return {
					standardConfigurationService: 'basicsClerkForProjectLayoutService',
					dataServiceName: 'basicsClerkForProjectDataService',
					validationServiceName: 'basicsClerkForProjectValidationService'
				};
			};

			service.getBasicsClerkForProjectLayout = function getBasicsClerkForProjectLayout() {
				var res = platformLayoutHelperService.getSimpleBaseLayout('1.0.0', 'basics.clerk.clerkforproject',
					['clerk2fk','clerkrolefk','commenttext']);
				res.overloads = service.getOverloads(['clerk2fk','clerkrolefk']);
				res.addAdditionalColumns = true;

				return res;
			};

			service.getBasicsClerkForScheduleServiceInfos = function getBasicsClerkForScheduleServiceInfos() {
				return {
					standardConfigurationService: 'basicsClerkForScheduleLayoutService',
					dataServiceName: 'basicsClerkForScheduleDataService',
					validationServiceName: 'basicsClerkForScheduleValidationService'
				};
			};

			service.getBasicsClerkForScheduleLayout = function getBasicsClerkForScheduleLayout() {
				var res = platformLayoutHelperService.getSimpleBaseLayout('1.0.0', 'basics.clerk.clerkforschedule',
					['clerk2fk','clerkrolefk','commenttext']);
				res.overloads = service.getOverloads(['clerk2fk','clerkrolefk']);
				res.addAdditionalColumns = true;

				return res;
			};

			service.getBasicsClerkForWicServiceInfos = function getBasicsClerkForWicServiceInfos() {
				return {
					standardConfigurationService: 'basicsClerkForWicLayoutService',
					dataServiceName: 'basicsClerkForWicDataService',
					validationServiceName: 'basicsClerkForWicValidationService'
				};
			};

			service.getBasicsClerkForWicLayout = function getBasicsClerkForWicLayout() {
				var res = platformLayoutHelperService.getSimpleBaseLayout('1.0.0', 'basics.clerk.clerkforwic',
					['clerk2fk','clerkrolefk','commenttext']);
				res.overloads = service.getOverloads(['clerk2fk','clerkrolefk']);
				res.addAdditionalColumns = true;

				return res;
			};

			service.getBasicsClerkForEstimateServiceInfos = function getBasicsClerkForEstimateServiceInfos() {
				return {
					standardConfigurationService: 'basicsClerkForEstimateLayoutService',
					dataServiceName: 'basicsClerkForEstimateDataService',
					validationServiceName: 'basicsClerkForEstimateValidationService'
				};
			};

			service.getBasicsClerkForEstimateLayout = function getBasicsClerkForEstimateLayout() {
				var res = platformLayoutHelperService.getSimpleBaseLayout('1.0.0', 'basics.clerk.clerkforestimate',
					['clerk2fk','clerkrolefk','commenttext']);
				res.overloads = service.getOverloads(['clerk2fk','clerkrolefk']);
				res.addAdditionalColumns = true;

				return res;
			};

			service.getBasicsClerkAbsenceProxyServiceInfos = function getBasicsClerkAbsenceProxyServiceInfos() {
				return {
					standardConfigurationService: 'basicsClerkAbsenceProxyLayoutService',
					dataServiceName: 'basicsClerkAbsenceProxyService',
					validationServiceName: 'basicsClerkAbsenceProxyValidationService'
				};
			};

			service.getBasicsClerkAbsenceProxyLayout = function getBasicsClerkAbsenceProxyLayout() {
				var res = platformLayoutHelperService.getSimpleBaseLayout('1.0.0', 'basics.clerk.clerkabsenceproxy',
					['clerkrolefk','commenttext','clerkfk','companyfk','projectfk']);
				res.overloads = service.getOverloads(['clerkfk', 'clerkrolefk', 'companyfk', 'projectfk']);
				res.addAdditionalColumns = true;

				return res;
			};

			service.getBasicsClerkRoleDefaultValueServiceInfos = function getBasicsClerkRoleDefaultValueServiceInfos() {
				return {
					standardConfigurationService: 'basicsClerkRoleDefaultValueLayoutService',
					dataServiceName: 'basicsClerkRoleDefaultValueDataService',
					validationServiceName: 'basicsClerkRoleDefaultValueValidationService'
				};
			};

			service.getBasicsClerkRoleDefaultValueLayout = function getBasicsClerkRoleDefaultValueLayout() {
				var res = platformLayoutHelperService.getSimpleBaseLayout('1.0.0', 'basics.clerk.clerkroledefaultvalue',
					['clerkroledefvaltypefk','clerkrolefk']);
				res.overloads = service.getOverloads(['clerkroledefvaltypefk', 'clerkrolefk']);
				res.addAdditionalColumns = true;

				return res;
			};

			service.getOverloads = function getOverloads(overloads) {
				var ovls = {};
				if (overloads) {
					_.forEach(overloads, function (ovl) {
						var ol = service.getOverload(ovl);
						if (ol) {
							ovls[ovl] = ol;
						}
					});
				}

				return ovls;
			};

			service.getOverload = function getOverloads(overload) {
				var ovl = null;

				switch (overload) {
					case 'clerk2fk': ovl = service.getClerkOverload(); break;
					case 'clerkrolefk': ovl = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'basicsCustomClerkRoleLookupDataService',
						enableCache: true
					}); break;
					case 'companyfk': ovl = service.getCompanyOverload(); break;
					case 'clerkfk': ovl = platformLayoutHelperService.provideClerkLookupOverload(); break;
					case 'projectfk': ovl = platformLayoutHelperService.provideProjectLookupOverload(); break;
					case 'clerkroledefvaltypefk': ovl = basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.clerkroledefaultvaluetype'); break;

				}

				return ovl;
			};

			service.getClerkOverload = function getClerkOverload() {
				return {
					detail: {
						type: 'directive',
						directive: 'basics-lookupdata-lookup-composite',
						options: {
							lookupDirective: 'cloud-clerk-clerk-dialog',
							descriptionMember: 'Description',
							lookupOptions: {
								showClearButton: true
							}
						},
						requiredInErrorHandling: true
					},
					grid: {
						editor: 'lookup',
						directive: 'basics-lookupdata-lookup-composite',
						editorOptions: {
							lookupDirective: 'cloud-clerk-clerk-dialog',
							lookupOptions: {
								showClearButton: true,
								displayMember: 'Code',
								addGridColumns: [{
									id: 'Description',
									field: 'Description',
									name: 'Description',
									width: 200,
									formatter: 'description',
									name$tr$: 'cloud.common.entityDescription'
								}],
								additionalColumns: true
							}
						},
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'Clerk',
							displayMember: 'Code'
						}
					}
				};
			};

			service.getCompanyOverload = function getCompanyOverload() {
				return  {
					grid: {
						editor: 'lookup',
						editorOptions: {
							directive: 'basics-company-company-lookup'
						},
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'company',
							displayMember: 'Code'
						},
						width: 140
					},
					detail: {
						type: 'directive',
						directive: 'basics-lookupdata-lookup-composite',
						options: {
							lookupDirective: 'basics-company-company-lookup',
							descriptionMember: 'CompanyName',
							lookupOptions: {}
						}
					}
				};
			};

			service.getProjectOverload = function getProjectOverload() {
				return {
					detail: {
						type: 'directive',
						directive: 'basics-lookupdata-lookup-composite',
						options: {
							lookupDirective: 'basics-lookup-data-project-project-dialog',
							descriptionMember: 'ProjectName',
							lookupOptions: {
								showClearButton: false,
								readOnly: true
							}
						}
					},
					grid: {
						editor: 'lookup',
						editorOptions: {
							directive: 'basics-lookup-data-project-project-dialog',
							lookupOptions: {
								showClearButton: false,
								readOnly: true
							}
						},
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'project',
							displayMember: 'ProjectNo'
						}
					}
				};
			};


			return service;
		}
	]);
})(angular);
