/*
 * Copyright(c) RIB Software GmbH
 */

import {ProviderToken} from '@angular/core';
import {CompleteIdentification, IEntityIdentification} from '@libs/platform/common';
import { EntityInfo, IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import { BasicsSharedPostConHistoryLayout } from '../../services/basics-shared-postcon-history-layout.service';
import { IBasicsSharedPostConHistoryEntity } from '../entities/basics-shared-postcon-history-entity.interface';
import { BasicsSharedPostConHistoryBehavior } from '../../behaviors/basics-shared-postcon-history-behavior.service';
import { BasicsSharedPostConHistoryDataService } from '../../services/basics-shared-postcon-history-data.service';

/**
 * basics shared postcon history entity info helper
 */
export class BasicsSharedPostConHistoryEntityInfo {

	/**
	 * Create a real basics shared postcon history entity info configuration for different modules
	 */
	public static create<T extends IBasicsSharedPostConHistoryEntity, PT extends IEntityIdentification, PU extends CompleteIdentification<PT>>(config: {
		/**
		 * Permission uuid in lower case
		 */
		permissionUuid: string,
		/**
		 * Form uuid in lower case
		 */
		formUuid: string;
		/**
		 * behaviorGrid
		 */
		behaviorGrid?: ProviderToken<IEntityContainerBehavior<IGridContainerLink<T>, T>>,
		/**
		 * Data service
		 */
		dataServiceToken: ProviderToken<BasicsSharedPostConHistoryDataService<T,PT, PU>>,

	}) {
		return EntityInfo.create<T>({
			grid: {
				title: {text: 'History', key: 'procurement.common.listPostconHistoryTitle'},
				behavior:ctx=>ctx.injector.get(config.behaviorGrid ?? BasicsSharedPostConHistoryBehavior<T,PT, PU>)
			},
			form: {
				containerUuid: config.formUuid,
				title: {text: 'History Detail', key: 'procurement.common.detailPostconHistoryTitle'},
			},
			dataService: context => context.injector.get(config.dataServiceToken),
			dtoSchemeId: {moduleSubModule: 'Procurement.Common', typeName: 'PrcPostconHistoryDto'},
			permissionUuid: config.permissionUuid,
			layoutConfiguration: context => {
				return context.injector.get(BasicsSharedPostConHistoryLayout).generateConfig();
			}
		});
	}
}