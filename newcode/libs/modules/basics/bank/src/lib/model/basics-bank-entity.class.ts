import { IEntityIdentification } from '@libs/platform/common';

export class BasicsBankEntity implements IEntityIdentification {
	public Id!: number;
	public BasCountryFk! :number;
	public Sortcode!:string;
	public BankName!:string;
	public Street! :string;
	public Zipcode! :string;
	public City! :string;
	public Bic! :string;
	public InsertedAt!: Date;
	public InsertedBy!: number;
	public UpdatedAt?: Date;
	public UpdatedBy?: number;
	public Version!: number;
}
