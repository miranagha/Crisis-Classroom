import React from "react";

const Context = React.createContext({
  id:"",
  lessonTitle: "",
  lessonTitleImage: "",
  timeToPrepare: "",
  timeToPrepareImage: "",
  numberOfPeople: "",
  numberOfPeopleImage: "",

  tools: [],
  ingredients: [],
  instructions: [],
  onAddLessonTitles: null,
  onAddTools: null,
  onAddIngredients: null,
  onAddInstructions: null,
  previousFormHandler: null
});
export default Context;
