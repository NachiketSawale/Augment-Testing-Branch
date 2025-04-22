/*
 * Copyright(c) RIB Software GmbH
 */

import { IRfqSendHistoryEntity } from '../entities/rfq-send-history-entity.interface';
import { ProcurementRfqSendHistoryBehavior } from '../../behaviors/rfq-send-history-behavior.service';
import { ProcurementRfqSendHistoryDataService } from '../../services/rfq-send-history-data.service';
import { EntityInfo } from '@libs/ui/business-base';
import { createLookup, FieldType, ILayoutConfiguration } from '@libs/ui/common';
import { IEntityContext, prefixAllTranslationKeys } from '@libs/platform/common';
import { BasicsSharedCommunicationChannelLookupService } from '@libs/basics/shared';
import { PrcRfqStatusLookupService, RfqStatusEntity } from '@libs/procurement/shared';
import {
	BusinesspartnerSharedContactLookupService,
	BusinesspartnerSharedStatusLookupService,
} from '@libs/businesspartner/shared';
import { BusinessPartnerStatusEntity } from '@libs/businesspartner/interfaces';

const moduleName: string = 'procurement.rfq';

const layoutConfiguration: ILayoutConfiguration<IRfqSendHistoryEntity> = {
	groups: [
		{
			gid: 'default-group',
			attributes: ['PrcCommunicationChannelFk', 'RfqStatusFk', 'RfqBpStatusPreFk', 'RfqBpStatusPostFk', 'Protocol', 'ContactFk', 'Recipient', 'Subject',
			'DateSent', 'EmailLink', 'Sender']
		},
	],
	overloads: {
		Id: { readonly: true },
		PrcCommunicationChannelFk: {
			type: FieldType.Lookup,
			lookupOptions: createLookup({
				dataServiceToken: BasicsSharedCommunicationChannelLookupService,
			})
		},
		RfqStatusFk: {
			type: FieldType.Lookup,
			lookupOptions: createLookup<IRfqSendHistoryEntity, RfqStatusEntity>({
				dataServiceToken: PrcRfqStatusLookupService,
				showClearButton: true,
				displayMember: 'Description'
			})
		},
		RfqBpStatusPreFk: {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions: createLookup<IRfqSendHistoryEntity, BusinessPartnerStatusEntity>({
				dataServiceToken: BusinesspartnerSharedStatusLookupService
			})
		},
		RfqBpStatusPostFk: {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions: createLookup<IRfqSendHistoryEntity, BusinessPartnerStatusEntity>({
				dataServiceToken: BusinesspartnerSharedStatusLookupService
			})
		},
		ContactFk: {
			type: FieldType.Lookup,
			lookupOptions: createLookup({
				dataServiceToken: BusinesspartnerSharedContactLookupService,
				showClearButton: true,
				serverSideFilter: {
					key: 'procurement-rfq-businesspartner-contact-filter',
					execute: (context: IEntityContext<IRfqSendHistoryEntity>) => {
						return {
							PKey1: context.entity?.ContactFk
						};
					}
				}
			})
		}
	},
	labels: {
		...prefixAllTranslationKeys('procurement.rfq' + '.', {
			Recipient: { key: 'Recipient', text: 'Email' },
			Subject: { key: 'Subject', text: 'Subject' },
			DateSent: { key: 'DateSent', text: 'Date Sent' },
			EmailLink: { key: 'EmailLink', text: 'Email Link' },
			Sender: { key: 'Sender', text: 'Sender Account' },
			JumpLink: { key: 'JumpLink', text: 'Jump Link' },
			RfqBpStatusPreFk: { key: 'entityRfqBpStatusPre', text: 'Status Bidder Pre' },
			RfqBpStatusPostFk: { key: 'entityRfqBpStatusPost', text: 'Status Bidder Post' },
			Protocol: { key: 'entityProtocol', text: 'Protocol' },
			ContactFk: { key: 'SendHistoryContact', text: 'Contact' }
		}),
		...prefixAllTranslationKeys('cloud.common.', {
			RfqStatusFk: {key: 'entityStatus', text: 'Status'},
		}),
		...prefixAllTranslationKeys('procurement.common.', {
			PrcCommunicationChannelFk: {key: 'entityPrcCommunicationChannel', text: 'Communication Channel'}
		}),
	}
};

export const RFQ_SEND_HISTORY_ENTITY_INFO = EntityInfo.create<IRfqSendHistoryEntity>({
	grid: {
		title: { text: 'Send History', key: moduleName + '.prcRfqSendHistoryContainerGridTitle' },
		behavior: (ctx) => ctx.injector.get(ProcurementRfqSendHistoryBehavior),
	},
	form: {
		title: { text: 'Send History Detail', key: moduleName + '.prcRfqSendHistoryContainerFormTitle' },
		containerUuid: 'b28931fa0d0946048ef8bacfb8910403'
	},
	dataService: (ctx) => ctx.injector.get(ProcurementRfqSendHistoryDataService),
	dtoSchemeId: { moduleSubModule: 'Procurement.RfQ', typeName: 'RfqSendHistoryDto' },
	permissionUuid: 'dbfa5ff5cbb34fe4a7feba67a5360e81',
	layoutConfiguration: layoutConfiguration,
	prepareEntityContainer: async ctx => {

	}
});