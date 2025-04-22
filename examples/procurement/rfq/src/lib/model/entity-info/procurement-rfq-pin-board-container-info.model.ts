/*
 * Copyright(c) RIB Software GmbH
 */
import { CommentType, PinBoardContainerFactory } from '@libs/basics/shared';
import { ProcurementRfqHeaderMainDataService } from '../../services/procurement-rfq-header-main-data.service';
/**
 * Procurement RFQ pin borad Entity info model.
 */
export const PROCUREMENT_RFQ_PIN_BOARD_CONTAINER_DEFINITION = PinBoardContainerFactory.create({
	uuid: '2254e4b546af4b01b60f7aea33005955',
	title: 'basics.common.commentContainerTitle',
	commentQualifier: 'procurement.rfq.comment',
	commentType: CommentType.Standard,
    parentServiceToken: ProcurementRfqHeaderMainDataService,
});