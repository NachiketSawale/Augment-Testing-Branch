/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { DataServiceFlatNode, IDataServiceChildRoleOptions, IDataServiceEndPointOptions, IDataServiceOptions, ServiceRole } from '@libs/platform/data-access';
import { IContactEntityComplete } from '@libs/businesspartner/common';
import { ContactConditionKeyEnum, IBusinessPartnerAssignmentEntity, IBusinessPartnerEntity, IContactDuplicateEntity, IContactEntity, IContactResponse, ICreateContactWithAddressPhone, ISubsidiaryEntity } from '@libs/businesspartner/interfaces';
import { BusinessPartnerEntityComplete } from '../model/entities/businesspartner-entity-complete.class';
import { BusinesspartnerMainHeaderDataService } from './businesspartner-data.service';
import { ContactReadonlyProcessorService } from './processors/contact-readonly-processor.service';
import { cloneDeep, difference, filter, isEqual, map } from 'lodash';
import { BusinessPartnerMainSubsidiaryDataService } from './subsidiary-data.service';
import { BusinessPartnerHelperService } from './helper/businesspartner-helper.service';
import { CollectionHelper, PlatformHttpService, PlatformTranslateService, ServiceLocator } from '@libs/platform/common';
import { BusinesspartnerContactValidationService } from './validations/businesspartner-contact-validation.service';
import { UiCommonMessageBoxService } from '@libs/ui/common';
import { BusinesspartnerContactPhotoDataService } from './contact-photo-data.service';
import { IContactDeepCopyResponse } from '../model/responses/contact-deep-copy-response';
import { BasicsSharedLink2clerkDataServiceManager, IBasicsClerkEntity } from '@libs/basics/shared';
import { BehaviorSubject } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
/*
  only use in business partner container
 */
export class BusinesspartnerContactDataService extends DataServiceFlatNode<IContactEntity, IContactEntityComplete, IBusinessPartnerEntity, BusinessPartnerEntityComplete> {

	private filterBranchState$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

	public readonlyProcessor: ContactReadonlyProcessorService;
	private readonly subsidiaryDataService: BusinessPartnerMainSubsidiaryDataService = inject(BusinessPartnerMainSubsidiaryDataService);
	private readonly basicsSharedLink2clerkDataServiceManager = inject(BasicsSharedLink2clerkDataServiceManager);
	private readonly businessPartnerHelperService: BusinessPartnerHelperService = new BusinessPartnerHelperService();
	private readonly http = inject(PlatformHttpService);
	private readonly translationService = inject(PlatformTranslateService);
	private readonly messageBoxService = inject(UiCommonMessageBoxService);

	private contactList: IContactEntity[] = [];
	private filterList: IContactEntity[] = [];
	public filterBtnDisabled: boolean = false;
	private filterBranchLoad = false;
	private is4Procurement = false;
	private extParams = null;
	private isFromInquiry = false;
	public filterBranchValue = false;
	// region upload
	// todo wait upload check
	private uploadOptions = {
		uploadServiceKey: 'business-partner-contact',
		uploadConfigs: { action: 'Import', SectionType: 'Contact' },
		getExtension: '*.vcf',
	};
	// todo wait upload check
	// basicsCommonServiceUploadExtension.extendForCustom(serviceContainer.service, uploadOptions);
	// endregion

	public constructor(public businessPartnerDataService: BusinesspartnerMainHeaderDataService) {
		const options: IDataServiceOptions<IContactEntity> = {
			apiUrl: 'businesspartner/contact',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'listbybusinesspartnerid',
				usePost: true,
			},
			createInfo: <IDataServiceEndPointOptions>{
				endPoint: 'createcontact',
				usePost: true,
			},
			roleInfo: <IDataServiceChildRoleOptions<IContactEntity, IBusinessPartnerEntity, BusinessPartnerEntityComplete>>{
				role: ServiceRole.Node,
				itemName: 'Contact',
				parent: businessPartnerDataService,
			},
		};

		super(options);
		this.readonlyProcessor = new ContactReadonlyProcessorService(this);
		this.processor.addProcessor([this.readonlyProcessor]);
		this.processor.addProcessor({
			process: (item: IContactEntity) => this.processItem(item),
			revertProcess() {},
			// todo wait to check
			// new ServiceDataProcessDatesExtension(['BirthDate', 'LastLogin', 'SetInactiveDate'])
		});

		this.subsidiaryDataService.selectionChanged$.subscribe(selection => {
			if (selection && selection.length === 1) {
				const selectedEntity = selection[0];
				this.filterByBranch(selectedEntity);
			}
		});

		this.businessPartnerDataService.selectionChanged$.subscribe(selection => {
			if (selection && selection.length === 1) {
				this.resetFilterBranchState();
				this.load({ id: 0 });
			}
		});
	}

	// region process
	private processItem(item: IContactEntity): void {
		if (item) {
			const businesspartnerContactValidationService = ServiceLocator.injector.get(BusinesspartnerContactValidationService);
			businesspartnerContactValidationService.applyValidationCompanyFk(item);
		}
	}

	// endregion
	// region button
	// region deepCopy button
	// TODO wait to check
	public async copyPaste() {
		const selectContact = this.getSelectedEntity();
		const businesspartnerContactPhotoDataService = ServiceLocator.injector.get(BusinesspartnerContactPhotoDataService);
		if (selectContact) {
			let loadedPhoto: boolean = false;
			const listContact = this.getList();
			const existListContact = listContact.filter((e) => e.FirstName === selectContact.FirstName && e.FamilyName === selectContact.FamilyName);
			const contactRoleIds = existListContact.map((e) => e.ContactRoleFk);
			const sourceContactPhoto = businesspartnerContactPhotoDataService.getList()[0];
			if (sourceContactPhoto) {
				loadedPhoto = true;
			}
			const contactClerkService = this.basicsSharedLink2clerkDataServiceManager.getDataServiceInstance('businesspartner.contact.clerk', 'businesspartner.contact.clerk');
			const contactClerkList = contactClerkService.getList();
			const paramDto: IContactDuplicateEntity = {
				ContactDto: selectContact,
				RoleIds: contactRoleIds,
				LoadedPhoto: loadedPhoto,
				LoadedClerkQty: contactClerkList.length,
			};
			const response = await this.http.post<IContactDeepCopyResponse>('businesspartner/contact/deepcopy', paramDto);
			if (response?.Contact) {
				this.handleCreationDone(response.Contact);
				if (response.ContactPhoto && loadedPhoto) {
					if (sourceContactPhoto.Blob && response.ContactPhoto.Blob) {
						response.ContactPhoto.Blob.Content = sourceContactPhoto.Blob.Content;
					}
					businesspartnerContactPhotoDataService.handleCreationDone(response.ContactPhoto);
					// TODO wait to check
					// contactPhotoService.storeCacheForCopy(newContact);
				}
				if (response.ContactClerkIds && response.ContactClerkIds.length > 0 && contactClerkList.length > 0) {
					const copyClerks = cloneDeep(contactClerkList);
					const newClerks: IBasicsClerkEntity[] = [];
					for (let i = 0; i < copyClerks.length; i++) {
						const dataClerk: IBasicsClerkEntity = {
							...copyClerks[i],
							Id: response.ContactClerkIds[i],
							Version: 0,
							MainItemFk: response.Contact.Id,
						};
						newClerks.push(dataClerk);
					}
					contactClerkService.handleCreationDone(newClerks);
					// TODO wait to check
					// contactClerkService.storeCacheForCopy(newContact);
				}
			} else {
				const title = this.translationService.instant('businesspartner.main.errorMessage.failedCopyContact').text;
				const msg = this.translationService.instant('businesspartner.main.errorMessage.failedCopyContact').text;
				this.messageBoxService.showMsgBox(msg, title, 'ico-warning');
			}
			// todo
			// serviceContainer.service.finishLoadingEvent.fire();

			// function (/* error */) {
			// serviceContainer.service.finishLoadingEvent.fire();
			// },
		}
	}

	// todo wait to check
	public canCopy() {
		return this.getSelectedEntity() && this.canCreate();
	}

	public handleCreationDone(created: IContactEntity) {
		if (this.processor !== undefined) {
			this.processor.process(created);
		}
		this.append(created);
		this.select(created);
		this.setModified(created);
	}

	public override canCreate(): boolean {
		const canCreate = super.canCreate();
		return canCreate && !(this.businessPartnerDataService.getItemStatus()?.IsReadonly);
	}

	public override canDelete(): boolean {
		const canDelete = super.canDelete();
		return canDelete && !(this.businessPartnerDataService.getItemStatus()?.IsReadonly);
	}

	// endregion
	// region basic override
	public override getSavedEntitiesFromUpdate(parentUpdate: BusinessPartnerEntityComplete): IContactEntity[] {
		if (parentUpdate.ContactToSave) {
			const dataContact:IContactEntity[] =[];
			parentUpdate.ContactToSave.forEach((updated) => {
				if (updated.Contact) {
					dataContact.push(updated.Contact);
				}
			});
			return dataContact;
		}
		return [];
	}
	// TODO wait to check
	public sortedIdsAreEqual(listA: IContactEntity[], listB: IContactEntity[]) {
		const ids1 = map(listA, 'Id').sort((a, b) => a - b);
		const ids2 = map(listB, 'Id').sort((a, b) => a - b);
		return isEqual(ids1, ids2);
	}

	// TODO wait to check
	public override async delete(originEntities: IContactEntity[] | IContactEntity): Promise<void> {
		const finalEntities: IContactEntity[] = [];
		CollectionHelper.AppendTo(originEntities, finalEntities);
		if (finalEntities.length > 0) {
			this.filterBtnDisabled = true;
			const differenceList = difference(this.getList(), finalEntities);
			if (differenceList.length > 0 && differenceList.length === this.contactList.length) {
				this.filterBtnDisabled = !this.sortedIdsAreEqual(differenceList, this.contactList);
			}
			const contactIds: number[] = [];
			finalEntities.forEach((entity) => {
				contactIds.push(entity.Id);
			});

			const response = await this.http.post<IBusinessPartnerAssignmentEntity[]>('businesspartner/contact/businesspartnerassignment/listbymainitemids', contactIds);
			if (response && response.length > 1) {
				const entitiesCanDelete: IContactEntity[] = [];
				const entitiesCantDelete: IContactEntity[] = [];
				const selectedBP = this.businessPartnerDataService.getSelectedEntity();
				finalEntities.forEach((entity) => {
					const bpAssignments = [];
					for (const item of response) {
						if (item.ContactFk === entity.Id) {
							bpAssignments.push(item);
						}
					}

					if (bpAssignments.length > 1 && selectedBP) {
						bpAssignments.forEach((bpAssignment) => {
							if (bpAssignment.BusinessPartnerFk === selectedBP.Id) {
								if (bpAssignment.IsMain === true) {
									entitiesCantDelete.push(entity);
								} else {
									entitiesCanDelete.push(entity);
								}
							}
						});
					} else {
						entitiesCanDelete.push(entity);
					}
				});
				if (entitiesCantDelete.length > 0) {
					const errMsg = this.translationService.instant('businesspartner.main.contact.deleteError').text;
					const headerText = this.translationService.instant('cloud.common.errorMessage').text;
					this.messageBoxService.showMsgBox(errMsg, headerText, 'ico-error');
				}

				if (entitiesCanDelete.length > 0) {
					super.delete(entitiesCanDelete);
				}
			} else {
				super.delete(finalEntities);
			}
		}
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
			Contacts: null,
			MainItemId: 0
		};
		if (modified !== null) {
			complete.MainItemId = modified.Id;
			complete.Contact = modified;
			complete.Contacts = [modified];
		}
		return complete;
	}

	public override getModificationsFromUpdate(complete: IContactEntityComplete): IContactEntity[] {
		let  arrayContact:IContactEntity[]=[];
		if (complete.Contact ) {
			arrayContact=[complete.Contact];
		}
		return arrayContact;
	}

	protected override provideLoadPayload() {
		const parentSelection = this.getSelectedParent();
		if (parentSelection) {
			return {
				Value: parentSelection.Id,
			};
			// todo
			// const json = getExtParams();
			// if (json && json.hasOwnProperty('is4Procurement')) {
			// is4Procurement = json.is4Procurement;
			// }
		}
		return {
			Value: -1,
		};
	}

	protected override onLoadSucceeded(contactResponse: IContactResponse): IContactEntity[] {
		// region todo wait to check
		this.contactList = cloneDeep(contactResponse.Main);
		const dataSubsidiary = this.subsidiaryDataService.getSelectedEntity();
		if (this.isFromInquiry && !this.filterBranchLoad && contactResponse.Main.length > 0) {
			let selected = this.subsidiaryDataService.getSelectedEntity();
			if (!selected) {
				const entities = this.subsidiaryDataService.getSelection();
				if (entities && entities.length > 0) {
					selected = entities[0];
				}
			}
			const subsidaryId = selected ? selected.Id : null;
			if (subsidaryId) {
				contactResponse.Main = filter(contactResponse.Main, { SubsidiaryFk: subsidaryId });
			} else {
				contactResponse.Main = [];
			}
			this.filterList = [];
		}

		this.filterBtnDisabled = this.contactList.length <= 0;
		if (this.filterBranchLoad) {
			contactResponse.Main = this.filterList;
			this.filterList = [];
			this.filterBranchLoad = false;
		}

		// todo
		// businesspartnerContactPortalUserManagementService.loadAndMapProviderInfo(readData.Main, serviceContainer.service);
		if (dataSubsidiary) {
			let dataFound: IContactEntity | undefined;
			if (this.is4Procurement) {
				dataFound = this.businessPartnerHelperService.getDefaultContactByConditionKey(contactResponse.Main, dataSubsidiary.Id, ContactConditionKeyEnum.IsProcurement);
			} else {
				dataFound = contactResponse.Main.find((e) => e.IsDefault);
			}
			if (dataFound) {
				this.select(dataFound);
			} else {
				this.select(contactResponse.Main[0]);
			}
		}
		// endregion
		if (contactResponse) {
			return contactResponse.Main;
		}
		return [];
	}

	protected override provideCreatePayload(): ICreateContactWithAddressPhone {
		const parentSelection = this.getSelectedParent();
		if (parentSelection) {
			const dataRequest: ICreateContactWithAddressPhone = {
				mainItemId: parentSelection.Id,
				CopyAddress: false,
			};
			// region copy phone
			if (parentSelection?.SubsidiaryDescriptor) {
				if (parentSelection.SubsidiaryDescriptor.TelephoneNumberTelefaxDto) {
					dataRequest.FaxDto = {};
					dataRequest.FaxDto.CountryId = parentSelection.SubsidiaryDescriptor.TelephoneNumberTelefaxDto.CountryFk;
					dataRequest.FaxDto.Pattern = parentSelection.SubsidiaryDescriptor.TelephoneNumberTelefaxDto.Telephone;
					dataRequest.FaxDto.CommentText = parentSelection.SubsidiaryDescriptor.TelephoneNumberTelefaxDto.CommentText;
				}
				if (parentSelection.SubsidiaryDescriptor.TelephoneNumber1Dto) {
					dataRequest.PhoneDto = {};
					dataRequest.PhoneDto.CountryId = parentSelection.SubsidiaryDescriptor.TelephoneNumber1Dto.CountryFk;
					dataRequest.PhoneDto.Pattern = parentSelection.SubsidiaryDescriptor.TelephoneNumber1Dto.Telephone;
					dataRequest.PhoneDto.CommentText = parentSelection.SubsidiaryDescriptor.TelephoneNumber1Dto.CommentText;
				}
			}
			// endregion
			this.filterBtnDisabled = true;
			return dataRequest;
		}
		throw new Error('please select a business partner first');
	}

	protected override onCreateSucceeded(created: IContactEntity): IContactEntity {
		if (!created.IsDefault) {
			const allContacts = this.getList();
			const foundItem = allContacts.find((e) => e.IsDefault);
			if (!foundItem) {
				created.IsDefault = true;
			}
		}
		if (created.SubsidiaryFk === null) {
			const select = this.businessPartnerDataService.getSelectedEntity();
			if (select?.SubsidiaryDescriptor) {
				created.SubsidiaryDescriptor = select.SubsidiaryDescriptor;
				created.SubsidiaryFk = select.SubsidiaryDescriptor.Id;
			}
		}
		return created;
	}

	public override isParentFn(parentKey: IBusinessPartnerEntity, entity: IContactEntity): boolean {
		return entity.BusinessPartnerFk === parentKey.Id;
	}

	// endregion
	// region other
	// todo wait to check
	public disablePrev() {
		return this.canContactNavigate();
	}

	// todo wait to check
	public disableNext() {
		return this.canContactNavigate('forward');
	}

	// todo wait to check
	private canContactNavigate(type: string = 'backward') {
		const select = this.getSelectedEntity();
		const list = this.getSelection();
		if (!select?.Id || list.length <= 0) {
			return false;
		}
		const index = type === 'forward' ? list.length - 1 : 0;
		return select === list[index];
	}


	// todo  wait to check
	//public getExtParams() {
		// this.extParams = null;
		// this.isFromInquiry = false;
		// const appStartupInfo = initAppService.getStartupInfo();
		// if (appStartupInfo && appStartupInfo.navInfo && appStartupInfo.navInfo.extparams) {
		// extParams = JSON.parse(appStartupInfo.navInfo.extparams);
		// if (extParams.hasOwnProperty('subsidiaryFk')) {
		// isFromInquiry = true;
		// serviceContainer.service.filterBranchValue = true;
		// }
		// }
		// return extParams;
	//}

	// endregion
	// region filterBranch function
	// todo event
	// businesspartnerMainHeaderDataService.filterBranchBtnDisable.register(updateFilterBranchBtnDisable);
	//	businesspartnerMainHeaderDataService.registerSelectionChanged(changeFilterBranchValue);


	// endregion
	// region comment
	// todo wait check no use function,is js name
	// Initialize
	//   service.loadSubItemsList
	//   serviceContainer.service.changeFilterbtnValueMessenger = new PlatformMessenger();
	//  service.adjustClerkLayout = adjustClerkLayout;
	//  businesspartnerMainHeaderDataService.filterBranchBtnDisable.register(updateFilterBranchBtnDisable);
	//  businesspartnerMainHeaderDataService.registerSelectionChanged(changeFilterBranchValue);
	// endregion


	/*
 	* Handles the filter action for filtering contacts by branch.
 	*/
	public clickBtnFilterByBranch(isChecked: boolean): void {
        this.filterBranchValue = isChecked;
        this.filterBranchState$.next(this.filterBranchValue); // Emit new state
        this.filterByBranch();
    }


	/*
 	* Function to reset the filter button state.
 	*/
    public resetFilterBranchState(): void {
        this.filterBranchValue = false;
        this.filterBranchState$.next(this.filterBranchValue); // Emit reset state
    }


	/*
 	* Getter to subscribe to the filter state
 	*/
    public getFilterBranchState() {
        return this.filterBranchState$.asObservable();
    }


	/*
 	* Filters the contact list based on the selected subsidiary entity or a default entity.
 	*/
    public filterByBranch(selectEntity?: ISubsidiaryEntity | null): void {
        if (this.contactList.length > 0) {
            const selected = selectEntity || this.subsidiaryDataService.getSelectedEntity();
            if (this.filterBranchValue && selected) {
                this.filterList = this.contactList.filter(x => x.SubsidiaryFk === selected.Id);
                this.filterBranchLoad = true;
                this.load({ id: 0 });
            } else {
                if (this.contactList.length > this.getList().length) {
                    this.filterList = this.contactList;
                    this.filterBranchLoad = true;
                    this.load({ id: 0 });
                }
            }
        }
    }
}
