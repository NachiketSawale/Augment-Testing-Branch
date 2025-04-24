import {Injectable} from '@angular/core';
import {ILookupContext, ILookupServerSideFilter, ServerSideFilterValueType} from '@libs/ui/common';
import {CurrencyEntity} from '@libs/basics/shared';

@Injectable({
	providedIn: 'root'
})
export class ProcurementCommonCurrencyConversionFilterService implements ILookupServerSideFilter<CurrencyEntity, {CompanyFk: number}> {
	/**
	 * Key
	 */
	public key: string = 'bas-currency-conversion-filter';

	/**
	 * Executor
	 * @param context
	 */
	public execute(context: ILookupContext<CurrencyEntity, {CompanyFk: number}>): ServerSideFilterValueType | Promise<ServerSideFilterValueType> {
		return {
			companyFk: context.entity?.CompanyFk
		};
	}
}