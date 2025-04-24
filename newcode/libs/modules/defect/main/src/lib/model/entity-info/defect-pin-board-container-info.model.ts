import { CommentType, PinBoardContainerFactory } from '@libs/basics/shared';
import { DefectMainHeaderDataService } from '../../services/defect-main-header-data.service';

export const DEFECT_MAIN_PIN_BOARD_CONTAINER_DEFINITION = PinBoardContainerFactory.create({
	uuid: 'E3C36EAC59C64402AF2FB2A7762BDD7B',
	permission: '01a52cc968494eacace7669fb996bc72',
	title: 'defect.main.commentContainerTitle',
	commentQualifier: 'defect.main.comment',
	commentType: CommentType.Standard,
	parentServiceToken: DefectMainHeaderDataService,
	rootServiceToken: DefectMainHeaderDataService,
	customizedOptions: { itemName: 'DfmComments' },
});
