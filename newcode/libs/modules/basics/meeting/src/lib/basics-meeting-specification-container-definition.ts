/*
 * Copyright(c) RIB Software GmbH
 */
import { ServiceLocator } from '@libs/platform/common';
import { runInInjectionContext } from '@angular/core';
import { BasicsMeetingSpecificationComponent } from './components/specification/basics-meeting-specification.component';
import { EntityContainerInjectionTokens } from '@libs/ui/business-base';
import { BlobsEntity } from '@libs/basics/shared';
import { BasicsMeetingSpecificationDataService } from './services/Basics-meeting-specification-data.service';

export class BasicsMeetingMinutesContainerDefinition {
	private readonly definition = {
		uuid: '9d2776a8598f46519aa4bb277ebba63d',
		id: 'basics.meeting.minutes',
		title: {
			text: 'Minutes',
			key: 'basics.meeting.specification.title',
		},
		containerType: BasicsMeetingSpecificationComponent,
		permission: '01a52cc968494eacace7669fb996bc72',
		providers: [
			{
				provide: new EntityContainerInjectionTokens<BlobsEntity>().dataServiceToken,
				useExisting: BasicsMeetingSpecificationDataService,
			},
		],
	};

	public getDefinition() {
		return this.definition;
	}
}

export const BASICS_MEETING_MINUTES_CONTAINER_DEFINITION = runInInjectionContext(ServiceLocator.injector, () => new BasicsMeetingMinutesContainerDefinition().getDefinition());
