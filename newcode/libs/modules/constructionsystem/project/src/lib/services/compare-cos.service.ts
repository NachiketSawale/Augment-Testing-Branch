import { inject, Injectable } from '@angular/core';
import { PlatformHttpService } from '@libs/platform/common';
import { ICosCompareEntity } from '../model/entities/cos-compare-entity.interface';


@Injectable({ providedIn: 'root' })
export class ConstructionSystemProjectCompareCosService {
	private readonly http = inject(PlatformHttpService);

	public async compare(payload: object) {
		return await this.http.post<{data: ICosCompareEntity}>('constructionsystem/main/instance/compare', payload);
	}

	public async autoUpdate(items: object) {
		return await this.http.post<void>('constructionsystem/main/instance/autoupdate', items);
	}

}