/*
 * Copyright(c) RIB Software GmbH
 */

import { EventEmitter, inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, Subject, takeUntil } from 'rxjs';
import { sortBy } from 'lodash';

import { IPortalUserDialog, IPortalUserGroup, IUserProviderInfoEntity } from '@libs/businesspartner/interfaces';
import { UiCommonMessageBoxService, IFormConfig, FieldType, UiCommonFormDialogService, createLookup, IFormDialogConfig, UiCommonDialogService } from '@libs/ui/common';
import { IInitializationContext, PlatformConfigurationService, PlatformHttpService, PlatformPermissionService, PlatformTranslateService } from '@libs/platform/common';


import { BusinessPartnerLookupService } from '../lookup-services';
import { FrmPortalUserGroupLookupService } from '../lookup-services/frm-portal-user-group-lookup.service';

@Injectable({
	providedIn: 'root',
})

/**
 * Business partner Shared Portal User Management Service
 */
export abstract class BusinessPartnerSharedPortalUserManagementService {
	/**
	 * Subject to handle unsubscription
	 */
	public destroy$ = new Subject<void>();
	/**
	 * Injects the UiCommonFormDialogService.
	 */
	public readonly formDialogService = inject(UiCommonFormDialogService);
	/**
	 * Injects the messageBoxService.
	 */
	public readonly messageBoxService = inject(UiCommonMessageBoxService);

	/**
	 * Event emitter for dialog Close
	 */
	public dialogClose = new EventEmitter<boolean>();

	private httpService = inject(PlatformHttpService);
	
	/**
	 * Injects the PlatformConfigurationService.
	 */
	public readonly configService = inject(PlatformConfigurationService);

	/**
	 * Injects the PlatformTranslateService.
	 */
	public readonly translateService = inject(PlatformTranslateService);

	/**
	 * Injects the BusinessPartnerLookupService
	 */
	public readonly bpLookupService = inject(BusinessPartnerLookupService);

	/**
	 * Injects the HttpClient service.
	 */
	public http = inject(HttpClient);

	/**
	 * disable Unlink Button
	 */
	public disableUnlinkBtn: boolean = false;

	/**
	 * disable Ok Button
	 */
	public disableOkBtn: boolean = false;

	/**
	 * disable Cancel Button
	 */
	public disableCancelBtn: boolean = false;

	/**
	 * check Is portal user
	 */
	public isPortalUser: boolean = false;

	/**
	 * To hold context type like contact , bp
	 */
	protected abstract readonly contextType: string;

	/**
	 * Holds the portal user dialog data.
	 */
	public portalUserDialogData: IPortalUserDialog = {
		FamilyName: '',
		BusinessPartnerName1: '',
		Provider: '',
		ProviderId: '',
		ProviderEmail: '',
		SetInactiveDate: null,
		ProviderComment: '',
		PortalAccessGroup: [],
		State: 1,
	};

	/**
	 * inject UiCommonDialogService
	 */
	public modalDialogService = inject(UiCommonDialogService);

	private portalUserManGuid = '825af4a1bfc649e69cd2cb5f9581024c';

	private readonly platformPermissionService = inject(PlatformPermissionService);

	/**
	 * Manage the portal user
	 */
	public async portalUserManagement() {
		const modalOptions: IFormDialogConfig<IPortalUserDialog> = {
			headerText: this.translateService.instant('businesspartner.contact.portalUserManagement').text,
			formConfiguration: this.portalUserForm(),
			customButtons: [{ id: '', caption: { key: 'businesspartner.contact.unlinkPortalUserButton' }, fn: () => this.onUnlinkBtnClicked() }],
			entity: this.portalUserDialogData,
			topDescription: this.translateService.instant('businesspartner.contact.infoText').text,
		};

		this.fetchPortalUserGroups()
			.pipe(takeUntil(this.destroy$))
			.subscribe((frmPortalUserGroup) => {
				if (this.contextType === 'bp') {
					this.handleBpContext(frmPortalUserGroup, modalOptions);
				} else if (this.contextType === 'contact') {
					this.handleContactContext(frmPortalUserGroup, modalOptions);
				}
			});
	}

	/**
	 * Returns the form configuration for portal user
	 * @returns IFormConfig<IPortalUserDialog>
	 */
	public portalUserForm(): IFormConfig<IPortalUserDialog> {
		return {
			formId: 'portalUserForm',
			showGrouping: false,
			addValidationAutomatically: true,
			rows: [
				{
					id: 'contact',
					type: FieldType.Description,
					label: {
						text: this.translateService.instant('businesspartner.contact.contact').text,
					},
					model: 'FamilyName',
					readonly: true,
					sortOrder: 1,
				},
				{
					id: 'entityBusinessPartner',
					type: FieldType.Description,
					label: {
						text: this.translateService.instant('cloud.common.entityBusinessPartner').text,
					},
					model: 'BusinessPartnerName1',
					readonly: true,
					sortOrder: 2,
				},
				{
					id: 'provider',
					type: FieldType.Description,
					label: {
						text: this.translateService.instant('businesspartner.main.provider').text,
					},
					model: 'Provider',
					readonly: true,
					sortOrder: 3,
				},
				{
					id: 'providerId',
					type: FieldType.Description,
					label: {
						text: this.translateService.instant('businesspartner.main.providerId').text,
					},
					model: 'ProviderId',
					readonly: true,
					sortOrder: 4,
				},
				{
					id: 'providerEmail',
					label: {
						text: this.translateService.instant('businesspartner.main.providerEmail').text,
					},
					type: FieldType.Email,
					model: 'ProviderEmail',
					readonly: true,
					sortOrder: 5,
				},
				{
					id: 'setInactiveDate',
					label: {
						text: this.translateService.instant('businesspartner.main.setInactiveDate').text,
					},
					type: FieldType.Date,
					model: 'SetInactiveDate',
					readonly: true,
				},
				{
					id: 'entityCommentText',
					label: {
						text: this.translateService.instant('cloud.common.entityCommentText').text,
					},
					type: FieldType.Comment,
					model: 'ProviderComment',
				},
				{
					id: 'portalAccessGroup',
					label: {
						text: this.translateService.instant('businesspartner.main.portalAccessGroup').text,
					},
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: FrmPortalUserGroupLookupService,
					}),
					model: 'PortalUserGroup',
					required: true,
				},
				{
					id: 'state',
					label: {
						text: this.translateService.instant('businesspartner.main.state').text,
					},
					type: FieldType.Select,
					itemsSource: {
						items: [
							{
								id: 1,
								displayName: {
									key: 'businesspartner.contact.active',
								},
							},
							{
								id: 2,
								displayName: {
									key: 'businesspartner.contact.inactive',
								},
							},
						],
					},
					model: 'State',
					required: true,
				},
			],
		};
	}

	/**
	 * To show not a portal user dialog
	 */
	public notAPortalUser() {
		this.messageBoxService.showMsgBox('businesspartner.contact.notAPortalUser', 'businesspartner.contact.notAPortalUser', 'ico-info');
	}

	/**
	 * To show not a selected contact item dialog.
	 */
	public noSelectContactItem() {
		this.messageBoxService.showMsgBox('businesspartner.contact.selectAContact', 'Portal User Management', 'ico-error');
	}

	/**
	 * To show not a select user item dialog
	 */
	public noSelectUserItem() {
		this.messageBoxService.showMsgBox('usermanagement.user.wizards.noUserSelected', 'usermanagement.user.wizards.noUserSelected', 'ico-error');
	}

	/**
	 * To fetch portal user groups.
	 * @returns Observable<IPortalUserGroup[]>
	 */
	public fetchPortalUserGroups(): Observable<IPortalUserGroup[]> {
		return this.http.post<IPortalUserGroup>(this.configService.webApiBaseUrl + 'basics/customize/FrmPortalUserGroup/list', {}).pipe(
			map((response) => {
				if (!Array.isArray(response)) {
					throw new Error('Invalid response format: expected an array');
				}
				return sortBy(
					response
						.filter((group) => group.Sorting !== 0)
						.map((group) => ({
							Id: group.Id,
							Name: group.Name,
							Sorting: group.Sorting,
							IsDefault: group.IsDefault,
						})),
					['Sorting', 'Id'],
				);
			}),
		);
	}

	/**
	 * To handle context type bp
	 * @param {IPortalUserGroup[]} userGroups
	 * @param {IFormDialogConfig<IPortalUserDialog>} modalOptions
	 */
	protected handleBpContext(userGroups: IPortalUserGroup[], modalOptions: IFormDialogConfig<IPortalUserDialog>): void {}

	/**
	 * To handle context type contact
	 * @param {IPortalUserGroup[]} userGroups
	 * @param {IFormDialogConfig<IPortalUserDialog>} modalOptions
	 */
	protected handleContactContext(userGroups: IPortalUserGroup[], modalOptions: IFormDialogConfig<IPortalUserDialog>): void {}

	/**
	 * To handle ok Button when the dialog is submitted.
	 */
	protected onOkBtnClicked() {}

	/**
	 * To handle refresh List according to context type
	 */
	protected refreshList() {}

	/**
	 * To handle unlink Button Action.
	 */
	protected onUnlinkBtnClicked() {}

	public execute(context: IInitializationContext): Promise<void> {
		return this.onStartWizard();
	}
	public async onStartWizard() {
		this.platformPermissionService.loadPermissions([this.portalUserManGuid]).then(() => {
			if (!this.platformPermissionService.hasWrite(this.portalUserManGuid) || !this.platformPermissionService.hasRead(this.portalUserManGuid)) {
				this.messageBoxService.showMsgBox('businesspartner.contact.noPermissionOfManagementPortalUser', 'businesspartner.contact.noPermission', 'ico-info');
			} else {
				this.portalUserManagement();
			}
		});
	}

	
	public getUserExternalProviderInfoVEntities(contactIds: number[]): Promise<IUserProviderInfoEntity[]> {
		return this.httpService.post('usermanagement/main/portal/getuserexternalproviderinfoventities', contactIds);
	}
	public ngOnDestroy(): void {
		this.destroy$.next();
		this.destroy$.complete();
	}
}
