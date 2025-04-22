/*
 * Copyright(c) RIB Software GmbH
 */

import { CommentType, PinBoardContainerFactory } from '@libs/basics/shared';
import { SalesWipWipsDataService } from '../services/sales-wip-wips-data.service';

/**
 * Sales WIP pin board Entity info model.
 */

export const SALES_WIP_PIN_BOARD_CONTAINER_ENTITY_INFO = PinBoardContainerFactory.create({
	uuid: 'd668042b28334763a0d7f001cc6bd45d',
	title: 'basics.common.commentContainerTitle',
	commentQualifier: 'sales.wip.wipcomment',
	commentType: CommentType.Standard,
	parentServiceToken: SalesWipWipsDataService,
});