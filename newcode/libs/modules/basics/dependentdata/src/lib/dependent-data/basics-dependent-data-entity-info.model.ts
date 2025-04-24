/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { BasicsDependentDataDataService } from './basics-dependent-data-data.service';
import { IDependentDataEntity } from '../model/entities/dependent-data-entity.interface';
import { BasicsDependentDataLayoutService } from './basics-dependent-data-layout.service';
import { BasicsDependentDataValidationService } from './basics-dependent-data-validation.service';


export const BASICS_DEPENDENT_DATA_ENTITY_INFO: EntityInfo = EntityInfo.create<IDependentDataEntity>({
	grid: {
		title: {key: 'basics.dependentdata.dependentDataListTitle'}
	},
	form: {
		title: {key: 'basics.dependentdata.dependentDataDetailTitle'},
		containerUuid: '369ffe77b01f4910bf302fb001c50398',
	},
	validationService: (ctx) => ctx.injector.get(BasicsDependentDataValidationService),
	dataService: ctx => ctx.injector.get(BasicsDependentDataDataService),
	layoutConfiguration: context => {
		return context.injector.get(BasicsDependentDataLayoutService).generateLayout();
	},
	dtoSchemeId: {moduleSubModule: 'Basics.DependentData', typeName: 'DependentDataDto'},
	permissionUuid: '9ea72ac6d3884be582b2e6507987b9d2',
});