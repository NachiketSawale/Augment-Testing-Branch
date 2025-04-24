/*
 * Copyright(c) RIB Software GmbH
 */
import { EntityInfo } from '@libs/ui/business-base';
import { BasicsProcurementStructureBehaviorService } from './basics-procurement-structure-behavior.service';
import { BasicsProcurementStructureDataService } from './basics-procurement-structure-data.service';
import { BasicsProcurementStructureLayoutService } from './basics-procurement-structure-layout.service';
import { IPrcStructureEntity } from '@libs/basics/interfaces';

export const PROCUREMENT_STRUCTURE_ENTITY_INFO = EntityInfo.create<IPrcStructureEntity>({
	dtoSchemeId: {moduleSubModule: 'Basics.ProcurementStructure', typeName: 'PrcStructureDto'},
	permissionUuid: 'a59c90cf86d14abe98df9cb8601b22a0',
	grid: {
		title: {text: 'Procurement Structure', key: 'basics.procurementstructure.gridContainerTitle'},
	},
	form: {
		containerUuid: 'efb8785b0135482eac2f12efb0006ef3',
		title: {text: 'Procurement Structure Detail', key: 'basics.procurementstructure.formContainerTitle'},
	},
	containerBehavior: ctx => ctx.injector.get(BasicsProcurementStructureBehaviorService),
	dataService: ctx => ctx.injector.get(BasicsProcurementStructureDataService),
	layoutConfiguration: context => {
		return context.injector.get(BasicsProcurementStructureLayoutService).generateLayout();
	}
});
