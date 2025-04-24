/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { ResourceMaintenanceSchemaRecordDataService } from './resource-maintenance-schema-record-data.service';
import { inject, ProviderToken } from '@angular/core';
import { BaseValidationService, IEntityRuntimeDataRegistry, IEntitySchema, IValidationFunctions, PlatformSchemaService, ValidationServiceFactory } from '@libs/platform/data-access';
import { IResourceMaintenanceSchemaRecordEntity } from '@libs/resource/interfaces';

export class ResourceMaintenanceSchemaRecordValidationGeneratedService extends BaseValidationService<IResourceMaintenanceSchemaRecordEntity> {
	private autoValidators: IValidationFunctions<IResourceMaintenanceSchemaRecordEntity> | null = null;
	protected handwrittenValidators: IValidationFunctions<IResourceMaintenanceSchemaRecordEntity> | null = null;
	protected generatedValidators: IValidationFunctions<IResourceMaintenanceSchemaRecordEntity> | null = null;
	public constructor(){
		super();

		const schemaSvcToken: ProviderToken<PlatformSchemaService<IResourceMaintenanceSchemaRecordEntity>> = PlatformSchemaService<IResourceMaintenanceSchemaRecordEntity>;
		const platformSchemaService = inject(schemaSvcToken);

		platformSchemaService.getSchema({moduleSubModule: 'Resource.Maintenance', typeName: 'MaintenanceSchemaRecordDto'}).then(this.WriteToValidator);
	}
	private WriteToValidator(scheme : IEntitySchema<IResourceMaintenanceSchemaRecordEntity>){
		this.autoValidators = new ValidationServiceFactory<IResourceMaintenanceSchemaRecordEntity>().provideValidationFunctionsFromScheme(scheme, this);
	}
	public generateValidationFunctions(): IValidationFunctions<IResourceMaintenanceSchemaRecordEntity> {
		const validators = {};
		this.generatedValidators = this.autoValidators !== null ? { ...this.autoValidators, ...validators } : validators;
		return { ...this.generatedValidators, ...this.handwrittenValidators };
	}
	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IResourceMaintenanceSchemaRecordEntity> {
		return inject(ResourceMaintenanceSchemaRecordDataService);
	}
}