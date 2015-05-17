define(["require", "jquery", "knockout", "pubsub"], function (require, $, ko, pubsub) {
  function AddEventFormModel() {
    var _this = this;
    _this.name = ko.observable("");
    _this.description = ko.observable("");
    _this.state = ko.observable("");// construtor returns an observable

    pubsub.subscribe("stateChange", function (newState) {
      _this.state(newState);
      console.log(_this.state());
    });// pubsub.subscribe event handles state change

    _this.OnSubmitForm = function (d, t) {
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