/**
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Meta, moduleMetadata } from '@storybook/angular';
import { HttpClient, HttpClientModule } from '@angular/common/http';

import { MapComponent } from './map.component';

import { PlatformTranslateService } from '@libs/platform/common';
import { BaiduMapService } from '../../services/baidu-map.service';
import { BingMapService } from '../../services/bing-map.service';
import { GoogleMapService } from '../../services/google-map.service';
import { MapUtilityService } from '../../services/map-utility.service';
import { OpenstreetMapService } from '../../services/openstreet-map.service';
import { PlatformConfigurationService } from '@libs/platform/common';

export default {
	title: 'MapComponent',
	component: MapComponent,
	decorators: [
		moduleMetadata({
			imports: [HttpClientModule],
			declarations: [],
			providers: [MapUtilityService, GoogleMapService, BingMapService, OpenstreetMapService, BaiduMapService, PlatformTranslateService, HttpClient, PlatformConfigurationService],
		}),
	],
	parameters: {
		mockData: [
			{
				url: 'https://apps-int.itwo40.eu/itwo40/daily/services/basics/common/systemoption/map',
				method: 'GET',
				status: 200,
				response: {
					Provider: 'google',
					GoogleKey: 'AIzaSyATKBhVqIulVmVb_OrYwenAtKUVGwjs3n4',
					BingKey: 'AjtUzWJBHlI3Ma_Ke6Qv2fGRXEs0ua5hUQi54ECwfXTiWsitll4AkETZDihjcfeI',
					BaiduKey: 'p8eeB8bcEuSY5nWPrLh7~7AKQiYGDsRfMfcHgZnXjGQ~AkjIMAePhjEZ-',
				},
			},
		],
	},
} as Meta<MapComponent>;

export const SingleMark = {
	render: (args: MapComponent) => ({
		props: args,
	}),
	args: {
		showRoutes: false,
		canCalculateDist: false,
		entity: {
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
	},
};

export const MultipuleMark = {
	render: (args: MapComponent) => ({
		props: args,
	}),
	args: {
		showRoutes: false,
		canCalculateDist: false,
		entity: [
			{
				Address: 'Corestraße 99\r\n531232323 Bremen\r\nGermany',
				AddressLine: 'Corestraße 99\r\n531232323 Bremen\r\nGermany',
				AddressModified: false,
				City: 'Bremen',
				CountryDescription: 'Germany',
				CountryFk: 56,
				CountryISO2: 'DE',
				County: null,
				Id: 1026225,
				InsertedAt: '2021-05-26T10:17:19.88Z',
				InsertedBy: 1723,
				Latitude: 53.1067848,
				Longitude: 8.8520527,
				StateDescription: null,
				StateFk: 5,
				Street: 'Corestraße 99',
				Version: 2,
				ZipCode: '531232323',
			},
			{
				Address: 'Schellingstr. 24\r\n70771 Stuttgart\r\nGermany',
				AddressLine: 'Schellingstr. 24\r\n70771 Stuttgart\r\nGermany',
				AddressModified: false,
				City: 'Stuttgart',
				CountryDescription: 'Germany',
				CountryFk: 56,
				CountryISO2: 'DE',
				County: null,
				Id: 1026142,
				InsertedAt: '2021-04-27T16:14:06.187Z',
				InsertedBy: 1897,
				Latitude: null,
				Longitude: null,
				StateDescription: null,
				StateFk: 4,
				Street: 'Schellingstr. 24',
				Version: 11,
				ZipCode: '70771',
			},
			{
				Address: 'LIC colony, Latur\r\nMaharashtra\r\nIndia',
				AddressLine: 'LIC colony, Latur\r\nMaharashtra\r\nIndia',
				AddressModified: false,
				City: 'latur',
				CountryDescription: 'India',
				CountryFk: 56,
				CountryISO2: 'DE',
				County: null,
				Id: 1026225,
				Latitude: 18.3784131,
				Longitude: 76.5692526,
				StateDescription: null,
				StateFk: 5,
				Street: 'LIC colony',
				Version: 2,
				ZipCode: '531232323',
				isSelected: false,
			},
		],
	},
};

export const ShowRoute = {
	render: (args: MapComponent) => ({
		props: args,
	}),
	args: {
		showRoutes: true,
		canCalculateDist: true,
		entity: [
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
		],
	},
};
