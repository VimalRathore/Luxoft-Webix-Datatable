'use strict';

/* App Module */

var app = angular.module('webixApp', ['webix', 'ngAnimate', 'ngSanitize', 'ui.bootstrap']);

app.controller("webixTestController", function ($scope, $http, $uibModal) {

	$scope.records = [];
	$scope.rowId = -1;
	$scope.newEmployee = {};
	$scope.currentPage = 1;
	$scope.itemPerPage = 10;

	$scope.setPage = function (pageNo) {
		$scope.currentPage = pageNo;
	};

	$scope.pageChanged = function () {
		$scope.pageLoad();
	};
	$scope.pageLoad = function () {
		$http({
			url: "http://localhost:5100/api/Employee/GetEmployees/" + $scope.currentPage + "/" + $scope.itemPerPage,
			method: "GET",
			params: { cur: $scope.currentPage, total: $scope.itemPerPage }
		}).then(
			function successCallback(response) {
				//	console.log("Result : " + JSON.stringify(response));
				$scope.totalItems = response.data.pagination.totalItems;
				$scope.records = response.data.employees;
				$scope.currentPage = response.data.pagination.currentPage;
			},
		);
	};


	$scope.pageLoad();


	$scope.getRow = function (item) {
		$scope.rowId = item;
	}
	$scope.deleteRecord = function () {
		if ($scope.rowId != -1) {
			$http.post('http://localhost:5100/api/Employee/DeleteEmployees/' + $scope.rowId).
				then(
					function successCallback(response) {
						$scope.pageLoad();
					},
				);
		}
	}
	$scope.addRecord = function (size, parentSelector) {
		var parentElem = parentSelector ?
			angular.element($document[0].querySelector('.modal-demo ' + parentSelector)) : undefined;
		var modalInstance = $uibModal.open({
			animation: true,
			ariaLabelledBy: 'modal-title',
			ariaDescribedBy: 'modal-body',
			templateUrl: 'myModalContent.html',
			controller: 'webixModalController',
			size: size,
			appendTo: parentElem,
			resolve: {
			}
		});

		
		modalInstance.result.then(function () {
			$scope.pageLoad();
		}, function () {
		});
	};


});

app.controller("webixModalController", function ($scope, $http, $uibModalInstance) {

	$scope.submitForm = function () {
		//	console.log(JSON.stringify($scope.newEmployee));
		$http.post('http://localhost:5100/api/Employee/SaveEmployees', JSON.stringify($scope.newEmployee)).
			then(
				function successCallback(response) {
					$uibModalInstance.close();
				},
			);
	}

	$scope.cancel = function () {
		$uibModalInstance.dismiss('cancel');
	};
});