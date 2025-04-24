/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { DataServiceFlatRoot, ServiceRole } from '@libs/platform/data-access';
import { PlatformConfigurationService, ServiceLocator } from '@libs/platform/common';
import { HttpClient } from '@angular/common/http';
import { IFormEntity } from '../model/entities/form-entity.interface';
import { FormComplete } from '../model/entities/form-complete.class';

/**
 * Represents the data service to handle user form.
 */
@Injectable({
	providedIn: 'root'
})
export class BasicsUserformMainDataService extends DataServiceFlatRoot<IFormEntity, FormComplete> {
	public constructor() {
		super({
			apiUrl: 'basics/userform',
			readInfo: {
				endPoint: 'listFiltered',
				usePost: true
			},
			deleteInfo: {
				endPoint: 'delete'
			},
			updateInfo: {
				endPoint: 'updateForm'
			},
			createInfo: {
				endPoint: 'create'
			},
			roleInfo: {
				role: ServiceRole.Root,
				itemName: 'Form'
			}
		});
	}

	private configService = inject(PlatformConfigurationService);

	public override createUpdateEntity(modified: IFormEntity | null): FormComplete {
		const complete = new FormComplete();
		if (modified !== null) {
			complete.Form = modified;
			complete.MainItemId = modified.Id;
			complete.EntitiesCount = 1;
		}
		return complete;
	}

	public getHtmlTemplate() {
		const http = ServiceLocator.injector.get(HttpClient);
		const selectedForm = this.getSelection()[0];
		return new Promise((resolve) => {
			if (selectedForm && selectedForm.HtmlTemplateContent) {
				resolve(selectedForm.HtmlTemplateContent);
			} else {
				http.get(this.configService.webApiBaseUrl + 'basics/userform/fetchhtmltemplate?formId=' + selectedForm.Id).subscribe(response => {
					resolve(response);
				});
			}
		});
	}
}
