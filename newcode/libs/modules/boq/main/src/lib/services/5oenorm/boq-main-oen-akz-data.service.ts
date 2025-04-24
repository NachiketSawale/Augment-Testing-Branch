/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable, ProviderToken } from '@angular/core';
import {
	DataServiceFlatLeaf,
	IDataServiceEndPointOptions,
	IDataServiceOptions,
	IDataServiceChildRoleOptions,
	BaseValidationService,
	IValidationFunctions,
	PlatformSchemaService,
	ValidationServiceFactory,
	IEntityRuntimeDataRegistry
} from '@libs/platform/data-access';
import { ServiceRole } from '@libs/platform/data-access';
import { IOenAkzEntity } from '../../model/entities/oen-akz-entity.interface';
import { IOenLvHeaderEntity } from '../../model/entities/oen-lv-header-entity.interface';
import { BoqMainOenLvheaderDataService } from './boq-main-oen-lvheader-data.service';

@Injectable({providedIn: 'root'})
export class BoqMainOenAkzDataService extends DataServiceFlatLeaf<IOenAkzEntity, IOenLvHeaderEntity, IOenLvHeaderEntity> {

	public constructor(private boqMainOenLvheaderDataService: BoqMainOenLvheaderDataService) {
		const options: IDataServiceOptions<IOenAkzEntity> = {
			apiUrl: 'boq/main/oen/lvheader',
			roleInfo: <IDataServiceChildRoleOptions<IOenAkzEntity,IOenLvHeaderEntity,IOenLvHeaderEntity>>{
				role: ServiceRole.Leaf,
				itemName: 'OenAkz',
				parent: boqMainOenLvheaderDataService
			},
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'listakz',
				prepareParam: () => {
					const lvHeader = boqMainOenLvheaderDataService.getSelectedEntity();
					return { lvHeaderId: lvHeader?.Id };
				}
			},
			createInfo: <IDataServiceEndPointOptions>{
				endPoint: 'createakz',
				usePost: true,
				prepareParam: () => {
					const lvHeader = boqMainOenLvheaderDataService.getSelectedEntity();
					return { Id : lvHeader?.Id };
				}
			}
		};

		super(options);
	}
}


@Injectable({
	providedIn: 'root'
})

export class boqMainOenAkzValidationService extends  BaseValidationService<IOenAkzEntity>{
	private validators: IValidationFunctions<IOenAkzEntity> | null = null;

	public constructor(protected dataService: BoqMainOenAkzDataService) {
		super();

		const schemaSvcToken: ProviderToken<PlatformSchemaService<IOenAkzEntity>> = PlatformSchemaService<IOenAkzEntity>;
		const platformSchemaService = inject(schemaSvcToken);

		platformSchemaService.getSchema({moduleSubModule: 'boq.main', typeName: 'OenAkzDto'}).then(
			(scheme) => {
				this.validators = new ValidationServiceFactory<IOenAkzEntity>().provideValidationFunctionsFromScheme(scheme, this);
			}
		);
	}

	protected generateValidationFunctions(): IValidationFunctions<IOenAkzEntity> {
		if (!this.validators){
			return {};
		}
		return this.validators;
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IOenAkzEntity> {
		return this.dataService;
	}
}
