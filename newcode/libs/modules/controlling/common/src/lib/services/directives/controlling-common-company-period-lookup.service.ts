import {FieldType, UiCommonLookupEndpointDataService} from '@libs/ui/common';
import {
    inject,
    Injectable,
    ProviderToken,
    Injector,
    runInInjectionContext
} from '@angular/core';
import { map, Observable} from 'rxjs';
import { IIdentificationData } from '@libs/platform/common';
import {IEntityList} from '@libs/platform/data-access';




export class CompanyPeriod{
    public Id:number = 0;
    public CompanyYearFk:number = 0;
    public TradingPeriod : string = '';
}

export interface CompanyPeriodLookupConfig<TEntity extends object>{
    dataServiceToken: ProviderToken<IEntityList<TEntity>>;
}

@Injectable(
    {providedIn: 'root'}
)
export class CompanyPeriodLookupServiceFactory{
    protected inject = inject(Injector);

    public createLookup<TEntity extends object>(lookupConfig: CompanyPeriodLookupConfig<TEntity>){
        return runInInjectionContext(this.inject, ()=>{
            return new ControllingCommonCompanyPeriodLookupService(lookupConfig);
        });
    }
}

//@Injectable()
export class ControllingCommonCompanyPeriodLookupService <TEntity extends object> extends UiCommonLookupEndpointDataService<CompanyPeriod, TEntity> {

    protected dataService : IEntityList<TEntity>;
    public constructor(lookupConfig: CompanyPeriodLookupConfig<TEntity>) {

        const companyYearFks : number[] =[];
        super({
            httpRead: { route: 'basics/company/periods/', endPointRead: 'getcompanyperiods',usePostForRead:true },
            filterParam:true,
            prepareListFilter: context => {
                return companyYearFks;
            }
        }, {
            uuid: '830d68f417d34e928e2bc60ad511d736',
            valueMember: 'Id',
            displayMember: 'TradingPeriod',
            gridConfig: {
                columns: [
                    {
                        id: 'TradingPeriod',
                        model: 'TradingPeriod',
                        type: FieldType.Translation,
                        label: {text: ' ', key: ' '},
                        sortable: true,
                        visible: true,
                        readonly: true
                    }
                ]
            }
        });

        this.dataService = inject(lookupConfig.dataServiceToken);

    }
    public override getItemByKey(key: Readonly<IIdentificationData>): Observable<CompanyPeriod> {
        const companyYearFks : number[] =[];
        const dataList = this.dataService.getList() as CompanyPeriod[];
        if(dataList && dataList.length > 0 && companyYearFks.length <= 0 ){
            dataList.forEach(item =>{
                companyYearFks.push(item.CompanyYearFk);
            });
            const responseData = this.http.post(this.configService.webApiBaseUrl + 'basics/company/periods/getcompanyperiods',companyYearFks);
                if (responseData) {
                    const data = responseData;
                    return data.pipe(map(CompanyPeriods => {
                        const entity = CompanyPeriods as CompanyPeriod;
                        this.processItems([entity]);
                        return entity;
                    }));
                }
        }
        return this.getList().pipe(map(list => {
            return list.find(item => {
                return item ;
            }) || list[0];
        }));
    }
}