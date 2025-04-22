import { Injectable } from '@angular/core';
import { platformDomainList } from '../constant/platformDomainList';

@Injectable({
	providedIn: 'root'
})
export class PlatformDomainService {

	private loadDomain(domainName: string | number) {
		return platformDomainList[domainName];
	}
}
