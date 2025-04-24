/*
 * Copyright(c) RIB Software GmbH
 */
import { SelectionStatementContainerFactory } from '@libs/constructionsystem/common';
import { ConstructionSystemMasterTemplateDataService } from '../../services/construction-system-master-template-data.service';
import { ICosTemplateEntity } from '@libs/constructionsystem/shared';

export const CONSTRUCTION_SYSTEM_MASTER_TEMPLATE_SELECTION_STATEMENT_CONTAINER_DEFINITION = SelectionStatementContainerFactory.create<ICosTemplateEntity>({
	uuid: '2d60156e33554ff286a0cf1614097945',
	permission: '82d7957dfe484db28038fcf1c5446dfd',
	title: 'constructionsystem.master.templateSelectionStatementContainerTitle',
	parentServiceToken: ConstructionSystemMasterTemplateDataService,
});
