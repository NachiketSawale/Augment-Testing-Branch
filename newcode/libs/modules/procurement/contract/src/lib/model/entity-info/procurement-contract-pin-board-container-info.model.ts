/*
 * Copyright(c) RIB Software GmbH
 */
import { CommentType, PinBoardContainerFactory } from '@libs/basics/shared';
import {ProcurementContractContactDataService } from '../../services/procurement-contract-contact-data.service';
/**
 * Procurement Contract pin borad Entity info model.
 */

export const PROCUREMENT_CONTRACT_PIN_BOARD_CONTAINER_DEFINITION = PinBoardContainerFactory.create({
	uuid: '454c582d76004d37a9975728c9444bc1',
	title: 'basics.common.commentContainerTitle',
	commentQualifier: 'procurement.contract.comment',
	commentType: CommentType.Standard,
    parentServiceToken: ProcurementContractContactDataService,
});