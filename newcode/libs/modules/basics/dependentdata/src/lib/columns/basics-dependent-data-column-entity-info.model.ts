/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { IDependentDataColumnEntity } from '../model/entities/dependent-data-column-entity.interface';
import { BasicsDependentColumnDataService } from './basics-dependent-data-column-data.service';
import { BasicsDependentDataColumnLayoutService } from './basics-dependent-data-column-layout.service';
import { BasicsDependentDataColumnBehaviorService } from './basics-dependent-data-column-behavior.service';

export const BASICS_DEPENDENT_DATA_COLUMN_ENTITY_INFO: EntityInfo = EntityInfo.create<IDependentDataColumnEntity>({
	grid: {
		title: {key: 'basics.dependentdata.dependentDataColumnListTitle'},
		behavior: ctx => ctx.injector.get(BasicsDependentDataColumnBehaviorService),
	},
	dataService: ctx => ctx.injector.get(BasicsDependentColumnDataService),
	layoutConfiguration: context => {
		return context.injector.get(BasicsDependentDataColumnLayoutService).generateLayout();
	},
	dtoSchemeId: {moduleSubModule: 'Basics.DependentData', typeName: 'DependentDataColumnDto'},
	permissionUuid: 'ac74931e5d124f8faefee74e490af726',
});