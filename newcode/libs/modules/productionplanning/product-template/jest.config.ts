/* eslint-disable */
export default {
	displayName: 'modules-productionplanning-product-template',
	preset: '../../../../jest.preset.js',
	transform: {
		'^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
	},
	moduleFileExtensions: ['ts', 'js', 'html'],
	coverageDirectory: '../../../../coverage/libs/modules/productionplanning/product-template',
};
