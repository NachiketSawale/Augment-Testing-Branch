import {IDescriptionInfo, IEntityIdentification} from '@libs/platform/common';

export class BasicsIndexHeaderEntity implements IEntityIdentification {
    public Id!: number;
    public CurrencyFk!: number;
    public RateFactorFk!: number;
    public Code! :string;
    public DescriptionInfo!:IDescriptionInfo;
    public CommentText!:string;
    public UserDefined1! :string;
    public UserDefined2! :string;
    public UserDefined3! :string;
    public UserDefined4! :string;
    public UserDefined5! :string;
    public InsertedAt!: Date;
    public InsertedBy!: number;
    public UpdatedAt?: Date;
    public UpdatedBy?: number;
    public Version!: number;
}