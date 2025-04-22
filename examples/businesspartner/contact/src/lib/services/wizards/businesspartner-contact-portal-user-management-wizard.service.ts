/*
 * Copyright(c) RIB Software GmbH
 */
import { inject, Injectable } from '@angular/core';

import { IContactEntity, IPortalUserDialog, IPortalUserGroup, IUserProviderInfoEntity } from '@libs/businesspartner/interfaces';
import { IUserEntity } from '@libs/usermanagement/interfaces';
import { IFormDialogConfig, IYesNoDialogOptions, StandardDialogButtonId } from '@libs/ui/common';
import { BusinessPartnerSharedPortalUserManagementService } from '@libs/businesspartner/shared';

import { ContactDataService } from '../contact-data.service';
import { takeUntil } from 'rxjs';

/**
 * Business partner Contact Portal User Management Wizard Service.
 */
@Injectable({
	providedIn: 'root',
})
export class BusinessPartnerContactPortalUserManagementWizardService extends BusinessPartnerSharedPortalUserManagementService {
	/**
	 * hold context type
	 */
	public contextType = 'contact';
	/**
	 * To inject ContactDataService
	 */
	public contactDataService = inject(ContactDataService);
	/**
	 * Hold selected entity of dataService.
	 */
	public selectedItem!: IContactEntity | null;

	/**
	 * To handle context type contact
	 * @param {IPortalUserGroup[]} userGroups
	 * @param {IFormDialogConfig<IPortalUserDialog>} modalOptions
	 */
	protected override async handleContactContext(userGroups: IPortalUserGroup[], modalOptions: IFormDialogConfig<IPortalUserDialog>): Promise<void> {
		this.selectedItem = this.contactDataService.getSelectedEntity();
		if (!this.selectedItem) {
			this.noSelectContactItem();
			return;
		}

		const contactSelection = this.contactDataService.getSelection();
		const contactIds = contactSelection.map((contact) => contact.Id);
		const providers = await this.getUserExternalProviderInfoVEntities(contactIds);
		const contactsDetails = providers[0];

		if (this.selectedItem.FrmUserExtProviderFk) {
			const BusinessPartner = this.bpLookupService.cache.getAll();
			this.portalUserDialogData.BusinessPartnerName1 = BusinessPartner ? BusinessPartner.find((bp) => bp.Id === this.selectedItem?.BusinessPartnerFk)?.BusinessPartnerName1 || '' : '';
			const userPayload = {
				filter: '',
				Pattern: null,
				PageSize: 100,
				PageNumber: 0,
				UseCurrentClient: null,
				IncludeNonActiveItems: true,
				ProjectContextId: null,
				ExecutionHints: false,
				PKeys: [contactsDetails.userId],
			};
			this.http
				.post<IUserEntity[]>(this.configService.webApiBaseUrl + 'usermanagement/main/user/list', userPayload)
				.pipe(takeUntil(this.destroy$))
				.subscribe({
					next: (result: IUserEntity[]) => {
						if (result && result.length > 0) {
									const userData = result[0];
									this.portalUserDialogData.SetInactiveDate = userData.Setinactivedate;
									this.portalUserDialogData.User = userData;
								}
								this.processItem(userGroups, contactsDetails);
								this.formDialogService.showDialog(modalOptions)?.then((result) => {
									if (result?.closingButtonId === StandardDialogButtonId.Ok) {
										this.onOkBtnClicked(contactsDetails);
							}
						});
					},
				});
		} else {
			this.notAPortalUser();
		}
	}

	/**
	 * To bind the item data to the portalUserDialogData
	 * @param {IPortalUserGroup[]} userGroups
	 * @param contactDetails
	 */
	public processItem(userGroups: IPortalUserGroup[], contactDetails: IUserProviderInfoEntity): void {
		this.portalUserDialogData.BusinessPartnerName1 = contactDetails.bpdName1 || '';
		this.portalUserDialogData.FamilyName = contactDetails.familyName || '';
		this.portalUserDialogData.PortalAccessGroup = userGroups;
		this.portalUserDialogData.Provider = contactDetails.provider || '';
		this.portalUserDialogData.ProviderId = contactDetails.providerId || null;
		this.portalUserDialogData.ProviderEmail = contactDetails.email || '';
		this.portalUserDialogData.ProviderComment = contactDetails.comment || '';
		this.portalUserDialogData.State = contactDetails.state || 1;
	}

	/**
	 * To handle ok Button when the dialog is submitted.
	 */
	protected override onOkBtnClicked(contactsDetails?: IUserProviderInfoEntity) {
		const comment = contactsDetails?.comment || '';
		const groupId = contactsDetails?.portalusergroupFk || 1;
		const setInactiveDate = this.selectedItem?.SetInactiveDate instanceof Date ? this.selectedItem.SetInactiveDate.toISOString() : this.selectedItem?.SetInactiveDate || '';

		const param = {
			extProviderId: this.selectedItem?.FrmUserExtProviderFk || '',
			portalAccessGroupId: groupId,
			comment: comment,
			state: contactsDetails?.state || '',
			setInactiveDate: setInactiveDate,
		};

		this.http
			.get(this.configService.webApiBaseUrl + 'usermanagement/main/portal/updateextprovider', { params: param })
			.pipe(takeUntil(this.destroy$))
			.subscribe({
				next: () => {
					this.messageBoxService?.showMsgBox('businesspartner.contact.managePortalUserSucceessfully', 'businesspartner.contact.managePortalUserSucceessfully', 'info')?.then(() => {
						this.refreshList();
						this.dialogClose.emit(true);
					});
				},
			});
	}

	/**
	 * To handle refresh List according to context type
	 */
	protected override refreshList() {
		if (this.contextType === 'contact') {
			this.contactDataService.refreshAll();
		}
	}

	/**
	 * To handle unlink Button Action.
	 */
	protected override async onUnlinkBtnClicked(): Promise<void> {
		this.disableUnlinkBtn = true;
		this.disableOkBtn = true;
		this.disableCancelBtn = true;
		const option: IYesNoDialogOptions = {
			headerText: 'businesspartner.contact.unlinkPortalUserButton',
			bodyText: 'businesspartner.contact.doYouUnlinkPortalUser',
			defaultButtonId: 'no',
		};

		const result = await this.messageBoxService.showYesNoDialog(option);
		if (result?.closingButtonId === 'yes') {
			const contactIds = this.selectedItem?.Id ? [this.selectedItem.Id] : [];
			if (this.contextType === 'contact') {
				this.http
					.post(this.configService.webApiBaseUrl + 'usermanagement/main/portal/unlinkportalusersbyuserids/', contactIds)
					.pipe(takeUntil(this.destroy$))
					.subscribe({
						next: () => {
							this.refreshList();
							this.dialogClose.emit(false);
						},
					});
			}
		} else {
			this.disableUnlinkBtn = !this.isPortalUser;
			this.disableOkBtn = !this.isPortalUser;
			this.disableCancelBtn = false;
		}
	}
}
