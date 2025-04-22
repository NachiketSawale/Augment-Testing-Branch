/*
 * Copyright(c) RIB Software GmbH
 */

import { runInInjectionContext } from '@angular/core';
import { CompleteIdentification, IEntityIdentification, IInitializationContext } from '@libs/platform/common';
import { EntityInfo } from '@libs/ui/business-base';
import { ProcurementCommonSalesTaxLayoutService } from '../../services/procurement-common-sales-tax-layout.service';
import { ProcurementCommonSalesTaxDataService } from '../../services/procurement-common-sales-tax-data.service';
import { IProcurementCommonSalesTaxEntity } from '../entities/procurement-common-sales-tax-entity.interface';
import { ProcurementCommonSalesTaxFormBehavior } from '../../behaviors/procurement-common-sales-tax-form-behavior.service';
import { ProcurementCommonSalesTaxGridBehavior } from '../../behaviors/procurement-common-sales-tax-grid-behavior.service';
import { ISalesTaxEntityInfoOptions, ISalesTaxSelection } from '../entities/procurement-common-sales-tax-info.interface';

/**
 * Procurement common Sales Tax entity info helper
 */
export class ProcurementCommonSalesTaxEntityInfo {
	private static _dataServiceCache = new Map<string, ISalesTaxSelection<IProcurementCommonSalesTaxEntity>>();

	/**
	 * Retrieve the data service from cache according to the container uuid.
	 * @param uuid containerUuid
	 */
	public static getDataServiceFromCache(uuid: string) {
		return ProcurementCommonSalesTaxEntityInfo._dataServiceCache.get(uuid);
	}

	private static getDataService<T extends IProcurementCommonSalesTaxEntity, PT extends IEntityIdentification, PU extends CompleteIdentification<PT>>(
		options: ISalesTaxEntityInfoOptions<T, PT, PU>,
		context: IInitializationContext,
	) {
		const uuid = options.containerUuid || options.permissionUuid;
		let instance = ProcurementCommonSalesTaxEntityInfo.getDataServiceFromCache(uuid);

		if (!instance) {
			instance = runInInjectionContext(context.injector, () => new ProcurementCommonSalesTaxDataService<T, PT, PU>(options.parentServiceFn(context)));
			ProcurementCommonSalesTaxEntityInfo._dataServiceCache.set(uuid, instance);
		}
		return instance as ProcurementCommonSalesTaxDataService<T, PT, PU>;
	}

	private static getBehavior<T extends IProcurementCommonSalesTaxEntity, PT extends IEntityIdentification, PU extends CompleteIdentification<PT>>(
		options: ISalesTaxEntityInfoOptions<T, PT, PU>,
		context: IInitializationContext,
	) {
		const dataService = ProcurementCommonSalesTaxEntityInfo.getDataService<T, PT, PU>(options, context);
		return runInInjectionContext(context.injector, () => new ProcurementCommonSalesTaxGridBehavior<T,PT,PU>(dataService));
	}

	/**
	 * Create a real procurement Sales Tax entity info configuration for different modules
	 */
	public static create<T extends IProcurementCommonSalesTaxEntity, PT extends IEntityIdentification, PU extends CompleteIdentification<T>>(config: ISalesTaxEntityInfoOptions<T, PT, PU>) {
		return EntityInfo.create<T>({
			grid: {
				title: {text: 'Sales Tax', key: 'procurement.common.saleTax.SalesTaxGridTitle'},
				behavior: context => {
					return ProcurementCommonSalesTaxEntityInfo.getBehavior<T, PT, PU>(config, context);
				}
			},
			form: {
				containerUuid: config.formUuid,
				title: {text: 'Sales Tax Detail', key: 'procurement.common.saleTax.SalesTaxDetailTitle'},
				behavior: context => context.injector.get(config.behaviorForm ?? ProcurementCommonSalesTaxFormBehavior)
			},
			dataService: (context) => context.injector.get(config.dataServiceToken),
			dtoSchemeId: {moduleSubModule: config.moduleSubModule ?? 'Procurement.Common', typeName: config.typeName ?? 'SalesTaxCodeDto'},
			permissionUuid: config.permissionUuid,
			layoutConfiguration: (context) => {
				return context.injector.get(ProcurementCommonSalesTaxLayoutService).generateConfig();
			},
		});
	}
}

