import React, { Component } from "react";
import html from "react-inner-html";
import defaults from "defaults";

import PropTypes from "prop-types";

const sourceStyles = {
  lineHeight: "21px",
};

const types = {
  content: PropTypes.node,
  style: PropTypes.object,
  className: PropTypes.string,
  dangerMode: PropTypes.bool,
};

export default class TerminalMessage extends Component {
  static propTypes = types;
  render() {
    const { content, style, className } = this.props;
    const styles = {
      message: defaults(style, sourceStyles),
    };
    return <div className={className} style={styles.message} {...html(content)} />;
  }
}
