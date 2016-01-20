var Librarian = Librarian || {};

Librarian.app = Librarian.app || angular.module('librarianApp', []);

Librarian.app
.factory("Patron", function patronFactory() {
    return function Patron() {
        this.ID = 0;
        this.FirstName = "";
        this.LastName = "";
        this.Title = "";
        this.PatronType = { Value: 4, Text: "Student" },
        this.RowState = 0;
    };
})
.service("patronService", function PatronService(ServiceWithDialogs, Patron) {
    var that = new ServiceWithDialogs();

    that.patrons = JSON.parse($(".model-container").val());
    that.patronTypes = JSON.parse($("#lookupPatronType").val());

    that.addUrl = $(".url-container.create").val();
    that.deleteUrl = $(".url-container.delete").val();
    that.updateUrl = $(".url-container.update").val();

    that.patronData = {
        newPatron: new Patron(),
        currPatron: {}
    };

    that.displayPatron = function (patron) {
        if (patron)
            that.patronData.currPatron = patron;

        that.showDetails();
    };

    that.createPatron = function () {
        that.showCreate();
    }

    that.displayDeletePatron = function (patron) {
        that.patronData.currPatron = patron;
        //TODO merge/remove PatronItem
        that.showDelete();
    };

    that.displayEditPatron = function (patron) {
        that.hideDetails();

        if (patron)
            that.patronData.currPatron = patron;
        //otherwise use currently set currPatron

        that.showEdit();
    };

    return that;
})   

.controller("patronCtrl", function PatronCtrl(patronService, $scope) {
    var that = this;

    that.patrons = patronService.patrons;

    that.displayPatron = patronService.displayPatron;
    that.createPatron = patronService.createPatron;
    that.displayDeletePatron = patronService.displayDeletePatron;
    that.displayEditPatron = patronService.displayEditPatron;
})

.controller("patronDetailCtrl", function PatronDetailCtrl(patronService) {
    var that = this;

    that.patronData = patronService.patronData;
    that.displayEditPatron = patronService.displayEditPatron;
})

.controller("patronDeleteCtrl", function PatronDeleteCtrl(patronService, librarian, $http, $scope) {
    var that = this;

    that.patronData = patronService.patronData;

    that.deletePatron = function () {
        var id = that.patronData.currPatron.ID;

        $scope.notifyDialogSending();
        $http.post(patronService.deleteUrl,
                   { id: id })
             .then(function (deletedID) {
                 $scope.notifyDialogSendComplete();
                 librarian.removeByID(patronService.patrons, deletedID.data);
                 patronService.deleteContent.modal('hide');
             })
    };
})

.controller("patronCreateCtrl", function PatronCreateCtrl($scope, $http, patronService, ValidatingForm, Patron) {
    var that = new ValidatingForm();
    that.form = function () { return $scope.createForm; };

    that.patronData = patronService.patronData;
    that.patronTypes = patronService.patronTypes;

    that.addPatron = function () {
        if (!that.isValid())
            return;

        $scope.notifyDialogSending();
        $http.post(patronService.addUrl,
                   patronService.patronData.newPatron)
             .then(function (addedPatron) {
                 $scope.notifyDialogSendComplete();
                 patronService.patrons.push(addedPatron.data);
                 patronService.patronData.newPatron = new Patron();
                 patronService.patronData.currPatron = addedPatron.data;
                 $scope.hideDialog();
                 that.form().$setPristine(); //not submitted for next use
                 patronService.displayPatron();
             });
    };

    return that;
})

.controller("patronEditCtrl", function PatronEditCtrl(patronService, $http, $scope, validationService) {
    var that = this;
    that.form = function () { return $scope.editForm; };

    that.patronData = {};
    that.patronTypes = patronService.patronTypes;

    that.dialogShow = function () {
        that.patronData.currPatron = angular.copy(patronService.patronData.currPatron);
    };

    that.close = function () {
        that.form().$setPristine();
        $scope.hideDialog();
    }

    that.updatePatron = function () {
        if (!validationService.validateForm(that.form()))
            return;

        $scope.notifyDialogSending();
        $http.post(patronService.updateUrl,
                   that.patronData.currPatron)
             .then(function (updatedPatron) {
                 $scope.notifyDialogSendComplete();
                 angular.copy(updatedPatron.data, patronService.patronData.currPatron);
                 $scope.hideDialog();
                 that.form().$setPristine(); //not submitted for next use
                 patronService.displayPatron();
             });
    };

    return that;
});

