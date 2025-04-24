/*
 * Copyright(c) RIB Software GmbH
 */
import { CommentType, PinBoardContainerFactory } from '@libs/basics/shared';
import { ProcurementQuoteHeaderDataService } from '../../services/quote-header-data.service';

export const PROCUREMENT_QUOTE_PIN_BOARD_CONTAINER_DEFINITION = PinBoardContainerFactory.create({
	uuid: 'd02384f254c04a72b68af0ab6f30a28e',
	title: 'basics.common.commentContainerTitle',
	commentType: CommentType.Standard,
	commentQualifier: 'procurement.quote.comment',
	parentServiceToken: ProcurementQuoteHeaderDataService,
	rootServiceToken: ProcurementQuoteHeaderDataService,
});
