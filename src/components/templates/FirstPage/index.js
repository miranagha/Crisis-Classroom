import React from "react";
import { Grid, Row, Col } from "react-flexbox-grid/lib";
import Tools from "./tools";
import TimeToPrepair from "./timeToPrepair";
import NumberOfPeople from "./numberOfPeople";
import LessonTitle from "./lessonTitle";
import Ingredients from "./ingredients";
import Instructions from "./insturctions";
import Instructionsparttwo from "./instructionsparttwo";
import Fakedb from "../../../data/Fakedb.json";

import "./style.css";

export default class FirstPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lesson: null
    };
  }

  componentDidMount() {
    const { id } = this.props.match.params
    const lesson = Fakedb.find(
      g => g.lessons.id === parseInt(id, 10)
    );
    this.setState({ lesson: lesson.lessons });
  }

  render() {
    const { lesson } = this.state;
    if (lesson === null) {
      return <h1>Loading....</h1>;
    }
    return (
      <div>
            <Grid fluid className="container" >
              <Row className="minrow">
                <Col className="box1" lg={3} {...this.props}>
                  <LessonTitle
                    lessonTitle={lesson.lessonTitle}
                    lessonImg={lesson.lessonImg}
                  />
                  <TimeToPrepair
                    timeToPrepair={lesson.timeToPrepair}
                    timeToPrepairClock={lesson.timeToPrepairClock}
                  />
                  <NumberOfPeople
                    numberOfPeople={lesson.numberOfPeople}
                    peopleSymbol={lesson.peopleSymbol}
                  />
                  <hr />
                  <Tools
                    tools={lesson.tools}
                    toolsItem={lesson.toolsItem}
                  />
                </Col>
                <Col className="box1" lg={3} {...this.props}>
                  <Ingredients
                    ingredient={lesson.ingredient}
                    ingredients={lesson.ingredients}
                  />
                </Col>
                <Col className="box1" lg={3} {...this.props}>
                  <Instructions
                    instruction={lesson.instruction}
                    instructions={lesson.instructions}
                  />
                </Col>
                <Col className="box1" lg={3} {...this.props}>
                  <Instructionsparttwo instructions={lesson.instructions} />
                </Col>
              </Row>
            </Grid>
      </div>
    );
  }
}