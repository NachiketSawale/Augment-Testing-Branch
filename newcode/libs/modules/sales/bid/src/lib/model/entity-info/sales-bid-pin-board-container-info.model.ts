import { CommentType, PinBoardContainerFactory } from '@libs/basics/shared';
import { SalesBidBidsDataService } from '../../services/sales-bid-bids-data.service';

/**
 * Sales Bid pin board Container.
 */
export const SALES_BID_PIN_BOARD_CONTAINER_DEFINITION = PinBoardContainerFactory.create({
	uuid: 'fdd90b3f00ce4390bcd4a798d0dbf847',
	title: 'basics.common.commentContainerTitle',
	commentQualifier: 'sales.bid.bidcomment',
	commentType: CommentType.Standard,
	parentServiceToken: SalesBidBidsDataService,
});
