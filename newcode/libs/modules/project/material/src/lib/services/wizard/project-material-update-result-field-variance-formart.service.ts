/*
 * Copyright(c) RIB Software GmbH
 */

import {inject, Injectable} from '@angular/core';
import {ContextService, PlatformLanguageService} from '@libs/platform/common';
import {formatNumber} from 'accounting';
import * as _ from 'lodash';

@Injectable({
    providedIn: 'root'
})
export class ProjectMaterialUpdateResultFieldVarianceFormartService {

    private readonly contextService = inject(ContextService);
    private readonly languageService = inject(PlatformLanguageService);
    private culture = this.contextService.culture();
    private cultureInfo = this.culture ? this.languageService.getLanguageInfo(this.culture) : undefined;

    // public formatter(row, cell, value, columnDef) {
    //     if (columnDef && columnDef.formatterOptions) {
    //         const formattedValue = getFormattedValue(value, FieldVarianceFormatterOptions.decimalPlaces, FieldVarianceFormatterOptions.dataType);
    //         if (this.isFormattedValueEqualToZero(formattedValue, FieldVarianceFormatterOptions.decimalPlaces, FieldVarianceFormatterOptions.dataType)) {
    //             return formattedValue;
    //         }
    //         else {
    //             return '<span style="color: #FF0000">' + formattedValue + '</span>';
    //         }
    //     }
    //     return '';
    // }

    private getFormattedValue(value: number, precision: number) {
        if (_.isNumber(value)) {
            const decimal = this.cultureInfo?.numeric.decimal;
            return formatNumber(value, precision, this.cultureInfo?.numeric.thousand, decimal);
        }
        return '';
    }

    public IsEqualToZero(value: number, precision: number) {
        const tempValue = this.getFormattedValue(value, precision);
        if (tempValue) {
            return tempValue === this.getBaseValue(precision);
        }
        return true;
    }

    private isFormattedValueEqualToZero(formattedValue: string, precision: number) {
        if (formattedValue) {
            return formattedValue === this.getBaseValue(precision);
        }
        return true;
    }

    private getBaseValue(precision: number) {
        let baseValue = '0';
        const decimal = this.cultureInfo?.numeric.decimal;
        for (let i = 0; i < precision; ++i) {
            if (i === 0) {
                baseValue += decimal;
            }
            baseValue += '0';
        }
        return baseValue;
    }

}