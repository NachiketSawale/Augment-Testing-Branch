/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { PlatformConfigurationService, PlatformHttpService } from '@libs/platform/common';
import { ModelProjectModelDataService } from './model-data.service';

/**
 * Manges integration functionality with the Autodesk Revit software package.
 */
@Injectable({
	providedIn: 'root'
})
export class ModelProjectRevitService {

	private readonly modelDataSvc = inject(ModelProjectModelDataService);

	private readonly httpSvc = inject(PlatformHttpService);

	private readonly configSvc = inject(PlatformConfigurationService);

	/**
	 * Launches Revit for the current model and selected objects.
	 */
	public async activateRevit(): Promise<void> {
		// TODO: model selection logic is not available yet DEV-3883
		const cadFileName = await this.modelDataSvc.getCadFileNameById(0); // TODO: supply model ID

		const response = await this.httpSvc.post<string>('model/main/object/createxmlforrevit', {
			modelId: 0, // TODO: supply model ID
			elementIds: undefined, // TODO: supply selected object IDs as a compressed string
			baseUrl: window.location.origin + this.configSvc.baseUrl
		});

		const linkDest = cadFileName ?
			`itwo40://Revit/run?model="${cadFileName}"&rib="${response}"` :
			'itwo40://Revit/run?a=a&b=b'; // TODO: find out whether this is just a placeholder and the operation should actually be aborted

		const link = window.document.createElement('a');
		const body = window.document.body;
		link.setAttribute('style', 'visibility: hidden;');
		link.setAttribute('href', linkDest);
		body.appendChild(link);
		try {
			link.click();
		} finally {
			link.remove();
		}
	}
}