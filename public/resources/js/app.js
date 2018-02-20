
var app = angular.module('students', ['angularUtils.directives.dirPagination']);

app.controller('productCTRL', function ($scope, $http) {

    $scope.loader = {
        loading: false
    };

    $scope.showCreateForm = function () {

        $scope.clearForm();
        $('#modal-product-title').text('crear New Student');

        // hide update product button
        $('#btn-update-product').hide();

        // show create product button
        $('#btn-create-product').show();

    };

    // Clear form values
    $scope.clearForm = function () {
        $scope.id = "";
        $scope.name = "";
        $scope.apellidos = "";
        $scope.carrera = "";
        $scope.age = "";
        $scope.modalstatustext = "";
    };

    // Hide Form fields
    $scope.hideFormFields = function () {
        $('#form-dinminder').hide();
    };

    // Show Form fields
    $scope.showFormFields = function () {
        $('#form-dinminder').show();
    };

    //Read all entries
    $scope.getAll = function () {

        $scope.loader.loading = true;

        $http.get("api/list")
            .success(function (response) {
                if (response.error === 2) {
					//if error code is returned from node code, then there are no entries in db!
					$scope.statustext = "There are currently no students available!";
					$scope.loader.loading = false;
				} else {
					$scope.names = response.students;
					//Turn off spinner
					$scope.loader.loading = false;
					$scope.statustext = "";
				}
            })
            .error(function (data, status, headers, config) {
                $scope.loader.loading = false;
                $scope.statustext = "There was an error fetching data, please check database connection!";
            });
    };

    $scope.readOne = function (id) {

        $scope.clearForm();
        $scope.hideFormFields();


        $('#modal-product-title').text("Editar eStudiant");

        $('#btn-update-product').show();

        $('#btn-create-product').hide();

        $scope.loader.loading = true;


        $http.get('api/list/' + id)
            .success(function (data, status, headers, config) {

                $scope.showFormFields();

                $scope.id = data.product[0].id;
                $scope.nombre = data.product[0].nombre;
                $scope.apellidos = data.product[0].apellidos;
                $scope.carrera = data.product[0].carrera;
                $scope.age = data.product[0].edad;


                $('#myModal').modal('show');

                $scope.loader.loading = false;
            })
            .error(function (data, status, headers, config) {

                $scope.loader.loading = false;
                $scope.modalstatustext = "There was an error fetching data";
            });
    };

    $scope.createProduct = function () {

        $scope.loader.loading = true;

        $http.post('/api/insert', {
            'name' : $scope.name,
            'lastname' : $scope.lastname,
            'carrera' : $scope.carrera,
            'age' : $scope.age
        })
            .success(function (data, status, headers, config) {

                $('#myModal').modal('hide');

                $scope.clearForm();

                $scope.getAll();
            })
            .error(function (data, status, headers, config) {
                $scope.loader.loading = false;
                $scope.modalstatustext = "Unable to Update data!";
            });
    };

    $scope.updateProduct = function () {

        $scope.loader.loading = true;

        $http.put('/api/update', {
            'id' : $scope.id,
            'name' : $scope.name,
            'lastname' : $scope.lastname,
            'carrera' : $scope.carrera,
            'age' : $scope.age
        })
            .success(function (data, status, headers, config) {

                $('#myModal').modal('hide');

                $scope.clearForm();

                $scope.getAll();
            })
            .error(function (data, status, headers, config) {
                $scope.loader.loading = false;
                $scope.modalstatustext = "Unable to Update data!";
            });
    };

    $scope.deleteProduct = function (id) {
        $scope.loader.loading = true;

        $http.post('/api/delete', {
            'id' : id
        })
            .success(function (data, status, headers, config) {
                $('#confirm' + id).modal('hide');

                $scope.getAll();
            })
            .error(function (data, status, headers, config) {
                $scope.modalstatustext = "imposible!";
                $scope.getAll();
            });
    };

});
