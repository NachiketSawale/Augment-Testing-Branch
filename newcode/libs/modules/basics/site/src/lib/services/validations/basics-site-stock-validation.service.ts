import { BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions, ValidationInfo, ValidationResult } from '@libs/platform/data-access';
import { BasicsSite2StockEntity } from '../../model/basics-site2-stock-entity.class';
import { inject, Injectable } from '@angular/core';
import { BasicsSite2StockDataService } from '../basics-site2-stock-data.service';
@Injectable({
	providedIn: 'root',
})

export class BasicsSiteStockValidationService extends BaseValidationService<BasicsSite2StockEntity> {
    private dataService =inject(BasicsSite2StockDataService);

    protected generateValidationFunctions(): IValidationFunctions<BasicsSite2StockEntity> {
        return {
            PrjStockFk: this.validatePrjStockFk,
            PrjStockLocationFk: this.validatePrjStocklocationFk
        };
    }
    protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<BasicsSite2StockEntity> {
        return this.dataService;   
    }

    protected validatePrjStockFk(info: ValidationInfo<BasicsSite2StockEntity>): ValidationResult {
        return this.validateIsMandatory(info);
    }

    protected validatePrjStocklocationFk(info: ValidationInfo<BasicsSite2StockEntity>) : ValidationResult {
        return this.validateIsMandatory(info);
    }
    
}