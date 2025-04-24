/*
 * Copyright(c) RIB Software GmbH
 */

import { find } from 'lodash';
import { firstValueFrom, of } from 'rxjs';
import { inject, Injectable } from '@angular/core';
import { PlatformHttpService } from '@libs/platform/common';
import { BasicsSharedCompanyContextService } from '../../services';
import { IMaterialFilterResultDisplayConfig, IMaterialFilterResultDisplayConfigInCompany } from '../model';

/**
 * Material filter result display configuration service
 */
@Injectable({
	providedIn: 'root'
})
export class BasicsSharedMaterialFilterResultDisplayConfigService {
	private readonly filterName = 'dialogSearchOptions';
	private readonly httpService = inject(PlatformHttpService);
	private readonly companyContextService = inject(BasicsSharedCompanyContextService);

	private loadedConfig = false;
	private configDef: IMaterialFilterResultDisplayConfigInCompany[] = [];

	/**
	 * Loads material lookup result display definition
	 */
	public async loadResultDisplayConfig(): Promise<IMaterialFilterResultDisplayConfig | null> {
		if (this.loadedConfig) {
			return firstValueFrom(of(this.displayConfigHandler(this.configDef)));
		}

		return this.httpService.get<{ FilterDef?: string | undefined }>('basics/material/getmaterialdefinitions', {
			params: {filterName: this.filterName}
		}).then((res) => {
			this.loadedConfig = true;
			this.configDef = res?.FilterDef ? JSON.parse(res.FilterDef) : [];
			return this.displayConfigHandler(this.configDef);
		});
	}

	public postMaterialSearchOption(config: Partial<IMaterialFilterResultDisplayConfig>) {
		const loginCompanyId = this.companyContextService.loginCompanyEntity!.Id;
		let optionInLoginCompany = find(this.configDef, {loginCompany: loginCompanyId});

		if (optionInLoginCompany) {
			optionInLoginCompany.config = {...optionInLoginCompany.config, ...config};
		} else {
			optionInLoginCompany = {
				loginCompany: loginCompanyId,
				config: config
			};
			this.configDef.push(optionInLoginCompany);
		}

		this.saveMaterialDefinitions(this.configDef);
	}

	private saveMaterialDefinitions(config: IMaterialFilterResultDisplayConfigInCompany[]) {
		this.httpService.post('basics/material/savematerialdefinition', {
			FilterName: this.filterName,
			AccessLevel: 'User',
			FilterDef: JSON.stringify(config)
		});
	}

	private displayConfigHandler(definitions: IMaterialFilterResultDisplayConfigInCompany[]): IMaterialFilterResultDisplayConfig | null {
		const definition = definitions.find(def => {
			return def.loginCompany === this.companyContextService.loginCompanyEntity!.Id;
		});

		if (!definition?.config) {
			return null;
		}

		return {
			sortOption: definition.config.sortOption,
			itemsPerPage: definition.config.itemsPerPage,
			showImageInPreview: definition.config.showImageInPreview,
			previewAttributes: definition.config.previewAttributes,
			isFilterByHeaderStructure: definition.config.isFilterByHeaderStructure
		};
	}
}