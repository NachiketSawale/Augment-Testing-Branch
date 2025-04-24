import { IDescriptionInfo, IEntityIdentification } from '@libs/platform/common';

export class BasicsCountryEntity implements IEntityIdentification {
	public Id!: number;
	public DescriptionInfo!: IDescriptionInfo;
	public Iso2!: string;
	public Iso3!: string;
	public AreaCode!: string;
	public AddressFormatFk! : number;
	public IsDefault!: boolean;
	public RecordState!: string;
	public RegexVatno!: string;
	public RegexTaxno!: string;
	public VatNoValidExample!: string;
	public TaxNoValidExample!: string;
	public InsertedAt!: Date;
	public InsertedBy!: number;
	public UpdatedAt?: Date;
	public UpdatedBy?: number;
	public Version!: number;
}
