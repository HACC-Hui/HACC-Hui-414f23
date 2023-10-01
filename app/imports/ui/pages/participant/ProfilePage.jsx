import React from 'react';

import withAllSubscriptions from '../../layouts/AllSubscriptionsHOC';
import ProfileWidget from '../../components/participant/Profile';

class ProfilePage extends React.Component {
  render() {
    return (
      <div id={'profile-page'}>
        <ProfileWidget />
      </div>
    );
  }
}

export default withAllSubscriptions(ProfilePage);
