import { CommentType, ICommentDataEntity, PinBoardContainerFactory } from '@libs/basics/shared';
import { HSQE_CHECKLIST_DATA_TOKEN } from '../../services/hsqe-checklist-data.service';
import { IHsqCheckListEntity } from '@libs/hsqe/interfaces';

export const CHECKLIST_PIN_BOARD_CONTAINER_DEFINITION = PinBoardContainerFactory.create<ICommentDataEntity, IHsqCheckListEntity>({
	uuid: '0436cff1e56443b3b0d73dbe4888152f',
	commentQualifier: 'hsqe.checklist.comment',
	title: { key: 'hsqe.checklist.comment.title' },
	commentType: CommentType.Standard,
	parentServiceToken: HSQE_CHECKLIST_DATA_TOKEN,
});
