import React from 'react';
import { Container, Col, Card } from 'react-bootstrap';
import {
  AutoForm,
  ErrorsField,
  SubmitField,
  TextField,
  LongTextField,
} from 'uniforms-bootstrap5';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import { withRouter } from 'react-router-dom';
import swal from 'sweetalert';
import SimpleSchema from 'simpl-schema';
import { updateMethod } from '../../../api/base/BaseCollection.methods';
import { Skills } from '../../../api/skill/SkillCollection';
import { COMPONENT_IDS } from '../../testIDs/componentIDs';

/**
 * Renders the Page for adding stuff. **deprecated**
 * @memberOf ui/pages
 */

const schema = new SimpleSchema({
  name: String,
  description: String,
});

const EditSkillWidget = ({ doc }) => {

  /** On submit, insert the data.
   * @param data {Object} the results from the form.
   * @param formRef {FormRef} reference to the form.
   */
  const submit = (data) => {
    const {
      name, description,
    } = data;

    const id = doc._id;

    const updateData = {
      id, name, description,
    };

    const collectionName = Skills.getCollectionName();
    updateMethod.call({ collectionName: collectionName, updateData: updateData },
        (error) => {
          if (error) {
            swal('Error', error.message, 'error');
          } else {
            swal('Success', 'Item edited successfully', 'success');
          }
        });
  };

  /** Render the form. Use Uniforms: https://github.com/vazco/uniforms */
    const formSchema = new SimpleSchema2Bridge(schema);
    return (
        <div style={{ paddingBottom: '50px' }}>
          <Container>
            <Col>
              <div className="editFormCol">
                <h2 style={{ textAlign: 'center' }}>Edit Skill</h2>
              </div>
              <AutoForm schema={formSchema} onSubmit={data => submit(data)} model={doc}
                        style={{
                          paddingBottom: '4rem',
                        }}>
                <Card style={{
                  borderRadius: '1rem',
                  backgroundColor: '#E5F0FE',
                }} className={'teamCreate'}>
                  <Container>
                    <Col style={{ paddingLeft: '3rem', paddingRight: '3rem' }}>
                      <TextField name='name' id={COMPONENT_IDS.EDIT_SKILL_NAME} required/>
                      <LongTextField name='description' id={COMPONENT_IDS.EDIT_SKILL_DESCRIPTION} required/>
                    </Col>
                  </Container>
                  <div style={{ textAlign: 'center' }}>
                    <SubmitField value='Submit' id={COMPONENT_IDS.EDIT_SKILL_SUBMIT}/>
                  </div>
                  <ErrorsField/>
                </Card>
              </AutoForm>
            </Col>
          </Container>
        </div>
    );
};

EditSkillWidget.propTypes = {
  doc: PropTypes.object,
  model: PropTypes.object,
};

const EditSkillCon = withTracker(({ match }) => {
  // Get the documentID from the URL field. See imports/ui/layouts/App.jsx for the route containing :_id.
  const documentId = match.params._id;
  // Get access to Stuff documents.
  return {
    doc: Skills.findOne(documentId),
  };
})(EditSkillWidget);

export default withRouter(EditSkillCon);
