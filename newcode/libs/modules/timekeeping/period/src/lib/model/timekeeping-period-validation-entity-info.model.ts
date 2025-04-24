/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { TimekeepingPeriodValidationDataService } from '../services/timekeeping-period-validation-data.service';
import { ITimekeepingValidationEntity } from './entities/timekeeping-validation-entity.interface';
import { TIMEKEEPING_PERIOD_VALIDATION_LAYOUT } from './timekeeping-period-validation.layout.model';



export const TIMEKEEPING_PERIOD_VALIDATION_ENTITY_INFO: EntityInfo = EntityInfo.create<ITimekeepingValidationEntity> ({
	grid: {
		title: {key: 'timekeeping.period.validationListTitle'},
	},
	form: {
		title: { key: 'timekeeping.period.validationDetailTitle' },
		containerUuid: '6ac2eb988f484ca4aa848f27064929c5',
	},
	dataService: ctx => ctx.injector.get(TimekeepingPeriodValidationDataService),
	dtoSchemeId: {moduleSubModule: 'Timekeeping.Period', typeName: 'TimekeepingValidationDto'},
	permissionUuid: 'c1f889062e564495853240e4d8f8b5e2',
	layoutConfiguration: TIMEKEEPING_PERIOD_VALIDATION_LAYOUT
});