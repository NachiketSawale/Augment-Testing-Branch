import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {PlatformConfigurationService, ServiceLocator} from '@libs/platform/common';
import {ICharacteristicValueEntity} from '@libs/basics/interfaces';
import {
	BasicsSharedCharacteristicDataDiscreteValueLookupService
} from './basics-characteristic-data-discrete-value-lookup.service';

@Injectable({
	providedIn: 'root'
})
export class BasicsSharedCharacteristicCharacteristicValueDataService <TItem extends ICharacteristicValueEntity>{
	protected http = inject(HttpClient);
	protected configurationService = inject(PlatformConfigurationService);
	protected queryPath = this.configurationService.webApiBaseUrl + 'basics/characteristic/discretevalue/list?mainItemId=';
	protected defaultListqueryPath = this.configurationService.webApiBaseUrl + 'basics/characteristic/discretevalue/list';
	private characteristicDiscreteValueDataCache: { [key: number]: TItem[] } = {};
	private defaultCharacteristicDiscreteValueDataCache: TItem[] = [];
	private discreteValueLookupService = ServiceLocator.injector.get(BasicsSharedCharacteristicDataDiscreteValueLookupService);

	public getList(characteristicId: number, refresh: boolean = false): Observable<TItem[]> {
		return new Observable(observer => {
			if (this.characteristicDiscreteValueDataCache[characteristicId] && !refresh) {
				observer.next(this.characteristicDiscreteValueDataCache[characteristicId]);
				observer.complete();
			} else {
				this.http.get<TItem[]>(this.queryPath + characteristicId).subscribe((res) => {
					/// todo estimate case data process
					const items = res;
					this.characteristicDiscreteValueDataCache[characteristicId] = items;
					observer.next(items);
					observer.complete();
				});
			}
		});
	}

	public getDefaultItem(characteristicFk:number) {
		const list = this.discreteValueLookupService.syncService?.getListSync();
		return list?.find(item => item.CharacteristicFk === characteristicFk && item.IsDefault);
		
	}

	public getDefaultItemAsync(characteristicFk:number):Observable<ICharacteristicValueEntity> {
		return new Observable(observer => {
			let item = this.getDefaultItem(characteristicFk);
			if(item) {
				observer.next(item);
				observer.complete();
			} else {
				this.discreteValueLookupService.getList().subscribe(items=>{
					item = items?.find(e => e.CharacteristicFk === characteristicFk && e.IsDefault);
					observer.next(item);
					observer.complete();
				});
			}
		});
	}
}