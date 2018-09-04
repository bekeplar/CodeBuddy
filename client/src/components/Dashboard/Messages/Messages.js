import React, { Component } from 'react';
import axios from 'axios';
import moment from 'moment';
import PropTypes from 'prop-types';
import MessageReply from './MessageReply';

const MessageContext = React.createContext('no default');

export const MessageConsumer = props => (
  <MessageContext.Consumer {...props}>
    {(context) => {
      if (!context) {
        throw new Error(
          'Message compound components cannot be rendered outside the Message component',
        );
      }
      return props.children(context);
    }}
  </MessageContext.Consumer>
);

const Message = ({
  msg, toggle, i, activeMessage,
}) => (
  <div onClick={() => toggle(i)} className={`message active-${i === activeMessage}`}>
    <div className="message-info">
      <img src={msg.author.img} alt="" />
    </div>
    <div className="post-content">
      <div className="post-info">
        <p id="user-msg">
          {msg.author.firstName}
          {' '}
          {msg.author.lastName}
        </p>
        <p id="user-msg-time">{moment(msg.author.date).fromNow()}</p>
      </div>
      <p id="msg">{msg.body}</p>
    </div>
  </div>
);

const MessagesOverview = () => (
  <MessageConsumer>
    {({ activeMessage, toggle, messages }) => (
      messages.length ? (
        <div className="overview messages">
          {Object.values(messages).map((msg, i) => (
            <Message
              activeMessage={activeMessage}
              toggle={toggle}
              msg={msg}
              i={i}
            />
          ))}
        </div>
      )
        : <div />
    )}
  </MessageConsumer>
);


class AllMessages extends Component {
  state = { activeMessage: 0 };

  changeActiveMessage = (val) => {
    this.setState({ activeMessage: val });
  };

  onSubmit = (values) => {
    const { messages, currentUser } = this.props;
    const { activeMessage } = this.state;
    const user = Object.values(messages)[activeMessage].author;
    axios.post('/api/add_message', { values, user, currentUser });
  };

  render() {
    const { messages } = this.props;
    const { activeMessage } = this.state;
    return (
      <div className="messages-wrapper">
        <MessageContext.Provider
          value={{ activeMessage, messages, toggle: this.changeActiveMessage }}
        >
          <MessagesOverview />
          <MessageReply onSubmit={this.onSubmit} />
        </MessageContext.Provider>
      </div>
    );
  }
}

AllMessages.propTypes = {
  messages: PropTypes.arrayOf(
    PropTypes.shape({
      author: PropTypes.shape({
        firstName: PropTypes.string.isRequired,
        lastName: PropTypes.string.isRequired,
        img: PropTypes.string.isRequired,
      }).isRequired,
      body: PropTypes.string.isRequired,
      // eslint-disable-next-line comma-dangle
    })
  ).isRequired,
  currentUser: PropTypes.number.isRequired,
};

Message.propTypes = {
  msg: PropTypes.arrayOf(
    PropTypes.shape({
      author: PropTypes.shape({
        firstName: PropTypes.string.isRequired,
        lastName: PropTypes.string.isRequired,
        img: PropTypes.string.isRequired,
      }).isRequired,
      body: PropTypes.string.isRequired,
      // eslint-disable-next-line comma-dangle
    })
  ).isRequired,
  toggle: PropTypes.func.isRequired,
  i: PropTypes.number.isRequired,
  activeMessage: PropTypes.number.isRequired,
};

export default AllMessages;
