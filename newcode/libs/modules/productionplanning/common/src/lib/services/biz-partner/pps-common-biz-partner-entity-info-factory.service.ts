import { runInInjectionContext } from '@angular/core';
import { /*CompleteIdentification,*/ IEntityIdentification, IInitializationContext } from '@libs/platform/common';
import { IEntityRuntimeDataRegistry, IEntitySelection } from '@libs/platform/data-access';
import { EntityInfo } from '@libs/ui/business-base';
import { isEmpty } from 'lodash';
import { PpsCommonBizPartnerGridBehavior } from '../../behaviors/pps-common-biz-partner-grid-behavior.service';
import { IPpsCommonBizPartnerEntity } from '../../model/entities/pps-common-biz-partner-entity.interface';
import { IPpsCommonBizPartnerEntityInfoOptions } from '../../model/pps-common-biz-partner-entity-info-options.interface';
import { PpsCommonBizPartnerDataServiceManager } from './pps-common-biz-partner-data-service-manager.service';
import { PpsCommonBizPartnerValidationService } from './pps-common-biz-partner-validation.service';
import { PpsCommonBusinessPartnerLayoutConfiguration } from './pps-common-business-partner-layout.service';

export class PpsCommonBizPartnerEntityInfoFactory {
	public static create<PT extends IEntityIdentification>(options: IPpsCommonBizPartnerEntityInfoOptions<PT>): EntityInfo {
		const getDataSrv = (ctx: IInitializationContext) => PpsCommonBizPartnerDataServiceManager.getDataService<PT>(options, ctx);
		return EntityInfo.create<IPpsCommonBizPartnerEntity>({
			grid: {
				title: options.gridTitle,
				containerUuid: options.containerUuid,
				behavior: (ctx) => ctx.injector.get(PpsCommonBizPartnerGridBehavior),
			},
			form: isEmpty(options.formTitle) || isEmpty(options.formContainerUuid)
				? undefined :
				{
					title: options.formTitle,
					containerUuid: options.formContainerUuid ?? ''
				}
			,
			dataService: ctx => getDataSrv(ctx) as IEntitySelection<IPpsCommonBizPartnerEntity>,
			validationService: ctx => runInInjectionContext(ctx.injector, () => {
				return new PpsCommonBizPartnerValidationService(getDataSrv(ctx) as IEntityRuntimeDataRegistry<IPpsCommonBizPartnerEntity>);
			}),
			dtoSchemeId: { moduleSubModule: 'ProductionPlanning.Common', typeName: 'CommonBizPartnerDto' },

			layoutConfiguration: context => {
				return context.injector.get(PpsCommonBusinessPartnerLayoutConfiguration).generateLayout();
			},
			permissionUuid: options.permissionUuid,
			prepareEntityContainer: async (ctx) => {
				await Promise.all([
					ctx.translateService.load(['productionplanning.common', 'project.main']),
					// other promises...
				]);
			},

		});
	}

}