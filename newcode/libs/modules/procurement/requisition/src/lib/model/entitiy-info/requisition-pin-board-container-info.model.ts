/*
 * Copyright(c) RIB Software GmbH
 */
import { CommentType, PinBoardContainerFactory } from '@libs/basics/shared';
import { ProcurementRequisitionHeaderDataService } from '../../services/requisition-header-data.service';

/**
 * Procurement Requisition pin borad Entity info model.
 */
export const PROCUREMENT_REQUISITION_PIN_BOARD_CONTAINER_DEFINITION = PinBoardContainerFactory.create({
	uuid: '664c390bca3b4788a7d66d9b1d372675',
	title: 'basics.common.commentContainerTitle',
	commentQualifier: 'procurement.req.comment',
	commentType: CommentType.Standard,
    parentServiceToken: ProcurementRequisitionHeaderDataService,
});