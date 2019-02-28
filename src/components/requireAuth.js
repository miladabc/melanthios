import React, { Component } from 'react';
import { connect } from 'react-redux';

export default ChildComponent => {
  class ComposedComponent extends Component {
    // Our component just got rendered
    componentDidMount() {
      this.shouldNavigateAway();
    }
    // Our component just got updated
    componentDidUpdate() {
      this.shouldNavigateAway();
    }
    shouldNavigateAway() {
      if (!this.props.user) {
        this.props.history.push('/');
      }
    }
    render() {
      if (this.props.user) return <ChildComponent {...this.props} />;
      return null;
    }
  }
  const mapStateToProps = state => ({ user: state.auth.user });

  return connect(mapStateToProps)(ComposedComponent);
};
