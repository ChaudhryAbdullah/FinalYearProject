define(["require", "underscore", "jquery", "knockout", "pubsub", "moment"], function (require, _, $, ko, pubsub, moment) {
  function RightBarModel() {
    var _this = this,
      url = window.location.origin + "/userevents";
    _this.events = ko.observableArray();

    pubsub.subscribe("stateChange", function (newState) {
      // Fetch events
      GetEvents();
    });

    function GetEvents() {
      $.get(url, function (args) {
        args = _.map(args, function (event) {
          event.EventTime = moment(event.EventTime).format("MMMM Do YYYY, h:mm:ss a");
          return event;
        });
        _this.events(args);
      });
    }

    GetEvents();
  }

  return new RightBarModel();
});