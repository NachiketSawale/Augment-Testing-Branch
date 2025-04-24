/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions, PlatformSchemaService, ValidationInfo, ValidationResult, ValidationServiceFactory } from '@libs/platform/data-access';
import { IProjectGroupEntity } from '@libs/project/interfaces';
import { inject, InjectionToken, ProviderToken } from '@angular/core';
import { ProjectGroupDataService } from './project-group-data.service';

export const PROJECT_GROUP_VALIDATION_TOKEN = new InjectionToken<ProjectGroupValidationService>('projectGroupValidationToken');

export class ProjectGroupValidationService extends BaseValidationService<IProjectGroupEntity> {
	private  prjGroupDataService: ProjectGroupDataService = inject(ProjectGroupDataService);
	private prjGroupValidators: IValidationFunctions<IProjectGroupEntity> | null = null;

	public constructor() {
		super();

		const schemaSvcToken: ProviderToken<PlatformSchemaService<IProjectGroupEntity>> = PlatformSchemaService<IProjectGroupEntity>;
		const platformSchemaService = inject(schemaSvcToken);

		// eslint-disable-next-line @typescript-eslint/no-this-alias
		const self = this;

		platformSchemaService.getSchema({moduleSubModule: 'Project.Group', typeName: 'ProjectGroupDto'}).then(
			function(scheme) {
				self.prjGroupValidators = new ValidationServiceFactory<IProjectGroupEntity>().provideValidationFunctionsFromScheme(scheme, self);
			});
	}

	protected generateValidationFunctions(): IValidationFunctions<IProjectGroupEntity> {
		if(this.prjGroupValidators !== null) {
			return this.prjGroupValidators;
		}

		return {};
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IProjectGroupEntity> {
		return inject(ProjectGroupDataService);
	}

	protected validateIsDefault(info: ValidationInfo<IProjectGroupEntity>): ValidationResult {
		if(info.value){
			const items = this.prjGroupDataService.getList();

			items.forEach( item => {
				const notify = item.IsDefault;
				item.IsDefault = false;
				item.IsDefaultHasBeenChecked = false;
				if(notify){
					this.prjGroupDataService.setModified(item);
				}
			});

			info.entity.IsDefaultHasBeenChecked = true;
		}

		return {valid: true, apply: true};
	}

	protected validateAdditionalCode(info: ValidationInfo<IProjectGroupEntity>) {
		const parent = this.prjGroupDataService.parentOf(info.entity);
		const parentPath = parent == null ? '\\' : parent.UncPath + '\\';
		info.entity.UncPath = parentPath + info.value;
	}

	protected validateITwoBaselineServerFk(info: ValidationInfo<IProjectGroupEntity>): ValidationResult {
		if(!info.entity.IsAutoIntegration){
			return {valid: true};
		}
		return this.validateIsMandatory(info);
	}
}