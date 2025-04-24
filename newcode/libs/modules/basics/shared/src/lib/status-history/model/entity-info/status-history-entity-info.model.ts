/*
 * Copyright(c) RIB Software GmbH
 */
import { ProviderToken } from '@angular/core';

import { EntityInfo } from '@libs/ui/business-base';
import { CompleteIdentification, IEntityIdentification } from '@libs/platform/common';

import { BasicsSharedSatusHistoryDataService } from '../../services/status-history-data.service';
import { BasicsSharedStatusHistoryLayoutService } from '../../services/status-history-layout.service';
import { IStatusHistoryEntity } from '../entities/status-history-entity.interface';

/**
 * Represents the entity info to handle common Satus History entity info helper
 */
export class BasicsSharedSatusHistoryEntityInfo {
	/**
	 * Create a real procurement SatusHistory entity info configuration for different modules
	 */
	public static create<T extends IStatusHistoryEntity, PT extends IEntityIdentification, PU extends CompleteIdentification<T> >(config: {
		/**
		 * Data service
		 */
		dataServiceToken: ProviderToken<BasicsSharedSatusHistoryDataService<T, PT, PU>>;
		/**
         * Gird Container behavior
         */
		
	}) {
		return EntityInfo.create<T>({
			grid: {
				title: { text: 'Satus History', key: 'basics.common.entityStatusHistoryTitle' },
			},
			dataService: (context) => context.injector.get(config.dataServiceToken),
			dtoSchemeId: { moduleSubModule: 'Basics.Common', typeName: 'StatusHistoryDto' },
			permissionUuid: 'bcb8622d676944edb5f113fd524608b6',
			layoutConfiguration: context => {
                return context.injector.get(BasicsSharedStatusHistoryLayoutService).generateConfig(context);
            }
		});
	}
}

