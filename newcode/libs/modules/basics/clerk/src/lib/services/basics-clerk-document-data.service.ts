/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { ServiceRole, IDataServiceOptions, IDataServiceEndPointOptions, IDataServiceChildRoleOptions } from '@libs/platform/data-access';
import { BasicsClerkDataService } from './basics-clerk-data.service';
import { DocumentDataLeafService } from '@libs/documents/shared';
import { IBasicsClerkEntity, IBasicsClerkDocumentEntity, IBasicsClerkComplete } from '@libs/basics/interfaces';
import { BasicsClerkDocumentReadonlyProcessorService } from './basics-clerk-document-readonly-processor.service';


@Injectable({
	providedIn: 'root',
})
export class BasicsClerkDocumentDataService extends DocumentDataLeafService<IBasicsClerkDocumentEntity, IBasicsClerkEntity, IBasicsClerkComplete> {
	public constructor() {
		const options: IDataServiceOptions<IBasicsClerkDocumentEntity> = {
			apiUrl: 'clerk/document',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'listbyparent',
				usePost: true,
				prepareParam: ident => {
					return {
						PKey1 : ident.pKey1};
				}
			},
			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: 'multidelete',
			},
			roleInfo: <IDataServiceChildRoleOptions<IBasicsClerkDocumentEntity, IBasicsClerkEntity, IBasicsClerkComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'ClerkDocuments',
				parent: inject(BasicsClerkDataService),
			},
		};

		super(options);
		this.processor.addProcessor(new BasicsClerkDocumentReadonlyProcessorService(this));
	}
}
