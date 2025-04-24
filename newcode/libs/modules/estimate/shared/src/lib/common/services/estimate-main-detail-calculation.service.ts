import * as _ from 'lodash';
import { EstimateMainResourceType } from '../../../../../shared/src/lib/common/enums/estimate-main-resource-type.enum';
import { inject, Injectable } from '@angular/core';
import { evaluate } from 'mathjs';
import { PlatformConfigurationService, PlatformLanguageService, PropertyType } from '@libs/platform/common';

@Injectable({
	providedIn: 'root'
})
export class EstimateMainDetailCalculationService {

	private contextService = inject(PlatformConfigurationService);
	private platformLanguageService = inject(PlatformLanguageService);

	public calculateDetailRelProp<T extends object>(item: T, detailRelValue:number, detailProp:keyof T){
		const detailStr = this.calculateValueByCulture(detailRelValue.toString());
		_.set(item, detailProp, detailStr);
	}

	public calculateDetailProp<T extends object>(item: T, detailVal:string, detailRelProp:keyof T, defaultValue: number = 1){
		//TODO: waiting for estimateMainCommonFeaturesService
		// let hasCalculatedColumn = estimateMainCommonFeaturesService.getHasCalculatedColumn();
		// if(hasCalculatedColumn && hasCalculatedColumn === detailProp){
		// 	estimateMainCommonFeaturesService.clearHasCalculatedColumn();
		// 	return;
		// }

		if(('EstResourceTypeFk' in item) && item.EstResourceTypeFk === EstimateMainResourceType.ComputationalLine){
			detailVal = detailVal.replace(/\s/gi, '')
				                   .replace(/['"].*?['"]/gi, '')
				                   .replace(/{.*?}/gi, '');
		}

		// eslint-disable-next-line no-useless-escape
		detailVal = detailVal.replace(/[`~§!@#$&|=?;:"<>\s{}\[\]\\]/gi, '')
			                   .replace(/,/gi, '.')
			                   .replace(/['"].*?['"]/gi, '')
			                   .replace(/{.*?}/gi, '');

		// eslint-disable-next-line no-useless-escape
		const list  = detailVal.match(/\b[a-zA-Z]+[\w|\s*-\+\/]*/g);
		const chars = ['sin', 'tan', 'cos', 'ln'];
		const result = _.filter(list, (word) => !chars.includes(word));

		item[detailRelProp] = result && !result.length ? evaluate(detailVal.replace(/\*\*/g, '^')) : detailVal;
	}

	/**
	 * @name calculateValueByCulture
	 * @methodOf EstimateMainCommonCalculationService
	 * @description Adjust value by culture
	 * @param {decimal} value
	 * @return {array} Value adjusted by culture
	 */
	public calculateValueByCulture (value: string): string {
		let result =value;
		const culture =  this.contextService.savedOrDefaultUiCulture;
		const cultureInfo = this.platformLanguageService.getLanguageInfo(culture);
		if(cultureInfo && cultureInfo.numeric) {
			const numberDecimal = cultureInfo.numeric.decimal;
			const inverseNumberDecimal = numberDecimal === ',' ? '.' : ',';
			if (typeof value === 'string' && value.indexOf(numberDecimal) === -1 && value.indexOf(inverseNumberDecimal) !== -1) {
				result = value.replace('.',',');
			}
		}
		return result;
	}

	/**
	 * @name getIsMapCulture
	 * @methodOf EstimateMainCommonCalculationService
	 * @description Check if Value is as per culture
	 * @param {decimal} value
	 * @return {boolean} isMapCulture result of checking if Value is as per culture
	 */
	public getIsMapCulture (value: PropertyType | undefined): boolean{
		let isMapCulture = true;
		const culture = this.contextService.savedOrDefaultUiCulture;
		if(culture){
			const cultureInfo = this.platformLanguageService.getLanguageInfo(culture);
			if(cultureInfo && cultureInfo.numeric) {
				const numberDecimal = cultureInfo.numeric.decimal;
				const inverseNumberDecimal = numberDecimal === ',' ? '.' : ',';
				if (typeof value === 'string' && value.indexOf(numberDecimal) !== -1 && value.indexOf(inverseNumberDecimal) !== -1) {
					isMapCulture = false;
				} else if (typeof value === 'string' && value.indexOf(numberDecimal) === -1 && value.indexOf(inverseNumberDecimal) !== -1) {
					isMapCulture = false;
				}
			}
		}
		return isMapCulture;
	}
}