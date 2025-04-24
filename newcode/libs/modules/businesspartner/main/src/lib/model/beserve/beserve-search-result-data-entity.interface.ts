/*
 * Copyright(c) RIB Software GmbH
 */

export interface IBeserveSearchResultDataEntity {
	id: number;
	status?: string | null;
	statusastext?: string | null;
	requestid?: string | null;
	bedirectno?: string | null;
	score: number;
	CompanyName1?: string | null;
	CompanyName2?: string | null;
	CompanyName3?: string | null;
	companyname?: string | null;
	street?: string | null;
	zipcode?: string | null;
	location?: string | null;
	address?: string | null;
	areacode?: string | null;
	phone?: string | null;
	phonecomplete?: string | null;
	crefono?: string | null;
	CrefoCentralNo?: string | null;
	Usage1?: string | null;
	Usage2?: string | null;
	resulttype: number;
	bindtoexistingbpd?: boolean | null;
	CompanyFk: number;
	bpislive: boolean;
	bpid: number;
	vatno?: string | null;
	countrycode?: string | null;
	faxareacode?: string | null;
	faxnumber?: string | null;
	faxcomplete?: string | null;
	interneturl?: string | null;
	email?: string | null;
	traderegistertype?: string | null;
	traderegisterlocation?: string | null;
	traderegisterused?: string | null;
	traderegisternoused?: string | null;
	traderegisternosupplement?: string | null;
	traderegisterno?: string | null;
	taxno?: string | null;
	taxnofed?: string | null;
	taxnoused?: string | null;
	branchcode?: string | null;
	branchtext?: string | null;
	Messages?: string[] | null;
	message?: string | null;
}
