(function (angular) {
	'use strict';
	var moduleName = 'project.main';

	/**
	 * @ngdoc service
	 * @name resourceSkillConditionConstantValues
	 * @function
	 *
	 * @description
	 * resourceSkillConditionConstantValues provides definitions and constants frequently used in resource skill module
	 */
	angular.module(moduleName).value('projectMainConstantValues', {
		schemes: {
			action: {typeName: 'ActionDto', moduleSubModule: 'Project.Main'},
			actionEmployee: {typeName: 'ActionEmployeeDto', moduleSubModule: 'Project.Main'},
			billTo: {typeName: 'ProjectBillToDto', moduleSubModule: 'Project.Main'},
			biddingConsortium: {typeName: 'BiddingConsortiumDto', moduleSubModule: 'Project.Main'},
			bizPartnerSite: {typeName: 'ProjectBusinessPartnerSiteDto', moduleSubModule: 'Project.Main'},
			clerkRole: {typeName: 'ProjectRoleDto', moduleSubModule: 'Project.Main'},
			clerkSite: {typeName: 'ProjectClerkSiteDto', moduleSubModule: 'Project.Main'},
			company: {typeName: 'CompanyDto',moduleSubModule: 'Basics.Company'},
			costGroupCatalog: {typeName: 'CostGroupCatalogDto', moduleSubModule: 'Project.Main'},
			costGroup: {typeName: 'CostGroupDto', moduleSubModule: 'Project.Main'},
			project2Clerk: {typeName: 'Project2ClerkDto', moduleSubModule: 'Project.Main'},
			projectPublishedCompany: {typeName: 'ProjectPublishedCompanyDto', moduleSubModule: 'Project.Main'},
			project2SalesTaxCode: {typeName: 'Project2SalesTaxCodeDto', moduleSubModule: 'Project.Main'},
			release: {typeName: 'ProjectReleaseDto', moduleSubModule: 'Project.Main'},
			salesTaxMatrix: {typeName: 'SalesTaxMatrixDto', moduleSubModule: 'Project.Main'},
			timekeeping2Clerk: { typeName: 'Timekeeping2ClerkDto', moduleSubModule: 'Project.Main' },
			managedPlantLoc: { typeName: 'ManagedPlantLocVDto', moduleSubModule: 'Project.Main' },
			tenderResults: { typeName: 'TenderResultDto', moduleSubModule: 'Project.Main'},
			activity: {typeName: 'ActivityDto', moduleSubModule: 'Project.Main'},
			picture: {typeName: 'ProjectPictureDto', moduleSubModule: 'Project.Main'}
		},
		uuid: {
			container: {
				projectList: '713b7d2a532b43948197621ba89ad67a',
				projectDetails: 'e33fc83676e9439a959e4d8c2f4435b6',
				actionToList: '67d04e0fce4442519adf8fb786749bbf',
				actionToDetails: 'a9c6b70e70be4043b540e2aa69a4b5c2',
				actionEmployeeList: 'a10753eb750d4f208863daef08e31f0d',
				actionEmployeeDetails: '8e59e6b041084802a12a64d7e52a2b43',
				biddingConsortiumList: '08fbf6f22fe04a619eb91ec02b35c54e',
				biddingConsortiumDetails: '2b0b2115f71e4d30af1a8ee3c244b6dd',
				billToList: '8f386520b10f4707936d7dbc36c976b8',
				billToDetails: '0cd910bacc8b4bacac0d4a5bf5cf2319',
				bizPartnerSiteList: 'fdedb62839b849ddb8cddf717d561e9d',
				bizPartnerSiteDetails: 'cc4f2574ded745f296fc516a6d1e0c62',
				clerkRoleList: 'dc92d091a0d044639d43778058510e8c',
				clerkRoleDetails: '400358467500411da957e0ea5e805ca1',
				clerkSiteList: 'dd03663c3664443c9a25f2187bddba84',
				clerkSiteDetails: '635efc6ae0534575b2a93847cef76139',
				costGroupCatalogList: '02a8e37bada946f9939ce17f551cab6d',
				costGroupCatalogDetails: '9ff91fd62965439d95102a1a62b48741',
				costGroupList: 'e1f73b4dbf484db98db890921790c6d6',
				costGroupDetails: '138ba13460d6421dac6566fb65076b2b',
				project2Clerk: '975AEC379E4E4B02BE76CCB7A0059F65',
				project2Company: '038bd9f8e0114c3e8c14940baa458935',
				project2SalesTaxCodeList: '323812e8f71549019915dbb494a65142',
				project2SalesTaxCodeDetail: '7cb4984e06ba46a4bb64ff72d169d23b',
				releaseList: 'fa709a78d4f94faaaf224d31ec05093f',
				releaseDetails: '3447b10db17548e496012f8871b7fdea',
				salesTaxMatrixList: '08a1a648b75547dda3fa06bb151a1eee',
				salesTaxMatrixDetail: 'fc8217925f694f2296112740a1aa8b1b',
				timekeeping2ClerkList: 'f15717298ad24cf0a7891b3a4a6900ba',
				timekeeping2ClerkDetail: 'c9902287755c4d51bacc15895b8fcb83',
				managedPlantLocList: 'dc5f95a4f8c143a8ae0b2521a83d4e19',
				managedPlantLocDetails: '6ff893e4f04448d38552f2e3678e2c25',
				activityList: '2a107e4b607d4358892d1ed762495f8c',
				activityDetails: '69980c941e9d4295b41c586c74919b1f',
				pictureList: 'd233150e79da4216b311676ef48051df',
				pictureView: '69980c941e9d4295b41c586c74919b1f'
			}
		},
		values: {
			projectRubricId: 3,
			saleRubricId: 41,
			locationRubricId: 85,
			iTwo5DProject: 4,
			iTwo40Project: 5,
			billToRubricId: 108
		}
	});
})(angular);
