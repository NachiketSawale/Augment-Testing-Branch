import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PlatformConfigurationService } from '@libs/platform/common';
import { Observable } from 'rxjs';
import {ICharacteristicGroupEntity} from '@libs/basics/interfaces';
@Injectable({
    providedIn: 'root'
})
export class BasicsSharedCharacteristicPopupGroupService {
    protected http = inject(HttpClient);
    protected configurationService = inject(PlatformConfigurationService);
    protected queryPath = this.configurationService.webApiBaseUrl + 'basics/characteristic/group/treebysection?sectionId=';
    private characteristicGroupCache: { [key: number]: ICharacteristicGroupEntity[] } = {};

    /**
     * get group list by section id
     * @param sectionId
     * @param refresh
     */
    public getListBySectionId(sectionId: number, refresh: boolean = false): Observable<ICharacteristicGroupEntity[]> {
        return new Observable(observer => {
            if (this.characteristicGroupCache[sectionId] && !refresh) {
                observer.next(this.characteristicGroupCache[sectionId]);
                observer.complete();
            } else {
                this.http.get<ICharacteristicGroupEntity[]>(this.queryPath + sectionId).subscribe((res) => {
                    this.characteristicGroupCache[sectionId] = res;
                    observer.next(res);
                    observer.complete();
                });
            }
        });
    }

}