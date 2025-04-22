import { ActivityEntityInfo } from '@libs/businesspartner/shared';
import { ActivityDataService } from '../../services/activity-data.service';

export const ACTIVITY_ENTITY_INFO = ActivityEntityInfo.create({
	dataServiceToken: ActivityDataService,
});
