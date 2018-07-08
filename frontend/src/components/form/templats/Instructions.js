import React from 'react';
import Input from '../../input';
import Label from '../../label';
import Button from '../../button';
import Context from './context';
import ReactS3 from 'react-s3';
import './style.css';

const config = {
  bucketName: 'crisis-class-room',
  region: 'eu-west-2',
  accessKeyId: process.env.REACT_APP_S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.REACT_APP_S3_SECRET_ACCESS_KEY,
};

class Form extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      instructions: props.instructions,
    };
  }

  onChangeInstructionshandler = (e, index) => {
    const instruction = this.state.instructions[index];
    const newinstructionName = {
      ...instruction,
      [e.target.name]: e.target.value,
    };
    this.setState({
      instructions: this.state.instructions.map(
        (instruction, i) => (i === index ? newinstructionName : instruction)
      ),
    });
  };

  onChangeImageInstructionshandler = (e, index) => {
    const instruction = this.state.instructions[index];
    const file = e.target.files[0];
    ReactS3.upload(file, config).then((result) => {
      const newinstructionImage = {
        ...instruction,
        instructionImage: result.location,
      };
      this.setState({
        instructions: this.state.instructions.map(
          (instruction, i) => (i === index ? newinstructionImage : instruction)
        ),
      });
    });
  };

  addInstructionsHandler = (e) => {
    this.setState({
      instructions: [
        ...this.state.instructions,
        {
          instructionId: this.state.instructions.length + 1,
          instructionName: '',
          instructionImage: '',
        },
      ],
    });
  };

  removeInstructionsImgHandler = (instructionId) => {
    const { instructions } = this.state;
    instructions.forEach((instruction) => {
      if (instruction.instructionId === instructionId) {
        instruction.instructionImage = null;
      }
    });
    this.setState({
      instructions,
    });
  };

  removeInstructionsHandler = (i) => {
    const { instructions } = this.state;
    let removeResult = instructions.filter(
      (instruction) => instruction.instructionId !== i
    );

    this.setState({
      instructions: removeResult,
    });
  };

  render() {
    return (
      <div>
        <div>
          {this.props.id ? (
            <h2> Edit, Remove or add instructions </h2>
          ) : (
            <h2> Add instructions </h2>
          )}
          <div>
            {this.state.instructions &&
              this.state.instructions.map(
                ({ instructionName, instructionImage, instructionId }, i) => {
                  return (
                    <div className="lessonForm" key={i}>
                      <div className="form-group">
                        <Label value="instruction Name" />
                        <div className="lessonInput">
                          <Input
                            className="form-control"
                            type="text"
                            name="instructionName"
                            onChange={(e) =>
                              this.onChangeInstructionshandler(e, i)}
                            placeholder="instruction"
                            value={instructionName}
                          />
                          {!instructionImage ? (
                            <div>
                              <label className="btn btn-outline-dark">
                                Upload an image
                                <input
                                  style={{ display: 'none' }}
                                  type="file"
                                  name="instructionImage"
                                  onChange={(e) =>
                                    this.onChangeImageInstructionshandler(e, i)}
                                  accept="image/*"
                                />
                              </label>
                            </div>
                          ) : (
                            <div
                              className="image-container"
                              onClick={() =>
                                this.removeInstructionsImgHandler(instructionId)}
                            >
                              <img
                                className="image"
                                width="100px"
                                src={instructionImage}
                                alt="instruction"
                              />
                              <div className="middle">
                                <div className="text">Remove</div>
                              </div>
                            </div>
                          )}
                          &nbsp;
                          <Button
                            className="btn btn-outline-danger lessonBtn"
                            value="Remove"
                            onClick={() =>
                              this.removeInstructionsHandler(instructionId)}
                          />
                        </div>
                      </div>
                    </div>
                  );
                }
              )}
          </div>
          <Button
            className="btn btn-outline-dark "
            value="Add"
            onClick={this.addInstructionsHandler}
          />
          &nbsp;
          <div style={{ display: 'flex' }}>
            <Button
              className="btn btn-outline-dark "
              value="previous"
              onClick={this.props.previousFormHandler}
            />
            &nbsp;
            <Button
              className="btn btn-outline-dark "
              value="Next"
              onClick={() =>
                this.props.onAddInstructions(this.state.instructions)}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default class instructionsFormWrapper extends React.Component {
  render() {
    return (
      <Context.Consumer>
        {({ onAddInstructions, instructions, previousFormHandler }) => (
          <Form
            instructions={instructions}
            onAddInstructions={onAddInstructions}
            previousFormHandler={previousFormHandler}
            {...this.props}
          />
        )}
      </Context.Consumer>
    );
  }
}