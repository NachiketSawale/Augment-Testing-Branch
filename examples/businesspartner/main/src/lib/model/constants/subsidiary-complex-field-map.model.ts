export const SUBSIDIARY_COMPLEX_FIELD_MAP: {[key: string]: {dto: string, pattern: string | null}} = {
	'SubsidiaryDescriptor.AddressDto': {dto: 'AddressDto', pattern: null},
	'SubsidiaryDescriptor.TelephoneNumber1Dto': {dto: 'TelephoneNumber1Dto', pattern: 'TelephonePattern'},
	'SubsidiaryDescriptor.TelephoneNumber2Dto': {dto: 'TelephoneNumber2Dto', pattern: 'Telephone2Pattern'},
	'SubsidiaryDescriptor.TelephoneNumberTelefaxDto': {dto: 'TelephoneNumberTelefaxDto', pattern: 'TelefaxPattern'},
	'SubsidiaryDescriptor.TelephoneNumberMobileDto': {dto: 'TelephoneNumberMobileDto', pattern: 'MobilePattern'},
	'Email': {dto: 'Email', pattern: null}
};