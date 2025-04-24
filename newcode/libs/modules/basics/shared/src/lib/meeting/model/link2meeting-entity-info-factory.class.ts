import { CompleteIdentification, IEntityIdentification } from '@libs/platform/common';
import { EntityInfo } from '@libs/ui/business-base';
import { IMtgHeaderEntity } from '@libs/basics/interfaces';
import { BasicsSharedMeetingLayoutService } from '../services/basics-shared-meeting-layout.service';
import { ILink2MeetingEntityInfoOptions } from './link2meeting-options.interface';
import { BasicsSharedMeetingStatusLookupService } from '../../lookup-services/customize';
import { BasicsSharedLink2MeetingDataServiceManager } from '../services/link2meeting-data-service-manager.service';

/**
 * create meeting entity info factory service.
 */
export class BasicsSharedLink2MeetingEntityInfoFactory {
	/**
	 * Create Meeting Entity Info for container "Meeting".
	 * @param options options for creation.
	 * @typeParam PT - entity type handled by the parent data service
	 * @typeParam PU - complete entity of the parent data service for storage of own (complete) entities
	 */
	public static create<PT extends IEntityIdentification, PU extends CompleteIdentification<PT> = CompleteIdentification<PT>>(options: ILink2MeetingEntityInfoOptions<PT>): EntityInfo {
		return EntityInfo.create<IMtgHeaderEntity>({
			grid: {
				containerUuid: options.containerUuid,
				title: options.gridTitle || { text: 'Meeting', key: 'basics.meeting.entityMeetingTitle' },
				behavior: (ctx) => {
					return BasicsSharedLink2MeetingDataServiceManager.getBehavior<PT, PU>(options, ctx);
				},
			},
			form: {
				containerUuid: options.formContainerUuid,
				title: options.formTitle || { text: 'Meeting Details', key: 'basics.meeting.entityMeetingDetailTitle' },
			},
			dataService: (ctx) => {
				return BasicsSharedLink2MeetingDataServiceManager.getDataService<PT, PU>(options, ctx);
			},
			dtoSchemeId: {
				moduleSubModule: 'Basics.Meeting',
				typeName: 'MtgHeaderDto',
			},
			permissionUuid: options.permissionUuid,
			layoutConfiguration: async (ctx) => {
				return ctx.injector.get(BasicsSharedMeetingLayoutService).generateLayout();
			},
			prepareEntityContainer: async (ctx) => {
				const statusService = ctx.injector.get(BasicsSharedMeetingStatusLookupService);
				await Promise.all([statusService.getList()]);
			},
		});
	}
}
