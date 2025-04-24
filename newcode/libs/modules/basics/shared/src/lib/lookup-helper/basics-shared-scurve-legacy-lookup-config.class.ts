export const BasicsSharedSCurveLegacyConfig = {
	uuid: '618e6e14-c0c2-4fa6-9764-3f4c981fdc7b',
	valueMember: 'Id',
	displayMember: 'DescriptionInfo.Translated',
	serverSideFilter: {
		key: 'basics-scurve-lookup-filter',
		execute: () => {
			return 'sorting >' + 0;
		},
	}
};
