/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import {CONTACT_ENTITIY, IContactEntity } from '@libs/businesspartner/interfaces';
import { IEntitySelection } from '@libs/platform/data-access';
import { ICustomDialogOptions, StandardDialogButtonId, UiCommonDialogService, UiCommonMessageBoxService } from '@libs/ui/common';
import { HttpClient } from '@angular/common/http';
import { PlatformConfigurationService, PlatformTranslateService } from '@libs/platform/common';
import { Observable } from 'rxjs';
import { ActivateOrInactivatePortaUserComponent } from '../business-partner/components/wizard/activate-or-inactivate-porta-user/activate-or-inactivate-porta-user.component';


@Injectable({
    providedIn: 'root',
})

/*
 * Shared Re/In Activate Portal User Service for the Business Partner.
 */
export abstract class BusinessPartnerSharedReOrInActivatePortalUserService {

    /**
     * Data service to manage entity selection for contacts.
     */
    protected readonly dataService!: IEntitySelection<IContactEntity>;

    /**
     * The list of selected entities.
     */
    public selectedEntities!: IContactEntity[];

    /**
     * Inject UiCommonMessageBoxService.
     */
    public readonly msgDialogService = inject(UiCommonMessageBoxService);

    /**
     * Inject UiCommonDialogService.
     */
    public readonly modalDialogService = inject(UiCommonDialogService);

    /**
     * Inject PlatformTranslateService.
     */
    protected readonly translate = inject(PlatformTranslateService);

    /**
     * Inject PlatformConfigurationService.
     */
    private configService = inject(PlatformConfigurationService);

    /**
     * Count of selected Entity.
     */
    public countAll !: number;

    /**
     * count of the active contacts.
     */
    public countActive: number = 0;

    /**
     *  executeType 1: re-activate, 2: in-activate.
     */
    public executeType: string = '1';

    public constructor(private http: HttpClient) { }

    /**
     * Handles the initiation of the reactivate or inactivate portal user process.
     * @param dataService The service used to retrieve the selected entities.
     */
    public async reactivateOrInactivatePortalUser(dataService: IEntitySelection<IContactEntity>) {
        this.selectedEntities = dataService.getSelection();
        this.countAll = this.selectedEntities.length;
        this.selectedEntities.forEach(selected => {
            if (selected.State === 1) {
                this.countActive++;
            }
        });
        this.executeType = this.countActive === 0 || this.countActive < this.countAll - this.countActive ? '1' : '2';

        this.selectedEntities = this.selectedEntities.filter((selected: IContactEntity) => !!selected.FrmUserExtProviderFk);

        if (!this.selectedEntities || this.selectedEntities.length === 0) {
            this.msgDialogService.showMsgBox({
                headerText: 'Info',
                bodyText: this.translate.instant({ key: 'businesspartner.main.wizardErrorNoContactSelected' }).text,
                iconClass: 'ico-warning'
            });
            return;
        } else {
            this.openModalDialogforPortalUser();
        }
    }

    /**
     * Opens a modal dialog to manage portal user actions reactivation/inactivation.
     */
    public openModalDialogforPortalUser() {
        const modalOptions: ICustomDialogOptions<{ executeType: string }, ActivateOrInactivatePortaUserComponent> = {
            headerText: this.translate.instant({ key: 'businesspartner.main.wizardReactivateOrInactivatePortalUserTitle' }).text,

            buttons: [
                {
                    id: 'execute',
                    caption: { key: 'basics.common.button.execute' },
                    autoClose: true,
                    fn: (event, info) => {
                        info.dialog.body.onExecute();
                    },
                    isDisabled: info => !info.dialog.body?.canExecute,
                },
                {
                    id: StandardDialogButtonId.Cancel,
                    caption: { key: 'basics.common.button.close' },
                }
            ],
            resizeable: true,
            showCloseButton: true,
            bodyComponent: ActivateOrInactivatePortaUserComponent,
            bodyProviders: [{ provide: CONTACT_ENTITIY, useValue: this.selectedEntities }],
            value: {
                executeType: this.executeType,
            }
        };

        this.modalDialogService.show(modalOptions)
            ?.then((result) => {
                if (result?.closingButtonId === 'execute') {
                    this.msgDialogService.showMsgBox({
                        headerText: 'Info',
                        bodyText: this.translate.instant({ key: 'businesspartner.contact.reOrInactivatePortalUserSucInfo' }).text,
                        iconClass: 'ico-warning'
                    });
                    return;
                }
            });
    }

    /**
     * Executes the reactivation or inactivation of portal users.
     * @param contacts The list of contacts to process.
     * @param executeType The type of execution ('1' for reactivation, '2' for inactivation).
     * @returns An observable for the HTTP request.
     */
    public execute(contacts: IContactEntity[], executeType: string): Observable<object> {
        const contactIds = contacts.map(contact => contact.Id);
        const url = `${this.configService.webApiBaseUrl}usermanagement/main/portal/${executeType === '1' ? 'reactivateportalusers' : 'inactivateportalusers'
            }`;
        return this.http.post(url, contactIds);
    }

}