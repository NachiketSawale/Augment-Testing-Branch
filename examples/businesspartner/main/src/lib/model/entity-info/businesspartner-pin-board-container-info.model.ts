/*
 * Copyright(c) RIB Software GmbH
 */
import { CommentType, PinBoardContainerFactory } from '@libs/basics/shared';
import { BusinesspartnerMainHeaderDataService } from '../../services/businesspartner-data.service';

/**
 * Businesspartner pin borad Entity info model.
 */
export const BUSINESS_PARTNER_PIN_BOARD_CONTAINER_DEFINITION = PinBoardContainerFactory.create({
	uuid: '0651027C87AC4B499DD09FCB14CF84F5',
	permission: '01a52cc968494eacace7669fb996bc72',
	title: 'basics.common.commentContainerTitle',
	commentQualifier: 'businesspartner.main.comment',
	commentType: CommentType.Standard,
    parentServiceToken: BusinesspartnerMainHeaderDataService,
	isPinBoardReadonly: false
});