/*
 * Copyright(c) RIB Software GmbH
 */
import { CommentType, PinBoardContainerFactory } from '@libs/basics/shared';
import { ContactDataService } from '../../services/contact-data.service';

/**
 * Businesspartner contact private comment Entity info model.
 */
export const CONTACT_PRIVATE_COMMENT_CONTAINER_DEFINITION = PinBoardContainerFactory.create({
	uuid: 'fb458f707ab341888cba09af594078d4',
	permission: 'fb458f707ab341888cba09af594078d4',
	title: 'basics.common.privateCommentContainerTitle',
	commentQualifier: 'businesspartner.contact.contactprivatecomment',
	commentType: CommentType.Standard,
    parentServiceToken: ContactDataService,
});