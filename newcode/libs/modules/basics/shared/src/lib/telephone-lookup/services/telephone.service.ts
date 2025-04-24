/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { TelephoneEntity } from '../model/telephone-entity';
import { CountryEntity, UiCommonCountryLookupService } from '@libs/ui/common';
import { HttpClient } from '@angular/common/http';
import { PlatformConfigurationService } from '@libs/platform/common';
import { iif, Observable, tap, of } from 'rxjs';
import { TelephoneBracketMode } from '../model/enums/telephone-bracket-mode';
import { TelephoneScheme } from '../model/interfaces/telephone-scheme';

@Injectable({
	providedIn: 'root'
})
export class BasicsSharedTelephoneService {
	private telephoneBracketMode?: TelephoneBracketMode;
	private telephoneScheme?: TelephoneScheme;
	private configService = inject(PlatformConfigurationService);
	private httpClient = inject(HttpClient);
	private countryService = inject(UiCommonCountryLookupService<CountryEntity>);

	private format(pattern: string, ...args: Array<string | undefined>): string {
		for (let i = 0; i < args.length; i++) {
			pattern = pattern.replace('@' + (i + 1), args[i] || '');
		}
		return pattern;
	}

	/**
	 * Retrieve the telephone scheme settings.
	 */
	public getTelephoneScheme(): Observable<TelephoneScheme> {
		return iif(
			() => this.telephoneScheme !== undefined,
			of(this.telephoneScheme as TelephoneScheme),
			this.httpClient
				.get<TelephoneScheme>(this.configService.webApiBaseUrl + 'basics/common/systemoption/telephonescheme')
				.pipe(
					tap(v => {
						this.telephoneScheme = v;
					})
				)
		);
	}

	/**
	 * Retrieve the telephone bracket settings.
	 */
	public getTelephoneBracketMode(): Observable<TelephoneBracketMode> {
		return iif(
			() => this.telephoneBracketMode !== undefined,
			of(this.telephoneBracketMode as TelephoneBracketMode),
			this.httpClient
				.get<TelephoneBracketMode>(this.configService.webApiBaseUrl + 'basics/common/systemoption/showbracketintelephonemode')
				.pipe(
					tap(v => {
						this.telephoneBracketMode = v;
					})
				)
		);
	}

	/**
	 * Format telephone with specified bracket mode.
	 * @param item - Telephone entity.
	 * @param telephoneBracketMode - Bracket mode.
	 */
	public formatTelephone(item: TelephoneEntity, telephoneBracketMode: TelephoneBracketMode): string {
		const counties = this.countryService.syncService?.getListSync();
		const country = item.CountryFk && counties ? counties.find(c => c.Id === item.CountryFk) : null;
		const countryAreaCode = country ? country.AreaCode : '';
		let areaCode = item.AreaCode;

		if (areaCode) {
			// remove leading zero from area code
			let zeroCode = '';
			while (areaCode && areaCode[0] === '0') {
				if (telephoneBracketMode === TelephoneBracketMode.Switzerland) {
					zeroCode += areaCode[0];
				}
				areaCode = areaCode.slice(1);
			}
			if (telephoneBracketMode === TelephoneBracketMode.Bracket) {
				areaCode = '(' + (areaCode || 0) + ')';
			} else if (telephoneBracketMode === TelephoneBracketMode.Switzerland) {
				if (zeroCode.length > 0) {
					areaCode = '(' + zeroCode + ')' + areaCode;
				}
			}
		}
		return this.format('@1 @2 @3 @4', countryAreaCode, areaCode, item.PhoneNumber, item.Extention ? ('- ' + item.Extention) : '');
	}

	/**
	 * Format pattern field.
	 * @param item Telephone entity.
	 */
	public formatPattern(item: TelephoneEntity): string {
		const counties = this.countryService.syncService?.getListSync();
		const country = item.CountryFk && counties ? counties.find(c => c.Id === item.CountryFk) : null;
		const countryAreaCode = country ? country.AreaCode : '';
		return this.format('@1@2@3@4', countryAreaCode, item.AreaCode, item.PhoneNumber, item.Extention);
	}

}
