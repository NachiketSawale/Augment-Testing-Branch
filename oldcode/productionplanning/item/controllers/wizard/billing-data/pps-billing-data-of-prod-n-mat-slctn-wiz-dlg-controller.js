/**
 * Created by zwz on 12/27/2024.
 */
(function (angular) {
	'use strict';

	const moduleName = 'productionplanning.item';

	angular.module(moduleName).controller('ppsBillingDataOfProductAndMaterialSelectionWizardDialogController', Controller);
	Controller.$inject = ['$scope', '$options', 'ppsBillingDataOfProductAndMaterialSelectionWizardDialogService', '$timeout', 'platformGridAPI'
	];

	function Controller($scope, $options, dialogService, $timeout, platformGridAPI) {
		dialogService.initialize($scope, $options);

		// function onResize() {
		// 	$timeout(function () {
		// 		const gridIds = ['1fa2bbb32c83499f8f614a8c86f8d298', '25d25c016a58447aa19c553284e077af'];
		// 		gridIds.forEach(gridId => {
		// 			if (platformGridAPI.grids.exist(gridId))
		// 				platformGridAPI.grids.resize(gridId);
		// 		});
		// 	});
		// }
		//
		// $(window).bind('resize', onResize);
		//
		// $scope.$on('$destroy', function () {
		// 	$(window).unbind('resize', onResize);
		//
		// });

	}
})(angular);
