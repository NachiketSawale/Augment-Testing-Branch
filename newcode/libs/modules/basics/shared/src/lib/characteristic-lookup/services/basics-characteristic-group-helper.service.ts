import {ICharacteristicGroupEntity} from '@libs/basics/interfaces';
import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class BasicsSharedCharacteristicGroupHelperService {
    /**
     * flatten a tree group data
     * @param input
     * @param output
     * @private
     */
    public flattenGroup(input: ICharacteristicGroupEntity[], output: ICharacteristicGroupEntity[]) {
        let i;
        for (i = 0; i < input.length; i++) {
            output.push(input[i]);
            const groups = input[i]['Groups'];
            if (groups && groups.length > 0) {
                this.flattenGroup(groups, output);
            }
        }
        return output;
    }

    /**
     * accumulate Group Ids
     * @param item
     * @param groupIds collected ids.
     * @private
     */
    public collectGroupIds(item: ICharacteristicGroupEntity, groupIds: number[]) {
        groupIds.push(item.Id);
        if (item.Groups) {
            const len = item.Groups.length;
            for (let i = 0; i < len; i++) {
                this.collectGroupIds(item.Groups[i], groupIds);
            }
        }
    }
}