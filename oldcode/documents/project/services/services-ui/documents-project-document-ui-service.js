(function (angular) {
	'use strict';
	var modName = 'documents.project';
	var cloudCommomModule = 'cloud.common';
	// todo: check use constant, and we don't need to copy the layout. lja
	angular.module(modName)
		.factory('documentProjectLayout',
			['$injector','_', 'basicsLookupdataConfigGenerator', 'logisticCommonLayoutOverloadService', 'documentsProjectDocumentDataService', 'documentsProjectDocumentModuleContext',
				function ($injector,_, basicsLookupdataConfigGenerator, logisticCommonLayoutOverloadService, documentsProjectDocumentDataService, documentsProjectDocumentModuleContext) {
					return {

						'fid': 'documents.project.header',
						'version': '1.0.0',
						'addValidationAutomatically': true,
						'showGrouping': true,
						'groups': [
							{
								'gid': 'basicData',
								'attributes': ['id', 'documenttype', 'prjdocumentstatusfk', 'prjdocumentcategoryfk', 'rubriccategoryfk', 'documenttypefk', 'prjdocumenttypefk',
									'barcode', 'description', 'commenttext', 'revision', 'originfilename', 'prjprojectfk', 'mdccontrollingunitfk', 'bpdcontactfk', 'bpdsubsidiaryfk',
									'prjlocationfk', 'bpdbusinesspartnerfk', 'bpdcertificatefk', 'prcstructurefk', 'mdcmaterialcatalogfk',
									'prcpackagefk', 'rfqheaderfk', 'qtnheaderfk', 'conheaderfk', 'pesheaderfk', 'invheaderfk', 'psdschedulefk',
									'psdactivityfk', 'estheaderfk', 'reqheaderfk', 'modelfk', 'url', 'hasdocumentrevision', 'documentdate', 'expirationdate',
									'lgmjobfk', 'lgmdispatchheaderfk', 'lgmsettlementfk', 'qtoheaderfk', 'projectinforequestfk', 'prjchangefk', 'bilheaderfk', 'wipheaderfk', 'bidheaderfk', 'ordheaderfk',
									'userdefined1', 'userdefined2', 'userdefined3', 'userdefined4', 'userdefined5', 'code','filesize'
								]
							},
							{
								'gid': 'entityHistory',
								'isHistory': true
							}
						],
						'translationInfos': {
							'extraModules': [modName, 'procurement.pes', 'procurement.invoice', 'procurement.quote', 'procurement.contract',
								'cloud.common', 'estimate.main', 'boq.wic', 'estimate.main', 'project.main', 'basics.material', 'documents.centralquery', 'basics.common'],
							'extraWords': {
								Id: {
									location: modName,
									identifier: 'entityId',
									initial: 'Document ID'
								},
								DocumentType: {
									location: modName,
									identifier: 'entityDocumentType',
									initial: 'Link Flag'
								},
								PrjDocumentStatusFk: {
									location: modName,
									identifier: 'entityPrjDocumentStatus',
									initial: 'Status'
								},
								PrjDocumentCategoryFk: {
									location: modName,
									identifier: 'entityPrjDocumentCategory',
									initial: 'Document Category'
								},
								PrjDocumentTypeFk: {
									location: modName,
									identifier: 'entityPrjDocumentType',
									initial: 'Document Type'
								},
								Barcode: {
									location: modName,
									identifier: 'entityBarcode',
									initial: 'Bar Code'
								},
								FileSize: {
									location: modName,
									identifier: 'entityFileSize',
									initial: 'File Size'
								},
								Description: {
									location: 'cloud.common',
									identifier: 'entityDescription',
									initial: 'Description'
								},
								// CommentText:
								CommentText: {
									location: modName, identifier: 'entityCommentText', initial: 'Comment'
								},
								Revision: {
									location: modName,
									identifier: 'Revisions.Revision',
									initial: 'Revision'
								},
								OriginFileName: {
									location: modName,
									identifier: 'entityFileArchiveDoc',
									initial: 'Origin File Name'
								},
								PrjProjectFk: {
									location: 'cloud.common',
									identifier: 'entityProjectNo',
									initial: 'Project No.'
								},
								// MdcControllingUnitFk:
								MdcControllingUnitFk: {
									location: modName,
									identifier: 'entityMDCControllingUnit',
									initial: 'Controlling Unit'
								},
								RubricCategoryFk: {
									location: modName,
									identifier: 'entityRubricCategory',
									initial: 'Rubric Category'
								},
								// PrjLocationFk:
								PrjLocationFk: {
									location: modName, identifier: 'entityLocation', initial: 'Location'
								},
								BpdBusinessPartnerFk: {
									location: modName,
									identifier: 'entityBpdBusinessPartner',
									initial: 'Business Partner'
								},
								BpdCertificateFk: {
									location: modName,
									identifier: 'entityBpdCertificate',
									initial: 'Certificate'
								},
								// PrcStructureFk:
								PrcStructureFk: {
									location: modName, identifier: 'entityStructure', initial: 'Structure'
								},
								// MdcMaterialCatalogFk:
								MdcMaterialCatalogFk: {
									location: modName,
									identifier: 'entityMaterialCatalog',
									initial: 'Material Catalog'
								},
								// PrcPackageFk:
								PrcPackageFk: {
									location: modName, identifier: 'entityPackage', initial: 'Package'
								},
								// RfqHeaderFk:
								RfqHeaderFk: {
									location: modName,
									identifier: 'entityRfqHeaderCode',
									initial: 'RFQ'
								},
								QtnHeaderFk: {
									location: modName,
									identifier: 'entityQtnHeader',
									initial: 'Quote'
								},
								// ConHeaderFk:
								ConHeaderFk: {
									location: modName,
									identifier: 'entityContractCode',
									initial: 'Contract'
								},
								// PesHeaderFk:
								PesHeaderFk: {
									location: 'procurement.invoice', identifier: 'entityPES', initial: 'PES No.'
								},
								InvHeaderFk: {
									location: modName,
									identifier: 'entityInvHeader',
									initial: 'Invoice'
								},
								PsdScheduleFk: {
									location: modName,
									identifier: 'entityPsdSchedule',
									initial: 'Schedule'
								},
								PsdActivityFk: {
									location: modName,
									identifier: 'entityPsdActivity',
									initial: 'Schedule Activity'
								},
								// EstHeaderFk:
								EstHeaderFk: {
									location: modName, identifier: 'entityEstHeader', initial: 'Estimate'
								},
								ReqHeaderFk: {
									location: modName,
									identifier: 'entityReferenceCode',
									initial: 'REQ'
								},
								// ModelFk:
								ModelFk: {
									location: modName, identifier: 'entityModel', initial: 'Model'
								},
								// DocumentTypeFk:
								DocumentTypeFk: {
									location: 'cloud.common', identifier: 'entityDocumentType', initial: 'Document Type'
								},
								PrjDocumentFk: {
									location: modName, identifier: 'entityReferencedDocument', initial: 'Reference ID'
								},
								'HasDocumentRevision': {
									location: modName, identifier: 'entityHasDocumentRevision', initial: 'Empty Record'
								},
								FileArchiveDocFk: {
									location: modName, identifier: 'entityFileArchiveDocID', initial: 'File Archive Doc ID'
								},
								Url: {
									location: modName, identifier: 'entityUrl', initial: 'Url'
								},
								DocumentDate: {
									location: modName, identifier: 'entityDocumentDate', initial: 'Document Date'
								},
								ExpirationDate: {
									location: modName, identifier: 'entityExpirationDate', initial: 'Expiration Date'
								},
								// LgmJobFk:
								LgmJobFk: {
									location: modName,
									identifier: 'entityLgmJob',
									initial: 'Job'
								},
								// LgmDispatchHeaderFk:
								LgmDispatchHeaderFk: {
									location: modName,
									identifier: 'entityLgmDispatchHeader',
									initial: 'Dispatch Header'
								},
								// LgmSettlementFk:
								LgmSettlementFk: {
									location: modName,
									identifier: 'entityLgmSettlement',
									initial: 'Settlement'
								},
								Code: {
									location: modName,
									identifier: 'entityCode',
									initial: 'Code'
								},
								UserDefined1: {
									location: cloudCommomModule, identifier: 'entityUserDefined', initial: 'User Defined 1', param: {'p_0': '1'}
								},
								UserDefined2: {
									location: cloudCommomModule, identifier: 'entityUserDefined', initial: 'User Defined 2', param: {'p_0': '2'}
								},
								UserDefined3: {
									location: cloudCommomModule, identifier: 'entityUserDefined', initial: 'User Defined 3', param: {'p_0': '3'}
								},
								UserDefined4: {
									location: cloudCommomModule, identifier: 'entityUserDefined', initial: 'User Defined 4', param: {'p_0': '4'}
								},
								UserDefined5: {
									location: cloudCommomModule, identifier: 'entityUserDefined', initial: 'User Defined 5', param: {'p_0': '5'}
								},
								QtoHeaderFk: {
									location: modName,
									identifier: 'entityQtoHeader',
									initial: 'QTO'
								},
								ProjectInfoRequestFk: {
									location: modName,
									identifier: 'entityInfoRequest',
									initial: 'RFI'
								},
								PrjChangeFk: {
									location: modName,
									identifier: 'entityPrjChange',
									initial: 'Project Change'
								},
								BilHeaderFk: {
									location: modName,
									identifier: 'entityBilHeaderFk',
									initial: 'Billing'
								},
								WipHeaderFk: {
									location: modName,
									identifier: 'entityWipHeaderFk',
									initial: 'Wip'
								},
								BidHeaderFk: {
									location: modName,
									identifier: 'entityBidHeaderFk',
									initial: 'Billing'
								},
								OrdHeaderFk: {
									location: modName,
									identifier: 'entityOrdHeaderFk',
									initial: 'Wip'
								},
								BpdContactFk: {
									'location': 'procurement.contract',
									'identifier': 'ConHeaderContact',
									'initial': 'Contact'
								},
								BpdSubsidiaryFk: {
									'location': 'procurement.contract',
									'identifier': 'entitySubsidiary',
									'initial': 'Branch'
								}
							}
						},
						'overloads': {
							'id': {
								readonly: true
							},
							'revision': {
								'readonly': 'true'
							},
							'filesize': {
								'readonly': 'true'
							},
							'reqheaderfk': {
								// 'readonly': 'true',
								navigator: {
									moduleName: 'procurement.requisition',
									registerService: 'procurementRequisitionHeaderDataService'
								},
								'detail': {
									'type': 'directive',
									'directive': 'basics-lookupdata-lookup-composite',
									'options': {
										'lookupOptions': {
											'showClearButton': true,
											filterKey: 'document-project-document-common-filter'
										},
										lookupDirective: 'procurement-common-req-header-lookup-view-dialog',
										descriptionMember: 'Description'
									}
								},
								'grid': {
									'editor': 'lookup',
									'editorOptions': {
										'directive': 'procurement-common-req-header-lookup-view-dialog',
										'lookupOptions': {
											'showClearButton': true,
											filterKey: 'document-project-document-common-filter'
										}
									},
									formatter: 'lookup',
									formatterOptions: {
										lookupType: 'ReqHeaderLookupView',
										displayMember: 'Code'
									}
								}
							},
							'documenttype': {
								'readonly': 'true',
								'formatter': function (row, cell, value, columnDef, dataContext) {
									var DocumentTypeFk = dataContext.DocumentTypeFk;
									// dataContext.icon=DocumentTypeFk;
									var imageClass = 'block-image';
									if (1000 === DocumentTypeFk) {
										imageClass = imageClass + ' control-icons ico-link-document';
									} else {
										imageClass = imageClass + ' control-icons ico-doc';
									}
									return '<i class="' + imageClass + '">' + '</i>';
								}
							},
							'originfilename': {
								'readonly': 'true',
								'grid': {
									'editor': 'directive',
									'editorOptions': {
										directive: 'documents-project-file-handler-input'

									},
									'width': 200
								},
								'detail': {
									'type': 'directive',
									'directive': 'documents-project-file-handler-input',
									'options': {}
								}
							},
							'prcpackagefk': {
								// 'readonly': 'true',
								'grid': {
									'editor': 'lookup',
									'editorOptions': {
										'directive': 'procurement-common-package-lookup',
										'lookupOptions': {
											'showClearButton': true,
											filterKey: 'document-project-document-common-filter'
										}
									},
									'formatter': 'lookup',
									'formatterOptions': {'lookupType': 'PrcPackage', 'displayMember': 'Code'},
									navigator: {
										moduleName: 'procurement.package',
										registerService: 'procurementPackageDataService'
									}
								},
								'detail': {
									'type': 'directive',
									'directive': 'basics-lookupdata-lookup-composite',
									'options': {
										'lookupDirective': 'procurement-common-package-lookup',
										'descriptionMember': 'Description',
										'lookupOptions': {
											'showClearButton': true,
											filterKey: 'document-project-document-common-filter'
										}
									}
								}
							},
							'prjprojectfk': {
								// 'readonly': 'true',
								'grid': {
									'editor': 'lookup',
									'editorOptions': {
										'directive': 'procurement-project-lookup-dialog',
										'lookupOptions': {
											'showClearButton': true,
											'lookupKey': 'prc-req-header-project'
											// filterKey: ''
										}
									},
									'formatter': 'lookup',
									'formatterOptions': {
										'lookupType': 'PrcProject',
										'displayMember': 'ProjectNo'
									}
								},
								'detail': {
									'type': 'directive',
									'directive': 'basics-lookupdata-lookup-composite',
									'options': {
										'lookupDirective': 'procurement-project-lookup-dialog',
										'descriptionMember': 'ProjectName',
										'lookupOptions': {
											'showClearButton': true,
											'initValueField': 'ProjectNo',
											'lookupKey': 'prc-req-header-project-property'
											// 'filterKey': 'procurement-package-header-project-filter'
										}
									}
								}
							},
							'prcstructurefk': {
								// 'readonly': 'true',
								'grid': {
									editor: 'lookup',
									editorOptions: {
										directive: 'basics-procurementstructure-structure-dialog',
										'lookupOptions': {
											'showClearButton': true
										}
									},
									width: 125,
									formatter: 'lookup',
									'formatterOptions': {
										'lookupType': 'prcstructure',
										'displayMember': 'Code'
									},
									navigator: {
										moduleName: 'basics.procurementstructure'
									}
								},
								'detail': {
									'type': 'directive',
									'directive': 'basics-lookupdata-lookup-composite',
									'options': {
										'lookupDirective': 'basics-procurementstructure-structure-dialog',
										'descriptionField': 'StructureDescription',
										'descriptionMember': 'DescriptionInfo.Translated',
										'lookupOptions': {
											'initValueField': 'StructureCode',
											'showClearButton': true
										}
									}
								}
							},
							'mdccontrollingunitfk': {
								// 'readonly': 'true',
								'detail': {
									'type': 'directive',
									'directive': 'basics-lookupdata-lookup-composite',
									'options': {
										'lookupOptions': {
											'showClearButton': true,
											filterKey: 'document-project-document-controlling-filter'
										},
										lookupDirective: 'basics-master-data-context-controlling-unit-lookup',
										'descriptionMember': 'DescriptionInfo.Translated'
									}
								},
								'grid': {
									editorOptions: {
										editor: 'lookup',
										directive: 'basics-master-data-context-controlling-unit-lookup',
										'lookupOptions': {
											'showClearButton': true,
											filterKey: 'document-project-document-controlling-filter'
										}
									},
									formatter: 'lookup',
									formatterOptions: {
										lookupType: 'Controllingunit',
										displayMember: 'Code'
									}
								}
							},
							'pesheaderfk': {
								'detail': {
									'type': 'directive',
									'directive': 'basics-lookupdata-lookup-composite',
									'options': {
										'lookupDirective': 'procurement-invoice-pes-lookup',
										'descriptionMember': 'Description',
										'lookupOptions': {
											'showClearButton': true,
											filterKey: 'document-project-document-common-filter'
										}
									}
								},
								'grid': {
									navigator: {
										moduleName: 'procurement.pes'
									},
									editor: 'lookup',
									editorOptions: {
										directive: 'procurement-invoice-pes-lookup',
										'lookupOptions': {
											'showClearButton': true,
											filterKey: 'document-project-document-common-filter'
										}
									},
									width: 125,
									formatter: 'lookup',
									formatterOptions: {
										lookupType: 'InvoicePes',
										displayMember: 'Code'
									}
								},
								'mandatory': true
							},
							'invheaderfk': {
								'detail': {
									'type': 'directive',
									'directive': 'basics-lookupdata-lookup-composite',
									'options': {
										'lookupDirective': 'procurement-invoice-header-dialog',
										'descriptionMember': 'Reference',
										'lookupOptions': {
											'showClearButton': true,
											filterKey: 'document-project-document-common-filter'
										}
									}
								},
								'grid': {
									navigator: {
										moduleName: 'procurement.invoice',
										registerService: 'procurementInvoiceHeaderDataService'
									},
									editor: 'lookup',
									editorOptions: {
										directive: 'procurement-invoice-header-dialog',
										'lookupOptions': {
											'showClearButton': true,
											filterKey: 'document-project-document-common-filter'
										}
									},
									width: 125,
									formatter: 'lookup',
									formatterOptions: {
										lookupType: 'InvHeaderChained',
										displayMember: 'Code'
									}
								},
								'mandatory': true
							},
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
											filterKey: 'document-project-document-Contract-filter',
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
											filterKey: 'document-project-document-Contract-filter',
											title: {name: 'cloud.common.dialogTitleContract'}
										}
									},
									'change': 'formOptions.onPropertyChanged'
								}
							},
							'rfqheaderfk': {
								// 'readonly': 'true',
								'navigator': {
									moduleName: 'procurement.rfq',
									registerService: 'procurementRfqMainService'
								},
								'detail': {
									'type': 'directive',
									'directive': 'basics-lookupdata-lookup-composite',
									'options': {
										lookupDirective: 'procurement-rfq-header-dialog',
										descriptionMember: 'Description',
										lookupOptions: {
											showClearButton: true,
											filterKey: 'document-project-document-common-filter'
										}
									}
								},
								'grid': {
									editor: 'lookup',
									editorOptions: {
										directive: 'procurement-rfq-header-dialog',
										lookupOptions: {
											'showClearButton': true,
											filterKey: 'document-project-document-common-filter'
										}
									},
									formatter: 'lookup',
									formatterOptions: {
										lookupType: 'RfqHeader',
										displayMember: 'Code'
									},
									width: 120
								}
							},
							'bpdcertificatefk': {
								// 'readonly': 'true',
								'grid': {
									editor: 'lookup',
									editorOptions: {
										directive: 'businesspartner-certificate-combobox',
										lookupOptions: {
											showClearButton: true,
											filterKey: 'document-project-document-common-filter'
										}
									},
									formatter: 'lookup',
									formatterOptions: {
										lookupType: 'Certificate',
										displayMember: 'Code'
									}
								},
								'detail': {
									'type': 'directive',
									'directive': 'basics-lookupdata-lookup-composite',
									'options': {
										'lookupDirective': 'businesspartner-certificate-combobox',
										'descriptionMember': 'Reference',
										'lookupOptions': {
											'showClearButton': true,
											filterKey: 'document-project-document-common-filter'
										}
									}
								}
							},
							'mdcmaterialcatalogfk': {
								navigator: {
									moduleName: 'basics.materialcatalog'
								},
								'grid': {
									'editor': 'lookup',
									'editorOptions': {
										'directive': 'basics-material-material-catalog-lookup',
										'lookupOptions': {
											'showClearButton': true
										}
									},
									'formatter': 'lookup',
									'formatterOptions': {'lookupType': 'MaterialCatalog', 'displayMember': 'Code'},
									'width': 150
								},
								'detail': {
									'type': 'directive',
									'directive': 'basics-lookupdata-lookup-composite',
									'options': {
										'lookupDirective': 'basics-material-material-catalog-lookup',
										'descriptionMember': 'DescriptionInfo.Translated',
										'lookupOptions': {
											'showClearButton': true
										}
									}
								}
							},
							'qtnheaderfk': {
								// 'readonly': 'true',
								navigator: {
									moduleName: 'procurement.quote',
									registerService: 'procurementQuoteHeaderDataService'
								},
								'grid': {
									'editor': 'lookup',
									'editorOptions': {
										'directive': 'procurement-quote-header-lookup',
										'lookupOptions': {
											'showClearButton': true,
											filterKey: 'document-project-document-common-filter'
										}
									},
									'formatter': 'lookup',
									'formatterOptions': {'lookupType': 'Quote', 'displayMember': 'Code'}
								},
								// 'detail': {
								// 'type': 'directive',
								// 'directive': 'procurement-quote-header-lookup',
								// 'options': {}
								// }
								'detail': {
									'type': 'directive',
									'directive': 'basics-lookupdata-lookup-composite',
									'options': {
										'lookupDirective': 'procurement-quote-header-lookup',
										'descriptionMember': 'Description',
										'lookupOptions': {
											'showClearButton': true,
											filterKey: 'document-project-document-common-filter'
										}
									}
								}
							},
							'psdactivityfk': {
								// 'readonly': 'true',
								'grid': {
									'editor': 'lookup',
									'editorOptions': {
										'directive': 'scheduling-main-activity-structure-lookup',
										'lookupOptions': {
											'showClearButton': true,
											filterKey: 'document-project-document-psdactivity-filter'
										}
									},
									'formatter': 'lookup',
									'formatterOptions': {
										'lookupType': 'SchedulingActivity',
										'displayMember': 'Code'
									}
								},
								'detail': {
									'type': 'directive',
									'directive': 'basics-lookupdata-lookup-composite',
									'options': {
										'lookupDirective': 'scheduling-main-activity-structure-lookup',
										'descriptionMember': 'Description',
										'lookupOptions': {
											'showClearButton': true,
											filterKey: 'document-project-document-psdactivity-filter'
										}
									}
								}
							},

							'bpdbusinesspartnerfk': {
								// 'readonly': 'true',
								navigator: {
									moduleName: 'businesspartner.main'
								},
								'detail': {
									'type': 'directive',
									// 'directive': 'business-partner-main-business-partner-dialog',
									'directive': 'filter-business-partner-dialog-lookup',
									'options': {
										lookupOptions: {
											showClearButton: true,
											'IsShowBranch': true,
											'mainService': 'documentsProjectDocumentDataService',
											'BusinessPartnerField': 'BpdBusinessPartnerFk',
											'SubsidiaryField': 'BpdSubsidiaryFk'
										}
									}
								},
								'grid': {
									editor: 'lookup',
									editorOptions: {
										// 'directive': 'business-partner-main-business-partner-dialog',
										'directive': 'filter-business-partner-dialog-lookup',
										lookupOptions: {
											showClearButton: true,
											'IsShowBranch': true,
											'mainService': 'documentsProjectDocumentDataService',
											'BusinessPartnerField': 'BpdBusinessPartnerFk',
											'SubsidiaryField': 'BpdSubsidiaryFk'
										}
									},
									formatter: 'lookup',
									formatterOptions: {
										lookupType: 'BusinessPartner',
										displayMember: 'BusinessPartnerName1'
									}
								}
							},
							// rubriccategoryfk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.lookup.rubriccategory', null, {
							// 	field: 'RubricFk',
							// 	filterKey: 'documents-project-rubriccategory-by-rubric-filter',
							// 	customIntegerProperty: 'BAS_RUBRIC_FK'
							// }),
							'rubriccategoryfk': {
								'detail': {
									'type': 'directive',
									'directive': 'basics-lookupdata-rubric-category-by-rubric-and-company-lookup',
									'options': {
										filterKey: 'documents-project-rubric-category-by-rubric-filter'
									}
								},
								'grid': {
									formatter: 'lookup',
									formatterOptions: {
										lookupType: 'RubricCategoryByRubricAndCompany',
										displayMember: 'Description',
										version: 3
									},
									editor: 'lookup',
									editorOptions: {
										directive: 'basics-lookupdata-rubric-category-by-rubric-and-company-lookup',
										lookupOptions: {
											filterKey: 'documents-project-rubric-category-by-rubric-filter'
										}
									}
								}
							},

							'hasdocumentrevision': {
								readonly: true,
								width: 120,
								'detail': {
									'type': 'directive',
									'directive': 'documents-project-has-document-revision-combobox',
									'options': {
										displayMember: 'Description',
										valueMember: 'Id'
									}
								},
								'grid': {
									formatter: 'lookup',
									formatterOptions: {
										lookupType: 'documentsProjectHasDocumentRevisionLookup',
										displayMember: 'Description',
										valueMember: 'Id'
									}
								}
							},

							'filearchivedocfk': {
								'readonly': 'true',
								'detail': {
									'type': 'directive',
									'directive': 'business-partner-main-business-partner-dialog-without-teams',
									'options': {
										lookupOptions: {
											showClearButton: true
										}
									}
								},
								'grid': {
									editor: 'lookup',
									editorOptions: {
										directive: 'business-partner-main-business-partner-dialog-without-teams',
										lookupOptions: {
											showClearButton: true
										}
									},
									formatter: 'lookup',
									formatterOptions: {
										lookupType: 'BusinessPartner',
										displayMember: 'BusinessPartnerName1'
									}
								}
							},
							'url': {
								'maxLength': 2000,
								grid: {
									editor: 'url',
									formatter: 'url',
									formatterOptions: {
										dataServiceName: documentsProjectDocumentDataService.getService(documentsProjectDocumentModuleContext.getConfig())
									},
									bulkSupport: false
								}
							},
							estheaderfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
								dataServiceName: 'estimateMainHeaderLookupDataService',
								enableCache: true,
								filter: function (item) {
									if (item) {
										return item.PrjProjectFk ? item.PrjProjectFk : 0;
									}
									return 0;
								}
							}),

							'prjlocationfk': basicsLookupdataConfigGenerator.provideTreeDataServiceLookupConfig({
								moduleQualifier: 'estProjectLocationLookupDataService',
								dataServiceName: 'projectLocationLookupDataService',
								valMember: 'Id',
								dispMember: 'Code',
								isComposite: true,
								showClearButton: true,
								filter: function (item) {
									if (item) {
										return item.PrjProjectFk ? item.PrjProjectFk : 0;
									}
									return 0;
								}
							}),
							psdschedulefk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
								moduleQualifier: 'schedulingLookupScheduleDataService',
								dataServiceName: 'schedulingLookupScheduleDataService',
								showClearButton: true,
								isComposite: true,
								desMember: 'DescriptionInfo.Translated',
								dispMember: 'Code',
								filter: function (item) {
									if (item) {
										return item.PrjProjectFk ? item.PrjProjectFk : 0;
									}
									return 0;
								}
							}),

							prjdocumentstatusfk: basicsLookupdataConfigGenerator.provideReadOnlyConfig('documents.project.documentstatus', null, {
								customIntegerProperty: 'BAS_RUBRIC_CATEGORY_FK',
								field: 'RubricCategoryFk',
								showIcon: true
							}),
							'prjdocumenttypefk':{
								'detail': {
									'type': 'directive',
									'directive': 'basics-lookupdata-lookup-composite',
									'options': {
										lookupDirective: 'project-document-type-lookup-service',
										lookupOptions: {
											filterKey: 'prj-document-project-type-filter'
										}
									}
								},
								'grid': {
									formatter: 'lookup',
									formatterOptions: {
										lookupType: 'ProjectDocumentTypeLookup',
										displayMember: 'DescriptionInfo.Translated',
									},
									editor: 'lookup',
									editorOptions: {
										directive: 'project-document-type-lookup-service',
										lookupOptions: {
											filterKey: 'prj-document-project-type-filter'
										}
									}
								}
							},

							'documenttypefk': {
								'detail': {
									'type': 'directive',
									'directive': 'basics-lookupdata-table-document-type-combobox',
									'options': {
										lookupOptions: {
											filterKey: 'basics-document-project-type-filter'
										}
									}
								},
								'grid': {
									formatter: 'lookup',
									formatterOptions: {
										lookupType: 'DocumentType',
										displayMember: 'Description',
									},
									editor: 'lookup',
									editorOptions: {
										directive: 'basics-lookupdata-table-document-type-combobox',
										lookupOptions: {
											filterKey: 'basics-document-project-type-filter'
										}
									}
								}
							},
							'prjdocumentcategoryfk': basicsLookupdataConfigGenerator.provideGenericLookupConfig('documents.project.documentCategory', null, {
								field: 'RubricCategoryFk',
								filterKey: 'basics-document-category-type-filter',
								customIntegerProperty: 'BAS_RUBRIC_CATEGORY_FK'
							}),
							'modelfk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
								dataServiceName: 'modelProjectModelLookupDataService',
								enableCache: true,
								filter: function (item) {
									function getProjectId(item) {
										var prjId = -1;
										if (item) {
											var modelProjectModelReadonlyDataServices = $injector.get('modelProjectModelReadonlyDataService');
											var items = modelProjectModelReadonlyDataServices.getList();
											var model = _.find(items, {Id: item.ModelFk});
											if (model) {
												prjId = model.ProjectFk;
											}
										}
										return prjId;
									}

									return getProjectId(item);
								},
								readonly: true
							}),
							lgmjobfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
								dataServiceName: 'logisticJobLookupByProjectDocumentService',
								moduleQualifier: 'logisticJob', // LookupType
								cacheEnable: true,
								additionalColumns: false,
								filter: function (item) {
									return item.PrjProjectFk;
								}
							}),
							lgmdispatchheaderfk: logisticCommonLayoutOverloadService.getDispatchHeaderLookupOverload('LgmDispatchHeaderFk', true),
							lgmsettlementfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
								dataServiceName: 'logisticSettlementLookupByProjectDocumentService',
								enableCache: true,
								filter: function (item) {
									return item.PrjProjectFk;
								},
								additionalColumns: true
							}),
							'qtoheaderfk': {
								'detail': {
									'type': 'directive',
									'directive': 'basics-lookupdata-lookup-composite',
									'options': {
										lookupDirective: 'qto-header-dialog',
										descriptionMember: 'Description',
										lookupOptions: {
											showClearButton: true,
											filterKey: 'document-project-document-common-filter'
										}
									}
								},
								'grid': {
									editor: 'lookup',
									editorOptions: {
										directive: 'qto-header-dialog',
										lookupOptions: {
											'showClearButton': true,
											filterKey: 'document-project-document-common-filter'
										}
									},
									formatter: 'lookup',
									formatterOptions: {
										lookupType: 'QtoHeader',
										displayMember: 'Code'
									},
									width: 130
								}
							},

							'projectinforequestfk': {
								'detail': {
									'type': 'directive',
									'directive': 'basics-lookupdata-lookup-composite',
									'options': {
										lookupDirective: 'project-info-request-dialog',
										descriptionMember: 'Description',
										lookupOptions: {
											showClearButton: true,
											filterKey: 'document-project-document-common-filter'
										}
									}
								},
								'grid': {
									editor: 'lookup',
									editorOptions: {
										directive: 'project-info-request-dialog',
										lookupOptions: {
											'showClearButton': true,
											filterKey: 'document-project-document-common-filter'
										}
									},
									formatter: 'lookup',
									formatterOptions: {
										lookupType: 'ProjectInfoRequest',
										displayMember: 'Code'
									},
									width: 130
								}
							},
							'prjchangefk': {
								'detail': {
									'type': 'directive',
									'directive': 'basics-lookupdata-lookup-composite',
									'options': {
										lookupDirective: 'project-change-dialog',
										descriptionMember: 'Description',
										lookupOptions: {
											showClearButton: true,
											filterKey: 'document-project-document-common-filter',
											showAddButton: false
										}
									}
								},
								'grid': {
									editor: 'lookup',
									editorOptions: {
										directive: 'project-change-dialog',
										lookupOptions: {
											'showClearButton': true,
											filterKey: 'document-project-document-common-filter',
											showAddButton: false
										}
									},
									formatter: 'lookup',
									formatterOptions: {
										lookupType: 'projectchange',
										displayMember: 'Code'
									},
									width: 130
								}
							},
							'bilheaderfk': {
								// 'readonly': 'true',
								'grid': {
									editor: 'lookup',
									editorOptions: {
										directive: 'sales-common-bill-dialog',
										'lookupOptions': {
											'showClearButton': true,
											filterKey: 'document-project-sales-filter'
										}
									},
									width: 125,
									formatter: 'lookup',
									'formatterOptions': {
										'lookupType': 'SalesBilling',
										'displayMember': 'BillNo'
									}
								},
								'detail': {
									'type': 'directive',
									'directive': 'basics-lookupdata-lookup-composite',
									'options': {
										'lookupDirective': 'sales-common-bill-dialog',
										'descriptionMember': 'DescriptionInfo.Translated',
										'lookupOptions': {
											filterKey: 'document-project-sales-filter',
											'showClearButton': true
										}
									}
								}
							},
							'wipheaderfk': {
								// 'readonly': 'true',
								'grid': {
									editor: 'lookup',
									editorOptions: {
										directive: 'sales-common-wip-dialog',
										'lookupOptions': {
											'showClearButton': true,
											filterKey: 'document-project-sales-filter'
										}
									},
									width: 125,
									formatter: 'lookup',
									'formatterOptions': {
										'lookupType': 'SalesWip',
										'displayMember': 'Code'
									}
								},
								'detail': {
									'type': 'directive',
									'directive': 'basics-lookupdata-lookup-composite',
									'options': {
										'lookupDirective': 'sales-common-wip-dialog',
										'descriptionMember': 'DescriptionInfo.Translated',
										'lookupOptions': {
											'showClearButton': true,
											filterKey: 'document-project-sales-filter'
										}
									}
								}
							},
							'bidheaderfk': {
								// 'readonly': 'true',
								'grid': {
									editor: 'lookup',
									editorOptions: {
										directive: 'sales-bid-bid-dialog',
										'lookupOptions': {
											'showClearButton': true,
											filterKey: 'document-project-sales-filter'
										}
									},
									width: 125,
									formatter: 'lookup',
									'formatterOptions': {
										'lookupType': 'SalesBid',
										'displayMember': 'Code'
									}
								},
								'detail': {
									'type': 'directive',
									'directive': 'basics-lookupdata-lookup-composite',
									'options': {
										'lookupDirective': 'sales-bid-bid-dialog',
										'descriptionMember': 'DescriptionInfo.Translated',
										'lookupOptions': {
											'showClearButton': true,
											filterKey: 'document-project-sales-filter'
										}
									}
								}
							},
							'ordheaderfk': {
								// 'readonly': 'true',
								'grid': {
									editor: 'lookup',
									editorOptions: {
										directive: 'sales-common-contract-dialog',
										'lookupOptions': {
											'showClearButton': true,
											filterKey: 'document-project-sales-filter'
										}
									},
									width: 125,
									formatter: 'lookup',
									'formatterOptions': {
										'lookupType': 'SalesContract',
										'displayMember': 'Code'
									}
								},
								'detail': {
									'type': 'directive',
									'directive': 'basics-lookupdata-lookup-composite',
									'options': {
										'lookupDirective': 'sales-common-contract-dialog',
										'descriptionMember': 'DescriptionInfo.Translated',
										'lookupOptions': {
											'showClearButton': true,
											filterKey: 'document-project-sales-filter'
										}
									}
								}
							},
							'bpdcontactfk': {
								'grid': {
									'editor': 'lookup',
									'editorOptions': {
										'directive': 'business-partner-main-contact-dialog',
										'lookupOptions': {'filterKey': 'doc-contact-filter', 'showClearButton': true}
									},
									'formatter': 'lookup',
									'formatterOptions': {'lookupType': 'Contact', 'displayMember': 'FullName'},
									'width': 100
								},
								'detail': {
									'type': 'directive',
									'directive': 'business-partner-main-contact-dialog',
									'options': {
										'filterKey': 'doc-contact-filter', 'showClearButton': true
									}
								}
							},
							'bpdsubsidiaryfk': {
								'grid': {
									'editor': 'lookup',
									'editorOptions': {
										'directive': 'business-partner-main-subsidiary-lookup',
										'lookupOptions': {'showClearButton': true, 'filterKey': 'doc-subsidiary-filter', 'displayMember': 'AddressLine'}
									},
									'formatter': 'lookup',
									'formatterOptions': {'lookupType': 'subsidiary', 'displayMember': 'AddressLine'},
									'width': 180
								},
								'detail': {
									'type': 'directive',
									'directive': 'business-partner-main-subsidiary-lookup',
									'options': {
										'filterKey': 'doc-subsidiary-filter', 'showClearButton': true,
										'displayMember': 'AddressLine'
									}
								}
							}

						},
						'addition': {
							grid: [
								{
									'lookupDisplayColumn': true,
									'field': 'ReqHeaderFk',
									'displayMember': 'Description',
									name$tr$: 'documents.project.ReqHeaderFkAddtion'
								},
								{
									lookupDisplayColumn: true,
									field: 'PrjProjectFk',
									name$tr$: 'documents.project.project_name1',
									displayMember: 'ProjectName'
								},
								{
									lookupDisplayColumn: true,
									field: 'MdcMaterialCatalogFk',
									name$tr$: 'documents.project.materialCatalogDescription',
									displayMember: 'DescriptionInfo.Translated'
								},
								{
									lookupDisplayColumn: true,
									field: 'BpdCertificateFk',
									name$tr$: 'documents.project.CertificateDescription',
									displayMember: 'Reference'
								},
								{
									lookupDisplayColumn: true,
									field: 'QtnHeaderFk',
									name$tr$: 'documents.project.qtnDescription',
									displayMember: 'Description'
								},
								{
									lookupDisplayColumn: true,
									field: 'InvHeaderFk',
									name$tr$: 'documents.project.invDescription',
									displayMember: 'Description'
								},
								{
									lookupDisplayColumn: true,
									field: 'QtoHeaderFk',
									name$tr$: 'documents.project.qtoDescription',
									displayMember: 'Description'
								},
								{
									lookupDisplayColumn: true,
									field: 'PsdActivityFk',
									name$tr$: 'documents.project.activityDescription',
									displayMember: 'Description'
								},
								{
									lookupDisplayColumn: true,
									field: 'ConHeaderFk',
									name$tr$: 'documents.project.conDescription',
									displayMember: 'Description'
								},
								{
									lookupDisplayColumn: true,
									field: 'PesHeaderFk',
									name$tr$: 'documents.project.pesDescription',
									displayMember: 'Description'
								},
								{
									lookupDisplayColumn: true,
									field: 'RfqHeaderFk',
									name$tr$: 'documents.project.rfqDescription',
									displayMember: 'Description'
								},
								{
									lookupDisplayColumn: true,
									field: 'PrcStructureFk',
									name$tr$: 'documents.project.structureDescription',
									displayMember: 'DescriptionInfo.Translated'
								},
								{
									lookupDisplayColumn: true,
									field: 'PrcPackageFk',
									name$tr$: 'documents.project.packageDescription',
									displayMember: 'Description'
								},
								{
									lookupDisplayColumn: true,
									field: 'MdcControllingUnitFk',
									name$tr$: 'documents.project.controllingUnitDescription',
									displayMember: 'DescriptionInfo.Translated'
								},
								{
									lookupDisplayColumn: true,
									field: 'ProjectInfoRequestFk',
									name$tr$: 'documents.project.inforequestDescription',
									displayMember: 'Description'
								},
								{
									lookupDisplayColumn: true,
									field: 'PrjChangeFk',
									name$tr$: 'documents.project.prjChangeDescription',
									displayMember: 'Description'
								},
								{
									lookupDisplayColumn: true,
									field: 'BilHeaderFk',
									name$tr$: 'documents.project.bilHeaderDescription',
									displayMember: 'DescriptionInfo.Translated'
								},
								{
									lookupDisplayColumn: true,
									field: 'BidHeaderFk',
									name$tr$: 'documents.project.bidHeaderDescription',
									displayMember: 'DescriptionInfo.Translated'
								},
								{
									lookupDisplayColumn: true,
									field: 'WipHeaderFk',
									name$tr$: 'documents.project.wipHeaderDescription',
									displayMember: 'DescriptionInfo.Translated'
								},
								{
									lookupDisplayColumn: true,
									field: 'OrdHeaderFk',
									name$tr$: 'documents.project.ordHeaderDescription',
									displayMember: 'DescriptionInfo.Translated'
								}
							]
						}
					};
				}]);

	angular.module(modName).factory('documentProjectHeaderUIStandardService',
		[
			'$translate', 'platformUIStandardConfigService', 'documentProjectDocumentTranslationService',
			'documentProjectLayout', 'platformSchemaService', 'platformUIStandardExtentService',
			function ($translate, PlatformUIStandardConfigService, translationService, layout, platformSchemaService,
				platformUIStandardExtentService) {
				var domainSchema = platformSchemaService.getSchemaFromCache({
					typeName: 'DocumentDto',
					moduleSubModule: 'Documents.Project'
				});
				if (domainSchema) {
					domainSchema = domainSchema.properties;
				}
				var layoutCopy = angular.copy(layout);
				const entityInformation = { module: angular.module( 'documents.centralquery'), moduleName: 'Documents.CentralQuery', entity: 'Document' };
				var service = new PlatformUIStandardConfigService(layoutCopy, domainSchema, translationService, entityInformation);
				platformUIStandardExtentService.extend(service, layoutCopy.addition, domainSchema);
				return service;

			}
		]);

})(angular);
