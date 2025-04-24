/*
 * Copyright(c) RIB Software GmbH
 */
import { inject, Injectable, Injector } from '@angular/core';
import { createLookup, FieldType, ILayoutConfiguration, UiCommonLookupDataFactoryService } from '@libs/ui/common';
import { prefixAllTranslationKeys } from '@libs/platform/common';

import { IBasicsCustomizeDocumentTypeEntity } from '@libs/basics/interfaces';
import { IBasicsSharedPostConHistoryEntity } from '../model/entities/basics-shared-postcon-history-entity.interface';
import { BasicsSharedDocumentTypeLookupService } from '../../lookup-services/customize/basics/basics-shared-document-type-lookup.service';

/**
 * postcon history layout service
 */
@Injectable({
	providedIn: 'root',
})
export class BasicsSharedPostConHistoryLayout {
	private readonly injector = inject(Injector);
	public async generateConfig<T extends IBasicsSharedPostConHistoryEntity>(): Promise<ILayoutConfiguration<T>> {
		return <ILayoutConfiguration<T>>{
			groups: [
				{
					gid: 'basicData',
					title: {
						text: 'Basic Data',
						key: 'cloud.common.entityProperties'
					},
					attributes: [
						'PrcCommunicationChannelFk',
						'ProjectNo',
						'ProjectName',
						'PrjDocumentTypeFk',
						'BusinessPartnerName1',
						'OriginFileName'
					]
				}
			],
			labels: {
				...prefixAllTranslationKeys('procurement.common.', {
					PrcCommunicationChannelFk: {key: 'entityPrcCommunicationChannel', text: 'Communication Channel'}
				}),
				...prefixAllTranslationKeys('documents.project.', {
					ProjectNo: {key: 'entityPrjProject', text: 'Project No.'},
					ProjectName: {key: 'project_name1', text: 'Project Name 1'},
					PrjDocumentTypeFk: {key: 'entityPrjDocumentType', text: 'Project Document Type'}
				}),
				...prefixAllTranslationKeys('procurement.rfq.', {
					BusinessPartnerName1: {key: 'BusinessPartner', text: 'Business Partner'},
					OriginFileName: {key: 'originFileName', text: 'Origin File Name'}
				}),
			},
			overloads: {
				PrcCommunicationChannelFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataService:this.injector.get(UiCommonLookupDataFactoryService).fromSimpleDataProvider('basics.lookup.prccommunicationchannel', {
							uuid: '6385bdd89602476a86cecb953dacdf66',
							valueMember: 'Id',
							displayMember: 'Description',
							showClearButton: false
						})
					})
				},
				PrjDocumentTypeFk: {
					type: FieldType.Lookup,
					readonly: true,
					lookupOptions: createLookup<T, IBasicsCustomizeDocumentTypeEntity>({
						dataServiceToken: BasicsSharedDocumentTypeLookupService
					})
				},
			}
		};
	}
}