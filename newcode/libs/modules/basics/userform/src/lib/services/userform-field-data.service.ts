/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import {
	DataServiceFlatLeaf,
	IDataServiceChildRoleOptions,
	IDataServiceOptions,
	ServiceRole
} from '@libs/platform/data-access';
import { UserformFieldEntityComplete } from '../model/entities/userform-field-entity-complete.class';
import { PlatformConfigurationService, ServiceLocator } from '@libs/platform/common';
import { BasicsUserformMainDataService } from './userform-main-data.service';
import { HttpClient } from '@angular/common/http';
import { IFormEntity } from '../model/entities/form-entity.interface';
import { IFormFieldEntity } from '../model/entities/form-field-entity.interface';

/**
 * Represents the data service to handle user form field.
 */
@Injectable({
	providedIn: 'root'
})
export class BasicsUserformFieldDataService extends DataServiceFlatLeaf<IFormFieldEntity, IFormEntity, UserformFieldEntityComplete> {

	public constructor(basicsUserformMainDataService: BasicsUserformMainDataService) {
		const options: IDataServiceOptions<IFormFieldEntity> = {
			apiUrl: 'basics/userform/field',
			readInfo: {
				endPoint: 'list',
				usePost: false,
				prepareParam: ident => {
					return {
						MainItemId: ident.pKey1 ?? -1
					};
				}
			},
			deleteInfo: {
				endPoint: 'delete'
			},
			updateInfo: {
				endPoint: 'save'
			},
			createInfo: {
				endPoint: 'create'
			},
			roleInfo: <IDataServiceChildRoleOptions<IFormFieldEntity, IFormEntity, UserformFieldEntityComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'FormFields',
				parent: basicsUserformMainDataService
			}
		};
		super(options);
	}

	protected override provideLoadPayload(): object {
		const parentSelection = this.getSelectedParent();
		if (parentSelection) {
			return {
				mainItemId: parentSelection.Id
			};
		}

		return {
			mainItemId: -1
		};
	}

	private configService = inject(PlatformConfigurationService);
	private basicsUserformMainDataService = inject(BasicsUserformMainDataService);
	public parseHtmlTemplate() {
		const selectedForm = this.getSelectedParent();
		if (selectedForm !== null && selectedForm !== undefined) {
			const webApiBaseUrl = this.configService.webApiBaseUrl;
			const httpClient = ServiceLocator.injector.get(HttpClient);
			return this.basicsUserformMainDataService.getHtmlTemplate().then(function(template) {
				if (template !== null) {
					// btoa does not really work on unicode strings?
					// var base64EncodedString = window.btoa(template);
					const base64EncodedString = window.btoa(template as string);
					return httpClient.post(webApiBaseUrl + 'basics/userform/parsehtml?formId=' + selectedForm.Id, '"' + base64EncodedString + '"').subscribe(response => {
						return response;
					});
				} else {
					return null;
				}
			});
		} else {
			return null;
		}
	}
}
