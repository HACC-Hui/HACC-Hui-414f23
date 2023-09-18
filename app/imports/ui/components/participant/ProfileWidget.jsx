import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { withRouter, Link } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
import { Button, Container, Header, Segment } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { Participants } from '../../../api/user/ParticipantCollection';
import { Challenges } from '../../../api/challenge/ChallengeCollection';
import { ParticipantChallenges } from '../../../api/user/ParticipantChallengeCollection';
import { ParticipantSkills } from '../../../api/user/ParticipantSkillCollection';
import { ParticipantTools } from '../../../api/user/ParticipantToolCollection';
import { paleBlueStyle } from '../../styles';
import ProfileCard from './ProfileCard';
import { ROUTES } from '../../../startup/client/route-constants';
import TeamMembershipWidget from './TeamMembershipWidget';

const EditProfileWidget = ({ participant, devChallenges, devSkills, devTools }) => {
  const model = participant;
  model.challenges = devChallenges.map(challenge => {
    const c = Challenges.findDoc(challenge.challengeID);
    return c.title;
  });
  model.skills = devSkills;
  model.tools = devTools;
  return (
    <div style={{ paddingBottom: '50px', paddingTop: '40px' }}><Container>
      <Segment style={paleBlueStyle}>
        <Header as="h2" textAlign="center">Your Profile</Header>
        <ProfileCard model={model} />
        <Button color="olive"><Link to={ROUTES.EDIT_PROFILE}>Edit Profile</Link></Button>
      </Segment>
      <Segment style={paleBlueStyle}>
        <Header as="h2" textAlign="center">Team Membership</Header>
        <TeamMembershipWidget />
      </Segment>
    </Container>
    </div>
  );
};

EditProfileWidget.propTypes = {
  participant: PropTypes.object.isRequired,
  devChallenges: PropTypes.arrayOf(
    PropTypes.object,
  ),
  devSkills: PropTypes.arrayOf(
    PropTypes.object,
  ),
  devTools: PropTypes.arrayOf(
    PropTypes.object,
  ),
};

const EditProfileWidgetCon = withTracker(() => {
  const participant = Participants.findDoc({ userID: Meteor.userId() });
  const participantID = participant._id;
  const devChallenges = ParticipantChallenges.find({ participantID }).fetch();
  const devSkills = ParticipantSkills.find({ participantID }).fetch();
  const devTools = ParticipantTools.find({ participantID }).fetch();
  return {
    participant,
    devChallenges,
    devSkills,
    devTools,
  };
})(EditProfileWidget);

export default withRouter(EditProfileWidgetCon);
