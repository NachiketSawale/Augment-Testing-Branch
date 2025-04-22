/*
 * Copyright(c) RIB Software GmbH
 */
import { CommentType, PinBoardContainerFactory } from '@libs/basics/shared';
import { BusinesspartnerMainHeaderDataService } from '../../services/businesspartner-data.service';

/**
 * Businesspartner private comment Entity info model.
 */
export const BUSINESS_PARTNER_PRIVATE_COMMENT_CONTAINER_DEFINITION = PinBoardContainerFactory.create({
	uuid: 'BAE2A04908044B118585A58AF96390D5',
	permission: '01a52cc968494eacace7669fb996bc72',
	title: 'basics.common.privateCommentContainerTitle',
	commentQualifier: 'businesspartner.main.bpprivatecomment',
	commentType: CommentType.Standard,
    parentServiceToken: BusinesspartnerMainHeaderDataService,
});