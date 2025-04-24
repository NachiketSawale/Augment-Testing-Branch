/*
 * $Id: project-main-container-information-service.js 383850 2016-07-14 07:24:36Z zos $
 * Copyright (c) RIB Software AG
 */

(function (angular) {
	'use strict';
	var projectMainModule = angular.module('project.inforequest');

	/**
	 * @ngdoc service
	 * @name projectInfoRequestContainerInformationService
	 * @function
	 *
	 * @description
	 */
	projectMainModule.service('projectInfoRequestContainerInformationService', ProjectInfoRequestContainerInformationService);

	ProjectInfoRequestContainerInformationService.$inject = ['_', '$injector', 'platformSchemaService',
		'platformUIConfigInitService', 'basicsLookupdataConfigGenerator', 'basicsLookupdataLookupFilterService', 'platformLayoutHelperService', 'projectInfoRequestConstantValues','projectCommonDragDropService', 'projectInfoRequestDragDropService'];

	function ProjectInfoRequestContainerInformationService(_, $injector, platformSchemaService,
		platformUIConfigInitService, basicsLookupdataConfigGenerator, basicsLookupdataLookupFilterService, platformLayoutHelperService, projectInfoRequestConstantValues, projectCommonDragDropService, projectInfoRequestDragDropService) {
		var self = this;
		var containerUids = projectInfoRequestConstantValues.uuid.container;

		const modelReferenceLookupConfig = {
			grid: {
				editor: 'lookup',
				editorOptions: {
					directive: 'project-info-request-dialog',
					lookupOptions: {
						showClearButton: true,
						filterKey: 'project-inforequest-by-project-filter',
						additionalColumns: true,
						addGridColumns: [{
							id: 'Description',
							field: 'Description',
							name: 'Description',
							width: 200,
							formatter: 'description',
							name$tr$: 'cloud.common.entityDescription'
						}]
					}
				},
				formatter: 'lookup',
				formatterOptions: {
					lookupType: 'ProjectInfoRequest',
					displayMember: 'Code'
				}
			},
			detail: {
				type: 'directive',
				directive: 'basics-lookupdata-lookup-composite',
				options: {
					lookupDirective: 'project-info-request-dialog',
					descriptionMember: 'Description',
					lookupOptions: {
						showClearButton: true,
						filterKey: 'project-inforequest-by-project-filter'
					}
				}
			}

		};

		(function initialize(filterService) {
			filterService.registerFilter([
				{
					key: 'pir-rubric-category-by-rubric-and-islive-filter',
					fn: function (rc) {
						return rc.RubricFk === 39 && rc.isLive === true;
					},
				},
				{
					key: 'project-info-reques-subsidiary-filter',
					fn: function (subsidiary, entity) {
						return ( subsidiary.BusinessPartnerFk === entity.BusinesspartnerFk);
					}
				},
				{
					key: 'project-inforequest-rubric-category-lookup-filter',
					serverKey: 'rubric-category-by-rubric-company-lookup-filter',
					serverSide: true,
					fn: function (entity) {
						return { Rubric: 39 };
					}
				},
				{
					key: 'change-rubric-category-lookup-filter',
					serverKey: 'rubric-category-by-rubric-company-lookup-filter',
					serverSide: true,
					fn: function (entity) {
						return { Rubric: 14 };
					}
				},
				{
					key: 'defect-rubric-category-lookup-filter',
					serverKey: 'rubric-category-by-rubric-company-lookup-filter',
					serverSide: true,
					fn: function (entity) {
						return { Rubric: 73 };
					}
				}
			]);
		})(basicsLookupdataLookupFilterService);

		/* jshint -W074 */ // ignore cyclomatic complexity warning
		this.getContainerInfoByGuid = function getContainerInfoByGuid(guid) {
			var config = {};
			switch (guid) {
				case containerUids.infoRequestList: // projectInfoRequestListController
					config = platformLayoutHelperService.getStandardGridConfig(self.getRequestForInformationServiceInfos(), self.getRequestForInformationLayout);
					config.listConfig = {
						initCalled: false,
						columns: [],
						dragDropService: projectCommonDragDropService,
						type: 'project.main',
						pinningContext: { required: ['project.main'] }
					};
					break;

				case containerUids.infoRequestDetail: // projectInfoRequestDetailController
					config = platformLayoutHelperService.getStandardDetailConfig(self.getRequestForInformationServiceInfos(), self.getRequestForInformationLayout);
					break;

				case containerUids.requestContributionList: // projectInfoRequestContributionListController
					config = platformLayoutHelperService.getStandardGridConfig(self.getContributionServiceInfos(), self.getContributionLayout);
					config.listConfig = {
						initCalled: false,
						parentProp: 'RequestContributionTypeFk',
						childProp: 'RelatedContributions',
						columns: []
					};
					break;

				case containerUids.requestRelevantList: // projectInfoRequestRelevantToListController
					config = platformLayoutHelperService.getStandardGridConfig(self.getRelevantToServiceInfos(), self.getRelevantToLayout);
					config.listConfig = { initCalled: false, columns: [] };
					break;

				case containerUids.requestRelevantDetail: // projectInfoRequestRelevantToDetailController
					config = platformLayoutHelperService.getStandardDetailConfig(self.getRelevantToServiceInfos(), self.getRelevantToLayout);
					break;


				case containerUids.mainModelInfoList: // modelMainObjectInfoListController
					config = $injector.get('modelMainContainerInformationService').getContainerInfoByGuid('36abc91df46f4129a78cc26fe79a6fdc');
					break;

				case containerUids.mainModelInfoDetail: // modelMainObjectInfoDetailController
					config = $injector.get('modelMainContainerInformationService').getContainerInfoByGuid('114f1a46eaee483d829648e7dd60a63c');
					break;

				// grouped imports from model.main
				case containerUids.mainViewerLegendList: // modelMainViewerLegendListController
				case containerUids.mainViewerLegendDetail: // modelMainViewerLegendDetailController
					config = $injector.get('modelMainContainerInformationService').getContainerInfoByGuid(guid);
					break;


				case containerUids.infoRequest2ExternalList: // projectInfoRequestInfoRequest2ExternalListController
					config = platformLayoutHelperService.getStandardGridConfig(self.getExternalServiceInfos(), self.getExternalLayout);
					config.listConfig = { initCalled: false, columns: [] };
					break;

				case containerUids.infoRequest2ExternalDetail: // projectInfoRequestInfoRequest2ExternalDetailController
					config = platformLayoutHelperService.getStandardDetailConfig(self.getExternalServiceInfos(), self.getExternalLayout);
					break;

				case containerUids.requestReferenceList: // projectInfoRequestReferenceToListController
					config = platformLayoutHelperService.getStandardGridConfig(self.getReferenceToServiceInfos(), self.getReferenceToLayout);
					config.listConfig = { initCalled: false, columns: [] };
					break;

				case containerUids.requestReferenceDetail: // projectInfoRequestReferenceToDetailController
					config = platformLayoutHelperService.getStandardDetailConfig(self.getReferenceToServiceInfos(), self.getReferenceToLayout);
					break;

				case containerUids.infoRequestChangeList: // projectInfoRequestChangeListController
					config = platformLayoutHelperService.getStandardGridConfig(self.getChangeServiceInfos(), self.getChangeLayout);
					config.listConfig = {initCalled: false, columns: [], dragDropService: projectInfoRequestDragDropService};
					break;

				case containerUids.infoRequestDefectList: // projectInfoRequestDefectListController
					config = platformLayoutHelperService.getStandardGridConfig(self.getDefectServiceInfos(), self.getDefectLayout);
					config.listConfig = {initCalled: false, columns: [], dragDropService: projectInfoRequestDragDropService};
					break;
			}

			return config;
		};

		this.getRequestForInformationServiceInfos = function getRequestForInformationServiceInfos() {
			return {
				standardConfigurationService: 'projectInfoRequestLayoutService',
				dataServiceName: 'projectInfoRequestDataService',
				validationServiceName: 'projectInfoRequestValidationService'
			};
		};

		this.getContributionServiceInfos = function getContributionServiceInfos() {
			return {
				standardConfigurationService: 'projectInfoRequestContributionLayoutService',
				dataServiceName: 'projectInfoRequestContributionDataService',
				validationServiceName: 'projectInfoRequestContributionValidationService'
			};
		};

		this.getRelevantToServiceInfos = function getRelevantToServiceInfos() {
			return {
				standardConfigurationService: 'projectInfoRequestRelevantToLayoutService',
				dataServiceName: 'projectInfoRequestRelevantToDataService',
				validationServiceName: 'projectInfoRequestRelevantToValidationService'
			};
		};

		this.getExternalServiceInfos = function getRelevantToExternalServiceInfos() {
			return {
				standardConfigurationService: 'projectInfoRequest2ExternalLayoutService',
				dataServiceName: 'projectInfoRequest2ExternalDataService',
				validationServiceName: 'projectInfoRequest2ExternalValidationService'
			};
		};


		this.getReferenceToServiceInfos = function getReferenceToServiceInfos() {
			return {
				standardConfigurationService: 'projectInfoRequestReferenceToLayoutService',
				dataServiceName: 'projectInfoRequestReferenceToDataService',
				validationServiceName: 'projectInfoRequestReferenceToValidationService'
			};
		};

		this.getChangeServiceInfos = function getChangeServiceInfos() {
			return {
				standardConfigurationService: 'projectInfoRequestChangeLayoutService',
				dataServiceName: 'projectInfoRequestChangeDataService',
				validationServiceName: ''
			};
		};

		this.getDefectServiceInfos = function getDefectServiceInfos() {
			return {
				standardConfigurationService: 'projectInfoRequestDefectLayoutService',
				dataServiceName: 'projectInfoRequestDefectDataService',
				validationServiceName: ''
			};
		};

		this.getContributionLayout = function getContributionLayout() {
			return self.getBaseLayout('project.inforequest.contribution',
				['inforequestfk', 'requestcontributionfk', 'requestcontributiontypefk',
					'specification', 'clerkfk', 'businesspartnerfk', 'contactfk', 'dateraised'],
				['inforequestfk', 'requestcontributionfk', 'requestcontributiontypefk',
					'clerkfk', 'businesspartnerfk', 'contactfk']);
		};

		this.getRequestForInformationLayout = function getRequestForInformationLayout() {
			var res = platformLayoutHelperService.getTwoGroupsBaseLayout('1.0.0', 'project.inforequest.request',
				['code', 'description', 'projectfk', 'modelfk', 'requeststatusfk', 'priorityfk',
					'requestgroupfk', 'requesttypefk', 'clerkraisedbyfk', 'clerkresponsiblefk', 'clerkcurrentfk',
					'businesspartnerfk', 'subsidiaryfk', 'contactfk', 'dateraised', 'datedue', 'rfi2defecttypefk', 'rfi2changetypefk',
					'defectfk', 'changefk', 'rubriccategoryfk', 'headerfk'],
				platformLayoutHelperService.getUserDefinedTextGroup(5, 'userDefTextGroup', 'userdefined', ''));

			res.overloads = platformLayoutHelperService.getOverloads(['projectfk', 'modelfk', 'requeststatusfk', 'priorityfk',
				'requestgroupfk', 'requesttypefk', 'clerkraisedbyfk', 'clerkresponsiblefk', 'clerkcurrentfk',
				'businesspartnerfk', 'contactfk', 'rfi2defecttypefk', 'rfi2changetypefk', 'defectfk', 'changefk', 'rubriccategoryfk', 'headerfk', 'subsidiaryfk'], self);

			return res;
		};

		this.getRelevantToLayout = function getRelevantToLayout() {
			var res = platformLayoutHelperService.getSimpleBaseLayout('1.0.0', 'project.inforequest.relevantto',
				['inforequestfk', 'businesspartnerfk', 'contactfk', 'commenttext']);

			res.overloads = platformLayoutHelperService.getOverloads(['inforequestfk', 'businesspartnerfk', 'contactfk'], self);

			return res;

		};

		this.getExternalLayout = function getExternalLayout() {
			var res = platformLayoutHelperService.getSimpleBaseLayout('1.0.0', 'project.inforequest.external',
				['projectfk', 'externalsourcefk', 'extguid', 'extname', 'extpath']);

			res.overloads = platformLayoutHelperService.getOverloads(['externalsourcefk'], self);
			res.overloads.projectfk = $injector.get('platformLayoutHelperService').provideProjectLookupReadOnlyOverload();
			return res;

		};

		this.getReferenceToLayout = function getReferenceToLayout() {
			var res = platformLayoutHelperService.getSimpleBaseLayout('1.0.0', 'project.inforequest.reference',
				['requesttofk', 'referencetypefk']);

			res.overloads = platformLayoutHelperService.getOverloads(['requesttofk', 'referencetypefk'], self);

			return res;
		};

		this.getChangeLayout = function getChangeLayout() {
			var res = platformLayoutHelperService.getSimpleBaseLayout('1.0.0', 'project.inforequest.change',
				['code', 'description', 'changestatusfk', 'rubriccategoryfk', 'changetypefk', 'projectfk']);
			res.overloads = platformLayoutHelperService.getOverloads(['code', 'changestatusfk', 'rubriccategoryfk', 'projectfk', 'changetypefk'], self);
			res.overloads.code = {readonly: true};
			res.overloads.description = {readonly: true};
			res.overloads.rubriccategoryfk = {
				grid: {
					editor: 'lookup',
					editorOptions: {
						directive: 'basics-lookupdata-rubric-category-by-rubric-and-company-lookup',
						lookupOptions: {
							filterKey: 'info-request-rubric-category-by-rubric-company-filter',
							showClearButton: true
						}
					},
					formatter: 'lookup',
					formatterOptions: {'lookupType': 'RubricCategoryByRubricAndCompany', 'displayMember': 'Description'},
					width: 125
				},
				readonly: true
			};
			return res;
		}

		this.getDefectLayout = function getDefectLayout() {
			var res = platformLayoutHelperService.getSimpleBaseLayout('1.0.0', 'project.inforequest.defect',
				['code', 'description', 'dfmstatusfk', 'rubriccategoryfk', 'basdefecttypefk', 'prjprojectfk']);
			res.overloads = platformLayoutHelperService.getOverloads(['code', 'dfmstatusfk', 'rubriccategoryfk', 'prjprojectfk', 'basdefecttypefk'], self);
			res.overloads.code = {readonly: true};
			res.overloads.description = {readonly: true};
			res.overloads.rubriccategoryfk = {
				grid: {
					editor: 'lookup',
					editorOptions: {
						directive: 'basics-lookupdata-rubric-category-by-rubric-and-company-lookup',
						lookupOptions: {
							filterKey: 'info-request-rubric-category-by-rubric-company-filter',
							showClearButton: true
						}
					},
					formatter: 'lookup',
					formatterOptions: {'lookupType': 'RubricCategoryByRubricAndCompany', 'displayMember': 'Description'},
					width: 125
				},
				readonly: true
			};
			return res;
		};


		this.getOverload = function getOverloads(overload) {
			var ovl = null;

			switch(overload) {
				case 'projectfk': ovl = {
					readonly: true,
					navigator: {
						moduleName: 'project.main',
						targetIdProperty: 'ProjectFk'
					},
					detail: {
						type: 'code',
						formatter: 'code',
						model: 'Project.ProjectNo'
					},
					grid: {
						formatter: 'code',
						field: 'Project.ProjectNo'
					}
				};
					break;
				case 'defectfk' : ovl = {
					readonly: true,
					navigator: {
						moduleName: 'defect.main',
						targetIdProperty: 'DefectFk'
					},
					detail: {
						type: 'code',
						formatter: 'code',
						model: 'DfmDefectFk'
					},
					grid: {
						formatter: 'code'
					}
				};
					break;

				case 'changefk' : ovl = {
					readonly: true,
					navigator: {
						moduleName: 'change.main',
						targetIdProperty: 'ChangeFk'
					},
					detail: {
						type: 'code',
						formatter: 'code',
						model: 'ChangeFk'
					},
					grid: {
						formatter: 'code'
					}
				};
					break;
				case 'modelfk': ovl = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
					dataServiceName: 'modelProjectModelLookupDataService',
					enableCache: true,
					filter: function (item) {
						return !_.isNil(item.ProjectFk) ? item.ProjectFk : -1;
					}
				});
					break;
				case 'priorityfk': ovl = basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.priority'); break;
				case 'rfi2changetypefk': ovl = basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.rfi2projectchangetype'); break;
				case 'rfi2defecttypefk': ovl = basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.rfi2defecttype'); break;
				case 'requeststatusfk': ovl = basicsLookupdataConfigGenerator.provideReadOnlyConfig('basics.customize.rfistatus', null, {showIcon: true}); break;
				case 'requestgroupfk': ovl = basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.rfigroup'); break;
				case 'requesttypefk': ovl = basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.rfitype'); break;
				case 'clerkraisedbyfk':
				case 'clerkresponsiblefk':
				case 'clerkfk':
				case 'clerkcurrentfk': ovl = {
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
					}};
					break;
				case 'businesspartnerfk': ovl = {
					detail: {
						type: 'directive',
						directive: 'business-partner-main-business-partner-dialog',
						options: {
							initValueField: 'BusinesspartnerBpName1',
							showClearButton: true
						}
					},
					grid: {
						editor: 'lookup',
						editorOptions: {
							directive: 'business-partner-main-business-partner-dialog',
							lookupOptions: {
								showClearButton: true
							}
						},
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'BusinessPartner',
							displayMember: 'BusinessPartnerName1'
						}
					}};
					break;
				case 'contactfk': ovl = {
					detail: {
						type: 'directive',
						directive: 'business-partner-main-filtered-contact-combobox',
						options: {
							initValueField: 'FamilyName',
							filterKey: 'project-info-request-contact-by-bizpartner-filter',
							showClearButton: true
						}
					},
					grid: {
						editor: 'lookup',
						editorOptions: {
							directive: 'business-partner-main-filtered-contact-combobox',
							lookupOptions: {
								showClearButton: true,
								filterKey: 'project-info-request-contact-by-bizpartner-filter'
							}
						},
						width: 125,
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'contact',
							displayMember: 'FamilyName'
						}
					}};
					break;
				case 'inforequestfk': ovl = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
					dataServiceName: 'projectInfoRequestLookupDataService',
					readonly: true,
					enableCache: true,
					filter: function (item) {
						return item.InfoRequestFk;
					}
				});
					break;
				case 'requestcontributionfk': ovl = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
					dataServiceName: 'projectRfiContributionLookupDataService',
					enableCache: true
				});
					break;
				case 'requestcontributiontypefk':
					ovl = basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.rficontributiontype');
					break;
				case 'externalsourcefk':
					ovl = basicsLookupdataConfigGenerator.provideReadOnlyConfig('basics.customize.externalsource');
					break;
				case 'rubriccategoryfk':
					ovl = {
						grid: {
							editor: 'lookup',
							editorOptions: {
								directive: 'basics-lookupdata-rubric-category-by-rubric-and-company-lookup',
								lookupOptions: {
									filterKey: 'info-request-rubric-category-by-rubric-company-filter',
									showClearButton: true
								}
							},
							formatter: 'lookup',
							formatterOptions: {'lookupType': 'RubricCategoryByRubricAndCompany', 'displayMember': 'Description'},
							width: 125
						},
						detail: {
							type: 'directive',
							directive: 'basics-lookupdata-lookup-composite',
							options: {
								lookupDirective: 'basics-lookupdata-rubric-category-by-rubric-and-company-lookup',
								descriptionMember: 'Description',
								lookupOptions: {
									filterKey: 'info-request-rubric-category-by-rubric-company-filter',
									showClearButton: true
								}
							}
						}
					};
					break;
				case 'headerfk': ovl = {
					grid: {
						editor: 'lookup',
						editorOptions: {
							directive: 'prc-con-header-dialog',
							lookupOptions: {
								showClearButton: true,
								filterKey: 'project-inforequest-contract-by-project-filter',
								additionalColumns:true,
								addGridColumns: [{
									id: 'description',
									field: 'Description',
									name: 'Description',
									name$tr$: 'cloud.common.entityDescription',
									formatter: 'description',
									readonly: true
								}]
							}
						},
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'conheader',
							displayMember: 'Code',
						}
					},
					detail: {
						type: 'directive',
						directive: 'basics-lookupdata-lookup-composite',
						options: {
							lookupDirective: 'prc-con-header-dialog',
							displayMember: 'Code',
							descriptionMember: 'Description',
							lookupOptions: {
								showClearButton: true,
								filterKey: 'project-inforequest-contract-by-project-filter'
							}
						}
					}
				}; break;
				case 'subsidiaryfk':
					ovl = {
						detail: {
							type: 'directive',
							directive: 'business-partner-main-subsidiary-lookup',
							options: {
								initValueField: 'SubsidiaryAddress',
								filterKey: 'project-info-reques-subsidiary-filter',
								showClearButton: true,
								displayMember: 'AddressLine'
							}
						},
						grid: {
							editor: 'lookup',
							editorOptions: {
								directive: 'business-partner-main-subsidiary-lookup',
								lookupOptions: {
									showClearButton: true,
									filterKey: 'project-info-reques-subsidiary-filter',
									displayMember: 'AddressLine'
								}
							},
							width: 125,
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'Subsidiary',
								displayMember: 'AddressLine'
							}
						}
					};
					break;
				case 'referencetypefk': ovl = basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.modelannotationreferencetype', 'Description');
					break;
				case 'requestfromfk': ovl = modelReferenceLookupConfig;
					break;
				case 'requesttofk': ovl = modelReferenceLookupConfig;
					break;
				case 'changestatusfk':
					ovl = basicsLookupdataConfigGenerator.provideReadOnlyConfig('basics.customize.projectchangestatus', null, {
						showIcon: true,
						field: 'RubricCategoryFk',
						customIntegerProperty: 'BAS_RUBRIC_CATEGORY_FK'
					});
					break;
				case 'changetypefk': ovl = basicsLookupdataConfigGenerator.provideReadOnlyConfig('basics.customize.changetype', null);
					break;
				case 'dfmstatusfk':
					ovl = basicsLookupdataConfigGenerator.provideReadOnlyConfig('basics.customize.defectstatus', null, {
						showIcon: true,
						field: 'RubricCategoryFk',
						customIntegerProperty: 'BAS_RUBRIC_CATEGORY_FK'
					});
					break;
				case 'basdefecttypefk': ovl = basicsLookupdataConfigGenerator.provideReadOnlyConfig('basics.customize.defecttype', null);
					break;

			}

			return ovl;
		};
	}
})(angular);
