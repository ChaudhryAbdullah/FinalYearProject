define(["require", "jquery", "knockout", "pubsub", "moment"], function (require, $, ko, pubsub, moment) {
  function AddEventFormModel() {
    var _this = this,
      alphaNumericUnderScoreDash = /^[a-zA-Z0-9-_]+$/,
      maxNameLength = 100;

    _this.name = ko.observable("");
    _this.description = ko.observable("");
    _this.datetime = ko.observable("");
    _this.state = ko.observable("");// construtor returns an observable

    pubsub.subscribe("stateChange", function (newState) {
      _this.state(newState);
      console.log(_this.state());
    });


    function ValidateForm() {

      if (_.isEmpty(_this.name())) {
        alert("Please enter name");
        return false;
      }

      if (!alphaNumericUnderScoreDash.test(_this.name())) {
        alert("Only alhpanumeric characters are allowed for name field");
        return false;
      }

      if (_this.name() > maxNameLength) {
        alert("Name can be maximum 100 characters");
        return false;
      }

      if (_.isEmpty(_this.description())) {
        alert("Please enter description");
        return false;
      }

      if (!alphaNumericUnderScoreDash.test(_this.description())) {
        alert("Only alhpanumeric characters are allowed for description field");
        return false;
      }


      if (!moment(_this.datetime()).isValid()) {
        alert("Please enter a valid date");
        return false;
      }

      if (moment(_this.datetime()).isBefore(moment())) {
        alert("Event date can't be in the past.");
        return false;
      }

      return true;

    }

    _this.OnSubmitForm = function (d, t) {

      // Validate if the form fields are correct
      if (!ValidateForm()) {
        return;
      }

      //Grab the form data
      var form = $(t.target).parents("form").first()[0];
      var nf = new FormData(form);

      $.ajax({
        url: window.location.origin + "/addEvent",
        type: 'POST',
        data: nf,
        async: false,
        success: function (data) {
          pubsub.publish("stateChange", "newsfeed");
        },
        cache: false,
        contentType: false,
        processData: false
      });

      return false;

    };

    _this.onCancel = function () {
      pubsub.publish("stateChange", "newsfeed");
    }
  }

  return new AddEventFormModel();
});