/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */
import {
	BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions, PlatformSchemaService, ValidationServiceFactory
} from '@libs/platform/data-access';
import { inject, Injectable, ProviderToken } from '@angular/core';
import { IProjectMainBusinessPartnerSiteEntity } from '@libs/project/interfaces';
import { ProjectMainBusinessPartnerSiteDataService } from './project-main-business-partner-site-data.service';

@Injectable({
	providedIn: 'root'
})

export class ProjectMainBusinessPartnerSiteValidationService extends BaseValidationService<IProjectMainBusinessPartnerSiteEntity> {
	private projectMainBpSiteValidators: IValidationFunctions<IProjectMainBusinessPartnerSiteEntity> | null = null;

	public constructor() {
		super();
		const schemaSvcToken: ProviderToken<PlatformSchemaService<IProjectMainBusinessPartnerSiteEntity>> = PlatformSchemaService<IProjectMainBusinessPartnerSiteEntity>;
		const platformSchemaService = inject(schemaSvcToken);

		// eslint-disable-next-line @typescript-eslint/no-this-alias
		const self = this;

		platformSchemaService.getSchema({moduleSubModule: 'Project.Main', typeName: 'BusinessPartnerSites'}).then(
			function(scheme) {
				self.projectMainBpSiteValidators = new ValidationServiceFactory<IProjectMainBusinessPartnerSiteEntity>().provideValidationFunctionsFromScheme(scheme, self);
			});
	}

	protected generateValidationFunctions(): IValidationFunctions<IProjectMainBusinessPartnerSiteEntity> {
		if(this.projectMainBpSiteValidators !== null) {
			return this.projectMainBpSiteValidators;
		}

		return {};
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IProjectMainBusinessPartnerSiteEntity> {
		return inject(ProjectMainBusinessPartnerSiteDataService);
	}
}