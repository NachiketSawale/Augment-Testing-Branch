import { inject, Injectable } from '@angular/core';
import { PlatformConfigurationService, PlatformHttpService } from '@libs/platform/common';
import { Observable } from 'rxjs';
import { ICharacteristicEntity } from '@libs/basics/interfaces';
import { ICharacteristicCodeLookupOptions } from '../model/characteristic-code-lookup-options.interface';

/**
 * Characteristic search Service
 */

@Injectable({
	providedIn: 'root',
})
export class BasicsCharacteristicSearchService {
	protected http = inject(PlatformHttpService);
	protected configurationService = inject(PlatformConfigurationService);
	protected queryPath = 'basics/characteristic/characteristic/lookup?sectionId=';
	private characteristicDataListCache: { [key: number]: ICharacteristicEntity[] } = {};
	private characteristicEntityCache: { [key: number]: ICharacteristicEntity | null } = {};

	public getList(sectionId: number, refresh: boolean = false): Observable<ICharacteristicEntity[]> {
		return new Observable((observer) => {
			if (this.characteristicDataListCache[sectionId] && !refresh) {
				observer.next(this.characteristicDataListCache[sectionId]);
				observer.complete();
			} else {
				this.http.get$(this.queryPath + sectionId).subscribe((res) => {
					const items = res as ICharacteristicEntity[];
					if (this.isSectionLoaded(sectionId, items)) {
						items.forEach((item) => {
							item.SectionId = sectionId;
						});
					}
					this.characteristicDataListCache[sectionId] = items;
					observer.next(items);
					observer.complete();
				});
			}
		});
	}

	public search(options: ICharacteristicCodeLookupOptions): Observable<ICharacteristicEntity[]> {
		return new Observable((observer) => {
			this.getList(options.sectionId).subscribe((res) => {
				const originalResult = res as ICharacteristicEntity[];
				const result = [];
				const listBySection = this.getListBySection(options.sectionId, originalResult);
				if (listBySection) {
					let characteristicIds2Remove: number[] = [];
					if (options.entityListFilter) {
						characteristicIds2Remove = options.entityListFilter().map((e) => e.CharacteristicFk);
					}
					for (let i = 0; i < listBySection.length; i++) {
						const used = characteristicIds2Remove.indexOf(listBySection[i].Id);
						if (!listBySection[i].IsReadonly && used === -1) {
							result.push(listBySection[i]);
						}
					}
				}
				observer.next(result);
			});
		});
	}

	public getListBySection(sectionId: number, list: ICharacteristicEntity[]): ICharacteristicEntity[] | undefined {
		return list.filter((v) => (v.SectionId = sectionId));
	}

	private isSectionLoaded(sectionId: number, data: ICharacteristicEntity[]) {
		return data.length > 0 && data.findIndex((item) => item.SectionId == sectionId) !== -1;
	}

	/**
	 *
	 * @param characteristicFk
	 * @param sectionId
	 * @param refresh
	 */
	public getItemByCharacteristicFk(characteristicFk: number, sectionId: number, refresh: boolean = false): Observable<ICharacteristicEntity | null> {
		return new Observable((observer) => {
			if (!characteristicFk) {
				observer.next();
				observer.complete();
				return;
			}
			let item: ICharacteristicEntity | undefined;
			/// get from listCache first
			if (this.characteristicDataListCache[sectionId] && !refresh) {
				item = this.characteristicDataListCache[sectionId].find((e) => e.Id == characteristicFk);
			}
			if (!item) {
				this.getItemById(characteristicFk).subscribe((characteristic) => {
					observer.next(characteristic);
					observer.complete();
				});
			} else {
				observer.next(item);
				observer.complete();
			}
		});
	}

	/**
	 * get characteristic by id
	 * @param id
	 * @param refresh
	 */
	public getItemById(id: number, refresh: boolean = false): Observable<ICharacteristicEntity | null> {
		return new Observable((observer) => {
			if (this.characteristicEntityCache[id] && !refresh) {
				observer.next(this.characteristicEntityCache[id]);
				observer.complete();
			} else {
				this.http.get$<ICharacteristicEntity>('basics/characteristic/characteristic/getcharacteristicbyid?id=' + id).subscribe((item) => {
					this.characteristicEntityCache[id] = item;
					observer.next(item);
					observer.complete();
				});
			}
		});
	}
}
