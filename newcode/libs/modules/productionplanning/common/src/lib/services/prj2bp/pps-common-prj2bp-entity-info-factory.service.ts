import { runInInjectionContext } from '@angular/core';
import { IEntityIdentification, IInitializationContext } from '@libs/platform/common';
import { IEntityRuntimeDataRegistry, IEntitySelection } from '@libs/platform/data-access';
import { IProjectMainPrj2BusinessPartnerEntity, PROJECT_MAIN_PRJ2BP_LAYOUT_SERVICE_TOKEN } from '@libs/project/interfaces';
import { EntityInfo } from '@libs/ui/business-base';
import { isEmpty } from 'lodash';
import { PpsCommonPrj2bpGridBehavior } from '../../behaviors/pps-common-biz-prj2bp-grid-behavior.service';
import { IPpsCommonPrj2bpEntityInfoOptions } from '../../model/pps-common-prj2bp-entity-info-options.interface';
import { PpsCommonPrj2bpDataServiceManager } from './pps-common-prj2bp-data-service-manager.service';
import { PpsCommonPrj2bpValidationService } from './pps-common-prj2bp-validation.service';

export class PpsCommonPrj2bpEntityInfoFactory {
	public static create<PT extends IEntityIdentification>(options: IPpsCommonPrj2bpEntityInfoOptions<PT>): EntityInfo {
		const getDataSrv = (ctx: IInitializationContext) => PpsCommonPrj2bpDataServiceManager.getDataService<PT>(options, ctx);
		return EntityInfo.create<IProjectMainPrj2BusinessPartnerEntity>({
			grid: {
				title: options.gridTitle,
				containerUuid: options.containerUuid,
				behavior: (ctx) => ctx.injector.get(PpsCommonPrj2bpGridBehavior),
			},
			form: isEmpty(options.formTitle) || isEmpty(options.formContainerUuid)
				? undefined :
				{
					title: options.formTitle,
					containerUuid: options.formContainerUuid ?? ''
				}
			,
			dataService: ctx => getDataSrv(ctx) as IEntitySelection<IProjectMainPrj2BusinessPartnerEntity>,
			validationService: ctx => runInInjectionContext(ctx.injector, () => {
				return new PpsCommonPrj2bpValidationService(getDataSrv(ctx) as IEntityRuntimeDataRegistry<IProjectMainPrj2BusinessPartnerEntity>);
			}),
			dtoSchemeId: { moduleSubModule: 'Project.Main', typeName: 'Project2BusinessPartnerDto' },
			layoutConfiguration: async (ctx) => {
				const prj2bpLayoutService = await ctx.lazyInjector.inject(PROJECT_MAIN_PRJ2BP_LAYOUT_SERVICE_TOKEN);
				return prj2bpLayoutService.generateLayout();
			},
			permissionUuid: options.permissionUuid,
			/* since translation for cloud.common(required for Prj2bp container) has been loaded, we needn't to prepareEntityContainer
			prepareEntityContainer: async (ctx) => {
				await Promise.all([
					ctx.translateService.load(['cloud.common']),
					// other promises...
				]);
			},
			*/

		});
	}

}