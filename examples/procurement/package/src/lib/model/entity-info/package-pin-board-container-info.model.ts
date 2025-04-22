/*
 * Copyright(c) RIB Software GmbH
 */
import { CommentType, PinBoardContainerFactory } from '@libs/basics/shared';
import { ProcurementPackageHeaderDataService } from '../../services/package-header-data.service';

/**
 * Procurement package pin borad Entity info model.
 */
export const PROCUREMENT_PACKAGE_PIN_BOARD_CONTAINER_DEFINITION = PinBoardContainerFactory.create({
	uuid: '39ce5bd4dd6b43c0a18329031923d582',
	title: 'basics.common.commentContainerTitle',
	commentQualifier: 'procurement.package.comment',
	commentType: CommentType.Standard,
    parentServiceToken: ProcurementPackageHeaderDataService,
});