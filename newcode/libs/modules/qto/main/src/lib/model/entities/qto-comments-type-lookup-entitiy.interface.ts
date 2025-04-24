import {IDescriptionInfo} from '@libs/platform/common';

export class QtoCommentsTypeLookupEntity {
    public Id?: number|null;
    public IsWrite?: boolean|false;
    public IsRead?: boolean|false;
    public IsCreate?: boolean|false;
    public IsDelete?: boolean|false;
    public IsDefault?:boolean|false;
    public DescriptionInfo?: IDescriptionInfo | null;
}