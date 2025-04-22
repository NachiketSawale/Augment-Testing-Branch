import { inject, Injectable } from '@angular/core';
import { PlatformHttpService } from '@libs/platform/common';

@Injectable({
	providedIn: 'root',
})
export class ProcurementPackageSystemOptionShowPackageAutoUpdateDialogService {
	private readonly httpService = inject(PlatformHttpService);
	private isShow: boolean | null = null;

	public async getIsShowAsync() {
		const result = await this.httpService.get<number>('basics/common/systemoption/isshowpackageautoupdatemessagebox');
		const isShow = result !== 0;
		this.setIsShow(isShow);
		return Promise.resolve(isShow);
	}

	public getIsShow() {
		if (this.isShow !== null) {
			return this.isShow;
		}
		throw new Error('run function getIsShowAsync() first.');
	}

	private setIsShow(isShow: boolean) {
		this.isShow = isShow;
	}
}