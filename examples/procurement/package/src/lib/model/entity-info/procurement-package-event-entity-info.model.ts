/*
 * Copyright(c) RIB Software GmbH
 */
import { ProcurementPackageEventDataService } from '../../services/procurement-package-event-data.service';
import { ProcurementCommonEventsEntityInfo } from '@libs/procurement/common';
import { ProcurementPackageEventsFormBehavior } from '../../behaviors/procurement-package-events-form-behavior.service';
import { ProcurementPackageEventsGridBehavior } from '../../behaviors/procurement-package-events-grid-behavior.service';

export const PROCUREMENT_Package_EVENT_ENTITY_INFO = ProcurementCommonEventsEntityInfo.create({
	containerUuid: '07946CB829634366B34547B3C5987B23',
	permissionUuid: '07946cb829634366b34547b3c5987b23',
	formUuid: 'D2CD3A65CA444FDF89DC4C7025D53083',
	dataServiceToken: ProcurementPackageEventDataService,
	behaviorGrid: ProcurementPackageEventsGridBehavior,
	behaviorForm: ProcurementPackageEventsFormBehavior,
});
