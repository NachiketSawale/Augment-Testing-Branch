/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { ResourceMaintenanceSchemaDataService } from './resource-maintenance-schema-data.service';
import { inject, ProviderToken } from '@angular/core';
import { BaseValidationService, IEntityRuntimeDataRegistry, IEntitySchema, IValidationFunctions, PlatformSchemaService, ValidationServiceFactory } from '@libs/platform/data-access';
import { IResourceMaintenanceSchemaEntity } from '@libs/resource/interfaces';

export class ResourceMaintenanceSchemaValidationGeneratedService extends BaseValidationService<IResourceMaintenanceSchemaEntity> {
	private autoValidators: IValidationFunctions<IResourceMaintenanceSchemaEntity> | null = null;
	protected handwrittenValidators: IValidationFunctions<IResourceMaintenanceSchemaEntity> | null = null;
	protected generatedValidators: IValidationFunctions<IResourceMaintenanceSchemaEntity> | null = null;
	public constructor(){
		super();

		const schemaSvcToken: ProviderToken<PlatformSchemaService<IResourceMaintenanceSchemaEntity>> = PlatformSchemaService<IResourceMaintenanceSchemaEntity>;
		const platformSchemaService = inject(schemaSvcToken);

		platformSchemaService.getSchema({moduleSubModule: 'Resource.Maintenance', typeName: 'MaintenanceSchemaDto'}).then(this.WriteToValidator);
	}
	private WriteToValidator(scheme : IEntitySchema<IResourceMaintenanceSchemaEntity>){
		this.autoValidators = new ValidationServiceFactory<IResourceMaintenanceSchemaEntity>().provideValidationFunctionsFromScheme(scheme, this);
	}
	public generateValidationFunctions(): IValidationFunctions<IResourceMaintenanceSchemaEntity> {
		const validators = {};
		this.generatedValidators = this.autoValidators !== null ? { ...this.autoValidators, ...validators } : validators;
		return { ...this.generatedValidators, ...this.handwrittenValidators };
	}
	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IResourceMaintenanceSchemaEntity> {
		return inject(ResourceMaintenanceSchemaDataService);
	}
}