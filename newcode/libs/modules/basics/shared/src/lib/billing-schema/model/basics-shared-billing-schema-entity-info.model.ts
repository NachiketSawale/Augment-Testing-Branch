
/*
 * Copyright(c) RIB Software GmbH
 */
import {ProviderToken} from '@angular/core';
import { CompleteIdentification, IEntityIdentification} from '@libs/platform/common';
import {EntityInfo, IEntityContainerBehavior, IGridContainerLink} from '@libs/ui/business-base';
import { ICommonBillingSchemaEntity } from './interfaces/common-billing-schema-entity.interface';
import { CommonBillingSchemaDataService } from '../services/basics-shared-billing-schema.service';
import { BasicsSharedBillingSchemaLayoutService } from '../services/basics-shared-billing-schema-layout.service';

/**
 * common billing schema entity info helper
 */
export class BasicsSharedBillingSchemaEntityInfo {

	/**
	 * Create a real common billing schema entity info configuration for different modules
	 */
	public static create<T extends ICommonBillingSchemaEntity, PT extends IEntityIdentification, PU extends CompleteIdentification<PT>>(config: {
		/**
		 * Permission uuid in lower case
		 */
		permissionUuid: string,
		/**
		 * Data service
		 */
		dataServiceToken: ProviderToken<CommonBillingSchemaDataService<T, PT, PU>>,
		/**
		 * Container behavior
		 */
		behavior?: ProviderToken<IEntityContainerBehavior<IGridContainerLink<T>, T>>,
		/**
		 * Customize layout service by extending BasicsSharedBillingSchemaLayoutService
		 * Default is BasicsSharedBillingSchemaLayoutService
		 */
		layoutServiceToken?: ProviderToken<BasicsSharedBillingSchemaLayoutService>,
		/**
		 * Project fk getter
		 */
		projectFkGetter: (mainEntity: PT) => number | null | undefined;
	}) {
		return EntityInfo.create<T>({
			grid: {
				title: {text: 'Billing Schema', key: 'basics.commonbillingschema.billingSchemaGridTitle'},
				behavior: config.behavior ? context => context.injector.get(config.behavior!) : undefined
			},
			dataService: context => context.injector.get(config.dataServiceToken),
			dtoSchemeId: {moduleSubModule: 'Basics.BillingSchema', typeName: 'CommonBillingSchemaDto'},
			permissionUuid: config.permissionUuid,
			layoutConfiguration: context => {
				return context.injector.get(config.layoutServiceToken ?? BasicsSharedBillingSchemaLayoutService).generateLayout(context,{
					dataServiceToken: config.dataServiceToken,
					projectFkGetter: config.projectFkGetter
				});
			}
		});
	}

}