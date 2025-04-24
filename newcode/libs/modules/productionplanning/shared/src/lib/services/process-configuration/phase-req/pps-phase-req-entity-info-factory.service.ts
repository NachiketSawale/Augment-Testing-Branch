import { EntityInfo } from '@libs/ui/business-base';
import { IPpsPhaseRequirementEntity } from '../../../model/process-configuration/pps-phase-requirement-entity.interface';
import { IEntitySelection } from '@libs/platform/data-access';
import { IPpsEntityInfoOptions } from '../../../model/pps-entity-info-options.interface';
import { runInInjectionContext } from '@angular/core';
import { IInitializationContext } from '@libs/platform/common';
import { ProductionplanningSharedPhaseRequirementDataService } from './pps-phase-req-data.service';
import { PpsPhaseRequirementLayoutService } from './pps-phase-req-layout.service';
import { PpsPhaseRequirementGridBehavior } from './pps-phase-req-grid-behavior.service';
import * as _ from 'lodash';
import { IPpsPhaseEntity } from '../../../model/process-configuration/pps-phase-entity.interface';
import { PpsPhaseComplete } from '../../../model/process-configuration/pps-phase-complete.class';

export class ProductionplanningSharePhaseRequirementEntityInfoFactory {

	private static _dataServiceCache = new Map<string, IEntitySelection<IPpsPhaseRequirementEntity>>();

	public static getDataService<PT extends IPpsPhaseEntity, PU extends PpsPhaseComplete>(
		options: IPpsEntityInfoOptions<IPpsPhaseEntity>,
		context: IInitializationContext,
	) {
		const key = options.moduleName ?? options.containerUuid;
		let instance = ProductionplanningSharePhaseRequirementEntityInfoFactory._dataServiceCache.get(key);
		if (!instance) {
			instance = runInInjectionContext(context.injector, () => new ProductionplanningSharedPhaseRequirementDataService<PT, PU>(
				options.parentServiceFn(context)
			));
			ProductionplanningSharePhaseRequirementEntityInfoFactory._dataServiceCache.set(key, instance);
		}
		return instance;
	}

	public static create<PT extends IPpsPhaseEntity, PU extends PpsPhaseComplete>(options: IPpsEntityInfoOptions<IPpsPhaseEntity>): EntityInfo {
		return EntityInfo.create<IPpsPhaseRequirementEntity>({
			grid: {
				title: options.gridTitle,
				behavior: ctx => ctx.injector.get(PpsPhaseRequirementGridBehavior)
			},
			form: (_.isEmpty(options.formTitle) || _.isEmpty(options.formContainerUuid))
				? undefined :
				{
					title: options.formTitle,
					containerUuid: options.formContainerUuid ?? ''
				}
				,
			dataService: (ctx) => {
				return ProductionplanningSharePhaseRequirementEntityInfoFactory.getDataService<PT, PU>(options, ctx);
			},
			dtoSchemeId: { moduleSubModule: 'Productionplanning.ProcessConfiguration', typeName: 'PpsPhaseRequirementDto' },
			layoutConfiguration: ctx => ctx.injector.get(PpsPhaseRequirementLayoutService).generateLayout(),
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