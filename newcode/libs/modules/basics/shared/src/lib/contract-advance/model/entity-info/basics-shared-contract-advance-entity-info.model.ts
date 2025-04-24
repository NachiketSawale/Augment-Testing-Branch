/*
 * Copyright(c) RIB Software GmbH
 */

import { ProviderToken } from '@angular/core';
import { CompleteIdentification, IEntityIdentification } from '@libs/platform/common';
import { ContainerLayoutConfiguration, EntityInfo } from '@libs/ui/business-base';
import { BasicsSharedContractAdvanceDataService } from '../../services/basics-shared-contract-advance-data.service';

/**
 * Procurement Shared Advance entity info helper
 */
export class BasicsSharedContractAdvanceEntityInfo {
	/**
	 * Create a real procurement Advance entity info configuration for different modules
	 */
	public static create<T extends object, PT extends IEntityIdentification, PU extends CompleteIdentification<PT>>(config: {
		/**
		 * Permission uuid in lower case
		 */
		permissionUuid: string;
		/**
		 * Form uuid in lower case
		 */
		formUuid: string;
		/**
		 * Data service
		 */
		dataServiceToken: ProviderToken<BasicsSharedContractAdvanceDataService<T, PT, PU>>;
		/**
		 * Customize layout service by extending Procurement Advance LayoutService
		 * Default is Procurement Advance LayoutService
		 */
		layout: ContainerLayoutConfiguration<T>;
		/**
		 * moduleSubModule
		 */
		moduleSubModule: string;
		/**
		 * typeName
		 */
		typeName: string;
	}) {
		return EntityInfo.create<T>({
			grid: {
				title: { text: 'Advances', key: 'basics.common.advanceGridTitle' },
			},
			form: {
				containerUuid: config.formUuid,
				title: { text: 'Advance Detail', key: 'basics.common.advanceFormTitle' },
			},
			dataService: (context) => context.injector.get(config.dataServiceToken),
			dtoSchemeId: { moduleSubModule: config.moduleSubModule, typeName: config.typeName },
			permissionUuid: config.permissionUuid,
			layoutConfiguration: config.layout,
		});
	}
}
