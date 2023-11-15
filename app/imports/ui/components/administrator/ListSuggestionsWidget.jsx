import React from 'react';
import {
  Grid,
  Header,
  Item,
  Icon,
  Segment,
  Input,
  Dropdown,
} from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { _ } from 'lodash';
import { withTracker } from 'meteor/react-meteor-data';
import { Suggestions } from '../../../api/suggestions/SuggestionCollection';
import ListSuggestionsCard from './ListSuggestionsCard';
import ListSuggestionsFilter from './ListSuggestionsFilter';
import { PAGE_IDS } from '../../testIDs/pageIDs';

class ListSuggestionsWidget extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      search: '',
      type: [],
      result: _.orderBy(this.props.suggestions, ['name'], ['asc']),
    };
  }

  componentWillReceiveProps(nextProps) {
    // eslint-disable-next-line max-len
    if ((_.orderBy(nextProps.suggestions, ['name'], ['asc'])) !== (_.orderBy(this.props.suggestions, ['name'], ['asc']))) {
      this.setState({
        result: _.orderBy(nextProps.suggestions, ['name'], ['asc']),
      });
    }
  }

  render() {

    // eslint-disable-next-line no-unused-vars
    const sortBy = [
      { key: 'teams', text: 'teams', value: 'teams' },
      { key: 'challenges', text: 'challenges', value: 'challenges' },
      { key: 'skills', text: 'skills', value: 'skills' },
      { key: 'tools', text: 'tools', value: 'tools' },
    ];

    const sticky = {
      position: 'sticky',
      top: '6.5rem',
    };

    const filters = new ListSuggestionsFilter();

    const setFilters = () => {
      const searchResults = filters.filterBySearch(this.props.suggestions, this.state.search);
      const typeResults = filters.typeResults(searchResults, this.state.type);
      const sorted = filters.sortBy(typeResults, 'names');
      this.setState({
        result: sorted,
      }, () => {
      });
    };

    const handleSearchChange = (event) => {
      this.setState({
        search: event.target.value,
      }, () => {
        setFilters();
      });
    };

    const getType = (event, { value }) => {
      this.setState({
        type: value,
      }, () => {
        setFilters();
      });
    };

    const typeOptions = [
      {
        key: 'All',
        text: 'All',
        value: 'All',
      },
      {
        key: 'Tool',
        text: 'Tool',
        value: 'Tool',
      },
      {
        key: 'Skill',
        text: 'Skill',
        value: 'Skill',
      },
    ];

    // console.log(this.props.suggestions);

    return (
        <Grid container doubling relaxed stackable
              style={{ paddingBottom: '4rem' }}
              id={PAGE_IDS.LIST_SUGGESTIONS_ADMIN}
        >
          <Grid.Row centered>
            <Header as={'h2'} style={{ paddingTop: '2rem' }}>
              Suggestions
            </Header>
          </Grid.Row>
          <Grid.Column width={4}>
            <Segment style={sticky}>
              <div style={{ paddingTop: '2rem' }}>
                <Header>
                  <Header.Content>
                    Total Suggestions: {this.state.result.length}
                  </Header.Content>
                </Header>
              </div>
              <div style={{ paddingTop: '2rem' }}>
                <Input icon='search'
                       iconPosition='left'
                       placeholder='Search...'
                       onChange={handleSearchChange}
                       fluid
                />

                <div style={{ paddingTop: '2rem' }}>
                  <Header>Suggestion Types</Header>
                  <Dropdown
                      placeholder='Types'
                      fluid
                      search
                      selection
                      options={typeOptions}
                      defaultValue='All'
                      onChange={getType}
                  />
                </div>
              </div>
            </Segment>
          </Grid.Column>
          <Grid.Column width={12}>
            {
              (this.props.suggestions.length === 0) ? (
                  <div style={{ textAlign: 'center' }}>
                    <Header as='h2' icon>
                      <Icon name='users'/>
                      There are no suggestions at the moment.
                      <Header.Subheader>
                        Please check back later.
                      </Header.Subheader>
                    </Header>
                  </div>
              ) : (
                  <Item.Group className="d-flex flex-wrap">
                    {this.state.result.map((suggestions) => (
                        <div key={suggestions._id} className="col-4 mb-3">
                          <ListSuggestionsCard
                              type={suggestions.type}
                              username={suggestions.username}
                              name={suggestions.name}
                              description={suggestions.description}
                              suggestionObj={suggestions}
                          />
                        </div>
                    ))}
                  </Item.Group>
              )}
          </Grid.Column>
        </Grid>
    );
  }
}

ListSuggestionsWidget.propTypes = {
  suggestions: PropTypes.array.isRequired,
};

export default withTracker(() => ({
  suggestions: Suggestions.find({}).fetch(),
}))(ListSuggestionsWidget);
