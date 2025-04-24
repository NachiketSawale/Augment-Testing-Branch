/*
 * Copyright(c) RIB Software GmbH
 */
import { EntityInfo } from '@libs/ui/business-base';
import { BasicsMaterialPortionDataService } from './basics-material-portion-data.service';
import { BasicsMaterialPortionLayoutService } from './basics-material-portion-layout.service';
import { IMaterialPortionEntity } from '../model/entities/material-portion-entity.interface';
import { BasicsMaterialPortionValidationService } from './basics-material-portion-validation.service';

/**
 * Basics Material Portion Module Info
 */
export const BASICS_MATERIAL_PORTION_ENTITY_INFO = EntityInfo.create<IMaterialPortionEntity>({
	grid: {
		title: { text: 'Material Portion', key: 'basics.material.portion.title' }
	},
	form: {
		containerUuid: '6ae13c2c810b488285a3588933c592e5',
		title: { text: 'Material Portion Detail', key: 'basics.material.portion.detailTitle' },
	},
	dataService: ctx => ctx.injector.get(BasicsMaterialPortionDataService),
	validationService: ctx => ctx.injector.get(BasicsMaterialPortionValidationService),
	dtoSchemeId: { moduleSubModule: 'Basics.Material', typeName: 'MaterialPortionDto' },
	permissionUuid: '203a73460cc042efaf1879a45cb788fe',
	layoutConfiguration: context => {
		return context.injector.get(BasicsMaterialPortionLayoutService).generateLayout();
	}
});