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
import { BoqMainOenLvheaderDataService } from './boq-main-oen-lvheader-data.service';
import { IOenZzEntity } from '../../model/entities/oen-zz-entity.interface';
import { IOenLvHeaderEntity } from '../../model/entities/oen-lv-header-entity.interface';

@Injectable({providedIn: 'root'})
export class BoqMainOenZzDataService extends DataServiceFlatNode<IOenZzEntity, IOenLvHeaderEntity, IOenLvHeaderEntity, IOenLvHeaderEntity> {

	public constructor(private boqMainOenLvheaderDataService: BoqMainOenLvheaderDataService) {
		const options: IDataServiceOptions<IOenZzEntity> = {
			apiUrl: 'boq/main/oen/lvheader',
			roleInfo: <IDataServiceChildRoleOptions<IOenZzEntity,IOenLvHeaderEntity,IOenLvHeaderEntity>>{
				role: ServiceRole.Node,
				itemName: 'OenZz',
				parent: boqMainOenLvheaderDataService
			},
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'listzz',
				prepareParam: () => {
					const lvHeader = boqMainOenLvheaderDataService.getSelectedEntity();
					return { lvHeaderId: lvHeader?.Id };
				}
			},
			createInfo: <IDataServiceEndPointOptions>{
				endPoint: 'createzz',
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
export class BoqMainOenZzValidationService extends  BaseValidationService<IOenZzEntity>{
	private validators: IValidationFunctions<IOenZzEntity> | null = null;

	public constructor(protected dataService: BoqMainOenZzDataService) {
		super();

		const schemaSvcToken: ProviderToken<PlatformSchemaService<IOenZzEntity>> = PlatformSchemaService<IOenZzEntity>;
		const platformSchemaService = inject(schemaSvcToken);

		platformSchemaService.getSchema({moduleSubModule: 'boq.main', typeName: 'OenZzDto'}).then(
			(scheme) => {
				this.validators = new ValidationServiceFactory<IOenZzEntity>().provideValidationFunctionsFromScheme(scheme, this);
			}
		);
	}

	protected generateValidationFunctions(): IValidationFunctions<IOenZzEntity> {
		if (!this.validators){
			return {};
		}
		return this.validators;
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IOenZzEntity> {
		return this.dataService;
	}
}
