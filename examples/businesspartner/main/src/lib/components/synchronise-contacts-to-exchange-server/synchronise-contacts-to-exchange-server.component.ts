import {Component, inject, OnInit} from '@angular/core';
import {PlatformConfigurationService} from '@libs/platform/common';
import {HttpClient} from '@angular/common/http';
import {BusinesspartnerContactDataService} from '../../services/businesspartner-contact-data.service';
import {ContainerBaseComponent} from '@libs/ui/container-system';
import { IContact2ExchangeResponse } from '@libs/businesspartner/interfaces';

@Component({
    selector: 'businesspartner-main-synchronise-contacts-to-exchange-server-container',
    templateUrl: './synchronise-contacts-to-exchange-server.component.html',
    styleUrls: ['synchronise-contacts-to-exchange-server.component.scss']
})

export class BusinesspartnerMainSynchroniseContactsToExchangeServerComponent extends ContainerBaseComponent implements OnInit {
    private readonly http = inject(HttpClient);
    private readonly configService = inject(PlatformConfigurationService);
    private readonly contactDataService = inject(BusinesspartnerContactDataService);

    protected container = {
        colIsToExchangeUser: 'businesspartner.main.contact2exchange.IsToExchange',
        IsToExchangeUser: false
    };

    public constructor() {
        super();
    }

    public isDisabled() {
        const parentService = this.contactDataService.businessPartnerDataService;
        const status = parentService.getItemStatus();
        if (status?.IsReadonly !== undefined) {
            return status.IsReadonly;
        }
        return false;
    }

    public checkIsToExchangeUser() {
        const selectContact = this.contactDataService.getSelectedEntity();
        if (selectContact) {
            selectContact.IsToExchangeUser = this.container.IsToExchangeUser;
            this.http.post(this.configService.webApiBaseUrl + 'businesspartner/main/exchange/update', selectContact);
        } else {
            this.container.IsToExchangeUser = false;
        }
    }

    public selectedContactChange() {
        const selectContact = this.contactDataService.getSelectedEntity();
        if (selectContact) {
            this.http.post<IContact2ExchangeResponse>(this.configService.webApiBaseUrl + 'businesspartner/main/exchange/contact2exchangeById', {
                filter: '',
                Value: selectContact.Id
            }).subscribe(res => {
                if (!res) {
                    this.container.IsToExchangeUser = selectContact.IsToExchangeUser;
                } else if (res.Main && res.Main.length > 0) {
                    this.container.IsToExchangeUser = res.Main[0].IsToExchangeUser;
                }
            });
        } else {
            this.container.IsToExchangeUser = false;
        }
    }

    public ngOnInit(): void {
        const selSub = this.contactDataService.selectionChanged$.subscribe(e => {
            this.selectedContactChange();
        });
        this.registerFinalizer(() => selSub.unsubscribe());
    }
}