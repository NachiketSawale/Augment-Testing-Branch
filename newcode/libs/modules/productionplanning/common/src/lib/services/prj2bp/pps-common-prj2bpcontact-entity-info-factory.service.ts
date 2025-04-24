import { runInInjectionContext } from '@angular/core';
import { IInitializationContext } from '@libs/platform/common';
import { IEntityRuntimeDataRegistry, IEntitySelection } from '@libs/platform/data-access';
import { IPpsEntityInfoOptions } from '@libs/productionplanning/shared';
import { EntityInfo } from '@libs/ui/business-base';
import { isEmpty } from 'lodash';

import { IProjectMainPrj2BPContactEntity, IProjectMainPrj2BusinessPartnerEntity, PROJECT_MAIN_PRJ2BPCONTACT_LAYOUT_SERVICE_TOKEN } from '@libs/project/interfaces';
import { PpsCommonPrj2bpcontactGridBehavior } from '../../behaviors/pps-common-biz-prj2bpcontact-grid-behavior.service';
import { PpsCommonPrj2bpcontactDataServiceManager } from './pps-common-prj2bpcontact-data-service-manager.service';
import { PpsCommonPrj2bpcontactValidationService } from './pps-common-prj2bpcontact-validation.service';

export class PpsCommonPrj2bpcontactEntityInfoFactory {
	// public static create<PT extends IEntityIdentification>(options: IPpsEntityInfoOptions<PT>): EntityInfo {
	public static create(options: IPpsEntityInfoOptions<IProjectMainPrj2BusinessPartnerEntity>): EntityInfo {
		const getDataSrv = (ctx: IInitializationContext) => PpsCommonPrj2bpcontactDataServiceManager.getDataService({
			parentServiceFn: options.parentServiceFn,
			containerUuid: options.containerUuid,
		}, ctx);
		return EntityInfo.create<IProjectMainPrj2BPContactEntity>({
			grid: {
				title: options.gridTitle,
				containerUuid: options.containerUuid,
				behavior: ctx => ctx.injector.get(PpsCommonPrj2bpcontactGridBehavior)
			},
			form: isEmpty(options.formTitle) || isEmpty(options.formContainerUuid)
				? undefined :
				{
					title: options.formTitle,
					containerUuid: options.formContainerUuid ?? ''
				}
			,
			dataService: ctx => getDataSrv(ctx) as IEntitySelection<IProjectMainPrj2BPContactEntity>,
			validationService: ctx => runInInjectionContext(ctx.injector, () => {
				return new PpsCommonPrj2bpcontactValidationService(getDataSrv(ctx) as IEntityRuntimeDataRegistry<IProjectMainPrj2BPContactEntity>);
			}),
			dtoSchemeId: { moduleSubModule: 'Project.Main', typeName: 'Project2BusinessPartnerContactDto' },
			layoutConfiguration: async (ctx) => {
				const prj2bpcontactLayoutService = await ctx.lazyInjector.inject(PROJECT_MAIN_PRJ2BPCONTACT_LAYOUT_SERVICE_TOKEN);
				return prj2bpcontactLayoutService.generateLayout();
			},
			permissionUuid: options.permissionUuid,
			prepareEntityContainer: async (ctx) => {
				await Promise.all([
					ctx.translateService.load([/*'cloud.common',*/ 'businesspartner.main']),
					// other promises...
				]);
			},

		});
	}

}