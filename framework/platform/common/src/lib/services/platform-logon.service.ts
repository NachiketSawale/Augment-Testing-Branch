import {Injectable} from '@angular/core';

@Injectable({
	providedIn: 'root'
})

export class PlatformLogonService {
	private authenticated: boolean = false;
	public constructor() {
	}

	public setAuthenticated(value: boolean): void {

		this.authenticated = value;
	}

	public isLoggedOn(): boolean {

		return this.authenticated;
	}
}
