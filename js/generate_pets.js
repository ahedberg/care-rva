API_KEY = "3e527387ba0fea1b5d96f4b68ceeff45";
URL = "http://api.petfinder.com/shelter.getPets";
SHELTER_ID = "VA601";
MAX_PETS = 40;

function extractData_(petApiData) {
  var petData = []
  var petList = petApiData["petfinder"]["pets"]["pet"];
  for (var i = 0; i < petList.length; i++) {
    var pet = petList[i];
    var breedList = [];
    var breedObjects = pet["breeds"]["breed"];
    var breeds = "";
    if (Object.prototype.toString.call(breedObjects) !== "[object Array]") {
      breeds = breedObjects["$t"];
    } else {
      for (var j = 0; j < breedObjects.length; j++) {
        breedList.push(breedObjects[j]["$t"]);
      }
      breeds = breedList.join(", ");
    }
    var photo = null;
    try {
      var photoList = pet["media"]["photos"]["photo"];
      for (var j = 0; j < photoList.length; j++) {
        if (photoList[j]["@id"] === "1" && photoList[j]["@size"] === "x") {
          photo = photoList[j]["$t"];
          break;
        }
      }
    } catch (e) {}
    petData.push({
      id: pet["id"]["$t"],
      name: pet["name"]["$t"],
      breeds: breeds,
      age: pet["age"]["$t"],
      sex: pet["sex"]["$t"] === 'F' ? "Female" : "Male",
      photo: photo
    });
  }
  renderPets_(petData);
}

function renderPets_(petData) {
  var currentRow;
  for (var i = 0; i < petData.length; i++) {
    // Add new row
    if (i % 4 === 0) {
      currentRow = $("#inner-container").append("<div class=\"row\">");
    }
    // Add column for dog
    currentRow.append(
      "<div class=\"col-lg-3\">" +
      "<p><img class=\"featurette-image img-responsive\" src=" + petData[i].photo + "></p>" +
      "<h3 class=\"muted featurette-heading\">" + petData[i].name + "</h3>" +
      "<p class=\"lead\">" + petData[i].breeds + "</p>" +
      "<p class=\"lead\">" + petData[i].age + " " + petData[i].sex + "</p>" +
      "<p class=\"lead\"><a href=\"https://www.petfinder.com/petdetail/" + petData[i].id + "\" target=\"_blank\">More information</a></p>" +
      "</div>"
    );
    // End row
    if (i % 4 === 3) {
      $("#inner-container").append("</div>");
    }
  }
  // Finish columns and row if needed
  if (petData.length % 4 === 0) {
    return;
  }
  for (var i = petData.length % 4; i < 4; i++) {
    currentRow.append("<div class=\"col-lg-3\"></div>");
  }
  $("#inner-container").append("</div>");
}

function embedPetfinderIframe_(err) {
  console.log(err);
  $("#inner-container").append(
      "<div class=\"row\"><div class=\"col-lg-12\">" +
      "<iframe style=\"width: 700px; height: 600px; margin: 0;\" src=\"https://fpm.petfinder.com/petlist/petlist.cgi?shelter=VA601&status=A&age=&limit=25&offset=0&animal=&title=&style=20&ref=_x1q4eXN3bjS5R8\" width=\"700px\" height=\"600px\" hspace=\"0\" vspace=\"0\"  frameborder=\"0\" scrolling=\"yes\" marginheight=\"0\" marginwidth=\"0\" bordercolor=\"#000000\"></iframe>" +
      "</div></div>");
}

function load() {
  var url_params = "?key=" + API_KEY + "&id=" + SHELTER_ID + "&count=" +
      MAX_PETS + "&output=full&format=json&callback=?";
  $.getJSON(URL + url_params)
      .done(extractData_)
      .error(embedPetfinderIframe_);
}
