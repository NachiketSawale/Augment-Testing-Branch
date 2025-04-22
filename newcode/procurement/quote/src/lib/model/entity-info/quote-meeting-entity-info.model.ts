/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { BasicsMeetingSection } from '@libs/basics/interfaces';
import { BasicsSharedLink2MeetingEntityInfoFactory } from '@libs/basics/shared';
import { ProcurementQuoteHeaderDataService } from '../../services/quote-header-data.service';
import { IQuoteHeaderEntity } from '../entities/quote-header-entity.interface';

export const QUOTE_MEETING_ENTITY_INFO: EntityInfo = BasicsSharedLink2MeetingEntityInfoFactory.create<IQuoteHeaderEntity>({
	permissionUuid: '33673f7dab934a52b285775f96023f43',
	formContainerUuid: '57b4942deed241d19029ed33eb2d8b9e',
	sectionId: BasicsMeetingSection.Quote,
	isParentFn: (pt, t) => pt.Id === t.QtnHeaderFk,
	parentServiceFn: (ctx) => {
		return ctx.injector.get(ProcurementQuoteHeaderDataService);
	},
	isParentReadonlyFn: (parentService) => {
		const service = parentService as ProcurementQuoteHeaderDataService;
		return service.isEntityReadonly();
	},
});
