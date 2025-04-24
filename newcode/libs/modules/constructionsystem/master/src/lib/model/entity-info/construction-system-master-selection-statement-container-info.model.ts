/*
 * Copyright(c) RIB Software GmbH
 */
import { SelectionStatementContainerFactory } from '@libs/constructionsystem/common';
import { ConstructionSystemMasterHeaderDataService } from '../../services/construction-system-master-header-data.service';
import { ICosHeaderEntity } from '@libs/constructionsystem/shared';

export const CONSTRUCTION_SYSTEM_MASTER_SELECTION_STATEMENT_CONTAINER_DEFINITION = SelectionStatementContainerFactory.create<ICosHeaderEntity>({
	uuid: '105d6ee6c6ca4b3298d35718974df94e',
	permission: '474afedbb5ef474c878a027d03143eb9',
	title: 'constructionsystem.master.masterSelectionStatementContainerTitle',
	parentServiceToken: ConstructionSystemMasterHeaderDataService,
});
