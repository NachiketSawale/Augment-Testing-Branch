import {Injectable} from '@angular/core';
import {ILayoutConfiguration} from '@libs/ui/common';
import {prefixAllTranslationKeys} from '@libs/platform/common';
import {IControllingCommonActualEntity} from '../model/entities/controlling-common-actual-entity.interface';


@Injectable({
    providedIn: 'root'
})
export class ControllingCommonActualLayoutService {

    public async generateLayout<T extends IControllingCommonActualEntity>(): Promise<ILayoutConfiguration<T>> {
        return <ILayoutConfiguration<T>>{
            groups: [
                {
                    gid: 'controllingprojectactual',
                    attributes: ['ControllingUnitCode', 'ControllingUnitDescription', 'ContrCostCodeCode', 'ContrCostCodeDescription',
                        'Code', 'CompanyYearFk', 'CompanyYearFkStartDate', 'CompanyYearFkEndDate',
                        'CompanyPeriodFk', 'CompanyPeriodFkStartDate', 'CompanyPeriodFkEndDate', 'ValueTypeFk', 'HasCostCode',
                        'HasContCostCode', 'HasAccount', 'ProjectFk', 'Total', 'TotalOc', 'IsFinal',
                        'MdcCostCodeFk', 'AccountFk', 'Quantity', 'Amount', 'CurrencyFk', 'AmountOc', 'UomFk',
                        'NominalDimension1', 'NominalDimension2', 'NominalDimension3', 'CommentText']
                }
            ],
            labels: {
                ...prefixAllTranslationKeys('controlling.common.', {
                    Code: {key: 'entityCode'},
                    CommentText: {key: 'entityCommentText'},
                    CompanyYearFk:{key: 'entityCompanyYearServiceFk'},
                    CompanyYearFkStartDate:{key: 'entityCompanyYearServiceFkStartDate'},
                    CompanyYearFkEndDate:{key: 'entityCompanyYearServiceFkEndDate'},
                    HasCostCode: {key: 'entityHasCostCode'},
                    CompanyPeriodFk: {key: 'entityTradingPeriodFk'},
                    CompanyPeriodFkStartDate: {key: 'entityCompanyTradingPeriodFkStartDate'},
                    CompanyPeriodFkEndDate: {key: 'entityCompanyTradingPeriodFkEndDate'},
                    HasContCostCode: {key: 'entityHasControllingCostCode'},
                    ValueTypeFk: {key: 'entityValueTypeFk'},
                    ProjectFk: {key: 'entityProjectFk'},
                    HasAccount: {key: 'entityHasAccount'},
                    Total: {key: 'entityTotal'},
                    TotalOc: {key: 'entityTotalOc'},
                    IsFinal: {key: 'isFinal'},
                    AccountFk: {key: 'entityAccountFk'},
                    Amount: {key: 'entityAmount'},
                    AmountOc:{key: 'entityAmountOc'},
                    AmountProject:{key: 'entityAmountProject'},
                    MdcContrCostCodeFk: {key: 'entityControllingCodeFk'},
                    CurrencyFk: {key: 'entityCurrencyFk'},
                    MdcControllingUnitFk: {key: 'entityControllingUnitFk'},
                    MdcCostCodeFk: {key: 'entityCostCodeFk'},
                    Quantity: {key: 'entityQuantity'},
                    UomFk: {key: 'entityUomFk'},
                    NominalDimension1: {key: 'entityProjectFk'},
                    NominalDimension2: {key: 'entityHasAccount'},
                    NominalDimension3: {key: 'entityTotal'},
                })
            },
            overloads: {
                ControllingUnitCode: {readonly: true},
                ControllingUnitDescription: {readonly: true},
                ContrCostCodeCode : { readonly: true },
                ContrCostCodeDescription : { readonly: true },
                Code: {
                    readonly: true,
                    navigator: {
                        moduleName: 'controlling.actuals',
                        targetIdProperty: 'CompanyCostHeaderFk'
                    }
                },
                HasContCostCode: {readonly: true},
                HasCostCode: {readonly: true},
                HasAccount: {readonly: true},

                companyyearfkstartdate: {
                    enableCache: true,
                    readonly: true
                },
                companyyearfkenddate: {
                    enableCache: true,
                    readonly: true
                },

                companyperiodfkstartdate: {
                    enableCache: true,
                    readonly: true
                },
                companyperiodfkenddate: {
                    enableCache: true,
                    readonly: true
                },

            }
        };
    }
}