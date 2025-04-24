/*
 * Copyright(c) RIB Software GmbH
 */
import { interval } from 'rxjs';
import { inject, Injectable } from '@angular/core';
import { PlatformHttpService } from '@libs/platform/common';
import { IBasicsBim360TokenEntity } from '../model/entities/basics-bim360-token-entity.interface';
import { BasicsBim360AuthenticationType } from '../model/enums/basics-bim360-authentication-type.enum';
import { IBasicsBim360ResponseEntity } from '../model/entities/response/basics-bim360-response-entity.interface';

/**
 * Autodesk bim360 authentication service.
 */

@Injectable({
	providedIn: 'root',
})
export class BasicsSharedBim360AuthenticationService {
	private readonly http = inject(PlatformHttpService);

	private readonly storageKey_bim360Auth = 'bim360Auth';
	private readonly storageKey_bim360AuthCode = 'bim360AuthCode';

	/**
	 * Set refreshed token and save to sessionStorage.
	 * @param tokenInfo token.
	 * @param tokenInfo2 second token.
	 */
	public updateSessionToken(tokenInfo: IBasicsBim360TokenEntity | null, tokenInfo2: IBasicsBim360TokenEntity | null) {
		if (tokenInfo) {
			this.setSessionAuth(tokenInfo);
		}
		if (tokenInfo2) {
			this.setSessionAuth(tokenInfo2);
		}
	}

	/**
	 * Set refreshed token and save to sessionStorage.
	 * @param tokenInfo token.
	 */
	public setSessionAuth(tokenInfo: IBasicsBim360TokenEntity | null): void {
		if (!tokenInfo) {
			return;
		}
		const cachedToken = window.sessionStorage.getItem(this.storageKey_bim360Auth);
		const jsonToken = cachedToken ? JSON.parse(cachedToken) : {};

		if (tokenInfo.tokenLegged === BasicsBim360AuthenticationType.ThreeLegged) {
			jsonToken.threeLeggedAuth = tokenInfo;
		} else {
			jsonToken.twoLeggedAuth = tokenInfo;
		}
		window.sessionStorage.setItem(this.storageKey_bim360Auth, JSON.stringify(jsonToken));
	}

	/**
	 * Get last saved token from sessionStorage.
	 * @param tokenLeggedType two-legged or three-legged.
	 */
	public getSessionAuth(tokenLeggedType: BasicsBim360AuthenticationType): IBasicsBim360TokenEntity | null {
		const cachedToken = window.sessionStorage.getItem(this.storageKey_bim360Auth);
		if (!cachedToken) {
			return null;
		}
		const jsonToken = JSON.parse(cachedToken);
		return tokenLeggedType === BasicsBim360AuthenticationType.TwoLegged ? jsonToken.twoLeggedAuth : jsonToken.threeLeggedAuth;
	}

	/**
	 * Get default two legged token.
	 */
	public getDefaultTwoLeggedToken(): IBasicsBim360TokenEntity {
		return { tokenLegged: BasicsBim360AuthenticationType.TwoLegged, getTokenTime: null, expires_in: 0 };
	}

	/**
	 * Check whether token is expired or not.
	 * @param tokenInfo token.
	 */
	public tokenIsExpired(tokenInfo: IBasicsBim360TokenEntity | null): boolean {
		let isExpired = true;
		if (tokenInfo) {
			isExpired = this.checkIfTokenIsExpired(tokenInfo);
		}
		return isExpired;
	}

	private checkIfTokenIsExpired(tokenInfo: IBasicsBim360TokenEntity): boolean {
		if (!tokenInfo.getTokenTime) {
			return true;
		}
		const curUTC = new Date(); // Get the current UTC time
		const tokenUTC = new Date(tokenInfo.getTokenTime); // Convert token time to a Date object
		const expireInSeconds = tokenInfo.expires_in; // Get the expiration time of the token (in seconds)

		// Calculate the difference between current time and token time
		const diffInSeconds = (curUTC.getTime() - tokenUTC.getTime()) / 1000;

		// Check if the token is expired
		return diffInSeconds > expireInSeconds - 1200;
	}

	/**
	 * Get the authorization code and then get a 3-Legged Token with the Authorization Code.
	 */
	public async getAuthCode(): Promise<IBasicsBim360TokenEntity | null> {
		const authorizeUrl = await this.getAuthorizeUrl();
		if (!authorizeUrl) {
			return null;
		}
		const newAuthCode = await this.checkAuthorizationCodeReady(authorizeUrl);
		if (newAuthCode) {
			const response = await this.getToken(newAuthCode);
			if (response.TokenInfo) {
				this.setSessionAuth(response.TokenInfo);
				return response.TokenInfo;
			}
		}
		return null;
	}

	private async getAuthorizeUrl(): Promise<string | null> {
		try {
			return await this.http.get<string>('basics/common/bim360/init');
		} catch (error) {
			console.error('Error while fetching authorize URL:', error);
			return null;
		}
	}

	private async getToken(authCode: string): Promise<IBasicsBim360ResponseEntity> {
		const tokenInfo = {
			authCode: authCode,
			tokenLegged: BasicsBim360AuthenticationType.ThreeLegged,
		};

		try {
			const res = await this.http.post('basics/common/bim360/getToken', tokenInfo);
			return res as IBasicsBim360ResponseEntity;
		} catch (error) {
			console.error('Error while fetching token:', error);
			throw error;
		}
	}

	private checkAuthorizationCodeReady(authorizeUrl: string): Promise<string | null> {
		return new Promise<string | null>((resolve /*reject*/) => {
			const preAuthCode = window.localStorage.getItem(this.storageKey_bim360AuthCode);

			/**
			 * adding winLeft and winTop to account for dual monitor
			 * using screenLeft and screenTop for IE8 and earlier
			 */
			const winLeft = window.screenLeft ? window.screenLeft : window.screenX;
			const winTop = window.screenTop ? window.screenTop : window.screenY;
			/**
			 * window.innerWidth displays browser window's height and width excluding toolbars
			 * using document.documentElement.clientWidth for IE8 and earlier
			 */
			const width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
			const height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
			const popUpWidth = 400;
			const popUpHeight = 600;
			const left = width / 2 - popUpWidth / 2 + winLeft;
			const top = height / 2 - popUpHeight / 2 + winTop;

			const popupWindow = window.open(authorizeUrl, '', `width=${popUpWidth}, height=${popUpHeight}, top=${top}, left=${left}`);
			if (popupWindow) {
				if (popupWindow.focus) {
					popupWindow.focus();
				}

				const sub = interval(2000).subscribe(() => {
					let isClosed = false;
					if (popupWindow.closed) {
						sub.unsubscribe();
						isClosed = true;
					}
					const newAuthCode = window.localStorage.getItem(this.storageKey_bim360AuthCode);
					if (newAuthCode && newAuthCode !== preAuthCode) {
						sub.unsubscribe();
						resolve(newAuthCode);
					} else if (isClosed) {
						resolve(null);
					}
				});
			}
		});
	}
}
