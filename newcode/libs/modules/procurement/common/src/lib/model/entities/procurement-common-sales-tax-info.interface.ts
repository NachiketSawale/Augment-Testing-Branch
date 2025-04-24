/*
 * Copyright(c) RIB Software GmbH
 */

import { IProcurementCommonSalesTaxEntity } from '../entities/procurement-common-sales-tax-entity.interface';
import { CompleteIdentification, IEntityIdentification, IInitializationContext } from '@libs/platform/common';
import { ProviderToken } from '@angular/core';
import { IReadonlyParentService } from '@libs/procurement/shared';
import { ProcurementCommonSalesTaxLayoutService } from '../../services/procurement-common-sales-tax-layout.service';
import { IEntityContainerBehavior, IFormContainerLink, IGridContainerLink } from '@libs/ui/business-base';
import { IEntitySelection } from '@libs/platform/data-access';
import { ProcurementCommonSalesTaxDataService } from '../../services/procurement-common-sales-tax-data.service';

export interface ISalesTaxEntityInfoOptions<T extends IProcurementCommonSalesTaxEntity, PT extends IEntityIdentification, PU extends CompleteIdentification<PT>> {
	/**
	 * Permission uuid in lower case
	 */
	permissionUuid: string;
	/**
	 * grid uuid in lower case
	 */
	containerUuid?: string;
	/**
	 * Form uuid in lower case
	 */
	formUuid: string;
	/**
	 * module SubModule
	 */
	moduleSubModule?: string,
	/**
	 * entity type Name
	 */
	typeName?: string,
	/**
	 * Data service
	 */
	dataServiceToken: ProviderToken<ProcurementCommonSalesTaxDataService<T, PT, PU>>;
	/**
	 * Parent service provide function.
	 * @param context
	 */
	parentServiceFn: (context: IInitializationContext) => IReadonlyParentService<PT, PU>;
	/**
	 * Customize layout service by extending ProcurementCommon Sales Tax LayoutService
	 * Default is ProcurementCommon Sales Tax LayoutService
	 */
	layoutServiceToken?: ProviderToken<ProcurementCommonSalesTaxLayoutService>;
	/**
	 * Gird Container behavior
	 */
	behaviorGrid?: ProviderToken<IEntityContainerBehavior<IGridContainerLink<T>, T>>,
	/**
	 * Form Container behavior
	 */
	behaviorForm?: ProviderToken<IEntityContainerBehavior<IFormContainerLink<T>, T>>,
}

export interface ISalesTaxSelection<T> extends IEntitySelection<T> {
	disabled(): boolean

	recalculate(isRest: boolean | null): void
}
