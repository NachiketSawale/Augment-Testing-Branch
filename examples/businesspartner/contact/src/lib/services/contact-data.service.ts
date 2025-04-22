/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { DataServiceFlatRoot, IDataServiceEndPointOptions, IDataServiceOptions, IDataServiceRoleOptions } from '@libs/platform/data-access';
import { ServiceRole } from '@libs/platform/data-access';
import { IBusinessPartnerAssignmentEntity, IContactEntity, IContactResponse } from '@libs/businesspartner/interfaces';
import { IContactEntityComplete } from '@libs/businesspartner/common';
import { ISearchResult, PlatformConfigurationService, PropertyType, ServiceLocator } from '@libs/platform/common';
import { BusinesspartnerSharedSubsidiaryLookupService } from '@libs/businesspartner/shared';
import { BasicsCompanyLookupService, BasicsSharedClerkLookupService } from '@libs/basics/shared';
import { isNumber, set } from 'lodash';
import { HttpClient } from '@angular/common/http';
import { UiCommonMessageBoxService } from '@libs/ui/common';

@Injectable({
	providedIn: 'root',
})
export class ContactDataService extends DataServiceFlatRoot<IContactEntity, IContactEntityComplete> {
	public constructor() {
		const options: IDataServiceOptions<IContactEntity> = {
			apiUrl: 'businesspartner/contact',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'listcontact',
				usePost: true,
			},
			createInfo: <IDataServiceEndPointOptions>{
				endPoint: 'createcontact',
				usePost: true,
			},
			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: 'deletecontact',
			},
			updateInfo: <IDataServiceEndPointOptions>{
				endPoint: 'updatecontact',
			},
			roleInfo: <IDataServiceRoleOptions<IContactEntity>>{
				role: ServiceRole.Root,
				itemName: 'Contact',
			},
		};

		super(options);
		this.processor.addProcessor({
			process: (item) => this.processItem(item),
			revertProcess() {},
		});
	}

	public override createUpdateEntity(modified: IContactEntity | null): IContactEntityComplete {
		const complete : IContactEntityComplete={
			BusinessPartnerAssignmentToDelete: null,
			BusinessPartnerAssignmentToSave: null,
			Contact: null,
			Contact2CompanyToDelete: null,
			Contact2CompanyToSave: null,
			Contact2ExternalToDelete: null,
			Contact2ExternalToSave: null,
			ContactExtRoleToDelete: null,
			ContactExtRoleToSave: null,
			ContactPhotoToDelete: null,
			ContactPhotoToSave: null,
			MainItemId: 0,
			Contacts: null,

		};
		if (modified !== null) {
			complete.MainItemId = modified.Id;
			complete.Contact = modified;
		}
		return complete;
	}
	public override getModificationsFromUpdate(complete: IContactEntityComplete): IContactEntity[] {
		if (!complete.Contacts ) {
			complete.Contacts = [];
		}
		return complete.Contacts;
	}


	protected override onLoadByFilterSucceeded(loaded: IContactResponse): ISearchResult<IContactEntity> {
		const filterResult = loaded.FilterResult;
		if (loaded.Subsidiary && loaded.Subsidiary.length > 0) {
			const subLookupService = ServiceLocator.injector.get(BusinesspartnerSharedSubsidiaryLookupService);
			subLookupService.cache.setItems(loaded.Subsidiary);
		}
		if (loaded.Clerk && loaded.Clerk.length > 0) {
			const clerkLookupService = ServiceLocator.injector.get(BasicsSharedClerkLookupService);
			clerkLookupService.cache.setItems(loaded.Clerk);
		}
		if (loaded.CompanyBusinessUnit && loaded.CompanyBusinessUnit.length > 0) {
			const companyLookupService = ServiceLocator.injector.get(BasicsCompanyLookupService);
			companyLookupService.cache.setItems(loaded.CompanyBusinessUnit);
		}

		return {
			dtos: loaded.Main ?? [],
			FilterResult: {
				ExecutionInfo: filterResult.ExecutionInfo,
				ResultIds: filterResult.ResultIds,
				RecordsFound: filterResult.RecordsFound,
				RecordsRetrieved: filterResult.RecordsRetrieved,
			},
		};
	}

	protected override provideCreatePayload(): object {
		return {};
	}

	protected override onCreateSucceeded(created: object): IContactEntity {
		return created as unknown as IContactEntity;
	}

	private processItem(item: IContactEntity) {
		if (item) {
			// todo chi: check the implement later.
			// const validationSerivce = ServiceLocator.injector.get(BusinesspartnerContactValidationService);
			// const result = validationSerivce.validateCompanyFk({entity: item, value: item.CompanyFk, 'CompanyFk'});
			// if (!result.valid) {
			// 	this.addInvalid(item, {result: result, field: 'CompanyFk'});
			// } else {
			// 	this.removeInvalid(item, {result: result, field: 'CompanyFk'});
			// }

			if (item.SubsidiaryFk) {
				const subLookupService = ServiceLocator.injector.get(BusinesspartnerSharedSubsidiaryLookupService);
				subLookupService.getItemByKey({ id: item.SubsidiaryFk }).subscribe({
					next: (subsidiary) => {
						//item.SubsidiaryDescriptor = subsidiary;
					},
				});
			}
		}
	}

	public convertLookupDto(lookupDto: { Id: number | null | undefined }): Promise<IContactEntity | null> {
		if (isNumber(lookupDto.Id)) {
			const http = ServiceLocator.injector.get(HttpClient);
			const configService = ServiceLocator.injector.get(PlatformConfigurationService);
			return new Promise((resolve, reject) => {
				http.get<IContactEntity>(configService.webApiBaseUrl + 'businesspartner/contact/getbyid?id=' + lookupDto.Id).subscribe({
					next: (response) => {
						resolve(response);
					},
					error: () => {
						reject();
					},
				});
			});
		}
		return Promise.resolve(null);
	}

	public override delete(entities: IContactEntity[] | IContactEntity): void {
		const selection = this.getSelection();
		if (selection && selection.length > 0) {
			const entity = selection[0];
			const http = ServiceLocator.injector.get(HttpClient);
			const configService = ServiceLocator.injector.get(PlatformConfigurationService);
			http.get<IBusinessPartnerAssignmentEntity[]>(configService.webApiBaseUrl + 'businesspartner/contact/businesspartnerassignment/list?mainItemId=' + entity.Id).subscribe({
				next: (response) => {
					if (response.length > 1) {
						const msgBox = ServiceLocator.injector.get(UiCommonMessageBoxService);
						msgBox.showMsgBox({
							headerText: 'cloud.common.errorMessage',
							bodyText: 'businesspartner.main.contact.deleteError',
							iconClass: 'ico-error',
						});
					} else {
						super.delete([entity]);
					}
				},
			});
		}
	}

	public syncContactFieldData(args: { isMain: boolean; value: PropertyType | null | undefined; field: keyof IContactEntity }) {
		if (!args.isMain) {
			return;
		}

		const selection = this.getSelection();
		if (selection && selection.length > 0) {
			const contact = selection[0];
			if (contact && contact[args.field] !== args.value) {
				set(contact, args.field, args.value);
				this.setModified(contact);
			}
		}
	}
}
