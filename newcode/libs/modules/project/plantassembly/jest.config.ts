/* eslint-disable */
export default {
	displayName: 'modules-project-plantassembly',
	preset: '../../../../jest.preset.js',
	transform: {
		'^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
	},
	moduleFileExtensions: ['ts', 'js', 'html'],
	coverageDirectory: '../../../../coverage/libs/modules/project/plantassembly',
};
