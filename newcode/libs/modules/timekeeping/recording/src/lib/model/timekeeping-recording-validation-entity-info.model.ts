/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { ITimekeepingValidationEntity } from '@libs/timekeeping/period';
import { TIMEKEEPING_PERIOD_VALIDATION_LAYOUT } from '@libs/timekeeping/period';
import { TimekeepingRecordingValidationDataService } from '../services/timekeeping-recording-validation-data.service';



export const TIMEKEEPING_RECORDING_VALIDATION_ENTITY_INFO: EntityInfo = EntityInfo.create<ITimekeepingValidationEntity> ({
	grid: {
		title: {key: 'timekeeping.period.validationListTitle'},
	},
	form: {
		title: { key: 'timekeeping.period.validationDetailTitle' },
		containerUuid: '6ac2eb988f484ca4aa848f27064929c5',
	},
	dataService: ctx => ctx.injector.get(TimekeepingRecordingValidationDataService),
	dtoSchemeId: {moduleSubModule: 'Timekeeping.Period', typeName: 'TimekeepingValidationDto'},
	permissionUuid: 'c1f889062e564495853240e4d8f8b5e2',
	layoutConfiguration: TIMEKEEPING_PERIOD_VALIDATION_LAYOUT
});