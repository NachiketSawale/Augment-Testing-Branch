import { EntityInfo } from '@libs/ui/business-base';
import { IPpsPhaseEntity } from '../../../model/process-configuration/pps-phase-entity.interface';
import { IEntitySelection } from '@libs/platform/data-access';
import { IPpsEntityInfoOptions } from '../../../model/pps-entity-info-options.interface';
import { runInInjectionContext } from '@angular/core';
import { IInitializationContext } from '@libs/platform/common';
import { ProductionplanningSharedPhaseDataService } from './pps-phase-data.service';
import { PpsPhaseLayoutService } from './pps-phase-layout.service';
import { PpsPhaseGridBehavior } from './pps-phase-grid-behavior.service';
import * as _ from 'lodash';
import { IPpsEntityWithProcessFk } from '../../../model/process-configuration/pps-entity-with-processfk.interface';
import { IPpsEntityWithPhaseToSaveToDelete } from '../../../model/process-configuration/pps-entity-with-phase2save2delete.interface';

export class ProductionplanningSharePhaseEntityInfoFactory {

	private static _dataServiceCache = new Map<string, IEntitySelection<IPpsPhaseEntity>>();

	public static getDataService<PT extends IPpsEntityWithProcessFk, PU extends IPpsEntityWithPhaseToSaveToDelete>(
		options: IPpsEntityInfoOptions<PT>,
		context: IInitializationContext,
	) {
		const key = options.moduleName ?? options.containerUuid;
		let instance = ProductionplanningSharePhaseEntityInfoFactory._dataServiceCache.get(key);
		if (!instance) {
			instance = runInInjectionContext(context.injector, () => new ProductionplanningSharedPhaseDataService<PT, PU>(
				options.parentServiceFn(context)
			));
			ProductionplanningSharePhaseEntityInfoFactory._dataServiceCache.set(key, instance);
		}
		return instance;
	}

	public static create<PT extends IPpsEntityWithProcessFk, PU extends IPpsEntityWithPhaseToSaveToDelete>(options: IPpsEntityInfoOptions<PT>): EntityInfo {
		return EntityInfo.create<IPpsPhaseEntity>({
			grid: {
				title: options.gridTitle,
				behavior: ctx => ctx.injector.get(PpsPhaseGridBehavior)
			},
			form: _.isEmpty(options.formTitle) || _.isEmpty(options.formContainerUuid)
				? undefined :
				{
					title: options.formTitle,
					containerUuid: options.formContainerUuid ?? ''
				}
			,
			dataService: (ctx) => {
				return ProductionplanningSharePhaseEntityInfoFactory.getDataService<PT, PU>(options, ctx);
			},
			dtoSchemeId: { moduleSubModule: 'Productionplanning.ProcessConfiguration', typeName: 'PpsPhaseDto' },
			layoutConfiguration: ctx => ctx.injector.get(PpsPhaseLayoutService).generateLayout(),
			permissionUuid: options.permissionUuid,
			prepareEntityContainer: async (ctx) => {
				await Promise.all([
					ctx.translateService.load(['productionplanning.common',
						'productionplanning.processconfiguration',
						'productionplanning.formwork']),
					// other promises...
				]);
			},

		});
	}

}