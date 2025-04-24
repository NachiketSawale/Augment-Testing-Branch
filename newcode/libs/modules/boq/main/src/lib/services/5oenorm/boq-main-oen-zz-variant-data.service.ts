/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable, ProviderToken } from '@angular/core';
import {
	IDataServiceEndPointOptions,
	IDataServiceOptions,
	IDataServiceChildRoleOptions,
	DataServiceFlatNode,
	BaseValidationService,
	IValidationFunctions,
	PlatformSchemaService,
	ValidationServiceFactory,
	IEntityRuntimeDataRegistry
} from '@libs/platform/data-access';
import { ServiceRole } from '@libs/platform/data-access';
import { BoqMainOenZzDataService } from './boq-main-oen-zz-data.service';
import { IOenZzVariantEntity } from '../../model/entities/oen-zz-variant-entity.interface';
import { IOenZzEntity } from '../../model/entities/oen-zz-entity.interface';

@Injectable({providedIn: 'root'})
export class BoqMainOenZzVariantDataService extends DataServiceFlatNode<IOenZzVariantEntity, IOenZzEntity, IOenZzEntity, IOenZzEntity> {

	public constructor(private boqMainOenZzDataService: BoqMainOenZzDataService) {
		const options: IDataServiceOptions<IOenZzVariantEntity> = {
			apiUrl: 'boq/main/oen/lvheader',
			roleInfo: <IDataServiceChildRoleOptions<IOenZzVariantEntity,IOenZzEntity,IOenZzEntity>>{
				role: ServiceRole.Leaf,
				itemName: 'OenZzVariant',
				parent: boqMainOenZzDataService
			},
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'listzzvariant',
				prepareParam: () => {
					const zzItem = boqMainOenZzDataService.getSelectedEntity();
					return { zzId: zzItem?.Id };
				}
			},
			createInfo: <IDataServiceEndPointOptions>{
				endPoint: 'createzzvariant',
				usePost: true,
				prepareParam: () => {
					const zzItem = boqMainOenZzDataService.getSelectedEntity();
					return { Id : zzItem?.Id };
				}
			}
		};

		super(options);
	}
}

@Injectable({
	providedIn: 'root'
})
export class BoqMainOenZzVariantValidationService extends  BaseValidationService<IOenZzVariantEntity>{
	private validators: IValidationFunctions<IOenZzVariantEntity> | null = null;

	public constructor(protected dataService: BoqMainOenZzVariantDataService) {
		super();

		const schemaSvcToken: ProviderToken<PlatformSchemaService<IOenZzVariantEntity>> = PlatformSchemaService<IOenZzVariantEntity>;
		const platformSchemaService = inject(schemaSvcToken);

		platformSchemaService.getSchema({moduleSubModule: 'boq.main', typeName: 'OenZzDto'}).then(
			(scheme) => {
				this.validators = new ValidationServiceFactory<IOenZzVariantEntity>().provideValidationFunctionsFromScheme(scheme, this);
			}
		);
	}

	protected generateValidationFunctions(): IValidationFunctions<IOenZzVariantEntity> {
		if (!this.validators){
			return {};
		}
		return this.validators;
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IOenZzVariantEntity> {
		return this.dataService;
	}
}
