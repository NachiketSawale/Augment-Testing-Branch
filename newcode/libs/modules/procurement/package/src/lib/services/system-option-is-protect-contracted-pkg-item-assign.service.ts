import { inject, Injectable } from '@angular/core';
import { PlatformHttpService } from '@libs/platform/common';

@Injectable({
	providedIn: 'root',
})
export class ProcurementPackageSystemOptionIsProtectContractedPackageItemAssignmentService {
	private readonly httpService = inject(PlatformHttpService);
	private isProtected: boolean | null = null;

	public async getIsProtectedAsync() {
		const result = await this.httpService.get<number>('basics/common/systemoption/isshowpackageautoupdatemessagebox');
		const isProtected = result !== 0;
		this.setIsProtected(isProtected);
		return Promise.resolve(isProtected);
	}

	public getIsProtected() {
		if (this.isProtected !== null) {
			return this.isProtected;
		}
		throw new Error('run function getIsProtectedAsync() first.');
	}

	private setIsProtected(isProtected: boolean) {
		this.isProtected = isProtected;
	}
}