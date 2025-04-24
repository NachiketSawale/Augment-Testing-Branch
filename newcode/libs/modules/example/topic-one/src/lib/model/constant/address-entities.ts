/**
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

/**
 * Address entities.
 */

// export const AddressEntities = [
//     {
//         Address: 'Corestraße 99\r\n531232323 Bremen\r\nGermany',
//         AddressLine: 'Corestraße 99\r\n531232323 Bremen\r\nGermany',
// 	    AddressModified: false,
// 	    City: 'Bremen',
// 	    CountryDescription: 'Germany',
// 	    CountryFk: 56,
// 	    CountryISO2: 'DE',
// 	    County: null,
// 	    Id: 1026225,
// 	    InsertedAt: '2021-05-26T10:17:19.88Z',
// 	    InsertedBy: 1723,
// 	    Latitude: 53.1067848,
// 	    Longitude: 8.8520527,
// 	    StateDescription: null,
// 	    StateFk: 5,
// 	    Street: 'Corestraße 99',
// 	    Version: 2,
// 	    ZipCode: '531232323'
//     },
//     {
//         Address: 'Schellingstr. 24\r\n70771 Stuttgart\r\nGermany',
// 	    AddressLine: 'Schellingstr. 24\r\n70771 Stuttgart\r\nGermany',
// 	    AddressModified: false,
// 	    City: 'Stuttgart',
// 	    CountryDescription: 'Germany',
// 	    CountryFk: 56,
// 	    CountryISO2: 'DE',
// 	    County: null,
// 	    Id: 1026142,
// 	    InsertedAt: '2021-04-27T16:14:06.187Z',
// 	    InsertedBy: 1897,
// 	    Latitude: null,
// 	    Longitude: null,
// 	    StateDescription: null,
// 	    StateFk: 4,
// 	    Street: 'Schellingstr. 24',
// 	    Version: 11,
//         ZipCode: '70771',
//     },
// 	{
// 		Address: 'LIC colony, Latur\r\nMaharashtra\r\nIndia',
// 		AddressLine: 'LIC colony, Latur\r\nMaharashtra\r\nIndia',
// 		AddressModified: false,
// 		City: 'latur',
// 		CountryDescription: 'India',
// 		CountryFk: 56,
// 		CountryISO2: 'DE',
// 		County: null,
// 		Id: 1026225,
// 		Latitude: 18.3784131,
// 		Longitude: 76.5692526,
// 		StateDescription: null,
// 		StateFk: 5,
// 		Street: 'LIC colony',
// 		Version: 2,
// 		ZipCode: '531232323',
// 		isSelected:false
// 	}
// ];

/**
 * Single Address entity.
 */

export const AddressEntities = {
	Address: 'LIC colony, Latur\r\nMaharashtra\r\nIndia',
	AddressLine: 'LIC colony, Latur\r\nMaharashtra\r\nIndia',
	AddressModified: false,
	City: 'latur',
	CountryDescription: 'India',
	CountryFk: 56,
	CountryISO2: 'IN',
	County: null,
	Id: 1026225,
	Latitude: 18.3784131,
	Longitude: 76.5692526,
	StateDescription: null,
	StateFk: 5,
	Street: 'LIC colony',
	Version: 2,
	ZipCode: '413512',
};

/**
 * Route entity.
 */
export const RouteEntity = [
	{
		Address: 'LIC colony, Latur\r\nMaharashtra\r\nIndia',
		AddressLine: 'LIC colony, Latur\r\nMaharashtra\r\nIndia',
		AddressModified: false,
		City: null,
		CountryDescription: null,
		CountryFk: 56,
		CountryISO2: null,
		County: null,
		Id: 1031091,
		Latitude: 18.3784131,
		Longitude: 76.5692526,
		StateDescription: null,
		StateFk: 4,
		Street: null,
		Version: 3,
		ZipCode: null,
		waypointEntityId: 1001198,
	},
	{
		Address: 'Shivane, Pune\r\nMaharashtra\r\nIndia',
		AddressLine: 'Shivane, Pune\r\nMaharashtra\r\nIndia',
		AddressModified: false,
		City: 'Pune',
		CountryDescription: null,
		CountryFk: 56,
		CountryISO2: null,
		County: null,
		Id: 1025335,
		Latitude: 18.4662,
		Longitude: 73.7822,
		StateDescription: null,
		StateFk: 4,
		Street: 'Shivane, Pune',
		Version: 5,
		ZipCode: '70567',
		waypointEntityId: 1001201,
	},
];
