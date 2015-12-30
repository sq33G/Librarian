var Librarian = Librarian || {};

Librarian.app = Librarian.app || angular.module('librarianApp', []);

Librarian.app.service("publisherService", function PublisherService() {
    var that = this;

    that.publishers = JSON.parse($(".model-container").val());
    that.detailsUrl = $(".url-container.details").val();
    that.createUrl = $(".url-container.create-view").val();
    that.addUrl = $(".url-container.create").val();
    that.deleteUrl = $(".url-container.delete").val();
    that.editUrl = $(".url-container.edit").val();
    that.updateUrl = $(".url-container.update").val();

    that.detailsContent = $("#detailPopupContainer .modal");
    that.createContent = $("#createPopupContainer .modal");
    that.deleteContent = $("#deletePopupContainer .modal");
    that.editContent = $("#editPopupContainer .modal");

    that.createContent.add(that.editContent).on("shown.bs.modal", function () {
        $(this).find("#name").select();
    });

    var modalByUrl = {};
    modalByUrl[that.createUrl] = that.createContent;
    modalByUrl[that.detailsUrl] = that.detailsContent;
    modalByUrl[that.deleteUrl] = that.deleteContent;
    modalByUrl[that.editUrl] = that.editContent;

    that.setDefaultButton = function (url) {
        var defaultButton = modalByUrl[url].find("button.btn-primary");
        modalByUrl[url].find("input").keypress(function (eventArgs) {
            if (eventArgs.which == 13)
                defaultButton.click();
            if (eventArgs.which == 27)
                modalByUrl[url].modal('hide');
        });
    };

    that.publisherData = {
        newPublisher: new Publisher(),
        currPublisher: {}
    };

    that.displayPublisher = function (publisher) {
        if (publisher)
            that.publisherData.currPublisher = publisher;

        that.detailsContent.modal();
    };

    that.createPublisher = function () {
        that.createContent.modal();
    }

    that.displayDeletePublisher = function (publisher) {
        that.publisherData.currPublisher = publisher;
        //TODO merge/remove PublisherItem
        that.deleteContent.modal();
    };

    that.displayEditPublisher = function (publisher) {
        that.detailsContent.modal('hide');

        if (publisher)
            that.publisherData.currPublisher = publisher;
        //otherwise use currently set currPublisher

        that.editContent.modal();
    };
})

.controller("publisherCtrl", function PublisherCtrl(publisherService, $scope, $http, $filter) {
    var that = this;

    that.publishers = publisherService.publishers;

    that.displayPublisher = publisherService.displayPublisher;
    that.createPublisher = publisherService.createPublisher;
    that.displayDeletePublisher = publisherService.displayDeletePublisher;
    that.displayEditPublisher = publisherService.displayEditPublisher;

    $scope.$on('$includeContentLoaded', function (eventArgs, src) {
        publisherService.setDefaultButton(src);
    });
})

.controller("publisherDetailCtrl", function PublisherDetailCtrl(publisherService, $filter) {
    var that = this;

    that.publisherData = publisherService.publisherData;
    that.displayPublisherUrl = publisherService.detailsUrl;
    that.displayEditPublisher = publisherService.displayEditPublisher;
})

.controller("publisherDeleteCtrl", function PublisherDeleteCtrl(publisherService, $http, $scope) {
    var that = this;

    that.publisherData = publisherService.publisherData;
    that.displayPublisherUrl = publisherService.detailsUrl;

    that.deletePublisher = function () {
        var id = that.publisherData.currPublisher.ID;
        $http.post(publisherService.deleteUrl,
                   { id: id })
             .then(function (deletedID) {
                 Librarian.removeByID(publisherService.publishers, deletedID.data);
                 publisherService.deleteContent.modal('hide');
             })
    };
})


.controller("publisherCreateCtrl", function PublisherCreateCtrl(publisherService, $scope, $http, validationService) {
    var that = this;
    that.form = function () { return $scope.createForm; };

    that.publisherData = publisherService.publisherData;
    that.createPublisherUrl = publisherService.createUrl;

    that.invalidFieldClass = function (field) {
        return validationService.invalidFieldClass(that.form(), field);
    };

    that.invalidIconClass = function (field) {
        return validationService.invalidIconClass(that.form(), field);
    };

    that.addPublisher = function () {
        if (!validationService.validateForm(that.form()))
            return;

        $http.post(publisherService.addUrl,
                   publisherService.publisherData.newPublisher)
             .then(function (addedPublisher) {
                 publisherService.publishers.push(addedPublisher.data);
                 publisherService.publisherData.newPublisher = new Publisher();
                 publisherService.publisherData.currPublisher = addedPublisher.data;
                 publisherService.createContent.modal('hide');
                 that.form().$setPristine();
                 publisherService.displayPublisher();
             });
    };
})

.controller("publisherEditCtrl", function PublisherEditCtrl(publisherService, $scope, $http, validationService) {
    var that = this;
    that.form = function () { return $scope.editForm; };

    that.editPublisherUrl = publisherService.editUrl;
    that.publisherData = {};

    publisherService.editContent.on("show.bs.modal", function () {
        that.publisherData.currPublisher = angular.copy(publisherService.publisherData.currPublisher);
    });

    that.invalidFieldClass = function (field) {
        if (!field) return '';
        return validationService.invalidFieldClass(that.form(), field);
    };

    that.invalidIconClass = function (field) {
        if (!field) return '';
        return validationService.invalidIconClass(that.form(), field);
    };

    that.updatePublisher = function () {
        if (!validationService.validateForm(that.form()))
            return;

        $http.post(publisherService.updateUrl,
                   that.publisherData.currPublisher)
             .then(function (updatedPublisher) {
                 angular.copy(updatedPublisher.data, publisherService.publisherData.currPublisher);
                 publisherService.editContent.modal('hide');
                 that.form().$setPristine(); //not submitted for next use
                 publisherService.displayPublisher();
             });
    };
});

function Publisher() {
    this.ID = 0;
    this.Name = "";
    this.Address = "";
    this.City = "";
    this.StateProvince = "";
    this.Country = "";
    this.Zip = "";
    this.RowState = 0;
}
