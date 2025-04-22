import { CommentType, PinBoardContainerFactory } from '@libs/basics/shared';
import { SalesBillingBillsDataService } from '../../services/sales-billing-bills-data.service';

/**
 * Sales Billing pin borad Container.
 */
export const SALES_BILLING_PIN_BOARD_CONTAINER_DEFINITION = PinBoardContainerFactory.create({
	uuid: '99e67d71f2a84cdf9d116a3348258a22',
	title: 'basics.common.commentContainerTitle',
	commentQualifier: 'sales.billing.bilcomment',
	commentType: CommentType.Standard,
	parentServiceToken: SalesBillingBillsDataService,
});
