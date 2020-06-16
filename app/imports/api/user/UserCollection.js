import { Accounts } from 'meteor/accounts-base';
import { Roles } from 'meteor/alanning:roles';
import { Meteor } from 'meteor/meteor';
import { _ } from 'lodash';
import { Developers } from './DeveloperCollection';
import { Administrators } from './AdministratorCollection';

const xkpasswd = require('xkpasswd');

const generatePassword = () => xkpasswd();

class UserCollection {
  constructor() {
    this._collectionName = 'UserCollection';
  }

  define({ username, role }) {
    const password = generatePassword();
    console.log(`Defining user ${username} with password ${password}`);
    const userID = Accounts.createUser({ username, email: username, password });
    Roles.createRole(role, { unlessExists: true });
    Roles.addUsersToRoles(userID, [role]);
    return { userID, password };
  }

  /**
   * Returns the profile document associated with user, or null if not found.
   * Assumes that the user is defined. If not, throws an error.
   * @param user The username or userID.
   * @returns { Object | Null } The profile document or null if not found.
   */
  hasProfile(user) {
    const userID = this.getID(user);
    return Developers.hasProfile(userID) || Administrators.hasProfile(userID);
  }

  getProfile(user) {
    // First, let's check to see if user is actually a profile (or looks like one). If so, just return it.
    if (_.isObject(user) && _.has(user, 'firstName') && _.has(user, 'lastName') && _.has(user, 'role')) {
      return user;
    }
    const profile = this.hasProfile(user);
    if (!profile) {
      console.log(`No profile found for user ${user}`);
      throw new Meteor.Error(`No profile found for user ${user}`);
    }
    return profile;

  }
}

export const Users = new UserCollection();
