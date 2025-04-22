/*
 * Copyright(c) RIB Software GmbH
 */
import { CommentType, PinBoardContainerFactory } from '@libs/basics/shared';
import { SalesContractContractsDataService } from '../../services/sales-contract-contracts-data.service';
/**
 * Sales Contract pin board Entity info model.
 */
export const SALES_CONTRACT_PIN_BOARD_CONTAINER_ENTITY_INFO = PinBoardContainerFactory.create({
	uuid: 'd668042b28334763a0d7f001cc6bd45d',
	title: 'basics.common.commentContainerTitle',
	commentQualifier: 'sales.contract.contractcomment',
	commentType: CommentType.Standard,
	parentServiceToken: SalesContractContractsDataService,
});