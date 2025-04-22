/*
 * Copyright(c) RIB Software GmbH
 */
import { CommentType, PinBoardContainerFactory } from '@libs/basics/shared';
import { BusinesspartnerContactDataService } from '../../services/businesspartner-contact-data.service';

/**
 * Businesspartner main contact private comment Entity info model.
 */
export const BP_MAIN_CONTACT_PRIVATE_COMMENT_CONTAINER_DEFINITION = PinBoardContainerFactory.create({
	uuid: '9E634079A9E343E3B370B9383245CDD3',
	permission: 'fb458f707ab341888cba09af594078d4',
	title: 'businesspartner.main.pinboard.contactPrivateCommentTitle',
	commentQualifier: 'businesspartner.main.contactprivatecomment',
	commentType: CommentType.Standard,
    parentServiceToken: BusinesspartnerContactDataService,
});