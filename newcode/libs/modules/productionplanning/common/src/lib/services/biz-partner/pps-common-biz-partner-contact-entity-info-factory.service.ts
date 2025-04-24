import { runInInjectionContext } from '@angular/core';
import { IInitializationContext } from '@libs/platform/common';
import { IEntityRuntimeDataRegistry, IEntitySelection } from '@libs/platform/data-access';
import { IPpsEntityInfoOptions } from '@libs/productionplanning/shared';
import { EntityInfo } from '@libs/ui/business-base';
import { isEmpty } from 'lodash';
import { PpsCommonBizPartnerContactGridBehavior } from '../../behaviors/pps-common-biz-partner-contact-grid-behavior.service';
import { IPpsCommonBizPartnerContactEntity } from '../../model/entities/pps-common-biz-partner-contact-entity.interface';
import { IPpsCommonBizPartnerEntity } from '../../model/entities/pps-common-biz-partner-entity.interface';
import { PpsCommonBizPartnerContactDataServiceManager } from './pps-common-biz-partner-contact-data-service-manager.service';
import { PpsCommonBizPartnerContactLayoutService } from './pps-common-biz-partner-contact-layout.service';
import { PpsCommonBizPartnerContactValidationService } from './pps-common-biz-partner-contact-validation.service';

export class PpsCommonBizPartnerContactEntityInfoFactory {
	// public static create<PT extends IEntityIdentification>(options: IPpsEntityInfoOptions<PT>): EntityInfo {
	public static create(options: IPpsEntityInfoOptions<IPpsCommonBizPartnerEntity>): EntityInfo {
		const getDataSrv = (ctx: IInitializationContext) => PpsCommonBizPartnerContactDataServiceManager.getDataService({
			parentServiceFn: options.parentServiceFn,
			containerUuid: options.containerUuid,
		}, ctx);
		return EntityInfo.create<IPpsCommonBizPartnerContactEntity>({
			grid: {
				title: options.gridTitle,
				containerUuid: options.containerUuid,
				behavior: ctx => ctx.injector.get(PpsCommonBizPartnerContactGridBehavior)
			},
			form: isEmpty(options.formTitle) || isEmpty(options.formContainerUuid)
				? undefined :
				{
					title: options.formTitle,
					containerUuid: options.formContainerUuid ?? ''
				}
			,
			dataService: ctx => getDataSrv(ctx) as IEntitySelection<IPpsCommonBizPartnerContactEntity>,
			validationService: ctx => runInInjectionContext(ctx.injector, () => {
				return new PpsCommonBizPartnerContactValidationService(getDataSrv(ctx) as IEntityRuntimeDataRegistry<IPpsCommonBizPartnerContactEntity>);
			}),
			dtoSchemeId: { moduleSubModule: 'ProductionPlanning.Common', typeName: 'CommonBizPartnerContactDto' },
			layoutConfiguration: context => {
				return context.injector.get(PpsCommonBizPartnerContactLayoutService).generateLayout();
			},
			permissionUuid: options.permissionUuid,
			prepareEntityContainer: async (ctx) => {
				await Promise.all([
					ctx.translateService.load(['basics.customize', 'basics.clerk', 'businesspartner.main', 'project.main', 'productionplanning.common']),
					// other promises...
				]);
			},

		});
	}

}