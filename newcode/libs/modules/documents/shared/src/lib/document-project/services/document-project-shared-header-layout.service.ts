
/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import {createLookup, FieldType, ILayoutConfiguration} from '@libs/ui/common';
import {IDocumentProjectEntity} from '../../model/entities/document-project-entity.interface';
import {prefixAllTranslationKeys} from '@libs/platform/common';
import {
    BasicsSharedCustomizeLookupOverloadProvider,
    BasicsSharedRubricCategoryLookupService,
    BasicsSharedProjectDocumentCategoryLookupService,
    Rubric
} from '@libs/basics/shared';
import {
    IBasicsCustomizeProjectDocumentCategoryEntity,
	IBasicsCustomizeProjectDocumentStatusEntity
} from '@libs/basics/interfaces';
import {
    ProcurementShareReqLookupService,
    ProcurementSharePesLookupService,
    ProcurementShareInvoiceLookupService,
    ProcurementShareRfqLookupService,
    ProcurementShareQuoteLookupService, ProcurementShareContractLookupService, ProcurementPackageLookupService
} from '@libs/procurement/shared';
import { ProjectSharedProjectLookupProviderService } from '@libs/project/shared';
import { IProjectDocumentTypeEntity } from '../../model/entities/project-document-type-entity.interface';
import { DocumentSharedDocumentTypeLookupService } from '../../lookup-services/document-project-document-type-lookup.service';


/**
 * document project layout service
 */
@Injectable({
    providedIn: 'root',
})
export class DocumentProjectSharedHeaderLayoutService {
	private readonly projectLookupProvider = inject(ProjectSharedProjectLookupProviderService);

    /**
     * Generate layout config
     */
    public async generateLayout(): Promise<ILayoutConfiguration<IDocumentProjectEntity>> {
        return {
				groups: [
					{
						gid: 'basicData',
						title: {
							key: 'cloud.common.entityProperties',
							text: 'Basic Data',
						},
						attributes: [
							'DocumentType',
							'OriginFileName',
							'HasDocumentRevision',
							'Origin',
							'FileSize',
							'Id',
							'PrjDocumentStatusFk',
							'PrjDocumentCategoryFk',
							'DocumentTypeFk',
							'PrjDocumentTypeFk',
							'Barcode',
							'Description',
							'CommentText',
							'Revision',
							'Url',
							'PrjProjectFk',
							// 'MdcControllingUnitFk',
							// 'PrjLocationFk',
							// 'BpdBusinessPartnerFk',
							// 'BpdCertificateFk',
							// 'PrcStructureFk',
							// 'MdcMaterialCatalogFk',
							'PrcPackageFk',
							'RfqHeaderFk',
							'QtnHeaderFk',
							'ConHeaderFk',
							'PesHeaderFk',
							'InvHeaderFk',
							// 'PsdScheduleFk',
							// 'PsdActivityFk',
							// 'EstHeaderFk',
							'ReqHeaderFk',
							// 'BidHeaderFk',
							// 'OrdHeaderFk',
							// 'WipHeaderFk',
							// 'ProjectInfoRequestFk',
							'UserDefined1',
							'UserDefined2',
							'UserDefined3',
							'UserDefined4',
							'UserDefined5',
							'DocumentDate',
							// 'ModelFk',
							// 'BilHeaderFk',
							// 'LgmJobFk',
							// 'LgmDispatchHeaderFk',
							// 'LgmSettlementFk',
							'RubricCategoryFk',
							// 'QtoHeaderFk',
							// 'PrjChangeFk',
							'ExpirationDate',
							// 'BpdContactFk',
							// 'BpdSubsidiaryFk',
							'Code',
						],
					},
				],
				labels: {
					...prefixAllTranslationKeys('documents.project.', {
						DocumentType: {
							key: 'entityDocumentType',
							text: 'Link Flag',
						},
						OriginFileName: {
							key: 'entityFileArchiveDoc',
							text: 'Origin File Name',
						},
						HasDocumentRevision: {
							key: 'entityHasDocumentRevision',
							text: 'Empty Record',
						},
						Origin: {
							key: 'origin',
							text: '*Origin',
						},
						FileSize: {
							key: 'entityFileSize',
							text: 'File Size',
						},
						Id: {
							key: 'entityId',
							text: 'Document ID',
						},
						PrjDocumentStatusFk: {
							key: 'entityPrjDocumentStatus',
							text: 'Status',
						},
						PrjDocumentCategoryFk: {
							key: 'entityPrjDocumentCategory',
							text: 'Document Category',
						},
						PrjDocumentTypeFk: {
							key: 'entityPrjDocumentType',
							text: 'Document Type',
						},
						Barcode: {
							key: 'entityBarcode',
							text: 'Bar Code',
						},
						Revision: {
							key: 'Revisions.Revision',
							text: 'Revision',
						},
						Url: {
							key: 'entityUrl',
							text: 'Url',
						},
						// 'MdcControllingUnitFk': {
						//     'key': 'entityMDCControllingUnit',
						//     'text': 'Controlling Unit'
						// },
						// 'PrjLocationFk': {
						//     'key': 'entityLocation',
						//     'text': 'Location'
						// },
						// 'BpdBusinessPartnerFk': {
						//     'key': 'entityBpdBusinessPartner',
						//     'text': 'Business Partner'
						// },
						// 'BpdCertificateFk': {
						//     'key': 'entityBpdCertificate',
						//     'text': 'Certificate'
						// },
						// 'PrcStructureFk': {
						//     'key': 'entityStructure',
						//     'text': 'Structure'
						// },
						// 'MdcMaterialCatalogFk': {
						//     'key': 'entityMaterialCatalog',
						//     'text': 'Material Catalog'
						// },
						PrcPackageFk: {
							key: 'entityPackage',
							text: 'Package',
						},
						RfqHeaderFk: {
							key: 'entityRfqHeaderCode',
							text: 'RFQ',
						},
						QtnHeaderFk: {
							key: 'entityQtnHeader',
							text: 'Quote',
						},
						ConHeaderFk: {
							key: 'entityContractCode',
							text: 'Contract',
						},
						InvHeaderFk: {
							key: 'entityInvHeader',
							text: 'Invoice',
						},
						// 'PsdScheduleFk': {
						//     'key': 'entityPsdSchedule',
						//     'text': 'Schedule'
						// },
						// 'PsdActivityFk': {
						//     'key': 'entityPsdActivity',
						//     'text': 'Schedule Activity'
						// },
						// 'EstHeaderFk': {
						//     'key': 'entityEstHeader',
						//     'text': 'Estimate'
						// },
						ReqHeaderFk: {
							key: 'entityReferenceCode',
							text: 'REQ',
						},
						PesHeaderFk: {
							key: 'entityPES',
							text: 'PES No.',
						},
						// 'BidHeaderFk': {
						//     'key': 'entityBidHeaderFk',
						//     'text': 'Billing'
						// },
						// 'OrdHeaderFk': {
						//     'key': 'entityOrdHeaderFk',
						//     'text': 'Wip'
						// },
						// 'WipHeaderFk': {
						//     'key': 'entityWipHeaderFk',
						//     'text': 'Wip'
						// },
						// 'ProjectInfoRequestFk': {
						//     'key': 'entityInfoRequest',
						//     'text': 'RFI'
						// },
						DocumentDate: {
							key: 'entityDocumentDate',
							text: 'Document Date',
						},
						// 'ModelFk': {
						//     'key': 'entityModel',
						//     'text': 'Model'
						// },
						// 'BilHeaderFk': {
						//     'key': 'entityBilHeaderFk',
						//     'text': 'Billing'
						// },
						// 'LgmJobFk': {
						//     'key': 'entityLgmJob',
						//     'text': 'Job'
						// },
						// 'LgmDispatchHeaderFk': {
						//     'key': 'entityLgmDispatchHeader',
						//     'text': 'Dispatch Header'
						// },
						// 'LgmSettlementFk': {
						//     'key': 'entityLgmSettlement',
						//     'text': 'Settlement'
						// },
						RubricCategoryFk: {
							key: 'entityRubricCategory',
							text: 'Rubric Category',
						},
						// 'QtoHeaderFk': {
						//     'key': 'entityQtoHeader',
						//     'text': 'QTO'
						// },
						// 'PrjChangeFk': {
						//     'key': 'entityPrjChange',
						//     'text': 'Project Change'
						// },
						ExpirationDate: {
							key: 'entityExpirationDate',
							text: 'Expiration Date',
						},
						Code: {
							key: 'entityCode',
							text: 'Code',
						},
					}),
					...prefixAllTranslationKeys('cloud.common.', {
						DocumentTypeFk: {
							key: 'entityDocumentType',
							text: 'File Type',
						},
						Description: {
							key: 'entityDescription',
							text: 'Description',
						},
						CommentText: {
							key: 'entityCommentText',
							text: 'Comment',
						},
						PrjProjectFk: {
							key: 'entityProjectNo',
							text: 'Project No.',
						},
						UserDefined1: {
							key: 'entityUserDefined',
							text: 'User-Defined 1',
							params: {
								p_0: '1',
							},
						},
						UserDefined2: {
							key: 'entityUserDefined',
							text: 'User-Defined 2',
							params: {
								p_0: '2',
							},
						},
						UserDefined3: {
							key: 'entityUserDefined',
							text: 'User-Defined 3',
							params: {
								p_0: '3',
							},
						},
						UserDefined4: {
							key: 'entityUserDefined',
							text: 'User-Defined 4',
							params: {
								p_0: '4',
							},
						},
						UserDefined5: {
							key: 'entityUserDefined',
							text: 'User-Defined 5',
							params: {
								p_0: '5',
							},
						},
					}),
					...prefixAllTranslationKeys('procurement.contract.', {
						BpdContactFk: {
							key: 'ConHeaderContact',
							text: 'Contact',
						},
						BpdSubsidiaryFk: {
							key: 'entitySubsidiary',
							text: 'Branch',
						},
					}),
				},
				overloads: {
					DocumentType: {
						readonly: true,
					},
					HasDocumentRevision: {
						readonly: true,
					},
					FileSize: {
						readonly: true,
					},
					Id: {
						readonly: true,
					},
					PrjDocumentStatusFk: BasicsSharedCustomizeLookupOverloadProvider.provideProjectDocumentStatusReadonlyLookupOverload({
						select(item:IBasicsCustomizeProjectDocumentStatusEntity): string {
							return item.Icon ? `status-icons ico-status${item.Icon.toString().padStart(2, '0')}` : '';
						},
						getIconType() {
							return 'css';
						},
					}),

					Revision: {
						readonly: true,
					},
					ModelFk: {
						readonly: true,
					},
					PrjDocumentCategoryFk: {
						type: FieldType.Lookup,
						readonly: true,
						lookupOptions: createLookup<IDocumentProjectEntity, IBasicsCustomizeProjectDocumentCategoryEntity>({
							dataServiceToken: BasicsSharedProjectDocumentCategoryLookupService,
							//todo --add filter
						}),
					},
					PrjDocumentTypeFk: {
						type: FieldType.Lookup,
						lookupOptions: createLookup<IDocumentProjectEntity, IProjectDocumentTypeEntity>({
							dataServiceToken: DocumentSharedDocumentTypeLookupService,
						}),
					},
					RubricCategoryFk: {
						type: FieldType.Lookup,
						readonly: true,
						lookupOptions: createLookup({
							dataServiceToken: BasicsSharedRubricCategoryLookupService,
							serverSideFilter: {
								key: 'mdc-material-catalog-rubric-category-filter',
								execute() {
									return 'RubricFk = ' + Rubric.Material;
								},
							},
						}),
					},
					ReqHeaderFk: {
						type: FieldType.Lookup,
						lookupOptions: createLookup({
							dataServiceToken: ProcurementShareReqLookupService,
							showDescription: true,
							descriptionMember: 'Description',
						}),
					},
					PrcPackageFk: {
						type: FieldType.Lookup,
						lookupOptions: createLookup({
							dataServiceToken: ProcurementPackageLookupService,
							showDescription: true,
							descriptionMember: 'Description',
						}),
					},
					PrjProjectFk: {
						...this.projectLookupProvider.generateProjectLookup({
							lookupOptions: {
								displayMember: 'ProjectName',
								showClearButton: true,
								readonly:false,
							},
						}),
						additionalFields: [
							{
								displayMember: 'ProjectName',
								label: {
									key: 'cloud.common.entityProjectName',
								},
								column: true,
								row: false,
								singleRow: true,
							},
						],
					},
					PesHeaderFk: {
						type: FieldType.Lookup,
						lookupOptions: createLookup({
							dataServiceToken: ProcurementSharePesLookupService,
							showDescription: true,
							descriptionMember: 'Description',
						}),
					},
					InvHeaderFk: {
						type: FieldType.Lookup,
						lookupOptions: createLookup({
							dataServiceToken: ProcurementShareInvoiceLookupService,
							showDescription: true,
							descriptionMember: 'Reference',
						}),
					},
					RfqHeaderFk: {
						type: FieldType.Lookup,
						lookupOptions: createLookup({
							dataServiceToken: ProcurementShareRfqLookupService,
							showDescription: true,
							descriptionMember: 'Description',
						}),
					},
					QtnHeaderFk: {
						type: FieldType.Lookup,
						lookupOptions: createLookup({
							dataServiceToken: ProcurementShareQuoteLookupService,
							showDescription: true,
							descriptionMember: 'Description',
						}),
					},
					ConHeaderFk: {
						type: FieldType.Lookup,
						lookupOptions: createLookup({
							dataServiceToken: ProcurementShareContractLookupService,
							showDescription: true,
							descriptionMember: 'Description',
						}),
					},
					DocumentTypeFk: BasicsSharedCustomizeLookupOverloadProvider.provideFileTypeLookupOverload(false),
				},
			};
    }
}