import {inject, Injectable} from '@angular/core';
import {FieldType, UiCommonLookupEndpointDataService} from '@libs/ui/common';
import {PlatformConfigurationService} from '@libs/platform/common';



export class CompanyYear{
    public Id:number = 0;
    public TradingYear : string = '';
}
@Injectable({
    providedIn: 'root'
})
export class ControllingCommonCompanyYearLookupService <TEntity extends object = object> extends UiCommonLookupEndpointDataService<CompanyYear, TEntity> {
    private readonly platformConfigurationService = inject(PlatformConfigurationService);
    public constructor() {
        super({
            httpRead: { route: 'basics/company/year/', endPointRead: 'listbycompanyid' },
            filterParam: 'companyId',
            prepareListFilter: context => {
                return 'companyId='+this.platformConfigurationService.clientId;
            }
        }, {
            uuid: '830d68f417d34e938e2bc60ad511de43',
            valueMember: 'Id',
            displayMember: 'TradingYear',
            gridConfig: {
                columns: [
                    {
                        id: 'TradingYear',
                        model: 'TradingYear',
                        type: FieldType.Text,
                        label: {text: ' ', key: ' '},
                        sortable: true,
                        visible: true,
                        readonly: true
                    }
                ]
            }
        });
    }

}