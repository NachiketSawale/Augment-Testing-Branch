/*
 * Copyright(c) RIB Software GmbH
 */
import { CommentType, PinBoardContainerFactory } from '@libs/basics/shared';
import { ProcurementPesHeaderDataService } from '../../services/procurement-pes-header-data.service';

/**
 * Procurement Pes pin borad Entity info model.
 */
export const PROCUREMENT_PES_PIN_BOARD_CONTAINER_DEFINITION = PinBoardContainerFactory.create({
	uuid: '245c6a1bd5234eab9b38cd25a4f76a55',
	title: 'basics.common.commentContainerTitle',
	commentQualifier: 'procurement.pes.comment',
	commentType: CommentType.Standard,
    parentServiceToken: ProcurementPesHeaderDataService,
});