import { runInInjectionContext } from '@angular/core';
import { /*CompleteIdentification,*/ IEntityIdentification, IInitializationContext } from '@libs/platform/common';
import { EntityDomainType, IEntityRuntimeDataRegistry, IEntitySelection } from '@libs/platform/data-access';
import { EntityInfo } from '@libs/ui/business-base';
import { IPpsUserFormDataEntity } from '../../model/entities/pps-formdata-entity.interface';
import { IPpsFormdataEntityInfoOptions } from '../../model/pps-common-formdata-entity-info-options.interface';
import { PpsFormdataBehavior } from './pps-common-formdata-behavior.service';
import { PpsFormdataDataServiceManager } from './pps-common-formdata-data-service-manager.service';
import { PpsCommonFormdataLayoutService } from './pps-common-formdata-layout.service';
import { PpsCommonFormdataValidationService } from './pps-common-formdata-validation.service';

export class PpsFormdataEntityInfoFactory {
	public static create<PT extends IEntityIdentification>(options: IPpsFormdataEntityInfoOptions<PT>): EntityInfo {
		const getDataSrv = (ctx: IInitializationContext) => PpsFormdataDataServiceManager.getDataService<PT>(options, ctx);
		return EntityInfo.create<IPpsUserFormDataEntity>({
			grid: {
				title: options.gridTitle,
				containerUuid: options.containerUuid,
				behavior: (ctx) => ctx.injector.get(PpsFormdataBehavior),
			},
			dataService: ctx => getDataSrv(ctx) as IEntitySelection<IPpsUserFormDataEntity>,
			validationService: ctx => runInInjectionContext(ctx.injector, () => {
				return new PpsCommonFormdataValidationService(getDataSrv(ctx) as IEntityRuntimeDataRegistry<IPpsUserFormDataEntity>);
			}),
			dtoSchemeId: { moduleSubModule: 'Basics.UserForm', typeName: 'FormDataDto' },
			entitySchema: {
				schema: 'IPpsUserFormDataEntity',
				properties: {
					Belonging: { domain: EntityDomainType.Integer, mandatory: true },
					Id: {
						domain: EntityDomainType.Integer,
						mandatory: true
					},
					FormFk: {
						domain: EntityDomainType.Integer,
						mandatory: true
					},
					RubricFk: {
						domain: EntityDomainType.Integer,
						mandatory: true
					},
					IsReadonly: {
						domain: EntityDomainType.Boolean,
						mandatory: true
					},
					InsertedAt: {
						mandatory: true,
						domain: EntityDomainType.Date
					},
					InsertedBy: {
						mandatory: true,
						domain: EntityDomainType.Integer
					},
					UpdatedAt: {
						domain: EntityDomainType.Date,
						mandatory: true
					},
					UpdatedBy: {
						domain: EntityDomainType.Integer,
						mandatory: false
					},
					Version: {
						mandatory: true,
						domain: EntityDomainType.Integer
					},
					FormDataStatusFk: {
						domain: EntityDomainType.Integer,
						mandatory: true
					}
				},
				additionalProperties: {
					'FormDataIntersection.DescriptionInfo.Translated': {
						domain: EntityDomainType.Description,
						mandatory: false
					}
				}
			},
			layoutConfiguration: ctx => ctx.injector.get(PpsCommonFormdataLayoutService).generateLayout(),
			permissionUuid: options.permissionUuid,
			prepareEntityContainer: async (ctx) => {
				await Promise.all([
					ctx.translateService.load(['productionplanning.item']),
					// other promises...
				]);
			},

		});
	}

}