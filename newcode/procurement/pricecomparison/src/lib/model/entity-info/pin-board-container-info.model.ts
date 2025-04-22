/*
 * Copyright(c) RIB Software GmbH
 */
import { CommentType, PinBoardContainerFactory } from '@libs/basics/shared';
import { ProcurementPricecomparisonRfqHeaderDataService } from '../../services/rfq-header-data.service';
/**
 * Procurement Price Comparison pin borad Entity info model.
 */
export const PRICE_COMPARISON_PIN_BOARD_CONTAINER_DEFINITION = PinBoardContainerFactory.create({
	uuid: 'b8e86c031eb14f2fab15066d37fcdaf1',
	title: 'basics.common.commentContainerTitle',
	commentQualifier: 'procurement.pricecomparison.comment',
	commentType: CommentType.Standard,
	parentServiceToken: ProcurementPricecomparisonRfqHeaderDataService,
});