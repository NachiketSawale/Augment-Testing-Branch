/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	var modName = 'hsqe.checklist';
	angular.module(modName).factory('hsqeCheckListLayout', ['platformLayoutHelperService',
		function(platformLayoutHelperService){
			return {
				fid: 'hsqe.checklist.header',
				version: '1.0.0',
				addValidationAutomatically: true,
				showGrouping: true,
				groups: [
					{
						'gid': 'basicData',
						'attributes': ['id','code','descriptioninfo','hsqchecklisttemplatefk','hsqchlstatusfk',
							'hsqchklisttypefk','bascompanyfk','prjprojectfk','datereceived','daterequired', 'dateperformed',
							'basclerkhsqfk','basclerkchkfk', 'prcstructurefk','pesheaderfk','conheaderfk',
							'userdefined1','userdefined2','userdefined3','userdefined4','userdefined5','hsqchecklistfk','etmplantfk','checklistgroupfk',
							'bpdbusinesspartnerfk', 'bpdsubsidiaryfk', 'bpdcontactfk']
					},
					{
						'gid': 'entityHistory',
						'isHistory': true
					}],
				translationInfos: {
					extraModules: [modName],
					extraWords: {
						'Id': {location: 'cloud.common', identifier: 'entityId', initial: 'ID'},
						'moduleName': {'location': modName, 'identifier': 'moduleName', 'initial': 'CheckList'},
						'Code':{'location': modName, 'identifier': 'header.Code', 'initial': 'Code'},
						'HsqCheckListTemplateFk':{'location': modName, 'identifier': 'header.HsqCheckListTemplate', 'initial': 'Check List Template'},
						'HsqChlStatusFk':{'location': modName, 'identifier': 'header.HsqChlStatus', 'initial': 'Status'},
						'HsqChkListTypeFk':{'location': modName, 'identifier': 'header.HsqChkListType', 'initial': 'Check List Type'},
						'BasCompanyFk':{'location': modName, 'identifier': 'header.CompanyCode', 'initial': 'Company Code'},
						'PrjProjectFk':{'location': modName, 'identifier': 'header.PrjProjectNo', 'initial': 'Project No.'},
						'DateReceived':{'location': modName, 'identifier': 'header.DateReceived', 'initial': 'Date Received'},
						'DateRequired':{'location': modName, 'identifier': 'header.DateRequired', 'initial': 'Date Required'},
						'DatePerformed':{'location': modName, 'identifier': 'header.DatePerformed', 'initial': 'Date Performed'},
						'BasClerkHsqFk':{'location': modName, 'identifier': 'header.BasClerkHsq', 'initial': 'Responsible'},
						'BasClerkChkFk':{'location': modName, 'identifier': 'header.BasClerkChk', 'initial': 'Checklist Owner'},
						'PrcStructureFk':{'location': modName, 'identifier': 'header.PrcStructure', 'initial': 'Procurement Structure'},
						'PesHeaderFk':{'location': modName, 'identifier': 'header.PesHeader', 'initial': 'PES'},
						'UserDefined1':{'location': modName, 'identifier': 'header.UserDefined1', 'initial': 'UserDefined1'},
						'UserDefined2':{'location': modName, 'identifier': 'header.UserDefined2', 'initial': 'UserDefined2'},
						'UserDefined3':{'location': modName, 'identifier': 'header.UserDefined3', 'initial': 'UserDefined3'},
						'UserDefined4':{'location': modName, 'identifier': 'header.UserDefined4', 'initial': 'UserDefined4'},
						'UserDefined5':{'location': modName, 'identifier': 'header.UserDefined5', 'initial': 'UserDefined5'},
						'HsqCheckListFk':{'location': modName, 'identifier': 'header.HsqCheckListFk', 'initial': 'Main Check List'},
						'EtmPlantFk':{'location': 'procurement.common', 'identifier': 'plantFk', 'initial': 'Plant'},
						'ConHeaderFk': {'location': modName, 'identifier': 'header.contractFk', 'initial': 'Contract'},
						'CheckListGroupFk':{'location': modName, 'identifier': 'header.entityCheckListGroup', 'initial': 'Template Group'},
						'BpdBusinesspartnerFk':{'location': modName, 'identifier': 'header.BpdBusinesspartnerFk', 'initial': 'Business Partner'},
						'BpdSubsidiaryFk':{'location': modName, 'identifier': 'header.BpdSubsidiaryFk', 'initial': 'Branch'},
						'BpdContactFk':{'location': modName, 'identifier': 'header.BpdContactFk', 'initial': 'Contact'}

					}
				},
				overloads:{
					'id': {
						'readonly': true
					},
					descriptioninfo: {
						detail: {
							maxLength: 252
						},
						grid: {
							maxLength: 252
						}
					},
					hsqchlstatusfk: {
						readonly: true,
						grid: {
							editor: '',
							editorOptions: null,
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'CheckListStatus',
								displayMember: 'DescriptionInfo.Translated',
								imageSelector: 'platformStatusIconService'
							}
						},
						detail: {
							type: 'directive',
							model: 'HsqChlStatusFk',
							directive: 'hsqe-check-list-status-combobox',
							options: {
								readOnly: true
							}
						}
					},
					hsqchklisttypefk: {
						grid: {
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'HsqeCheckListType',
								displayMember: 'DescriptionInfo.Translated'
							},
							editor: 'lookup',
							editorOptions: {
								directive: 'hsqe-check-list-type-combobox',
								lookupOptions: {
									'lookupType': 'HsqeCheckListType'
								}
							}
						},
						detail: {
							type: 'directive',
							model: 'HsqChkListTypeFk',
							directive: 'hsqe-check-list-type-combobox'
						}
					},
					prjprojectfk: {
						navigator: {
							moduleName: 'project.main'
						},
						grid: {
							editor: 'lookup',
							editorOptions: {
								directive: 'procurement-project-lookup-dialog',
								displayMember: 'ProjectName',
								lookupOptions: { showClearButton: false }
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'PrcProject',
								displayMember: 'ProjectNo'
							},
							width: 100
						},
						detail: {
							type: 'directive',
							directive: 'basics-lookupdata-lookup-composite',
							options: {
								lookupDirective: 'procurement-project-lookup-dialog',
								descriptionMember: 'ProjectName',
								lookupOptions: {
									showClearButton: false,
									lookupType: 'PrcProject'
								}
							}
						}
					},
					bascompanyfk: {
						readonly: true,
						grid: {
							editor: 'lookup',
							editorOptions: {
								directive: 'basics-company-company-lookup'
							},
							formatter: 'lookup',
							formatterOptions: {lookupType: 'Company', displayMember: 'Code'},
							width: 100
						},
						detail: {
							type: 'directive',
							directive: 'basics-lookupdata-lookup-composite',
							options: {
								lookupDirective: 'basics-company-company-lookup',
								descriptionMember: 'CompanyName'
							}
						}
					},
					hsqchecklisttemplatefk: {
						detail: {
							type: 'directive',
							model: 'HsqCheckListTemplateFk',
							directive: 'basics-lookupdata-lookup-composite',
							options: {
								lookupDirective: 'hsqe-check-list-template-dialog',
								descriptionMember: 'DescriptionInfo.Translated',
								lookupOptions: {
									showClearButton: true
								}
							}
						},
						grid: {
							editor: 'lookup',
							editorOptions: {
								lookupOptions: {
									showClearButton: true
								},
								directive: 'hsqe-check-list-template-dialog'
							},
							width: 150,
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'HsqeCheckListTemplate',
								displayMember: 'Code'
							}
						}
					},
					prcstructurefk: {
						detail: {
							type: 'directive',
							directive: 'basics-lookupdata-lookup-composite',
							options: {
								lookupDirective: 'basics-procurementstructure-structure-dialog',
								descriptionMember: 'DescriptionInfo.Translated',
								lookupOptions: {
									showClearButton: true
								}
							}
						},
						grid: {
							editor: 'lookup',
							editorOptions: {
								lookupOptions: {
									showClearButton: true,
									displayMember: 'Code'
								},
								directive: 'basics-procurementstructure-structure-dialog'
							},
							width: 150,
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'prcstructure',
								displayMember: 'Code'
							}
						}
					},
					basclerkhsqfk: {
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
					},
					basclerkchkfk: {
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
									displayMember: 'Code'
								}
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'Clerk',
								displayMember: 'Code'
							}
						}
					},
					pesheaderfk: {
						detail: {
							type: 'directive',
							directive: 'basics-lookupdata-lookup-composite',
							options: {
								lookupDirective: 'procurement-invoice-pes-lookup',
								descriptionMember: 'Description',
								lookupOptions: {
									showClearButton: true,
									filterKey: 'hsqe-checklist-pes-header-filter'
								}
							}
						},
						grid: {
							navigator: {
								moduleName: 'procurement.pes'
							},
							name$tr$: 'hsqe.checklist.header.PesHeader',
							editor: 'lookup',
							editorOptions: {
								directive: 'procurement-invoice-pes-lookup',
								lookupOptions: {
									showClearButton: true,
									filterKey: 'hsqe-checklist-pes-header-filter',
									displayMember: 'Code'
								}
							},
							width: 125,
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'InvoicePes',
								displayMember: 'Code',
								navigator: {
									moduleName: 'procurement.pes'
								}
							}
						}
					},
					hsqchecklistfk:{
						readonly: true,
						grid: {
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'CheckList',
								displayMember: 'Code'
							},
							editor: 'lookup',
							editorOptions: {
								directive: 'hsqe-checklist-header-lookup',
								lookupOptions: {
									'lookupType': 'CheckList'
								}
							}
						},
						detail: {
							type: 'directive',
							directive: 'basics-lookupdata-lookup-composite',
							options: {
								lookupDirective: 'hsqe-checklist-header-lookup',
								descriptionMember: 'DescriptionInfo.Translated'
							}
						},
					},
					'etmplantfk': platformLayoutHelperService.providePlantLookupOverload(),
					'conheaderfk': {
						// 'readonly': 'true',
						'navigator': {
							moduleName: 'procurement.contract',
							registerService: 'procurementContractHeaderDataService'
						},
						'grid': {
							editor: 'lookup',
							editorOptions: {
								directive: 'prc-con-header-dialog',
								lookupOptions: {
									showClearButton: true,
									filterKey: 'check-list-Contract-filter',
									title: {name: 'cloud.common.dialogTitleContract'}
								}
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'ConHeaderView',
								displayMember: 'Code'
							}
						},
						'detail': {
							'type': 'directive',
							'directive': 'basics-lookupdata-lookup-composite',
							'options': {
								'lookupDirective': 'prc-con-header-dialog',
								'descriptionMember': 'Description',
								lookupOptions: {
									showClearButton: true,
									filterKey: 'check-list-Contract-filter',
									title: {name: 'cloud.common.dialogTitleContract'}
								}
							},
							'change': 'formOptions.onPropertyChanged'
						}
					},
					'checklistgroupfk': {
						readonly: true,
						'grid': {
							'formatter': 'lookup',
							'formatterOptions': {
								'lookupType': 'HsqeCheckListGroup',
								'displayMember': 'Code'
							},
							'editor': 'lookup',
							'editorOptions': {
								lookupDirective: 'hsqe-check-list-group-combobox',
								lookupOptions: {
									displayMember: 'Code'
								}
							}
						},
						'detail': {
							'type': 'directive',
							'model': 'CheckListGroupFk',
							'directive': 'basics-lookupdata-lookup-composite',
							'options': {
								lookupDirective: 'hsqe-check-list-group-combobox',
								descriptionMember: 'DescriptionInfo.Translated',
								readOnly: true
							}
						}
					},

					'bpdbusinesspartnerfk': {
						'mandatory': true,
						'navigator': {
							moduleName: 'businesspartner.main'
						},
						'grid': {
							'editor': 'lookup',
							'editorOptions': {
								'lookupOptions': {
									'showClearButton': true,
									'IsShowBranch': true,
									'mainService':'hsqeCheckListDataService',
									'BusinessPartnerField':'BpdBusinesspartnerFk',
									'SubsidiaryField':'BpdSubsidiaryFk',
									'ContactField': 'BpdContactFk'
								}, 'directive': 'filter-business-partner-dialog-lookup'
							},
							'formatter': 'lookup',
							'formatterOptions': {
								'lookupType': 'BusinessPartner', 'displayMember': 'BusinessPartnerName1',
								'navigator': {
									'moduleName': 'businesspartner.main'
								}
							},
							'width': 120
						},
						'detail': {
							'type': 'directive',
							'directive': 'filter-business-partner-dialog-lookup',
							'options': {
								'showClearButton': true,
								'displayMember': 'BusinessPartnerName1',
								'IsShowBranch': true,
								'mainService':'hsqeCheckListDataService',
								'BusinessPartnerField':'BpdBusinesspartnerFk',
								'SubsidiaryField':'BpdSubsidiaryFk',
								'ContactField': 'BpdContactFk'
							}
						}
					},
					'bpdsubsidiaryfk': {
						'grid': {
							editor: 'lookup',
							editorOptions: {
								lookupOptions: {
									filterKey: 'check-list-Subsidiary-filter',
									'showClearButton': true
								}, 'directive': 'business-partner-main-subsidiary-lookup'
							},
							'formatter': 'lookup',
							'formatterOptions': {'lookupType': 'subsidiary', 'displayMember': 'AddressLine'},
							'width': 120
						},
						'detail': {
							type: 'directive',
							directive: 'business-partner-main-subsidiary-lookup',
							options: {
								filterKey: 'check-list-Subsidiary-filter',
								'showClearButton': true,
								'displayMember': 'AddressLine'
							}
						}
					},
					'bpdcontactfk': {
						'grid': {
							editor: 'lookup',
							editorOptions: {
								'directive': 'business-partner-main-contact-dialog',
								'lookupOptions': {'filterKey': 'check-list-Contact-filter', 'showClearButton': true}
							},
							formatter: 'lookup',
							formatterOptions: {'lookupType': 'Contact', 'displayMember': 'FullName'},
							width: 100
						},
						'detail': {
							type: 'directive',
							directive: 'business-partner-main-contact-dialog',
							options: {
								filterKey: 'check-list-Contact-filter', 'showClearButton': true
							}
						}
					}
				},

				addition:{
					grid:[
						{
							id: 'projectName',
							afterId: 'prjprojectfk',
							lookupDisplayColumn: true,
							field: 'PrjProjectFk',
							displayMember: 'ProjectName',
							name$tr$: 'cloud.common.entityProjectName',
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'PrcProject',
								displayMember: 'ProjectName'
							},
							width: 120
						},
						{
							lookupDisplayColumn: true,
							afterId: 'bascompanyfk',
							field: 'BasCompanyFk',
							name: 'Company Name',
							name$tr$: 'cloud.common.entityCompanyName',
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'company',
								displayMember: 'CompanyName'
							},
							width: 140
						},
						{
							lookupDisplayColumn: true,
							afterId: 'prcstructurefk',
							field: 'PrcStructureFk',
							name: 'Procurement Structure-Description',
							name$tr$: 'hsqe.checklist.header.PrcStructureDes',
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'prcstructure',
								displayMember: 'DescriptionInfo.Translated'
							},
							width: 140
						},
						{
							id:'pesHeaderDescription',
							afterId: 'pesheaderfk',
							lookupDisplayColumn: true,
							field: 'PesHeaderFk',
							name$tr$: 'procurement.invoice.header.pesHeaderDes',
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'InvoicePes',
								displayMember: 'Description'
							},
							width: 180
						},
						{
							lookupDisplayColumn: true,
							afterId: 'basclerkchkfk',
							field: 'BasClerkChkFk',
							name: 'Owner name',
							name$tr$: 'hsqe.checklist.header.BasClerkChkDescription',
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'Clerk',
								displayMember: 'Description'
							},
							width: 140
						},
						{
							id:'checklistDescription',
							afterId: 'hsqchecklistfk',
							lookupDisplayColumn: true,
							field: 'HsqCheckListFk',
							formatterOptions: {
								lookupType: 'CheckList',
								displayMember: 'DescriptionInfo.Translated'
							},
							name: 'Main Check List Description',
							name$tr$: 'hsqe.checklist.header.checklistDescription',
							width: 180
						},
						{
							'afterId': 'conheaderfk',
							'id': 'ConHeaderDescription',
							'field': 'ConHeaderFk',
							'name': 'Contract Description',
							'name$tr$': 'hsqe.checklist.header.entityConHeaderDescription',
							sortable: true,
							'formatter': 'lookup',
							'formatterOptions': {
								lookupType: 'conheaderview',
								displayMember: 'Description'
							},
							'width': 140
						},
						{
							id: 'groupDescription',
							afterId: 'checklistgroupfk',
							lookupDisplayColumn: true,
							field: 'CheckListGroupFk',
							name$tr$: 'hsqe.checklist.header.entityCheckListGroupDesc',
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'HsqeCheckListGroup',
								displayMember: 'DescriptionInfo.Translated'
							}
						}
					]
				}
			};
		}
	]);
	/**
	 * @ngdoc service
	 * @name hsqeCheckListUIStandardService
	 * @function
	 *
	 * @description
	 * The UI configuration service for the module.
	 */
	angular.module(modName).factory('hsqeCheckListUIStandardService', ['platformUIStandardConfigService', 'hsqeCheckListTranslationService', 'hsqeCheckListLayout', 'platformSchemaService', 'platformUIStandardExtentService',
		function (platformUIStandardConfigService, translationService, layout, platformSchemaService, platformUIStandardExtentService) {
			var BaseService = platformUIStandardConfigService;

			var domainSchema = platformSchemaService.getSchemaFromCache({
				typeName: 'HsqCheckListDto',
				moduleSubModule: 'Hsqe.CheckList'
			});
			if (domainSchema) {
				domainSchema = domainSchema.properties;
			}
			function UIStandardService(layout, scheme, translateService) {
				BaseService.call(this, layout, scheme, translateService);
			}

			UIStandardService.prototype = Object.create(BaseService.prototype);
			UIStandardService.prototype.constructor = UIStandardService;

			var service = new BaseService(layout, domainSchema, translationService);

			platformUIStandardExtentService.extend(service, layout.addition, domainSchema);

			return service;
		}
	]);
})(angular);
