/*
 * Copyright(c) RIB Software GmbH
 */
import { CommentType, PinBoardContainerFactory } from '@libs/basics/shared';
import { ProcurementInvoiceHeaderDataService } from '../../header/procurement-invoice-header-data.service';

/**
 * Procurement Invoice pin borad Container.
 */
export const PROCUREMENT_INVOICE_PIN_BOARD_CONTAINER_DEFINITION = PinBoardContainerFactory.create({
	uuid: '9752fd548eBb240f98851c696e53cde68',
	title: 'basics.common.commentContainerTitle',
	commentQualifier: 'procurement.invoice.comment',
	commentType: CommentType.Standard,
    parentServiceToken: ProcurementInvoiceHeaderDataService,
});